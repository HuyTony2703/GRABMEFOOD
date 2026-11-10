import assert from "node:assert/strict"
import { test } from "node:test"
import {
  parseMenuPrice,
  summarizeMenu,
  averageScore,
  ratingDistribution,
  formatPrice,
} from "../src/app/components/insights/insightCalculations.ts"

test("reads both price formats already used by the project", () => {
  assert.equal(parseMenuPrice("65,000đ"), 65000)
  assert.equal(parseMenuPrice("45k"), 45000)
  assert.equal(parseMenuPrice("30k"), 30000)
  assert.equal(parseMenuPrice("45.000 ₫"), 45000)
  assert.equal(parseMenuPrice(" 35 K "), 35000)
  assert.equal(parseMenuPrice("32,5k"), 32500)
})

test("does not invent exact prices from a range or unavailable price", () => {
  for (const price of ["50-80k", "Liên hệ", "", "NaNk", "-20k", "20k/món"]) {
    assert.equal(parseMenuPrice(price), null, price)
  }
})

test("budget changes the eligible count and keeps original menu order", () => {
  const items = [
    { id: "1", price: "65,000đ" },
    { id: "2", price: "55,000đ" },
    { id: "3", price: "60,000đ" },
    { id: "4", price: "45,000đ" },
    { id: "5", price: "40,000đ" },
    { id: "6", price: "50,000đ" },
  ]
  assert.deepEqual(
    summarizeMenu(items, 45000).affordableItems.map((item) => item.id),
    ["4", "5"],
  )
  assert.equal(summarizeMenu(items, 65000).affordableItems.length, 6)
  assert.equal(summarizeMenu(items, 39000).affordableItems.length, 0)
  assert.equal(summarizeMenu(items, Infinity).min, 40000)
  assert.equal(summarizeMenu(items, Infinity).max, 65000)
  assert.equal(items[0].price, "65,000đ")
})

test("handles missing prices, no menu, and a single-price menu", () => {
  assert.equal(summarizeMenu([], 50000).min, null)
  assert.equal(summarizeMenu([{ id: "1", price: "Liên hệ" }], 50000).max, null)
  const summary = summarizeMenu(
    [
      { id: "1", price: "45k" },
      { id: "2", price: "0đ" },
      { id: "3", price: "40-60k" },
    ],
    45000,
  )
  assert.equal(summary.min, 45000)
  assert.equal(summary.max, 45000)
  assert.equal(summary.pricedItems.length, 1)
})

test("service mean comes only from valid displayed review scores", () => {
  assert.equal(averageScore([4.5, 5]), 4.75)
  assert.equal(averageScore([4.5, 5, NaN, -1, 6, Infinity]), 4.75)
  assert.equal(averageScore([]), null)
  assert.equal(averageScore([0]), 0)
})

test("fractional star ratings are counted once without rounding up", () => {
  const buckets = ratingDistribution([5, 4.5])
  assert.equal(buckets[0].count, 1)
  assert.equal(buckets[1].count, 1)
  assert.equal(buckets[0].percent, 50)
  assert.equal(buckets[1].percent, 50)
  assert.equal(
    buckets.reduce((sum, bucket) => sum + bucket.count, 0),
    2,
  )
  assert.equal(
    buckets.reduce((sum, bucket) => sum + bucket.percent, 0),
    100,
  )
})

test("distribution handles all boundaries, invalid values, and empty input", () => {
  const buckets = ratingDistribution([
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    0,
    6,
    NaN,
  ])
  assert.deepEqual(
    buckets.map((bucket) => bucket.count),
    [1, 2, 2, 2, 2],
  )
  assert.ok(ratingDistribution([]).every((bucket) => bucket.percent === 0))
})

test("formats currency without an invented price suffix or discount", () => {
  assert.equal(formatPrice(45000), "45.000đ")
})
