import { Check, ClipboardCheck, PencilLine, Undo2, X } from "lucide-react"
import { useState } from "react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { Spinner } from "~/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Text } from "~/components/ui/text"
import { toast } from "~/components/ui/toast"
import { ApiError } from "~/lib/api"
import { cn } from "~/lib/utils"
import { useAuthSession, useHasPermission } from "~/modules/auth"
import type { RejectionInput, RevisionInput } from "../schemas/merchant-approval.schemas"
import {
    collectReviewableSubjects,
    findReview,
    summarizeReviewProgress,
    type ReviewableSubject,
} from "../services/merchant-approval.mappers"
import {
    useApproveApplication,
    useClaimApproval,
    useRejectApplication,
    useReleaseApproval,
    useRequestRevision,
    useReviewComponent,
} from "../services/merchant-approval.mutations"
import type { ApprovalDetail } from "../types/merchant-approval.types"
import { MerchantLogo, MerchantTypeBadge, ServiceBadge } from "./approval-merchant"
import { ApprovalReviewer } from "./approval-reviewer"
import { ApplicationStatusBadge } from "./approval-status-badge"
import { ApprovalConfirmDialog } from "./approval-confirm-dialog"
import { ApprovalTimeline } from "./approval-timeline"
import { ComponentReviewCard } from "./component-review-card"
import { RejectionDialog } from "./rejection-dialog"
import { RevisionDialog } from "./revision-dialog"
import { RevisionHistory } from "./revision-history"
import { SnapshotSections } from "./snapshot-sections"

function subjectKey(subject: ReviewableSubject): string {
    return `${subject.subjectType}:${subject.subjectId}`
}

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

function ProgressChip({ label, className, dot }: { label: string; className: string; dot: string }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                className
            )}
        >
            <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden="true" />
            {label}
        </span>
    )
}

