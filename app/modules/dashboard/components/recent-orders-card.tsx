import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "~/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Text } from "~/components/ui/text"
import { formatIDR } from "~/lib/format"

import type { RecentOrder } from "../services/dashboard.types"
import { OrderStatusBadge } from "./order-status-badge"
import { SectionCard } from "./section-card"

export function RecentOrdersCard({ orders }: { orders: RecentOrder[] }) {
    const hasData = orders.length > 0

    return (
        <SectionCard
            title="Pesanan Terbaru"
            action={
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    render={<Link to="/orders" />}
                    className="px-0 text-primary"
                >
                    Lihat semua
                </Button>
            }
        >
            {hasData ? (
                <>
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-16">#</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Waktu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Text variant="sm" className="font-medium text-foreground tabular-nums">
                                                {order.id}
                                            </Text>
                                        </TableCell>
                                        <TableCell>
                                            <Text variant="sm" className="font-medium text-foreground">
                                                {order.customer}
                                            </Text>
                                        </TableCell>
                                        <TableCell>
                                            <Text
                                                variant="sm"
                                                className="block max-w-[11rem] truncate text-muted-foreground"
                                            >
                                                {order.merchant}
                                            </Text>
                                        </TableCell>
                                        <TableCell>
                                            <Text
                                                variant="sm"
                                                className="text-right font-medium text-foreground tabular-nums"
                                            >
                                                {formatIDR(order.amount)}
                                            </Text>
                                        </TableCell>
                                        <TableCell>
                                            <OrderStatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell>
                                            <Text
                                                variant="sm"
                                                className="text-right whitespace-nowrap text-muted-foreground"
                                            >
                                                {order.time}
                                            </Text>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <ul className="divide-y divide-border/70 rounded-xl border border-border/70 sm:hidden">
                        {orders.map((order) => (
                            <li key={order.id} className="flex flex-col gap-2 p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <Text variant="sm" className="font-medium text-foreground tabular-nums">
                                        {order.id}
                                    </Text>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <div className="flex items-end justify-between gap-3">
                                    <div className="min-w-0">
                                        <Text variant="sm" className="truncate font-medium text-foreground">
                                            {order.customer}
                                        </Text>
                                        <Text variant="xs" className="truncate text-muted-foreground">
                                            {order.merchant}
                                        </Text>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <Text variant="sm" className="font-semibold text-foreground tabular-nums">
                                            {formatIDR(order.amount)}
                                        </Text>
                                        <Text variant="xs" className="text-muted-foreground">
                                            {order.time}
                                        </Text>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <Empty className="border-dashed py-10">
                    <EmptyContent>
                        <EmptyTitle>Belum ada pesanan</EmptyTitle>
                        <EmptyDescription>Pesanan terbaru akan tampil di sini.</EmptyDescription>
                    </EmptyContent>
                </Empty>
            )}
        </SectionCard>
    )
}
