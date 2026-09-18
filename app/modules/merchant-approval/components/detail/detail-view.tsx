import { Component, Copy, Image, Inbox, Info, MapPin, NotebookPen, Store, StoreIcon, Timeline } from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"

import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "~/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Text } from "~/components/ui/text"
import { toast } from "~/components/ui/toast"
import { ApiError } from "~/lib/api"
import { useAuthSession, useHasPermission } from "~/modules/auth"
import type { RejectionInput, RevisionInput } from "../../schemas/merchant-approval.schemas"
import {
    collectReviewableSubjects,
    diffSnapshotSubjects,
    findReview,
    summarizeReviewProgress,
    type ReviewableSubject,
    type SnapshotSectionKey,
} from "../../services/merchant-approval.mappers"
import {
    useApproveApplication,
    useClaimApproval,
    useRejectApplication,
    useReleaseApproval,
    useRequestRevision,
    useReviewComponent,
} from "../../services/merchant-approval.mutations"
import type { ApprovalDetail, CurrentSnapshot } from "../../types/merchant-approval.types"
import { MerchantLogo, MerchantTypeBadge, ServiceBadge } from "../shared/merchant"
import { Reviewer } from "../shared/reviewer"
import { ApplicationStatusBadge } from "../shared/status-badge"
import { DetailConfirmDialog } from "./detail-confirm-dialog"
import { DetailTimeline } from "./detail-timeline"
import { DetailComponentReviewCard } from "./detail-component-review-card"
import { DetailRejectionDialog } from "./detail-rejection-dialog"
import { DetailRevisionDialog } from "./detail-revision-dialog"
import { DetailRevisionHistory } from "./detail-revision-history"
import { DetailSnapshotSections } from "./detail-snapshot-sections"
import { DetailSnapshotVersionSwitcher } from "./detail-snapshot-version-switcher"
import { formatDateTime, formatRelativeDate } from "~/lib/format"
import { PageHeader } from "~/components/page-header"
import { ApprovalTimeline, type ApprovalStatus, type ApprovalStep } from "./approval-timeline"
import { DetailSidebar } from "./detail-sidebar"

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

function DetailTabLayout({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="min-w-0 lg:col-span-7">{children}</div>
            <aside className="min-w-0 lg:col-span-3">{sidebar}</aside>
        </div>
    )
}

