import { useCallback, useState } from "react"
import { useSearchParams } from "react-router"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination"
import { Text } from "~/components/ui/text"
import { toast } from "~/components/ui/toast"
import { ApiError } from "~/lib/api"
import { useAuthSession, useHasPermission } from "~/modules/auth"
import { ApprovalEmptyState } from "../components/approval-empty-state"
import { ApprovalErrorState } from "../components/approval-error-state"
import { ApprovalLoadingState } from "../components/approval-loading-state"
import { ApprovalMobileCard } from "../components/approval-mobile-card"
import { ApprovalPageHeader } from "../components/approval-page-header"
import { ApprovalQueueToolbar } from "../components/approval-queue-toolbar"
import { ApprovalStatusTabs } from "../components/approval-status-tabs"
import { ApprovalSummary } from "../components/approval-summary"
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
import { cn } from "cn"

const DEFAULT_PER_PAGE = 15

export function MerchantApprovalListPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: session } = useAuthSession()
    const currentUserId = session?.id
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

    const hasFilters = Boolean(search) || status !== "all" || assignedTo !== "all"
    const meta = data?.meta
    const canGoPrevious = page > 1
    const canGoNext = meta ? page < meta.last_page : false

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <ApprovalPageHeader
                title="Antrean Merchant Approval"
                description="Pantau dan proses pengajuan merchant dari satu antrean operasional."
            />

            <ApprovalStatusTabs
                value={status}
                onValueChange={(value) => updateParams({ status: value === "all" ? null : value })}
            />

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

            {isLoading ? (
                <ApprovalLoadingState />
            ) : isError ? (
                <ApprovalErrorState onRetry={() => refetch()} />
            ) : !data || data.items.length === 0 ? (
                <ApprovalEmptyState
                    hasFilters={hasFilters}
                    onReset={() => updateParams({ search: null, status: null, assigned_to: null })}
                />
            ) : (
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="hidden min-w-0 lg:block">
                        <ApprovalTable
                            data={data.items}
                            currentUserId={currentUserId}
                            canClaim={canClaim}
                            onClaim={handleClaim}
                            claimingId={claimingId}
                        />
                    </div>

                    <div className="flex flex-col gap-3 lg:hidden">
                        {data.items.map((item) => (
                            <ApprovalMobileCard
                                key={item.id}
                                item={item}
                                currentUserId={currentUserId}
                                canClaim={canClaim(item)}
                                isClaiming={claimingId === item.id}
                                onClaim={handleClaim}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Text variant="xs" weight="medium" className="text-muted-foreground">
                            Menampilkan <span className="font-semibold text-foreground">{data.items.length}</span> dari{" "}
                            <span className="font-semibold text-foreground">{meta?.total ?? 0}</span> pengajuan
                        </Text>

                        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                            <PaginationContent className="gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        aria-disabled={!canGoPrevious}
                                        className={cn(
                                            "h-8 rounded-md px-2.5 text-xs",
                                            !canGoPrevious && "pointer-events-none opacity-40"
                                        )}
                                        onClick={(event) => {
                                            event.preventDefault()

                                            if (canGoPrevious) {
                                                updateParams({ page: String(page - 1) }, false)
                                            }
                                        }}
                                        text="Sebelumnya"
                                    />
                                </PaginationItem>

                                <PaginationItem>
                                    <div className="flex h-8 items-center px-3">
                                        <Text
                                            variant="xs"
                                            weight="medium"
                                            className="whitespace-nowrap text-muted-foreground"
                                        >
                                            Halaman <span className="font-semibold text-foreground">{page}</span> dari{" "}
                                            <span className="font-semibold text-foreground">
                                                {meta?.last_page ?? 1}
                                            </span>
                                        </Text>
                                    </div>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        aria-disabled={!canGoNext}
                                        className={cn(
                                            "h-8 rounded-md px-2.5 text-xs",
                                            !canGoNext && "pointer-events-none opacity-40"
                                        )}
                                        onClick={(event) => {
                                            event.preventDefault()

                                            if (canGoNext) {
                                                updateParams({ page: String(page + 1) }, false)
                                            }
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
