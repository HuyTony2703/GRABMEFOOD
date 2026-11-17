import { z } from 'zod';
import { cloudProjectRef, defaultPorts, poolBudgets, type ServiceName } from '@grabmefood/contracts';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.enum(['127.0.0.1', '0.0.0.0']).default('127.0.0.1'),
  CONTAINER_BIND: z.enum(['true', 'false']).default('false'),
  PORT: z.coerce.number().int().min(1024).max(65535).optional(),
  WEB_ORIGIN: z.literal('http://localhost:3000').default('http://localhost:3000'),
  SUPABASE_PROJECT_REF: z.literal(cloudProjectRef).default(cloudProjectRef),
  SUPABASE_URL: z.literal(`https://${cloudProjectRef}.supabase.co`).optional(),
  DATABASE_URL: z.string().optional(),
  DATABASE_ROLE: z.string().regex(/^[a-z][a-z0-9_]*$/).optional(),
  DB_POOL_MAX: z.coerce.number().int().positive().optional(),
  DB_SSL_CA_FILE: z.string().min(1).optional(),
  NODE_TLS_REJECT_UNAUTHORIZED: z.literal('1').optional(),
  DB_TLS_REJECT_UNAUTHORIZED: z.literal('true').optional(),
});

export class ConfigurationError extends Error {
  constructor(fields: string[]) {
    super(`Invalid configuration fields: ${[...new Set(fields)].sort().join(', ')}`);
    this.name = 'ConfigurationError';
  }
}

export function readConfig(service: ServiceName, env: NodeJS.ProcessEnv = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) throw new ConfigurationError(parsed.error.issues.map(i => i.path.join('.')));
  const value = parsed.data;
  const errors: string[] = [];
  const budget = service in poolBudgets ? poolBudgets[service as keyof typeof poolBudgets] : 0;
  if (value.HOST === '0.0.0.0' && value.CONTAINER_BIND !== 'true') errors.push('CONTAINER_BIND');
  if (value.DB_POOL_MAX !== undefined && value.DB_POOL_MAX !== budget) errors.push('DB_POOL_MAX');
  if (value.DATABASE_URL !== undefined) {
    if (budget === 0) errors.push('DATABASE_URL');
    if (!value.DATABASE_ROLE || /^(postgres|service_role|anon|authenticated|supabase_admin)$/i.test(value.DATABASE_ROLE)) {
      errors.push('DATABASE_ROLE');
    }
    if (!value.DB_SSL_CA_FILE) errors.push('DB_SSL_CA_FILE');
    try {
      const url = new URL(value.DATABASE_URL);
      if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.username) errors.push('DATABASE_URL');
      // Only owner-supplied direct Connect metadata is approved so far.
      // Session pooler must not be guessed from the project ref.
      if (url.hostname !== `db.${cloudProjectRef}.supabase.co`) errors.push('DATABASE_URL');
      if (decodeURIComponent(url.username) !== value.DATABASE_ROLE) errors.push('DATABASE_ROLE');
      if (/^(postgres|service_role|anon|authenticated|supabase_admin)(\.|$)/i.test(decodeURIComponent(url.username))) {
        errors.push('DATABASE_ROLE');
      }
      if (url.searchParams.has('sslmode') && url.searchParams.get('sslmode') !== 'verify-full') errors.push('DATABASE_URL');
      if (url.searchParams.has('ssl')) errors.push('DATABASE_URL');
    } catch {
      errors.push('DATABASE_URL');
    }
  }
  if (errors.length) throw new ConfigurationError(errors);
  // Deliberately do not return URLs, passwords, tokens or arbitrary environment entries.
  return Object.freeze({
    service, nodeEnv: value.NODE_ENV, host: value.HOST,
    port: value.PORT ?? defaultPorts[service], webOrigin: value.WEB_ORIGIN,
    projectRef: value.SUPABASE_PROJECT_REF, poolMax: budget,
    databaseConfigured: value.DATABASE_URL !== undefined,
    dependencyProbesImplemented: false as const,
  });
}

export type ServiceConfig = ReturnType<typeof readConfig>;
