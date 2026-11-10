import { ArrowLeft, ChevronRight, User, Mail, Phone, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export function AccountSettingsPage() {
  const navigate = useNavigate();

  const accountItems = [
    {
      icon: User,
      label: "Họ và tên",
      value: "Nguyễn Văn A",
    },
    {
      icon: Mail,
      label: "Email",
      value: "nguyenvana@example.com",
    },
    {
      icon: Phone,
      label: "Số điện thoại",
      value: "0912 345 678",
    },
    {
      icon: Lock,
      label: "Mật khẩu",
      value: "••••••••",
    },
    {
      icon: Shield,
      label: "Xác thực hai yếu tố",
      value: "Đã bật",
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
          <h1 className="text-lg">Tài khoản và bảo mật</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {accountItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                  index !== accountItems.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
