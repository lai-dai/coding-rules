/* eslint-disable react/no-array-index-key */
import React from "react"

import {
  format,
} from "date-fns"
import {
  Check,
  Ellipsis,
  Plus,
  Save,
  X,
} from "lucide-react"
import {
  type FieldValues,
  type UseFormReturn,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"

import {
  confirmAlert,
} from "~/shared/components/dialogs/use-confirm-alert"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardHeader,
  CardTitle,
} from "~/shared/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu"
import {
  Form,
} from "~/shared/components/ui/form"
import {
  Separator,
} from "~/shared/components/ui/separator"
import {
  cn,
} from "~/shared/utils"
import {
  type Author,
} from "~/types/shared"

export interface BaseAppFormProps {
  createText?: string
  updateText?: string
  isCreate?: boolean
  isInDialog?: boolean
  onDeleteSuccess?: () => void
  title?: string
  hasInfo?: boolean
  isSubmitDisabled?: false
}

export interface AppFormProps<TFieldValues extends FieldValues = FieldValues> extends BaseAppFormProps {
  children: React.ReactNode
  form: UseFormReturn<TFieldValues>
  hasPublish?: boolean
  isPublished?: boolean
  onDelete?: () => unknown
  onPublish?: SubmitHandler<TFieldValues>
  onPublishError?: SubmitErrorHandler<TFieldValues>
  onSubmit?: SubmitHandler<TFieldValues>
  onSubmitError?: SubmitErrorHandler<TFieldValues>
  values?: Record<string, unknown>
}

export function AppForm<TFieldValues extends FieldValues>({
  title, isCreate, values, onDelete, hasPublish, isPublished, onPublish, onSubmit, isInDialog, form, children, onSubmitError, onPublishError, onDeleteSuccess, hasInfo = true, createText = "Tạo", updateText = "Cập nhật", isSubmitDisabled,
}: AppFormProps<TFieldValues>) {
  return (
    <Form {...form}>
      <div className="grid gap-5 lg:grid-cols-12 ư">
        <div className="lg:col-span-9">
          <Card className={
            cn(
              "bg-transparent", isInDialog ? "border-0" : ""
            )
          }
          >
            <CardHeader className={
              cn(
                "space-y-5", isInDialog ? "p-0" : ""
              )
            }
            >
              {children}
            </CardHeader>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className={
            cn(
              "space-y-6 lg:sticky",
              isInDialog ? "top-0" : "top-20"
            )
          }
          >
            <ErrorMessage
              variant="destructive"
              message={form.formState.errors.root?.message}
            />

            <div className="space-y-3">
              {
                hasPublish ? (
                  <div className="flex gap-3">
                    <Button
                      disabled={isPublished || (!form.formState.isDirty && isCreate)}
                      onClick={
                        onPublish ? form.handleSubmit(
                          onPublish, onPublishError
                        ) : undefined
                      }
                      type="button"
                      variant={isPublished ? "secondary" : "default"}
                      className="grow"
                    >
                      <Check />

                      {isPublished ? "Đã xuất bản" : "Xuất bản" }
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                        >
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={
                            onPublish ? form.handleSubmit(
                              onPublish, onPublishError
                            ) : undefined
                          }
                          disabled={!isPublished || isCreate}
                        >
                          <X className="size-4 mr-2" />

                          Ngừng xuất bản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : null
              }

              <Button
                onClick={
                  onSubmit ? form.handleSubmit(
                    onSubmit, onSubmitError
                  ) : undefined
                }
                isLoading={form.formState.isSubmitting}
                disabled={isSubmitDisabled === undefined ? !form.formState.isDirty : isSubmitDisabled}
                variant={hasPublish && !isPublished ? "secondary" : "default"}
                type="button"
                className="w-full"
              >
                {isCreate ? <Plus /> : <Save />}

                {isCreate ? `${createText} ${title ?? ""}` : `${updateText} ${title ?? ""}`}
              </Button>
            </div>

            {
              hasInfo ? (
                isCreate
                  ? (
                    <Card className="bg-transparent">
                      <CardHeader className="gap-2">
                        <CardTitle>Thông tin</CardTitle>

                        <Separator />

                        <div className="flex justify-between items-center gap-3">
                          <p className="text-sm">Ngày tạo:</p>

                          <p className="text-xs text-muted-foreground">Bây giờ</p>
                        </div>

                        <div className="flex justify-between items-center gap-3">
                          <p className="text-sm">Ngày sửa:</p>

                          <p className="text-xs text-muted-foreground">Bây giờ</p>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                  : values
                    ? (
                      <React.Fragment>
                        <Card className="bg-transparent">
                          <CardHeader className="gap-2">
                            <CardTitle>Thông tin</CardTitle>

                            <Separator />

                            {
                              values?.created_date
                                ? (
                                  <div className="flex justify-between items-center gap-3">
                                    <p className="text-sm">Ngày tạo:</p>

                                    <p className="text-xs text-muted-foreground">
                                      {
                                        format(
                                          new Date(values?.created_date as string), "dd/MM/yyyy, HH:mm"
                                        )
                                      }
                                    </p>
                                  </div>
                                )
                                : null
                            }

                            {
                              values?.author ? (
                                <div className="flex justify-between items-center gap-3">
                                  <p className="text-sm">Người tạo:</p>

                                  <p className="text-xs text-muted-foreground">
                                    {(values?.author as Author)?.full_name || "-"}
                                  </p>
                                </div>
                              ) : null
                            }

                            {
                              values?.updated_date
                                ? (
                                  <div className="flex justify-between items-center gap-3">
                                    <p className="text-sm">Ngày sửa:</p>

                                    <p className="text-xs text-muted-foreground">
                                      {
                                        format(
                                          new Date(values?.updated_date as string), "dd/MM/yyyy, HH:mm"
                                        )
                                      }

                                    </p>
                                  </div>
                                )
                                : null
                            }
                          </CardHeader>
                        </Card>

                        {
                          onDelete instanceof Function ? (
                            <Button
                              onClick={
                                () => confirmAlert({
                                  onAction: onDelete,
                                  onActionSuccess: onDeleteSuccess,
                                })
                              }
                              disabled={!values.author_id}
                              type="button"
                              variant="outline"
                              className="w-full border-destructive !text-destructive !bg-destructive/20"
                            >
                              {`Xóa ${title ?? ""}`}
                            </Button>
                          ) : null
                        }
                      </React.Fragment>
                    )
                    : null
              ) : null
            }
          </div>
        </div>
      </div>
    </Form>
  )
}
