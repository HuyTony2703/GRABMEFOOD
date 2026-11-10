import {
  Coffee,
  Soup,
  Beef,
  Flame,
  IceCream,
  Salad,
  Bell,
  SlidersHorizontal,
} from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { BottomNav } from "@/app/components/layout/BottomNav"
import { RestaurantCard } from "@/app/components/discovery/RestaurantCard"
import { DishCard } from "@/app/components/discovery/DishCard"
import { FilterModal } from "@/app/components/discovery/FilterModal"
import { Button } from "@/app/components/ui/button"
import { nearbyRestaurants, saleRestaurants } from "@/app/data/restaurants"
import { todayDishes } from "@/app/lib/catalog"

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const categories = [
    { icon: Coffee, label: "Cà phê" },
    { icon: Soup, label: "Phở" },
    { icon: Beef, label: "Món thịt" },
    { icon: Flame, label: "Món nướng" },
    { icon: IceCream, label: "Kem" },
    { icon: Salad, label: "Rau xanh" },
  ]
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Khám phá món ăn và quán ăn</h1>
          <p>Chọn món, xem giá và tìm hiểu quán từ dữ liệu hiện có.</p>
        </div>
        <Button asChild variant="outline" size="icon">
          <Link to="/notifications" aria-label="Thông báo">
            <Bell aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <form
        className="search-form"
        role="search"
        aria-label="Tìm kiếm từ trang chủ"
        onSubmit={(event) => {
          event.preventDefault()
          navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }}
      >
        <label>
          <span className="sr-only">Tìm món ăn, quán ăn</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm món ăn, quán ăn…"
          />
        </label>
        <Button type="submit">Tìm kiếm</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilterOpen(true)}
        >
          <SlidersHorizontal aria-hidden="true" />
          <span className="hidden sm:inline">Bộ lọc</span>
          <span className="sr-only sm:hidden">Bộ lọc</span>
        </Button>
      </form>
      <div className="category-list my-6" aria-label="Danh mục món">
        {categories.map(({ icon: Icon, label }) => (
          <Link
            className="category-link"
            key={label}
            to={`/search?category=${encodeURIComponent(label)}`}
          >
            <Icon size={20} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
      <section className="discovery-section">
        <div className="section-heading">
          <h2>Quán trong khu vực mẫu</h2>
          <Link to="/all-restaurants?section=nearby">Xem thêm quán</Link>
        </div>
        <div className="discovery-grid">
          {nearbyRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
      <section className="discovery-section">
        <div className="section-heading">
          <h2>Món ngon hôm nay</h2>
          <Link to="/all-restaurants?section=today">Xem thêm món</Link>
        </div>
        <div className="discovery-grid">
          {todayDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>
      <section className="discovery-section">
        <div className="section-heading">
          <h2>Ưu đãi trong dữ liệu mẫu</h2>
          <Link to="/all-restaurants?section=sale">Xem thêm ưu đãi</Link>
        </div>
        <div className="discovery-grid">
          {saleRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      <BottomNav />
    </div>
  )
}
