import React from "react"

import {
  type Table as ITable, type Row, type RowData,
} from "@tanstack/react-table"

import {
  ErrorView,
} from "~/shared/components/shared/error"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  ReactTable,
  Table, TableBody, TableCell, TableRowExpanded, TableHead, TableHeader, TableHeadGroup, TableRow, TableBodyEmpty,
  type TableExpandedRowProps,
  TableFooter,
} from "~/shared/components/tables/react-table"
import {
  cn,
} from "~/shared/utils"

export interface BaseDataTableProps {
  className?: string
  emptyMessage?: string
  error?: Error | null
  FooterComponent?: React.ReactNode
  isLoading?: boolean
}

export interface DataTableProps<T extends RowData> extends BaseDataTableProps {
  ExpandedComponent?: TableExpandedRowProps<T>["children"]
  onRowClick?: (row: Row<T>) => void
  table: ITable<T>
  EmptyResultComponent?: React.ReactNode
}

export function DataTable<T>({
  className, ExpandedComponent, onRowClick, error, isLoading, table, emptyMessage = "Không tìm thấy kết quả nào!", FooterComponent, EmptyResultComponent,
}: DataTableProps<T>) {
  const empty = EmptyResultComponent ?? (
    isLoading ? (
      <Loading />
    ) : error ? (
      <ErrorView error={error} />
    ) : (
      <ErrorView message={emptyMessage} />
    )
  )
  return (
    <div className={
      cn(
        "md:max-h-[72vh] w-full overflow-auto flex-1", className
      )
    }
    >
      <ReactTable table={table}>
        <Table className="text-sm">
          <TableHeader className="h-12 sticky top-0 z-10 border-b bg-background shadow-[0px_-3px_3px_-3px_hsl(var(--border))_inset]">
            <TableHeadGroup>
              <TableHead className="p-2 text-left align-middle font-semibold data-[pinned=true]:bg-background hover:bg-muted hover:data-[pinned=true]:bg-muted" />
            </TableHeadGroup>
          </TableHeader>

          <TableBodyEmpty>{empty}</TableBodyEmpty>

          <TableBody>
            {
              (row: Row<T>) => (
                <React.Fragment>
                  <TableRow
                    row={row}
                    className="group/tableRow border-b hover:bg-muted/10 bg-background aria-[selected=true]:bg-muted"
                  >
                    {
                      (cell) => {
                        const allowClick = cell.column.columnDef.meta?.allowClick ?? true
                        return (
                          <TableCell
                            cell={cell}
                            className={
                              cn(
                                "p-2 align-middle group-hover/tableRow:border-secondary group-hover/tableRow:!bg-accent/80 data-[pinned=true]:bg-background group-aria-[selected=true]/tableRow:!bg-muted group-aria-[selected=true]/tableRow:!text-primary", allowClick && onRowClick && "cursor-pointer"
                              )
                            }
                            onClick={
                              () => {
                                if (allowClick && onRowClick instanceof Function) {
                                  onRowClick?.(row)
                                }
                              }
                            }
                          />
                        )
                      }
                    }
                  </TableRow>

                  <TableRowExpanded row={row}>{ExpandedComponent}</TableRowExpanded>
                </React.Fragment>
              )
            }
          </TableBody>

          {
            FooterComponent ? (
              <TableFooter>
                {FooterComponent}
              </TableFooter>
            ) : null
          }
        </Table>
      </ReactTable>
    </div>
  )
}
