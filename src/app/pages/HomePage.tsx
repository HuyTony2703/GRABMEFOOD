import { MapPin, Search, SlidersHorizontal, Coffee, Soup, Beef, Flame, IceCream, Salad, ChevronRight, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { RestaurantCard } from "../components/RestaurantCard";
import { nearbyRestaurants, saleRestaurants, todaysFoods } from "../data/restaurants";
import { useState } from "react";
import { FilterModal } from "../components/FilterModal";

export function HomePage() {
  const [location] = useState("Quận 1, TP.HCM");
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { icon: Coffee, label: "Cà phê" },
    { icon: Soup, label: "Phở" },
    { icon: Beef, label: "Món thịt" },
    { icon: Flame, label: "Món nướng" },
    { icon: IceCream, label: "Kem" },
    { icon: Salad, label: "Rau xanh" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs text-gray-500">Địa chỉ</p>
                <p className="text-sm">{location}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/notifications")}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></div>
            </button>
          </div>

          <div className="flex gap-2">
            <div
              className="flex-1 relative cursor-pointer"
              onClick={() => navigate('/search')}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <div className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-500">
                Tìm món ăn, quán ăn...
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => {
                setSelectedCategory(label);
                navigate('/search');
              }}
              className="flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-xl bg-red-50 flex-shrink-0 transition-all hover:scale-105"
            >
              <Icon className="w-6 h-6 text-red-600" />
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-lg">Quán gần tôi</h2>
          <Link to="/all-restaurants?section=nearby" className="flex items-center gap-1 text-red-600 text-sm">
            Xem thêm
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {nearbyRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-lg">Món ngon hôm nay</h2>
          <Link to="/all-restaurants?section=today" className="flex items-center gap-1 text-red-600 text-sm">
            Xem thêm
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {todaysFoods.map((food) => (
            <Link
              key={food.id}
              to={`/dish/${food.id === "11" ? "1" : food.id === "12" ? "2" : "3"}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 w-64 hover:shadow-md transition-shadow"
            >
              <div className="relative h-40">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm mb-1 text-black">{food.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs">{food.rating}</span>
                    <span className="text-xs text-gray-400">({food.reviews}+)</span>
                  </div>
                  <span className="text-red-600 text-sm">{food.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-lg">Giảm giá</h2>
          <Link to="/all-restaurants?section=sale" className="flex items-center gap-1 text-red-600 text-sm">
            Xem thêm
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {saleRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      <BottomNav />
    </div>
  );
}