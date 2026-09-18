import { useMemo, useState } from "react"

import { Accordion } from "~/components/ui/accordion"
import { groupSubjectsByComponent, type ReviewableSubject } from "../../services/merchant-approval.mappers"
import type { ApprovalReview } from "../../types/merchant-approval.types"
import { DetailComponentReviewSection } from "./detail-component-review-card"

interface DetailReviewAccordionProps {
    subjects: ReviewableSubject[]
    getReview: (subject: ReviewableSubject) => ApprovalReview | undefined
    canReview: boolean
    isSubmitting: (subject: ReviewableSubject) => boolean
    onVerify: (subject: ReviewableSubject, note: string) => void
    onReject: (subject: ReviewableSubject, note: string) => void
}

export function DetailReviewAccordion({
    subjects,
    getReview,
    canReview,
    isSubmitting,
    onVerify,
    onReject,
}: DetailReviewAccordionProps) {
    const groups = useMemo(() => groupSubjectsByComponent(subjects), [subjects])

    const [open, setOpen] = useState<string[]>(() => {
        const firstActionable = groups.find((group) =>
            group.subjects.some((subject) => getReview(subject)?.status !== "verified")
        )

        if (firstActionable) return [firstActionable.component]
        if (groups.length > 0) return [groups[0].component]
        return []
    })

    return (
        <Accordion value={open} onValueChange={(value) => setOpen(value as string[])} className="flex flex-col gap-2">
            {groups.map((group) => (
                <DetailComponentReviewSection
                    key={group.component}
                    component={group.component}
                    subjects={group.subjects}
                    getReview={getReview}
                    canReview={canReview}
                    isSubmitting={isSubmitting}
                    onVerify={onVerify}
                    onReject={onReject}
                />
            ))}
        </Accordion>
    )
}
