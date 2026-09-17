import { RotateCw } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Spinner } from "~/components/ui/spinner"
import { ApprovalFilter } from "./approval-filter"

interface ApprovalQueueToolbarProps {
    search: string
    assignedTo: string
    sortValue: string
    onSearchChange: (value: string) => void
    onAssignedChange: (value: string) => void
    onSortChange: (value: string) => void
    onRefresh: () => void
    isRefreshing: boolean
}

export function ApprovalQueueToolbar({
    search,
    assignedTo,
    sortValue,
    onSearchChange,
    onAssignedChange,
    onSortChange,
    onRefresh,
    isRefreshing,
}: ApprovalQueueToolbarProps) {
    return (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Filters */}
            <div className="min-w-0 flex-1">
                <ApprovalFilter
                    search={search}
                    assignedTo={assignedTo}
                    sortValue={sortValue}
                    onSearchChange={onSearchChange}
                    onAssignedChange={onAssignedChange}
                    onSortChange={onSortChange}
                />
            </div>

            {/* Refresh */}
            <Button
                type="button"
                variant="default"
                size="lg"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="w-full shrink-0 sm:w-auto"
            >
                {isRefreshing ? <Spinner aria-hidden="true" /> : <RotateCw aria-hidden="true" />}
                Muat ulang
            </Button>
        </div>
    )
}
