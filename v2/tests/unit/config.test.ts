import { readConfig, ConfigurationError } from '@grabmefood/config';
import { defaultPorts, poolBudgets, serviceNames, unavailableReadiness } from '@grabmefood/contracts';

describe('scaffold configuration safety', () => {
  test.each(serviceNames)('%s has a separate default port and no verified Cloud claim', service => {
    const config = readConfig(service, {});
    expect(config.port).toBe(defaultPorts[service]);
    expect(config.databaseConfigured).toBe(false);
    expect(config.dependencyProbesImplemented).toBe(false);
    expect(unavailableReadiness(service).status).toBe('not-ready');
  });
  test('pool budgets are owner-specific; Web/Gateway have no business pool', () => {
    expect(poolBudgets).toEqual({ catalog: 4, community: 4, notification: 2 });
    expect(() => readConfig('catalog', { DB_POOL_MAX: '5' })).toThrow(ConfigurationError);
    expect(() => readConfig('gateway', { DB_POOL_MAX: '1' })).toThrow(ConfigurationError);
  });
  test.each([
    { PORT: '0' }, { PORT: 'nan' }, { PORT: '70000' },
    { SUPABASE_PROJECT_REF: 'wrong-project' }, { SUPABASE_URL: 'http://elsewhere.test' },
    { NODE_TLS_REJECT_UNAUTHORIZED: '0' }, { DB_TLS_REJECT_UNAUTHORIZED: 'false' },
    { HOST: '0.0.0.0' },
  ])('rejects unsafe config without leaking inputs %j', env => {
    expect(() => readConfig('catalog', env)).toThrow(ConfigurationError);
  });
  test('explicit container bind is required', () => {
    expect(readConfig('catalog', { HOST: '0.0.0.0', CONTAINER_BIND: 'true' }).host).toBe('0.0.0.0');
  });
  test('credentials never appear in config errors or returned/loggable config', () => {
    const inert = 'INERT_CANARY_NOT_A_CREDENTIAL';
    const env = { DATABASE_URL: `postgresql://postgres:${inert}@invalid.test/db`, DATABASE_ROLE: 'postgres' };
    try {
      readConfig('catalog', env);
      throw new Error('expected configuration error');
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(String(error)).not.toContain(inert);
      expect(String(error)).not.toContain('invalid.test');
    }
    const safe = readConfig('catalog', {
      DATABASE_URL: `postgresql://catalog_runtime:${inert}@db.bdhavbwmxbttymerizvx.supabase.co/postgres?sslmode=verify-full`,
      DATABASE_ROLE: 'catalog_runtime', DB_SSL_CA_FILE: 'inert-ca-path.pem',
    });
    expect(safe.databaseConfigured).toBe(true);
    expect(JSON.stringify(safe)).not.toContain(inert);
    expect(JSON.stringify(safe)).not.toContain('supabase.co');
    expect(unavailableReadiness('catalog').checks[0].status).toBe('not-implemented');
  });
  test('Web cannot acquire a database credential', () => {
    expect(() => readConfig('web', {
      DATABASE_URL: 'postgresql://web:INERT@invalid.test/db',
      DATABASE_ROLE: 'web', DB_SSL_CA_FILE: 'inert.pem',
    })).toThrow(ConfigurationError);
  });
  test('rejects an unapproved DB target even when project env and TLS flags look valid', () => {
    expect(() => readConfig('catalog', {
      DATABASE_URL: 'postgresql://catalog_runtime:INERT@db.other-project.supabase.co/postgres?sslmode=verify-full',
      DATABASE_ROLE: 'catalog_runtime', DB_SSL_CA_FILE: 'inert.pem',
    })).toThrow(ConfigurationError);
  });
});
