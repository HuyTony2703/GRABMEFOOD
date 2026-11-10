import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Heart,
  Share2,
  Camera,
  Video,
} from "lucide-react"

import { Link, useParams, useNavigate, useLocation } from "react-router"

import { useState, useRef, useEffect } from "react"

import {
  nearbyRestaurants,
  saleRestaurants,
  todaysFoods,
  type Restaurant,
} from "@/app/data/restaurants"

import { MenuBudgetCard } from "@/app/components/insights/MenuBudgetCard"

import { ServiceScoreCard } from "@/app/components/insights/ServiceScoreCard"
import { ContentState, UnavailableNote } from "@/app/components/feedback/ContentState"
import { ShareButton } from "@/app/components/details/ShareButton"
import { DishCard } from "@/app/components/discovery/DishCard"
import { getRestaurantMenu } from "@/app/lib/catalog"
import { useFavorites } from "@/app/contexts/FavoritesContext"
import { BackLink } from "@/app/components/layout/BackLink"
import { ContentImage } from "@/app/components/media/ContentImage"

interface MenuItem {
  id: string

  name: string

  price: string

  image: string
}

interface Review {
  id: string

  userName: string

  userAvatar: string

  rating: number

  taste: number

  price: number

  service: number

  comment: string

  images: string[]

  date: string
}

