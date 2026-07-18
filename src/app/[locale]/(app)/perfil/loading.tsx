import { Skeleton } from "@/components/ui/skeleton"

export default function PerfilLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-7 w-32" />
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-9 w-32 rounded-full" />
    </div>
  )
}
