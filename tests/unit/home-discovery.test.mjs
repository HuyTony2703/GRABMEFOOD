import assert from "node:assert/strict"
import { test } from "node:test"
import { selectAdditionalMenuDishes } from "../../src/app/lib/discovery.ts"

test("additional menu dishes preserve source order, ownership and unique destinations", () => {
  const source = [
    { href: "/dish/existing", restaurantName: "Quán mẫu" },
    { href: "/restaurant/1/dish/a", restaurantName: "Quán mẫu", price: "45k" },
    { href: "/restaurant/1/dish/a", restaurantName: "Quán mẫu" },
    { href: "/dish/no-owner" },
    { href: "/restaurant/1/dish/b", restaurantName: "Quán mẫu" },
    { href: "/restaurant/1/dish/c", restaurantName: "Quán mẫu" },
    { href: "/restaurant/1/dish/d", restaurantName: "Quán mẫu" },
  ]
  const before = structuredClone(source)
  const selected = selectAdditionalMenuDishes(source, [
    { href: "/dish/existing" },
  ])
  assert.deepEqual(selected, [source[1], source[4], source[5]])
  assert.equal(selected[0], source[1])
  assert.deepEqual(source, before)
})

test("additional menu dishes do not fill missing records or invent owners", () => {
  assert.deepEqual(selectAdditionalMenuDishes([], []), [])
  assert.deepEqual(selectAdditionalMenuDishes([{ href: "/dish/1" }], []), [])
  const one = { href: "/restaurant/1/dish/1", restaurantName: "Quán mẫu" }
  assert.deepEqual(selectAdditionalMenuDishes([one], []), [one])
  assert.deepEqual(selectAdditionalMenuDishes([one], [one]), [])
  assert.deepEqual(selectAdditionalMenuDishes([{ ...one, restaurantName: " " }], []), [])
  assert.deepEqual(selectAdditionalMenuDishes([{ href: "/dish/unlinked", restaurantName: "Quán mẫu" }], []), [])
})
