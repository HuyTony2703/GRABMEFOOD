import { PageTitle } from "@/app/components/layout/PageTitle"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
export function LanguageSettingsPage() {
  return (
    <section>
      <PageTitle title="Ngôn ngữ" />
      <UnavailableNote>
        Hiện chỉ có nội dung tiếng Việt. Các ngôn ngữ khác chưa có bản dịch,
        không đổi nhãn lựa chọn để giả lập đã dịch.
      </UnavailableNote>
      <fieldset>
        <legend>Ngôn ngữ hiển thị</legend>
        <div className="filter-options">
          {[
            ["vi", "Tiếng Việt"],
            ["en", "English"],
            ["ja", "日本語"],
            ["ko", "한국어"],
            ["zh", "中文"],
            ["th", "ไทย"],
          ].map(([code, label]) => (
            <label className="filter-option" key={code}>
              <input
                type="radio"
                name="language"
                checked={code === "vi"}
                readOnly
                disabled={code !== "vi"}
              />
              {label}
              {code !== "vi" && " — chưa khả dụng"}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
