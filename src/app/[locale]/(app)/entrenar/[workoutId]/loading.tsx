import { Skeleton } from "@/components/ui/skeleton"

export default function EntrenarSessionLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  )
}
