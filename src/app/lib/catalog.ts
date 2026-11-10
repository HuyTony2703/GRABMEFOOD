import {
  nearbyRestaurants,
  saleRestaurants,
  todaysFoods,
} from "@/app/data/restaurants"

// Presentation adapters only: no values or persistent record schemas are changed.
export const allRestaurants = [...nearbyRestaurants, ...saleRestaurants]
// Existing default menu from RestaurantDetailPage, explicitly scoped to restaurant 1.
export const phoSampleMenu = [
  {
    id: "1",
    name: "Phở Bò Tái",
    price: "65,000đ",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
  },
  {
    id: "2",
    name: "Phở Gà",
    price: "55,000đ",
    image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400",
  },
  {
    id: "3",
    name: "Bún Chả",
    price: "60,000đ",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
  },
  {
    id: "4",
    name: "Bánh Cuốn",
    price: "45,000đ",
    image: "https://images.unsplash.com/photo-1626074353765-517a65afa1e3?w=400",
  },
  {
    id: "5",
    name: "Gỏi Cuốn",
    price: "40,000đ",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400",
  },
  {
    id: "6",
    name: "Chả Giò",
    price: "50,000đ",
    image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400",
  },
]
export function getRestaurantMenu(id?: string) {
  return (
    allRestaurants.find((restaurant) => restaurant.id === id)?.dishes ??
    (id === "1" ? phoSampleMenu : [])
  )
}
export const menuDishes = allRestaurants.flatMap((restaurant) =>
  (restaurant.dishes ?? []).map((dish) => ({
    ...dish,
    href: `/restaurant/${restaurant.id}/dish/${dish.id}`,
    restaurantName: restaurant.name,
  })),
)
export const todayDishes = todaysFoods.map((dish) => ({
  ...dish,
  href: `/dish/${dish.id}`,
}))

// Existing search fixtures, with their real detail IDs rather than unrelated numeric IDs.
export const phoDishes = [
  {
    id: "pho-ga",
    name: "Phở Gà",
    rating: 4.8,
    reviews: 1245,
    price: "45-70k",
    image: "https://images.unsplash.com/photo-1759770753108-dc559a3d35b6?w=400",
  },
  {
    id: "pho-bo-tai",
    name: "Phở Bò Tái",
    rating: 4.9,
    reviews: 2678,
    price: "50-85k",
    image: "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?w=400",
  },
  {
    id: "pho-bo-chin",
    name: "Phở Bò Chín",
    rating: 4.7,
    reviews: 987,
    price: "50-80k",
    image: "https://images.unsplash.com/photo-1730900979914-7e34981744b0?w=400",
  },
  {
    id: "pho-chay",
    name: "Phở Chay",
    rating: 4.6,
    reviews: 456,
    price: "40-60k",
    image: "https://images.unsplash.com/photo-1680084570772-1da0c78362a4?w=400",
  },
  {
    id: "pho-hai-san",
    name: "Phở Hải Sản",
    rating: 4.5,
    reviews: 312,
    price: "60-95k",
    image: "https://images.unsplash.com/photo-1748264106369-3b5fc990b3b9?w=400",
  },
].map((dish) => ({ ...dish, href: `/dish/${dish.id}` }))
export const discoveryDishes = [...todayDishes, ...menuDishes, ...phoDishes]
// Existing favorite fixtures 1–3 retain their own values; do not overwrite today's records.
export const favoriteDishChoices = [
  {
    id: "1",
    name: "Cơm Tấm Sườn Nướng",
    rating: 4.8,
    reviews: 1567,
    price: "35-60k",
    image: todaysFoods[0].image,
    href: "/dish/1",
  },
  {
    id: "2",
    name: "Bún Chả Hà Nội",
    rating: 4.9,
    reviews: 2134,
    price: "40-70k",
    image: todaysFoods[1].image,
    href: "/dish/2",
  },
  {
    id: "3",
    name: "Gỏi Cuốn Tôm Thịt",
    rating: 4.7,
    reviews: 982,
    price: "25-45k",
    image: todaysFoods[2].image,
    href: "/dish/3",
  },
  ...menuDishes,
  ...phoDishes,
  ...todayDishes,
  ...phoSampleMenu.map((dish) => ({
    ...dish,
    id: `menu:1:${dish.id}`,
    href: `/restaurant/1/dish/${dish.id}`,
  })),
]
