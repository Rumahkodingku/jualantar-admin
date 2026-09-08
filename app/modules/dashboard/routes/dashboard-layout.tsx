import { Outlet } from "react-router"
import { Layout } from "~/components/layouts/layout"

export default function DashboardLayoutRoute() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}
