import { PageTitle } from "@/app/components/layout/PageTitle"
export function GuidePage() {
  const guides = [
    {
      title: "Tìm kiếm món ăn",
      steps: [
        "Nhập tên món ăn hoặc quán ăn ở thanh tìm kiếm.",
        "Nhấn Tìm kiếm hoặc Enter.",
        "Chuyển giữa Món ăn và Quán ăn để xem đúng loại kết quả.",
      ],
    },
    {
      title: "Sử dụng bộ lọc",
      steps: [
        "Mở Bộ lọc, chọn điều kiện từ dữ liệu hiện có.",
        "Nhấn Áp dụng để xem kết quả. Đóng hộp thoại sẽ không áp dụng thay đổi nháp.",
        "Bỏ điều kiện hoặc sửa từ khóa khi không có kết quả.",
      ],
    },
    {
      title: "Xem bản đồ",
      steps: [
        "Mở Bản đồ để xem khu vực mẫu.",
        "Truy cập thông tin quán từ danh sách. Không có định vị thiết bị hoặc ghim địa lý được xác minh.",
      ],
    },
    {
      title: "Chọn món ngẫu nhiên",
      steps: [
        "Mở Ngẫu nhiên, chọn nguồn Toàn bộ hoặc Tự chọn từ yêu thích.",
        "Nhấn Chọn ngẫu nhiên để xem một món có thông tin chi tiết.",
      ],
    },
    {
      title: "Viết đánh giá",
      steps: [
        "Có thể nhập bản nháp trên trang chi tiết.",
        "Gửi đánh giá và tải tệp chưa được kết nối dịch vụ; nội dung không được đăng hoặc đồng bộ.",
      ],
    },
    {
      title: "Lưu yêu thích",
      steps: [
        "Dùng nút lưu món/quán trên trang chi tiết.",
        "Xem hoặc bỏ lưu ở Yêu thích. Danh sách chỉ giữ trong phiên hiện tại, chưa có đồng bộ tài khoản.",
      ],
    },
    {
      title: "Quản lý tài khoản và giao diện",
      steps: [
        "Mở Tôi → Cài đặt để xem các nhóm tùy chọn.",
        "Sáng, Tối và Theo hệ thống áp dụng cho giao diện và ghi nhớ trên thiết bị.",
        "Chức năng tài khoản cần dịch vụ chưa khả dụng sẽ có giải thích tại chỗ.",
      ],
    },
  ]
  return (
    <section>
      <PageTitle title="Hướng dẫn sử dụng" />
      {guides.map((guide) => (
        <section className="mb-8" key={guide.title}>
          <h2 className="mb-3">{guide.title}</h2>
          <ol className="list-decimal pl-6 space-y-3">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ))}
    </section>
  )
}
