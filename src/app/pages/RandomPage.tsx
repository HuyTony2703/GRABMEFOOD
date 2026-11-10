import { Dices, Sparkles, MapPin, Star, RefreshCw, Check } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

interface Dish {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  avgPrice: string;
  availableAt: number;
  description: string;
  image: string;
  restaurantId?: string;
  restaurantName?: string;
}

type RandomMode = "selected" | "all";

export function RandomPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDish, setCurrentDish] = useState<number | null>(null);
  const [randomMode, setRandomMode] = useState<RandomMode>("all");
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  
  // Mock saved dishes from favorites (in production, get from user's favorites)
  const savedDishes: Dish[] = [
    {
      id: "1",
      name: "Cơm Tấm Sườn Nướng",
      rating: 4.8,
      reviews: 1567,
      avgPrice: "35-60k",
      availableAt: 0.5,
      description: "Cơm tấm sườn nướng thơm phức với nước mắm pha chuẩn vị",
      image: "https://images.unsplash.com/photo-1766050587783-1c90751275dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnJva2VuJTIwcmljZSUyMGdyaWxsZWQlMjBwb3JrfGVufDF8fHx8MTc3NjMxMzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      restaurantId: "1",
      restaurantName: "Phở Hà Nội",
    },
    {
      id: "2",
      name: "Bún Chả Hà Nội",
      rating: 4.9,
      reviews: 2134,
      avgPrice: "40-70k",
      availableAt: 0.8,
      description: "Bún chả Hà Nội với thịt nướng thơm ngon",
      image: "https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhJTIwbm9vZGxlc3xlbnwxfHx8fDE3NzYzMTMzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      restaurantId: "2",
      restaurantName: "Quán Ngon Sài Gòn",
    },
    {
      id: "pho-bo-tai",
      name: "Phở Bò Tái",
      rating: 4.9,
      reviews: 2678,
      avgPrice: "50-85k",
      availableAt: 0.3,
      description: "Phở bò tái chuẩn vị Hà Nội",
      image: "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwbm9vZGxlcyUyMGJvd2x8ZW58MXx8fHwxNzc2MzEzMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      restaurantId: "1",
      restaurantName: "Phở Hà Nội",
    },
    {
      id: "pho-ga",
      name: "Phở Gà",
      rating: 4.8,
      reviews: 1245,
      avgPrice: "45-70k",
      availableAt: 0.3,
      description: "Phở gà nước dùng thanh ngọt",
      image: "https://images.unsplash.com/photo-1759770753108-dc559a3d35b6?w=800",
      restaurantId: "1",
      restaurantName: "Phở Hà Nội",
    },
    {
      id: "3",
      name: "Gỏi Cuốn Tôm Thịt",
      rating: 4.7,
      reviews: 982,
      avgPrice: "25-45k",
      availableAt: 1.2,
      description: "Gỏi cuốn tươi ngon với tôm và thịt",
      image: "https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwcmluZyUyMHJvbGxzJTIwdmlldG5hbWVzZSUyMGZvb2R8ZW58MXx8fHwxNzc2MzEzMzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      restaurantId: "3",
      restaurantName: "Món Việt Truyền Thống",
    },
  ];

  const allDishes: Dish[] = [
    ...savedDishes,
    {
      id: "pho-bo-chin",
      name: "Phở Bò Chín",
      rating: 4.7,
      reviews: 987,
      avgPrice: "50-80k",
      availableAt: 0.4,
      description: "Phở bò chín với thịt mềm",
      image: "https://images.unsplash.com/photo-1730900979914-7e34981744b0?w=800",
    },
    {
      id: "banh-mi",
      name: "Bánh Mì Thịt",
      rating: 4.6,
      reviews: 876,
      avgPrice: "20-35k",
      availableAt: 0.6,
      description: "Bánh mì giòn với thịt nguội và rau sống",
      image: "https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=800",
    },
  ];

  const toggleDishSelection = (dishId: string) => {
    setSelectedDishes(prev =>
      prev.includes(dishId)
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    );
  };

  const getAvailableDishes = () => {
    switch (randomMode) {
      case "selected":
        return savedDishes.filter(d => selectedDishes.includes(d.id));
      case "all":
      default:
        return allDishes;
    }
  };

  const handleQuay = () => {
    const availableDishes = getAvailableDishes();
    if (availableDishes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableDishes.length);
    const dishIndex = allDishes.findIndex(d => d.id === availableDishes[randomIndex].id);
    setCurrentDish(dishIndex);
    setIsSpinning(false);
  };

  const dish = currentDish !== null ? allDishes[currentDish] : null;
  const availableDishes = getAvailableDishes();
  const showResult = dish !== null && !isSpinning;

  const handleReset = () => {
    setCurrentDish(null);
    setSelectedDishes([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-white pb-20">
      {!showResult ? (
        <>
          <div className="px-4 pt-8 pb-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-400 rounded-3xl flex items-center justify-center shadow-xl"
            >
              <Dices className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl mb-2">Hôm nay ăn gì?</h1>
            <p className="text-gray-600">
              Để chúng tôi gợi ý cho bạn nhé!
            </p>
          </div>

          {/* Mode Selector */}
          <div className="px-4 mb-4">
            <div className="inline-flex w-full bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => {
                  setRandomMode("selected");
                  setCurrentDish(null);
                }}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all text-xs ${
                  randomMode === "selected"
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-600"
                }`}
              >
                <Check className="w-5 h-5" />
                <span>Tự chọn</span>
              </button>
              <button
                onClick={() => {
                  setRandomMode("all");
                  setCurrentDish(null);
                }}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all text-xs ${
                  randomMode === "all"
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-600"
                }`}
              >
                <Dices className="w-5 h-5" />
                <span>Toàn bộ</span>
              </button>
            </div>
          </div>

          {/* Dish Selection for "selected" mode */}
          {randomMode === "selected" && (
            <div className="px-4 mb-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm">Chọn các món mà bạn đã lưu</h3>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    {selectedDishes.length}/{savedDishes.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {savedDishes.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => toggleDishSelection(d.id)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        selectedDishes.includes(d.id)
                          ? "border-red-500 shadow-lg"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2 bg-white">
                        <p className="text-xs line-clamp-1">{d.name}</p>
                        {d.restaurantName && (
                          <p className="text-xs text-red-600 line-clamp-1">
                            Tại {d.restaurantName}
                          </p>
                        )}
                      </div>
                      {selectedDishes.includes(d.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {randomMode === "all" && (
            <div className="px-4 mb-8">
              <AnimatePresence mode="wait">
                {isSpinning && dish ? (
                  <Link
                    to={
                      dish.restaurantId
                        ? `/restaurant/${dish.restaurantId}/dish/${dish.id}`
                        : `/dish/${dish.id}`
                    }
                  >
                    <motion.div
                      key={dish.id}
                      initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                      exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl overflow-hidden shadow-2xl"
                    >
                      <div className="relative h-64">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h2 className="text-xl mb-1">{dish.name}</h2>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span>{dish.rating}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-gray-300"
                  >
                    <Dices className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Quay từ tất cả các món</p>
                    <p className="text-sm text-gray-400 mt-2">Nhấn nút bên dưới để bắt đầu!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="fixed bottom-24 left-0 right-0 px-4 z-40">
            {availableDishes.length === 0 ? (
              <div className="w-full py-4 rounded-2xl bg-gray-200 text-gray-500 text-center">
                {randomMode === "selected" && "Hãy chọn ít nhất 1 món"}
                {randomMode === "all" && "Không có món nào"}
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleQuay}
                disabled={isSpinning}
                className={`w-full py-4 rounded-2xl text-white text-lg shadow-2xl transition-all ${
                  isSpinning
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                }`}
              >
                {isSpinning ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    Đang chọn...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Dices className="w-6 h-6" />
                    Quay ngay! ({availableDishes.length} món)
                  </span>
                )}
              </motion.button>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pt-6 pb-4"
        >
          {/* Result Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-red-600 to-red-400 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-xl mb-1">Gợi ý của bạn!</h1>
            <p className="text-sm text-gray-600">Hôm nay bạn nên thử món này</p>
          </div>

          {/* Dish Result Card */}
          <Link
            to={
              dish.restaurantId
                ? `/restaurant/${dish.restaurantId}/dish/${dish.id}`
                : `/dish/${dish.id}`
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-4"
            >
              <div className="relative h-96">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl mb-2">{dish.name}</h2>
                  {dish.restaurantName && (
                    <p className="text-sm text-red-300 mb-3">
                      Tại {dish.restaurantName}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl">{dish.rating}</span>
                    <span className="text-white/80">({dish.reviews}+ đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {dish.avgPrice}
                    </span>
                    <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4" />
                      {dish.availableAt} km
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuay}
              className="py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Quay lại
            </motion.button>
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="py-4 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 shadow-sm flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Chọn lại
            </motion.button>
          </div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}