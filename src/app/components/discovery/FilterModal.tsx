import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { resetFilters } from "@/app/lib/discovery"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  inline?: boolean
}
export function FilterModal({
  isOpen,
  onClose,
  inline = false,
}: FilterModalProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [distance, setDistance] = useState("")
  const [price, setPrice] = useState("")
  const [types, setTypes] = useState<string[]>([])
  const opener = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(location.search)
      setDistance(params.get("distance") ?? "")
      setPrice(params.get("price") ?? "")
      setTypes(params.get("types")?.split(",").filter(Boolean) ?? [])
    }
  }, [isOpen, location.search])
  const form = (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const next = resetFilters(new URLSearchParams(location.search))
        if (distance) next.set("distance", distance)
        if (price) next.set("price", price)
        if (types.length) next.set("types", types.join(","))
        navigate(`/search?${next.toString()}`)
        onClose()
      }}
    >
      <div className="filter-body">
        <fieldset>
          <legend className="font-medium">Khoảng cách mẫu tối đa</legend>
          <div className="filter-options">
            {[
              ["", "Không giới hạn"],
              ["0.5", "500 m"],
              ["1", "1 km"],
              ["2", "2 km"],
              ["5", "5 km"],
              ["5+", "Trên 5 km"],
            ].map(([value, label]) => (
              <label className="filter-option" key={value}>
                <input
                  type="radio"
                  name="distance"
                  value={value}
                  checked={distance === value}
                  onChange={() => setDistance(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-medium">Khoảng giá tham khảo</legend>
          <div className="filter-options">
            {[
              ["", "Tất cả"],
              ["0-50", "Dưới 50.000 ₫"],
              ["50-100", "50.000–100.000 ₫"],
              ["100-200", "100.000–200.000 ₫"],
              ["200+", "Trên 200.000 ₫"],
            ].map(([value, label]) => (
              <label className="filter-option" key={value}>
                <input
                  type="radio"
                  name="price"
                  value={value}
                  checked={price === value}
                  onChange={() => setPrice(value)}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="text-sm mt-2">
            Món/quán có khoảng giá giao với mức đã chọn sẽ được hiển thị.
          </p>
        </fieldset>
        <fieldset>
          <legend className="font-medium">Loại món có trong dữ liệu</legend>
          <div className="filter-options">
            {[
              ["Noodles", "Món nước"],
              ["Cafe", "Cà phê"],
              ["Hotpot", "Lẩu"],
              ["Snacks", "Ăn nhẹ"],
              ["Vietnamese", "Món Việt"],
              ["Fast Food", "Đồ ăn nhanh"],
              ["Milk Tea", "Trà sữa"],
              ["Italian", "Món Ý"],
              ["Japanese", "Món Nhật"],
            ].map(([value, label]) => (
              <label className="filter-option" key={value}>
                <input
                  type="checkbox"
                  checked={types.includes(value)}
                  onChange={() =>
                    setTypes((old) =>
                      old.includes(value)
                        ? old.filter((item) => item !== value)
                        : [...old, value],
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-sm mt-4">
          Lọc theo quốc gia và mới nhất chưa khả dụng vì dữ liệu không có thông
          tin xác minh tương ứng.
        </p>
      </div>
      <div className="filter-actions">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDistance("")
            setPrice("")
            setTypes([])
          }}
        >
          Đặt lại
        </Button>
        <Button type="submit">Áp dụng</Button>
      </div>
    </form>
  )
  if (inline)
    return (
      <aside className="inline-filters" aria-label="Bộ lọc kết quả">
        <h2 className="mb-3">Bộ lọc</h2>
        <p className="text-sm mb-4">Áp dụng trên dữ liệu mẫu.</p>
        {form}
      </aside>
    )
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="filter-dialog"
        onOpenAutoFocus={() => {
          opener.current = document.activeElement as HTMLElement
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          opener.current?.focus()
        }}
      >
        <DialogTitle className="pr-10">Bộ lọc</DialogTitle>
        <DialogDescription>
          Áp dụng trên dữ liệu mẫu. Khoảng cách không lấy từ vị trí thiết bị.
        </DialogDescription>
        {form}
      </DialogContent>
    </Dialog>
  )
}
