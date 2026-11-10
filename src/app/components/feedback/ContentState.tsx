import type { ReactNode } from "react"
export function ContentState({
  title,
  children,
  heading: Heading = "h2",
}: {
  title: string
  children?: ReactNode
  heading?: "h1" | "h2"
}) {
  return (
    <section className="content-state">
      <Heading>{title}</Heading>
      {children && <div>{children}</div>}
    </section>
  )
}
export function UnavailableNote({
  children = "Chức năng này chưa được kết nối dịch vụ. Hiện chưa thể gửi hoặc đồng bộ dữ liệu.",
}: {
  children?: ReactNode
}) {
  return (
    <p className="unavailable-note" role="note">
      {children}
    </p>
  )
}
