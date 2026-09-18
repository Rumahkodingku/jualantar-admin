import { ClipboardCheck, Ellipsis } from "lucide-react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { formatDateTime } from "~/lib/format"
import type { ApprovalListItem } from "../../types/merchant-approval.types"
import { MerchantIdentity } from "../shared/merchant-identity"
import { MerchantTypeBadge } from "../shared/merchant-type-badge"
import { Reviewer } from "../shared/reviewer"
import { ServiceBadge } from "../shared/service-badge"
import { ApplicationStatusBadge } from "../shared/status-badge"

interface QueueMobileCardProps {
    item: ApprovalListItem
    currentUserId?: string
    canClaim: boolean
    isClaiming: boolean
    onClaim: (id: string) => void
}

export function QueueMobileCard({ item, currentUserId, canClaim, isClaiming, onClaim }: QueueMobileCardProps) {
    const detailHref = `/merchant-approvals/${item.id}`

    return (
        <Card className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-3">
                <MerchantIdentity merchant={item.merchant} />
                {item.application && <ApplicationStatusBadge status={item.application.status} />}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                    to={detailHref}
                    className="font-mono text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                    {item.application?.application_number ?? "-"}
                </Link>
                <MerchantTypeBadge type={item.merchant?.type ?? null} />
                <ServiceBadge name={item.merchant?.service?.name} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                <div className="min-w-0">
                    <dt>
                        <Text variant="xs" className="text-muted-foreground">
                            Tanggal Pengajuan
                        </Text>
                    </dt>
                    <dd className="mt-0.5">
                        <Text variant="xs" weight="medium" className="text-foreground">
                            {formatDateTime(item.application?.submitted_at ?? item.created_at)}
                        </Text>
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt>
                        <Text variant="xs" className="text-muted-foreground">
                            Reviewer
                        </Text>
                    </dt>
                    <dd className="mt-0.5">
                        <Reviewer assignedTo={item.assigned_to} currentUserId={currentUserId} />
                    </dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    nativeButton={false}
                    render={<Link to={detailHref} />}
                    className="flex-1 text-xs font-semibold"
                >
                    Lihat Detail
                </Button>

                {canClaim && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={<Button size="icon" variant="outline" aria-label="Aksi lainnya" />}
                        >
                            <Ellipsis aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled={isClaiming} onClick={() => onClaim(item.id)}>
                                {isClaiming ? <Spinner aria-hidden="true" /> : <ClipboardCheck aria-hidden="true" />}
                                Klaim
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </Card>
    )
}
