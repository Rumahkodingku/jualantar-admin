import { useQuery } from "@tanstack/react-query"

import { dashboardKeys } from "./dashboard.keys"
import { getDashboardOverview } from "./dashboard.mock"
import type { DashboardOverview } from "./dashboard.types"

export function useDashboardOverview() {
    return useQuery<DashboardOverview>({
        queryKey: dashboardKeys.overview(),
        queryFn: getDashboardOverview,
        retry: 1,
        staleTime: 60_000,
    })
}
