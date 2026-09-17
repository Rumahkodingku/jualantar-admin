import type { LucideIcon } from "lucide-react"

import { Card } from "~/components/ui/card"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"

export type ApprovalSummaryTone = "pending" | "in_review" | "revision" | "approved" | "rejected" | "unassigned"

const TONE_STYLES: Record<ApprovalSummaryTone, string> = {
    pending: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    in_review: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    revision: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    approved: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    rejected: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
    unassigned: "bg-muted text-muted-foreground",
}

interface ApprovalSummaryCardProps {
    label: string
    value: number
    tone: ApprovalSummaryTone
    icon: LucideIcon
}

export function ApprovalSummaryCard({ label, value, tone, icon: Icon }: ApprovalSummaryCardProps) {
    return (
        <Card className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Text variant="xs" weight="medium" className="truncate text-muted-foreground">
                        {label}
                    </Text>
                    <Text
                        as="p"
                        variant="2xl"
                        weight="semibold"
                        className="mt-1.5 tracking-tight text-foreground tabular-nums"
                    >
                        {value}
                    </Text>
                </div>
                <span
                    aria-hidden="true"
                    className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TONE_STYLES[tone])}
                >
                    <Icon className="size-[18px]" />
                </span>
            </div>
        </Card>
    )
}
