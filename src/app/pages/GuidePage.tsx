import { ArrowLeft, Search, MapPin, Shuffle, Heart, User, Star, Filter } from "lucide-react";
import { useNavigate } from "react-router";

export function GuidePage() {
  const navigate = useNavigate();

  const guides = [
    {
      icon: Search,
      title: "Tìm kiếm món ăn",
      description: "Sử dụng thanh tìm kiếm để tìm món ăn, quán ăn yêu thích của bạn",
      steps: [
        "Nhấn vào thanh tìm kiếem ở trang chủ",
        "Nhập tên món ăn hoặc quán ăn",
        "Chọn từ danh sách gợi ý",
      ],
    },
    {
      icon: Filter,
      title: "Sử dụng bộ lọc",
      description: "Lọc kết quả tìm kiếm theo khoảng cách, giá cả, loại món",
      steps: [
        "Nhấn nút bộ lọc (biểu tượng thanh trượt)",
        "Chọn các tiêu chí lọc phù hợp",
        "Nhấn 'Áp dụng' để xem kết quả",
      ],
    },
    {
      icon: MapPin,
      title: "Xem bản đồ",
      description: "Tìm quán ăn gần bạn trên bản đồ",
      steps: [
        "Chuyển sang tab Bản đồ",
        "Xem các điểm đánh dấu quán ăn",
        "Nhấn vào điểm để xem thông tin chi tiết",
      ],
    },
    {
      icon: Shuffle,
      title: "Chọn món ngẫu nhiên",
      description: "Không biết ăn gì? Để chúng tôi gợi ý cho bạn!",
      steps: [
        "Chuyển sang tab Random",
        "Nhấn nút 'Quay' để chọn ngẫu nhiên",
        "Xem gợi ý và quyết định",
      ],
    },
    {
      icon: Star,
      title: "Viết đánh giá",
      description: "Chia sẻ trải nghiệm của bạn với cộng đồng",
      steps: [
        "Vào trang chi tiết quán ăn",
        "Nhấn 'Viết đánh giá'",
        "Chọn số sao, thêm ảnh và nội dung",
        "Đăng đánh giá",
      ],
    },
    {
      icon: Heart,
      title: "Lưu yêu thích",
      description: "Lưu lại các quán ăn và món ăn bạn thích",
      steps: [
        "Nhấn biểu tượng trái tim ở quán hoặc món",
        "Xem danh sách yêu thích ở tab Favorites",
        "Truy cập nhanh các quán đã lưu",
      ],
    },
    {
      icon: User,
      title: "Quản lý tài khoản",
      description: "Cập nhật thông tin cá nhân và cài đặt",
      steps: [
        "Vào tab Tôi",
        "Nhấn nút Cài đặt",
        "Chỉnh sửa thông tin cần thiết",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg">Hướng dẫn sử dụng</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <div
              key={guide.title}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm mb-1">{guide.title}</h3>
                  <p className="text-xs text-gray-600">{guide.description}</p>
                </div>
              </div>
              <div className="ml-15 space-y-2">
                {guide.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <span className="text-red-600 font-medium">{index + 1}.</span>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