export function DetailView({ approval }: { approval: ApprovalDetail }) {
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

    const merchantLogo = approval.current_snapshot?.data.subjects.merchant?.data.logo_url ?? approval.merchant.logo
    const merchantType = approval.current_snapshot?.data.merchant_type ?? approval.merchant.type
    const merchantDescription = approval.current_snapshot?.data.subjects.merchant?.data.description ?? null
    const merchantAddress =
        approval.current_snapshot?.data.subjects.merchant_outlet[0]?.data.address ??
        approval.current_snapshot?.data.subjects.legal_entity?.data.address ??
        null
    const merchantPhoto = approval.current_snapshot?.data.subjects.merchant_outlet[0]?.data.photos_url?.[0] ?? null

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

    const serviceName =
        approval.current_snapshot?.data?.subjects?.service?.data?.name ?? approval.merchant.service?.name ?? null

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

    const handleViewPhoto = () => {
        if (merchantPhoto) window.open(merchantPhoto, "_blank", "noopener,noreferrer")
    }

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

    const sidebar = (
        <DetailSidebar
            approval={approval}
            subjects={subjects}
            timelineSteps={timelineSteps}
            currentUserId={currentUserId}
            canClaim={canClaim}
            canRelease={canRelease}
            canRevision={canRevision}
            canReject={canReject}
            canApprove={canApprove}
            isSubmitting={
                claim.isPending || release.isPending || revision.isPending || reject.isPending || approve.isPending
            }
            onClaim={handleClaim}
            onOpenRelease={() => setReleaseOpen(true)}
            onOpenRevision={() => setRevisionOpen(true)}
            onOpenReject={() => setRejectOpen(true)}
            onOpenApprove={() => setApproveOpen(true)}
        />
    )

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <div className="flex items-end justify-between">
                <PageHeader
                    isBack
                    title="Detail Pengajuan Merchant"
                    description="Lihat detail informasi, dokumen, dan lakukan proses verifikasi pengajuan merchant"
                    breadcrumbs={[
                        { label: "Home", to: "/dashboard" },
                        { label: "Merchant Approvals", to: "/merchant-approvals" },
                        { label: "Approval" },
                        { label: approval.application.application_number || "Detail" },
                    ]}
                />

                <ApplicationStatusBadge status={status} />
            </div>

            {/* Section Summary */}
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {/* Top Section */}
                    <div className="px-6">
                        {merchantLogo ? (
                            <MerchantLogo
                                logo={merchantLogo}
                                name={approval.merchant.business_name}
                                className="size-14 shrink-0 rounded-xl text-sm"
                            />
                        ) : (
                            <div className="mb-2 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                                <StoreIcon />
                            </div>
                        )}

                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                            {/* Merchant Information */}
                            <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        {/* Name + Status */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Text
                                                as="h1"
                                                variant="xl"
                                                weight="bold"
                                                className="truncate text-foreground"
                                            >
                                                {approval.merchant.business_name}
                                            </Text>
                                        </div>

                                        {/* Slug + Merchant Type + Service */}
                                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                            <Text variant="xs" className="font-mono text-muted-foreground">
                                                {approval.merchant.slug}
                                            </Text>

                                            <span className="text-muted-foreground/40">-</span>

                                            <MerchantTypeBadge type={merchantType} />

                                            <span className="text-muted-foreground/40">-</span>

                                            <ServiceBadge name={serviceName} />
                                        </div>

                                        {/* Merchant Description / Address */}
                                        <div className="mt-2 space-y-1">
                                            {merchantDescription && (
                                                <Text variant="xs" className="text-muted-foreground">
                                                    {merchantDescription}
                                                </Text>
                                            )}

                                            {merchantAddress && (
                                                <div className="mt-6 flex items-center gap-1.5">
                                                    <MapPin
                                                        aria-hidden="true"
                                                        className="size-3.5 shrink-0 text-muted-foreground"
                                                    />

                                                    <Text variant="xs" className="truncate text-muted-foreground">
                                                        {merchantAddress}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>

                                        {/* Application Metadata */}
                                        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
                                            {/* Application Number */}
                                            <div className="min-w-0">
                                                <Text variant="xs" className="text-muted-foreground">
                                                    No. Pengajuan
                                                </Text>

                                                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                                                    {/* <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                                                        <Hash
                                                            aria-hidden="true"
                                                            className="size-3.5 text-muted-foreground"
                                                        />
                                                    </div> */}

                                                    <Text
                                                        variant="xs"
                                                        weight="semibold"
                                                        className="truncate text-foreground"
                                                    >
                                                        {approval.application.application_number}
                                                    </Text>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        className="size-5 shrink-0"
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(
                                                                approval.application.application_number
                                                            )
                                                        }
                                                        aria-label="Salin nomor pengajuan"
                                                    >
                                                        <Copy aria-hidden="true" className="size-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Service */}
                                            <div className="min-w-0">
                                                <Text variant="xs" className="text-muted-foreground">
                                                    Layanan
                                                </Text>

                                                <div className="mt-1 flex items-center gap-2">
                                                    {/* <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                                                        <Utensils
                                                            aria-hidden="true"
                                                            className="size-3.5 text-muted-foreground"
                                                        />
                                                    </div> */}

                                                    <Text
                                                        variant="xs"
                                                        weight="semibold"
                                                        className="truncate text-foreground"
                                                    >
                                                        {serviceName}
                                                    </Text>
                                                </div>
                                            </div>

                                            {/* Application Date */}
                                            <div className="min-w-0">
                                                <Text variant="xs" className="text-muted-foreground">
                                                    Tanggal Pengajuan
                                                </Text>

                                                <div className="mt-1 flex items-start gap-2">
                                                    {/* <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                                                        <Calendar
                                                            aria-hidden="true"
                                                            className="size-3.5 text-muted-foreground"
                                                        />
                                                    </div> */}

                                                    <div className="flex min-w-0 flex-col">
                                                        <Text
                                                            variant="xs"
                                                            weight="semibold"
                                                            className="truncate text-foreground"
                                                        >
                                                            {formatDateTime(approval.application.created_at)}
                                                        </Text>

                                                        <Text
                                                            variant="xs"
                                                            className="mt-1 text-muted-foreground italic"
                                                        >
                                                            {formatRelativeDate(approval.application.created_at)}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reviewer */}
                                            <div className="min-w-0">
                                                <Text variant="xs" className="text-muted-foreground">
                                                    Reviewer
                                                </Text>

                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="min-w-0">
                                                        <div className="truncate">
                                                            <Reviewer
                                                                assignedTo={approval.assigned_to}
                                                                currentUserId={currentUserId}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Merchant Photo */}
                            <div className="relative w-full shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted sm:h-44 xl:w-72">
                                {merchantPhoto ? (
                                    <img
                                        src={merchantPhoto}
                                        alt={`Foto ${approval.merchant.business_name}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted-foreground">
                                        Tidak ada foto
                                    </div>
                                )}

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute right-2.5 bottom-2.5 gap-1.5 bg-background/95 shadow-sm backdrop-blur-sm hover:bg-background"
                                    onClick={handleViewPhoto}
                                >
                                    <Image aria-hidden="true" className="size-3.5" />
                                    Lihat Foto
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Approval Timeline */}
                    <div className="mt-6 px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                            <ApprovalTimeline steps={timelineSteps} label="Status pengajuan" className="w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tab Bar */}
            <Tabs defaultValue="data" className="min-w-0">
                <TabsList variant="line" className="mb-6">
                    <TabsTrigger
                        value="data"
                        className="shrink-0 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary"
                    >
                        <Store />
                        <Text variant="xs" weight="semibold">
                            Data Merchant
                        </Text>
                    </TabsTrigger>
                    <TabsTrigger
                        value="review"
                        className="shrink-0 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary"
                    >
                        <Component />
                        <Text variant="xs" weight="semibold">
                            Review Komponen
                        </Text>
                    </TabsTrigger>
                    <TabsTrigger
                        value="revisions"
                        className="shrink-0 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary"
                    >
                        <NotebookPen />
                        <Text variant="xs" weight="semibold">
                            Riwayat Revisi
                        </Text>
                    </TabsTrigger>
                    <TabsTrigger
                        value="timeline"
                        className="shrink-0 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary"
                    >
                        <Timeline />
                        <Text variant="xs" weight="semibold">
                            Timeline
                        </Text>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="data">
                    <DetailTabLayout sidebar={sidebar}>
                        {selectedSnapshot ? (
                            <div className="flex flex-col gap-4">
                                {snapshots.length > 1 && (
                                    <DetailSnapshotVersionSwitcher
                                        snapshots={snapshots}
                                        selectedVersion={selectedSnapshot.version}
                                        changedVersions={changedVersions}
                                        onSelect={setSelectedVersion}
                                    />
                                )}

                                {selectedSnapshot.version !== latestSnapshot?.version && (
                                    <div className="flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2">
                                        <Info
                                            aria-hidden="true"
                                            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                        />
                                        <Text variant="xs" className="text-muted-foreground">
                                            Anda sedang melihat versi {selectedSnapshot.version}. Status review mengacu
                                            pada versi terbaru (V{latestSnapshot?.version}).
                                        </Text>
                                    </div>
                                )}

                                <DetailSnapshotSections snapshot={selectedSnapshot.data} changed={changedSections} />
                            </div>
                        ) : (
                            <Empty className="border">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Inbox aria-hidden="true" />
                                    </EmptyMedia>

                                    <EmptyTitle>Data merchant tidak tersedia</EmptyTitle>

                                    <EmptyDescription>
                                        Pengajuan ini belum memiliki snapshot data merchant yang dapat ditampilkan.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </DetailTabLayout>
                </TabsContent>

                <TabsContent value="review">
                    <DetailTabLayout sidebar={sidebar}>
                        {subjects.length > 0 ? (
                            <div className="grid gap-4 xl:grid-cols-2">
                                {subjects.map((subject) => (
                                    <DetailComponentReviewCard
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
                    </DetailTabLayout>
                </TabsContent>

                <TabsContent value="revisions">
                    <DetailTabLayout sidebar={sidebar}>
                        <DetailRevisionHistory revisions={approval.revisions} currentUserId={currentUserId} />
                    </DetailTabLayout>
                </TabsContent>

                <TabsContent value="timeline">
                    <DetailTabLayout sidebar={sidebar}>
                        <DetailTimeline events={approval.events} currentUserId={currentUserId} />
                    </DetailTabLayout>
                </TabsContent>
            </Tabs>

            <DetailRevisionDialog
                open={revisionOpen}
                onOpenChange={setRevisionOpen}
                subjects={subjects}
                reviews={approval.reviews}
                isSubmitting={revision.isPending}
                onConfirm={handleRevision}
            />

            <DetailRejectionDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                isSubmitting={reject.isPending}
                onConfirm={handleReject}
            />

            <DetailConfirmDialog
                open={releaseOpen}
                onOpenChange={setReleaseOpen}
                title="Lepas review ini?"
                description="Pengajuan akan kembali ke antrean dan tidak lagi ditugaskan kepada Anda."
                confirmLabel="Lepas Review"
                isSubmitting={release.isPending}
                onConfirm={handleRelease}
            />

            <DetailConfirmDialog
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
                        <Text variant="sm" className="text-foreground">
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
            </DetailConfirmDialog>
        </div>
    )
}
