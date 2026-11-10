import { RouterProvider } from "react-router"

import { router } from "@/app/routes"
import { ThemeProvider } from "next-themes"
import { FavoritesProvider } from "@/app/contexts/FavoritesContext"

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="grabmefood-theme"
      disableTransitionOnChange
    >
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </ThemeProvider>
  )
}
