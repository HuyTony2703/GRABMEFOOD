import { ChartNoAxesColumn } from "lucide-react"

import { Card } from "@/app/components/ui/card"

import { Progress } from "@/app/components/ui/progress"

import { ratingDistribution } from "@/app/components/insights/insightCalculations"

export function ReviewDistributionCard({ ratings }: { ratings: number[] }) {
  const distribution = ratingDistribution(ratings)

  const total = distribution.reduce((sum, bucket) => sum + bucket.count, 0)

  if (!total) return null

  return (
    <Card className="mb-4 gap-3 border border-border bg-muted p-4 shadow-none">
      <div className="flex items-center gap-2">
        <ChartNoAxesColumn
          className="w-5 h-5 text-foreground"
          aria-hidden="true"
        />
        <h3 className="text-base text-foreground">Phân bố điểm đánh giá</h3>
      </div>
      <p className="text-sm text-foreground">
        Chỉ tính {total} đánh giá mẫu đang hiển thị cho món tại quán này, không
        phải toàn bộ đánh giá.
      </p>
      <div className="space-y-3">
        {distribution.map((bucket) => (
          <div key={bucket.stars} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-foreground">
              {bucket.label}
            </span>
            <Progress
              value={bucket.percent}
              aria-label={`${bucket.label}: ${bucket.count} đánh giá`}
              className="flex-1"
            />
            <span className="w-5 text-right text-sm text-foreground">
              {bucket.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
