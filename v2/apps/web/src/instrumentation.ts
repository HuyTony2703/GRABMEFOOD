import { readConfig } from '@grabmefood/config';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') readConfig('web');
}
