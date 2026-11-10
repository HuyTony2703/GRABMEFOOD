export function parseMenuPrice(price: string): number | null {
  const normalized = price.trim().toLowerCase()
  const thousands = normalized.match(/^(\d+(?:[.,]\d+)?)\s*k$/)
  if (thousands) return Number(thousands[1].replace(",", ".")) * 1000
  if (!/^\d+(?:[.,]\d{3})*\s*(?:đ|₫|vnd)?$/.test(normalized)) return null
  return Number(normalized.replace(/(?:đ|₫|vnd|\s|[.,])/g, ""))
}

export interface MenuPriceItem {
  id: string
  price: string
}

export function summarizeMenu<T extends MenuPriceItem>(
  items: T[],
  budget: number,
) {
  const pricedItems = items.flatMap((item) => {
    const price = parseMenuPrice(item.price)
    return price !== null && price > 0 ? [{ ...item, amount: price }] : []
  })
  const amounts = pricedItems.map((item) => item.amount)
  return {
    pricedItems,
    affordableItems: pricedItems.filter((item) => item.amount <= budget),
    min: amounts.length ? Math.min(...amounts) : null,
    max: amounts.length ? Math.max(...amounts) : null,
  }
}

export function averageScore(values: number[]): number | null {
  const valid = values.filter(
    (value) => Number.isFinite(value) && value >= 0 && value <= 5,
  )
  return valid.length
    ? valid.reduce((sum, value) => sum + value, 0) / valid.length
    : null
}

export function ratingDistribution(values: number[]) {
  const valid = values.filter(
    (value) => Number.isFinite(value) && value >= 1 && value <= 5,
  )
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = valid.filter((value) => Math.floor(value) === stars).length
    return {
      stars,
      label: stars === 5 ? "5 sao" : `${stars} đến dưới ${stars + 1} sao`,
      count,
      percent: valid.length ? (count / valid.length) * 100 : 0,
    }
  })
}

export const formatPrice = (amount: number) =>
  `${new Intl.NumberFormat("vi-VN").format(amount)}đ`
