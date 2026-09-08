import type { LucideIcon } from "lucide-react"
import { Bike, CheckCircle2, CircleDollarSign, ClipboardList, Store } from "lucide-react"
import { Link } from "react-router"
import { cn } from "cn"

import { Button } from "~/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { Text } from "~/components/ui/text"

import type { ActivityItem, ActivityKind } from "../services/dashboard.types"
import { SectionCard } from "./section-card"

const activityMeta: Record<ActivityKind, { icon: LucideIcon; className: string }> = {
    order: { icon: ClipboardList, className: "bg-primary/10 text-primary" },
    courier: { icon: Bike, className: "bg-sky-500/10 text-sky-600" },
    merchant: { icon: Store, className: "bg-emerald-500/10 text-emerald-600" },
    payment: { icon: CircleDollarSign, className: "bg-amber-500/10 text-amber-600" },
    done: { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-600" },
}

export function RecentActivityCard({ activities }: { activities: ActivityItem[] }) {
    const hasData = activities.length > 0

    return (
        <SectionCard
            title="Aktivitas Terbaru"
            action={
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    render={<Link to="/settings/activity-log" />}
                    className="px-0 text-primary"
                >
                    Lihat semua
                </Button>
            }
        >
            {hasData ? (
                <ul className="divide-y divide-border/70">
                    {activities.map((activity) => {
                        const meta = activityMeta[activity.kind]
                        const Icon = meta.icon
                        return (
                            <li key={activity.id} className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-1">
                                <span
                                    className={cn(
                                        "flex size-8 shrink-0 items-center justify-center rounded-lg [&>svg]:size-4",
                                        meta.className
                                    )}
                                >
                                    <Icon aria-hidden="true" />
                                </span>
                                <Text variant="sm" className="min-w-0 flex-1 truncate text-foreground">
                                    {activity.title}
                                </Text>
                                <Text
                                    as="time"
                                    variant="xs"
                                    className="shrink-0 whitespace-nowrap text-muted-foreground"
                                >
                                    {activity.time}
                                </Text>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <Empty className="border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada aktivitas</EmptyTitle>
                        <EmptyDescription>Aktivitas terbaru akan tampil di sini.</EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
