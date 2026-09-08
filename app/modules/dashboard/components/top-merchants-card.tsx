import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { Text } from "~/components/ui/text"
import { formatNumber } from "~/lib/format"

import type { TopMerchant } from "../services/dashboard.types"
import { SectionCard } from "./section-card"

export function TopMerchantsCard({ merchants }: { merchants: TopMerchant[] }) {
    const hasData = merchants.length > 0
    const max = Math.max(0, ...merchants.map((m) => m.totalOrders))

    return (
        <SectionCard
            title="Top Merchant"
            action={
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    render={<Link to="/merchants" />}
                    className="px-0 text-primary"
                >
                    Lihat semua
                </Button>
            }
        >
            {hasData ? (
                <ul className="divide-y divide-border/70">
                    {merchants.map((merchant) => (
                        <li key={merchant.rank} className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-1">
                            <Text
                                variant="xs"
                                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-muted-foreground tabular-nums"
                            >
                                {merchant.rank}
                            </Text>
                            <span className="min-w-0 flex-1">
                                <Text variant="sm" className="block truncate font-medium text-foreground">
                                    {merchant.name}
                                </Text>
                                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-muted">
                                    <span
                                        className="block h-full rounded-full bg-primary/70"
                                        style={{ width: `${max > 0 ? (merchant.totalOrders / max) * 100 : 0}%` }}
                                    />
                                </span>
                            </span>
                            <Text variant="sm" className="shrink-0 font-semibold text-foreground tabular-nums">
                                {formatNumber(merchant.totalOrders)}
                            </Text>
                        </li>
                    ))}
                </ul>
            ) : (
                <Empty className="border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada merchant</EmptyTitle>
                        <EmptyDescription>Merchant terbaik akan tampil di sini.</EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
