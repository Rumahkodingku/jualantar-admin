import { ClipboardCheck } from "lucide-react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Spinner } from "~/components/ui/spinner"
import { TableCell, TableRow } from "~/components/ui/table"
import { Text } from "~/components/ui/text"
import { formatDateTime } from "~/lib/format"
import type { ApprovalListItem } from "../../types/merchant-approval.types"
import { MerchantIdentity, MerchantTypeBadge, ServiceBadge } from "../shared/merchant"
import { Reviewer } from "../shared/reviewer"
import { ApplicationStatusBadge } from "../shared/status-badge"

interface QueueTableRowProps {
    item: ApprovalListItem
    currentUserId?: string
    canClaim: boolean
    isClaiming: boolean
    onClaim: (id: string) => void
}

export function QueueTableRow({ item, currentUserId, canClaim, isClaiming, onClaim }: QueueTableRowProps) {
    const detailHref = `/merchant-approvals/${item.id}`

    return (
        <TableRow>
            <TableCell className="max-w-72 px-4 py-3">
                <MerchantIdentity merchant={item.merchant} />
            </TableCell>
            <TableCell className="px-4 py-3">
                <Link to={detailHref} className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
                    {item.application?.application_number ?? "-"}
                </Link>
            </TableCell>
            <TableCell className="px-4 py-3">
                <MerchantTypeBadge type={item.merchant?.type ?? null} />
            </TableCell>
            <TableCell className="px-4 py-3">
                <ServiceBadge name={item.merchant?.service?.name} />
            </TableCell>
            <TableCell className="px-4 py-3">
                {item.application ? (
                    <ApplicationStatusBadge status={item.application.status} />
                ) : (
                    <Text variant="xs" className="text-muted-foreground">
                        -
                    </Text>
                )}
            </TableCell>
            <TableCell className="px-4 py-3">
                <Text variant="xs" weight="semibold" className="flex flex-col text-muted-foreground">
                    {formatDateTime(item.application?.submitted_at ?? item.created_at)}
                </Text>
            </TableCell>
            <TableCell className="px-4 py-3">
                <Reviewer assignedTo={item.assigned_to} currentUserId={currentUserId} />
            </TableCell>
            <TableCell className="sticky right-0 z-10 border-l border-border bg-card px-4 py-3 text-right">
                <div className="flex items-center justify-start gap-1.5">
                    <Button
                        size="sm"
                        variant="secondary"
                        nativeButton={false}
                        render={<Link to={detailHref} />}
                        className="text-xs font-semibold"
                    >
                        Lihat Detail
                    </Button>
                    {canClaim && (
                        <Button
                            size="sm"
                            variant="default"
                            disabled={isClaiming}
                            onClick={() => onClaim(item.id)}
                            className="text-xs font-semibold"
                        >
                            {isClaiming ? <Spinner aria-hidden="true" /> : <ClipboardCheck aria-hidden="true" />}
                            Klaim
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}
