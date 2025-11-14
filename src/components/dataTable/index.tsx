import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
  type SortingState,
} from "@tanstack/react-table"
import { ChevronDown, Filter, Search, X } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

type GridFormValues = {
  pageIndex: number
  pageSize: number
  search: string
  sortColumn: string
  sortDirection: 'asc' | 'desc' | ''
  conditionMatch: number
  isArchived: boolean
  filters: unknown[]
  scoreFilter: unknown[]
}

export type FilterConfig = {
  key: string
  label: string
  type: 'text' | 'checkbox' | 'select'
  formKey: string // Key in the form values
  options?: { label: string; value: string | boolean }[] // For select type
}

export function DataTableDemo<T>({ 
  columns, 
  data,
  totalRecords,
  hasSearchInput = true,
  filters = [],
}: { 
  columns: ColumnDef<T>[]
  data: T[]
  totalRecords?: number
  hasSearchInput?: boolean
  filters?: FilterConfig[]
}) {
  const form = useFormContext<GridFormValues>()
  const { watch, setValue } = form
  const pageIndex = watch("pageIndex")
  const pageSize = watch("pageSize")
  const search = watch("search")
  const sortColumn = watch("sortColumn")
  const sortDirection = watch("sortDirection")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)
  
  // Get current filter values from form
  const currentFilterValues = React.useMemo(() => {
    const values: Record<string, any> = {}
    filters.forEach(filter => {
      values[filter.formKey] = watch(filter.formKey as keyof GridFormValues)
    })
    return values
  }, [filters, watch])
  
  // Temporary filter state for the filter sidebar
  const [tempFilterValues, setTempFilterValues] = React.useState<Record<string, any>>(currentFilterValues)
  
  // Sync temporary state when filters change externally
  React.useEffect(() => {
    setTempFilterValues(currentFilterValues)
  }, [currentFilterValues])
  
  // Temporary search state (if search is not in filters)
  const [tempSearch, setTempSearch] = React.useState(search)
  React.useEffect(() => {
    setTempSearch(search)
  }, [search])
  
  // Sync sorting state with form
  const sorting: SortingState = React.useMemo(() => {
    if (sortColumn && sortDirection) {
      return [{ id: sortColumn, desc: sortDirection === 'desc' }]
    }
    return []
  }, [sortColumn, sortDirection])
  
  const handleSortingChange = (updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater
    if (newSorting.length > 0) {
      const sort = newSorting[0]
      setValue("sortColumn", sort.id)
      setValue("sortDirection", sort.desc ? 'desc' : 'asc')
      setValue("pageIndex", 0) // Reset to first page when sort changes
    } else {
      setValue("sortColumn", "")
      setValue("sortDirection", "")
      setValue("pageIndex", 0)
    }
  }
  
  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0
    if (search) count++
    filters.forEach(filter => {
      const value = currentFilterValues[filter.formKey]
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        count++
      }
    })
    return count
  }, [search, filters, currentFilterValues])

  const handlePageChange = (newPageIndex: number) => {
    setValue("pageIndex", newPageIndex)
  }
  
  const handlePageSizeChange = (newPageSize: number) => {
    setValue("pageSize", newPageSize)
    setValue("pageIndex", 0) // Reset to first page when page size changes
  }
  
  const handleSearchChange = (value: string) => {
    setValue("search", value)
    setValue("pageIndex", 0) // Reset to first page when search changes
  }
  
  const handleClearFilters = () => {
    setTempSearch("")
    const cleared: Record<string, any> = {}
    filters.forEach(filter => {
      if (filter.type === 'checkbox') {
        cleared[filter.formKey] = false
      } else if (filter.type === 'select') {
        cleared[filter.formKey] = ''
      } else {
        cleared[filter.formKey] = ''
      }
    })
    setTempFilterValues(cleared)
  }
  
  const handleApplyFilters = () => {
    setValue("search", tempSearch)
    filters.forEach(filter => {
      setValue(filter.formKey as keyof GridFormValues, tempFilterValues[filter.formKey])
    })
    setValue("pageIndex", 0) // Reset to first page when filters are applied
    setIsFiltersOpen(false)
  }
  
  const updateTempFilter = (formKey: string, value: any) => {
    setTempFilterValues(prev => ({
      ...prev,
      [formKey]: value
    }))
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalRecords ? Math.ceil(totalRecords / pageSize) : undefined,
    state: {
      columnVisibility,
      rowSelection,
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  })

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {hasSearchInput && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(event.target.value)
                }
                className="pl-9"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => handleSearchChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Apply filters to refine your search results
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  {hasSearchInput && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Search</label>
                        <Input
                          placeholder="Search..."
                          value={tempSearch}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setTempSearch(event.target.value)
                          }
                        />
                      </div>
                      {filters.length > 0 && <Separator />}
                    </>
                  )}
                  
                  {filters.map((filter, index) => (
                    <React.Fragment key={filter.key}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{filter.label}</label>
                        {filter.type === 'text' && (
                          <Input
                            placeholder={`Enter ${filter.label.toLowerCase()}...`}
                            value={tempFilterValues[filter.formKey] || ''}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              updateTempFilter(filter.formKey, event.target.value)
                            }
                          />
                        )}
                        {filter.type === 'checkbox' && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={filter.key}
                              checked={tempFilterValues[filter.formKey] || false}
                              onCheckedChange={(checked) => {
                                updateTempFilter(filter.formKey, !!checked)
                              }}
                            />
                            <label
                              htmlFor={filter.key}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {filter.label}
                            </label>
                          </div>
                        )}
                        {filter.type === 'select' && filter.options && (
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={tempFilterValues[filter.formKey] || ''}
                            onChange={(event) =>
                              updateTempFilter(filter.formKey, event.target.value)
                            }
                          >
                            <option value="">All</option>
                            {filter.options.map((option) => (
                              <option key={String(option.value)} value={String(option.value)}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      {index < filters.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleClearFilters}
                  >
                    Clear all
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleApplyFilters}
                  >
                    Apply filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {totalRecords !== undefined
            ? `Showing ${pageIndex * pageSize + 1} to ${Math.min(pageIndex * pageSize + pageSize, totalRecords)} of ${totalRecords} entries`
            : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {pageSize} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[5, 10, 20, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={totalRecords !== undefined && pageIndex * pageSize + pageSize >= totalRecords}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
