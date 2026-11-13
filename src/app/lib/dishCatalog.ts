// Pure adapters: source IDs, prices and relationships are never inferred or changed.
export interface MenuRecord {
  id: string
  name: string
  image: string
  price: string
  rating?: number
  reviews?: number
  cuisine?: string
}

export interface MenuOwner {
  id: string
  name: string
  dishes?: readonly MenuRecord[]
}

export interface ScopedDish extends MenuRecord {
  restaurantId: string
  restaurantName: string
  favoriteKey: string
  href: string
}

export interface DishRelationship {
  legacyDishId: string
  restaurantId: string
  dishId: string
}

export function dishPairKey(restaurantId: string, dishId: string) {
  return JSON.stringify([restaurantId, dishId])
}

export function buildScopedDishes(
  restaurants: readonly MenuOwner[],
  sampleMenus: Readonly<Record<string, readonly MenuRecord[]>> = {},
): ScopedDish[] {
  const result: ScopedDish[] = []
  const seen = new Set<string>()
  const add = (owner: MenuOwner, dishes: readonly MenuRecord[]) => {
    if (!owner.id.trim() || !owner.name.trim()) return
    for (const dish of dishes) {
      if (!dish.id.trim() || !dish.name.trim()) continue
      const favoriteKey = dishPairKey(owner.id, dish.id)
      if (seen.has(favoriteKey)) continue
      seen.add(favoriteKey)
      result.push({
        ...dish,
        restaurantId: owner.id,
        restaurantName: owner.name,
        favoriteKey,
        href: `/restaurant/${encodeURIComponent(owner.id)}/dish/${encodeURIComponent(dish.id)}`,
      })
    }
  }
  // Preserve existing nested-menu source order, then append explicitly scoped samples.
  for (const restaurant of restaurants) add(restaurant, restaurant.dishes ?? [])
  for (const restaurant of restaurants) {
    if (!restaurant.dishes && Object.prototype.hasOwnProperty.call(sampleMenus, restaurant.id))
      add(restaurant, sampleMenus[restaurant.id])
  }
  return result
}

export function getScopedDish(
  dishes: readonly ScopedDish[],
  restaurantId?: string,
  dishId?: string,
) {
  return dishes.find(
    (dish) => dish.restaurantId === restaurantId && dish.id === dishId,
  )
}

export type LegacyResolution =
  | { status: "unique"; dish: ScopedDish }
  | { status: "missing" | "ambiguous" }

export function resolveLegacyDish(
  id: string | undefined,
  legacyRecords: readonly { id: string }[],
  relationships: readonly DishRelationship[],
  scopedDishes: readonly ScopedDish[],
): LegacyResolution {
  if (!id || !legacyRecords.some((dish) => dish.id === id))
    return { status: "missing" }
  const targets = new Map<string, ScopedDish>()
  for (const relationship of relationships) {
    if (relationship.legacyDishId !== id) continue
    const target = getScopedDish(
      scopedDishes,
      relationship.restaurantId,
      relationship.dishId,
    )
    if (target) targets.set(target.favoriteKey, target)
  }
  if (targets.size === 1)
    return { status: "unique", dish: targets.values().next().value! }
  return { status: targets.size ? "ambiguous" : "missing" }
}

export function resolveLinkedDishes(
  records: readonly { id: string }[],
  relationships: readonly DishRelationship[],
  scopedDishes: readonly ScopedDish[],
) {
  const seen = new Set<string>()
  return records.flatMap((record) => {
    const result = resolveLegacyDish(record.id, records, relationships, scopedDishes)
    if (result.status !== "unique" || seen.has(result.dish.favoriteKey)) return []
    seen.add(result.dish.favoriteKey)
    return [result.dish]
  })
}
