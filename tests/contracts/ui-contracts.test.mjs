import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync } from "node:fs"
const source = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8")
test("all original route paths remain with a shared frame", () => {
  const routes = source("src/app/routes.tsx")
  assert.equal([...routes.matchAll(/path:/g)].length, 26)
  assert.match(routes, /Component: AppFrame/)
  for (const path of [
    "/restaurant/:id",
    "/restaurant/:restaurantId/dish/:dishId",
    "/settings/terms",
    "/settings/support",
    "*",
  ])
    assert.ok(routes.includes(`path: "${path}"`))
})
test("unknown detail identifiers never substitute another record", () => {
  assert.match(
    source("src/app/pages/details/LegacyDishPage.tsx"),
    /result.status === "unique"/,
  )
  assert.doesNotMatch(
    source("src/app/pages/details/LegacyDishPage.tsx"),
    /dishesData|todayDish|RecordDetail/,
  )
  assert.match(
    source("src/app/pages/details/RestaurantDetailPage.tsx"),
    /if \(!restaurant\)\s+return/,
  )
  assert.match(
    source("src/app/pages/details/DishAtRestaurantPage.tsx"),
    /if \(!owner \|\| !scopedDish\)\s+return/,
  )
})
test("sensitive actions never log credentials or fake successful service submissions", () => {
  for (const name of [
    "auth/LoginPage",
    "auth/RegisterPage",
    "settings/SupportChatPage",
    "details/DishAtRestaurantPage",
    "details/RestaurantDetailPage",
  ]) {
    const text = source(`src/app/pages/${name}.tsx`)
    assert.doesNotMatch(text, /console\.log|setTimeout\([\s\S]*botResponse/)
    assert.match(text, /chưa|Chưa/)
  }
})
test("one installed theme system, approved shared brand red", () => {
  assert.match(source("src/app/App.tsx"), /ThemeProvider\s+attribute="class"/)
  assert.match(source("src/app/pages/settings/ThemeSettingsPage.tsx"), /useTheme/)
  const css = source("src/styles/theme.css")
  assert.match(css, /\.dark\s*\{[\s\S]*?--primary: #DC2626/)
  assert.doesNotMatch(css, /--background-dark:/)
})
test("canonical discovery records and scoped menu ownership are explicit", () => {
  const catalog = source("src/app/lib/catalog.ts")
  assert.match(
    catalog,
    /allRestaurants = \[\.\.\.nearbyRestaurants, \.\.\.saleRestaurants\]/,
  )
  assert.match(catalog, /buildScopedDishes\(allRestaurants, \{ "1": phoSampleMenu \}\)/)
  assert.match(catalog, /legacyDishRelationships: readonly DishRelationship\[\] = \[\]/)
  assert.match(catalog, /id: "pho-ga"/)
  assert.doesNotMatch(
    source("src/app/pages/discovery/MapPage.tsx"),
    /restaurantPositions|animate-ping|restaurantLat/,
  )
})
test("image failures and missing fields are explicit, not invented data", () => {
  assert.match(source("src/app/components/media/ContentImage.tsx"), /onError/)
  assert.match(
    source("src/app/components/details/RecordDetail.tsx"),
    /record\.rating != null/,
  )
  assert.match(
    source("src/app/components/details/RecordDetail.tsx"),
    /Chưa có điểm đánh giá/,
  )
})
