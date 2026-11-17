import type { ReactNode } from 'react';
export const metadata = { title: 'GrabMeFood V2 — khung kỹ thuật', robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
