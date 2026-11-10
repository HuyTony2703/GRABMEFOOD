import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Switch } from "../components/ui/switch";

export function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    saleNotifications: true,
    reviewReplies: true,
    newFollowers: false,
    reviewLikes: true,
    nearbyRestaurants: true,
    recommendations: false,
    emailNotifications: false,
    smsNotifications: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationGroups = [
    {
      title: "Thông báo đẩy",
      items: [
        {
          key: "saleNotifications" as const,
          label: "Khuyến mãi và ưu đãi",
          description: "Nhận thông báo về các chương trình giảm giá",
        },
        {
          key: "reviewReplies" as const,
          label: "Phản hồi đánh giá",
          description: "Khi quán phản hồi đánh giá của bạn",
        },
        {
          key: "newFollowers" as const,
          label: "Người theo dõi mới",
          description: "Khi có người theo dõi bạn",
        },
        {
          key: "reviewLikes" as const,
          label: "Lượt thích đánh giá",
          description: "Khi có người thích đánh giá của bạn",
        },
        {
          key: "nearbyRestaurants" as const,
          label: "Quán gần bạn",
          description: "Nhận thông báo về các quán mới gần vị trí của bạn",
        },
        {
          key: "recommendations" as const,
          label: "Gợi ý cho bạn",
          description: "Nhận gợi ý món ăn và quán ăn phù hợp",
        },
      ],
    },
    {
      title: "Kênh thông báo khác",
      items: [
        {
          key: "emailNotifications" as const,
          label: "Thông báo qua Email",
          description: "Nhận thông báo qua địa chỉ email",
        },
        {
          key: "smsNotifications" as const,
          label: "Thông báo qua SMS",
          description: "Nhận thông báo qua tin nhắn",
        },
      ],
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
          <h1 className="text-lg">Cài đặt thông báo</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {notificationGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm text-gray-500 mb-3 px-2">{group.title}</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {group.items.map((item, index) => (
                <div
                  key={item.key}
                  className={`px-4 py-4 flex items-center gap-4 ${
                    index !== group.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm mb-0.5">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={settings[item.key]}
                    onCheckedChange={() => toggleSetting(item.key)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
