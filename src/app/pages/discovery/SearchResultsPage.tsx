import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router"
import { FilterModal } from "@/app/components/discovery/FilterModal"
import { RestaurantCard } from "@/app/components/discovery/RestaurantCard"
import { DishCard } from "@/app/components/discovery/DishCard"
import { ContentState } from "@/app/components/feedback/ContentState"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs"
import { allRestaurants, discoveryDishes } from "@/app/lib/catalog"
import { filterRecords, readCriteria, resetFilters } from "@/app/lib/discovery"

export function SearchResultsPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [filterOpen, setFilterOpen] = useState(false)
  useEffect(() => setQuery(params.get("q") ?? ""), [params])
  const tab = params.get("tab") === "restaurants" ? "restaurants" : "dishes"
  const criteria = readCriteria(params)
  const dishes = filterRecords(discoveryDishes, criteria)
  const restaurants = filterRecords(allRestaurants, criteria)
  const count = tab === "dishes" ? dishes.length : restaurants.length
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }
  return (
    <div>
      <Link to="/" className="underline">
        Về trang chủ
      </Link>
      <div className="page-heading">
        <div>
          <h1>Tìm món ăn và quán ăn</h1>
          <p>
            Tìm trong dữ liệu mẫu, không phải danh sách trực tiếp theo vị trí
            thiết bị.
          </p>
        </div>
      </div>
      <form
        className="search-form"
        role="search"
        aria-label="Tìm trong kết quả khám phá"
        onSubmit={(event) => {
          event.preventDefault()
          update("q", query.trim())
        }}
      >
        <label>
          <span className="sr-only">Từ khóa tìm kiếm</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm món ăn, quán ăn…"
          />
        </label>
        <Button type="submit">Tìm kiếm</Button>
        <Button
          variant="outline"
          type="button"
          onClick={(event) => {
            event.currentTarget.focus()
            setFilterOpen(true)
          }}
        >
          Bộ lọc
        </Button>
      </form>
      <div className="search-toolbar">
        <label className="flex flex-wrap items-center gap-2 min-w-0">
          Sắp xếp
          <select
            value={params.get("sort") ?? ""}
            onChange={(event) => update("sort", event.target.value)}
            className="px-3"
          >
            <option value="">Theo dữ liệu gốc</option>
            <option value="rating">Đánh giá cao</option>
            <option value="price">Giá tăng dần</option>
            <option value="distance">Khoảng cách mẫu</option>
          </select>
        </label>
        {criteria.category && (
          <Button
            variant="outline"
            onClick={() => update("category", "")}
            aria-label={`Bỏ danh mục ${criteria.category}`}
          >
            {criteria.category} · Bỏ chọn
          </Button>
        )}
        {["price", "distance", "types"]
          .filter((key) => params.has(key))
          .map((key) => (
            <Button key={key} variant="outline" onClick={() => update(key, "")}>
              {key === "price"
                ? "Giá"
                : key === "distance"
                  ? "Khoảng cách"
                  : "Loại món"}
              : {params.get(key)} · Bỏ
            </Button>
          ))}
        {(params.has("price") ||
          params.has("distance") ||
          params.has("types")) && (
          <Button
            variant="ghost"
            onClick={() => setParams(resetFilters(params))}
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>
      {params.has("cuisines") && (
        <p className="unavailable-note">
          Điều kiện quốc gia từ liên kết chưa khả dụng; kết quả không được lọc
          theo điều kiện này.
        </p>
      )}
      <div className="search-layout">
        <div className="desktop-filters">
          <FilterModal inline isOpen onClose={() => {}} />
        </div>
        <section>
          <Tabs value={tab} onValueChange={(value) => update("tab", value)}>
            <TabsList className="min-h-12">
              <TabsTrigger value="dishes">Món ăn</TabsTrigger>
              <TabsTrigger value="restaurants">Quán ăn</TabsTrigger>
            </TabsList>
            <p className="my-4 text-sm" aria-live="polite">
              {count} kết quả{criteria.q ? ` cho “${criteria.q}”` : ""}
            </p>
            {count === 0 && (
              <ContentState title="Không có kết quả phù hợp">
                <p>
                  Hãy sửa từ khóa hoặc bỏ bớt điều kiện hiện tại. Không có kết
                  quả không có nghĩa là lỗi tải.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setParams({ tab })}
                >
                  Xóa điều kiện tìm kiếm
                </Button>
              </ContentState>
            )}
            <TabsContent value="dishes">
              <div className="discovery-grid">
                {dishes.map((dish) => (
                  <DishCard key={dish.href} dish={dish} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="restaurants">
              <div className="discovery-grid">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
