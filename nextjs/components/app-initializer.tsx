"use client"

import React from "react"

import {
  useQueries,
} from "@tanstack/react-query"
import {
  type Session,
} from "next-auth"

import {
  useConfigsStore,
} from "~/shared/hooks/data/use-config"
import {
  useSessionStore,
} from "~/shared/hooks/data/use-session"

import {
  getMe,
} from "~/features/auth/api/auth"
import {
  type LoginUser,
} from "~/features/auth/type/auth"
import {
  getOptions,
} from "~/features/setting/api/option"
import {
  type Configuration,
} from "~/features/setting/type/option"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  MAINTENANCE_CODE,
} from "~/shared/constants"
import {
  type ApiResponse,
} from "~/types/api"

interface AppInitializerProps {
  children: React.ReactNode
  session: Session
}

export function AppInitializer({
  children, session,
}: AppInitializerProps) {
  const {
    isPending, isMaintenance,
  } = useQueries({
    queries: [
      {
        queryKey: ["getMe"],
        queryFn: getMe,
        select: (data: ApiResponse<LoginUser>) => {
          if (data.data && !useSessionStore.getState().session) {
            useSessionStore.setState({
              session: {
                user: data.data,
                expires: session.expires,
              },
            })
          }
        },
      },
      {
        queryKey: ["getOptions"],
        queryFn: getOptions,
        select: (data: ApiResponse<Configuration>) => {
          if (data.data && !useConfigsStore.getState().configs) {
            useConfigsStore.setState({
              configs: data.data,
            })
          }
        },
      },
    ],
    combine: (results) => {
      return {
        isPending: results.some(result => result.isPending),
        isMaintenance: results.some((result) => {
          // @ts-expect-error
          return result.error?.statusCode === MAINTENANCE_CODE
        }),
      }
    },
  })

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900" />
      </div>
    )
  }

  if (isMaintenance) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage
          title="Hệ thống đang được bảo trì!"
          message="Vui lòng quay lại sau."
          className="max-w-96"
        />
      </div>
    )
  }

  return children
}
