import { useGetPostsQuery } from '@/services/jsonPlaceholderApi'
import { Button } from '@/components/ui/button'

export function PostsPreview() {
  const { data, isLoading, isError, refetch } = useGetPostsQuery()

  return (
    <section className="mt-16 w-full max-w-3xl rounded-xl border border-border bg-card/60 p-6 text-left shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sample RTK Query feed</h2>
          <p className="text-sm text-muted-foreground">
            These posts are fetched from JSONPlaceholder using RTK Query.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading posts…</p>}
        {isError && (
          <p className="text-sm text-destructive">
            We couldn&apos;t load the posts right now. Try refreshing.
          </p>
        )}
        {!isLoading && !isError && (
          <ul className="space-y-3">
            {data?.slice(0, 5).map((post) => (
              <li key={post.id} className="rounded-lg border border-border bg-card px-4 py-3">
                <h3 className="text-base font-medium text-foreground">{post.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

