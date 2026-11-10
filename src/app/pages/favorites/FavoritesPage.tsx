import { useState } from "react"
import { Link } from "react-router"
import { BottomNav } from "@/app/components/layout/BottomNav"
import { useFavorites } from "@/app/contexts/FavoritesContext"
import { RestaurantCard } from "@/app/components/discovery/RestaurantCard"
import { DishCard } from "@/app/components/discovery/DishCard"
import { ContentState } from "@/app/components/feedback/ContentState"
import { ConfirmDialog } from "@/app/components/feedback/ConfirmDialog"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs"
import { allRestaurants, favoriteDishChoices } from "@/app/lib/catalog"

export function FavoritesPage() {
  const favorites = useFavorites()
  const [tab, setTab] = useState<"dish" | "restaurant">("dish")
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [confirm, setConfirm] = useState(false)
  const dishes = favoriteDishChoices.filter((dish) =>
    favorites.has("dish", dish.id),
  )
  const restaurants = allRestaurants.filter((restaurant) =>
    favorites.has("restaurant", restaurant.id),
  )
  const list = tab === "dish" ? dishes : restaurants
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Yêu thích</h1>
          <p>
            Danh sách mẫu được giữ trong phiên sử dụng hiện tại, chưa đồng bộ
            tài khoản.
          </p>
        </div>
      </div>
      <div className="search-toolbar">
        <Link to="/search" className="underline">
          Tìm kiếm và lọc trên toàn bộ dữ liệu
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            setEditing(!editing)
            setSelected([])
          }}
        >
          {editing ? "Xong" : "Chỉnh sửa danh sách"}
        </Button>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value as "dish" | "restaurant")
          setSelected([])
          setEditing(false)
          setConfirm(false)
        }}
      >
        <TabsList className="min-h-12">
          <TabsTrigger value="dish">Món ăn ({dishes.length})</TabsTrigger>
          <TabsTrigger value="restaurant">
            Quán ăn ({restaurants.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          {editing && (
            <div className="search-toolbar">
              <Button
                variant="outline"
                onClick={() => setSelected(list.map((item) => item.id))}
              >
                Chọn tất cả
              </Button>
              <Button variant="ghost" onClick={() => setSelected([])}>
                Bỏ chọn tất cả
              </Button>
              <Button
                disabled={!selected.length}
                onClick={() => setConfirm(true)}
              >
                Xóa {selected.length} mục đã chọn
              </Button>
            </div>
          )}
          {!list.length && (
            <ContentState title="Chưa có mục lưu">
              <p>
                Bạn có thể lưu món hoặc quán từ trang chi tiết trong phiên hiện
                tại.
              </p>
              <Link to="/" className="underline">
                Về khám phá
              </Link>
            </ContentState>
          )}
          <div className="discovery-grid mt-6">
            {tab === "dish"
              ? dishes.map((dish) => (
                  <div key={dish.id}>
                    {editing && (
                      <label className="filter-option mb-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(dish.id)}
                          onChange={() =>
                            setSelected((old) =>
                              old.includes(dish.id)
                                ? old.filter((id) => id !== dish.id)
                                : [...old, dish.id],
                            )
                          }
                        />
                        Chọn {dish.name}
                      </label>
                    )}
                    <DishCard dish={dish} />
                    <Button
                      className="mt-2"
                      variant="outline"
                      onClick={() => {
                        setSelected([dish.id])
                        setConfirm(true)
                      }}
                    >
                      Bỏ lưu {dish.name}
                    </Button>
                  </div>
                ))
              : restaurants.map((restaurant) => (
                  <div key={restaurant.id}>
                    {editing && (
                      <label className="filter-option mb-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(restaurant.id)}
                          onChange={() =>
                            setSelected((old) =>
                              old.includes(restaurant.id)
                                ? old.filter((id) => id !== restaurant.id)
                                : [...old, restaurant.id],
                            )
                          }
                        />
                        Chọn {restaurant.name}
                      </label>
                    )}
                    <RestaurantCard restaurant={restaurant} />
                    <Button
                      className="mt-2"
                      variant="outline"
                      onClick={() => {
                        setSelected([restaurant.id])
                        setConfirm(true)
                      }}
                    >
                      Bỏ lưu {restaurant.name}
                    </Button>
                  </div>
                ))}
          </div>
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        isOpen={confirm}
        title="Bỏ lưu mục đã chọn?"
        message={`Xóa ${selected.length} mục khỏi danh sách yêu thích trong phiên hiện tại.`}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          favorites.remove(tab, selected)
          setSelected([])
          setConfirm(false)
        }}
        confirmText="Bỏ lưu"
      />
      <BottomNav />
    </div>
  )
}
