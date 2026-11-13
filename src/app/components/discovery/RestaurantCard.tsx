import { Star, MapPin } from "lucide-react"
import { Link, useLocation } from "react-router"
import type { Restaurant } from "@/app/data/restaurants"
import { ContentImage } from "@/app/components/media/ContentImage"
import { cuisineLabel, formatPriceRange } from "@/app/lib/discovery"

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const location = useLocation()
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      state={{ returnTo: location.pathname + location.search }}
      className="discovery-card"
    >
      <ContentImage src={restaurant.image} alt={restaurant.name} />
      <div className="card-copy">
        <h3>{restaurant.name}</h3>
        <p className="card-price">{formatPriceRange(restaurant.price)}</p>
        <div className="card-metadata">
          {restaurant.rating != null && (
            <span>
              <Star size={16} aria-hidden="true" />
              {restaurant.rating}/5
            </span>
          )}
          {restaurant.reviews != null && (
            <span>{restaurant.reviews.toLocaleString("vi-VN")} đánh giá</span>
          )}
        </div>
        {restaurant.cuisine && (
          <p className="text-sm">{cuisineLabel(restaurant.cuisine)}</p>
        )}
        {restaurant.distance && (
          <p className="card-metadata">
            <span>
              <MapPin size={16} aria-hidden="true" />
              {restaurant.distance} · khoảng cách mẫu
            </span>
          </p>
        )}
        {restaurant.onSale && restaurant.discount && (
          <p className="text-sm">Ưu đãi mẫu: {restaurant.discount}</p>
        )}
      </div>
    </Link>
  )
}
