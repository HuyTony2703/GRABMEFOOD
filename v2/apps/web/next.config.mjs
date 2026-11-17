import { fileURLToPath } from 'node:url';

export default {
  output: 'standalone',
  outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
  poweredByHeader: false,
  images: { unoptimized: true },
  // Technical demo build only: one page-generation worker, not a product UI decision.
  experimental: { cpus: 1 },
};
