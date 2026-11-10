import {
  ArrowLeft,
  Star,
  MapPin,
  Navigation,
  Heart,
  Share2,
  Camera,
  Video,
} from "lucide-react"

import { Link, useParams } from "react-router"

import { useState, useRef } from "react"

import comTamImage from "@/assets/images/com-tam.jpg"

import { DishScoreCards } from "@/app/components/insights/DishScoreCards"
import { ContentState, UnavailableNote } from "@/app/components/feedback/ContentState"
import { RecordDetail } from "@/app/components/details/RecordDetail"
import { ShareButton } from "@/app/components/details/ShareButton"
import { todayDishes } from "@/app/lib/catalog"
import { useFavorites } from "@/app/contexts/FavoritesContext"
import { BackLink } from "@/app/components/layout/BackLink"
import { ContentImage } from "@/app/components/media/ContentImage"

interface Restaurant {
  id: string

  name: string

  rating: number

  reviews: number

  distance: string

  price: string

  image: string

  address: string
}

interface Review {
  id: string

  userName: string

  userAvatar: string

  rating: number

  taste: number

  price: number

  restaurantName: string

  comment: string

  images: string[]

  date: string
}

interface DishData {
  id: string

  name: string

  rating: number

  totalReviews: number

  avgPrice: string

  description: string

  image: string

  tasteRating: number

  priceRating: number

  presentationRating: number
}

