import { Link } from "react-router"
import { cn } from "cn"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { Text } from "~/components/ui/text"

import type { CourierItem } from "../services/dashboard.types"
import { SectionCard } from "./section-card"

function initials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

export function OnlineCouriersCard({ couriers }: { couriers: CourierItem[] }) {
    const hasData = couriers.length > 0
    const onlineCount = couriers.filter((c) => c.online).length

    return (
        <SectionCard
            title="Kurir Online"
            description={hasData ? `${onlineCount} kurir aktif` : undefined}
            action={
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    render={<Link to="/couriers" />}
                    className="px-0 text-primary"
                >
                    Lihat semua
                </Button>
            }
        >
            {hasData ? (
                <ul className="divide-y divide-border/70">
                    {couriers.map((courier) => (
                        <li key={courier.id} className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-1">
                            <span className="relative shrink-0">
                                <Avatar className="size-9">
                                    <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                                        {initials(courier.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-background",
                                        courier.online ? "bg-emerald-500" : "bg-zinc-400"
                                    )}
                                />
                            </span>
                            <span className="min-w-0 flex-1">
                                <Text variant="sm" className="block truncate font-medium text-foreground">
                                    {courier.name}
                                </Text>
                                <Text variant="xs" className="block truncate text-muted-foreground">
                                    {courier.activity}
                                </Text>
                            </span>
                            <Text
                                variant="xs"
                                className={cn(
                                    "shrink-0 font-medium",
                                    courier.online ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                )}
                            >
                                {courier.online ? "Online" : "Offline"}
                            </Text>
                        </li>
                    ))}
                </ul>
            ) : (
                <Empty className="border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada kurir online</EmptyTitle>
                        <EmptyDescription>Status kurir akan tampil di sini.</EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
