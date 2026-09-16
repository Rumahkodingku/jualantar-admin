import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { RejectionInput, RevisionInput, ReviewInput } from "../schemas/merchant-approval.schemas"
import { merchantApprovalApi } from "./merchant-approval.api"
import { merchantApprovalKeys } from "./merchant-approval.keys"

function useApprovalInvalidation() {
    const queryClient = useQueryClient()

    return {
        invalidateQueue() {
            queryClient.invalidateQueries({ queryKey: merchantApprovalKeys.summary() })
            queryClient.invalidateQueries({ queryKey: merchantApprovalKeys.lists() })
        },
        invalidateDetail(id: string) {
            queryClient.invalidateQueries({ queryKey: merchantApprovalKeys.detail(id) })
        },
    }
}

export function useClaimApproval() {
    const { invalidateQueue, invalidateDetail } = useApprovalInvalidation()

    return useMutation({
        mutationFn: (id: string) => merchantApprovalApi.claimApproval(id),
        onSuccess: (_data, id) => {
            invalidateQueue()
            invalidateDetail(id)
        },
    })
}

export function useReleaseApproval() {
    const { invalidateQueue, invalidateDetail } = useApprovalInvalidation()

    return useMutation({
        mutationFn: (id: string) => merchantApprovalApi.releaseApproval(id),
        onSuccess: (_data, id) => {
            invalidateQueue()
            invalidateDetail(id)
        },
    })
}

export function useReviewComponent() {
    const { invalidateDetail } = useApprovalInvalidation()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ReviewInput }) =>
            merchantApprovalApi.reviewComponent(id, payload),
        onSuccess: (_data, { id }) => {
            invalidateDetail(id)
        },
    })
}

export function useRequestRevision() {
    const { invalidateQueue, invalidateDetail } = useApprovalInvalidation()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: RevisionInput }) =>
            merchantApprovalApi.requestRevision(id, payload),
        onSuccess: (_data, { id }) => {
            invalidateQueue()
            invalidateDetail(id)
        },
    })
}

export function useRejectApplication() {
    const { invalidateQueue, invalidateDetail } = useApprovalInvalidation()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: RejectionInput }) =>
            merchantApprovalApi.rejectApplication(id, payload),
        onSuccess: (_data, { id }) => {
            invalidateQueue()
            invalidateDetail(id)
        },
    })
}

export function useApproveApplication() {
    const { invalidateQueue, invalidateDetail } = useApprovalInvalidation()

    return useMutation({
        mutationFn: (id: string) => merchantApprovalApi.approveApplication(id),
        onSuccess: (_data, id) => {
            invalidateQueue()
            invalidateDetail(id)
        },
    })
}
