import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export function LanguageSettingsPage() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("vi");

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "th", label: "ไทย", flag: "🇹🇭" },
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
          <h1 className="text-lg">Ngôn ngữ</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className={`w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                index !== languages.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-2xl">{language.flag}</span>
              <span className="flex-1 text-left text-sm">{language.label}</span>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-red-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
