import { Link, useSearchParams } from "react-router"
import { nearbyRestaurants, saleRestaurants } from "@/app/data/restaurants"
import { todayDishes } from "@/app/lib/catalog"
import { RestaurantCard } from "@/app/components/discovery/RestaurantCard"
import { DishCard } from "@/app/components/discovery/DishCard"
import { ContentState } from "@/app/components/feedback/ContentState"
export function AllRestaurantsPage() {
  const [params] = useSearchParams()
  const section = params.get("section")
  const today = section === "today"
  const restaurants =
    section === "nearby"
      ? nearbyRestaurants
      : section === "sale"
        ? saleRestaurants
        : [...nearbyRestaurants, ...saleRestaurants]
  return (
    <div>
      <Link to="/" className="underline">
        Về trang chủ
      </Link>
      <div className="page-heading">
        <div>
          <h1>
            {today
              ? "Món ngon hôm nay"
              : section === "sale"
                ? "Ưu đãi trong dữ liệu mẫu"
                : "Quán ăn trong khu vực mẫu"}
          </h1>
          <p>{today ? todayDishes.length : restaurants.length} kết quả</p>
        </div>
      </div>
      {today && !todayDishes.length && (
        <ContentState title="Chưa có món hôm nay liên kết với quán">
          <p>Dữ liệu hiện có chưa xác định được món hôm nay tại quán cụ thể.</p>
          <Link className="underline" to="/search">Khám phá món tại quán</Link>
        </ContentState>
      )}
      <div className="discovery-grid">
        {today
          ? todayDishes.map((dish) => <DishCard key={dish.favoriteKey} dish={dish} />)
          : restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
      </div>
    </div>
  )
}
