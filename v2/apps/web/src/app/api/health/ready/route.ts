import { readConfig } from '@grabmefood/config';
import { unavailableReadiness } from '@grabmefood/contracts';

export const dynamic = 'force-dynamic';
export function GET() {
  readConfig('web');
  return Response.json(unavailableReadiness('web'), { status: 503, headers: { 'Cache-Control': 'no-store' } });
}
