/* eslint-disable react/boolean-prop-naming */
"use client"

import {
  type ReactNode,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  ArrowLeft,
} from "lucide-react"

import {
  useLazyRef,
} from "~/shared/hooks/state/use-lazy-ref"

import {
  granted,
} from "~/shared/utils/permission"

import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  type PermissionCode,
} from "~/types/permission-code"

interface PermissionComponentProps {
  children?: ReactNode
  code?: PermissionCode | PermissionCode[]
  hasMessage?: boolean
  isSupperAdminOnly?: boolean
  MessageComponent?: ReactNode
  hidden?: boolean
}

export function PermissionComponent({
  children, MessageComponent, hasMessage = false, code, isSupperAdminOnly, hidden,
}: PermissionComponentProps) {
  const router = useRouter()
  const isGrantedRef = useLazyRef(() => granted(
    code, isSupperAdminOnly
  ))

  if (hidden) {
    return null
  }

  if (!isGrantedRef.current) {
    return hasMessage
      ? MessageComponent ?? (
        <div className="grid size-full place-content-center py-6 gap-3">
          <ErrorMessage
            title="Bạn hiện không xem được nội dung này"
            message="Lỗi này thường là do bạn không có quyền truy cập hoặc nội dung đã bị khóa"
          />

          <div className="flex justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
            >
              <ArrowLeft />

              Quay lại
            </Button>
          </div>
        </div>
      )
      : null
  }

  return children
}