export function RestaurantDetailPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const location = useLocation()

  const [activeTab, setActiveTab] = useState<"menu" | "reviews">("menu")

  const [reviewText, setReviewText] = useState("")

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const reviewsRef = useRef<HTMLDivElement>(null)

  const favorites = useFavorites()
  const isLoved = favorites.has("restaurant", id ?? "")

  // Scroll to reviews section if navigated from profile

  useEffect(() => {
    if (location.state?.scrollToReviews) {
      setActiveTab("reviews")

      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "start",
        })
      }, 100)
    }
  }, [location])

  // Find restaurant from all lists

  const allRestaurants = [
    ...nearbyRestaurants,

    ...saleRestaurants,
  ]

  const restaurant = allRestaurants.find((r) => r.id === id)

  const menuItems: MenuItem[] = getRestaurantMenu(id)

  const reviews: Review[] = [
    {
      id: "1",

      userName: "Nguyễn Văn A",

      userAvatar: "https://i.pravatar.cc/150?img=1",

      rating: 4.5,

      taste: 5,

      price: 4,

      service: 4.5,

      comment:
        "Phở rất ngon, nước dùng ngọt thanh. Không gian quán sạch sẽ, nhân viên phục vụ nhiệt tình!",

      images: [
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",

        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400",
      ],

      date: "2 ngày trước",
    },

    {
      id: "2",

      userName: "Trần Thị B",

      userAvatar: "https://i.pravatar.cc/150?img=5",

      rating: 5,

      taste: 5,

      price: 5,

      service: 5,

      comment: "Món ăn tuyệt vời, giá cả hợp lý. Sẽ quay lại!",

      images: [],

      date: "1 tuần trước",
    },
  ]

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const handleAddressClick = () => {
    // Navigate to map with restaurant location

    navigate("/map", { state: { restaurantId: id } })
  }

  if (!restaurant)
    return (
      <ContentState heading="h1" title="Không tìm thấy quán">
        <p>Bản ghi này không có trong dữ liệu hiện có.</p>
        <Link to="/search" className="underline">
          Về tìm kiếm
        </Link>
      </ContentState>
    )

  return (
    <div className="bg-card pb-6">
      <BackLink />
      <div className="relative h-64">
        <ContentImage
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          eager
        />
        <Link
          to="/"
          aria-label="Về trang chủ"
          className="absolute top-4 left-4 min-w-11 min-h-11 bg-card rounded-md flex items-center justify-center border border-input"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
        </Link>
      </div>

      <div className="px-4 py-4">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
          <h1 className="text-foreground">
            {restaurant?.name || "Phở Hà Nội"}
          </h1>
          <div className="flex gap-2">
            <button
              aria-label={isLoved ? "Bỏ lưu quán" : "Lưu quán trên trang này"}
              aria-pressed={isLoved}
              onClick={() => favorites.toggle("restaurant", id ?? "")}
              className={`p-2 rounded-lg transition-all ${
                isLoved ? "bg-accent" : "bg-secondary"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLoved ? "fill-current text-foreground" : "text-foreground"
                }`}
              />
            </button>
            <ShareButton />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-foreground" aria-hidden="true" />
            <span className="text-sm">{restaurant?.rating || 4.8}</span>
            <span className="text-sm text-foreground">
              ({restaurant?.reviews || 245} đánh giá)
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground">
            <MapPin className="w-4 h-4" />
            <span>{restaurant?.distance || "0.3 km"}</span>
          </div>
          <div className="text-base font-medium text-foreground">
            {restaurant?.price || "50-80k"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Clock className="w-5 h-5 text-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm text-foreground">Giờ mở cửa</p>
              <p className="text-sm text-foreground">
                {id === "1" ? "7:00 - 22:00 (mẫu)" : "Chưa có thông tin"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Phone className="w-5 h-5 text-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm text-foreground">Liên hệ</p>
              <p className="text-sm text-foreground">
                {id === "1" ? "0912 345 678 (mẫu)" : "Chưa có thông tin"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddressClick}
          className="flex w-full text-left items-center gap-2 p-3 bg-muted rounded-lg mb-6 hover:bg-accent transition-colors"
        >
          <MapPin
            className="w-5 h-5 text-foreground shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm text-foreground mb-1">
              Địa chỉ — xem trên bản đồ mẫu
            </p>
            <p className="text-sm text-foreground">
              {id === "1"
                ? "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh (địa chỉ mẫu)"
                : "Chưa có địa chỉ chi tiết; xem quán trong danh sách bản đồ mẫu"}
            </p>
          </div>
        </button>

        <div
          className="flex gap-2 border-b border-border mb-4"
          role="group"
          aria-label="Nội dung quán"
        >
          <button
            onClick={() => setActiveTab("menu")}
            aria-pressed={activeTab === "menu"}
            className={`px-4 py-3 -mb-px transition-colors ${
              activeTab === "menu"
                ? "border-b-2 border-foreground text-foreground font-medium"
                : "text-foreground"
            }`}
          >
            Thực đơn
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            aria-pressed={activeTab === "reviews"}
            className={`px-4 py-3 -mb-px transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-foreground text-foreground font-medium"
                : "text-foreground"
            }`}
          >
            Đánh giá
          </button>
        </div>

        {activeTab === "menu" && (
          <>
            <MenuBudgetCard key={id} items={menuItems} />
            {!menuItems.length && (
              <ContentState title="Chưa có thực đơn">
                <p>Dữ liệu hiện có chưa cung cấp thực đơn cho quán này.</p>
              </ContentState>
            )}
            <div className="discovery-grid">
              {menuItems.map((item) => (
                <div key={item.id} id={`menu-item-${item.id}`}>
                  <DishCard
                    dish={{
                      ...item,
                      href: `/restaurant/${id}/dish/${item.id}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "reviews" && (
          <div ref={reviewsRef} className="space-y-4">
            <ServiceScoreCard
              scores={reviews.map((review) => review.service)}
            />
            {/* Your Review Section */}
            <div className="bg-muted rounded-lg p-4">
              <label
                htmlFor="restaurant-review"
                className="block mb-3 text-foreground"
              >
                Đánh giá của bạn
              </label>
              <UnavailableNote>
                Chưa kết nối dịch vụ đánh giá hoặc tải tệp. Bản nháp trên trang
                không được gửi hay đồng bộ.
              </UnavailableNote>
              <textarea
                id="restaurant-review"
                aria-label="Nội dung đánh giá quán"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về quán này..."
                className="w-full bg-input-background border border-input rounded-md p-3 text-base mb-3 resize-y"
                rows={4}
              />

              <div className="border border-border rounded-xl p-4 text-center mb-3">
                <div className="flex justify-center gap-4 mb-2">
                  <Camera
                    className="w-5 h-5 text-foreground"
                    aria-hidden="true"
                  />
                  <Video
                    className="w-5 h-5 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm text-foreground">
                  Tải ảnh/video chưa khả dụng
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  disabled
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-foreground mb-2">
                    {selectedFiles.length} tệp đã chọn
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-card px-3 py-1.5 rounded-md text-sm border border-border"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled
                className="w-full py-3 bg-secondary text-secondary-foreground border border-border rounded-md"
              >
                Gửi đánh giá
              </button>
            </div>

            {/* Customer Reviews */}
            <div>
              <h3 className="text-base mb-3 text-foreground">
                Đánh giá minh họa, chưa xác minh theo từng quán
              </h3>
            </div>
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm text-foreground">
                        {review.userName}
                      </h4>
                      <span className="text-sm text-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star
                        className="w-4 h-4 text-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {review.comment}
                    </p>
                    {review.images.length > 0 && (
                      <div className="flex gap-2">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
