import { PageTitle } from "@/app/components/layout/PageTitle"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
import { Switch } from "@/app/components/ui/switch"
export function NotificationSettingsPage() {
  const groups = [
    {
      title: "Thông báo đẩy",
      items: [
        ["Khuyến mãi và ưu đãi", true],
        ["Phản hồi đánh giá", true],
        ["Người theo dõi mới", false],
        ["Lượt thích đánh giá", true],
        ["Quán gần bạn", true],
        ["Gợi ý cho bạn", false],
      ] as const,
    },
    {
      title: "Kênh thông báo khác",
      items: [
        ["Thông báo qua Email", false],
        ["Thông báo qua SMS", false],
      ] as const,
    },
  ]
  return (
    <section>
      <PageTitle title="Cài đặt thông báo" />
      <UnavailableNote>
        Trạng thái bên dưới là minh họa. Chưa có dịch vụ gửi thông báo, email
        hoặc SMS; chưa thể thay đổi tùy chọn thật.
      </UnavailableNote>
      {groups.map((group) => (
        <section className="mb-8" key={group.title}>
          <h2 className="mb-3">{group.title}</h2>
          <ul className="border border-border rounded-lg">
            {group.items.map(([label, checked]) => (
              <li
                key={label}
                className="flex justify-between gap-4 p-4 border-b border-border last:border-b-0"
              >
                <span>{label}</span>
                <Switch
                  checked={checked}
                  disabled
                  aria-label={`${label} — trạng thái mẫu, chưa khả dụng`}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
