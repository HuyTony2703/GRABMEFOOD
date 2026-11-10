import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import { PageTitle } from "@/app/components/layout/PageTitle"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
import { Button } from "@/app/components/ui/button"
export function SettingsPage() {
  const groups = [
    {
      title: "Tài khoản",
      items: [
        ["account", "Tài khoản và bảo mật"],
        ["address", "Địa chỉ"],
      ],
    },
    {
      title: "Cài đặt",
      items: [
        ["notifications", "Cài đặt thông báo"],
        ["language", "Ngôn ngữ"],
        ["theme", "Giao diện"],
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        ["support", "Trung tâm hỗ trợ"],
        ["terms", "Điều khoản của GrabMeFood"],
        ["guide", "Hướng dẫn sử dụng"],
      ],
    },
  ]
  return (
    <section>
      <PageTitle title="Cài đặt" back="/profile" backLabel="Về hồ sơ" />
      {groups.map((group) => (
        <section key={group.title} className="mb-8">
          <h2 className="mb-3">{group.title}</h2>
          <ul className="border border-border rounded-lg">
            {group.items.map(([path, label]) => (
              <li key={path} className="border-b last:border-b-0 border-border">
                <Link
                  className="flex justify-between items-center gap-4 p-4 min-h-12 hover:bg-accent"
                  to={`/settings/${path}`}
                >
                  {label}
                  <ChevronRight size={20} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <UnavailableNote>
        Chưa có phiên đăng nhập được xác thực; chuyển tài khoản và đăng xuất
        chưa khả dụng.
      </UnavailableNote>
      <div className="flex flex-wrap gap-3">
        <Button disabled variant="outline">
          Chuyển đổi tài khoản
        </Button>
        <Button disabled variant="outline">
          Đăng xuất
        </Button>
      </div>
    </section>
  )
}
