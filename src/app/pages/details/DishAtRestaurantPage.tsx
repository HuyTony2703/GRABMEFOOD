import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Camera,
  Video,
  MapPin,
  Navigation,
} from "lucide-react"

import { Link, useParams } from "react-router"

import { useState, useRef, useEffect } from "react"

import { ReviewDistributionCard } from "@/app/components/insights/ReviewDistributionCard"
import { allRestaurants, getRestaurantMenu } from "@/app/lib/catalog"
import { RecordDetail } from "@/app/components/details/RecordDetail"
import { ContentState, UnavailableNote } from "@/app/components/feedback/ContentState"
import { ShareButton } from "@/app/components/details/ShareButton"
import { useFavorites } from "@/app/contexts/FavoritesContext"
import { BackLink } from "@/app/components/layout/BackLink"
import { ContentImage } from "@/app/components/media/ContentImage"

interface Review {
  id: string

  userName: string

  userAvatar: string

  rating: number

  taste: number

  price: number

  comment: string

  images: string[]

  date: string
}

interface DishAtRestaurant {
  id: string

  name: string

  price: string

  originalPrice?: string

  onSale: boolean

  discount?: string

  image: string

  description: string

  rating: number

  reviews: number
}

export function DishAtRestaurantPage() {
  const { restaurantId, dishId } = useParams()

  const [reviewText, setReviewText] = useState("")

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const favorites = useFavorites()
  const favoriteId = restaurantId === "1" ? `menu:1:${dishId}` : (dishId ?? "")
  const isLoved = favorites.has("dish", favoriteId)

  // Mock data - trong thực tế sẽ fetch từ API

  const dish: DishAtRestaurant = {
    id: dishId || "1",

    name: "Phở Bò Tái",

    price: "65,000đ",

    originalPrice: "80,000đ",

    onSale: true,

    discount: "-20%",

    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",

    description:
      "Phở bò tái với thịt bò tươi ngon, nước dùng hầm xương chuẩn vị Hà Nội",

    rating: 4.8,

    reviews: 234,
  }

  const restaurantName = "Phở Hà Nội"

  const restaurantAddress = "123 Nguyễn Huệ, Quận 1, TP.HCM"

  const restaurantLat = 10.7769

  const restaurantLng = 106.7009

  const reviews: Review[] = [
    {
      id: "1",

      userName: "Nguyễn Văn A",

      userAvatar: "https://i.pravatar.cc/150?img=1",

      rating: 5,

      taste: 5,

      price: 4.5,

      comment:
        "Phở này ngon tuyệt! Nước dùng đậm đà, thịt bò tươi mềm. Rất đáng giá!",

      images: [
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
      ],

      date: "2 ngày trước",
    },

    {
      id: "2",

      userName: "Trần Thị B",

      userAvatar: "https://i.pravatar.cc/150?img=5",

      rating: 4.5,

      taste: 5,

      price: 4,

      comment: "Món ăn ngon, giá sale rất hợp lý!",

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

  const owner = allRestaurants.find(
    (restaurant) => restaurant.id === restaurantId,
  )
  const scopedDish = getRestaurantMenu(restaurantId).find(
    (item) => item.id === dishId,
  )
  if (!owner || !scopedDish)
    return (
      <ContentState heading="h1" title="Không tìm thấy món tại quán">
        <p>Không có mối liên hệ món/quán khớp dữ liệu hiện có.</p>
        <Link className="underline" to="/search">
          Về tìm kiếm
        </Link>
      </ContentState>
    )
  if (restaurantId !== "1" || dishId !== "1")
    return (
      <RecordDetail
        record={scopedDish}
        restaurant={owner}
        favoriteId={favoriteId}
      />
    )

  return (
    <div className="bg-card pb-6">
      <BackLink fallback={`/restaurant/${restaurantId}`} />
      <div className="relative h-64">
        <ContentImage
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
          eager
        />
        <Link
          to={`/restaurant/${restaurantId}`}
          aria-label="Về thông tin quán"
          className="absolute top-4 left-4 min-w-11 min-h-11 bg-card rounded-md flex items-center justify-center border border-input"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
        </Link>
        {dish.onSale && dish.discount && (
          <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
            {dish.discount}
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="mb-4">
          <Link
            to={`/restaurant/${restaurantId}`}
            className="text-sm text-foreground underline mb-2 block"
          >
            Tại {restaurantName}
          </Link>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
            <h1 className="text-foreground">{dish.name}</h1>
            <div className="flex gap-2">
              <button
                aria-label={isLoved ? "Bỏ lưu món" : "Lưu món trên trang này"}
                aria-pressed={isLoved}
                onClick={() => favorites.toggle("dish", favoriteId)}
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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-foreground" aria-hidden="true" />
              <span className="text-sm">{dish.rating}</span>
              <span className="text-sm text-foreground">
                ({dish.reviews} đánh giá)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-foreground">{dish.price}</span>
            {dish.onSale && dish.originalPrice && (
              <span className="text-sm text-foreground line-through">
                {dish.originalPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-base text-foreground mb-6">{dish.description}</p>

        {/* Restaurant Address Section */}
        <div className="mb-6">
          <h3 className="text-base mb-3 text-foreground">
            Địa chỉ quán trong dữ liệu mẫu
          </h3>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center flex-shrink-0">
                <MapPin
                  className="w-5 h-5 text-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-base mb-1 text-foreground">
                  {restaurantName}
                </h4>
                <p className="text-sm text-foreground">{restaurantAddress}</p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${restaurantLat},${restaurantLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 w-full py-3 bg-card border border-input rounded-md hover:bg-accent transition-colors text-sm text-foreground underline"
            >
              <Navigation className="w-4 h-4" />
              <span>Xem trên bản đồ</span>
            </a>
          </div>
        </div>

        {/* Your Review Section */}
        <div className="mb-6">
          <label
            htmlFor="scoped-dish-review"
            className="block text-base mb-3 text-foreground"
          >
            Đánh giá của bạn
          </label>
          <UnavailableNote>
            Chưa kết nối dịch vụ đánh giá hoặc tải tệp; bản nháp không được gửi
            hay đồng bộ.
          </UnavailableNote>
          <div className="bg-muted rounded-lg p-4">
            <textarea
              id="scoped-dish-review"
              aria-label="Nội dung đánh giá món tại quán"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
              className="w-full bg-input-background border border-input rounded-md p-3 text-base mb-3 resize-y"
              rows={4}
            />

            <div className="border border-border rounded-xl p-4 text-center mb-3">
              <div className="flex justify-center gap-4 mb-2">
                <Camera
                  className="w-5 h-5 text-foreground"
                  aria-hidden="true"
                />
                <Video className="w-5 h-5 text-foreground" aria-hidden="true" />
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
        </div>

        {/* Customer Reviews */}
        <div>
          <h3 className="text-base mb-3 text-foreground">
            Đánh giá mẫu, chưa được xác minh
          </h3>
          <ReviewDistributionCard
            ratings={reviews.map((review) => review.rating)}
          />
          <div className="space-y-4">
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
        </div>
      </div>
    </div>
  )
}
