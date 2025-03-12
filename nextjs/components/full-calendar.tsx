/* eslint-disable custom-rules/encourage-object-params */
import "~/styles/calendar.css"

import React from "react"

import {
  type DayCellContentArg, type DayHeaderContentArg,
} from "@fullcalendar/core/index.js"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import multiMonthPlugin from "@fullcalendar/multimonth"
import ReactFullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import {
  format,
} from "date-fns"
import {
  vi,
} from "date-fns/locale"

import {
  cn,
} from "~/shared/utils"

export interface FullCalendarProps extends React.ComponentProps<typeof ReactFullCalendar> {
  className?: string
  headerClick?: (date: Date) => void
}

export type FullCalendarRef = React.RefObject<ReactFullCalendar | null>

export const FullCalendar = React.forwardRef<ReactFullCalendar, FullCalendarProps>((
  {
    className, headerClick, ...props
  }, ref
) => {
  return (
    <div className={cn(className)}>
      <ReactFullCalendar
        ref={ref}
        timeZone="local"
        plugins={
          [
            dayGridPlugin,
            timeGridPlugin,
            multiMonthPlugin,
            interactionPlugin,
            listPlugin,
          ]
        }
        initialView="timeGridWeek"
        locale={vi}
        headerToolbar={false}
        slotMinTime="00:00"
        slotMaxTime="24:00"
        allDaySlot={false}
        firstDay={1}
        height="32vh"
        displayEventEnd
        windowResizeDelay={0}
        slotLabelFormat={
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        }
        eventTimeFormat={
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        }
        eventBorderColor="black"
        contentHeight="auto"
        expandRows
        dayCellContent={dayInfo => <DayRender info={dayInfo} />}
        dayHeaderContent={
          headerInfo => (
            <DayHeader
              info={headerInfo}
              onClick={headerClick}
            />
          )
        }
        nowIndicator
        editable
        selectable
        {...props}
      />
    </div>
  )
})
FullCalendar.displayName = "FullCalendar"

const DayHeader = ({
  info, onClick,
}: {
  info: DayHeaderContentArg
  onClick?: (date: Date) => void
}) => {
  return (
    <div className="flex items-center h-full overflow-hidden">
      {
        info.view.type === "timeGridDay" ? (
          <div className="flex flex-col rounded-sm">
            <p className="capitalize">
              {
                format(
                  info.date, "dd MMMM, yyyy"
                )
              }
            </p>
          </div>
        ) : info.view.type === "timeGridWeek" ? (
          <div className="flex flex-col space-y-0.5 rounded-sm items-center w-full text-xs sm:text-sm md:text-md">
            <p className="capitalize font-medium">
              {
                format(
                  info.date, "iiiiii"
                )
              }
            </p>

            <div
              onClick={() => onClick?.(info.date)}
              role="button"
              className={
                cn(
                  "hover:bg-muted rounded-full size-7 grid place-content-center transition-colors",
                  info.isToday ? "!bg-foreground text-sm !text-background" : ""
                )
              }
            >
              <span className="font-light">{info.date.getDate()}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col rounded-sm">
            <p className="capitalize">
              {
                format(
                  info.date, "io"
                )
              }
            </p>
          </div>
        )
      }
    </div>
  )
}

const DayRender = ({ info }: {
  info: DayCellContentArg
}) => {
  return (
    <div className="flex">
      {
        info.view.type === "dayGridMonth" && info.isToday
          ? (
            <div className="flex size-7 rounded-full bg-black dark:bg-white items-center justify-center text-sm text-white dark:text-black">
              {info.dayNumberText}
            </div>
          )
          : (
            <div className="flex size-7 rounded-full items-center justify-center text-sm">
              {info.dayNumberText}
            </div>
          )
      }
    </div>
  )
}
