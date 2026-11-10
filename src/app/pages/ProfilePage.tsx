import { Settings, Camera, Award, MapPin, Star, Calendar, TrendingUp } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { nearbyRestaurants } from "../data/restaurants";
import { useNavigate } from "react-router";

export function ProfilePage() {
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
  ];

  const stats = [
    { icon: Star, label: "Đánh giá", value: "127" },
    { icon: Camera, label: "Ảnh", value: "348" },
    { icon: MapPin, label: "Địa điểm", value: "89" },
    { icon: Award, label: "Huy hiệu", value: "12" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start gap-4 mb-3">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden border-4 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 rounded-full border-4 border-white flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl">Nguyễn Văn A</h2>
                <button
                  onClick={() => navigate("/settings")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Foodie Level 8</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Tham gia 1 năm trước</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-1 w-20 h-20 bg-red-50 text-red-600 rounded-xl flex-shrink-0">
                <Icon className="w-6 h-6" />
                <p className="text-lg text-gray-900 leading-none">{value}</p>
                <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Đánh giá gần đây</h3>
          <button
            onClick={() => navigate("/profile/reviews")}
            className="text-sm text-red-500 hover:underline"
          >
            Xem tất cả
          </button>
        </div>

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

      <div className="px-4 mt-6 mb-4">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white text-center">
          <Award className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg mb-2">Trở thành Elite Reviewer!</h3>
          <p className="text-sm text-white/90 mb-4">
            Viết thêm 13 đánh giá nữa để nâng cấp
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden mb-3">
            <div className="bg-white h-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-xs text-white/80">65% hoàn thành</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
