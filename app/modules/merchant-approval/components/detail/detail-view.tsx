import { Component, Inbox, Info, NotebookPen, Store, Timeline } from "lucide-react"
import { useState, type ReactNode } from "react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "~/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Text } from "~/components/ui/text"
import { PageHeader } from "~/components/page-header"
import { useApprovalDetail } from "../../hooks/use-approval-detail"
import type { ApprovalDetail } from "../../types/merchant-approval.types"
import { ApplicationStatusBadge } from "../shared/status-badge"
import { DetailConfirmDialog } from "./detail-confirm-dialog"
import { DetailMerchantSummary } from "./detail-merchant-summary"
import { DetailRejectionDialog } from "./detail-rejection-dialog"
import { DetailReviewAccordion } from "./detail-review-accordion"
import { DetailRevisionDialog } from "./detail-revision-dialog"
import { DetailRevisionHistory } from "./detail-revision-history"
import { DetailSidebar } from "./detail-sidebar"
import { DetailSnapshotSections } from "./detail-snapshot-sections"
import { DetailSnapshotVersionSwitcher } from "./detail-snapshot-version-switcher"
import { DetailTimeline } from "./detail-timeline"

function DetailTabLayout({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="min-w-0 lg:col-span-7">{children}</div>
            <aside className="min-w-0 lg:col-span-3">{sidebar}</aside>
        </div>
    )
}

export function DetailView({ approval }: { approval: ApprovalDetail }) {
    const {
        currentUserId,
        status,
        canClaim,
        canRelease,
        canReview,
        canRevision,
        canReject,
        canApprove,
        subjects,
        progress,
        unresolvedSubjects,
        getReview,
        isSubjectSubmitting,
        snapshots,
        latestSnapshot,
        selectedSnapshot,
        changedSections,
        changedVersions,
        timelineSteps,
        setSelectedVersion,
        actionsPending,
        releasePending,
        revisionPending,
        rejectPending,
        approvePending,
        handleClaim,
        handleRelease,
        handleReview,
        handleRevision,
        handleReject,
        handleApprove,
    } = useApprovalDetail(approval)

    const [revisionOpen, setRevisionOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [releaseOpen, setReleaseOpen] = useState(false)

    const sidebar = (
        <DetailSidebar
            approval={approval}
            subjects={subjects}
            currentUserId={currentUserId}
            canClaim={canClaim}
            canRelease={canRelease}
            canRevision={canRevision}
            canReject={canReject}
            canApprove={canApprove}
            isSubmitting={actionsPending}
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

            <DetailMerchantSummary approval={approval} currentUserId={currentUserId} timelineSteps={timelineSteps} />

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
                            <DetailReviewAccordion
                                subjects={subjects}
                                getReview={getReview}
                                canReview={canReview}
                                isSubmitting={isSubjectSubmitting}
                                onVerify={(subject, note) => handleReview(subject, "verified", note)}
                                onReject={(subject, note) => handleReview(subject, "rejected", note)}
                            />
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
                isSubmitting={revisionPending}
                onConfirm={(input) => handleRevision(input, () => setRevisionOpen(false))}
            />

            <DetailRejectionDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                isSubmitting={rejectPending}
                onConfirm={(input) => handleReject(input, () => setRejectOpen(false))}
            />

            <DetailConfirmDialog
                open={releaseOpen}
                onOpenChange={setReleaseOpen}
                title="Lepas review ini?"
                description="Pengajuan akan kembali ke antrean dan tidak lagi ditugaskan kepada Anda."
                confirmLabel="Lepas Review"
                isSubmitting={releasePending}
                onConfirm={() => handleRelease(() => setReleaseOpen(false))}
            />

            <DetailConfirmDialog
                open={approveOpen}
                onOpenChange={setApproveOpen}
                title="Setujui pengajuan ini?"
                description="Merchant akan diaktifkan dan pengajuan menjadi final."
                confirmLabel="Setujui"
                isSubmitting={approvePending}
                onConfirm={() => handleApprove(() => setApproveOpen(false))}
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