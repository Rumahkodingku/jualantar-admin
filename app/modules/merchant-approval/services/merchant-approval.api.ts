import { api } from "~/lib/api"

import type { RejectionInput, RevisionInput, ReviewInput } from "../schemas/merchant-approval.schemas"
import type {
    ApprovalActionResult,
    ApprovalDetail,
    ApprovalEvent,
    ApprovalListItem,
    ApprovalRevision,
    ApprovalReview,
    ApprovalSummary,
    ApprovalListParams,
    PaginatedApprovals,
} from "../types/merchant-approval.types"

interface DataEnvelope<T> {
    data: T
}

interface PaginatedEnvelope<T> {
    data: T[]
    meta: {
        current_page: number
        per_page: number
        total: number
        last_page: number
    }
}

const BASE_PATH = "/admin/merchant-approvals"

export const merchantApprovalApi = {
    async getSummary(): Promise<ApprovalSummary> {
        const { data } = await api.get<DataEnvelope<ApprovalSummary>>(`${BASE_PATH}/summary`)
        return data.data
    },

    async getApprovals(params: ApprovalListParams): Promise<PaginatedApprovals> {
        const { data } = await api.get<PaginatedEnvelope<ApprovalListItem>>(BASE_PATH, { params })
        return { items: data.data, meta: data.meta }
    },

    async getApproval(id: string): Promise<ApprovalDetail> {
        const { data } = await api.get<DataEnvelope<ApprovalDetail>>(`${BASE_PATH}/${id}`)
        return data.data
    },

    async claimApproval(id: string): Promise<ApprovalActionResult> {
        const { data } = await api.post<DataEnvelope<ApprovalActionResult>>(`${BASE_PATH}/${id}/claim`)
        return data.data
    },

    async releaseApproval(id: string): Promise<ApprovalActionResult> {
        const { data } = await api.post<DataEnvelope<ApprovalActionResult>>(`${BASE_PATH}/${id}/release`)
        return data.data
    },

    async reviewComponent(id: string, payload: ReviewInput): Promise<ApprovalReview> {
        const { data } = await api.post<DataEnvelope<ApprovalReview>>(`${BASE_PATH}/${id}/reviews`, payload)
        return data.data
    },

    async requestRevision(id: string, payload: RevisionInput): Promise<ApprovalRevision> {
        const { data } = await api.post<DataEnvelope<ApprovalRevision>>(`${BASE_PATH}/${id}/revision`, payload)
        return data.data
    },

    async rejectApplication(id: string, payload: RejectionInput): Promise<ApprovalActionResult> {
        const { data } = await api.post<DataEnvelope<ApprovalActionResult>>(`${BASE_PATH}/${id}/reject`, payload)
        return data.data
    },

    async approveApplication(id: string): Promise<ApprovalActionResult> {
        const { data } = await api.post<DataEnvelope<ApprovalActionResult>>(`${BASE_PATH}/${id}/approve`)
        return data.data
    },

    async getEvents(id: string): Promise<ApprovalEvent[]> {
        const { data } = await api.get<DataEnvelope<ApprovalEvent[]>>(`${BASE_PATH}/${id}/events`)
        return data.data
    },

    async getRevisions(id: string): Promise<ApprovalRevision[]> {
        const { data } = await api.get<DataEnvelope<ApprovalRevision[]>>(`${BASE_PATH}/${id}/revisions`)
        return data.data
    },
}
