import type { LucideIcon } from "lucide-react"
import { Bike, ShoppingCart, Store, TrendingDown, TrendingUp, Users } from "lucide-react"
import { cn } from "cn"

import { Card } from "~/components/ui/card"
import { Text } from "~/components/ui/text"
import { formatNumber } from "~/lib/format"

import type { KpiMetric } from "../services/dashboard.types"

const kpiIcons: Record<KpiMetric["id"], LucideIcon> = {
    orders: ShoppingCart,
    merchants: Store,
    couriers: Bike,
    customers: Users,
}

export function StatCard({ metric }: { metric: KpiMetric }) {
    const Icon = kpiIcons[metric.id]
    const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
    const isUp = metric.trend === "up"

    return (
        <Card className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Text variant="sm" className="truncate text-muted-foreground">
                        {metric.label}
                    </Text>
                    <Text
                        as="p"
                        variant="2xl"
                        className="mt-1.5 font-semibold tracking-tight text-foreground tabular-nums"
                    >
                        {formatNumber(metric.value)}
                    </Text>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:size-[18px]">
                    <Icon aria-hidden="true" />
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span
                    className={cn(
                        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                        isUp
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                    )}
                >
                    <TrendIcon aria-hidden="true" className="size-3" />
                    {metric.changePercent}%
                </span>
                <Text variant="xs" className="text-muted-foreground">
                    <span className="sr-only">
                        {isUp ? "naik" : "turun"} {metric.changePercent} persen,{" "}
                    </span>
                    {metric.helperText}
                </Text>
            </div>
        </Card>
    )
}
