import { Text } from "~/components/ui/text"
import { subjectFields, type ReviewableSubject } from "../../services/merchant-approval.mappers"
import type { DocumentSubjectData, OutletSubjectData, PayoutSubjectData } from "../../types/merchant-approval.types"
import { DetailDocumentPreview } from "./detail-document-preview"
import { DetailFieldGrid, DetailItem } from "./detail-field"
import { DetailOutletCard } from "./detail-outlet-card"
import { DetailPayoutCard } from "./detail-payout-card"

export function SubjectDetail({ subject }: { subject: ReviewableSubject }) {
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