import { useState } from "react"
import { PageTitle } from "@/app/components/layout/PageTitle"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
export function SupportChatPage() {
  const [draft, setDraft] = useState("")
  return (
    <section>
      <PageTitle title="Trung tâm hỗ trợ" />
      <div id="support-note">
        <UnavailableNote>
          Chưa kết nối dịch vụ hỗ trợ. Không có nhân viên hoặc phản hồi tự động
          trực tiếp; tin nhắn chưa thể gửi.
        </UnavailableNote>
      </div>
      <p className="mb-6">
        Xin chào! Bạn cần hỗ trợ gì? Đây là lời chào mẫu, không phải một cuộc
        hội thoại đã được tiếp nhận.
      </p>
      <label htmlFor="support-draft" className="block mb-2">
        Nội dung cần hỗ trợ (bản nháp trên trang)
      </label>
      <Textarea
        id="support-draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-describedby="support-note"
      />
      <Button disabled className="mt-4">
        Gửi tin nhắn — chưa khả dụng
      </Button>
    </section>
  )
}
