import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"
import { ArrowUp } from "lucide-react"
import { Button } from "@/app/components/ui/button"

export function BackToTop() {
  const { pathname, search } = useLocation()
  const [visible, setVisible] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.visualViewport
      const height = viewport?.height ?? window.innerHeight
      const footer = document.getElementById("site-footer")
      const footerVisible =
        footer && footer.getBoundingClientRect().top < height
      const blocked = document.querySelector(
        '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], [data-page-error]',
      )
      const keyboardOpen =
        viewport && window.innerHeight - viewport.height > 120
      const main = document.getElementById("main-content")
      const contentRight = main
        ? main.getBoundingClientRect().right - parseFloat(getComputedStyle(main).paddingRight)
        : Infinity
      const hasRoom = contentRight + 16 <= window.innerWidth - 60
      const next =
        window.scrollY > 400 &&
        !footerVisible &&
        !blocked &&
        !keyboardOpen &&
        hasRoom &&
        height > 120
      if (!next && document.activeElement === button.current) {
        // If scrolling/overlays remove this control, leave focus on a stable target.
        document.getElementById("main-content")?.focus({ preventScroll: true })
      }
      setVisible(Boolean(next))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    })
    const resize = new ResizeObserver(schedule)
    resize.observe(document.body)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.visualViewport?.addEventListener("resize", schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.visualViewport?.removeEventListener("resize", schedule)
    }
  }, [pathname, search])

  return (
    <Button asChild variant="outline" size="icon" className="back-to-top">
      <button
        ref={button}
        type="button"
        hidden={!visible}
        aria-label="Lên đầu trang"
        onClick={() => {
          document
            .getElementById("main-content")
            ?.focus({ preventScroll: true })
          window.scrollTo({ top: 0, behavior: "instant" })
          setVisible(false)
        }}
      >
        <ArrowUp aria-hidden="true" />
      </button>
    </Button>
  )
}
