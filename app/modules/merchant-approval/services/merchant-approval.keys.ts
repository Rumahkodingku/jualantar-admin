import type { ApprovalListParams } from "../types/merchant-approval.types"

export const merchantApprovalKeys = {
    all: ["merchant-approvals"] as const,
    summary: () => [...merchantApprovalKeys.all, "summary"] as const,
    lists: () => [...merchantApprovalKeys.all, "list"] as const,
    list: (params: ApprovalListParams) => [...merchantApprovalKeys.lists(), params] as const,
    details: () => [...merchantApprovalKeys.all, "detail"] as const,
    detail: (id: string) => [...merchantApprovalKeys.details(), id] as const,
    events: (id: string) => [...merchantApprovalKeys.detail(id), "events"] as const,
    revisions: (id: string) => [...merchantApprovalKeys.detail(id), "revisions"] as const,
}
