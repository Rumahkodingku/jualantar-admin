import { Cell, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { Text } from "~/components/ui/text"
import { formatNumber } from "~/lib/format"

import type { OrderStatusKey, OrderStatusSummary } from "../services/dashboard.types"
import { SectionCard } from "./section-card"

const statusColors: Record<OrderStatusKey, string> = {
    selesai: "#10b981",
    diproses: "#0ea5e9",
    menunggu: "#f59e0b",
    dibatalkan: "#a1a1aa",
}

const statusLabels: Record<OrderStatusKey, string> = {
    selesai: "Selesai",
    diproses: "Diproses",
    menunggu: "Menunggu",
    dibatalkan: "Dibatalkan",
}

const chartConfig = {
    selesai: { label: "Selesai", color: statusColors.selesai },
    diproses: { label: "Diproses", color: statusColors.diproses },
    menunggu: { label: "Menunggu", color: statusColors.menunggu },
    dibatalkan: { label: "Dibatalkan", color: statusColors.dibatalkan },
} satisfies ChartConfig

export function OrderStatusCard({ summary }: { summary: OrderStatusSummary }) {
    const hasData = summary.slices.length > 0
    const data = summary.slices.map((slice) => ({
        ...slice,
        pct: summary.total > 0 ? Math.round((slice.count / summary.total) * 100) : 0,
    }))

    return (
        <SectionCard title="Status Pesanan">
            {hasData ? (
                <div className="flex flex-col items-center gap-5">
                    <div className="relative w-full max-w-[220px]">
                        <ChartContainer config={chartConfig} className="aspect-square w-full">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="count"
                                    nameKey="key"
                                    innerRadius="70%"
                                    outerRadius="88%"
                                    paddingAngle={2}
                                    cornerRadius={6}
                                    startAngle={90}
                                    endAngle={-270}
                                    strokeWidth={0}
                                >
                                    {data.map((entry) => (
                                        <Cell key={entry.key} fill={statusColors[entry.key]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            </PieChart>
                        </ChartContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <Text as="span" variant="2xl" className="font-bold text-foreground tabular-nums">
                                {formatNumber(summary.total)}
                            </Text>
                            <Text variant="xs" className="text-muted-foreground">
                                Total
                            </Text>
                        </div>
                    </div>

                    <ul className="grid w-full gap-2">
                        {data.map((entry) => (
                            <li key={entry.key} className="flex items-center gap-2.5">
                                <span
                                    aria-hidden="true"
                                    className="size-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: statusColors[entry.key] }}
                                />
                                <Text variant="sm" className="text-muted-foreground">
                                    {statusLabels[entry.key]}
                                </Text>
                                <Text variant="sm" className="ms-auto font-medium text-foreground tabular-nums">
                                    {formatNumber(entry.count)}
                                </Text>
                                <Text variant="sm" className="w-10 text-right text-muted-foreground tabular-nums">
                                    {entry.pct}%
                                </Text>
                            </li>
                        ))}
                    </ul>

                    <Text as="p" variant="xs" className="sr-only">
                        Total {formatNumber(summary.total)} pesanan.{" "}
                        {data
                            .map((d) => `${statusLabels[d.key]} ${formatNumber(d.count)} (${d.pct} persen)`)
                            .join(". ")}
                        .
                    </Text>
                </div>
            ) : (
                <Empty className="border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada pesanan</EmptyTitle>
                        <EmptyDescription>Statistik status pesanan akan muncul di sini.</EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
