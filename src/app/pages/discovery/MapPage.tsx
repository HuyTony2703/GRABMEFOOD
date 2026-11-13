import { useState } from "react"
import { Link, useLocation } from "react-router"
import { RestaurantCard } from "@/app/components/discovery/RestaurantCard"
import { Button } from "@/app/components/ui/button"
import { allRestaurants } from "@/app/lib/catalog"
export function MapPage() {
  const location = useLocation()
  const [mapType, setMapType] = useState("default")
  const selected = allRestaurants.find(
    (restaurant) => restaurant.id === location.state?.restaurantId,
  )
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Bản đồ khu vực mẫu</h1>
          <p>
            Quận 1, TP.HCM — không định vị thiết bị. Chưa có tọa độ xác minh cho
            từng quán nên không hiển thị ghim giả.
          </p>
        </div>
      </div>
      <label className="flex flex-wrap gap-3 items-center mb-4">
        Kiểu bản đồ
        <select
          className="px-3"
          value={mapType}
          onChange={(event) => setMapType(event.target.value)}
        >
          <option value="default">Bản đồ</option>
          <option value="satellite">Vệ tinh</option>
        </select>
      </label>
      <div className="map-grid">
        <section>
          <h2 className="mb-4">
            {selected ? "Quán đang xem" : "Quán trong dữ liệu mẫu"}
          </h2>
          {selected ? (
            <RestaurantCard restaurant={selected} />
          ) : (
            <ul className="space-y-3">
              {allRestaurants.map((restaurant) => (
                <li key={restaurant.id}>
                  <Link
                    to={`/restaurant/${restaurant.id}`}
                    className="underline"
                  >
                    {restaurant.name}
                  </Link>{" "}
                  · {restaurant.distance} (mẫu)
                </li>
              ))}
            </ul>
          )}
          <p className="my-4">
            Nếu bản đồ không tải được, bạn vẫn có thể xem thông tin quán từ danh
            sách này.
          </p>
          <Button
            disabled
            variant="outline"
            aria-describedby="map-directions-note"
          >
            Chỉ đường
          </Button>
          <p id="map-directions-note" className="text-sm mt-2">
            Chỉ đường tới từng quán chưa khả dụng vì thiếu tọa độ hoặc địa chỉ
            được xác minh.
          </p>
        </section>
        <iframe
          title="Bản đồ tham khảo Quận 1, TP.HCM"
          src={`https://maps.google.com/maps?q=Quan%201%20Ho%20Chi%20Minh&output=embed&t=${
            mapType === "satellite" ? "k" : "m"
          }`}
          className="map-embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
