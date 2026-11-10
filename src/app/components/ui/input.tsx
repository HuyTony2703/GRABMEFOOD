import * as React from "react"

import { cn } from "@/app/components/ui/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-foreground selection:bg-primary selection:text-primary-foreground border-input flex min-h-12 w-full min-w-0 rounded-md border px-3 py-2 text-base bg-input-background transition-colors file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        className,
      )}
      {...props}
    />
  )
}

export { Input }
