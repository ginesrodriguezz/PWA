import { Skeleton } from "@/components/ui/skeleton"

export default function ExerciseProgressLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-4 w-24" />
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-5 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  )
}
