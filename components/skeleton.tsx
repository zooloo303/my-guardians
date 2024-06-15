import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonGuy() {
  return (
    <div className="relative max-w-lg p-2">
      <div className="relative h-32 rounded-md overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-end p-4 rounded-md">
          <div className="relative z-10 text-right space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-row gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  );
}
