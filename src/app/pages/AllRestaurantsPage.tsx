import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { nearbyRestaurants, saleRestaurants } from "../data/restaurants";
import { RestaurantCard } from "../components/RestaurantCard";

export function AllRestaurantsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const section = searchParams.get("section") || "nearby";

  const getTitle = () => {
    switch (section) {
      case "nearby":
        return "Quán gần tôi";
      case "sale":
        return "Giảm giá";
      case "today":
        return "Món ngon hôm nay";
      default:
        return "Tất cả quán ăn";
    }
  };

  const getRestaurants = () => {
    switch (section) {
      case "nearby":
        return nearbyRestaurants;
      case "sale":
        return saleRestaurants;
      case "today":
        return nearbyRestaurants;
      default:
        return [...nearbyRestaurants, ...saleRestaurants];
    }
  };

  const restaurants = getRestaurants();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg flex-1">{getTitle()}</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm text-gray-600 mb-4">
          Tìm thấy {restaurants.length} kết quả
        </p>
        <div className="grid grid-cols-2 gap-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}
