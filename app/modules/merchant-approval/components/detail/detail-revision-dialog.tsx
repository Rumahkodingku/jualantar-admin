import { useEffect, useMemo, useState } from "react"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { Textarea } from "~/components/ui/textarea"
import { findReview, REVIEW_COMPONENT_LABELS, type ReviewableSubject } from "../../services/merchant-approval.mappers"
import type { RevisionInput } from "../../schemas/merchant-approval.schemas"
import type { ApprovalReview, ReviewComponent } from "../../types/merchant-approval.types"

interface DetailRevisionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subjects: ReviewableSubject[]
    reviews: ApprovalReview[]
    isSubmitting: boolean
    onConfirm: (input: RevisionInput) => void
}

function subjectKey(subject: ReviewableSubject): string {
    return `${subject.subjectType}:${subject.subjectId}`
}

export function DetailRevisionDialog({
    open,
    onOpenChange,
    subjects,
    reviews,
    isSubmitting,
    onConfirm,
}: DetailRevisionDialogProps) {
    const [note, setNote] = useState("")
    const [selection, setSelection] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) return

        const preselected: Record<string, string> = {}

        for (const subject of subjects) {
            const review = findReview(reviews, subject.subjectType, subject.subjectId)

            if (review?.status === "rejected") {
                preselected[subjectKey(subject)] = review.note ?? ""
            }
        }

        setSelection(preselected)
        setNote("")
        setError(null)
        // Intentionally initialise only when the dialog opens, not on every
        // parent render (subjects/reviews are new array references each render).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const grouped = useMemo(() => {
        const map = new Map<ReviewComponent, ReviewableSubject[]>()

        for (const subject of subjects) {
            const list = map.get(subject.component) ?? []
            list.push(subject)
            map.set(subject.component, list)
        }

        return [...map.entries()]
    }, [subjects])

    const toggle = (subject: ReviewableSubject) => {
        const key = subjectKey(subject)
        setSelection((previous) => {
            if (key in previous) {
                const next = { ...previous }
                delete next[key]
                return next
            }
            return { ...previous, [key]: "" }
        })
        setError(null)
    }

    const handleConfirm = () => {
        const items = subjects
            .filter((subject) => subjectKey(subject) in selection)
            .map((subject) => ({
                component: subject.component,
                subject_type: subject.subjectType,
                subject_id: subject.subjectId,
                reason: selection[subjectKey(subject)].trim(),
            }))

        if (items.length === 0) {
            setError("Pilih minimal satu komponen untuk direvisi.")
            return
        }

        if (items.some((item) => item.reason === "")) {
            setError("Alasan revisi wajib diisi untuk setiap komponen yang dipilih.")
            return
        }

        onConfirm({ note: note.trim() || undefined, items })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Minta Revisi</DialogTitle>
                    <DialogDescription>
                        Pilih komponen yang perlu diperbaiki dan jelaskan alasannya. Merchant akan menerima permintaan
                        ini dan harus memperbaiki serta mengirim ulang pengajuan.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="revision-note">Catatan Umum (opsional)</Label>
                        <Textarea
                            id="revision-note"
                            rows={2}
                            maxLength={2000}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Catatan umum untuk merchant..."
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {grouped.map(([component, componentSubjects]) => (
                            <div key={component} className="flex flex-col gap-2">
                                <Text
                                    variant="xs"
                                    className="font-medium tracking-wide text-muted-foreground uppercase"
                                >
                                    {REVIEW_COMPONENT_LABELS[component]}
                                </Text>

                                {componentSubjects.map((subject) => {
                                    const key = subjectKey(subject)
                                    const isSelected = key in selection

                                    return (
                                        <div key={key} className="rounded-lg border border-border p-3">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`revision-${key}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggle(subject)}
                                                />
                                                <Label
                                                    htmlFor={`revision-${key}`}
                                                    className="flex-1 cursor-pointer text-sm font-medium"
                                                >
                                                    {subject.label}
                                                </Label>
                                            </div>

                                            {isSelected && (
                                                <div className="mt-3 pl-7">
                                                    <Textarea
                                                        rows={2}
                                                        maxLength={2000}
                                                        value={selection[key]}
                                                        onChange={(event) =>
                                                            setSelection((previous) => ({
                                                                ...previous,
                                                                [key]: event.target.value,
                                                            }))
                                                        }
                                                        placeholder="Alasan revisi untuk komponen ini..."
                                                        aria-label={`Alasan revisi ${subject.label}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <Text variant="sm" className="font-semibold text-destructive" role="alert">
                            {error}
                        </Text>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={isSubmitting}>
                        {isSubmitting ? <Spinner aria-hidden="true" /> : null}
                        Kirim Permintaan Revisi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
