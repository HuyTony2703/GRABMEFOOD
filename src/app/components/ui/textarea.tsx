import * as React from "react"

import { cn } from "@/app/components/ui/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-y border-input placeholder:text-foreground aria-invalid:border-destructive flex min-h-28 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
