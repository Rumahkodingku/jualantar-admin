import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useFieldArray, useForm } from "react-hook-form"

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
import { Field, FieldContent, FieldError } from "~/components/ui/field"
import { Label } from "~/components/ui/label"
import { Spinner } from "~/components/ui/spinner"
import { Text } from "~/components/ui/text"
import { Textarea } from "~/components/ui/textarea"
import { revisionSchema, type RevisionInput } from "../../schemas/merchant-approval.schemas"
import { REVIEW_COMPONENT_LABELS } from "../../services/merchant-approval.labels"
import { findReview, subjectKey, type ReviewableSubject } from "../../services/merchant-approval.mappers"
import type { ApprovalReview, ReviewComponent } from "../../types/merchant-approval.types"

interface DetailRevisionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subjects: ReviewableSubject[]
    reviews: ApprovalReview[]
    isSubmitting: boolean
    onConfirm: (input: RevisionInput) => void
}

export function DetailRevisionDialog({
    open,
    onOpenChange,
    subjects,
    reviews,
    isSubmitting,
    onConfirm,
}: DetailRevisionDialogProps) {
    const form = useForm<RevisionInput>({
        resolver: zodResolver(revisionSchema),
        defaultValues: { note: "", items: [] },
    })

    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })

    useEffect(() => {
        if (!open) return

        const preselected: RevisionInput["items"] = []

        for (const subject of subjects) {
            const review = findReview(reviews, subject.subjectType, subject.subjectId)

            if (review?.status === "rejected") {
                preselected.push({
                    component: subject.component,
                    subject_type: subject.subjectType,
                    subject_id: subject.subjectId,
                    reason: review.note ?? "",
                })
            }
        }

        form.reset({ note: "", items: preselected })
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

    const fieldIndexFor = (subject: ReviewableSubject) =>
        fields.findIndex(
            (item) => item.subject_type === subject.subjectType && item.subject_id === subject.subjectId
        )

    const isSelected = (subject: ReviewableSubject) => fieldIndexFor(subject) >= 0

    const toggle = (subject: ReviewableSubject) => {
        const index = fieldIndexFor(subject)

        if (index >= 0) remove(index)
        else
            append({
                component: subject.component,
                subject_type: subject.subjectType,
                subject_id: subject.subjectId,
                reason: "",
            })
    }

    const handleSubmit = (input: RevisionInput) => {
        onConfirm({
            note: input.note?.trim() || undefined,
            items: input.items.map((item) => ({ ...item, reason: item.reason.trim() })),
        })
    }

    const { errors } = form.formState
    const arrayError = errors.items?.root?.message ?? errors.items?.message

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

                <form
                    id="revision-form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    noValidate
                    className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1"
                >
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="revision-note">Catatan Umum (opsional)</Label>
                        <Textarea
                            id="revision-note"
                            rows={2}
                            maxLength={2000}
                            placeholder="Catatan umum untuk merchant..."
                            {...form.register("note")}
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
                                    const selected = isSelected(subject)
                                    const fieldIndex = fieldIndexFor(subject)

                                    return (
                                        <div key={key} className="rounded-lg border border-border p-3">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`revision-${key}`}
                                                    checked={selected}
                                                    onCheckedChange={() => toggle(subject)}
                                                />
                                                <Label
                                                    htmlFor={`revision-${key}`}
                                                    className="flex-1 cursor-pointer text-sm font-medium"
                                                >
                                                    {subject.label}
                                                </Label>
                                            </div>

                                            {selected && (
                                                <div className="mt-3 pl-7">
                                                    <Field
                                                        data-invalid={
                                                            errors.items?.[fieldIndex]?.reason ? true : undefined
                                                        }
                                                    >
                                                        <FieldContent>
                                                            <Textarea
                                                                rows={2}
                                                                maxLength={2000}
                                                                placeholder="Alasan revisi untuk komponen ini..."
                                                                aria-label={`Alasan revisi ${subject.label}`}
                                                                aria-invalid={
                                                                    errors.items?.[fieldIndex]?.reason ? true : undefined
                                                                }
                                                                {...form.register(`items.${fieldIndex}.reason`)}
                                                            />
                                                            <FieldError
                                                                errors={[errors.items?.[fieldIndex]?.reason]}
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {arrayError && (
                        <Text variant="sm" className="font-semibold text-destructive" role="alert">
                            {arrayError}
                        </Text>
                    )}
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" form="revision-form" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner aria-hidden="true" /> : null}
                        Kirim Permintaan Revisi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}