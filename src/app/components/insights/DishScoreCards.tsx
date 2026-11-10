import { ChefHat, Wallet, Utensils } from "lucide-react"

import { Card } from "@/app/components/ui/card"

import { Progress } from "@/app/components/ui/progress"

interface DishScoreCardsProps {
  taste: number

  price: number

  presentation: number
}

export function DishScoreCards({
  taste,

  price,

  presentation,
}: DishScoreCardsProps) {
  const scores = [
    {
      title: "Hương vị",

      value: taste,

      icon: ChefHat,

      description: "Điểm chất lượng hương vị món ăn.",
    },

    {
      title: "Mức giá",

      value: price,

      icon: Wallet,

      description: "Điểm đánh giá về giá cả, không phải giá bán.",
    },

    {
      title: "Trình bày",

      value: presentation,

      icon: Utensils,

      description: "Điểm cách bày biện món ăn.",
    },
  ]

  return (
    <section className="mb-6" aria-label="Điểm theo tiêu chí">
      <h3 className="text-base mb-3 text-foreground">Điểm theo tiêu chí</h3>
      <p className="text-sm text-foreground mb-3">
        Điểm trong dữ liệu mẫu của món ăn, theo thang 5.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scores.map(({ title, value, icon: Icon, description }) => (
          <Card
            key={title}
            className="min-w-0 gap-3 bg-muted border border-border p-4 shadow-none"
          >
            <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center">
              <Icon className="w-5 h-5 text-foreground" aria-hidden="true" />
            </div>
            <h4 className="text-sm text-foreground">{title}</h4>
            <p className="text-xl text-foreground">
              {value.toFixed(1)}
              <span className="text-sm text-foreground"> / 5</span>
            </p>
            <Progress
              value={value * 20}
              aria-label={`${title}: ${value} trên 5`}
            />
            <p className="text-sm text-foreground">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
