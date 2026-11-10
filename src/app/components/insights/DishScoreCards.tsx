import { ChefHat, Wallet, Utensils } from "lucide-react"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"

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
      <h3 className="text-base mb-3 text-black">Điểm theo tiêu chí</h3>
      <p className="text-xs text-gray-500 mb-3">
        Điểm trong dữ liệu mẫu của món ăn, theo thang 5.
      </p>
      <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-3">
        {scores.map(({ title, value, icon: Icon, description }) => (
          <Card
            key={title}
            className="min-w-0 gap-3 bg-gray-50 border-0 p-3 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-red-600" aria-hidden="true" />
            </div>
            <h4 className="text-sm text-black">{title}</h4>
            <p className="text-xl text-red-600">
              {value.toFixed(1)}
              <span className="text-xs text-gray-500"> / 5</span>
            </p>
            <Progress
              value={value * 20}
              aria-label={`${title}: ${value} trên 5`}
            />
            <p className="text-xs text-gray-500">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
