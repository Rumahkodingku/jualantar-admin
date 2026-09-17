import { ClipboardList, Inbox } from "lucide-react"
import { useCallback, useState } from "react"
import { useSearchParams } from "react-router"

import { Button } from "~/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "~/components/ui/empty"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination"
import { Skeleton } from "~/components/ui/skeleton"
import { Text } from "~/components/ui/text"
import { toast } from "~/components/ui/toast"
import { ApiError } from "~/lib/api"
import { useHasPermission } from "~/modules/auth"
import { ApprovalQueueToolbar } from "../components/approval-queue-toolbar"
import { ApprovalStatusTabs } from "../components/approval-status-tabs"
import { ApprovalTable } from "../components/approval-table"
import { useClaimApproval } from "../services/merchant-approval.mutations"
import { useApprovals } from "../services/merchant-approval.queries"
import type {
    ApprovalListItem,
    ApprovalListParams,
    ApprovalSortColumn,
    ApplicationStatus,
    SortOrder,
} from "../types/merchant-approval.types"

const DEFAULT_PER_PAGE = 15

function TableSkeleton() {
    return (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label="Memuat antrean">
            {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
        </div>
    )
}

export function MerchantApprovalListPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const canClaimPermission = useHasPermission("merchant.approval.claim")
    const claim = useClaimApproval()

    const [claimingId, setClaimingId] = useState<string | null>(null)

    const status = searchParams.get("status") ?? "all"
    const assignedTo = searchParams.get("assigned_to") ?? "all"
    const search = searchParams.get("search") ?? ""
    const sort = (searchParams.get("sort") as ApprovalSortColumn | null) ?? "created_at"
    const order = (searchParams.get("order") as SortOrder | null) ?? "desc"
    const page = Number(searchParams.get("page") ?? "1") || 1
    const perPage = Number(searchParams.get("per_page") ?? String(DEFAULT_PER_PAGE)) || DEFAULT_PER_PAGE

    const params: ApprovalListParams = {
        status: status === "all" ? undefined : (status as ApplicationStatus),
        assignment: assignedTo === "all" ? undefined : assignedTo,
        search: search || undefined,
        sort,
        order,
        page,
        per_page: perPage,
    }

    const { data, isLoading, isError, isFetching, refetch } = useApprovals(params)

    const updateParams = useCallback(
        (updates: Record<string, string | null>, resetPage = true) => {
            setSearchParams(
                (previous) => {
                    const next = new URLSearchParams(previous)

                    for (const [key, value] of Object.entries(updates)) {
                        if (value === null || value === "") next.delete(key)
                        else next.set(key, value)
                    }

                    if (resetPage) next.delete("page")

                    return next
                },
                { replace: true }
            )
        },
        [setSearchParams]
    )

    const handleClaim = (id: string) => {
        setClaimingId(id)
        claim.mutate(id, {
            onSuccess: () =>
                toast.add({
                    title: "Review diklaim",
                    description: "Anda sekarang menjadi reviewer pengajuan ini.",
                    type: "success",
                }),
            onError: (error) =>
                toast.add({
                    title: "Gagal mengklaim",
                    description:
                        error instanceof ApiError && error.message
                            ? error.message
                            : "Terjadi kesalahan saat mengklaim.",
                    type: "error",
                }),
            onSettled: () => setClaimingId(null),
        })
    }

    const canClaim = useCallback(
        (item: ApprovalListItem) => canClaimPermission && item.application?.status === "pending" && !item.assigned_to,
        [canClaimPermission]
    )

    const meta = data?.meta
    const canGoPrevious = page > 1
    const canGoNext = meta ? page < meta.last_page : false

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <div className="min-w-0">
                <Text as="h1" variant="2xl" weight="bold" className="tracking-tight text-foreground">
                    Antrean Merchant Approval
                </Text>
                <Text variant="sm" className="mt-1.5 text-muted-foreground">
                    Daftar pengajuan merchant yang perlu ditinjau.
                </Text>
            </div>

            <ApprovalQueueToolbar
                search={search}
                assignedTo={assignedTo}
                sortValue={`${sort}:${order}`}
                onSearchChange={(value) => updateParams({ search: value })}
                onAssignedChange={(value) => updateParams({ assigned_to: value === "all" ? null : value })}
                onSortChange={(value) => {
                    const [nextSort, nextOrder] = value.split(":")
                    updateParams({ sort: nextSort, order: nextOrder })
                }}
                onRefresh={() => refetch()}
                isRefreshing={isFetching && !isLoading}
            />

            <ApprovalStatusTabs
                value={status}
                onValueChange={(value) => updateParams({ status: value === "all" ? null : value })}
            />

            {isLoading ? (
                <TableSkeleton />
            ) : isError ? (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card p-8">
                    <div className="flex max-w-sm flex-col items-center gap-4 text-center">
                        <div>
                            <Text variant="base" weight="semibold" className="text-foreground">
                                Antrean gagal dimuat.
                            </Text>
                            <Text variant="sm" className="mt-1 text-muted-foreground">
                                Terjadi kesalahan saat memuat daftar pengajuan. Silakan coba lagi.
                            </Text>
                        </div>
                        <Button variant="outline" onClick={() => refetch()}>
                            Coba lagi
                        </Button>
                    </div>
                </div>
            ) : !data || data.items.length === 0 ? (
                <Empty className="border">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            {search || status !== "all" || assignedTo !== "all" ? (
                                <ClipboardList aria-hidden="true" />
                            ) : (
                                <Inbox aria-hidden="true" />
                            )}
                        </EmptyMedia>
                        <EmptyTitle>Tidak ada pengajuan</EmptyTitle>
                        <EmptyDescription>
                            {search || status !== "all" || assignedTo !== "all"
                                ? "Tidak ada pengajuan yang cocok dengan filter saat ini."
                                : "Belum ada pengajuan merchant yang perlu ditinjau."}
                        </EmptyDescription>
                    </EmptyHeader>
                    {(search || status !== "all" || assignedTo !== "all") && (
                        <EmptyContent>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateParams({ search: null, status: null, assigned_to: null })}
                            >
                                Reset filter
                            </Button>
                        </EmptyContent>
                    )}
                </Empty>
            ) : (
                <div className="flex flex-col gap-4">
                    <ApprovalTable
                        data={data.items}
                        canClaim={canClaim}
                        onClaim={handleClaim}
                        claimingId={claimingId}
                    />

                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <Text variant="xs" weight="semibold" className="text-muted-foreground">
                            Menampilkan {data.items.length} dari {meta?.total ?? 0} pengajuan
                        </Text>

                        <Pagination className="mx-0 w-auto justify-end">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        aria-disabled={!canGoPrevious}
                                        className={
                                            !canGoPrevious ? "pointer-events-none font-semibold opacity-50" : undefined
                                        }
                                        onClick={(event) => {
                                            event.preventDefault()
                                            if (canGoPrevious) updateParams({ page: String(page - 1) }, false)
                                        }}
                                        text="Sebelumnya"
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <Text variant="xs" weight="semibold" className="px-2 text-muted-foreground">
                                        Halaman {page} dari {meta?.last_page ?? 1}
                                    </Text>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        aria-disabled={!canGoNext}
                                        className={!canGoNext ? "pointer-events-none opacity-50" : undefined}
                                        onClick={(event) => {
                                            event.preventDefault()
                                            if (canGoNext) updateParams({ page: String(page + 1) }, false)
                                        }}
                                        text="Berikutnya"
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}
        </div>
    )
}
