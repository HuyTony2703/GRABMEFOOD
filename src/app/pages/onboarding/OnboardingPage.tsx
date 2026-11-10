import { useState } from "react"
import { useNavigate } from "react-router"
import { MapPin, Search, Star } from "lucide-react"
import { Button } from "@/app/components/ui/button"
export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const steps = [
    {
      icon: MapPin,
      title: "Khám phá quán ăn",
      description:
        "Xem thông tin quán trong khu vực mẫu. Khoảng cách không lấy từ vị trí thiết bị.",
    },
    {
      icon: Search,
      title: "Tìm kiếm món ăn",
      description:
        "Tìm món ăn yêu thích và lọc theo thông tin có sẵn trong dữ liệu.",
    },
    {
      icon: Star,
      title: "Đánh giá và chia sẻ",
      description:
        "Xem đánh giá mẫu và lưu món trong phiên hiện tại. Gửi đánh giá chưa được kết nối dịch vụ.",
    },
  ]
  const current = steps[step]
  const Icon = current.icon
  return (
    <section className="py-8">
      <Button variant="link" onClick={() => navigate("/")}>
        Bỏ qua hướng dẫn
      </Button>
      <div className="my-8 text-center" aria-live="polite">
        <Icon size={64} className="mx-auto mb-6" aria-hidden="true" />
        <h1>{current.title}</h1>
        <p className="my-6">{current.description}</p>
        <p className="text-sm">
          Bước {step + 1} / {steps.length}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Quay lại
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={() =>
            step < steps.length - 1 ? setStep(step + 1) : navigate("/")
          }
        >
          {step < steps.length - 1 ? "Tiếp tục" : "Bắt đầu khám phá"}
        </Button>
      </div>
    </section>
  )
}
