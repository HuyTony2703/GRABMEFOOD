import { useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
import { PageTitle } from "@/app/components/layout/PageTitle"
export function RegisterPage() {
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [show, setShow] = useState(false)
  const mismatch = confirmation !== "" && password !== confirmation
  return (
    <section>
      <PageTitle title="Tạo tài khoản" back="/login" backLabel="Về đăng nhập" />
      <div id="register-note">
        <UnavailableNote>
          Dịch vụ đăng ký chưa được kết nối. Không nhập thông tin hoặc mật khẩu
          thật; form này không gửi hay lưu tài khoản.
        </UnavailableNote>
      </div>
      <form
        className="space-y-4"
        onSubmit={(event) => event.preventDefault()}
        aria-describedby="register-note"
      >
        <div>
          <label htmlFor="register-name" className="block mb-2">
            Họ và tên
          </label>
          <Input id="register-name" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="register-email" className="block mb-2">
            Email
          </label>
          <Input id="register-email" type="email" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="register-phone" className="block mb-2">
            Số điện thoại
          </label>
          <Input id="register-phone" type="tel" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="register-password" className="block mb-2">
            Mật khẩu
          </label>
          <div className="flex gap-2">
            <Input
              id="register-password"
              autoComplete="new-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              variant="outline"
              type="button"
              size="icon"
              aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={show}
              onClick={() => setShow(!show)}
            >
              {show ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="register-confirm" className="block mb-2">
            Xác nhận mật khẩu
          </label>
          <Input
            id="register-confirm"
            autoComplete="new-password"
            type={show ? "text" : "password"}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            aria-invalid={mismatch}
            aria-describedby={mismatch ? "password-error" : undefined}
          />
          {mismatch && (
            <p id="password-error" role="status" className="text-sm mt-2">
              Lỗi: mật khẩu xác nhận chưa khớp.
            </p>
          )}
        </div>
        <p className="text-sm">
          <Link className="underline" to="/settings/terms">
            Điều khoản dịch vụ
          </Link>
          . Chính sách bảo mật riêng chưa được cung cấp.
        </p>
        <Button type="submit" disabled className="w-full">
          Đăng ký — chưa khả dụng
        </Button>
      </form>
      <p className="mt-6">
        <Link to="/" className="underline">
          Tiếp tục khám phá không cần tài khoản
        </Link>
      </p>
    </section>
  )
}
