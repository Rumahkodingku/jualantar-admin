import { cn } from "cn"

import type { OrderStatusKey } from "../services/dashboard.types"

const orderStatusMeta: Record<OrderStatusKey, { label: string; className: string; dot: string }> = {
    selesai: {
        label: "Selesai",
        className:
            "bg-emerald-500/10 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    diproses: {
        label: "Diproses",
        className: "bg-sky-500/10 text-sky-700 ring-sky-600/25 dark:bg-sky-500/15 dark:text-sky-400",
        dot: "bg-sky-500",
    },
    menunggu: {
        label: "Menunggu",
        className: "bg-amber-500/10 text-amber-700 ring-amber-600/30 dark:bg-amber-500/15 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    dibatalkan: {
        label: "Dibatalkan",
        className: "bg-muted text-muted-foreground ring-border",
        dot: "bg-muted-foreground/70",
    },
}

export function OrderStatusBadge({ status }: { status: OrderStatusKey }) {
    const meta = orderStatusMeta[status]

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
                meta.className
            )}
        >
            <span className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
            {meta.label}
        </span>
    )
}
