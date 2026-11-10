import { Link, useRouteError } from "react-router";
import { Home } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="text-2xl mb-4">Không tìm thấy trang</h2>
        <p className="text-gray-600 mb-6">
          {error?.statusText || error?.message || "Trang bạn tìm kiếm không tồn tại"}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
