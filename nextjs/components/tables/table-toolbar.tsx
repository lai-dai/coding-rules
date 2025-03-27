import React from "react"

import dynamic from "next/dynamic"
import {
  usePathname, useRouter, useSearchParams,
} from "next/navigation"

import {
  type RowData, type Table,
} from "@tanstack/react-table"
import {
  Columns3, Filter, RotateCcw, Search,

} from "lucide-react"

import {
  SheetContainer,
  showSheet,
} from "~/shared/components/dialogs/sheet-container"
import {
  showDialog,
} from "~/shared/components/dialogs/use-open-dialog"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  SearchBarInput,
  SearchBarButton,
  SearchBar,
  SearchBarBox,
  SearchBarClear,
} from "~/shared/components/shared/search-bar"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Sheet, SheetContent, SheetTrigger,
} from "~/shared/components/ui/sheet"

const TableColumnVisibleContent = dynamic(
  () =>
    import("~/shared/components/tables/table-column-visibility-content").then(exported => exported.TableColumnVisibleContent,),
  {
    ssr: false,
    loading: () => <Loading />,
  },
)

export interface TableToolbarProps {
  filters?: Record<string, unknown>
  FiltersComponent?: React.ReactNode
  hasFilters?: boolean
  hasReset?: boolean
  hasExport?: boolean
  ExportComponent?: React.ReactNode
  hasSearch?: boolean
  onFilterClick?: () => void
  onFiltersChange?: (value: Record<string, unknown>) => void
  OtherComponent?: React.ReactNode

}

export function TableToolbar<T extends RowData>({
  filters,
  onFiltersChange,
  table,
  onFilterClick,

  OtherComponent,
  FiltersComponent,
  hasFilters = true,
  hasReset = true,
  hasExport = false,
  ExportComponent,
  hasSearch = true,
}: TableToolbarProps & {
  table?: Table<T>
}) {
  const id = React.useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className="flex flex-wrap justify-between md:items-center gap-3 md:flex-row flex-col">
      <div className="flex gap-3 items-center">
        {
          (typeof filters?.key === "string" && hasSearch) ? (
            <SearchBar
              defaultValue={filters?.key}
              onSearchChange={
                key => onFiltersChange?.({
                  key,
                })
              }
              className="grow"
            >
              <SearchBarBox className="h-8">
                <Search className="size-4 text-muted-foreground/60" />

                <SearchBarInput placeholder="Tìm kiếm" />

                <SearchBarClear />
              </SearchBarBox>

              <SearchBarButton size="sm">
                <Search className="size-2" />
                Tìm
              </SearchBarButton>
            </SearchBar>
          ) : null
        }

        {
          hasReset ? (
            <Button
              onClick={() => router.push(pathname)}
              variant="outline"
              size="sm"
              aria-hidden={searchParams.size === 0}
              className="aria-[hidden=true]:hidden hidden md:inline-flex"
            >
              <RotateCcw />
              Đặt lại
            </Button>
          ) : null
        }
      </div>

      <div className="flex gap-3 items-center justify-end">
        {OtherComponent}

        {
          hasFilters ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  onClick={
                    () => onFilterClick instanceof Function ? onFilterClick() : showDialog(
                      "filters", filters
                    )
                  }
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  <Filter />
                  Lọc

                  {
                    hasReset ? (
                      <div
                        aria-hidden={searchParams.size === 0}
                        className="bg-success size-2.5 rounded-sm aria-[hidden=true]:hidden"
                      />
                    ) : null
                  }
                </Button>
              </SheetTrigger>

              {
                FiltersComponent ? (
                  <SheetContent className="p-0 w-screen sm:w-auto sm:max-w-[75vw] min-w-96 flex flex-col gap-0">
                    {FiltersComponent}
                  </SheetContent>
                ) : null
              }
            </Sheet>
          ) : null
        }

        {
          table ? (
            <Button
              onClick={() => showSheet(`show-column-visibility-${id}`)}
              size="sm"
              variant="outline"
              type="button"
            >
              <Columns3 />
              Hiển thị
            </Button>
          ) : null
        }

        {
          hasExport
            ? (

              ExportComponent

            )
            : null
        }
      </div>

      <SheetContainer accessorKey={`show-column-visibility-${id}`}>
        <TableColumnVisibleContent table={table as Table<RowData>} />
      </SheetContainer>
    </div>
  )
}
