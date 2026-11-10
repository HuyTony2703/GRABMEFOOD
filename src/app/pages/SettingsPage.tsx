import { ArrowLeft, ChevronRight, User, MapPin, Bell, Globe, Palette, HelpCircle, FileText, BookOpen, LogOut, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function SettingsPage() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    navigate("/login");
  };

  const handleSwitchAccount = () => {
    navigate("/login");
  };

  const settingsSections = [
    {
      title: "Tài khoản",
      items: [
        {
          icon: User,
          label: "Tài khoản và bảo mật",
          path: "/settings/account",
          description: "Quản lý thông tin cá nhân",
        },
        {
          icon: MapPin,
          label: "Địa chỉ",
          path: "/settings/address",
          description: "Quản lý địa chỉ đã lưu",
        },
      ],
    },
    {
      title: "Cài đặt",
      items: [
        {
          icon: Bell,
          label: "Cài đặt thông báo",
          path: "/settings/notifications",
          description: "Quản lý thông báo",
        },
        {
          icon: Globe,
          label: "Ngôn ngữ",
          path: "/settings/language",
          description: "Tiếng Việt",
        },
        {
          icon: Palette,
          label: "Giao diện",
          path: "/settings/theme",
          description: "Sáng / Tối",
        },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        {
          icon: HelpCircle,
          label: "Trung tâm hỗ trợ",
          path: "/settings/support",
          description: "Chat với chúng tôi",
        },
        {
          icon: FileText,
          label: "Điều khoản của GrabMeFood",
          path: "/settings/terms",
          description: "Điều khoản sử dụng",
        },
        {
          icon: BookOpen,
          label: "Hướng dẫn sử dụng app",
          path: "/settings/guide",
          description: "Cách sử dụng ứng dụng",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg">Cài đặt</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm text-gray-500 mb-3 px-2">{section.title}</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                      index !== section.items.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm mb-0.5">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Account Actions */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mt-6">
          <button
            onClick={handleSwitchAccount}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm">Chuyển đổi tài khoản</p>
              <p className="text-xs text-gray-500">Đăng nhập tài khoản khác</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm">Đăng xuất</p>
              <p className="text-xs text-gray-500">Đăng xuất khỏi tài khoản này</p>
            </div>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </div>
  );
}
