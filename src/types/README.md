# Types Usage Guide

## Generic Paginated Response

The `PaginatedResponse<T>` type is a generic type that can handle any paginated API response.

### Example Usage

```typescript
import type { PaginatedResponse, User } from "@/types"

// For User data
const userResponse: PaginatedResponse<User> = {
  totalRecords: 1254,
  totalDisplayRecords: 5,
  displayData: [
    {
      id: 753,
      personalNumber: "1737",
      fullName: "Զորայր Սիմոնյան",
      email: "zorayr.simonyan@acba.am",
      status: true,
      role: "test",
      title: "ՓՄՁ և կորպորատիվ բիզնեսի խորհրդատու ",
      department: "22032 Կառավարիչ"
    }
  ],
  allIds: [1, 2, 3, ...]
}

// For Payment data
import type { Payment } from "@/types"
const paymentResponse: PaginatedResponse<Payment> = {
  totalRecords: 100,
  totalDisplayRecords: 10,
  displayData: [...],
  allIds: [...]
}

// For any other type
type Product = { id: number; name: string; price: number }
const productResponse: PaginatedResponse<Product> = {
  totalRecords: 50,
  totalDisplayRecords: 10,
  displayData: [...],
  allIds: [...]
}
```

## Using with DataTable

```typescript
import { DataTableDemo } from "@/components/dataTable"
import type { User } from "@/types"
import { columns } from "./columns"

// The DataTable is now fully generic
<DataTableDemo<User>
  columns={columns}
  data={response.displayData}
/>
```

