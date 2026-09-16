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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { Textarea } from "~/components/ui/textarea"
import { REVIEW_COMPONENT_LABELS, subjectFields, type ReviewableSubject } from "../services/merchant-approval.mappers"
import type { ApprovalReview, DocumentSubjectData } from "../types/merchant-approval.types"
import { ReviewStatusBadge } from "./approval-status-badge"
import { DocumentPreview } from "./document-preview"

interface ComponentReviewCardProps {
    subject: ReviewableSubject
    review?: ApprovalReview
    canReview: boolean
    isSubmitting: boolean
    onVerify: (note: string) => void
    onReject: (note: string) => void
}

export function ComponentReviewCard({
    subject,
    review,
    canReview,
    isSubmitting,
    onVerify,
    onReject,
}: ComponentReviewCardProps) {
    const [note, setNote] = useState(review?.note ?? "")
    const [confirmOpen, setConfirmOpen] = useState(false)

    const fields = subjectFields(subject.component, subject.data)
    const isDocument = subject.component === "document"

    const noteId = `review-note-${subject.subjectId}`

    return (
        <Card className="min-w-0 overflow-hidden">
            <CardHeader className="flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                    <Text variant="xs" className="font-medium tracking-wide text-muted-foreground uppercase">
                        {REVIEW_COMPONENT_LABELS[subject.component]}
                    </Text>
                    <CardTitle className="mt-0.5 truncate">{subject.label}</CardTitle>
                </div>
                <ReviewStatusBadge status={review?.status ?? "pending"} />
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                {isDocument ? (
                    <DocumentPreview document={subject.data as unknown as DocumentSubjectData} />
                ) : (
                    <dl className="grid gap-3 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.label} className="min-w-0">
                                <dt>
                                    <Text variant="xs" className="text-muted-foreground">
                                        {field.label}
                                    </Text>
                                </dt>
                                <dd className="mt-0.5 text-sm wrap-break-word text-foreground">{field.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                {review?.note && (
                    <div className="rounded-lg bg-muted/40 p-3">
                        <Text variant="xs" className="text-muted-foreground">
                            Catatan reviewer
                        </Text>
                        <Text variant="sm" className="mt-0.5 text-foreground">
                            {review.note}
                        </Text>
                    </div>
                )}

                {canReview && (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={noteId}>Catatan (opsional)</Label>
                            <Textarea
                                id={noteId}
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                placeholder="Tambahkan catatan untuk keputusan ini..."
                                maxLength={2000}
                                rows={2}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="button" size="sm" disabled={isSubmitting} onClick={() => onVerify(note)}>
                                {isSubmitting ? <Spinner aria-hidden="true" /> : <Check aria-hidden="true" />}
                                Verifikasi
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={isSubmitting}
                                onClick={() => setConfirmOpen(true)}
                            >
                                <X aria-hidden="true" />
                                Tolak
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak komponen ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Komponen “{subject.label}” akan ditandai sebagai ditolak. Merchant perlu memperbaiki data
                            ini melalui revisi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                setConfirmOpen(false)
                                onReject(note)
                            }}
                        >
                            Tolak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
