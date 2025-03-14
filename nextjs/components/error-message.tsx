import {
  type ComponentProps,
  type ReactElement,
} from "react"

import {
  Megaphone,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/shared/components/ui/alert"
import {
  cn,
} from "~/shared/utils"

export interface ErrorMessageProps extends ComponentProps<typeof Alert> {
  error?: Error | null
  message?: string
  title?: string
  icon?: ReactElement
}

export function ErrorMessage({
  error,
  message,
  title = "Thông báo!",
  className,
  variant = "default",
  icon,
  ...props
}: ErrorMessageProps) {
  const text = message ?? error?.message
  if (!text) {
    return null
  }
  return (
    <Alert
      {...props}
      className={
        cn(
          "text-start",
          variant === "default" ? "border-0 bg-transparent" : "",
          className,
        )
      }
      variant={variant}
    >
      {icon ?? <Megaphone className="size-5" />}

      <AlertTitle>{title}</AlertTitle>

      <AlertDescription>
        <p>{text}</p>
      </AlertDescription>
    </Alert>
  )
}
