import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "cn"
import { Text } from "~/components/ui/text"

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ApprovalStatus = "completed" | "current" | "upcoming" | "rejected"

export interface ApprovalStep {
    /** Nama tahap, mis. "Verifikasi Berkas" */
    title: string
    /** Tanggal / waktu tahap, mis. "12 Mar 2026 · 14:20" */
    date: string
    /** Baris tambahan opsional, mis. nama approver */
    description?: string
    status: ApprovalStatus
}

interface ApprovalTimelineProps extends React.ComponentPropsWithoutRef<"ol"> {
    steps: ApprovalStep[]
    /** Label untuk pembaca layar */
    label?: string
}

/* -------------------------------------------------------------------------- */
/*  Container                                                                  */
/* -------------------------------------------------------------------------- */

export function ApprovalTimeline({ steps, label = "Status persetujuan", className, ...props }: ApprovalTimelineProps) {
    return (
        <ol aria-label={label} className={cn("flex flex-col sm:flex-row", className)} {...props}>
            {steps.map((step, index) => (
                <ApprovalTimelineItem key={`${step.title}-${index}`} {...step} isLast={index === steps.length - 1} />
            ))}
        </ol>
    )
}

/* -------------------------------------------------------------------------- */
/*  Item                                                                       */
/* -------------------------------------------------------------------------- */

interface ApprovalTimelineItemProps extends ApprovalStep {
    isLast?: boolean
}

const STATUS_TEXT: Record<ApprovalStatus, string> = {
    completed: "Selesai",
    current: "Sedang diproses",
    upcoming: "Belum dimulai",
    rejected: "Ditolak",
}

export function ApprovalTimelineItem({ title, date, description, status, isLast = false }: ApprovalTimelineItemProps) {
    const isCompleted = status === "completed"
    const isCurrent = status === "current"
    const isRejected = status === "rejected"
    const isUpcoming = status === "upcoming"

    return (
        <li
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
                "relative flex items-start gap-4",
                "sm:flex-1 sm:flex-col sm:items-center sm:gap-0 sm:text-center",
                !isLast && "pb-8 sm:pb-0"
            )}
        >
            {/* Garis penghubung — vertikal di mobile, horizontal di tablet ke atas */}
            {!isLast && (
                <span
                    aria-hidden="true"
                    className={cn(
                        "absolute top-7.5 bottom-1.5 left-3 w-0.5 -translate-x-1/2 rounded-full",
                        "sm:top-3 sm:bottom-auto sm:left-[calc(50%+18px)] sm:h-0.5 sm:w-[calc(100%-36px)] sm:translate-x-0 sm:-translate-y-1/2",
                        "bg-linear-to-b sm:bg-linear-to-r",
                        isCompleted && "from-emerald-500 to-emerald-500",
                        isCurrent && "from-emerald-500/70 to-border",
                        isRejected && "from-rose-500/70 to-border",
                        isUpcoming && "from-border to-border"
                    )}
                />
            )}

            {/* Node */}
            <span
                aria-hidden="true"
                className={cn(
                    "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    "transition-colors duration-300 sm:mt-0",
                    isCompleted && "border-emerald-500 bg-emerald-500 text-white ring-4 ring-emerald-500/15",
                    isCurrent && "border-emerald-500 bg-background ring-4 ring-emerald-500/15",
                    isRejected && "border-rose-500 bg-rose-500 text-white ring-4 ring-rose-500/15",
                    isUpcoming && "border-dashed border-muted-foreground/30 bg-background"
                )}
            >
                {isCurrent && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-emerald-500/30 motion-safe:animate-ping" />
                        <span className="relative size-2 rounded-full bg-emerald-500" />
                    </>
                )}
                {isCompleted && <Check className="size-3.5" strokeWidth={3} />}
                {isRejected && <X className="size-3.5" strokeWidth={3} />}
                {isUpcoming && <span className="size-1.5 rounded-full bg-muted-foreground/30" />}
            </span>

            {/* Konten */}
            <div className="flex min-w-0 flex-col sm:mt-3 sm:items-center sm:px-2">
                <Text
                    variant="xs"
                    weight="bold"
                    className={cn(
                        "transition-colors duration-300",
                        isCompleted && "text-emerald-700 dark:text-emerald-400",
                        isCurrent && "text-foreground",
                        isRejected && "text-rose-600 dark:text-rose-400",
                        isUpcoming && "text-muted-foreground"
                    )}
                >
                    {title}
                    <span className="sr-only"> — {STATUS_TEXT[status]}</span>
                </Text>

                <Text
                    variant="xs"
                    weight="medium"
                    className={cn("mt-1 text-muted-foreground tabular-nums", isUpcoming && "text-muted-foreground/60")}
                >
                    {date}
                </Text>

                {description && (
                    <Text variant="xs" className="mt-0.5 max-w-[22ch] text-muted-foreground/70">
                        {description}
                    </Text>
                )}

                {isCurrent && (
                    <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] leading-5 font-medium text-emerald-700 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                        Sedang diproses
                    </span>
                )}
            </div>
        </li>
    )
}
