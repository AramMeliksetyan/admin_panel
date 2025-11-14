const API_URL = import.meta.env.VITE_API_URL

const bearer_token = "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbkBzYXRpc2ZhaS5jeCIsInVuaXF1ZV9uYW1lIjoiMSIsInJvbGUiOiJTdXBlckFkbWluIiwibmJmIjoxNzYyOTY1OTYwLCJleHAiOjE3OTQ1MDE5NjAsImlhdCI6MTc2Mjk2NTk2MH0.IqXLmOxW8T-DCsh8m-NngLCENZ8v6rnalj2exSJUUJgA2k4fB2cz2WJEI9uoKQ6kahCHNTtTOC4QveqXJSU1yg"

export const DEFAULT_GRID_FORM_VALUES = {
  pageIndex: 0,
  pageSize: 20,
  search: "",
  sortColumn: "",
  sortDirection: "" as 'asc' | 'desc' | '',
  conditionMatch: 1,
  isArchived: false,
  filters: [] as unknown[],
  scoreFilter: [] as unknown[],
}

export { API_URL, bearer_token }