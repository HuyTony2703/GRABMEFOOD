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
import { RestaurantCard } from "@/app/components/discovery/RestaurantCard"
import { DishCard } from "@/app/components/discovery/DishCard"
import { FilterModal } from "@/app/components/discovery/FilterModal"
import { Button } from "@/app/components/ui/button"
import { nearbyRestaurants, saleRestaurants } from "@/app/data/restaurants"
import { todayDishes, menuDishes } from "@/app/lib/catalog"
import { selectAdditionalMenuDishes } from "@/app/lib/discovery"

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const additionalDishes = selectAdditionalMenuDishes(menuDishes, todayDishes)
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
          onClick={(event) => {
            event.currentTarget.focus()
            setFilterOpen(true)
          }}
        >
          <SlidersHorizontal aria-hidden="true" />
          Bộ lọc
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
        <p className="section-source">
          Dữ liệu minh họa — giá, đánh giá và khoảng cách chưa được xác minh.
        </p>
        <div className="discovery-grid">
          {nearbyRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
      {todayDishes.length > 0 && <section className="discovery-section">
        <div className="section-heading">
          <h2>Món ngon hôm nay</h2>
          <Link to="/all-restaurants?section=today">Xem thêm món</Link>
        </div>
        <p className="section-source">
          Dữ liệu minh họa — giá và đánh giá chưa được xác minh.
        </p>
        <div className="discovery-grid">
          {todayDishes.map((dish) => (
            <DishCard key={dish.favoriteKey} dish={dish} />
          ))}
        </div>
      </section>}
      {additionalDishes.length > 0 && <section
        className="discovery-section"
        aria-labelledby="menu-dishes-heading"
      >
        <div className="section-heading">
          <h2 id="menu-dishes-heading">Món từ thực đơn quán</h2>
        </div>
        <p className="section-source">
          Dữ liệu minh họa — giá và đánh giá chưa được xác minh.
        </p>
          <div className="discovery-grid">
            {additionalDishes.map((dish) => (
              <DishCard key={dish.href} dish={dish} />
            ))}
          </div>
      </section>}
      <section className="discovery-section">
        <div className="section-heading">
          <h2>Ưu đãi trong dữ liệu mẫu</h2>
          <Link to="/all-restaurants?section=sale">Xem thêm ưu đãi</Link>
        </div>
        <p className="section-source">
          Dữ liệu minh họa — giá, đánh giá và ưu đãi chưa được xác minh.
        </p>
        <div className="discovery-grid">
          {saleRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
