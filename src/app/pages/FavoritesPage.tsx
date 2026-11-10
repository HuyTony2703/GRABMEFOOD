import { Heart, Star, MapPin, Trash2, CheckSquare, XSquare, Edit3, Search, SlidersHorizontal } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { nearbyRestaurants, saleRestaurants } from "../data/restaurants";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FilterModal } from "../components/FilterModal";

interface Dish {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  avgPrice: string;
  category: string;
  restaurantId: string;
  restaurantName: string;
}

export function FavoritesPage() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<"dishes" | "restaurants">("dishes");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State to track which items are loved
  const [dishLovedStatus, setDishLovedStatus] = useState<Record<string, boolean>>({
    "1": true, "2": true, "3": true, "d1": true, "d6": true, "pho-ga": true, "pho-bo-tai": true
  });
  const [restaurantLovedStatus, setRestaurantLovedStatus] = useState<Record<string, boolean>>({
    "1": true, "2": true, "5": true, "6": true, "14": true, "4": true, "8": true
  });

  const toggleDishLoved = (id: string) => {
    setDishLovedStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRestaurantLoved = (id: string) => {
    setRestaurantLovedStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mock data for all dishes - each linked to a specific restaurant
  const allDishes: Dish[] = [
    {
      id: "1",
      name: "Cơm Tấm Sườn Nướng",
      image: "https://images.unsplash.com/photo-1766050587783-1c90751275dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnJva2VuJTIwcmljZSUyMGdyaWxsZWQlMjBwb3JrfGVufDF8fHx8MTc3NjMxMzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviews: 1567,
      avgPrice: "35-60k",
      category: "Món chính",
      restaurantId: "1",
      restaurantName: "Phở Hà Nội",
    },
    {
      id: "2",
      name: "Bún Chả Hà Nội",
      image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhJTIwbm9vZGxlc3xlbnwxfHx8fDE3NzYzMTMzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviews: 2134,
      avgPrice: "40-70k",
      category: "Bún",
      restaurantId: "2",
      restaurantName: "Quán Ngon Sài Gòn",
    },
    {
      id: "3",
      name: "Gỏi Cuốn Tôm Thịt",
      image: "https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwcmluZyUyMHJvbGxzJTIwdmlldG5hbWVzZSUyMGZvb2R8ZW58MXx8fHwxNzc2MzEzMzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviews: 982,
      avgPrice: "25-45k",
      category: "Khai vị",
      restaurantId: "3",
      restaurantName: "Món Việt Truyền Thống",
    },
    {
      id: "d1",
      name: "Hủ Tiếu Nam Vang",
      image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaHUlMjB0aWV1JTIwbm9vZGxlJTIwc291cHxlbnwxfHx8fDE3NzYzOTg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviews: 234,
      avgPrice: "45k",
      category: "Hủ Tiếu",
      restaurantId: "5",
      restaurantName: "Hủ Tiếu Bé Bơ",
    },
    {
      id: "d6",
      name: "Cơm Gà Xối Mỡ",
      image: "https://images.unsplash.com/photo-1677354469663-dc918927fd93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHJpY2UlMjBjb20lMjBnYXxlbnwxfHx8fDE3NzYzOTg2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviews: 456,
      avgPrice: "30k",
      category: "Cơm Gà",
      restaurantId: "14",
      restaurantName: "Cơm Gà Nguyên Ký Prime",
    },
    {
      id: "pho-ga",
      name: "Phở Gà",
      image: "https://images.unsplash.com/photo-1759770753108-dc559a3d35b6?w=400",
      rating: 4.8,
      reviews: 1245,
      avgPrice: "45-70k",
      category: "Phở",
      restaurantId: "1",
      restaurantName: "Phở Hà Nội",
    },
    {
      id: "pho-bo-tai",
      name: "Phở Bò Tái",
      image: "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?w=400",
      rating: 4.9,
      reviews: 2678,
      avgPrice: "50-85k",
      category: "Phở",
      restaurantId: "1",
      restaurantName: "Phở Hà Nội",
    },
  ];

  const allRestaurants = [
    nearbyRestaurants[0], // Phở Hà Nội
    nearbyRestaurants[1], // Highlands Coffee
    nearbyRestaurants[4], // Hủ Tiếu Bé Bơ (id: 5)
    nearbyRestaurants[5], // Cơm Gà Nguyên Ký Prime (id: 14)
    nearbyRestaurants[3], // Bánh Mì 37
    saleRestaurants[0], // KFC Discount (id: 6)
    saleRestaurants[2], // Trà Sữa Bobapop (id: 8)
  ];

  // Calculate counts
  const dishLovedCount = Object.values(dishLovedStatus).filter(Boolean).length;
  const restaurantLovedCount = Object.values(restaurantLovedStatus).filter(Boolean).length;

  const getCurrentList = () => {
    if (activeMainTab === "dishes") {
      return allDishes.filter(dish => dishLovedStatus[dish.id]);
    } else {
      return allRestaurants.filter(restaurant => restaurantLovedStatus[restaurant.id]);
    }
  };

  const displayList = getCurrentList();

  const handleSelectAll = () => {
    const allIds = displayList.map((item: any) => item.id);
    setSelectedItems(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => {
      if (activeMainTab === "dishes") {
        toggleDishLoved(id);
      } else {
        toggleRestaurantLoved(id);
      }
    });
    setSelectedItems(new Set());
    setIsEditMode(false);
    setShowDeleteDialog(false);
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const openSingleDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setShowSingleDeleteDialog(true);
  };

  const handleSingleDelete = () => {
    if (!itemToDelete) return;

    if (activeMainTab === "dishes") {
      toggleDishLoved(itemToDelete);
    } else {
      toggleRestaurantLoved(itemToDelete);
    }

    setItemToDelete(null);
    setShowSingleDeleteDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 pt-4 pb-3">
          <div className="flex gap-2 mb-3">
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

          {/* Main Tabs and Edit button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMainTab("dishes")}
                className={`px-6 py-2.5 rounded-xl transition-all ${
                  activeMainTab === "dishes"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Món ăn ({dishLovedCount})
              </button>
              <button
                onClick={() => setActiveMainTab("restaurants")}
                className={`px-6 py-2.5 rounded-xl transition-all ${
                  activeMainTab === "restaurants"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Quán ăn ({restaurantLovedCount})
              </button>
            </div>

            {/* Edit Button */}
            {displayList.length > 0 && (
              <button
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setSelectedItems(new Set());
                }}
                className={`p-3 rounded-xl transition-all ${
                  isEditMode
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Edit mode buttons */}
          {isEditMode && displayList.length > 0 && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <CheckSquare className="w-4 h-4" />
                Chọn tất cả
              </button>
              <button
                onClick={handleDeselectAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <XSquare className="w-4 h-4" />
                Bỏ chọn
              </button>
              {selectedItems.size > 0 && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors ml-auto text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa ({selectedItems.size})
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {displayList.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">
              {activeMainTab === "dishes"
                ? "Chưa có món ăn yêu thích nào"
                : "Chưa có quán yêu thích nào"}
            </p>
          </div>
        ) : activeMainTab === "dishes" ? (
          // Render dishes
          displayList.map((item: any) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                isEditMode && selectedItems.has(item.id) ? "ring-2 ring-red-600" : ""
              }`}
            >
              <div className="flex gap-3 p-3">
                {isEditMode && (
                  <button
                    onClick={() => toggleItemSelection(item.id)}
                    className="self-center"
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      selectedItems.has(item.id)
                        ? "bg-red-600 border-red-600"
                        : "border-gray-300"
                    }`}>
                      {selectedItems.has(item.id) && (
                        <CheckSquare className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                )}
                <Link
                  to={isEditMode ? "#" : `/restaurant/${item.restaurantId}/dish/${item.id}`}
                  onClick={(e) => isEditMode && e.preventDefault()}
                  className="relative w-28 h-28 flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </Link>

                <Link
                  to={isEditMode ? "#" : `/restaurant/${item.restaurantId}/dish/${item.id}`}
                  onClick={(e) => isEditMode && e.preventDefault()}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base mb-1">{item.name}</h3>
                    <p className="text-sm text-red-600 mb-1">
                      Tại {item.restaurantName}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.rating}</span>
                      <span className="text-xs text-gray-400">
                        ({item.reviews}+)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.avgPrice}
                    </div>
                  </div>
                </Link>

                {!isEditMode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openSingleDeleteDialog(item.id);
                    }}
                    className="self-center p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          // Render restaurants
          displayList.map((restaurant: any) => (
            <div
              key={restaurant.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                isEditMode && selectedItems.has(restaurant.id) ? "ring-2 ring-red-600" : ""
              }`}
            >
              <div className="flex gap-3 p-3">
                {isEditMode && (
                  <button
                    onClick={() => toggleItemSelection(restaurant.id)}
                    className="self-center"
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      selectedItems.has(restaurant.id)
                        ? "bg-red-600 border-red-600"
                        : "border-gray-300"
                    }`}>
                      {selectedItems.has(restaurant.id) && (
                        <CheckSquare className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                )}
                <Link
                  to={isEditMode ? "#" : `/restaurant/${restaurant.id}`}
                  onClick={(e) => isEditMode && e.preventDefault()}
                  className="relative w-28 h-28 flex-shrink-0"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {restaurant.onSale && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                      {restaurant.discount}
                    </div>
                  )}
                </Link>

                <Link
                  to={isEditMode ? "#" : `/restaurant/${restaurant.id}`}
                  onClick={(e) => isEditMode && e.preventDefault()}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{restaurant.rating}</span>
                      <span className="text-xs text-gray-400">
                        ({restaurant.reviews}+)
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{restaurant.distance}</span>
                      </div>
                      <span>💰 {restaurant.price}</span>
                    </div>
                  </div>
                </Link>

                {!isEditMode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openSingleDeleteDialog(restaurant.id);
                    }}
                    className="self-center p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteSelected}
        title="Xóa mục đã chọn"
        message={`Bạn có chắc chắn muốn xóa ${selectedItems.size} mục đã chọn không?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <ConfirmDialog
        isOpen={showSingleDeleteDialog}
        onClose={() => {
          setShowSingleDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleSingleDelete}
        title="Xóa mục này"
        message="Bạn có chắc chắn muốn xóa mục này không?"
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      <BottomNav />
    </div>
  );
}