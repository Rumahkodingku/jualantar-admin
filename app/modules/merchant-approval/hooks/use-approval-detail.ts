import { useMemo, useState } from "react"

import { toast } from "~/components/ui/toast"
import { ApiError } from "~/lib/api"
import { formatDateTime } from "~/lib/format"
import { useAuthSession, useHasPermission } from "~/modules/auth"

import type { RejectionInput, RevisionInput } from "../schemas/merchant-approval.schemas"
import {
    useApproveApplication,
    useClaimApproval,
    useRejectApplication,
    useReleaseApproval,
    useRequestRevision,
    useReviewComponent,
} from "../services/merchant-approval.mutations"
import {
    collectReviewableSubjects,
    diffSnapshotSubjects,
    findReview,
    subjectKey,
    summarizeReviewProgress,
    type ReviewableSubject,
    type SnapshotSectionKey,
} from "../services/merchant-approval.mappers"
import type { ApprovalDetail, CurrentSnapshot } from "../types/merchant-approval.types"
import type { ApprovalStep, ApprovalStatus } from "../components/detail/approval-timeline"

function errorMessage(error: unknown, fallback: string): string {
    if (error instanceof ApiError) {
        if (error.status === 403) return "Anda tidak memiliki izin untuk melakukan aksi ini."
        if (error.status === 404) return "Data approval tidak ditemukan."
        if (error.status === 409) return error.message || "Aksi tidak dapat dilakukan pada status saat ini."
        if (error.status === 422) return error.message || "Data yang dikirim tidak valid."
        return error.message || fallback
    }
    return fallback
}

