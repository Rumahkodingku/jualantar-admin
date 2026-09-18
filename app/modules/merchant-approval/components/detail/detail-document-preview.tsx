import { ExternalLink, FileText } from "lucide-react"

import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"
import { DOCUMENT_TYPE_LABELS } from "../../services/merchant-approval.labels"
import { formatFileSize } from "../../services/merchant-approval.mappers"
import type { DocumentSubjectData } from "../../types/merchant-approval.types"

export function DetailDocumentPreview({ document }: { document: DocumentSubjectData }) {
    const isImage = document.mime_type.startsWith("image/")
    const label = DOCUMENT_TYPE_LABELS[document.document_type] ?? document.document_type

    const content = (
        <>
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                {isImage && document.url ? (
                    <img src={document.url} alt="" className="size-full object-cover" />
                ) : (
                    <FileText aria-hidden="true" className="size-5" />
                )}
            </span>

            <span className="flex min-w-0 flex-1 flex-col">
                <Text variant="sm" weight="medium" className="truncate text-foreground">
                    {label}
                </Text>
                <Text variant="xs" className="truncate text-muted-foreground">
                    {document.file_name} · {formatFileSize(document.file_size)}
                </Text>
            </span>

            {document.url ? (
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary">
                    Buka
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                </span>
            ) : (
                <Text variant="xs" className="shrink-0 text-muted-foreground">
                    Tidak tersedia
                </Text>
            )}
        </>
    )

    const rowClass = cn(
        "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors",
        document.url && "cursor-pointer hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
    )

    if (document.url) {
        return (
            <a
                href={document.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Buka dokumen ${label}`}
                className={rowClass}
            >
                {content}
            </a>
        )
    }

    return <div className={rowClass}>{content}</div>
}
