import { useMemo, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { columns } from "./data/column"
import { DataTableDemo, type FilterConfig } from "@/components/dataTable"
import { useGetUsersGridDataQuery } from "@/services/userApi"
import type { User, GridRequest } from "@/types"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { DEFAULT_GRID_FORM_VALUES } from "@/lib/constants"
import { AddEditSidebar, DeleteConfirmationDialog } from "@/components/shared"
import { UserForm } from "./components/UserForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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

const userFilters: FilterConfig[] = [
  {
    key: "isArchived",
    label: "Show archived",
    type: "checkbox",
    formKey: "isArchived",
  },
]

type UserFormValues = {
  id?: number
  personalNumber: string
  fullName: string
  email: string
  status: boolean
  role: string
  title: string
  department: string
}

export const UsersPage = () => {
    const gridForm = useForm<GridFormValues>({
        defaultValues: DEFAULT_GRID_FORM_VALUES,
    })
    
    const [isAddEditOpen, setIsAddEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const userForm = useForm<UserFormValues>({
        defaultValues: {
            personalNumber: "",
            fullName: "",
            email: "",
            status: true,
            role: "",
            title: "",
            department: "",
        },
    })
    
    const { watch } = gridForm
    const pageIndex = watch("pageIndex")
    const pageSize = watch("pageSize")
    const search = watch("search")
    const sortColumn = watch("sortColumn")
    const sortDirection = watch("sortDirection")
    const conditionMatch = watch("conditionMatch")
    const isArchived = watch("isArchived")
    const filters = watch("filters")
    const scoreFilter = watch("scoreFilter")
    
    const gridRequest: GridRequest = useMemo(() => ({
        start: pageIndex * pageSize,
        length: pageSize,
        search,
        sortColumn,
        sortDirection,
        conditionMatch,
        isArchived,
        filters,
        scoreFilter,
    }), [pageIndex, pageSize, search, sortColumn, sortDirection, conditionMatch, isArchived, filters, scoreFilter])
    
    const { data, isLoading, isError, error } = useGetUsersGridDataQuery(gridRequest, {
        skip: false,
    })
    
    const handleAdd = () => {
        setSelectedUser(null)
        userForm.reset({
            personalNumber: "",
            fullName: "",
            email: "",
            status: true,
            role: "",
            title: "",
            department: "",
        })
        setIsAddEditOpen(true)
    }
    
    const handleEdit = (user: User) => {
        setSelectedUser(user)
        userForm.reset({
            id: user.id,
            personalNumber: user.personalNumber,
            fullName: user.fullName,
            email: user.email,
            status: user.status,
            role: user.role,
            title: user.title,
            department: user.department,
        })
        setIsAddEditOpen(true)
    }
    
    const handleDelete = (user: User) => {
        setSelectedUser(user)
        setIsDeleteOpen(true)
    }
    
    const handleSubmit = async (formData: UserFormValues) => {
        setIsSubmitting(true)
        try {
            // TODO: Implement API call to create/update user
            console.log("Submitting user:", formData)
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setIsAddEditOpen(false)
            // TODO: Refetch data or invalidate cache
        } catch (error) {
            console.error("Error submitting user:", error)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    const handleConfirmDelete = async () => {
        if (!selectedUser) return
        
        setIsSubmitting(true)
        try {
            // TODO: Implement API call to delete user
            console.log("Deleting user:", selectedUser.id)
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setIsDeleteOpen(false)
            setSelectedUser(null)
            // TODO: Refetch data or invalidate cache
        } catch (error) {
            console.error("Error deleting user:", error)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    console.log('Query State:', { data, isLoading, isError, error })
    if (isLoading) return <div>Loading...</div>
    if (isError) {
        const fetchError = error as FetchBaseQueryError
        const errorMessage = 
            'data' in fetchError && 
            typeof fetchError.data === 'object' && 
            fetchError.data !== null && 
            'message' in fetchError.data
                ? String(fetchError.data.message)
                : 'An error occurred'
        return <div>Error: {errorMessage}</div>
    }
    
  return (
    <FormProvider {...gridForm}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        <DataTableDemo<User> 
          columns={columns(handleEdit, handleDelete)} 
          data={data?.displayData || []}
          totalRecords={data?.totalRecords || 0}
          filters={userFilters}
        />
      </div>
      
      <AddEditSidebar
        open={isAddEditOpen}
        onOpenChange={setIsAddEditOpen}
        form={userForm}
        title={selectedUser ? "Edit User" : "Add User"}
        description={selectedUser ? "Update user information" : "Create a new user"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <UserForm />
      </AddEditSidebar>
      
      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        itemName={selectedUser?.fullName}
        isLoading={isSubmitting}
      />
    </FormProvider>
  )
}
