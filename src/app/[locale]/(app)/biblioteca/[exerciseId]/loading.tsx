import { Skeleton } from "@/components/ui/skeleton"

export default function ExerciseDetailLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="size-60 rounded-xl" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div>
        <Skeleton className="h-6 w-40" />
        <div className="mt-2 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  )
}
