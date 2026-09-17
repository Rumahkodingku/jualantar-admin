import { CheckCircle2, ClipboardList, Eye, FilePenLine, UserRoundPlus, XCircle, type LucideIcon } from "lucide-react"

import { Skeleton } from "~/components/ui/skeleton"
import { useApprovalSummary } from "../services/merchant-approval.queries"
import type { ApplicationStatus } from "../types/merchant-approval.types"
import { ApprovalSummaryCard, type ApprovalSummaryTone } from "./approval-summary-card"

interface StatusCardConfig {
    status: ApplicationStatus
    label: string
    tone: ApprovalSummaryTone
    icon: LucideIcon
}

const STATUS_CARDS: StatusCardConfig[] = [
    { status: "pending", label: "Perlu Ditinjau", tone: "pending", icon: ClipboardList },
    { status: "in_review", label: "Sedang Direview", tone: "in_review", icon: Eye },
    { status: "revision_required", label: "Perlu Revisi", tone: "revision", icon: FilePenLine },
    { status: "approved", label: "Disetujui", tone: "approved", icon: CheckCircle2 },
    { status: "rejected", label: "Ditolak", tone: "rejected", icon: XCircle },
]

export function ApprovalSummary() {
    const { data, isLoading, isError } = useApprovalSummary()

    if (isLoading) {
        return (
            <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
                aria-busy="true"
                aria-label="Memuat ringkasan approval"
            >
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-[86px] rounded-xl" />
                ))}
            </div>
        )
    }

    if (isError || !data) return null

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {STATUS_CARDS.map((card) => (
                <ApprovalSummaryCard
                    key={card.status}
                    label={card.label}
                    value={data.by_status[card.status]}
                    tone={card.tone}
                    icon={card.icon}
                />
            ))}
            <ApprovalSummaryCard
                label="Belum Ditugaskan"
                value={data.unassigned}
                tone="unassigned"
                icon={UserRoundPlus}
            />
        </div>
    )
}
