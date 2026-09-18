import { useCallback, useState } from "react"

import { toast } from "~/components/ui/toast"
import { PageHeader } from "~/components/page-header"
import { ApiError } from "~/lib/api"
import { useAuthSession, useHasPermission } from "~/modules/auth"
import { QueueEmptyState } from "../components/queue/queue-empty-state"
import { QueueErrorState } from "../components/queue/queue-error-state"
import { QueueLoadingState } from "../components/queue/queue-loading-state"
import { QueueMobileCard } from "../components/queue/queue-mobile-card"
import { QueuePagination } from "../components/queue/queue-pagination"
import { QueueStatusTabs } from "../components/queue/queue-status-tabs"
import { QueueTable } from "../components/queue/queue-table"
import { QueueToolbar } from "../components/queue/queue-toolbar"
import { useApprovalQueueParams } from "../hooks/use-approval-queue-params"
import { useClaimApproval } from "../services/merchant-approval.mutations"
import { useApprovals } from "../services/merchant-approval.queries"
import type { ApprovalListItem } from "../types/merchant-approval.types"

export function MerchantApprovalListPage() {
    const { status, assignedTo, search, sort, order, page, params, updateParams, hasFilters } =
        useApprovalQueueParams()
    const { data: session } = useAuthSession()
    const currentUserId = session?.id
    const canClaimPermission = useHasPermission("merchant.approval.claim")
    const claim = useClaimApproval()

    const [claimingId, setClaimingId] = useState<string | null>(null)

    const { data, isLoading, isError, isFetching, refetch } = useApprovals(params)

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

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <PageHeader
                title="Antrean Merchant Approval"
                description="Pantau dan proses pengajuan merchant dari satu antrean operasional."
                breadcrumbs={[
                    { label: "Home", to: "/dashboard" },
                    { label: "Merchant Approvals", to: "/merchant-approvals" },
                    { label: "Approval" },
                ]}
            />

            <QueueStatusTabs
                value={status}
                onValueChange={(value) => updateParams({ status: value === "all" ? null : value })}
            />

            <QueueToolbar
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
                <QueueLoadingState />
            ) : isError ? (
                <QueueErrorState onRetry={() => refetch()} />
            ) : !data || data.items.length === 0 ? (
                <QueueEmptyState
                    hasFilters={hasFilters}
                    onReset={() => updateParams({ search: null, status: null, assigned_to: null })}
                />
            ) : (
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="hidden min-w-0 lg:block">
                        <QueueTable
                            data={data.items}
                            currentUserId={currentUserId}
                            canClaim={canClaim}
                            onClaim={handleClaim}
                            claimingId={claimingId}
                        />
                    </div>

                    <div className="flex flex-col gap-3 lg:hidden">
                        {data.items.map((item) => (
                            <QueueMobileCard
                                key={item.id}
                                item={item}
                                currentUserId={currentUserId}
                                canClaim={canClaim(item)}
                                isClaiming={claimingId === item.id}
                                onClaim={handleClaim}
                            />
                        ))}
                    </div>

                    <QueuePagination
                        page={page}
                        count={data.items.length}
                        total={meta?.total ?? 0}
                        lastPage={meta?.last_page ?? 1}
                        onPrevious={() => updateParams({ page: String(page - 1) }, false)}
                        onNext={() => updateParams({ page: String(page + 1) }, false)}
                    />
                </div>
            )}
        </div>
    )
}