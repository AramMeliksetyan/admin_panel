export function SettingsProfilePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Profile</h2>
      <p className="text-sm text-muted-foreground">
        Store personal or organization details here. In a real app, connect this form to your API and
        wire it up with RTK Query mutations.
      </p>
      <form className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Name</span>
          <input
            className="h-10 rounded-md border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Ada Lovelace"
            type="text"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            className="h-10 rounded-md border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="ada@example.com"
            type="email"
          />
        </label>
      </form>
    </div>
  )
}

