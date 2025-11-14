import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type SortIndicatorProps = {
  sorted: false | "asc" | "desc"
}

export function SortIndicator({ sorted }: SortIndicatorProps) {
  if (sorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4" />
  }
  if (sorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4" />
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
}

