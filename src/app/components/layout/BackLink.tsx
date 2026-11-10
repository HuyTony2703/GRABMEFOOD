import { Link, useLocation } from "react-router"
import type { ReactNode } from "react"
export function BackLink({
  fallback = "/search",
  children = "Quay lại",
}: {
  fallback?: string
  children?: ReactNode
}) {
  const location = useLocation()
  const previous = location.state?.returnTo
  const to =
    typeof previous === "string" &&
    previous.startsWith("/") &&
    !previous.startsWith("//")
      ? previous
      : fallback
  return (
    <Link
      to={to}
      className="underline inline-flex items-center min-h-11 mb-3"
      aria-label="Quay lại danh sách trước"
    >
      {children}
    </Link>
  )
}
