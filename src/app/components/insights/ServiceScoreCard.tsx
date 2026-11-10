import { HandHeart } from "lucide-react"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
import { averageScore } from "./insightCalculations"

export function ServiceScoreCard({ scores }: { scores: number[] }) {
  const validScores = scores.filter(
    (score) => Number.isFinite(score) && score >= 0 && score <= 5,
  )
  const average = averageScore(validScores)
  if (average === null) return null

  return (
    <Card className="gap-3 border-0 bg-gray-50 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <HandHeart className="w-5 h-5 text-red-600" aria-hidden="true" />
        <h3 className="text-base text-black">Phục vụ tại quán</h3>
      </div>
      <p className="text-2xl text-red-600">
        {average.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}
        <span className="text-sm text-gray-500"> / 5</span>
      </p>
      <Progress
        value={average * 20}
        aria-label={`Điểm phục vụ: ${average} trên 5`}
      />
      <p className="text-xs text-gray-500">
        Trung bình điểm phục vụ từ {validScores.length} đánh giá mẫu đang hiển
        thị; không đại diện cho toàn bộ đánh giá của quán.
      </p>
    </Card>
  )
}
