import { Link, Navigate, useLocation, useParams } from "react-router"
import { ContentState } from "@/app/components/feedback/ContentState"
import { resolveLegacyDishId } from "@/app/lib/catalog"

export function LegacyDishPage() {
  const { id } = useParams()
  const location = useLocation()
  const result = resolveLegacyDishId(id)
  if (result.status === "unique")
    return <Navigate replace to={result.dish.href} state={location.state} />
  return (
    <ContentState heading="h1" title="Không xác định được món tại quán">
      <p>
        {result.status === "ambiguous"
          ? "Liên kết cũ khớp nhiều món tại quán. Không tự chọn một quán thay bạn."
          : "Liên kết cũ chưa có quan hệ món–quán hợp lệ trong dữ liệu hiện có."}
      </p>
      <Link className="underline" to="/search">Tìm món tại quán</Link>
    </ContentState>
  )
}
