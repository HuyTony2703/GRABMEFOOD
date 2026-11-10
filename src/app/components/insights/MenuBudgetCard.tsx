import { useId, useState } from "react"

import { Wallet } from "lucide-react"

import { Card } from "@/app/components/ui/card"

import {
  formatPrice,
  summarizeMenu,
  type MenuPriceItem,
} from "@/app/components/insights/insightCalculations"

interface MenuBudgetCardProps {
  items: MenuPriceItem[]
}

export function MenuBudgetCard({ items }: MenuBudgetCardProps) {
  const inputId = useId()

  const fullMenu = summarizeMenu(items, Infinity)

  const [selectedBudget, setSelectedBudget] = useState<number | null>(null)

  if (fullMenu.min === null || fullMenu.max === null) return null

  const budget = Math.max(
    fullMenu.min,

    Math.min(selectedBudget ?? fullMenu.max, fullMenu.max),
  )

  const summary = summarizeMenu(items, budget)

  const firstMatch = summary.affordableItems[0]

  return (
    <Card className="mb-6 gap-3 border border-border bg-muted p-4 shadow-none">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-foreground" aria-hidden="true" />
        <h3 className="text-base text-foreground">Ngân sách thực đơn</h3>
      </div>
      <p className="text-sm text-foreground">
        So sánh giá từng món trong thực đơn mẫu, không phải tổng chi phí bữa ăn.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm text-foreground">
          Giá tối đa mỗi món
        </label>
        <output
          htmlFor={inputId}
          className="text-base font-medium text-foreground"
        >
          {formatPrice(budget)}
        </output>
      </div>
      <input
        id={inputId}
        type="range"
        min={fullMenu.min}
        max={fullMenu.max}
        step={1}
        value={budget}
        disabled={fullMenu.min === fullMenu.max}
        aria-valuetext={formatPrice(budget)}
        onChange={(event) => setSelectedBudget(Number(event.target.value))}
        className="w-full min-h-11 accent-primary"
      />
      <div className="flex justify-between text-sm text-foreground">
        <span>{formatPrice(fullMenu.min)}</span>
        <span>{formatPrice(fullMenu.max)}</span>
      </div>
      <p className="text-sm text-foreground" aria-live="polite">
        <span className="text-foreground font-medium">
          {summary.affordableItems.length}/{summary.pricedItems.length}
        </span>{" "}
        món có giá trong ngân sách đã chọn.
      </p>
      {summary.pricedItems.length < items.length && (
        <p className="text-sm text-foreground">
          Chỉ tính các món có giá cụ thể đọc được từ thực đơn.
        </p>
      )}
      {firstMatch && (
        <a
          href={`#menu-item-${firstMatch.id}`}
          className="self-start text-sm text-foreground underline min-h-11 inline-flex items-center focus-visible:outline-2 focus-visible:outline-foreground"
        >
          Đến món phù hợp đầu tiên
        </a>
      )}
    </Card>
  )
}
