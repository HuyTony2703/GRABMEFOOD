import { ArrowLeft, MapPin, Plus, Home, Briefcase, Star } from "lucide-react";
import { useNavigate } from "react-router";

export function AddressSettingsPage() {
  const navigate = useNavigate();

  const addresses = [
    {
      id: "1",
      icon: Home,
      label: "Nhà riêng",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: "2",
      icon: Briefcase,
      label: "Văn phòng",
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      isDefault: false,
    },
    {
      id: "3",
      icon: MapPin,
      label: "Địa chỉ khác",
      address: "789 Võ Văn Tần, Quận 3, TP.HCM",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg flex-1">Địa chỉ</h1>
          <button className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {addresses.map((address) => {
          const Icon = address.icon;
          return (
            <div
              key={address.id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm">{address.label}</h3>
                    {address.isDefault && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                        <span className="text-xs text-yellow-600">Mặc định</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.address}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 border border-red-600 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors">
                  Chỉnh sửa
                </button>
                {!address.isDefault && (
                  <button className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors">
                    Đặt mặc định
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
