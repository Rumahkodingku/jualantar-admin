import {
    Building2,
    Check,
    FileText,
    Info,
    Landmark,
    Layers,
    MapPin,
    Store,
    Tags,
    User,
    X,
    type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Alert } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { Textarea } from "~/components/ui/textarea"
import {
    REVIEW_COMPONENT_DESCRIPTIONS,
    REVIEW_COMPONENT_EMPTY_STATE,
    REVIEW_COMPONENT_GUIDES,
    REVIEW_COMPONENT_TITLES,
    deriveComponentReviewStatus,
    subjectFields,
    type ReviewableSubject,
} from "../../services/merchant-approval.mappers"
import type {
    ApprovalReview,
    DocumentSubjectData,
    OutletSubjectData,
    PayoutSubjectData,
    ReviewComponent,
} from "../../types/merchant-approval.types"
import { ReviewStatusBadge } from "../shared/status-badge"
import { DetailDocumentPreview } from "./detail-document-preview"
import { DetailFieldGrid, DetailItem } from "./detail-detail-item"
import { DetailOutletCard } from "./detail-outlet-card"
import { DetailPayoutCard } from "./detail-payout-card"

const REVIEW_COMPONENT_ICONS: Record<ReviewComponent, LucideIcon> = {
    business: Store,
    identity: User,
    legal_entity: Building2,
    service: Layers,
    category: Tags,
    outlet: MapPin,
    document: FileText,
    payout: Landmark,
}

function subjectKey(subject: ReviewableSubject): string {
    return `${subject.subjectType}:${subject.subjectId}`
}

interface DetailComponentReviewSectionProps {
    component: ReviewComponent
    subjects: ReviewableSubject[]
    getReview: (subject: ReviewableSubject) => ApprovalReview | undefined
    canReview: boolean
    isSubmitting: (subject: ReviewableSubject) => boolean
    onVerify: (subject: ReviewableSubject, note: string) => void
    onReject: (subject: ReviewableSubject, note: string) => void
}

