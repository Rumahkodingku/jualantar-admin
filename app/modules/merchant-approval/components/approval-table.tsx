import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table"
import { ClipboardCheck } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { Spinner } from "~/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { formatDateTime } from "~/lib/format"
import { MERCHANT_TYPE_LABELS } from "../services/merchant-approval.mappers"
import type { ApprovalListItem } from "../types/merchant-approval.types"
import { ApplicationStatusBadge } from "./approval-status-badge"
import { Text } from "~/components/ui/text"

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, ApprovalListItem>()

interface ApprovalTableProps {
    data: ApprovalListItem[]
    currentUserId?: string
    canClaim: (item: ApprovalListItem) => boolean
    onClaim: (id: string) => void
    claimingId: string | null
}

export function ApprovalTable({ data, currentUserId, canClaim, onClaim, claimingId }: ApprovalTableProps) {
    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.display({
                    id: "application_number",
                    header: "No. Pengajuan",
                    cell: ({ row }) => (
                        <Link
                            to={`/merchant-approvals/${row.original.id}`}
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            {row.original.application?.application_number ?? "-"}
                        </Link>
                    ),
                }),
                columnHelper.display({
                    id: "business_name",
                    header: "Nama Bisnis",
                    cell: ({ row }) => row.original.merchant?.business_name ?? "-",
                }),
                columnHelper.display({
                    id: "type",
                    header: "Tipe",
                    cell: ({ row }) => {
                        const type = row.original.merchant?.type
                        return type ? MERCHANT_TYPE_LABELS[type] : "-"
                    },
                }),
                columnHelper.display({
                    id: "service",
                    header: "Layanan",
                    cell: ({ row }) => row.original.merchant?.service?.name ?? "-",
                }),
                columnHelper.display({
                    id: "status",
                    header: "Status",
                    cell: ({ row }) =>
                        row.original.application ? (
                            <ApplicationStatusBadge status={row.original.application.status} />
                        ) : (
                            "-"
                        ),
                }),
                columnHelper.display({
                    id: "submitted_at",
                    header: "Tanggal Pengajuan",
                    cell: ({ row }) =>
                        formatDateTime(row.original.application?.submitted_at ?? row.original.created_at),
                }),
                columnHelper.display({
                    id: "assigned_to",
                    header: "Reviewer",
                    cell: ({ row }) => {
                        if (!row.original.assigned_to) return "-"
                        return currentUserId && row.original.assigned_to === currentUserId ? "Anda" : "Administrator"
                    },
                }),
                columnHelper.display({
                    id: "actions",
                    header: () => <span className="sr-only">Aksi</span>,
                    cell: ({ row }) => (
                        <div className="flex justify-end gap-2">
                            {canClaim(row.original) && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={claimingId === row.original.id}
                                    onClick={() => onClaim(row.original.id)}
                                >
                                    {claimingId === row.original.id ? (
                                        <Spinner aria-hidden="true" />
                                    ) : (
                                        <ClipboardCheck aria-hidden="true" />
                                    )}
                                    Klaim
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                nativeButton={false}
                                render={<Link to={`/merchant-approvals/${row.original.id}`} />}
                            >
                                Detail
                            </Button>
                        </div>
                    ),
                }),
            ]),
        [canClaim, claimingId, currentUserId, onClaim]
    )

    const table = useTable({ features, columns, data })

    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={header.column.id === "actions" ? "text-right" : undefined}
                                >
                                    <Text
                                        variant="xs"
                                        weight="bold"
                                        transform="uppercase"
                                        className="text-muted-foreground"
                                    >
                                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                                    </Text>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getAllCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={cell.column.id === "actions" ? "text-right" : undefined}
                                >
                                    <Text variant="xs" weight="medium" className="text-foreground">
                                        <table.FlexRender cell={cell} />
                                    </Text>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
