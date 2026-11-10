import {
  ArrowLeft,
  MessageCircle,
  Star,
  Tag,
  CheckSquare,
  XSquare,
  Trash2,
  Edit3,
} from "lucide-react"

import { useState } from "react"

import { useNavigate } from "react-router"

import { ConfirmDialog } from "@/app/components/feedback/ConfirmDialog"
import { ContentState } from "@/app/components/feedback/ContentState"

export function NotificationsPage() {
  const navigate = useNavigate()

  const [isEditMode, setIsEditMode] = useState(false)

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [notificationList, setNotificationList] = useState([
    {
      id: "1",

      type: "sale",

      icon: Tag,

      title: "Khuyến mãi mới tại KFC Discount",

      message: "Giảm 30% cho tất cả các món từ 15:00 - 18:00 hôm nay!",

      time: "10 phút trước",

      image:
        "https://images.unsplash.com/photo-1766589221324-656419e4c844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW4lMjBtZWFsJTIwZmFzdCUyMGZvb2R8ZW58MXx8fHwxNzc2MzEzMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",

      unread: true,

      color: "bg-accent text-accent-foreground",
    },

    {
      id: "2",

      type: "review_reply",

      icon: MessageCircle,

      title: "Phở Hà Nội đã phản hồi đánh giá của bạn",

      message: "Cảm ơn bạn đã ghé thăm! Mong được phục vụ bạn lần sau.",

      time: "2 giờ trước",

      image:
        "https://images.unsplash.com/photo-1697652974652-fe755a11cc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwbm9vZGxlcyUyMGJvd2x8ZW58MXx8fHwxNzc2MzEzMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",

      unread: true,

      color: "bg-accent text-accent-foreground",
    },

    {
      id: "3",

      type: "sale",

      icon: Tag,

      title: "Pizza 4P's - Ưu đãi 20% OFF",

      message: "Giảm giá đặc biệt cho tất cả các loại pizza trong tuần này!",

      time: "1 ngày trước",

      image:
        "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBpdGFsaWFufGVufDF8fHx8MTc3NjMwMDIzOXww&ixlib=rb-4.1.0&q=80&w=1080",

      unread: false,

      color: "bg-accent text-accent-foreground",
    },

    {
      id: "4",

      type: "review_reply",

      icon: MessageCircle,

      title: "Highlands Coffee trả lời đánh giá",

      message: "Rất vui khi bạn thích không gian của chúng tôi!",

      time: "2 ngày trước",

      image:
        "https://images.unsplash.com/photo-1642647916129-3909c75c0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc3NjMxMzM0OHww&ixlib=rb-4.1.0&q=80&w=1080",

      unread: false,

      color: "bg-accent text-accent-foreground",
    },

    {
      id: "5",

      type: "like",

      icon: Star,

      title: "15 người thích đánh giá của bạn",

      message: "Đánh giá về Bánh Mì 37 nhận được nhiều lượt thích!",

      time: "3 ngày trước",

      image:
        "https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjB2aWV0bmFtZXNlJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzc2MzEzMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",

      unread: false,

      color: "bg-accent text-accent-foreground",
    },

    {
      id: "6",

      type: "sale",

      icon: Tag,

      title: "Trà Sữa Bobapop - Mua 1 tặng 1",

      message: "Khuyến mãi đặc biệt cuối tuần - áp dụng tất cả các size!",

      time: "3 ngày trước",

      image:
        "https://images.unsplash.com/photo-1572932759882-bb34c848d1b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBtaWxrJTIwdGVhJTIwZHJpbmt8ZW58MXx8fHwxNzc2MzEzMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",

      unread: false,

      color: "bg-accent text-accent-foreground",
    },
  ])

  const handleSelectAll = () => {
    const allIds = notificationList.map((n) => n.id)

    setSelectedItems(new Set(allIds))
  }

  const handleDeselectAll = () => {
    setSelectedItems(new Set())
  }

  const handleDeleteSelected = () => {
    setNotificationList(
      notificationList.filter((n) => !selectedItems.has(n.id)),
    )

    setSelectedItems(new Set())

    setIsEditMode(false)

    setShowDeleteDialog(false)
  }

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems)

    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }

    setSelectedItems(newSelected)
  }

  return (
    <div className="bg-background">
      <div className="bg-card">
        <div className="py-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/")}
            aria-label="Về trang chủ"
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
          </button>
          <h1 className="text-lg flex-1">Thông báo</h1>
          {notificationList.length > 0 && (
            <button
              onClick={() =>
                setNotificationList(
                  notificationList.map((n) => ({ ...n, unread: false })),
                )
              }
              className="text-sm text-foreground underline px-3"
            >
              Đánh dấu đã đọc
            </button>
          )}
          {notificationList.length > 0 && (
            <button
              onClick={() => {
                setIsEditMode(!isEditMode)

                setSelectedItems(new Set())
              }}
              aria-label={
                isEditMode
                  ? "Kết thúc chỉnh sửa thông báo"
                  : "Chỉnh sửa thông báo"
              }
              aria-pressed={isEditMode}
              className="p-2 rounded-md hover:bg-accent transition-colors"
            >
              <Edit3 className="w-5 h-5 text-foreground" aria-hidden="true" />
            </button>
          )}
        </div>

        {isEditMode && notificationList.length > 0 && (
          <div className="pb-3 flex flex-wrap gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Chọn tất cả
            </button>
            <button
              onClick={handleDeselectAll}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-colors"
            >
              <XSquare className="w-4 h-4" />
              Bỏ chọn
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ({selectedItems.size})
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mb-6 text-sm">
        Thông báo minh họa; đánh dấu và xóa chỉ có hiệu lực trong trang hiện
        tại, không thay đổi dữ liệu tài khoản.
      </p>
      {!notificationList.length && (
        <ContentState title="Không còn thông báo mẫu">
          <p>
            Bạn đã xóa các mục trên trang này. Đây không phải lỗi tải dữ liệu.
          </p>
        </ContentState>
      )}
      <div className="divide-y divide-border">
        {notificationList.map((notification) => {
          const Icon = notification.icon

          return (
            <div
              key={notification.id}
              className={`p-4 ${
                notification.unread
                  ? "bg-accent text-accent-foreground"
                  : "bg-card"
              } ${
                isEditMode && selectedItems.has(notification.id)
                  ? "outline-2 outline-foreground"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                {isEditMode && (
                  <button
                    onClick={() => toggleItemSelection(notification.id)}
                    aria-label={`Chọn ${notification.title}`}
                    aria-pressed={selectedItems.has(notification.id)}
                    className="self-center"
                  >
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                        selectedItems.has(notification.id)
                          ? "bg-primary border-primary"
                          : "border-input"
                      }`}
                    >
                      {selectedItems.has(notification.id) && (
                        <CheckSquare
                          className="w-4 h-4 text-primary-foreground"
                          aria-hidden="true"
                        />
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
                      <p className="text-sm text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <span className="text-sm font-medium">Chưa đọc</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
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
  )
}
