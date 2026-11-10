import { createBrowserRouter } from "react-router";
import { WelcomePage } from "./pages/WelcomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { RandomPage } from "./pages/RandomPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RestaurantDetailPage } from "./pages/RestaurantDetailPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { DishDetailPage } from "./pages/DishDetailPage";
import { DishAtRestaurantPage } from "./pages/DishAtRestaurantPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AllRestaurantsPage } from "./pages/AllRestaurantsPage";
import { AllReviewsPage } from "./pages/AllReviewsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import { AddressSettingsPage } from "./pages/AddressSettingsPage";
import { NotificationSettingsPage } from "./pages/NotificationSettingsPage";
import { LanguageSettingsPage } from "./pages/LanguageSettingsPage";
import { ThemeSettingsPage } from "./pages/ThemeSettingsPage";
import { SupportChatPage } from "./pages/SupportChatPage";
import { TermsPage } from "./pages/TermsPage";
import { GuidePage } from "./pages/GuidePage";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter([
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
]);