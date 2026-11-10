import { PageTitle } from "@/app/components/layout/PageTitle"
import { SampleReviewList } from "@/app/components/profile/SampleReviewList"
export function AllReviewsPage() {
  return (
    <section>
      <PageTitle
        title="Đánh giá minh họa"
        back="/profile"
        backLabel="Về hồ sơ"
      />
      <p className="mb-6">
        5 đánh giá có trong dữ liệu mẫu; không phải lịch sử tài khoản đã đăng
        nhập. Lượt thích chỉ hiển thị, chưa kết nối dịch vụ tương tác.
      </p>
      <SampleReviewList />
    </section>
  )
}
