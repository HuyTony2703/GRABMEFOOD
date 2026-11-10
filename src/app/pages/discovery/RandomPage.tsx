import { useState } from "react"
import { BottomNav } from "@/app/components/layout/BottomNav"
import { DishCard, type DishCardRecord } from "@/app/components/discovery/DishCard"
import { ContentState } from "@/app/components/feedback/ContentState"
import { useFavorites } from "@/app/contexts/FavoritesContext"
import { Button } from "@/app/components/ui/button"
import { favoriteDishChoices } from "@/app/lib/catalog"
export function RandomPage() {
  const favorites = useFavorites()
  const [mode, setMode] = useState("all")
  const [selected, setSelected] = useState<string[]>([])
  const [result, setResult] = useState<DishCardRecord | null>(null)
  const saved = favoriteDishChoices.filter((dish) =>
    favorites.has("dish", dish.id),
  )
  const candidates =
    mode === "all"
      ? favoriteDishChoices
      : saved.filter((dish) => selected.includes(dish.id))
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Hôm nay ăn gì?</h1>
          <p>
            Chọn ngẫu nhiên từ món có trang chi tiết trong dữ liệu mẫu. Không có
            gợi ý theo vị trí trực tiếp.
          </p>
        </div>
      </div>
      <fieldset>
        <legend className="font-medium">Nguồn món để chọn</legend>
        <div className="filter-options">
          {[
            ["all", "Toàn bộ"],
            ["selected", "Tự chọn từ yêu thích"],
          ].map(([value, label]) => (
            <label key={value} className="filter-option">
              <input
                type="radio"
                name="random-mode"
                checked={mode === value}
                onChange={() => {
                  setMode(value)
                  setResult(null)
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {mode === "selected" && (
        <section className="my-6">
          <h2>Chọn các món đã lưu</h2>
          {!saved.length && (
            <ContentState title="Chưa có món lưu">
              <p>Hãy lưu món từ trang chi tiết, hoặc chọn nguồn “Toàn bộ”.</p>
            </ContentState>
          )}
          <div className="filter-options">
            {saved.map((dish) => (
              <label className="filter-option" key={dish.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(dish.id)}
                  onChange={() =>
                    setSelected((old) =>
                      old.includes(dish.id)
                        ? old.filter((id) => id !== dish.id)
                        : [...old, dish.id],
                    )
                  }
                />
                {dish.name}
              </label>
            ))}
          </div>
        </section>
      )}
      <div className="search-toolbar">
        <Button
          disabled={!candidates.length}
          onClick={() =>
            setResult(candidates[Math.floor(Math.random() * candidates.length)])
          }
        >
          Chọn ngẫu nhiên ({candidates.length} món)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setResult(null)
            setSelected([])
          }}
        >
          Đặt lại
        </Button>
      </div>
      {!candidates.length && <p>Hãy chọn ít nhất một món để tiếp tục.</p>}
      <div aria-live="polite">
        {result ? (
          <section className="max-w-md">
            <h2 className="mb-4">Gợi ý của bạn</h2>
            <DishCard dish={result} />
          </section>
        ) : (
          <p className="my-6">
            Chưa có kết quả gợi ý. Nhấn “Chọn ngẫu nhiên” để bắt đầu.
          </p>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
