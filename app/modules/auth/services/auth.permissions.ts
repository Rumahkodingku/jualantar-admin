import type { AuthUser } from "../types/auth.types"
import { useAuthSession } from "./auth.queries"

export function hasPermission(user: AuthUser | null | undefined, permission: string): boolean {
    if (!user) return false
    return user.permissions.includes(permission)
}

export function useHasPermission(permission: string): boolean {
    const { data } = useAuthSession()
    return hasPermission(data, permission)
}
