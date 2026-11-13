import { useEffect, useState } from "react"
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useMatches,
} from "react-router"
import { Home, Map, Dices, Heart, User, Search } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { AccountEntry } from "@/app/components/layout/AccountEntry"
import { SiteFooter } from "@/app/components/layout/SiteFooter"
import { BackToTop } from "@/app/components/layout/BackToTop"

export const primaryNavigation = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/map", label: "Bản đồ", icon: Map },
  { to: "/random", label: "Ngẫu nhiên", icon: Dices },
  { to: "/favorites", label: "Yêu thích", icon: Heart },
  { to: "/profile", label: "Tôi", icon: User },
]

export function AppFrame() {
  const location = useLocation()
  const navigate = useNavigate()
  const matches = useMatches()
  const [query, setQuery] = useState("")
  const auth = ["/login", "/register", "/welcome", "/onboarding"].includes(
    location.pathname,
  )
  const siteTools =
    !auth &&
    !matches.some(
      (match) =>
        (match.handle as { hideSiteTools?: boolean } | undefined)
          ?.hideSiteTools,
    )
  const layout = auth
    ? "auth"
    : /\/settings\/(terms|guide)$/.test(location.pathname)
      ? "read"
      : location.pathname.startsWith("/settings")
        ? "form"
        : "wide"
  useEffect(() => {
    document.documentElement.lang = "vi"
    document.title = "GrabMeFood — Khám phá món ăn và quán ăn"
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [location.pathname])
  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("q") ?? "")
  }, [location.search])

  return (
    <div
      className={`app-frame ${siteTools ? "has-site-tools" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header className="desktop-header">
        <div className="app-container header-row">
          <Link to="/" className="brand-link">
            GrabMeFood
          </Link>
          <form
            className="search-form"
            role="search"
            aria-label="Tìm kiếm toàn website"
            onSubmit={(event) => {
              event.preventDefault()
              navigate(`/search?q=${encodeURIComponent(query.trim())}`)
            }}
          >
            <label>
              <span className="sr-only">Tìm món ăn, quán ăn</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm món ăn, quán ăn…"
              />
            </label>
            <Button type="submit" size="icon" aria-label="Tìm kiếm">
              <Search aria-hidden="true" />
            </Button>
          </form>
          <p className="header-area">
            Khu vực mẫu
            <br />
            <strong>Quận 1, TP.HCM</strong>
          </p>
          {siteTools && <AccountEntry />}
        </div>
        <nav
          className="app-container desktop-navigation"
          aria-label="Điều hướng chính"
        >
          {primaryNavigation.filter(({ to }) => to !== "/profile").map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"}>
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="app-container page-content"
        data-layout={layout}
      >
        {!auth && (
          <p className="sample-notice">
            Dữ liệu minh họa — giá, đánh giá và khoảng cách chưa được xác minh
            theo thời gian thực.
          </p>
        )}
        <Outlet />
      </main>
      {siteTools && <SiteFooter />}
      {siteTools && <BackToTop />}
    </div>
  )
}
