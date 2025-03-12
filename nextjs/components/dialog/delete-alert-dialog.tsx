import {
  useCallback,
} from "react"

import {
  toast,
} from "sonner"

import {
  BaseAlertDialog, type BaseAlertDialogProps,
} from "~/shared/components/dialogs/base-alert-dialog"
import {
  type ErrorResponse,
} from "~/types/api"

export interface DeleteAlertDialogProps extends BaseAlertDialogProps {
  onDelete?: () => Promise<unknown>
  onDeleteSuccess?: <T>(value: T) => void
}

export function DeleteAlertDialog({
  onDelete, onDeleteSuccess, doc, ...props
}: DeleteAlertDialogProps) {
  const handleAction = useCallback(
    () => {
      if (onDelete instanceof Function)
        toast.promise(
          onDelete, {
            loading: "Đang xóa...",
            success: (data) => {
              onDeleteSuccess?.(data)
              return (data as ErrorResponse).message || "Xóa thành công"
            },
            error: (error) => {
              return (error as Error).message || "Xóa thất bại"
            },
          }
        )
    }, [
      onDelete,
      onDeleteSuccess,
    ]
  )

  return (
    <BaseAlertDialog
      {...props}
      onAction={handleAction}
      doc={
        {
          title: "Bạn có muốn xóa không?",
          descriptions: "Thao tác này không thể quay lại. Điều này sẽ xóa dữ liệu của bạn khỏi máy chủ của chúng tôi.",
          cancel: "Đóng",
          action: "Xóa",
          ...doc,
        }
      }
    />
  )
}
