import { createBrowserRouter } from "react-router"

import { WelcomePage } from "@/app/pages/onboarding/WelcomePage"

import { OnboardingPage } from "@/app/pages/onboarding/OnboardingPage"

import { HomePage } from "@/app/pages/discovery/HomePage"

import { MapPage } from "@/app/pages/discovery/MapPage"

import { RandomPage } from "@/app/pages/discovery/RandomPage"

import { FavoritesPage } from "@/app/pages/favorites/FavoritesPage"

import { ProfilePage } from "@/app/pages/profile/ProfilePage"

import { LoginPage } from "@/app/pages/auth/LoginPage"

import { RegisterPage } from "@/app/pages/auth/RegisterPage"

import { RestaurantDetailPage } from "@/app/pages/details/RestaurantDetailPage"

import { SearchResultsPage } from "@/app/pages/discovery/SearchResultsPage"

import { DishDetailPage } from "@/app/pages/details/DishDetailPage"

import { DishAtRestaurantPage } from "@/app/pages/details/DishAtRestaurantPage"

import { NotificationsPage } from "@/app/pages/notifications/NotificationsPage"

import { AllRestaurantsPage } from "@/app/pages/discovery/AllRestaurantsPage"

import { AllReviewsPage } from "@/app/pages/profile/AllReviewsPage"

import { SettingsPage } from "@/app/pages/settings/SettingsPage"

import { AccountSettingsPage } from "@/app/pages/settings/AccountSettingsPage"

import { AddressSettingsPage } from "@/app/pages/settings/AddressSettingsPage"

import { NotificationSettingsPage } from "@/app/pages/settings/NotificationSettingsPage"

import { LanguageSettingsPage } from "@/app/pages/settings/LanguageSettingsPage"

import { ThemeSettingsPage } from "@/app/pages/settings/ThemeSettingsPage"

import { SupportChatPage } from "@/app/pages/settings/SupportChatPage"

import { TermsPage } from "@/app/pages/settings/TermsPage"

import { GuidePage } from "@/app/pages/settings/GuidePage"

import { ErrorPage } from "@/app/pages/errors/ErrorPage"
import { AppFrame } from "@/app/components/layout/AppFrame"

export const router = createBrowserRouter([
  {
    Component: AppFrame,
    children: [
      {
        path: "/welcome",

        Component: WelcomePage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/onboarding",

        Component: OnboardingPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/",

        Component: HomePage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/map",

        Component: MapPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/random",

        Component: RandomPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/favorites",

        Component: FavoritesPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/profile",

        Component: ProfilePage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/login",

        Component: LoginPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/register",

        Component: RegisterPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/restaurant/:id",

        Component: RestaurantDetailPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/restaurant/:restaurantId/dish/:dishId",

        Component: DishAtRestaurantPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/dish/:id",

        Component: DishDetailPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/search",

        Component: SearchResultsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/notifications",

        Component: NotificationsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/all-restaurants",

        Component: AllRestaurantsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/profile/reviews",

        Component: AllReviewsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings",

        Component: SettingsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/account",

        Component: AccountSettingsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/address",

        Component: AddressSettingsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/notifications",

        Component: NotificationSettingsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/language",

        Component: LanguageSettingsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/theme",

        Component: ThemeSettingsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/support",

        Component: SupportChatPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/terms",

        Component: TermsPage,

        errorElement: <ErrorPage />,
      },

      {
        path: "/settings/guide",

        Component: GuidePage,

        errorElement: <ErrorPage />,
      },

      {
        path: "*",
        Component: ErrorPage,
      },
    ],
  },
])