export function ApprovalDetailView({ approval }: { approval: ApprovalDetail }) {
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

    const [revisionOpen, setRevisionOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [releaseOpen, setReleaseOpen] = useState(false)
    const [reviewingKey, setReviewingKey] = useState<string | null>(null)

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
    const progressPercent = progress.total > 0 ? Math.round((progress.verified / progress.total) * 100) : 0
    const unresolvedSubjects = subjects.filter((subject) => {
        const reviewItem = findReview(approval.reviews, subject.subjectType, subject.subjectId)
        return reviewItem?.status !== "verified"
    })

    const merchantLogo = approval.current_snapshot?.data.subjects.merchant?.data.logo_url ?? approval.merchant.logo
    const merchantType = approval.current_snapshot?.data.merchant_type ?? approval.merchant.type

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

    const handleRelease = () => {
        release.mutate(approval.id, {
            onSuccess: () => {
                setReleaseOpen(false)
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

    const handleRevision = (input: RevisionInput) => {
        revision.mutate(
            { id: approval.id, payload: input },
            {
                onSuccess: () => {
                    setRevisionOpen(false)
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

    const handleReject = (input: RejectionInput) => {
        reject.mutate(
            { id: approval.id, payload: input },
            {
                onSuccess: () => {
                    setRejectOpen(false)
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

    const handleApprove = () => {
        approve.mutate(approval.id, {
            onSuccess: () => {
                setApproveOpen(false)
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

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <Card className="min-w-0 overflow-hidden">
                <CardHeader className="gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <MerchantLogo
                                logo={merchantLogo}
                                name={approval.merchant.business_name}
                                className="size-12 rounded-xl text-sm"
                            />
                            <div className="min-w-0">
                                <Text as="h1" variant="xl" weight="bold" truncate className="text-foreground">
                                    {approval.merchant.business_name}
                                </Text>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <Text variant="xs" className="font-mono text-muted-foreground">
                                        {approval.merchant.slug}
                                    </Text>
                                    <MerchantTypeBadge type={merchantType} />
                                    <ServiceBadge name={approval.merchant.service?.name} />
                                </div>
                            </div>
                        </div>
                        <ApplicationStatusBadge status={status} />
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                            <Text variant="xs" className="text-muted-foreground">
                                No. Pengajuan
                            </Text>
                            <Text variant="sm" weight="medium" className="mt-0.5 font-mono text-foreground">
                                {approval.application.application_number}
                            </Text>
                        </div>
                        <div className="min-w-0">
                            <Text variant="xs" className="text-muted-foreground">
                                Reviewer
                            </Text>
                            <div className="mt-1">
                                <ApprovalReviewer assignedTo={approval.assigned_to} currentUserId={currentUserId} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <Text variant="xs" weight="medium" className="text-muted-foreground">
                                Progress Review
                            </Text>
                            <Text variant="xs" weight="semibold" className="text-foreground tabular-nums">
                                {progress.verified} / {progress.total} terverifikasi
                            </Text>
                        </div>
                        <Progress value={progressPercent} className="mt-2" />
                        <div className="mt-3 flex flex-wrap gap-2">
                            <ProgressChip
                                label={`${progress.verified} terverifikasi`}
                                className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                dot="bg-emerald-500"
                            />
                            <ProgressChip
                                label={`${progress.rejected} ditolak`}
                                className="bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                                dot="bg-red-500"
                            />
                            <ProgressChip
                                label={`${progress.pending} belum`}
                                className="bg-muted text-muted-foreground"
                                dot="bg-muted-foreground/70"
                            />
                        </div>
                    </div>

                    {approval.decision_reason && (
                        <div className="rounded-lg bg-muted/40 p-3">
                            <Text variant="xs" className="text-muted-foreground">
                                Alasan keputusan
                            </Text>
                            <Text variant="sm" className="mt-0.5 text-foreground">
                                {approval.decision_reason}
                            </Text>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {canClaim && (
                            <Button onClick={handleClaim} disabled={claim.isPending}>
                                {claim.isPending ? (
                                    <Spinner aria-hidden="true" />
                                ) : (
                                    <ClipboardCheck aria-hidden="true" />
                                )}
                                Klaim Review
                            </Button>
                        )}
                        {canRelease && (
                            <Button variant="outline" onClick={() => setReleaseOpen(true)}>
                                <Undo2 aria-hidden="true" />
                                Lepas Review
                            </Button>
                        )}
                        {canRevision && (
                            <Button variant="outline" onClick={() => setRevisionOpen(true)}>
                                <PencilLine aria-hidden="true" />
                                Minta Revisi
                            </Button>
                        )}
                        {canReject && (
                            <Button variant="destructive" onClick={() => setRejectOpen(true)}>
                                <X aria-hidden="true" />
                                Tolak
                            </Button>
                        )}
                        {canApprove && (
                            <Button onClick={() => setApproveOpen(true)}>
                                <Check aria-hidden="true" />
                                Setujui
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="data" className="min-w-0">
                <TabsList variant="line" className="mb-4 w-full max-w-full justify-start overflow-x-auto pb-1.5">
                    <TabsTrigger value="data" className="shrink-0">
                        Data Merchant
                    </TabsTrigger>
                    <TabsTrigger value="review" className="shrink-0">
                        Review Komponen
                    </TabsTrigger>
                    <TabsTrigger value="revisions" className="shrink-0">
                        Riwayat Revisi
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="shrink-0">
                        Timeline
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="data">
                    {approval.current_snapshot ? (
                        <SnapshotSections snapshot={approval.current_snapshot.data} />
                    ) : (
                        <Text variant="sm" className="text-muted-foreground">
                            Snapshot pengajuan tidak tersedia.
                        </Text>
                    )}
                </TabsContent>

                <TabsContent value="review">
                    {subjects.length > 0 ? (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {subjects.map((subject) => (
                                <ComponentReviewCard
                                    key={subjectKey(subject)}
                                    subject={subject}
                                    review={findReview(approval.reviews, subject.subjectType, subject.subjectId)}
                                    canReview={canReview}
                                    isSubmitting={review.isPending && reviewingKey === subjectKey(subject)}
                                    onVerify={(note) => handleReview(subject, "verified", note)}
                                    onReject={(note) => handleReview(subject, "rejected", note)}
                                />
                            ))}
                        </div>
                    ) : (
                        <Text variant="sm" className="text-muted-foreground">
                            Tidak ada komponen untuk direview.
                        </Text>
                    )}
                </TabsContent>

                <TabsContent value="revisions">
                    <RevisionHistory revisions={approval.revisions} currentUserId={currentUserId} />
                </TabsContent>

                <TabsContent value="timeline">
                    <ApprovalTimeline events={approval.events} currentUserId={currentUserId} />
                </TabsContent>
            </Tabs>

            <RevisionDialog
                open={revisionOpen}
                onOpenChange={setRevisionOpen}
                subjects={subjects}
                reviews={approval.reviews}
                isSubmitting={revision.isPending}
                onConfirm={handleRevision}
            />

            <RejectionDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                isSubmitting={reject.isPending}
                onConfirm={handleReject}
            />

            <ApprovalConfirmDialog
                open={releaseOpen}
                onOpenChange={setReleaseOpen}
                title="Lepas review ini?"
                description="Pengajuan akan kembali ke antrean dan tidak lagi ditugaskan kepada Anda."
                confirmLabel="Lepas Review"
                isSubmitting={release.isPending}
                onConfirm={handleRelease}
            />

            <ApprovalConfirmDialog
                open={approveOpen}
                onOpenChange={setApproveOpen}
                title="Setujui pengajuan ini?"
                description="Merchant akan diaktifkan dan pengajuan menjadi final."
                confirmLabel="Setujui"
                isSubmitting={approve.isPending}
                onConfirm={handleApprove}
            >
                <div className="flex flex-col gap-3 rounded-lg bg-muted/40 p-3">
                    <div>
                        <Text variant="xs" className="text-muted-foreground">
                            Merchant
                        </Text>
                        <Text variant="sm" weight="medium" className="text-foreground">
                            {approval.merchant.business_name}
                        </Text>
                    </div>
                    <div>
                        <Text variant="xs" className="text-muted-foreground">
                            No. Pengajuan
                        </Text>
                        <Text variant="sm" className="font-mono text-foreground">
                            {approval.application.application_number}
                        </Text>
                    </div>
                    <div>
                        <Text variant="xs" className="text-muted-foreground">
                            Ringkasan Review
                        </Text>
                        <Text variant="sm" className="text-foreground">
                            {progress.verified} terverifikasi · {progress.rejected} ditolak · {progress.pending} belum
                        </Text>
                    </div>
                    {unresolvedSubjects.length > 0 && (
                        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5">
                            <Text variant="xs" weight="medium" className="text-amber-700 dark:text-amber-400">
                                {unresolvedSubjects.length} komponen belum terverifikasi. Backend dapat menolak
                                persetujuan.
                            </Text>
                        </div>
                    )}
                </div>
            </ApprovalConfirmDialog>
        </div>
    )
}
