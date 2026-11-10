import { useRef, useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/app/components/ui/alert-dialog"
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  showDontAskAgain?: boolean
}
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  showDontAskAgain = false,
}: ConfirmDialogProps) {
  const opener = useRef<HTMLElement | null>(null)
  const [dontAskAgain, setDontAskAgain] = useState(false)
  useEffect(() => {
    if (isOpen) opener.current = (document.activeElement as HTMLElement)
  }, [isOpen])
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AlertDialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          ;(opener.current?.isConnected
            ? opener.current
            : document.querySelector<HTMLElement>("main button, main")
          )?.focus()
        }}
      >
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription className="text-foreground">
          {message}
        </AlertDialogDescription>
        {showDontAskAgain && (
          <label className="filter-option">
            <input
              type="checkbox"
              checked={dontAskAgain}
              onChange={(event) => setDontAskAgain(event.target.checked)}
            />
            Không hỏi lại
          </label>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (dontAskAgain) localStorage.setItem(`confirm-${title}`, "skip")
              onConfirm()
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
