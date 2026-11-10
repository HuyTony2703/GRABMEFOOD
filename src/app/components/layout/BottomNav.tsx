import { NavLink } from "react-router"
import { primaryNavigation } from "@/app/components/layout/AppFrame"
export function BottomNav() {
  return (
    <nav className="mobile-nav" aria-label="Điều hướng chính trên thiết bị nhỏ">
      {primaryNavigation.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
