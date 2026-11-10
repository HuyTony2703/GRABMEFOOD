import { ArrowLeft, Star, Camera } from "lucide-react";
import { useNavigate } from "react-router";
import { nearbyRestaurants } from "../data/restaurants";

export function AllReviewsPage() {
  const navigate = useNavigate();

  const userReviews = [
    {
      id: "1",
      restaurant: nearbyRestaurants[0],
      rating: 5,
      comment: "Phở rất ngon, nước dùng đậm đà, thịt bò mềm. Sẽ quay lại!",
      date: "2 ngày trước",
      likes: 24,
      images: 3,
    },
    {
      id: "2",
      restaurant: nearbyRestaurants[1],
      rating: 4,
      comment: "Quán đẹp, view oke. Giá hơi cao nhưng chất lượng tốt.",
      date: "1 tuần trước",
      likes: 15,
      images: 2,
    },
    {
      id: "3",
      restaurant: nearbyRestaurants[3],
      rating: 5,
      comment: "Bánh mì ngon nhất quận! Giá rẻ mà chất lượng tuyệt vời.",
      date: "2 tuần trước",
      likes: 42,
      images: 1,
    },
    {
      id: "4",
      restaurant: nearbyRestaurants[2],
      rating: 4,
      comment: "Không gian thoải mái, phục vụ nhiệt tình. Giá cả hợp lý.",
      date: "3 tuần trước",
      likes: 18,
      images: 4,
    },
    {
      id: "5",
      restaurant: nearbyRestaurants[0],
      rating: 5,
      comment: "Món ăn đa dạng, phong phú. Sẽ giới thiệu cho bạn bè!",
      date: "1 tháng trước",
      likes: 31,
      images: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg">Đánh giá của tôi</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm text-gray-600 mb-4">
          Tổng cộng {userReviews.length} đánh giá
        </p>
        <div className="space-y-3">
          {userReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex gap-3 mb-3">
                <img
                  src={review.restaurant.image}
                  alt={review.restaurant.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm mb-1">{review.restaurant.name}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <span>❤️</span>
                    <span>{review.likes}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    <span>{review.images}</span>
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/restaurant/${review.restaurant.id}`, { state: { scrollToReviews: true } })}
                  className="text-red-500 hover:underline"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
