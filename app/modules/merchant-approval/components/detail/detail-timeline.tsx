import { Text } from "~/components/ui/text"
import { formatDateTime } from "~/lib/format"
import { EVENT_TYPE_LABELS, eventActorLabel, REVIEW_COMPONENT_LABELS } from "../../services/merchant-approval.mappers"
import type { ApprovalEvent, ReviewComponent } from "../../types/merchant-approval.types"
import { ApprovalTimeline, type ApprovalStep } from "./approval-timeline"

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

function eventToStep(event: ApprovalEvent, currentUserId: string | undefined): ApprovalStep {
    const isRejected =
        event.event_type === "application_rejected" ||
        (event.event_type === "component_reviewed" && event.metadata?.status === "rejected")

    return {
        title: EVENT_TYPE_LABELS[event.event_type] ?? event.event_type,
        date: `${eventActorLabel(event, currentUserId)} · ${formatDateTime(event.created_at)}`,
        description: metadataSummary(event) ?? undefined,
        status: isRejected ? "rejected" : "completed",
    }
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
        <ApprovalTimeline
            steps={events.map((event) => eventToStep(event, currentUserId))}
            label="Riwayat aktivitas pengajuan"
            orientation="vertical"
        />
    )
}
