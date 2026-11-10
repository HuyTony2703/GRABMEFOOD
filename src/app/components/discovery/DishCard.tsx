import { Link, useLocation } from "react-router"
import { Star } from "lucide-react"
import { ContentImage } from "@/app/components/media/ContentImage"
import { formatPriceRange } from "@/app/lib/discovery"
export interface DishCardRecord {
  id: string
  name: string
  image?: string
  price?: string
  rating?: number
  reviews?: number
  href: string
  restaurantName?: string
}
export function DishCard({ dish }: { dish: DishCardRecord }) {
  const location = useLocation()
  return (
    <Link
      to={dish.href}
      state={{ returnTo: location.pathname + location.search }}
      className="discovery-card"
    >
      <ContentImage src={dish.image} alt={dish.name} />
      <div className="card-copy">
        <h3>{dish.name}</h3>
        <p className="card-price">{formatPriceRange(dish.price)}</p>
        <div className="card-metadata">
          {dish.rating != null && (
            <span>
              <Star size={16} aria-hidden="true" />
              {dish.rating}/5
            </span>
          )}
          {dish.reviews != null && (
            <span>{dish.reviews.toLocaleString("vi-VN")} đánh giá</span>
          )}
        </div>
        {dish.restaurantName && (
          <p className="text-sm">{dish.restaurantName}</p>
        )}
      </div>
    </Link>
  )
}
