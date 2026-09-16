import { Outlet } from "react-router"

import { Layout } from "~/components/layouts/layout"
import { RequireAuth } from "~/modules/auth"

export default function MerchantApprovalLayoutRoute() {
    return (
        <Layout>
            <RequireAuth permission="merchant.approval.view">
                <Outlet />
            </RequireAuth>
        </Layout>
    )
}
