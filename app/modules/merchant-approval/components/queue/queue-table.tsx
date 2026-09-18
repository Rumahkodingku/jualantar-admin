import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Text } from "~/components/ui/text"
import type { ApprovalListItem } from "../../types/merchant-approval.types"
import { QueueTableRow } from "./queue-table-row"

const COLUMNS = [
    "Merchant",
    "No. Pengajuan",
    "Tipe Usaha",
    "Layanan",
    "Status",
    "Tanggal Pengajuan",
    "Reviewer",
] as const

interface QueueTableProps {
    data: ApprovalListItem[]
    currentUserId?: string
    canClaim: (item: ApprovalListItem) => boolean
    onClaim: (id: string) => void
    claimingId: string | null
}

export function QueueTable({ data, currentUserId, canClaim, onClaim, claimingId }: QueueTableProps) {
    return (
        <div className="scrollbar-thumb-rounded scrollbar-thin w-full max-w-full min-w-0">
            <Table className="w-full min-w-275">
                <TableHeader className="bg-muted">
                    <TableRow className="hover:bg-transparent">
                        {COLUMNS.map((column) => (
                            <TableHead key={column} className="h-11 px-4 whitespace-nowrap">
                                <Text
                                    variant="xs"
                                    weight="bold"
                                    transform="uppercase"
                                    className="text-muted-foreground"
                                >
                                    {column}
                                </Text>
                            </TableHead>
                        ))}

                        <TableHead className="sticky right-0 z-10 h-11 border-l border-border bg-muted px-4 text-start whitespace-nowrap">
                            <Text variant="xs" weight="bold" transform="uppercase" className="text-muted-foreground">
                                Aksi
                            </Text>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((item) => (
                        <QueueTableRow
                            key={item.id}
                            item={item}
                            currentUserId={currentUserId}
                            canClaim={canClaim(item)}
                            isClaiming={claimingId === item.id}
                            onClaim={onClaim}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
