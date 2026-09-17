import { Text } from "~/components/ui/text"
import { formatDateTime } from "~/lib/format"
import { REVIEW_COMPONENT_LABELS } from "../../services/merchant-approval.mappers"
import type { ApprovalRevision } from "../../types/merchant-approval.types"
import { RevisionStatusBadge } from "../shared/status-badge"

function requesterLabel(requestedBy: string | null, currentUserId?: string): string {
    if (!requestedBy) return "Sistem"
    if (currentUserId && requestedBy === currentUserId) return "Anda"
    return "Administrator"
}

export function DetailRevisionHistory({
    revisions,
    currentUserId,
}: {
    revisions: ApprovalRevision[]
    currentUserId?: string
}) {
    if (revisions.length === 0) {
        return (
            <Text variant="sm" className="text-muted-foreground">
                Belum ada permintaan revisi.
            </Text>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {revisions.map((revision, index) => (
                <div key={revision.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Text variant="sm" weight="semibold" className="text-foreground">
                                Revisi #{index + 1}
                            </Text>
                            <RevisionStatusBadge status={revision.status} />
                        </div>
                        <Text variant="xs" className="text-muted-foreground">
                            {formatDateTime(revision.requested_at)}
                        </Text>
                    </div>

                    <Text variant="xs" className="mt-1 text-muted-foreground">
                        Diminta oleh {requesterLabel(revision.requested_by, currentUserId)}
                    </Text>

                    {revision.note && (
                        <Text variant="sm" className="mt-3 text-foreground">
                            {revision.note}
                        </Text>
                    )}

                    <ul className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                        {revision.items.map((item) => (
                            <li key={item.id} className="rounded-lg bg-muted/40 p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <Text variant="sm" weight="medium" className="text-foreground">
                                        {REVIEW_COMPONENT_LABELS[item.component] ?? item.component}
                                    </Text>
                                    <Text variant="xs" className="text-muted-foreground">
                                        {item.resolved_at
                                            ? `Selesai ${formatDateTime(item.resolved_at)}`
                                            : "Belum diselesaikan"}
                                    </Text>
                                </div>
                                <Text variant="sm" className="mt-1 text-muted-foreground">
                                    {item.reason}
                                </Text>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
