import { Link } from "react-router"
import { BottomNav } from "@/app/components/layout/BottomNav"
import { Button } from "@/app/components/ui/button"
import { ContentImage } from "@/app/components/media/ContentImage"
import { SampleReviewList } from "@/app/components/profile/SampleReviewList"
export function ProfilePage() {
  return (
    <section>
      <div className="page-heading">
        <h1>Hồ sơ minh họa</h1>
        <Button asChild variant="outline">
          <Link to="/settings">Cài đặt</Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-6 items-center mb-6">
        <ContentImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
          alt="Ảnh đại diện mẫu"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2>Nguyễn Văn A</h2>
          <p className="mt-2">
            Foodie Level 8 · Tham gia 1 năm trước (dữ liệu mẫu)
          </p>
        </div>
      </div>
      <p className="unavailable-note">
        Chưa có tài khoản được xác thực. Hồ sơ, huy hiệu và số liệu bên dưới chỉ
        minh họa giao diện.
      </p>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        {[
          ["Đánh giá", "127"],
          ["Ảnh", "348"],
          ["Địa điểm", "89"],
          ["Huy hiệu", "12"],
        ].map(([label, value]) => (
          <div key={label} className="border border-border rounded-lg p-4">
            <dt className="text-sm">{label}</dt>
            <dd className="text-xl font-medium mt-2">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="section-heading">
        <h2>Đánh giá mẫu gần đây</h2>
        <Link className="underline" to="/profile/reviews">
          Xem tất cả
        </Link>
      </div>
      <SampleReviewList recent />
      <BottomNav />
    </section>
  )
}
