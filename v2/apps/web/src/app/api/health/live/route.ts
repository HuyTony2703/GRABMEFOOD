import { readConfig } from '@grabmefood/config';
import { liveness } from '@grabmefood/contracts';

export const dynamic = 'force-dynamic';
export function GET() {
  readConfig('web');
  return Response.json(liveness('web'), { headers: { 'Cache-Control': 'no-store' } });
}
