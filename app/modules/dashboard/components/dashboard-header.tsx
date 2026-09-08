import { CalendarDays } from "lucide-react"

import { Text } from "~/components/ui/text"

const DATE_FORMAT = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
} as const

export function DashboardHeader() {
    const now = new Date()
    const date = now.toLocaleDateString("id-ID", DATE_FORMAT)
    const time = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Pontianak" })

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <Text as="h1" variant="2xl" className="font-bold tracking-tight text-foreground md:text-[1.7rem]">
                    Selamat datang kembali, Super Admin 👋
                </Text>
                <Text variant="sm" className="mt-1.5 text-muted-foreground">
                    Berikut ringkasan aktivitas JualAntar hari ini.
                </Text>
            </div>

            <div className="hidden shrink-0 items-center gap-2.5 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 shadow-xs md:flex">
                <CalendarDays aria-hidden="true" className="size-4 text-primary" />
                <Text variant="sm" className="text-muted-foreground">
                    {date}
                </Text>
                <span aria-hidden="true" className="h-4 w-px bg-border" />
                <Text variant="sm" className="font-medium text-foreground tabular-nums">
                    {time} WIB
                </Text>
            </div>
        </div>
    )
}
