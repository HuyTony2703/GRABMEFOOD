import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { existsSync } from "node:fs"
import { test } from "node:test"

const source = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8")

test("footer exposes only established destinations and marks missing owner information", () => {
  const footer = source("src/app/components/layout/SiteFooter.tsx")
  const destinations = [...footer.matchAll(/to="([^"]+)"/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(
    new Set(destinations),
    new Set(["/settings/guide", "/settings/support", "/settings/terms"]),
  )
  assert.equal((footer.match(/<section /g) ?? []).length, 6)
  for (const label of [
    "Email — Cần bổ sung",
    "Số điện thoại — Cần bổ sung",
    "Địa chỉ đơn vị vận hành — Cần bổ sung",
    "Chính sách riêng tư độc lập — Cần bổ sung",
    "Liên kết mạng xã hội chính thức — Cần bổ sung",
    "Chủ thể sở hữu/đơn vị vận hành — Cần xác nhận",
  ])
    assert.ok(footer.includes(label))
  assert.doesNotMatch(footer, /href="#"|mailto:|tel:|https?:\/\//)
})

test("account entry is explicitly a guest link, not a fabricated authenticated session", () => {
  const entry = source("src/app/components/layout/AccountEntry.tsx")
  assert.match(entry, /to="\/profile"/)
  assert.match(entry, /Tài khoản — chưa xác thực; xem hồ sơ minh họa/)
  assert.match(entry, /<span>Chưa xác thực<\/span>/)
  assert.doesNotMatch(entry, /<img|localStorage|sessionStorage|Nguyễn Văn A/)
})

test("site tools retain exclusions and stable keyboard focus target", () => {
  const frame = source("src/app/components/layout/AppFrame.tsx")
  assert.match(frame, /hideSiteTools/)
  assert.match(frame, /id="main-content"/)
  assert.match(frame, /tabIndex=\{-1\}/)
  assert.match(
    source("src/app/routes.tsx"),
    /path: "\*",\s*handle: \{ hideSiteTools: true \}/,
  )
  const control = source("src/app/components/layout/BackToTop.tsx")
  assert.match(control, /window.scrollY > 400/)
  assert.match(control, /hidden=\{!visible\}/)
  assert.match(control, /aria-label="Lên đầu trang"/)
  assert.match(control, /focus\(\{ preventScroll: true \}\)/)
  assert.match(control, /behavior: "instant"/)
})

test("desktop is the default layout and mobile-only navigation has been removed", () => {
  assert.equal(existsSync(new URL("../../src/app/components/layout/BottomNav.tsx", import.meta.url)), false)
  const css = source("src/styles/app.css")
  assert.match(css, /min-inline-size: 1024px/)
  assert.doesNotMatch(css, /mobile-nav|safe-area-inset|@media \(max-width|@media \(min-width: (640|768|1024)px/)
  for (const page of ["discovery/HomePage", "discovery/MapPage", "discovery/RandomPage", "favorites/FavoritesPage", "profile/ProfilePage"])
    assert.doesNotMatch(source(`src/app/pages/${page}.tsx`), /BottomNav|sm:/)
})

test("new dish links use validated scoped catalog and standalone fixtures remain retained", () => {
  const catalog = source("src/app/lib/catalog.ts")
  assert.doesNotMatch(catalog, /href:.*\/dish\//)
  assert.match(catalog, /discoveryDishes = menuDishes/)
  assert.match(catalog, /favoriteDishChoices = menuDishes/)
  assert.match(catalog, /legacyDishDetails/)
  const retained = source("src/app/data/legacyDishes.ts")
  for (const id of ["1", "2", "3", "pho-ga", "pho-bo-tai", "pho-bo-chin", "pho-chay", "pho-hai-san"])
    assert.ok(retained.includes(`id: "${id}"`))
  assert.equal(existsSync(new URL("../../src/app/pages/details/DishDetailPage.tsx", import.meta.url)), false)
})

test("filter captures its opener before autofocus and reduced motion covers portal dialogs", () => {
  const filter = source("src/app/components/discovery/FilterModal.tsx")
  assert.match(filter, /onOpenAutoFocus=\{\(\) => \{\s*opener\.current = document\.activeElement/)
  assert.match(filter, /opener\.current\?\.focus\(\)/)
  const css = source("src/styles/app.css")
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.match(css, /data-slot="dialog-content"/)
  assert.match(css, /data-slot="alert-dialog-content"/)
})
