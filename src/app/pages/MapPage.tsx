import { MapPin, Layers, Check } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { nearbyRestaurants, saleRestaurants } from "../data/restaurants";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import satelliteImage from "../../imports/image-6.png";

type MapType = "default" | "terrain";

export function MapPage() {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapType, setMapType] = useState<MapType>("default");
  const [showMapMenu, setShowMapMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if navigated from restaurant page
  useEffect(() => {
    if (location.state?.restaurantId) {
      setSelectedId(location.state.restaurantId);
    }
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMapMenu(false);
      }
    };

    if (showMapMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMapMenu]);

  const handleMapTypeSelect = (type: MapType) => {
    setMapType(type);
    setShowMapMenu(false);
  };

  const allRestaurants = [...nearbyRestaurants, ...saleRestaurants];
  const selected = allRestaurants.find((r) => r.id === selectedId);

  const restaurantPositions = [
    { id: "1", top: "45%", left: "48%" },
    { id: "2", top: "35%", left: "55%" },
    { id: "3", top: "60%", left: "40%" },
    { id: "4", top: "50%", left: "62%" },
    { id: "5", top: "70%", left: "50%" },
    { id: "6", top: "30%", left: "35%" },
    { id: "7", top: "55%", left: "70%" },
    { id: "8", top: "40%", left: "45%" },
    { id: "9", top: "65%", left: "60%" },
    { id: "10", top: "48%", left: "52%" },
  ];

  const mapUrl =
    mapType === "terrain"
      ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31355.18991276394!2d106.68032907431643!3d10.776889399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e3!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s"
      : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31355.18991276394!2d106.68032907431643!3d10.776889399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s";

  return (
    <div className="h-screen bg-gray-100 relative">
      <div className="absolute inset-0">
        <iframe
          key={mapType}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full opacity-90"
        ></iframe>
        <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>

        {/* Restaurant markers */}
        {restaurantPositions.map((pos) => {
          const restaurant = allRestaurants.find((r) => r.id === pos.id);
          if (!restaurant) return null;
          const isSelected = selectedId === pos.id;
          return (
            <button
              key={pos.id}
              onClick={() => setSelectedId(pos.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-10"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className={`relative ${isSelected ? "scale-125" : ""}`}>
                <MapPin className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-lg" />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                )}
              </div>
            </button>
          );
        })}

        {/* User location marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-4 right-4 z-10">
        <div className="bg-white rounded-xl shadow-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Vị trí hiện tại</p>
              <p className="text-sm">Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-24 right-4 z-10" ref={menuRef}>
        <button
          onClick={() => setShowMapMenu(!showMapMenu)}
          className="bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors p-2.5"
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </button>

        {showMapMenu && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden min-w-[280px]">
            <div className="p-2">
              <button
                onClick={() => handleMapTypeSelect("default")}
                className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors ${
                  mapType === "default" ? "bg-red-50" : ""
                }`}
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 via-gray-100 to-green-100 flex items-center justify-center">
                    <div className="absolute">
                      <div className="w-8 h-0.5 bg-blue-400"></div>
                      <div className="w-0.5 h-8 bg-blue-400 absolute top-0 left-1/2 -translate-x-1/2"></div>
                    </div>
                    <div className="w-2 h-2 bg-yellow-300 rounded-full absolute top-2 right-2"></div>
                    <div className="w-3 h-1 bg-green-400 absolute bottom-2 left-2"></div>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Bản đồ</p>
                  <p className="text-xs text-gray-500">Mặc định</p>
                </div>
                {mapType === "default" && (
                  <Check className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </button>

              <button
                onClick={() => handleMapTypeSelect("terrain")}
                className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors ${
                  mapType === "terrain" ? "bg-red-50" : ""
                }`}
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img
                    src={satelliteImage}
                    alt="Satellite view"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Vệ tinh</p>
                  <p className="text-xs text-gray-500">Hình ảnh vệ tinh</p>
                </div>
                {mapType === "terrain" && (
                  <Check className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="absolute bottom-24 left-4 right-4 z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex gap-3 p-3">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base">{selected.name}</h3>
                  {selected.onSale && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md">
                      {selected.discount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{selected.cuisine}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>⭐ {selected.rating} ({selected.reviews}+)</span>
                  <span>📍 {selected.distance}</span>
                  <span>💰 {selected.price}</span>
                </div>
              </div>
            </div>
            <div className="px-3 pb-3 flex gap-2">
              <button className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Chỉ đường
              </button>
              <button className="flex-1 py-2 border border-red-600 text-red-600 rounded-lg text-sm hover:bg-red-50">
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}