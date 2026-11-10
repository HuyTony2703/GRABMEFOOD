import { PageTitle } from "@/app/components/layout/PageTitle"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
export function AccountSettingsPage() {
  const rows = [
    ["Họ và tên", "Nguyễn Văn A"],
    ["Email", "nguyenvana@example.com"],
    ["Số điện thoại", "0912 345 678"],
    ["Mật khẩu", "••••••••"],
    [
      "Xác thực hai yếu tố",
      "Đã bật (giá trị minh họa, không phản ánh trạng thái bảo mật thật)",
    ],
  ]
  return (
    <section>
      <PageTitle title="Tài khoản và bảo mật" />
      <UnavailableNote>
        Thông tin mẫu, không phải tài khoản đã đăng nhập. Chỉnh sửa và xác thực
        bảo mật chưa được kết nối dịch vụ.
      </UnavailableNote>
      <dl className="border border-border rounded-lg">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="p-4 border-b border-border last:border-b-0"
          >
            <dt className="text-sm mb-2">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