export function DetailComponentReviewSection({
    component,
    subjects,
    getReview,
    canReview,
    isSubmitting,
    onVerify,
    onReject,
}: DetailComponentReviewSectionProps) {
    const Icon = REVIEW_COMPONENT_ICONS[component]
    const statuses = subjects.map((subject) => getReview(subject)?.status ?? "pending")
    const status = deriveComponentReviewStatus(statuses)
    const reviewed = statuses.filter((reviewStatus) => reviewStatus !== "pending").length

    return (
        <AccordionItem
            value={component}
            className="overflow-hidden rounded-xl border border-border bg-card not-last:border-b"
        >
            <AccordionTrigger className="gap-3 px-4 py-3.5 hover:no-underline">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon aria-hidden="true" className="size-4" />
                </span>

                <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                    <span className="flex w-full min-w-0 flex-wrap items-center gap-2">
                        <Text variant="sm" weight="bold" className="text-foreground">
                            {REVIEW_COMPONENT_TITLES[component]}
                        </Text>

                        {subjects.length > 1 && (
                            <Text variant="xs" className="text-muted-foreground">
                                {reviewed}/{subjects.length} direview
                            </Text>
                        )}
                    </span>

                    <Text variant="xs" weight="normal" className="text-muted-foreground">
                        {REVIEW_COMPONENT_DESCRIPTIONS[component]}
                    </Text>
                </span>

                <ReviewStatusBadge status={status} />
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <Alert variant="info" className="mb-4 gap-x-2">
                    <Info aria-hidden="true" />
                    <Text variant="xs" weight="semibold" className="py-0.5 text-muted-foreground">
                        {REVIEW_COMPONENT_GUIDES[component]}
                    </Text>
                </Alert>

                {subjects.length === 0 ? (
                    <EmptySection component={component} />
                ) : (
                    <div className="flex flex-col gap-4">
                        {subjects.map((subject) => (
                            <SubjectReviewBlock
                                key={subjectKey(subject)}
                                component={component}
                                subject={subject}
                                review={getReview(subject)}
                                showHeader={subjects.length > 1}
                                canReview={canReview}
                                isSubmitting={isSubmitting(subject)}
                                onVerify={(note) => onVerify(subject, note)}
                                onReject={(note) => onReject(subject, note)}
                            />
                        ))}
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}

function EmptySection({ component }: { component: ReviewComponent }) {
    const Icon = REVIEW_COMPONENT_ICONS[component]
    const empty = REVIEW_COMPONENT_EMPTY_STATE[component]

    return (
        <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
            </span>

            <div className="min-w-0">
                <Text variant="sm" weight="medium" className="text-foreground">
                    {empty.title}
                </Text>

                <Text variant="xs" className="mt-0.5 text-muted-foreground">
                    {empty.description}
                </Text>
            </div>
        </div>
    )
}

interface SubjectReviewBlockProps {
    component: ReviewComponent
    subject: ReviewableSubject
    review?: ApprovalReview
    showHeader: boolean
    canReview: boolean
    isSubmitting: boolean
    onVerify: (note: string) => void
    onReject: (note: string) => void
}

function SubjectReviewBlock({
    component,
    subject,
    review,
    showHeader,
    canReview,
    isSubmitting,
    onVerify,
    onReject,
}: SubjectReviewBlockProps) {
    const [note, setNote] = useState(review?.note ?? "")
    const [verifyOpen, setVerifyOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)

    const reviewStatus = review?.status ?? "pending"
    const noteId = `review-note-${subject.subjectId}`

    return (
        <div className="flex flex-col gap-4">
            {showHeader && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Text variant="sm" weight="bold" className="min-w-0 text-foreground">
                        {subject.label}
                    </Text>

                    <ReviewStatusBadge status={reviewStatus} />
                </div>
            )}

            <SubjectDetail subject={subject} />

            {review?.note && (
                <div className="rounded-lg bg-muted/40 p-3">
                    <Text variant="xs" className="text-muted-foreground">
                        Catatan Reviewer
                    </Text>

                    <Text variant="sm" className="mt-0.5 wrap-break-word text-foreground">
                        {review.note}
                    </Text>
                </div>
            )}

            {canReview && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={noteId} className="text-xs font-semibold">
                            Catatan (opsional)
                        </Label>
                        <Textarea
                            id={noteId}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Tambahkan catatan untuk keputusan ini..."
                            maxLength={2000}
                            rows={2}
                            className="min-h-35 rounded-xl"
                        />
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" size="lg" disabled={isSubmitting} onClick={() => setVerifyOpen(true)}>
                            {isSubmitting ? <Spinner aria-hidden="true" /> : <Check aria-hidden="true" />}
                            <Text variant="xs" weight="semibold">
                                Verifikasi Data
                            </Text>
                        </Button>
                        <Button
                            type="button"
                            size="lg"
                            variant="destructive"
                            disabled={isSubmitting}
                            onClick={() => setRejectOpen(true)}
                        >
                            <X aria-hidden="true" />
                            <Text variant="xs" weight="semibold">
                                Tolak Data
                            </Text>
                        </Button>
                    </div>
                </div>
            )}

            <AlertDialog open={verifyOpen} onOpenChange={setVerifyOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Verifikasi komponen ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Komponen “{REVIEW_COMPONENT_TITLES[component]} — {subject.label}” akan ditandai sebagai
                            terverifikasi.
                            {note.trim() && <> Catatan: “{note.trim()}”</>}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setVerifyOpen(false)
                                onVerify(note)
                            }}
                        >
                            Verifikasi
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak komponen ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Komponen “{REVIEW_COMPONENT_TITLES[component]} — {subject.label}” akan ditandai sebagai
                            ditolak. Merchant perlu memperbaiki data ini melalui revisi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                setRejectOpen(false)
                                onReject(note)
                            }}
                        >
                            Tolak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function SubjectDetail({ subject }: { subject: ReviewableSubject }) {
    if (subject.component === "document") {
        return <DetailDocumentPreview document={subject.data as unknown as DocumentSubjectData} />
    }

    if (subject.component === "outlet") {
        return <DetailOutletCard outlet={subject.data as unknown as OutletSubjectData} />
    }

    if (subject.component === "payout") {
        return <DetailPayoutCard account={subject.data as unknown as PayoutSubjectData} />
    }

    if (subject.component === "category") {
        const name = typeof subject.data.name === "string" ? subject.data.name : subject.label
        const slug = typeof subject.data.slug === "string" ? subject.data.slug : undefined

        return (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2">
                <Text variant="sm" weight="medium" className="min-w-0 truncate text-foreground">
                    {String(name)}
                </Text>

                {slug && (
                    <Text variant="xs" className="shrink-0 text-muted-foreground">
                        #{String(slug)}
                    </Text>
                )}
            </div>
        )
    }

    const fields = subjectFields(subject.component, subject.data)

    return (
        <DetailFieldGrid>
            {fields.map((field) => (
                <DetailItem key={field.label} label={field.label} value={field.value} />
            ))}
        </DetailFieldGrid>
    )
}