export function useApprovalDetail(approval: ApprovalDetail) {
    const { data: session } = useAuthSession()
    const currentUserId = session?.id

    const canClaimPermission = useHasPermission("merchant.approval.claim")
    const canReviewPermission = useHasPermission("merchant.approval.review")
    const canRevisionPermission = useHasPermission("merchant.approval.revision")
    const canRejectPermission = useHasPermission("merchant.approval.reject")
    const canApprovePermission = useHasPermission("merchant.approval.approve")

    const claim = useClaimApproval()
    const release = useReleaseApproval()
    const review = useReviewComponent()
    const revision = useRequestRevision()
    const reject = useRejectApplication()
    const approve = useApproveApplication()

    const [reviewingKey, setReviewingKey] = useState<string | null>(null)
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

    const status = approval.application.status
    const isPending = status === "pending"
    const isInReview = status === "in_review"
    const isAssignedToMe = Boolean(currentUserId && approval.assigned_to === currentUserId)

    const canClaim = canClaimPermission && isPending && !approval.assigned_to
    const canRelease = canClaimPermission && isInReview && isAssignedToMe
    const canReview = canReviewPermission && isInReview && isAssignedToMe
    const canRevision = canRevisionPermission && isInReview && isAssignedToMe
    const canReject = canRejectPermission && isInReview && isAssignedToMe
    const canApprove = canApprovePermission && isInReview && isAssignedToMe

    const subjects = collectReviewableSubjects(approval.current_snapshot?.data ?? null)
    const progress = summarizeReviewProgress(subjects, approval.reviews)
    const unresolvedSubjects = subjects.filter((subject) => {
        const reviewItem = findReview(approval.reviews, subject.subjectType, subject.subjectId)
        return reviewItem?.status !== "verified"
    })

    const snapshots = useMemo<CurrentSnapshot[]>(() => {
        if (approval.snapshots && approval.snapshots.length > 0) return approval.snapshots
        return approval.current_snapshot ? [approval.current_snapshot] : []
    }, [approval])

    const latestSnapshot = snapshots[0] ?? null
    const activeVersion = selectedVersion ?? latestSnapshot?.version ?? null
    const selectedSnapshot = snapshots.find((snapshot) => snapshot.version === activeVersion) ?? latestSnapshot

    const changedSections = useMemo<Set<SnapshotSectionKey>>(() => {
        if (!selectedSnapshot || !latestSnapshot || selectedSnapshot.version === latestSnapshot.version) {
            return new Set()
        }

        return diffSnapshotSubjects(selectedSnapshot.data, latestSnapshot.data)
    }, [selectedSnapshot, latestSnapshot])

    const changedVersions = useMemo<Set<number>>(() => {
        if (!latestSnapshot || snapshots.length <= 1) return new Set()

        const versions = new Set<number>()

        for (const snapshot of snapshots) {
            if (
                snapshot.version !== latestSnapshot.version &&
                diffSnapshotSubjects(snapshot.data, latestSnapshot.data).size > 0
            ) {
                versions.add(snapshot.version)
            }
        }

        return versions
    }, [snapshots, latestSnapshot])

    const timelineSteps = useMemo<ApprovalStep[]>(() => {
        const isRejected = status === "rejected"

        const raw = [
            { title: "Pengajuan", at: approval.application.created_at, done: true },
            { title: "Review Diklaim", at: approval.assigned_at, done: Boolean(approval.assigned_at) },
            { title: "Komponen Direview", at: approval.started_at, done: progress.verified > 0 },
            {
                title: isRejected ? "Pengajuan Ditolak" : "Pengajuan Disetujui",
                at: approval.completed_at,
                done: status === "approved",
            },
        ]

        const activeIndex = raw.findIndex((step) => !step.done)
        return raw.map((step, index) => {
            let stepStatus: ApprovalStatus = step.done ? "completed" : "upcoming"
            if (index === activeIndex) stepStatus = isRejected ? "rejected" : "current"

            return {
                title: step.title,
                date: step.at ? formatDateTime(step.at) : stepStatus === "current" ? "Menunggu" : "—",
                status: stepStatus,
            }
        })
    }, [approval, progress.verified, status])

    const handleClaim = () => {
        claim.mutate(approval.id, {
            onSuccess: () =>
                toast.add({
                    title: "Review diklaim",
                    description: "Anda sekarang menjadi reviewer pengajuan ini.",
                    type: "success",
                }),
            onError: (error) =>
                toast.add({
                    title: "Gagal mengklaim",
                    description: errorMessage(error, "Terjadi kesalahan."),
                    type: "error",
                }),
        })
    }

    const handleRelease = (onClose: () => void) => {
        release.mutate(approval.id, {
            onSuccess: () => {
                onClose()
                toast.add({ title: "Review dilepas", description: "Pengajuan kembali ke antrean.", type: "success" })
            },
            onError: (error) =>
                toast.add({
                    title: "Gagal melepas",
                    description: errorMessage(error, "Terjadi kesalahan."),
                    type: "error",
                }),
        })
    }

    const handleReview = (subject: ReviewableSubject, reviewStatus: "verified" | "rejected", note: string) => {
        const key = subjectKey(subject)
        setReviewingKey(key)
        review.mutate(
            {
                id: approval.id,
                payload: {
                    component: subject.component,
                    subject_type: subject.subjectType,
                    subject_id: subject.subjectId,
                    status: reviewStatus,
                    note: note.trim() || undefined,
                },
            },
            {
                onSuccess: () =>
                    toast.add({
                        title: reviewStatus === "verified" ? "Komponen diverifikasi" : "Komponen ditolak",
                        description: subject.label,
                        type: "success",
                    }),
                onError: (error) =>
                    toast.add({
                        title: "Gagal menyimpan review",
                        description: errorMessage(error, "Terjadi kesalahan."),
                        type: "error",
                    }),
                onSettled: () => setReviewingKey(null),
            }
        )
    }

    const handleRevision = (input: RevisionInput, onClose: () => void) => {
        revision.mutate(
            { id: approval.id, payload: input },
            {
                onSuccess: () => {
                    onClose()
                    toast.add({
                        title: "Revisi diminta",
                        description: "Merchant akan menerima permintaan revisi.",
                        type: "success",
                    })
                },
                onError: (error) =>
                    toast.add({
                        title: "Gagal meminta revisi",
                        description: errorMessage(error, "Terjadi kesalahan."),
                        type: "error",
                    }),
            }
        )
    }

    const handleReject = (input: RejectionInput, onClose: () => void) => {
        reject.mutate(
            { id: approval.id, payload: input },
            {
                onSuccess: () => {
                    onClose()
                    toast.add({
                        title: "Pengajuan ditolak",
                        description: "Status pengajuan menjadi ditolak.",
                        type: "success",
                    })
                },
                onError: (error) =>
                    toast.add({
                        title: "Gagal menolak",
                        description: errorMessage(error, "Terjadi kesalahan."),
                        type: "error",
                    }),
            }
        )
    }

    const handleApprove = (onClose: () => void) => {
        approve.mutate(approval.id, {
            onSuccess: () => {
                onClose()
                toast.add({ title: "Pengajuan disetujui", description: "Merchant telah diaktifkan.", type: "success" })
            },
            onError: (error) =>
                toast.add({
                    title: "Gagal menyetujui",
                    description: errorMessage(error, "Terjadi kesalahan."),
                    type: "error",
                }),
        })
    }

    return {
        currentUserId,
        status,
        isPending,
        isInReview,
        isAssignedToMe,
        canClaim,
        canRelease,
        canReview,
        canRevision,
        canReject,
        canApprove,
        subjects,
        progress,
        unresolvedSubjects,
        getReview: (subject: ReviewableSubject) => findReview(approval.reviews, subject.subjectType, subject.subjectId),
        isSubjectSubmitting: (subject: ReviewableSubject) => review.isPending && reviewingKey === subjectKey(subject),
        snapshots,
        latestSnapshot,
        selectedVersion,
        selectedSnapshot,
        changedSections,
        changedVersions,
        timelineSteps,
        setSelectedVersion,
        actionsPending: claim.isPending || release.isPending || revision.isPending || reject.isPending || approve.isPending,
        claimPending: claim.isPending,
        releasePending: release.isPending,
        revisionPending: revision.isPending,
        rejectPending: reject.isPending,
        approvePending: approve.isPending,
        handleClaim,
        handleRelease,
        handleReview,
        handleRevision,
        handleReject,
        handleApprove,
    }
}