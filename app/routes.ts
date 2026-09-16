import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
    index("modules/auth/routes/index-redirect.tsx"),
    layout("modules/auth/routes/auth-layout.tsx", [
        route("login", "modules/auth/routes/login-route.tsx"),
        route("forgot-password", "modules/auth/routes/forgot-password-route.tsx"),
        route("reset-password", "modules/auth/routes/reset-password-route.tsx"),
    ]),
    route("dashboard", "modules/dashboard/routes/dashboard-layout.tsx", [index("modules/dashboard/routes/index.tsx")]),
    route("merchant-approvals", "modules/merchant-approval/routes/merchant-approval-layout.tsx", [
        index("modules/merchant-approval/routes/index.tsx"),
        route("queue", "modules/merchant-approval/routes/merchant-approval-queue-route.tsx"),
        route(":approvalId", "modules/merchant-approval/routes/merchant-approval-detail-route.tsx"),
    ]),
] satisfies RouteConfig
