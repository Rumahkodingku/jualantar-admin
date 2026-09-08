import { CalendarDays, ChevronDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { Text } from "~/components/ui/text"
import { formatIDR } from "~/lib/format"

import type { RevenueSummary } from "../services/dashboard.types"
import { SectionCard } from "./section-card"

const chartConfig = {
    pendapatan: { label: "Pendapatan", color: "var(--primary)" },
} satisfies ChartConfig

function toJt(value: number): string {
    return `${(value / 1_000_000).toLocaleString("id-ID")}jt`
}

export function RevenueCard({ revenue }: { revenue: RevenueSummary }) {
    const hasData = revenue.points.length > 0

    return (
        <SectionCard
            title="Pendapatan"
            action={
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    7 Hari Terakhir
                    <ChevronDown aria-hidden="true" className="size-3.5" />
                </span>
            }
        >
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="min-w-0">
                    <Text variant="sm" className="flex items-center gap-1.5 font-medium text-emerald-600">
                        <TrendingUp aria-hidden="true" className="size-4" />
                        {revenue.changePercent}% dari minggu lalu
                    </Text>
                    <Text as="p" variant="3xl" className="mt-1.5 font-bold tracking-tight text-foreground tabular-nums">
                        {formatIDR(revenue.total)}
                    </Text>
                </div>
            </div>

            {hasData ? (
                <div
                    role="img"
                    aria-label={`Grafik pendapatan 7 hari terakhir, total ${formatIDR(revenue.total)}, naik ${revenue.changePercent}% dari minggu lalu`}
                >
                    <ChartContainer config={chartConfig} className="mt-4 h-60 w-full">
                        <AreaChart data={revenue.points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillPendapatan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-pendapatan)" stopOpacity={0.32} />
                                    <stop offset="95%" stopColor="var(--color-pendapatan)" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={46}
                                tickFormatter={(value: number) => toJt(Number(value))}
                                tick={{ fontSize: 11 }}
                            />
                            <ChartTooltip
                                cursor={{ stroke: "var(--border)" }}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        formatter={(value) => formatIDR(Number(value))}
                                    />
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                name="Pendapatan"
                                stroke="var(--color-pendapatan)"
                                strokeWidth={2.5}
                                fill="url(#fillPendapatan)"
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            ) : (
                <Empty className="mt-4 border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada data pendapatan</EmptyTitle>
                        <EmptyDescription>
                            Ringkasan pendapatan akan muncul di sini ketika sudah tersedia.
                        </EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
