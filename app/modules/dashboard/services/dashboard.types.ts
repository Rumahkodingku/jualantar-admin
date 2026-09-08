export type TrendDirection = "up" | "down"

export type OrderStatusKey = "selesai" | "diproses" | "dibatalkan" | "menunggu"

export type ActivityKind = "order" | "courier" | "merchant" | "payment" | "done"

export interface KpiMetric {
    id: "orders" | "merchants" | "couriers" | "customers"
    label: string
    value: number
    changePercent: number
    trend: TrendDirection
    helperText: string
}

export interface RevenuePoint {
    label: string
    value: number
}

export interface RevenueSummary {
    total: number
    changePercent: number
    points: RevenuePoint[]
}

export interface OrderStatusSlice {
    key: OrderStatusKey
    count: number
}

export interface OrderStatusSummary {
    total: number
    slices: OrderStatusSlice[]
}

export interface RecentOrder {
    id: string
    customer: string
    merchant: string
    amount: number
    status: OrderStatusKey
    time: string
}

export interface ActivityItem {
    id: string
    kind: ActivityKind
    title: string
    time: string
}

export interface CourierItem {
    id: string
    name: string
    activity: string
    online: boolean
}

export interface OrderStatPoint {
    label: string
    orders: number
}

export interface TopMerchant {
    rank: number
    name: string
    totalOrders: number
}

export interface DashboardOverview {
    kpis: KpiMetric[]
    revenue: RevenueSummary
    orderStatus: OrderStatusSummary
    recentOrders: RecentOrder[]
    recentActivities: ActivityItem[]
    couriers: CourierItem[]
    orderStatistics: OrderStatPoint[]
    topMerchants: TopMerchant[]
}
