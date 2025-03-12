import React from "react"

import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

interface TooltipContainerProps {
  children: React.ReactElement
  title?: React.ReactNode
  content?: React.ReactNode
  align?: "center" | "end" | "start"
  side?: "top" | "right" | "bottom" | "left"
}

export function TooltipContainer({
  children, title, content, align, side,
}: TooltipContainerProps) {
  const text = title ?? children.props?.title ?? null
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>

        <TooltipContent
          align={align}
          side={side}
        >
          {content ?? text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
