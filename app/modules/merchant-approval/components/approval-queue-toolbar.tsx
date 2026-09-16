import { RotateCw, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Spinner } from "~/components/ui/spinner"

const SEARCH_DEBOUNCE_MS = 400

const STATUS_ITEMS: Record<string, string> = {
    all: "Semua Status",
    pending: "Menunggu Review",
    in_review: "Sedang Direview",
    revision_required: "Perlu Revisi",
    approved: "Disetujui",
    rejected: "Ditolak",
}

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

interface ApprovalQueueToolbarProps {
    search: string
    status: string
    assignedTo: string
    sortValue: string
    onSearchChange: (value: string) => void
    onStatusChange: (value: string) => void
    onAssignedChange: (value: string) => void
    onSortChange: (value: string) => void
    onRefresh: () => void
    isRefreshing: boolean
}

export function ApprovalQueueToolbar({
    search,
    status,
    assignedTo,
    sortValue,
    onSearchChange,
    onStatusChange,
    onAssignedChange,
    onSortChange,
    onRefresh,
    isRefreshing,
}: ApprovalQueueToolbarProps) {
    const [searchValue, setSearchValue] = useState(search)

    useEffect(() => {
        setSearchValue(search)
    }, [search])

    useEffect(() => {
        if (searchValue === search) return

        const timer = setTimeout(() => onSearchChange(searchValue), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [searchValue, search, onSearchChange])

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Cari nama bisnis atau no. pengajuan..."
                    aria-label="Cari pengajuan"
                    className="pl-9"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Select items={STATUS_ITEMS} value={status} onValueChange={(value) => onStatusChange(String(value))}>
                    <SelectTrigger size="sm" className="w-[170px]" aria-label="Filter status">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(STATUS_ITEMS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    items={ASSIGNED_ITEMS}
                    value={assignedTo}
                    onValueChange={(value) => onAssignedChange(String(value))}
                >
                    <SelectTrigger size="sm" className="w-42.5" aria-label="Filter reviewer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(ASSIGNED_ITEMS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select items={SORT_ITEMS} value={sortValue} onValueChange={(value) => onSortChange(String(value))}>
                    <SelectTrigger size="sm" className="w-45" aria-label="Urutkan">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(SORT_ITEMS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                    {isRefreshing ? <Spinner aria-hidden="true" /> : <RotateCw aria-hidden="true" />}
                    Muat ulang
                </Button>
            </div>
        </div>
    )
}
