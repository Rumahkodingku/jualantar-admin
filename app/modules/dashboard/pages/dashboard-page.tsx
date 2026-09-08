import { useDashboardOverview } from "../services/dashboard.queries"
import type { DashboardOverview } from "../services/dashboard.types"
import { DashboardError } from "../components/dashboard-error"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSkeleton } from "../components/dashboard-skeleton"
import { LocalImpactCard } from "../components/local-impact-card"
import { OnlineCouriersCard } from "../components/online-couriers-card"
import { OrderStatisticsCard } from "../components/order-statistics-card"
import { OrderStatusCard } from "../components/order-status-card"
import { RecentActivityCard } from "../components/recent-activity-card"
import { RecentOrdersCard } from "../components/recent-orders-card"
import { RevenueCard } from "../components/revenue-card"
import { StatCard } from "../components/stat-card"
import { TopMerchantsCard } from "../components/top-merchants-card"

function DashboardSections({ data }: { data: DashboardOverview }) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <section
                aria-label="Ringkasan KPI"
                className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4"
            >
                {data.kpis.map((metric) => (
                    <StatCard key={metric.id} metric={metric} />
                ))}
            </section>

            <section
                aria-label="Pendapatan dan status pesanan"
                className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2"
            >
                <RevenueCard revenue={data.revenue} />
                <OrderStatusCard summary={data.orderStatus} />
                {/* <LocalImpactCard /> */}
            </section>

            <section
                aria-label="Pesanan, aktivitas, dan kurir"
                className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
            >
                <RecentOrdersCard orders={data.recentOrders} />
                <RecentActivityCard activities={data.recentActivities} />
                <OnlineCouriersCard couriers={data.couriers} />
            </section>

            <section aria-label="Statistik dan top merchant" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <OrderStatisticsCard data={data.orderStatistics} />
                <TopMerchantsCard merchants={data.topMerchants} />
            </section>
        </div>
    )
}

export function DashboardPage() {
    const { data, isLoading, isError, refetch } = useDashboardOverview()

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <DashboardHeader />

            {isLoading ? (
                <DashboardSkeleton />
            ) : isError ? (
                <DashboardError onRetry={() => refetch()} />
            ) : data ? (
                <DashboardSections data={data} />
            ) : null}
        </div>
    )
}
