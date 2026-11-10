import { ChartNoAxesColumn } from "lucide-react"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
import { ratingDistribution } from "./insightCalculations"

export function ReviewDistributionCard({ ratings }: { ratings: number[] }) {
  const distribution = ratingDistribution(ratings)
  const total = distribution.reduce((sum, bucket) => sum + bucket.count, 0)
  if (!total) return null

  return (
    <Card className="mb-4 gap-3 border-0 bg-gray-50 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <ChartNoAxesColumn
          className="w-5 h-5 text-red-600"
          aria-hidden="true"
        />
        <h3 className="text-base text-black">Phân bố điểm đánh giá</h3>
      </div>
      <p className="text-xs text-gray-500">
        Chỉ tính {total} đánh giá mẫu đang hiển thị cho món tại quán này, không
        phải toàn bộ đánh giá.
      </p>
      <div className="space-y-3">
        {distribution.map((bucket) => (
          <div key={bucket.stars} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-gray-600">
              {bucket.label}
            </span>
            <Progress
              value={bucket.percent}
              aria-label={`${bucket.label}: ${bucket.count} đánh giá`}
              className="flex-1"
            />
            <span className="w-5 text-right text-xs text-gray-600">
              {bucket.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
