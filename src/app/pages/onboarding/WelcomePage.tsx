import { Link } from "react-router"
import logoImage from "@/assets/branding/logo.jpg"
import { Button } from "@/app/components/ui/button"
export function WelcomePage() {
  return (
    <section className="py-8 text-center">
      <img
        src={logoImage}
        alt="Logo GrabMeFood"
        className="w-64 max-w-full h-auto object-contain bg-white mx-auto mb-8"
      />
      <h1>Chào mừng đến với GrabMeFood</h1>
      <p className="my-6">
        Khám phá món ăn và quán ăn từ dữ liệu hiện có. Không cần tài khoản để
        bắt đầu.
      </p>
      <Button asChild className="w-full">
        <Link to="/onboarding">Bắt đầu</Link>
      </Button>
    </section>
  )
}
