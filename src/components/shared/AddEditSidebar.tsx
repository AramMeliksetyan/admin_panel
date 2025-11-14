import * as React from "react"
import {  FormProvider, type UseFormReturn, type FieldValues } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type AddEditSidebarProps<TFieldValues extends FieldValues = FieldValues> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<TFieldValues>
  title: string
  description?: string
  onSubmit: (data: TFieldValues) => void | Promise<void>
  isLoading?: boolean
  children: React.ReactNode
  submitLabel?: string
  cancelLabel?: string
}

export function AddEditSidebar<TFieldValues extends FieldValues = FieldValues>({
  open,
  onOpenChange,
  form,
  title,
  description,
  onSubmit,
  isLoading = false,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: AddEditSidebarProps<TFieldValues>) {
  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>

            <div className="flex-1 py-6 space-y-4">
              {children}
            </div>

            <SheetFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitLabel}
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

