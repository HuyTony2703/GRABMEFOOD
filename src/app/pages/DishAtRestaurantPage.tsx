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
import { ReviewDistributionCard } from "../components/insights/ReviewDistributionCard"

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
  const [isLoved, setIsLoved] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("dish-page-no-scrollbar")
    return () =>
      document.documentElement.classList.remove("dish-page-no-scrollbar")
  }, [])

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

  const handleSubmitReview = () => {
    console.log("Review:", reviewText)
    console.log("Files:", selectedFiles)
    // TODO: Submit review to API
    setReviewText("")
    setSelectedFiles([])
  }

  return (
    <div className="min-h-screen bg-white pb-6 overflow-x-hidden">
      <div className="relative h-64">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <Link
          to={`/restaurant/${restaurantId}`}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </Link>
        {dish.onSale && dish.discount && (
          <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg">
            {dish.discount}
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="mb-4">
          <Link
            to={`/restaurant/${restaurantId}`}
            className="text-sm text-red-600 hover:underline mb-1 block"
          >
            Tại {restaurantName}
          </Link>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl text-black">{dish.name}</h1>
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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{dish.rating}</span>
              <span className="text-sm text-gray-500">
                ({dish.reviews} đánh giá)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-red-600">{dish.price}</span>
            {dish.onSale && dish.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {dish.originalPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{dish.description}</p>

        {/* Restaurant Address Section */}
        <div className="mb-6">
          <h3 className="text-base mb-3 text-black">Địa chỉ nhà hàng</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1 text-black">{restaurantName}</h4>
                <p className="text-sm text-gray-600">{restaurantAddress}</p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${restaurantLat},${restaurantLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <Navigation className="w-4 h-4" />
              <span>Xem trên bản đồ</span>
            </a>
          </div>
        </div>

        {/* Your Review Section */}
        <div className="mb-6">
          <h3 className="text-base mb-3 text-black">Đánh giá của bạn</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
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
        </div>

        {/* Customer Reviews */}
        <div>
          <h3 className="text-base mb-3 text-black">Đánh giá từ khách hàng</h3>
          <ReviewDistributionCard
            ratings={reviews.map((review) => review.rating)}
          />
          <div className="space-y-4">
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
        </div>
      </div>
    </div>
  )
}
