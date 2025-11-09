import { PostsPreview } from '@/components/posts/PostsPreview'

export function PostsPage() {
  return (
    <>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">Posts feed demo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          RTK Query handles fetching, caching, and invalidation so your UI stays responsive. Swap this
          endpoint for your own API client to bring in live data.
        </p>
      </div>
      <PostsPreview />
    </>
  )
}

