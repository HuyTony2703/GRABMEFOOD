export interface Criteria {
  q?: string
  category?: string
  price?: string
  distance?: string
  types?: string
  sort?: string
}

// Keep source order and identity; never manufacture records to fill a row.
export function selectAdditionalMenuDishes<T extends {
  href: string
  restaurantName?: string
},>(menu: T[], displayed: { href: string }[]): T[] {
  const seen = new Set(displayed.map((dish) => dish.href))
  return menu
    .filter((dish) => {
      if (!dish.restaurantName?.trim() ||
          !/^\/restaurant\/[^/]+\/dish\/[^/]+$/.test(dish.href) ||
          seen.has(dish.href))
        return false
      seen.add(dish.href)
      return true
    })
    .slice(0, 3)
}
interface Searchable {
  name: string
  cuisine?: string
  price?: string
  distance?: string
  rating?: number
}
const filterKeys = ["price", "distance", "types", "cuisines"]
export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
const cuisineNames: Record<string, string> = {
  Cafe: "Cà phê",
  Noodles: "Món nước",
  Hotpot: "Lẩu",
  Snacks: "Ăn nhẹ",
  Vietnamese: "Món Việt",
  "Fast Food": "Đồ ăn nhanh",
  Italian: "Món Ý",
  "Milk Tea": "Trà sữa",
  Japanese: "Món Nhật",
}
export const cuisineLabel = (value?: string) =>
  value ? (cuisineNames[value] ?? value) : ""
export function parsePriceRange(value?: string): [number, number] | null {
  if (!value || /^\s*-/.test(value)) return null
  const compact = value
    .trim()
    .replace(/(?:đ|₫|vnd)/gi, "")
    .replace(/\s/g, "")
  if (!/^[\d.,]+k?(?:[-–][\d.,]+k?)?$/i.test(compact)) return null
  const factor = /k/i.test(compact) ? 1000 : 1
  const values = compact.split(/[-–]/).map(
    (part) =>
      Number(
        part
          .replace(/k/gi, "")
          .replace(/[.,](?=\d{3}(?:\D|$))/g, "")
          .replace(",", "."),
      ) * factor,
  )
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) return null
  return [Math.min(...values), Math.max(...values)]
}
export function formatPriceRange(value?: string) {
  const range = parsePriceRange(value)
  if (!range) return value || "Chưa có giá"
  const format = (n: number) => n.toLocaleString("vi-VN")
  return range[0] === range[1]
    ? `${format(range[0])} ₫`
    : `${format(range[0])}–${format(range[1])} ₫`
}
function sampleDistance(value?: string) {
  if (!value || !/^\d+(?:[.,]\d+)?\s*(?:km|m)$/i.test(value.trim()))
    return Infinity
  return (
    Number.parseFloat(value.replace(",", ".")) / (/km/i.test(value) ? 1 : 1000)
  )
}
export function filterRecords<T extends Searchable>(
  records: T[],
  criteria: Criteria,
): T[] {
  const matches = records.filter((record) => {
    const text = normalizeText(
      `${record.name} ${record.cuisine ?? ""} ${cuisineLabel(record.cuisine)}`,
    )
    if (
      criteria.q &&
      !normalizeText(criteria.q)
        .split(/\s+/)
        .every((word) => text.includes(word))
    )
      return false
    if (criteria.category && !text.includes(normalizeText(criteria.category)))
      return false
    if (
      criteria.types &&
      !criteria.types.split(",").some((type) => record.cuisine === type)
    )
      return false
    if (criteria.price) {
      if (criteria.price !== "200+" && !/^\d+-\d+$/.test(criteria.price)) return false
      const range = parsePriceRange(record.price)
      const [min, max] =
        criteria.price === "200+"
          ? [200000, Infinity]
          : criteria.price
              .split("-")
              .map(Number)
              .map((n) => n * 1000)
      if (
        !range ||
        !Number.isFinite(min) ||
        max === undefined ||
        Number.isNaN(max) ||
        min < 0 ||
        max < min ||
        range[1] < min ||
        range[0] > max
      )
        return false
    }
    if (criteria.distance) {
      const d = sampleDistance(record.distance)
      if (
        !Number.isFinite(d) ||
        (criteria.distance !== "5+" && (!Number.isFinite(Number(criteria.distance)) || Number(criteria.distance) < 0)) ||
        (criteria.distance === "5+" ? d <= 5 : d > Number(criteria.distance))
      )
        return false
    }
    return true
  })
  const value = (record: T) =>
    criteria.sort === "rating"
      ? -(record.rating ?? -Infinity)
      : criteria.sort === "distance"
        ? sampleDistance(record.distance)
        : (parsePriceRange(record.price)?.[0] ?? Infinity)
  return ["rating", "distance", "price"].includes(criteria.sort ?? "")
    ? matches.sort((a, b) => value(a) - value(b))
    : matches
}
export function readCriteria(params: URLSearchParams): Criteria {
  return Object.fromEntries(
    ["q", "category", "price", "distance", "types", "sort"].map((key) => [
      key,
      params.get(key) ?? "",
    ]),
  )
}
export function resetFilters(params: URLSearchParams) {
  const next = new URLSearchParams(params)
  filterKeys.forEach((key) => next.delete(key))
  return next
}
