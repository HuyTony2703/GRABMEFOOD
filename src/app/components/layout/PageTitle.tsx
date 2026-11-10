import { Link } from "react-router"
export function PageTitle({
  title,
  back = "/settings",
  backLabel = "Về cài đặt",
}: {
  title: string
  back?: string
  backLabel?: string
}) {
  return (
    <>
      <Link
        className="underline text-sm inline-flex items-center min-h-11"
        to={back}
      >
        {backLabel}
      </Link>
      <div className="page-heading">
        <h1>{title}</h1>
      </div>
    </>
  )
}