export function DishDetailPage() {
  const { id } = useParams()

  const [reviewText, setReviewText] = useState("")

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const favorites = useFavorites()
  const isLoved = favorites.has("dish", id ?? "")

  // Mock dish data based on ID

  const dishesData: Record<string, DishData> = {
    "1": {
      id: "1",

      name: "Cơm Tấm Sườn Nướng",

      rating: 4.8,

      totalReviews: 1567,

      avgPrice: "35-60k",

      description:
        "Cơm tấm sườn nướng thơm phức, ăn kèm với đồ chua, mỡ hành và nước mắm pha",

      image: comTamImage,

      tasteRating: 4.9,

      priceRating: 4.7,

      presentationRating: 4.6,
    },

    "2": {
      id: "2",

      name: "Bún Chả Hà Nội",

      rating: 4.9,

      totalReviews: 2134,

      avgPrice: "40-70k",

      description:
        "Bún chả Hà Nội với thịt nướng thơm ngon, nước chấm chua ngọt đậm đà",

      image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",

      tasteRating: 5.0,

      priceRating: 4.8,

      presentationRating: 4.7,
    },

    "3": {
      id: "3",

      name: "Gỏi Cuốn Tôm Thịt",

      rating: 4.7,

      totalReviews: 982,

      avgPrice: "25-45k",

      description:
        "Gỏi cuốn tươi ngon với tôm, thịt, rau sống cuốn trong bánh tráng",

      image:
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800",

      tasteRating: 4.8,

      priceRating: 4.6,

      presentationRating: 4.9,
    },

    "pho-ga": {
      id: "pho-ga",

      name: "Phở Gà",

      rating: 4.8,

      totalReviews: 1245,

      avgPrice: "45-70k",

      description:
        "Phở gà nước dùng thanh ngọt, thịt gà mềm, ăn kèm hành tây và rau thơm",

      image:
        "https://images.unsplash.com/photo-1759770753108-dc559a3d35b6?w=800",

      tasteRating: 4.8,

      priceRating: 4.7,

      presentationRating: 4.6,
    },

    "pho-bo-tai": {
      id: "pho-bo-tai",

      name: "Phở Bò Tái",

      rating: 4.9,

      totalReviews: 2678,

      avgPrice: "50-85k",

      description:
        "Phở bò tái với thịt bò tươi ngon, nước dùng hầm xương chuẩn vị Hà Nội",

      image:
        "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?w=800",

      tasteRating: 5.0,

      priceRating: 4.8,

      presentationRating: 4.8,
    },

    "pho-bo-chin": {
      id: "pho-bo-chin",

      name: "Phở Bò Chín",

      rating: 4.7,

      totalReviews: 987,

      avgPrice: "50-80k",

      description: "Phở bò chín với thịt bò mềm, nước dùng đậm đà",

      image:
        "https://images.unsplash.com/photo-1730900979914-7e34981744b0?w=800",

      tasteRating: 4.7,

      priceRating: 4.6,

      presentationRating: 4.5,
    },

    "pho-chay": {
      id: "pho-chay",

      name: "Phở Chay",

      rating: 4.6,

      totalReviews: 456,

      avgPrice: "40-60k",

      description: "Phở chay thanh đạm, bổ dưỡng với đậu hũ và rau củ tươi",

      image:
        "https://images.unsplash.com/photo-1680084570772-1da0c78362a4?w=800",

      tasteRating: 4.6,

      priceRating: 4.5,

      presentationRating: 4.4,
    },

    "pho-hai-san": {
      id: "pho-hai-san",

      name: "Phở Hải Sản",

      rating: 4.5,

      totalReviews: 312,

      avgPrice: "60-95k",

      description:
        "Phở hải sản với tôm, mực, cá tươi ngon trong nước dùng thơm",

      image:
        "https://images.unsplash.com/photo-1748264106369-3b5fc990b3b9?w=800",

      tasteRating: 4.5,

      priceRating: 4.3,

      presentationRating: 4.6,
    },
  }

  const dish =
    id && Object.prototype.hasOwnProperty.call(dishesData, id)
      ? dishesData[id]
      : undefined
  const todayDish = todayDishes.find((item) => item.id === id)

  const restaurantSamples: Restaurant[] = [
    {
      id: "1",

      name: "Phở Hà Nội",

      rating: 4.8,

      reviews: 245,

      distance: "0.3 km",

      price: "50-80k",

      image:
        "https://images.unsplash.com/photo-1762015669851-4098e655ec87?w=400",

      address: "123 Nguyễn Huệ, Quận 1",
    },

    {
      id: "2",

      name: "Quán Ngon Sài Gòn",

      rating: 4.7,

      reviews: 189,

      distance: "0.5 km",

      price: "45-75k",

      image:
        "https://images.unsplash.com/photo-1775435616600-d09a2c040027?w=400",

      address: "456 Lê Lợi, Quận 1",
    },

    {
      id: "3",

      name: "Món Việt Truyền Thống",

      rating: 4.9,

      reviews: 567,

      distance: "0.8 km",

      price: "40-70k",

      image: "https://images.unsplash.com/photo-1549516733-044ae3f79dde?w=400",

      address: "789 Pasteur, Quận 3",
    },
  ]

  const reviews: Review[] = [
    {
      id: "1",

      userName: "Nguyễn Văn A",

      userAvatar: "https://i.pravatar.cc/150?img=1",

      rating: 5,

      taste: 5,

      price: 4.5,

      restaurantName: "Phở Hà Nội",

      comment:
        "Món này ngon tuyệt! Hương vị đậm đà, chất lượng tuyệt vời. Rất đáng để thử!",

      images: dish?.image ? [dish.image] : [],
      date: "2 ngày trước",
    },

    {
      id: "2",

      userName: "Trần Thị B",

      userAvatar: "https://i.pravatar.cc/150?img=5",

      rating: 4.5,

      taste: 5,

      price: 4,

      restaurantName: "Quán Ngon Sài Gòn",

      comment: "Món ăn ngon, giá cả hợp lý. Phục vụ nhanh chóng!",

      images: [],

      date: "5 ngày trước",
    },

    {
      id: "3",

      userName: "Lê Văn C",

      userAvatar: "https://i.pravatar.cc/150?img=3",

      rating: 4.8,

      taste: 5,

      price: 4.5,

      restaurantName: "Món Việt Truyền Thống",

      comment: "Chuẩn vị truyền thống, rất ngon và đáng giá!",

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

  const restaurants = ["pho-ga", "pho-bo-tai"].includes(id ?? "")
    ? restaurantSamples.filter((item) => item.id === "1")
    : []
  if (todayDish) return <RecordDetail record={todayDish} />
  if (!dish)
    return (
      <ContentState heading="h1" title="Không tìm thấy món ăn">
        <p>
          Không có bản ghi khớp định danh này. Không thay thế bằng món khác.
        </p>
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
          src={dish.image}
          alt={dish.name}
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
          <h1 className="text-foreground">{dish.name}</h1>
          <div className="flex gap-2">
            <button
              aria-label={isLoved ? "Bỏ lưu món" : "Lưu món trên trang này"}
              aria-pressed={isLoved}
              onClick={() => favorites.toggle("dish", id ?? "")}
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
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-foreground" aria-hidden="true" />
            <span className="text-sm">{dish.rating}</span>
            <span className="text-sm text-foreground">
              ({dish.totalReviews.toLocaleString()} đánh giá)
            </span>
          </div>
          <div className="text-base font-medium text-foreground">
            Giá tham khảo: {dish.avgPrice}
          </div>
        </div>
        <p className="text-base text-foreground mb-6">{dish.description}</p>

        <DishScoreCards
          taste={dish.tasteRating}
          price={dish.priceRating}
          presentation={dish.presentationRating}
        />

        <div className="mb-6">
          <h3 className="text-base mb-3 text-foreground">
            Quán có thông tin món trong dữ liệu mẫu
          </h3>
          <div className="space-y-3">
            {!restaurants.length && (
              <ContentState title="Chưa có liên kết quán phù hợp">
                <p>Không suy ra quán bán món từ các định danh trùng nhau.</p>
              </ContentState>
            )}
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-muted rounded-lg border border-border"
              >
                <Link
                  to={`/restaurant/${restaurant.id}`}
                  className="flex gap-4 bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base mb-1 text-foreground">
                      {restaurant.name}
                    </h4>
                    <div className="flex items-center gap-1 mb-1">
                      <Star
                        className="w-4 h-4 text-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-xs">{restaurant.rating}</span>
                      <span className="text-sm text-foreground">
                        ({restaurant.reviews}+)
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-1">
                      {restaurant.address}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{restaurant.distance}</span>
                      </div>
                      <span className="text-foreground">
                        {restaurant.price}
                      </span>
                    </div>
                  </div>
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name}, ${restaurant.address}, TP.HCM`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 px-4 py-3 border-t border-border text-sm text-foreground underline hover:bg-accent"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  Xem trên bản đồ
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Your Review Section */}
        <div className="mb-6">
          <label
            htmlFor="dish-review"
            className="block text-base mb-3 text-foreground"
          >
            Đánh giá của bạn
          </label>
          <UnavailableNote>
            Chưa kết nối dịch vụ đánh giá hoặc tải tệp. Bản nháp không được gửi
            hay đồng bộ.
          </UnavailableNote>
          <div className="bg-muted rounded-lg p-4">
            <textarea
              id="dish-review"
              aria-label="Nội dung đánh giá món"
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

        <div>
          <h3 className="text-base mb-3 text-foreground">
            Đánh giá minh họa, chưa xác minh theo từng món
          </h3>
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
                    <p className="text-sm text-foreground mb-1">
                      Tại {review.restaurantName}
                    </p>
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
