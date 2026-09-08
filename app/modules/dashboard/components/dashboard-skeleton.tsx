import { cn } from "cn"

import { Skeleton } from "~/components/ui/skeleton"

function WidgetSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex min-w-0 flex-col gap-4 rounded-xl border border-border/70 bg-card p-4", className)}>
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-36 w-full" />
        </div>
    )
}

function KpiSkeleton() {
    return (
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border/70 bg-card p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-28" />
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6" aria-busy="true" aria-label="Memuat dashboard">
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
                <WidgetSkeleton className="lg:col-span-2 xl:col-span-6" />
                <WidgetSkeleton className="xl:col-span-3" />
                <WidgetSkeleton className="xl:col-span-3" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
                <WidgetSkeleton className="lg:col-span-2 xl:col-span-5" />
                <WidgetSkeleton className="xl:col-span-4" />
                <WidgetSkeleton className="xl:col-span-3" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <WidgetSkeleton />
                <WidgetSkeleton />
            </div>
        </div>
    )
}
