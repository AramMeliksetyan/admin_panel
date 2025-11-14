import * as React from "react"
import { Controller, useFormContext, type ControllerProps, type FieldValues, type Path } from "react-hook-form"

import { cn } from "@/lib/utils"

type NativeInputProps = React.ComponentProps<"input">

// Form-based Input props (requires name and form context)
type FormInputProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>
} & Omit<NativeInputProps, "name" | "defaultValue" | "value" | "onChange" | "ref"> &
  Pick<ControllerProps<TFieldValues>, "rules" | "shouldUnregister" | "defaultValue">

// Regular controlled/uncontrolled Input props (no form context needed)
type RegularInputProps = Omit<NativeInputProps, "ref">

export type InputProps<TFieldValues extends FieldValues = FieldValues> = 
  | (FormInputProps<TFieldValues> & { name: Path<TFieldValues> })
  | (RegularInputProps & { name?: never })

// Wrapper component that handles form context
function FormInputWrapper<TFieldValues extends FieldValues = FieldValues>(
  props: FormInputProps<TFieldValues> & { ref: React.ForwardedRef<HTMLInputElement> }
) {
  const { name, rules, shouldUnregister, defaultValue, className, type, ref, ...rest } = props
  const { control } = useFormContext<TFieldValues>()
  
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({ field }) => (
        <input
          {...field}
          {...rest}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
        />
      )}
    />
  )
}

// Regular input component
const RegularInput = React.forwardRef<HTMLInputElement, RegularInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
RegularInput.displayName = "RegularInput"

function InputComponent<TFieldValues extends FieldValues = FieldValues>(
  props: InputProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  // Check if we have a name prop (form mode)
  if ("name" in props && props.name) {
    // Try to use form context - if it fails, the error will be thrown
    // This is expected behavior when using Input with name outside FormProvider
    return <FormInputWrapper {...(props as FormInputProps<TFieldValues>)} ref={ref} />
  }

  // Regular input mode
  return <RegularInput {...(props as RegularInputProps)} ref={ref} />
}

const Input = React.forwardRef(InputComponent) as <
  TFieldValues extends FieldValues = FieldValues
>(
  props: InputProps<TFieldValues> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => React.ReactElement

export { Input }
