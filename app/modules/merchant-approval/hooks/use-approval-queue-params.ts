import { useCallback } from "react"
import { useSearchParams } from "react-router"

import type {
    ApprovalListParams,
    ApprovalSortColumn,
    ApplicationStatus,
    SortOrder,
} from "../types/merchant-approval.types"

const DEFAULT_PER_PAGE = 15

export function useApprovalQueueParams() {
    const [searchParams, setSearchParams] = useSearchParams()

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

    const hasFilters = Boolean(search) || status !== "all" || assignedTo !== "all"

    return { status, assignedTo, search, sort, order, page, perPage, params, updateParams, hasFilters }
}