import { createContext, useContext, useState, type ReactNode } from "react"
type Kind = "dish" | "restaurant"
const initialDishes = ["1", "2", "3", "d1", "d6", "pho-ga", "pho-bo-tai"]
// Retain legacy seed IDs without guessing scoped favorites. New saves use dishPairKey.
const initialRestaurants = ["1", "2", "5", "6", "14", "4", "8"]
const Context = createContext<{
  has: (kind: Kind, id: string) => boolean
  toggle: (kind: Kind, id: string) => void
  remove: (kind: Kind, ids: string[]) => void
} | null>(null)
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(
    () =>
      new Set([
        ...initialDishes.map((id) => `dish:${id}`),
        ...initialRestaurants.map((id) => `restaurant:${id}`),
      ]),
  )
  return (
    <Context.Provider
      value={{
        has: (kind, id) => items.has(`${kind}:${id}`),
        toggle: (kind, id) =>
          setItems((old) => {
            const next = new Set(old)
            const key = `${kind}:${id}`
            next.has(key) ? next.delete(key) : next.add(key)
            return next
          }),
        remove: (kind, ids) =>
          setItems((old) => {
            const next = new Set(old)
            ids.forEach((id) => next.delete(`${kind}:${id}`))
            return next
          }),
      }}
    >
      {children}
    </Context.Provider>
  )
}
export function useFavorites() {
  const value = useContext(Context)
  if (!value) throw new Error("FavoritesProvider is required")
  return value
}
