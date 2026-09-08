import type { LucideIcon } from "lucide-react"
import { Bell, Bike, CheckCircle2, CircleDollarSign, ShoppingCart, Store } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Text } from "~/components/ui/text"

interface TopbarNotification {
    id: string
    icon: LucideIcon
    title: string
    description: string
    time: string
    unread?: boolean
}

const mockNotifications: TopbarNotification[] = [
    {
        id: "n1",
        icon: ShoppingCart,
        title: "Pesanan baru #JA-1006",
        description: "Masuk dari Warung Makan Sederhana.",
        time: "Baru saja",
        unread: true,
    },
    {
        id: "n2",
        icon: Bike,
        title: "Kurir selesai pengantaran",
        description: "Budi Santoso menyelesaikan pengantaran #JA-1001.",
        time: "5 menit lalu",
        unread: true,
    },
    {
        id: "n3",
        icon: CircleDollarSign,
        title: "Pembayaran diterima",
        description: "Rp 36.000 dari pesanan #JA-1003 berhasil diverifikasi.",
        time: "12 menit lalu",
        unread: true,
    },
    {
        id: "n4",
        icon: Store,
        title: "Merchant baru bergabung",
        description: "Kedai Kopi Kita resmi aktif di Kapuas Hulu.",
        time: "1 jam lalu",
    },
    {
        id: "n5",
        icon: CheckCircle2,
        title: "Pesanan selesai",
        description: "Pesanan #JA-1002 telah diselesaikan.",
        time: "2 jam lalu",
    },
]

export function TopbarNotifications() {
    const unreadCount = mockNotifications.filter((n) => n.unread).length

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
                        className="relative rounded-xl text-foreground hover:bg-muted"
                    />
                }
            >
                <Bell aria-hidden="true" />
                {unreadCount > 0 && (
                    <span
                        aria-hidden="true"
                        className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background"
                    />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} className="mt-3 w-[calc(100vw-2rem)] max-w-sm p-0">
                <DropdownMenuGroup className="p-1.5">
                    <div className="flex items-center justify-between px-3 pt-3 pb-1">
                        <DropdownMenuLabel className="px-0 font-heading text-sm font-semibold text-foreground">
                            Notifikasi
                        </DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {unreadCount} baru
                            </span>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    {mockNotifications.map((notification) => {
                        const Icon = notification.icon
                        return (
                            <div
                                key={notification.id}
                                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/70"
                            >
                                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&>svg]:size-4">
                                    <Icon aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center justify-between gap-2">
                                        <Text variant="sm" className="font-medium text-foreground">
                                            {notification.title}
                                        </Text>
                                        {notification.unread && (
                                            <span
                                                aria-hidden="true"
                                                className="size-1.5 shrink-0 rounded-full bg-primary"
                                            />
                                        )}
                                    </span>
                                    <Text variant="xs" className="mt-0.5 block truncate text-muted-foreground">
                                        {notification.description}
                                    </Text>
                                </span>
                                <Text
                                    as="time"
                                    variant="xs"
                                    className="mt-0.5 shrink-0 whitespace-nowrap text-muted-foreground/80"
                                >
                                    {notification.time}
                                </Text>
                            </div>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-1.5">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-center text-primary hover:bg-primary/5"
                    >
                        Lihat semua notifikasi
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
