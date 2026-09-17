import { cn } from "~/lib/utils"

import {
    APPLICATION_STATUS_META,
    REVISION_STATUS_META,
    REVIEW_STATUS_META,
} from "../../services/merchant-approval.mappers"
import type { ApplicationStatus, RevisionStatus, ReviewStatus } from "../../types/merchant-approval.types"

interface StatusPillProps {
    label: string
    className: string
    dot: string
}

function StatusPill({ label, className, dot }: StatusPillProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
                className
            )}
        >
            <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden="true" />
            {label}
        </span>
    )
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
    return <StatusPill {...APPLICATION_STATUS_META[status]} />
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
    return <StatusPill {...REVIEW_STATUS_META[status]} />
}

export function RevisionStatusBadge({ status }: { status: RevisionStatus }) {
    return <StatusPill {...REVISION_STATUS_META[status]} />
}
