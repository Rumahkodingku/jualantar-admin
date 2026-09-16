import { useQuery } from "@tanstack/react-query"

import type { AuthUser } from "../types/auth.types"
import { authService } from "./auth.api"
import { authQueryKeys } from "./auth.keys"

const SESSION_STALE_TIME_MS = 5 * 60_000

export function useAuthSession() {
    return useQuery<AuthUser>({
        queryKey: authQueryKeys.session(),
        queryFn: () => authService.me(),
        retry: false,
        staleTime: SESSION_STALE_TIME_MS,
    })
}
