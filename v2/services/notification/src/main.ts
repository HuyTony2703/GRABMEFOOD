import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { Controller, Get, HttpCode, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigurationError, readConfig } from '@grabmefood/config';
import { liveness, unavailableReadiness } from '@grabmefood/contracts';

const service = 'notification' as const;
const config = readConfig(service);

@Controller('health')
class HealthController {
  @Get('live') live() { return liveness(service); }
  @Get('ready') @HttpCode(503) ready() { return unavailableReadiness(service); }
}
@Module({ controllers: [HealthController] })
class ApplicationModule {}

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { logger: ['error', 'warn'] });
  app.enableCors({ origin: config.webOrigin, credentials: false, methods: ['GET'] });
  app.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const id = randomUUID();
    const start = performance.now();
    res.setHeader('X-Request-Id', id);
    res.setHeader('Cache-Control', 'no-store');
    res.on('finish', () => process.stdout.write(JSON.stringify({
      event: 'request.completed', service, requestId: id, method: req.method,
      statusCode: res.statusCode, durationMs: Math.round(performance.now() - start),
    }) + '\n'));
    next();
  });
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  if (config.nodeEnv === 'test') process.on('message', async message => {
    if (message === 'shutdown') {
      await app.close();
      process.stdout.write(JSON.stringify({ event: 'service.stopped', service }) + '\n');
      if (process.connected) process.disconnect();
    }
  });
  await app.listen(config.port, config.host);
  process.stdout.write(JSON.stringify({ event: 'service.started', service, host: config.host, port: config.port }) + '\n');
}
bootstrap().catch(error => {
  process.stderr.write((error instanceof ConfigurationError ? error.message : 'Service startup failed') + '\n');
  process.exitCode = 1;
});
