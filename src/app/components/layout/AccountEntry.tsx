import { User } from "lucide-react"
import { Link } from "react-router"

// Authentication is not connected: never use the illustrative profile as a session.
export function AccountEntry() {
  return (
    <Link
      to="/profile"
      className="account-entry"
      aria-label="Tài khoản — chưa xác thực; xem hồ sơ minh họa"
    >
      <span className="account-avatar">
        <User aria-hidden="true" size={24} />
      </span>
      <span className="account-copy">
        <span>Tài khoản</span>
        <span>Chưa xác thực</span>
      </span>
    </Link>
  )
}
