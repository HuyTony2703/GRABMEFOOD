import { useTheme } from "next-themes"
import { PageTitle } from "@/app/components/layout/PageTitle"
export function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme()
  return (
    <section>
      <PageTitle title="Giao diện" />
      <p className="mb-6">
        Áp dụng cho toàn bộ website và ghi nhớ lựa chọn trên thiết bị này.
      </p>
      <fieldset>
        <legend>Chế độ hiển thị</legend>
        <div className="filter-options">
          {[
            ["light", "Sáng"],
            ["dark", "Tối"],
            ["system", "Theo hệ thống"],
          ].map(([value, label]) => (
            <label key={value} className="filter-option">
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
