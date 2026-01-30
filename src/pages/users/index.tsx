import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { columns } from "@/entities/user/config/columns";
import {
  DataTableDemo,
  type FilterConfig,
} from "@/shared/components/dataTable";
import type { GridFormValues } from "@/shared/components/dataTable/types";
import { useGetUsersGridDataQuery } from "@/entities/user/api/userApi";
import type { User } from "@/entities/user/model/types";
import { PERMISSIONS } from "@/shared/types";
import { getFetchErrorMessage } from "@/shared/api/api-helpers";
import { DEFAULT_GRID_FORM_VALUES } from "@/shared/lib/constants";
import { AddEditSidebar, DeleteConfirmationDialog } from "@/shared/components";
import { UserForm } from "@/features/users/ui/UserForm";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { usePermissions } from "@/shared/hooks/use-permissions";
import { useGridRequest } from "@/shared/hooks";

const userFilters: FilterConfig[] = [
  {
    key: "isArchived",
    label: "Show archived",
    type: "checkbox",
    formKey: "isArchived",
  },
];

type UserFormValues = {
  id?: number;
  personalNumber: string;
  fullName: string;
  email: string;
  status: boolean;
  role: string;
  title: string;
  department: string;
};

export const UsersPage = () => {
  const { permissions, hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.USERS_CREATE);

  const gridForm = useForm<GridFormValues>({
    defaultValues: DEFAULT_GRID_FORM_VALUES,
  });

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  });

  const gridRequest = useGridRequest(gridForm);

  const { data, isLoading, isFetching, isError, error } =
    useGetUsersGridDataQuery(gridRequest, {
      skip: false,
    });

  const handleAdd = () => {
    setSelectedUser(null);
    userForm.reset({
      personalNumber: "",
      fullName: "",
      email: "",
      status: true,
      role: "",
      title: "",
      department: "",
    });
    setIsAddEditOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    userForm.reset({
      id: user.id,
      personalNumber: user.personalNumber,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
      title: user.title,
      department: user.department,
    });
    setIsAddEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (formData: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create/update user
      console.log("Submitting user:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAddEditOpen(false);
      // TODO: Refetch data or invalidate cache
    } catch (error) {
      console.error("Error submitting user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to delete user
      console.log("Deleting user:", selectedUser.id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDeleteOpen(false);
      setSelectedUser(null);
      // TODO: Refetch data or invalidate cache
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage = isError ? getFetchErrorMessage(error) : undefined;

  return (
    <FormProvider {...gridForm}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
          {canCreate && (
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
        <DataTableDemo<User>
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            userPermissions: permissions,
          })}
          data={data?.displayData || []}
          totalRecords={data?.totalRecords || 0}
          filters={userFilters}
          isLoading={isLoading || isFetching}
          isError={isError}
          errorMessage={errorMessage}
        />
      </div>

      <AddEditSidebar
        open={isAddEditOpen}
        onOpenChange={setIsAddEditOpen}
        form={userForm}
        title={selectedUser ? "Edit User" : "Add User"}
        description={
          selectedUser ? "Update user information" : "Create a new user"
        }
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
  );
};
