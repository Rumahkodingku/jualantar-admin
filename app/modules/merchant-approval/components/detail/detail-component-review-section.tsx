import {
    Building2,
    FileText,
    Info,
    Landmark,
    Layers,
    MapPin,
    Store,
    Tags,
    User,
    type LucideIcon,
} from "lucide-react"

import { AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { Alert } from "~/components/ui/alert"
import { Text } from "~/components/ui/text"
import {
    REVIEW_COMPONENT_DESCRIPTIONS,
    REVIEW_COMPONENT_EMPTY_STATE,
    REVIEW_COMPONENT_GUIDES,
    REVIEW_COMPONENT_TITLES,
} from "../../services/merchant-approval.labels"
import {
    deriveComponentReviewStatus,
    subjectKey,
    type ReviewableSubject,
} from "../../services/merchant-approval.mappers"
import type { ApprovalReview, ReviewComponent } from "../../types/merchant-approval.types"
import { ReviewStatusBadge } from "../shared/status-badge"
import { SubjectReviewBlock } from "./subject-review-block"

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