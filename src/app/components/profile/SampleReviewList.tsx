import { Link } from "react-router"
import { nearbyRestaurants } from "@/app/data/restaurants"
import { ContentImage } from "@/app/components/media/ContentImage"
// Existing profile/review fixtures consolidated without changing their values.
const reviews = [
  {
    id: "1",
    restaurant: nearbyRestaurants[0],
    rating: 5,
    comment: "Phở rất ngon, nước dùng đậm đà, thịt bò mềm. Sẽ quay lại!",
    date: "2 ngày trước",
    likes: 24,
    images: 3,
  },
  {
    id: "2",
    restaurant: nearbyRestaurants[1],
    rating: 4,
    comment: "Quán đẹp, view oke. Giá hơi cao nhưng chất lượng tốt.",
    date: "1 tuần trước",
    likes: 15,
    images: 2,
  },
  {
    id: "3",
    restaurant: nearbyRestaurants[3],
    rating: 5,
    comment: "Bánh mì ngon nhất quận! Giá rẻ mà chất lượng tuyệt vời.",
    date: "2 tuần trước",
    likes: 42,
    images: 1,
  },
  {
    id: "4",
    restaurant: nearbyRestaurants[2],
    rating: 4,
    comment: "Không gian thoải mái, phục vụ nhiệt tình. Giá cả hợp lý.",
    date: "3 tuần trước",
    likes: 18,
    images: 4,
  },
  {
    id: "5",
    restaurant: nearbyRestaurants[0],
    rating: 5,
    comment: "Món ăn đa dạng, phong phú. Sẽ giới thiệu cho bạn bè!",
    date: "1 tháng trước",
    likes: 31,
    images: 2,
  },
]
export function SampleReviewList({ recent = false }: { recent?: boolean }) {
  return (
    <ul className="space-y-6">
      {(recent ? reviews.slice(0, 3) : reviews).map((review) => (
        <li key={review.id} className="border-b border-border pb-6">
          <div className="flex gap-4 items-start">
            <ContentImage
              src={review.restaurant.image}
              alt={review.restaurant.name}
              className="w-20 h-20 object-cover rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <h3>{review.restaurant.name}</h3>
              <p className="text-sm mt-2">
                {review.rating}/5 · {review.date}
              </p>
            </div>
          </div>
          <p className="my-4">{review.comment}</p>
          <p className="text-sm mb-3">
            {review.likes} lượt thích · {review.images} ảnh (số liệu mẫu)
          </p>
          <Link
            className="underline inline-flex min-h-11 items-center"
            to={`/restaurant/${review.restaurant.id}`}
            state={{ scrollToReviews: true }}
          >
            Xem thông tin {review.restaurant.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
