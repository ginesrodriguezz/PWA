import { Skeleton } from "@/components/ui/skeleton"

export function ListLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-7 w-40" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
