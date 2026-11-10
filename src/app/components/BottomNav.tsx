import { Home, Map, Dices, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Trang chủ" },
    { path: "/map", icon: Map, label: "Bản đồ" },
    { path: "/random", icon: Dices, label: "Ngẫu nhiên" },
    { path: "/favorites", icon: Heart, label: "Yêu thích" },
    { path: "/profile", icon: User, label: "Tôi" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-red-600" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-red-600" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
