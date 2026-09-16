import { ShieldX } from "lucide-react"
import type { ReactNode } from "react"
import { Navigate } from "react-router"

import { Spinner } from "~/components/ui/spinner"
import { hasPermission } from "../services/auth.permissions"
import { useAuthSession } from "../services/auth.queries"

interface RequireAuthProps {
    children: ReactNode
    permission?: string
}

export function RequireAuth({ children, permission }: RequireAuthProps) {
    const { data, isLoading, isError } = useAuthSession()

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center p-8" role="status" aria-label="Memuat sesi">
                <Spinner aria-hidden="true" className="size-6 text-muted-foreground" />
            </div>
        )
    }

    if (isError || !data) {
        return <Navigate to="/login" replace />
    }

    if (permission && !hasPermission(data, permission)) {
        return (
            <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-card p-8">
                <div className="flex max-w-sm flex-col items-center gap-4 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                        <ShieldX aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                        <p className="font-heading text-base font-semibold text-foreground">Akses ditolak.</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Anda tidak memiliki izin untuk mengakses halaman approval merchant.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
