import { Skeleton } from "~/components/ui/skeleton"

export function QueueLoadingState() {
    return (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Memuat antrean">
            <div className="hidden overflow-hidden rounded-xl border border-border lg:block">
                <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="ml-auto h-3 w-24" />
                </div>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
                    >
                        <Skeleton className="size-9 shrink-0 rounded-lg" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <Skeleton className="h-3.5 w-44" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <Skeleton className="hidden h-3 w-24 xl:block" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="hidden h-3 w-24 xl:block" />
                        <Skeleton className="h-8 w-28 rounded-lg" />
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-44 w-full rounded-xl" />
                ))}
            </div>
        </div>
    )
}
