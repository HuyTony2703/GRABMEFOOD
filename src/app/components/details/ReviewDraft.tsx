import { useId, useState } from "react"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
export function ReviewDraft() {
  const id = useId()
  const [draft, setDraft] = useState("")
  return (
    <section className="my-6">
      <h2>Đánh giá của bạn</h2>
      <p id={`${id}-note`} className="unavailable-note">
        Chưa kết nối dịch vụ đánh giá. Bạn có thể nhập bản nháp trên trang này,
        nhưng chưa thể gửi hoặc tải tệp lên.
      </p>
      <label htmlFor={id} className="block mb-2">
        Nội dung đánh giá
      </label>
      <Textarea
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-describedby={`${id}-note`}
      />
      <div className="flex flex-wrap gap-3 mt-3">
        <Button
          type="button"
          variant="outline"
          disabled
          aria-describedby={`${id}-note`}
        >
          Thêm ảnh hoặc video
        </Button>
        <Button type="button" disabled aria-describedby={`${id}-note`}>
          Gửi đánh giá
        </Button>
      </div>
    </section>
  )
}
