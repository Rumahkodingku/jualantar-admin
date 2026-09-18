import { Check, X } from "lucide-react"
import { useState } from "react"

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
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { Textarea } from "~/components/ui/textarea"
import { REVIEW_COMPONENT_TITLES } from "../../services/merchant-approval.labels"
import type { ReviewableSubject } from "../../services/merchant-approval.mappers"
import type { ApprovalReview } from "../../types/merchant-approval.types"
import { ReviewStatusBadge } from "../shared/status-badge"
import { SubjectDetail } from "./subject-detail"

interface SubjectReviewBlockProps {
    component: ReviewableSubject["component"]
    subject: ReviewableSubject
    review?: ApprovalReview
    showHeader: boolean
    canReview: boolean
    isSubmitting: boolean
    onVerify: (note: string) => void
    onReject: (note: string) => void
}

export function SubjectReviewBlock({
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