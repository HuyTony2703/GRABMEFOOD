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
} from "../data/restaurants"
import { MenuBudgetCard } from "../components/insights/MenuBudgetCard"
import { ServiceScoreCard } from "../components/insights/ServiceScoreCard"

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
  const [isLoved, setIsLoved] = useState(false)

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
    ...todaysFoods,
  ]
  const restaurant = allRestaurants.find((r) => r.id === id)

  // Use restaurant dishes if available, otherwise use default menu
  const menuItems: MenuItem[] = restaurant?.dishes?.map((dish) => ({
    id: dish.id,
    name: dish.name,
    price: dish.price,
    image: dish.image,
  })) || [
    {
      id: "1",
      name: "Phở Bò Tái",
      price: "65,000đ",
      image:
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    },
    {
      id: "2",
      name: "Phở Gà",
      price: "55,000đ",
      image:
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400",
    },
    {
      id: "3",
      name: "Bún Chả",
      price: "60,000đ",
      image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
    },
    {
      id: "4",
      name: "Bánh Cuốn",
      price: "45,000đ",
      image:
        "https://images.unsplash.com/photo-1626074353765-517a65afa1e3?w=400",
    },
    {
      id: "5",
      name: "Gỏi Cuốn",
      price: "40,000đ",
      image:
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400",
    },
    {
      id: "6",
      name: "Chả Giò",
      price: "50,000đ",
      image:
        "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400",
    },
  ]

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

  const handleSubmitReview = () => {
    console.log("Review:", reviewText)
    console.log("Files:", selectedFiles)
    // TODO: Submit review to API
    setReviewText("")
    setSelectedFiles([])
  }

  const handleAddressClick = () => {
    // Navigate to map with restaurant location
    navigate("/map", { state: { restaurantId: id } })
  }

  return (
    <div className="min-h-screen bg-white pb-6">
      <div className="relative h-64">
        <img
          src={
            restaurant?.image ||
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800"
          }
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <Link
          to="/"
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </Link>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl text-black">
            {restaurant?.name || "Phở Hà Nội"}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsLoved(!isLoved)}
              className={`p-2 rounded-lg transition-all ${
                isLoved ? "bg-red-50" : "bg-gray-100"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLoved ? "fill-red-600 text-red-600" : "text-gray-500"
                }`}
              />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{restaurant?.rating || 4.8}</span>
            <span className="text-sm text-gray-500">
              ({restaurant?.reviews || 245} đánh giá)
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{restaurant?.distance || "0.3 km"}</span>
          </div>
          <div className="text-sm text-red-600">
            {restaurant?.price || "50-80k"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Giờ mở cửa</p>
              <p className="text-sm text-black">7:00 - 22:00</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Liên hệ</p>
              <p className="text-sm text-black">0912 345 678</p>
            </div>
          </div>
        </div>

        <div
          onClick={handleAddressClick}
          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-6 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <MapPin className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
            <p className="text-sm text-black">
              123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-3 -mb-px transition-colors ${
              activeTab === "menu"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Thực đơn
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-3 -mb-px transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Đánh giá
          </button>
        </div>

        {activeTab === "menu" && (
          <>
            <MenuBudgetCard key={id} items={menuItems} />
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  to={`/restaurant/${id}/dish/${item.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow scroll-mt-6 focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  <div className="relative h-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm text-black line-clamp-2">
                      {item.name}
                    </h3>
                  </div>
                </Link>
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
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm mb-3 text-black">Đánh giá của bạn</h3>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về quán này..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm mb-3 resize-none focus:outline-none focus:border-red-600"
                rows={4}
              />

              <div
                onClick={handleFileSelect}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-red-600 transition-colors mb-3"
              >
                <div className="flex justify-center gap-4 mb-2">
                  <Camera className="w-5 h-5 text-gray-400" />
                  <Video className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Thêm ảnh hoặc video</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">
                    {selectedFiles.length} tệp đã chọn
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-white px-3 py-1.5 rounded-lg text-xs border border-gray-200"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmitReview}
                className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Gửi đánh giá
              </button>
            </div>

            {/* Customer Reviews */}
            <div>
              <h3 className="text-base mb-3 text-black">
                Đánh giá từ khách hàng
              </h3>
            </div>
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm text-black">{review.userName}</h4>
                      <span className="text-xs text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
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
