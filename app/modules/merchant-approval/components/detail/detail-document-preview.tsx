import { FileText } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { DOCUMENT_TYPE_LABELS, formatFileSize } from "../../services/merchant-approval.mappers"
import type { DocumentSubjectData } from "../../types/merchant-approval.types"

export function DetailDocumentPreview({ document }: { document: DocumentSubjectData }) {
    const isImage = document.mime_type.startsWith("image/")

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                {isImage && document.url ? (
                    <img src={document.url} alt="" className="size-11 object-cover" />
                ) : (
                    <FileText aria-hidden="true" className="size-5" />
                )}
            </span>

            <div className="min-w-0 flex-1">
                <Text variant="sm" weight="medium" className="truncate text-foreground">
                    {DOCUMENT_TYPE_LABELS[document.document_type] ?? document.document_type}
                </Text>
                <Text variant="xs" className="truncate text-muted-foreground">
                    {document.file_name} · {formatFileSize(document.file_size)}
                </Text>
            </div>

            {document.url ? (
                <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<a href={document.url} target="_blank" rel="noreferrer" />}
                >
                    Buka
                </Button>
            ) : (
                <Text variant="xs" className="shrink-0 text-muted-foreground">
                    Tidak tersedia
                </Text>
            )}
        </div>
    )
}
