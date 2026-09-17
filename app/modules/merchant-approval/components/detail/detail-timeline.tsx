import {
    CheckCircle2,
    ClipboardCheck,
    ListChecks,
    PencilLine,
    RefreshCw,
    Send,
    Undo2,
    XCircle,
    type LucideIcon,
} from "lucide-react"

import { Text } from "~/components/ui/text"
import { formatDateTime } from "~/lib/format"
import { cn } from "~/lib/utils"
import { EVENT_TYPE_LABELS, eventActorLabel, REVIEW_COMPONENT_LABELS } from "../../services/merchant-approval.mappers"
import type { ApprovalEvent, ApprovalEventType, ReviewComponent } from "../../types/merchant-approval.types"

const EVENT_ICONS: Record<ApprovalEventType, LucideIcon> = {
    application_submitted: Send,
    approval_claimed: ClipboardCheck,
    approval_released: Undo2,
    component_reviewed: ListChecks,
    revision_requested: PencilLine,
    application_resubmitted: RefreshCw,
    application_approved: CheckCircle2,
    application_rejected: XCircle,
}

function metadataSummary(event: ApprovalEvent): string | null {
    const metadata = event.metadata
    if (!metadata) return null

    if (event.event_type === "component_reviewed") {
        const component = metadata.component as ReviewComponent | undefined
        const status = metadata.status as string | undefined
        if (component && status) {
            const label = REVIEW_COMPONENT_LABELS[component] ?? component
            return `${label} · ${status === "verified" ? "diverifikasi" : "ditolak"}`
        }
    }

    if (typeof metadata.note === "string" && metadata.note.trim() !== "") {
        return metadata.note
    }

    if (typeof metadata.reason === "string" && metadata.reason.trim() !== "") {
        return metadata.reason
    }

    return null
}

export function DetailTimeline({ events, currentUserId }: { events: ApprovalEvent[]; currentUserId?: string }) {
    if (events.length === 0) {
        return (
            <Text variant="sm" className="text-muted-foreground">
                Belum ada aktivitas pada pengajuan ini.
            </Text>
        )
    }

    return (
        <ol className="flex flex-col">
            {events.map((event, index) => {
                const Icon = EVENT_ICONS[event.event_type] ?? ListChecks
                const summary = metadataSummary(event)

                return (
                    <li key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Icon aria-hidden="true" className="size-3.5" />
                            </span>
                            {index < events.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                        </div>
                        <div className={cn("min-w-0", index < events.length - 1 && "pb-4")}>
                            <Text variant="sm" weight="medium" className="text-foreground">
                                {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                            </Text>
                            <Text variant="xs" className="text-muted-foreground">
                                {eventActorLabel(event, currentUserId)} · {formatDateTime(event.created_at)}
                            </Text>
                            {summary && (
                                <Text variant="xs" className="mt-1 text-muted-foreground italic">
                                    “{summary}”
                                </Text>
                            )}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
