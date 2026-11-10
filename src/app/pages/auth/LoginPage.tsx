import { useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
import logoImage from "@/assets/branding/logo.jpg"
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <section>
      <Link to="/" className="underline">
        Về khám phá
      </Link>
      <img
        src={logoImage}
        alt="Logo GrabMeFood"
        className="w-44 h-auto object-contain bg-white my-6 mx-auto"
      />
      <h1>Đăng nhập</h1>
      <div id="login-note">
        <UnavailableNote>
          Dịch vụ đăng nhập chưa được kết nối. Form chỉ để xem giao diện; không
          nhập mật khẩu thật. Bạn vẫn có thể khám phá mà không đăng nhập.
        </UnavailableNote>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        {["Google", "Facebook", "X"].map((provider) => (
          <Button
            key={provider}
            variant="outline"
            disabled
            aria-describedby="login-note"
          >
            {provider}
          </Button>
        ))}
      </div>
      <form
        className="space-y-4"
        onSubmit={(event) => event.preventDefault()}
        aria-describedby="login-note"
      >
        <div>
          <label htmlFor="login-email" className="block mb-2">
            Email
          </label>
          <Input id="login-email" type="email" autoComplete="username" />
        </div>
        <div>
          <label htmlFor="login-password" className="block mb-2">
            Mật khẩu
          </label>
          <div className="flex gap-2">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <label className="filter-option">
            <input type="checkbox" disabled />
            Nhớ tài khoản (chưa khả dụng)
          </label>
          <Button type="button" variant="link" disabled>
            Quên mật khẩu?
          </Button>
        </div>
        <Button type="submit" disabled className="w-full">
          Đăng nhập — chưa khả dụng
        </Button>
      </form>
      <p className="mt-6">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="underline">
          Xem form đăng ký
        </Link>
      </p>
      <p className="mt-4 text-sm">
        <Link to="/settings/terms" className="underline">
          Điều khoản sử dụng
        </Link>
      </p>
    </section>
  )
}
