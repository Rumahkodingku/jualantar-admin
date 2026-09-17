import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

const SEARCH_DEBOUNCE_MS = 400

const ASSIGNED_ITEMS: Record<string, string> = {
    all: "Semua Reviewer",
    me: "Ditugaskan ke Saya",
    unassigned: "Belum Ditugaskan",
}

const SORT_ITEMS: Record<string, string> = {
    "created_at:desc": "Pengajuan terbaru",
    "created_at:asc": "Pengajuan terlama",
    "assigned_at:desc": "Terakhir diklaim",
    "completed_at:desc": "Terakhir diselesaikan",
}

interface QueueFilterProps {
    search: string
    assignedTo: string
    sortValue: string
    onSearchChange: (value: string) => void
    onAssignedChange: (value: string) => void
    onSortChange: (value: string) => void
}

export function QueueFilter({
    search,
    assignedTo,
    sortValue,
    onSearchChange,
    onAssignedChange,
    onSortChange,
}: QueueFilterProps) {
    const [searchValue, setSearchValue] = useState(search)

    useEffect(() => {
        setSearchValue(search)
    }, [search])

    useEffect(() => {
        if (searchValue === search) return

        const timer = setTimeout(() => {
            onSearchChange(searchValue)
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(timer)
    }, [searchValue, search, onSearchChange])

    return (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Cari bisnis, no. pengajuan, email, atau layanan..."
                    aria-label="Cari pengajuan"
                    className="h-9 w-full bg-muted/50 pl-10 shadow-none focus-visible:ring-1"
                />
            </div>

            {/* Filters */}
            <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                {/* Reviewer */}
                <Select
                    items={ASSIGNED_ITEMS}
                    value={assignedTo}
                    onValueChange={(value) => onAssignedChange(String(value))}
                >
                    <SelectTrigger
                        size="default"
                        className="w-full bg-background py-6 font-medium shadow-none sm:w-44"
                        aria-label="Filter reviewer"
                    >
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.entries(ASSIGNED_ITEMS).map(([value, label]) => (
                            <SelectItem className="cursor-pointer p-4" key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort */}
                <Select items={SORT_ITEMS} value={sortValue} onValueChange={(value) => onSortChange(String(value))}>
                    <SelectTrigger
                        size="default"
                        className="w-full bg-background py-6 font-medium shadow-none sm:w-44"
                        aria-label="Urutkan"
                    >
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.entries(SORT_ITEMS).map(([value, label]) => (
                            <SelectItem className="cursor-pointer p-4" key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
