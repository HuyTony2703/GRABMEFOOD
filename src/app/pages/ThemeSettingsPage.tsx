import { ArrowLeft, Check, Sun, Moon, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export function ThemeSettingsPage() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("light");

  const themes = [
    {
      value: "light",
      label: "Sáng",
      description: "Giao diện sáng",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Tối",
      description: "Giao diện tối",
      icon: Moon,
    },
    {
      value: "auto",
      label: "Theo hệ thống",
      description: "Tự động chuyển đổi theo thiết bị",
      icon: Smartphone,
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
          <h1 className="text-lg">Giao diện</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {themes.map((theme, index) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.value}
                onClick={() => setSelectedTheme(theme.value)}
                className={`w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                  index !== themes.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm mb-0.5">{theme.label}</p>
                  <p className="text-xs text-gray-500">{theme.description}</p>
                </div>
                {selectedTheme === theme.value && (
                  <Check className="w-5 h-5 text-red-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
