import assert from "node:assert/strict"
import { test } from "node:test"
import {
  filterRecords,
  normalizeText,
  parsePriceRange,
  readCriteria,
  resetFilters,
} from "../../src/app/lib/discovery.ts"

const records = [
  {
    id: "a",
    name: "Phở Gà",
    cuisine: "Noodles",
    price: "45-70k",
    distance: "0.3 km",
    rating: 4.8,
  },
  {
    id: "b",
    name: "Cà phê",
    cuisine: "Cafe",
    price: "30-100k",
    distance: "500 m",
    rating: 4.6,
  },
  { id: "c", name: "Không có giá", price: "Liên hệ" },
]
test("Vietnamese search normalizes accents, case and đ", () => {
  assert.equal(normalizeText(" ĐẬM ĐÀ "), "dam da")
  assert.deepEqual(
    filterRecords(records, { q: "pho ga" }).map((x) => x.id),
    ["a"],
  )
  assert.deepEqual(
    filterRecords(records, { category: "Cà phê" }).map((x) => x.id),
    ["b"],
  )
})
test("price ranges preserve ranges and match by overlap, not invented exact values", () => {
  assert.deepEqual(parsePriceRange("45-70k"), [45000, 70000])
  assert.deepEqual(parsePriceRange("65,000đ"), [65000, 65000])
  assert.equal(parsePriceRange("Liên hệ"), null)
  assert.equal(parsePriceRange("-20k"), null)
  assert.deepEqual(
    filterRecords(records, { price: "50-100" }).map((x) => x.id),
    ["a", "b"],
  )
})
test("missing price is not zero; invalid criteria cannot invent matches", () => {
  for (const price of ["50-nope", "100-50", "-50", "nope"]) {
    assert.equal(filterRecords(records, { price }).length, 0, price)
  }
  assert.equal(filterRecords(records, { distance: "nope" }).length, 0)
  assert.deepEqual(
    filterRecords(records, { price: "0-50" }).map((x) => x.id),
    ["a", "b"],
  )
  assert.equal(filterRecords(records, { q: "zzzzzz" }).length, 0)
  assert.equal(filterRecords(records, { types: "Vegetarian" }).length, 0)
})
test("distance uses only the sample record, normalizing m and km", () => {
  assert.deepEqual(
    filterRecords(records, { distance: "0.5" }).map((x) => x.id),
    ["a", "b"],
  )
  assert.deepEqual(
    filterRecords(records, { distance: "1" }).map((x) => x.id),
    ["a", "b"],
  )
})
test("sorting never mutates source records and missing values sort last", () => {
  assert.equal(filterRecords(records, { sort: "rating" })[0].id, "a")
  assert.equal(filterRecords(records, { sort: "price" })[0].id, "b")
  assert.deepEqual(
    records.map((x) => x.id),
    ["a", "b", "c"],
  )
})
test("query state survives reset; only filter fields are removed", () => {
  const params = new URLSearchParams(
    "q=pho&tab=restaurants&price=0-50&types=Noodles&sort=rating",
  )
  assert.equal(readCriteria(params).price, "0-50")
  const reset = resetFilters(params)
  assert.equal(reset.get("q"), "pho")
  assert.equal(reset.get("tab"), "restaurants")
  assert.equal(reset.get("sort"), "rating")
  assert.equal(reset.has("price"), false)
  assert.equal(params.has("price"), true)
})
