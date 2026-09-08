import { CalendarDays, ChevronDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { formatNumber } from "~/lib/format"

import type { OrderStatPoint } from "../services/dashboard.types"
import { SectionCard } from "./section-card"

const chartConfig = {
    orders: { label: "Pesanan", color: "var(--primary)" },
} satisfies ChartConfig

export function OrderStatisticsCard({ data }: { data: OrderStatPoint[] }) {
    const hasData = data.length > 0

    return (
        <SectionCard
            title="Statistik Pesanan"
            action={
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    7 Hari Terakhir
                    <ChevronDown aria-hidden="true" className="size-3.5" />
                </span>
            }
        >
            {hasData ? (
                <div role="img" aria-label="Grafik batang jumlah pesanan 7 hari terakhir">
                    <ChartContainer config={chartConfig} className="h-56 w-full">
                        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fontSize: 11 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={34}
                                tick={{ fontSize: 11 }}
                                tickFormatter={(value: number) => formatNumber(Number(value))}
                            />
                            <ChartTooltip
                                cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                                content={<ChartTooltipContent formatter={(value) => formatNumber(Number(value))} />}
                            />
                            <Bar
                                dataKey="orders"
                                name="Pesanan"
                                fill="var(--color-orders)"
                                radius={[6, 6, 2, 2]}
                                maxBarSize={28}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            ) : (
                <Empty className="border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada statistik</EmptyTitle>
                        <EmptyDescription>Statistik pesanan akan tampil di sini.</EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
