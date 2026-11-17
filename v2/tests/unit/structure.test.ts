import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
type Manifest = { name: string; scripts?: Record<string, string>; dependencies?: Record<string, string> };

describe('independent scaffold boundaries', () => {
  test.each(['apps/gateway', 'services/catalog', 'services/community', 'services/notification'])(
    '%s has independent build/start and no business/bootstrap side effects', directory => {
      const manifest = JSON.parse(read(`${directory}/package.json`)) as Manifest;
      expect(manifest.scripts?.build).toContain('tsc');
      expect(manifest.scripts?.start).toBe('node dist/main.js');
      expect(Object.keys(manifest.dependencies ?? {})).not.toEqual(expect.arrayContaining(['pg', '@supabase/supabase-js']));
      const source = read(`${directory}/src/main.ts`);
      expect(source).toContain("NestFactory.create");
      expect(source).toContain("readConfig(service)");
      expect(source).toContain("enableShutdownHooks(['SIGINT', 'SIGTERM'])");
      expect(source).toContain('@HttpCode(503)');
      expect(source).not.toMatch(/from ['"].*(?:src\/app|community\/src|catalog\/src|notification\/src)/);
      expect(source).not.toMatch(/supabase\s+(?:start|db)|(?:migrate|seed|reset)\(/);
    },
  );
  test('shared packages contain no domain/database runtime dependency', () => {
    for (const directory of ['packages/contracts', 'packages/config']) {
      const manifest = JSON.parse(read(`${directory}/package.json`)) as Manifest;
      for (const name of Object.keys(manifest.dependencies ?? {})) {
        expect(['@grabmefood/contracts', 'zod']).toContain(name);
      }
    }
  });
  test('Web diagnostic routes cannot execute business writes or browser Auth SDK', () => {
    for (const type of ['live', 'ready']) {
      const source = read(`apps/web/src/app/api/health/${type}/route.ts`);
      expect(source).toContain('export function GET()');
      expect(source).not.toMatch(/supabase|DATABASE_URL|export function (?:POST|PUT|PATCH|DELETE)/);
    }
    expect(read('apps/web/src/app/page.tsx')).not.toMatch(/localStorage|<form|<button|<input|src\/app\/lib/);
  });
});
