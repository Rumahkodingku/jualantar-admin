import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
    index("modules/auth/routes/index-redirect.tsx"),
    layout("modules/auth/routes/auth-layout.tsx", [
        route("login", "modules/auth/routes/login-route.tsx"),
        route("forgot-password", "modules/auth/routes/forgot-password-route.tsx"),
        route("reset-password", "modules/auth/routes/reset-password-route.tsx"),
    ]),
    route("dashboard", "modules/dashboard/routes/index.tsx"),
] satisfies RouteConfig
