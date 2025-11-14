import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Autocomplete } from "@/components/shared"
import { Label } from "@/components/ui/label"

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "test", label: "Test" },
]

export function UserForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="personalNumber">Personal Number</Label>
        <Input
          name="personalNumber"
          id="personalNumber"
          placeholder="Enter personal number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          name="fullName"
          id="fullName"
          placeholder="Enter full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          id="email"
          type="email"
          placeholder="Enter email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Autocomplete
          name="role"
          options={roleOptions}
          placeholder="Select role..."
          searchPlaceholder="Search roles..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          name="title"
          id="title"
          placeholder="Enter title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          name="department"
          id="department"
          placeholder="Enter department"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox name="status" id="status" />
        <Label
          htmlFor="status"
          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Active
        </Label>
      </div>
    </div>
  )
}

