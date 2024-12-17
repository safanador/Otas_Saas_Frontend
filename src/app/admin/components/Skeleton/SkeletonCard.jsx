import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <main className="space-y-2">
        <div className="flex flex-col sm:flex-row space-x-3">
        <Skeleton className="h-[180px] w-[260px] rounded-xl" />
        <Skeleton className="h-[180px] w-[260px] rounded-xl" />
        <Skeleton className="h-[180px] w-[260px] rounded-xl" />
        <Skeleton className="h-[180px] w-[260px] rounded-xl" />
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Skeleton className="h-[360px] w-[530px]" />
            <Skeleton className="h-[360px] w-[530px]" />
        </div>
    </main>
  )
}
