import { useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
export function ShareButton() {
  const [message, setMessage] = useState("")
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Chia sẻ trang"
        onClick={async () => {
          try {
            if (navigator.share)
              await navigator.share({
                title: document.title,
                url: location.href,
              })
            else if (navigator.clipboard) {
              await navigator.clipboard.writeText(location.href)
              setMessage("Đã sao chép liên kết.")
            } else
              setMessage(
                "Trình duyệt chưa hỗ trợ chia sẻ. Bạn có thể sao chép địa chỉ trang.",
              )
          } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError"))
              setMessage("Chưa chia sẻ được. Hãy sao chép địa chỉ trang.")
          }
        }}
      >
        <Share2 aria-hidden="true" />
      </Button>
      <span className="text-sm" role="status">
        {message}
      </span>
    </div>
  )
}
