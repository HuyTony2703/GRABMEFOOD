import { Star, MapPin } from "lucide-react";
import { Link } from "react-router";
import { Restaurant } from "../data/restaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="flex-shrink-0 w-[160px] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-[120px]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.onSale && restaurant.discount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
            {restaurant.discount}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm truncate mb-1">{restaurant.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs">
            {restaurant.rating}
          </span>
          <span className="text-xs text-gray-400">
            ({restaurant.reviews}+)
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{restaurant.distance}</span>
          </div>
          <span className="text-red-600">{restaurant.price}</span>
        </div>
      </div>
    </Link>
  );
}
