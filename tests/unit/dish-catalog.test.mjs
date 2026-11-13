import assert from "node:assert/strict"
import { test } from "node:test"
import {
  buildScopedDishes,
  dishPairKey,
  getScopedDish,
  resolveLegacyDish,
  resolveLinkedDishes,
} from "../../src/app/lib/dishCatalog.ts"
import { nearbyRestaurants, saleRestaurants, todaysFoods } from "../../src/app/data/restaurants.ts"

const item = (id, name = "Món mẫu") => ({ id, name, price: "45k", image: "sample.jpg" })
const owners = [
  { id: "a", name: "Quán A", dishes: [item("1"), item("2")] },
  { id: "b", name: "Quán B", dishes: [item("1")] },
]
const dishes = buildScopedDishes(owners)
const legacy = [{ id: "old" }, { id: "1" }]
const link = (restaurantId, dishId = "1") => ({ legacyDishId: "old", restaurantId, dishId })

test("catalog preserves nested source values, order, ownership and input immutability", () => {
  const input = [...nearbyRestaurants, ...saleRestaurants]
  const before = structuredClone(input)
  const actual = buildScopedDishes(input)
  assert.equal(actual.length, 8)
  assert.deepEqual(actual.map(d => d.id), ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"])
  assert.equal(actual[0].restaurantId, "5")
  assert.equal(actual[0].restaurantName, "Hủ Tiếu Bé Bơ")
  assert.equal(actual[0].price, "45k")
  assert.equal(actual[0].href, "/restaurant/5/dish/d1")
  assert.equal(actual[5].restaurantId, "14")
  assert.deepEqual(input, before)
})

test("scoped samples require existing named owners, preserve nested precedence, and append stably", () => {
  const sample = { a: [item("fake")], c: [item("1")], missing: [item("x")] }
  const before = structuredClone(sample)
  const actual = buildScopedDishes([...owners, { id: "c", name: "Quán C" }], sample)
  assert.deepEqual(actual.map(d => [d.restaurantId, d.id]), [["a", "1"], ["a", "2"], ["b", "1"], ["c", "1"]])
  assert.deepEqual(sample, before)
})

test("invalid owners/items are omitted; duplicate pair cannot duplicate cards or replace price", () => {
  const actual = buildScopedDishes([
    { id: "", name: "Missing ID", dishes: [item("x")] },
    { id: "blank", name: " ", dishes: [item("x")] },
    { id: "ok", name: "Owner", dishes: [item(""), item("x", " "), item("1"), { ...item("1"), price: "999k" }] },
  ])
  assert.equal(actual.length, 1)
  assert.equal(actual[0].price, "45k")
})

test("exact pair lookup rejects unknown owner, mismatched pair, inherited-property IDs and missing IDs", () => {
  assert.equal(getScopedDish(dishes, "a", "1"), dishes[0])
  for (const [owner, id] of [["b", "2"], ["unknown", "1"], ["constructor", "1"], ["a", "constructor"], [undefined, "1"]])
    assert.equal(getScopedDish(dishes, owner, id), undefined)
})

test("same IDs/names, restaurantIds alone and legacy source existence never invent a redirect", () => {
  assert.deepEqual(resolveLegacyDish("1", legacy, [], dishes), { status: "missing" })
  assert.deepEqual(resolveLegacyDish("1", [{ id: "1", restaurantIds: ["a"] }], [], dishes), { status: "missing" })
  assert.deepEqual(resolveLegacyDish("constructor", legacy, [link("a")], dishes), { status: "missing" })
  assert.deepEqual(resolveLegacyDish(undefined, legacy, [], dishes), { status: "missing" })
  assert.deepEqual(resolveLegacyDish("old", [], [link("a")], dishes), { status: "missing" })
})

test("unique legacy target requires explicit valid relationship; repeated same-pair links are not ambiguous", () => {
  const links = [link("missing"), link("b", "2"), link("a"), link("a")]
  const before = structuredClone(links)
  assert.deepEqual(resolveLegacyDish("old", legacy, links, dishes), { status: "unique", dish: dishes[0] })
  assert.deepEqual(links, before)
  assert.deepEqual(resolveLegacyDish("old", legacy, [link("missing")], dishes), { status: "missing" })
})

test("multiple distinct legacy targets are ambiguous, never the first restaurant", () => {
  assert.deepEqual(resolveLegacyDish("old", legacy, [link("a"), link("b")], dishes), { status: "ambiguous" })
})

test("linked display pools omit unlinked, ambiguous and invalid records; deduplicate before counting", () => {
  assert.deepEqual(resolveLinkedDishes(todaysFoods, [], dishes), [])
  assert.deepEqual(resolveLinkedDishes(legacy, [link("a"), link("b")], dishes), [])
  assert.deepEqual(resolveLinkedDishes([...legacy, ...legacy], [link("a")], dishes), [dishes[0]])
})

test("favorite pair identities separate duplicate IDs and ambiguous separators", () => {
  assert.notEqual(dishPairKey("a", "1"), dishPairKey("b", "1"))
  assert.notEqual(dishPairKey("a:b", "c"), dishPairKey("a", "b:c"))
  const saved = new Set([dishes[0].favoriteKey])
  assert.deepEqual(dishes.filter(d => saved.has(d.favoriteKey)), [dishes[0]])
  saved.add(dishes[2].favoriteKey)
  saved.delete(dishes[0].favoriteKey)
  assert.deepEqual(dishes.filter(d => saved.has(d.favoriteKey)), [dishes[2]])
  assert.deepEqual(dishes.filter(d => new Set(["1", "d1"]).has(d.favoriteKey)), [])
})

test("route segments encode special characters without changing source IDs", () => {
  const actual = buildScopedDishes([{ id: "quán /1", name: "Quán", dishes: [item("món/?")] }])[0]
  assert.equal(actual.id, "món/?")
  assert.equal(actual.href, `/restaurant/${encodeURIComponent("quán /1")}/dish/${encodeURIComponent("món/?")}`)
})
