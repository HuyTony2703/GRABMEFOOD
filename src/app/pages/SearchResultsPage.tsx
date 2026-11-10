import { ArrowLeft, Search, SlidersHorizontal, Star, MapPin, X } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { FilterModal } from "../components/FilterModal";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  cuisine: string;
  image: string;
  address: string;
}

interface Dish {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  avgPrice: string;
  availableAt: number;
  description: string;
  image: string;
}

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("Phở");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dishes" | "restaurants">("dishes");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const distance = searchParams.get("distance");
    const price = searchParams.get("price");
    const types = searchParams.get("types");
    const cuisines = searchParams.get("cuisines");

    if (distance || price || types || cuisines) {
      console.log("Applied filters:", { distance, price, types, cuisines });
    }
  }, [searchParams]);

  const filters = [
    "Gần tôi",
    "Đánh giá cao",
    "Giá rẻ",
    "Mới nhất",
    "Khuyến mãi",
  ];

  const dishResults: Dish[] = [
    {
      id: "1",
      name: "Phở Gà",
      rating: 4.8,
      reviews: 1245,
      avgPrice: "45-70k",
      availableAt: 28,
      description: "Hương vị đậm đà, nước dùng thanh ngọt",
      image: "https://images.unsplash.com/photo-1759770753108-dc559a3d35b6?w=400",
    },
    {
      id: "2",
      name: "Phở Bò Tái",
      rating: 4.9,
      reviews: 2678,
      avgPrice: "50-85k",
      availableAt: 35,
      description: "Hương vị chuẩn Hà Nội",
      image: "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?w=400",
    },
    {
      id: "3",
      name: "Phở Bò Chín",
      rating: 4.7,
      reviews: 987,
      avgPrice: "50-80k",
      availableAt: 22,
      description: "Thịt mềm, nước dùng đậm đà",
      image: "https://images.unsplash.com/photo-1730900979914-7e34981744b0?w=400",
    },
    {
      id: "4",
      name: "Phở Chay",
      rating: 4.6,
      reviews: 456,
      avgPrice: "40-60k",
      availableAt: 15,
      description: "Thanh đạm, bổ dưỡng",
      image: "https://images.unsplash.com/photo-1680084570772-1da0c78362a4?w=400",
    },
    {
      id: "5",
      name: "Phở Hải Sản",
      rating: 4.5,
      reviews: 312,
      avgPrice: "60-95k",
      availableAt: 18,
      description: "Hải sản tươi ngon, nước dùng thơm",
      image: "https://images.unsplash.com/photo-1748264106369-3b5fc990b3b9?w=400",
    },
  ];

  const searchResults: Restaurant[] = [
    {
      id: "1",
      name: "Phở Hà Nội",
      rating: 4.8,
      reviews: 245,
      distance: "0.3 km",
      price: "50-80k",
      cuisine: "Noodles",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
      address: "123 Nguyễn Huệ, Quận 1",
    },
    {
      id: "2",
      name: "Phở Lệ",
      rating: 4.6,
      reviews: 189,
      distance: "0.8 km",
      price: "45-70k",
      cuisine: "Noodles",
      image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400",
      address: "456 Lê Lợi, Quận 1",
    },
    {
      id: "3",
      name: "Phở Bà Dũng",
      rating: 4.9,
      reviews: 567,
      distance: "1.2 km",
      price: "60-90k",
      cuisine: "Noodles",
      image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
      address: "789 Pasteur, Quận 1",
    },
    {
      id: "4",
      name: "Phở Thìn Bờ Hồ",
      rating: 4.7,
      reviews: 432,
      distance: "1.5 km",
      price: "55-85k",
      cuisine: "Noodles",
      image: "https://images.unsplash.com/photo-1626074353765-517a65afa1e3?w=400",
      address: "321 Hai Bà Trưng, Quận 3",
    },
    {
      id: "5",
      name: "Phở Quyền",
      rating: 4.5,
      reviews: 278,
      distance: "2.0 km",
      price: "40-65k",
      cuisine: "Noodles",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400",
      address: "654 Điện Biên Phủ, Quận 3",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex gap-2 mb-3">
            <Link
              to="/"
              className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </Link>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm món ăn, quán ăn..."
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  setActiveFilter(activeFilter === filter ? null : filter)
                }
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab("dishes")}
            className={`px-4 py-3 -mb-px transition-colors ${
              activeTab === "dishes"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Món ăn
          </button>
          <button
            onClick={() => setActiveTab("restaurants")}
            className={`px-4 py-3 -mb-px transition-colors ${
              activeTab === "restaurants"
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500"
            }`}
          >
            Quán ăn
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm text-gray-600 mb-4">
          Tìm thấy {activeTab === "dishes" ? dishResults.length : searchResults.length} kết quả cho {activeTab === "dishes" ? "món ăn" : ""} "{searchQuery}"
        </p>

        {activeTab === "dishes" ? (
          <div className="space-y-3">
            {dishResults.map((dish) => (
              <Link
                key={dish.id}
                to={`/dish/${dish.id}`}
                className="flex gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 text-black">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{dish.rating}</span>
                    <span className="text-xs text-gray-400">
                      ({dish.reviews.toLocaleString()}+)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    Giá trung bình: <span className="text-red-600">{dish.avgPrice}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Có tại {dish.availableAt} quán gần bạn
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    {dish.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {searchResults.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="flex gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 text-black truncate">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{restaurant.rating}</span>
                    <span className="text-xs text-gray-400">
                      ({restaurant.reviews}+)
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 truncate">
                    {restaurant.address}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{restaurant.distance}</span>
                    </div>
                    <span className="text-red-600">{restaurant.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}