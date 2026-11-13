import { Link } from "react-router"
import { ContentImage } from "@/app/components/media/ContentImage"
import { ContentState } from "@/app/components/feedback/ContentState"
import { ReviewDraft } from "@/app/components/details/ReviewDraft"
import { ShareButton } from "@/app/components/details/ShareButton"
import { formatPriceRange } from "@/app/lib/discovery"
import { useFavorites } from "@/app/contexts/FavoritesContext"
import { Button } from "@/app/components/ui/button"
import { BackLink } from "@/app/components/layout/BackLink"
export function RecordDetail({
  record,
  restaurant,
  favoriteId,
}: {
  record: {
    id: string
    name: string
    price: string
    rating?: number
    reviews?: number
    image: string
  }
  restaurant: {
    id: string
    name: string
  }
  favoriteId: string
}) {
  const favorites = useFavorites()
  const key = favoriteId
  return (
    <article>
      <BackLink fallback={`/restaurant/${restaurant.id}`} />
      <div className="detail-grid mt-6">
        <ContentImage src={record.image} alt={record.name} eager />
        <div>
          <div className="page-heading">
            <h1>{record.name}</h1>
            <ShareButton />
          </div>
          <p className="card-price">{formatPriceRange(record.price)}</p>
          <p className="my-3">
            {record.rating != null
              ? `${record.rating}/5`
              : "Chưa có điểm đánh giá"}
            {record.reviews != null
              ? ` · ${record.reviews.toLocaleString("vi-VN")} đánh giá trong dữ liệu mẫu`
              : ""}
          </p>
          <Link className="underline" to={`/restaurant/${restaurant.id}`}>
            Tại {restaurant.name}
          </Link>
          <Button
            className="my-4"
            variant="outline"
            aria-pressed={favorites.has("dish", key)}
            onClick={() => favorites.toggle("dish", key)}
          >
            {favorites.has("dish", key) ? "Bỏ lưu món" : "Lưu món trong phiên"}
          </Button>
          <ContentState title="Thông tin chi tiết chưa đầy đủ">
            <p>
              Chưa có mô tả hoặc thông tin bổ sung được xác minh cho bản ghi
              này. Không suy ra địa chỉ, ưu đãi hay đánh giá chi tiết từ món
              khác.
            </p>
          </ContentState>
        </div>
      </div>
      <ReviewDraft />
    </article>
  )
}
