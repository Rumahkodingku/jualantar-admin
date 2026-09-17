import { ClipboardList, Inbox } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "~/components/ui/empty"

interface QueueEmptyStateProps {
    hasFilters: boolean
    onReset: () => void
}

export function QueueEmptyState({ hasFilters, onReset }: QueueEmptyStateProps) {
    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyMedia variant="icon">{hasFilters ? <ClipboardList /> : <Inbox />}</EmptyMedia>
                <EmptyTitle>{hasFilters ? "Tidak ada hasil" : "Belum ada pengajuan"}</EmptyTitle>
                <EmptyDescription>
                    {hasFilters
                        ? "Tidak ada pengajuan yang cocok dengan filter saat ini. Coba ubah kata kunci atau reset filter."
                        : "Belum ada pengajuan merchant yang perlu ditinjau saat ini."}
                </EmptyDescription>
            </EmptyHeader>
            {hasFilters && (
                <EmptyContent>
                    <Button variant="outline" size="sm" onClick={onReset}>
                        Reset Filter
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    )
}
