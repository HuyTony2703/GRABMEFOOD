import { useState } from "react"
export function ContentImage({
  src,
  alt,
  className = "card-image",
  eager = false,
}: {
  src?: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  ) : (
    <div
      className={`${className} image-unavailable`}
      role="img"
      aria-label={`Chưa có ảnh: ${alt}`}
    >
      Ảnh chưa khả dụng
    </div>
  )
}
