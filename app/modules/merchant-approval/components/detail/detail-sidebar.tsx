import { Check, ClipboardCheck, PencilLine, Undo2, X } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Empty, EmptyTitle } from "~/components/ui/empty"
import { Progress } from "~/components/ui/progress"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { formatDateTime } from "~/lib/format"
import { cn } from "~/lib/utils"
import {
    findReview,
    REVIEW_COMPONENT_LABELS,
    summarizeReviewProgress,
    type ReviewableSubject,
} from "../../services/merchant-approval.mappers"
import type { ApprovalDetail, ReviewComponent } from "../../types/merchant-approval.types"
import { Reviewer } from "../shared/reviewer"
import { ApplicationStatusBadge, ReviewStatusBadge } from "../shared/status-badge"
import type { ApprovalStep } from "./approval-timeline"

interface DetailSidebarProps {
    approval: ApprovalDetail
    subjects: ReviewableSubject[]
    timelineSteps: ApprovalStep[]
    currentUserId?: string
    canClaim: boolean
    canRelease: boolean
    canRevision: boolean
    canReject: boolean
    canApprove: boolean
    isSubmitting: boolean
    onClaim: () => void
    onOpenRelease: () => void
    onOpenRevision: () => void
    onOpenReject: () => void
    onOpenApprove: () => void
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card size="sm" className="min-w-0">
            <CardHeader className="border-b">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">{children}</CardContent>
        </Card>
    )
}

