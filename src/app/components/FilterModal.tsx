import { X, MapPin, DollarSign, Utensils, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const navigate = useNavigate();
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const distances = [
    { label: "Dưới 500m", value: "0.5" },
    { label: "500m - 1km", value: "1" },
    { label: "1km - 2km", value: "2" },
    { label: "2km - 5km", value: "5" },
    { label: "Trên 5km", value: "5+" },
  ];

  const priceRanges = [
    { label: "Dưới 50k", value: "0-50", icon: "$" },
    { label: "50k - 100k", value: "50-100", icon: "$$" },
    { label: "100k - 200k", value: "100-200", icon: "$$$" },
    { label: "Trên 200k", value: "200+", icon: "$$$$" },
  ];

  const foodTypes = [
    "Cafe",
    "Milk Tea",
    "Noodles",
    "Hotpot",
    "Snacks",
    "Fast Food",
    "Dessert",
    "Breakfast",
    "Street Food",
    "Buffet",
    "BBQ",
    "Vegetarian",
  ];

  const cuisines = [
    { label: "Việt Nam", flag: "🇻🇳" },
    { label: "Nhật Bản", flag: "🇯🇵" },
    { label: "Hàn Quốc", flag: "🇰🇷" },
    { label: "Trung Quốc", flag: "🇨🇳" },
    { label: "Thái Lan", flag: "🇹🇭" },
    { label: "Ý", flag: "🇮🇹" },
    { label: "Pháp", flag: "🇫🇷" },
    { label: "Mỹ", flag: "🇺🇸" },
    { label: "Ấn Độ", flag: "🇮🇳" },
    { label: "Mexico", flag: "🇲🇽" },
  ];

  const toggleFoodType = (type: string) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedDistance) params.set("distance", selectedDistance);
    if (selectedPriceRange) params.set("price", selectedPriceRange);
    if (selectedFoodTypes.length > 0) params.set("types", selectedFoodTypes.join(","));
    if (selectedCuisines.length > 0) params.set("cuisines", selectedCuisines.join(","));

    navigate(`/search?${params.toString()}`);
    onClose();
  };

  const handleReset = () => {
    setSelectedDistance(null);
    setSelectedPriceRange(null);
    setSelectedFoodTypes([]);
    setSelectedCuisines([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full h-[95vh] rounded-t-3xl flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg">Bộ lọc</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <h3 className="font-medium">Khoảng cách</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {distances.map((distance) => (
                  <button
                    key={distance.value}
                    onClick={() => setSelectedDistance(distance.value)}
                    className={`px-4 py-2.5 rounded-xl border transition-all ${
                      selectedDistance === distance.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-red-600"
                    }`}
                  >
                    {distance.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-red-600" />
                <h3 className="font-medium">Khoảng giá</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPriceRange(range.value)}
                    className={`px-4 py-2.5 rounded-xl border transition-all ${
                      selectedPriceRange === range.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-red-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{range.label}</span>
                      <span className="text-xs opacity-75">{range.icon}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-red-600" />
                <h3 className="font-medium">Loại thức ăn</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {foodTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleFoodType(type)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      selectedFoodTypes.includes(type)
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-red-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-red-600" />
                <h3 className="font-medium">Ẩm thực theo quốc gia</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <button
                    key={cuisine.label}
                    onClick={() => toggleCuisine(cuisine.label)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      selectedCuisines.includes(cuisine.label)
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-red-600"
                    }`}
                  >
                    <span className="mr-1">{cuisine.flag}</span>
                    {cuisine.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-100 px-4 py-4 flex gap-3 flex-shrink-0 bg-white">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
