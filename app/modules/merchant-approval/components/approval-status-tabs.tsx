import { Badge } from "~/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"

import { useApprovalSummary } from "../services/merchant-approval.queries"

const STATUS_TABS = [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Menunggu Review" },
    { value: "in_review", label: "Sedang Direview" },
    { value: "revision_required", label: "Perlu Revisi" },
    { value: "approved", label: "Disetujui" },
    { value: "rejected", label: "Ditolak" },
] as const

interface ApprovalStatusTabsProps {
    value: string
    onValueChange: (value: string) => void
}

export function ApprovalStatusTabs({ value, onValueChange }: ApprovalStatusTabsProps) {
    const { data: summary } = useApprovalSummary()

    const counts = summary
        ? {
              all: Object.values(summary.by_status).reduce((total, count) => total + count, 0),
              ...summary.by_status,
          }
        : null

    return (
        <Tabs value={value} onValueChange={(next) => onValueChange(String(next))}>
            <TabsList variant="line" className="justify-start">
                {STATUS_TABS.map((tab) => {
                    const count = counts?.[tab.value]

                    return (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="text-xs font-semibold after:bg-primary! data-active:text-primary!"
                        >
                            {tab.label}
                            {count !== undefined && (
                                <Badge variant="destructive" className="h-4.5 px-1.5 text-[10px]">
                                    {count}
                                </Badge>
                            )}
                        </TabsTrigger>
                    )
                })}
            </TabsList>
        </Tabs>
    )
}
