import { ShieldCheckIcon } from "lucide-react"

export function AuthSecurityNotice() {
    return (
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheckIcon className="size-4" aria-hidden="true" />
            Hanya untuk pengguna internal JualAntar
        </p>
    )
}
