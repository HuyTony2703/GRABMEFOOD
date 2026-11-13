import { useState } from "react"
import { Link } from "react-router"
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
    favorites.has("dish", dish.favoriteKey),
  )
  const candidates =
    mode === "all"
      ? favoriteDishChoices
      : saved.filter((dish) => selected.includes(dish.favoriteKey))
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
               <label className="filter-option" key={dish.favoriteKey}>
                <input
                  type="checkbox"
                  checked={selected.includes(dish.favoriteKey)}
                  onChange={() =>
                    setSelected((old) =>
                      old.includes(dish.favoriteKey)
                        ? old.filter((id) => id !== dish.favoriteKey)
                        : [...old, dish.favoriteKey],
                    )
                  }
                />
                {dish.name} — {dish.restaurantName}
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
      {!candidates.length && (
        <ContentState title="Chưa có món tại quán để chọn">
          <p>Chọn ít nhất một món đã lưu hoặc chuyển sang nguồn “Toàn bộ”.</p>
          <Link className="underline" to="/search">Khám phá món tại quán</Link>
        </ContentState>
      )}
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
    </div>
  )
}
