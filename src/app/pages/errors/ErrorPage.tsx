import { Link, useRouteError } from "react-router"

import { Home } from "lucide-react"

export function ErrorPage() {
  const error = useRouteError() as any

  return (
    <div data-page-error className="bg-background flex items-center justify-center py-12">
      <div className="text-center">
        <h1 className="mb-4">
          {error ? "Không thể hiển thị trang" : "Không tìm thấy trang"}
        </h1>
        <p className="text-foreground mb-6">
          {error?.statusText ||
            error?.message ||
            "Trang bạn tìm kiếm không tồn tại"}
        </p>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
        >
          <Home className="w-5 h-5" />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
