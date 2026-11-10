import { ArrowLeft, MessageCircle, Star, Tag, CheckSquare, XSquare, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function NotificationsPage() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationList, setNotificationList] = useState([
    {
      id: "1",
      type: "sale",
      icon: Tag,
      title: "Khuyến mãi mới tại KFC Discount",
      message: "Giảm 30% cho tất cả các món từ 15:00 - 18:00 hôm nay!",
      time: "10 phút trước",
      image: "https://images.unsplash.com/photo-1766589221324-656419e4c844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW4lMjBtZWFsJTIwZmFzdCUyMGZvb2R8ZW58MXx8fHwxNzc2MzEzMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      unread: true,
      color: "bg-red-50 text-red-600",
    },
    {
      id: "2",
      type: "review_reply",
      icon: MessageCircle,
      title: "Phở Hà Nội đã phản hồi đánh giá của bạn",
      message: "Cảm ơn bạn đã ghé thăm! Mong được phục vụ bạn lần sau.",
      time: "2 giờ trước",
      image: "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwbm9vZGxlcyUyMGJvd2x8ZW58MXx8fHwxNzc2MzEzMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      unread: true,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "3",
      type: "sale",
      icon: Tag,
      title: "Pizza 4P's - Ưu đãi 20% OFF",
      message: "Giảm giá đặc biệt cho tất cả các loại pizza trong tuần này!",
      time: "1 ngày trước",
      image: "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBpdGFsaWFufGVufDF8fHx8MTc3NjMwMDIzOXww&ixlib=rb-4.1.0&q=80&w=1080",
      unread: false,
      color: "bg-red-50 text-red-600",
    },
    {
      id: "4",
      type: "review_reply",
      icon: MessageCircle,
      title: "Highlands Coffee trả lời đánh giá",
      message: "Rất vui khi bạn thích không gian của chúng tôi!",
      time: "2 ngày trước",
      image: "https://images.unsplash.com/photo-1642647916129-3909c75c0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc3NjMxMzM0OHww&ixlib=rb-4.1.0&q=80&w=1080",
      unread: false,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "5",
      type: "like",
      icon: Star,
      title: "15 người thích đánh giá của bạn",
      message: "Đánh giá về Bánh Mì 37 nhận được nhiều lượt thích!",
      time: "3 ngày trước",
      image: "https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjB2aWV0bmFtZXNlJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzc2MzEzMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      unread: false,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      id: "6",
      type: "sale",
      icon: Tag,
      title: "Trà Sữa Bobapop - Mua 1 tặng 1",
      message: "Khuyến mãi đặc biệt cuối tuần - áp dụng tất cả các size!",
      time: "3 ngày trước",
      image: "https://images.unsplash.com/photo-1572932759882-bb34c848d1b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBtaWxrJTIwdGVhJTIwZHJpbmt8ZW58MXx8fHwxNzc2MzEzMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      unread: false,
      color: "bg-red-50 text-red-600",
    },
  ]);

  const handleSelectAll = () => {
    const allIds = notificationList.map((n) => n.id);
    setSelectedItems(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    setNotificationList(notificationList.filter((n) => !selectedItems.has(n.id)));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg flex-1">Thông báo</h1>
          {notificationList.length > 0 && (
            <button
              onClick={() => setNotificationList(notificationList.map(n => ({ ...n, unread: false })))}
              className="text-sm text-red-600"
            >
              Đánh dấu đã đọc
            </button>
          )}
          {notificationList.length > 0 && (
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedItems(new Set());
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Edit3 className={`w-5 h-5 ${isEditMode ? "text-red-600" : "text-gray-700"}`} />
            </button>
          )}
        </div>

        {isEditMode && notificationList.length > 0 && (
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Chọn tất cả
            </button>
            <button
              onClick={handleDeselectAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <XSquare className="w-4 h-4" />
              Bỏ chọn
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ({selectedItems.size})
              </button>
            )}
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {notificationList.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`p-4 ${
                notification.unread ? "bg-red-50/30" : "bg-white"
              } hover:bg-gray-50 transition-colors cursor-pointer ${
                isEditMode && selectedItems.has(notification.id) ? "ring-2 ring-red-600 ring-inset" : ""
              }`}
            >
              <div className="flex gap-3">
                {isEditMode && (
                  <button
                    onClick={() => toggleItemSelection(notification.id)}
                    className="self-center"
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      selectedItems.has(notification.id)
                        ? "bg-red-600 border-red-600"
                        : "border-gray-300"
                    }`}>
                      {selectedItems.has(notification.id) && (
                        <CheckSquare className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                )}
                <div className="flex-shrink-0">
                  <img
                    src={notification.image}
                    alt={notification.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${notification.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-sm mb-1 ${
                          notification.unread ? "font-semibold" : ""
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteSelected}
        title="Xóa thông báo"
        message={`Bạn có chắc chắn muốn xóa ${selectedItems.size} thông báo đã chọn không?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
