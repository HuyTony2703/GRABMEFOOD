// Transport types only. No ORM, business repository, session authority or credentials.
export const serviceNames = ['web', 'gateway', 'catalog', 'community', 'notification'] as const;
export type ServiceName = typeof serviceNames[number];
export const defaultPorts: Record<ServiceName, number> = {
  web: 3000, gateway: 3001, catalog: 3002, community: 3003, notification: 3004,
};
export const cloudProjectRef = 'bdhavbwmxbttymerizvx';
export const poolBudgets = { catalog: 4, community: 4, notification: 2 } as const;

export function liveness(service: ServiceName) {
  return { service, status: 'alive' as const, scope: 'scaffold' as const };
}

export function unavailableReadiness(service: ServiceName) {
  return {
    service,
    status: 'not-ready' as const,
    scope: 'scaffold' as const,
    checks: [{ dependency: 'business-runtime', status: 'not-implemented' as const }],
    message: 'Khung kỹ thuật đang chạy; chưa có kết quả kiểm chứng dependencies nghiệp vụ/Cloud.',
  };
}
