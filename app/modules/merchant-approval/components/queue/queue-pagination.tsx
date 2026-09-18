import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"

interface QueuePaginationProps {
    page: number
    count: number
    total: number
    lastPage: number
    onPrevious: () => void
    onNext: () => void
}

export function QueuePagination({ page, count, total, lastPage, onPrevious, onNext }: QueuePaginationProps) {
    const canGoPrevious = page > 1
    const canGoNext = page < lastPage

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Text variant="xs" weight="medium" className="text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{count}</span> dari{" "}
                <span className="font-semibold text-foreground">{total}</span> pengajuan
            </Text>

            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                <PaginationContent className="gap-1">
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            aria-disabled={!canGoPrevious}
                            className={cn(
                                "h-8 rounded-md px-2.5 text-xs",
                                !canGoPrevious && "pointer-events-none opacity-40"
                            )}
                            onClick={(event) => {
                                event.preventDefault()

                                if (canGoPrevious) onPrevious()
                            }}
                            text="Sebelumnya"
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <div className="flex h-8 items-center px-3">
                            <Text
                                variant="xs"
                                weight="medium"
                                className="whitespace-nowrap text-muted-foreground"
                            >
                                Halaman <span className="font-semibold text-foreground">{page}</span> dari{" "}
                                <span className="font-semibold text-foreground">{lastPage}</span>
                            </Text>
                        </div>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            aria-disabled={!canGoNext}
                            className={cn(
                                "h-8 rounded-md px-2.5 text-xs",
                                !canGoNext && "pointer-events-none opacity-40"
                            )}
                            onClick={(event) => {
                                event.preventDefault()

                                if (canGoNext) onNext()
                            }}
                            text="Berikutnya"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}