export function DetailSidebar({
    approval,
    subjects,
    timelineSteps,
    currentUserId,
    canClaim,
    canRelease,
    canRevision,
    canReject,
    canApprove,
    isSubmitting,
    onClaim,
    onOpenRelease,
    onOpenRevision,
    onOpenReject,
    onOpenApprove,
}: DetailSidebarProps) {
    const progress = summarizeReviewProgress(subjects, approval.reviews)

    const componentGroups = new Map<ReviewComponent, ReviewableSubject[]>()

    for (const subject of subjects) {
        const list = componentGroups.get(subject.component) ?? []
        list.push(subject)
        componentGroups.set(subject.component, list)
    }

    const componentRows = [...componentGroups.entries()].map(([component, componentSubjects]) => {
        let verified = 0
        let rejected = 0

        for (const subject of componentSubjects) {
            const review = findReview(approval.reviews, subject.subjectType, subject.subjectId)
            if (review?.status === "verified") verified += 1
            else if (review?.status === "rejected") rejected += 1
        }

        const total = componentSubjects.length

        return {
            component,
            label: REVIEW_COMPONENT_LABELS[component],
            total,
            verified,
            rejected,
            pending: total - verified - rejected,
        }
    })

    const notes = approval.reviews
        .filter((review) => review.note && review.note.trim() !== "")
        .map((review) => {
            const subject = subjects.find(
                (item) => item.subjectType === review.subject_type && item.subjectId === review.subject_id
            )
            return {
                key: review.id,
                component: review.component,
                label: subject?.label ?? REVIEW_COMPONENT_LABELS[review.component] ?? review.component,
                note: review.note as string,
                status: review.status,
            }
        })

    const progressPercent = progress.total > 0 ? Math.round((progress.verified / progress.total) * 100) : 0

    return (
        <div className="space-y-4 lg:sticky lg:top-4">
            {/* Status & Actions */}
            <SidebarCard title="Status & Actions">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <Text variant="xs" className="text-muted-foreground">
                            Status Pengajuan
                        </Text>
                        <ApplicationStatusBadge status={approval.application.status} />
                    </div>

                    {(canClaim || canRelease || canRevision || canReject || canApprove) && (
                        <div className="flex flex-col gap-2">
                            {canClaim && (
                                <Button onClick={onClaim} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Spinner aria-hidden="true" />
                                    ) : (
                                        <ClipboardCheck aria-hidden="true" />
                                    )}
                                    Klaim Review
                                </Button>
                            )}
                            {canRelease && (
                                <Button variant="outline" onClick={onOpenRelease} disabled={isSubmitting}>
                                    <Undo2 aria-hidden="true" />
                                    Lepas Review
                                </Button>
                            )}
                            {canRevision && (
                                <Button variant="outline" onClick={onOpenRevision} disabled={isSubmitting}>
                                    <PencilLine aria-hidden="true" />
                                    Minta Revisi
                                </Button>
                            )}
                            {canReject && (
                                <Button variant="destructive" onClick={onOpenReject} disabled={isSubmitting}>
                                    <X aria-hidden="true" />
                                    Tolak
                                </Button>
                            )}
                            {canApprove && (
                                <Button onClick={onOpenApprove} disabled={isSubmitting}>
                                    <Check aria-hidden="true" />
                                    Setujui
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </SidebarCard>

            {/* Informasi Reviewer */}
            <SidebarCard title="Informasi Reviewer">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <Text variant="xs" className="text-muted-foreground">
                            Reviewer
                        </Text>
                        <Reviewer assignedTo={approval.assigned_to} currentUserId={currentUserId} />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <Text variant="xs" className="text-muted-foreground">
                            Ditugaskan
                        </Text>
                        <Text variant="xs" weight="semibold" className="text-foreground">
                            {approval.assigned_at ? formatDateTime(approval.assigned_at) : "—"}
                        </Text>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <Text variant="xs" className="text-muted-foreground">
                            Mulai Review
                        </Text>
                        <Text variant="xs" weight="semibold" className="text-foreground">
                            {approval.started_at ? formatDateTime(approval.started_at) : "—"}
                        </Text>
                    </div>
                </div>
            </SidebarCard>

            {/* Ringkasan Komponen */}
            <SidebarCard title="Ringkasan Komponen">
                {subjects.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <Text variant="xs" className="text-muted-foreground">
                                    Progress Review
                                </Text>
                                <Text variant="xs" weight="semibold" className="text-foreground tabular-nums">
                                    {progress.verified} / {progress.total} terverifikasi
                                </Text>
                            </div>
                            <Progress value={progressPercent} className="mt-2" />
                        </div>

                        <ul className="flex flex-col gap-2">
                            {componentRows.map((row) => (
                                <li
                                    key={row.component}
                                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
                                >
                                    <Text variant="xs" weight="medium" className="min-w-0 truncate text-foreground">
                                        {row.label}
                                    </Text>
                                    <span className="flex shrink-0 items-center gap-1.5">
                                        {row.verified > 0 && (
                                            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[11px] leading-4 font-semibold text-emerald-700 dark:text-emerald-400">
                                                {row.verified} ✓
                                            </span>
                                        )}
                                        {row.rejected > 0 && (
                                            <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[11px] leading-4 font-semibold text-red-700 dark:text-red-400">
                                                {row.rejected} ✗
                                            </span>
                                        )}
                                        {row.pending > 0 && (
                                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-4 font-semibold text-muted-foreground">
                                                {row.pending} belum
                                            </span>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <Empty className="border">
                        <EmptyTitle>Belum ada komponen</EmptyTitle>
                    </Empty>
                )}
            </SidebarCard>

            {/* Catatan Reviewer */}
            <SidebarCard title="Catatan Reviewer">
                <div className="flex flex-col gap-3">
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

                    {notes.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                            {notes.map((note) => (
                                <li key={note.key} className="rounded-lg border border-border p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <Text variant="xs" weight="medium" className="min-w-0 truncate text-foreground">
                                            {note.label}
                                        </Text>
                                        <ReviewStatusBadge status={note.status} />
                                    </div>
                                    <Text variant="xs" className="mt-1 text-muted-foreground">
                                        {note.note}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !approval.decision_reason && (
                            <Text variant="sm" className="text-muted-foreground">
                                Belum ada catatan.
                            </Text>
                        )
                    )}
                </div>
            </SidebarCard>

            {/* Timeline Approval */}
            <SidebarCard title="Timeline Approval">
                <ol className="flex flex-col">
                    {timelineSteps.map((step, index) => (
                        <li key={`${step.title}-${index}`} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                                        step.status === "completed" && "border-emerald-500 bg-emerald-500 text-white",
                                        step.status === "current" &&
                                            "border-emerald-500 bg-background ring-4 ring-emerald-500/15",
                                        step.status === "rejected" && "border-rose-500 bg-rose-500 text-white",
                                        step.status === "upcoming" && "border-dashed border-muted-foreground/30"
                                    )}
                                >
                                    {step.status === "completed" && <Check aria-hidden="true" className="size-3.5" />}
                                    {step.status === "rejected" && <X aria-hidden="true" className="size-3.5" />}
                                    {step.status === "current" && (
                                        <span className="size-2 rounded-full bg-emerald-500" />
                                    )}
                                    {step.status === "upcoming" && (
                                        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                                    )}
                                </span>
                                {index < timelineSteps.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                            </div>
                            <div className={cn("min-w-0", index < timelineSteps.length - 1 && "pb-4")}>
                                <Text
                                    variant="sm"
                                    weight="medium"
                                    className={cn(
                                        step.status === "completed" && "text-emerald-700 dark:text-emerald-400",
                                        step.status === "current" && "text-foreground",
                                        step.status === "rejected" && "text-rose-600 dark:text-rose-400",
                                        step.status === "upcoming" && "text-muted-foreground"
                                    )}
                                >
                                    {step.title}
                                </Text>
                                <Text variant="xs" className="mt-0.5 text-muted-foreground">
                                    {step.date}
                                </Text>
                            </div>
                        </li>
                    ))}
                </ol>
            </SidebarCard>
        </div>
    )
}
