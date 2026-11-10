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
import comTamImage from "../../imports/t1-1200x676.jpg"
import { DishScoreCards } from "../components/insights/DishScoreCards"

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
  const [isLoved, setIsLoved] = useState(false)

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

  const dish = dishesData[id || "1"] || dishesData["1"]

  const restaurants: Restaurant[] = [
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
      images: [dish.image],
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

  const handleSubmitReview = () => {
    console.log("Review:", reviewText)
    console.log("Files:", selectedFiles)
    // TODO: Submit review to API
    setReviewText("")
    setSelectedFiles([])
  }

  return (
    <div className="min-h-screen bg-white pb-6">
      <div className="relative h-64">
        <img
          src={dish.image}
          alt={dish.name}
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
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{dish.rating}</span>
            <span className="text-sm text-gray-500">
              ({dish.totalReviews.toLocaleString()} đánh giá)
            </span>
          </div>
          <div className="text-sm text-red-600">Giá TB: {dish.avgPrice}</div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{dish.description}</p>

        <DishScoreCards
          taste={dish.tasteRating}
          price={dish.priceRating}
          presentation={dish.presentationRating}
        />

        <div className="mb-6">
          <h3 className="text-base mb-3 text-black">
            Có tại {restaurants.length} quán gần bạn
          </h3>
          <div className="space-y-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-gray-50 rounded-xl overflow-hidden"
              >
                <Link
                  to={`/restaurant/${restaurant.id}`}
                  className="flex gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm mb-1 text-black">
                      {restaurant.name}
                    </h4>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{restaurant.rating}</span>
                      <span className="text-xs text-gray-400">
                        ({restaurant.reviews}+)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1 truncate">
                      {restaurant.address}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{restaurant.distance}</span>
                      </div>
                      <span className="text-red-600">{restaurant.price}</span>
                    </div>
                  </div>
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name}, ${restaurant.address}, TP.HCM`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 border-t border-gray-200 text-xs text-red-600 hover:bg-gray-100"
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

        <div>
          <h3 className="text-base mb-3 text-black">Đánh giá từ khách hàng</h3>
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
                    <p className="text-xs text-gray-500 mb-1">
                      Tại {review.restaurantName}
                    </p>
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
