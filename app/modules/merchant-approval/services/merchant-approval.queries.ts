import { useQuery } from "@tanstack/react-query"

import type { ApprovalListParams } from "../types/merchant-approval.types"
import { merchantApprovalApi } from "./merchant-approval.api"
import { merchantApprovalKeys } from "./merchant-approval.keys"

export function useApprovalSummary() {
    return useQuery({
        queryKey: merchantApprovalKeys.summary(),
        queryFn: () => merchantApprovalApi.getSummary(),
    })
}

export function useApprovals(params: ApprovalListParams) {
    return useQuery({
        queryKey: merchantApprovalKeys.list(params),
        queryFn: () => merchantApprovalApi.getApprovals(params),
    })
}

export function useApproval(id: string) {
    return useQuery({
        queryKey: merchantApprovalKeys.detail(id),
        queryFn: () => merchantApprovalApi.getApproval(id),
        enabled: Boolean(id),
    })
}

export function useApprovalEvents(id: string) {
    return useQuery({
        queryKey: merchantApprovalKeys.events(id),
        queryFn: () => merchantApprovalApi.getEvents(id),
        enabled: Boolean(id),
    })
}

export function useApprovalRevisions(id: string) {
    return useQuery({
        queryKey: merchantApprovalKeys.revisions(id),
        queryFn: () => merchantApprovalApi.getRevisions(id),
        enabled: Boolean(id),
    })
}
