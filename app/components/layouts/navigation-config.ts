import type { LucideIcon } from "lucide-react"
import {
    BarChart3,
    Bike,
    LayoutDashboard,
    Megaphone,
    ReceiptText,
    ScrollText,
    Settings,
    ShoppingCart,
    Store,
    UserCog,
    Users,
    UtensilsCrossed,
} from "lucide-react"

export interface NavItem {
    title: string
    href: string
    icon: LucideIcon
}

export interface NavGroup {
    label?: string
    items: NavItem[]
}

export const sidebarGroups: NavGroup[] = [
    {
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Operasional",
        items: [
            { title: "Pesanan", href: "/orders", icon: ShoppingCart },
            { title: "Kurir", href: "/couriers", icon: Bike },
            { title: "Pelanggan", href: "/customers", icon: Users },
        ],
    },
    {
        label: "Manajemen Bisnis",
        items: [
            { title: "Merchant", href: "/merchants", icon: Store },
            { title: "Produk & Menu", href: "/products", icon: UtensilsCrossed },
            { title: "Promosi", href: "/promotions", icon: Megaphone },
        ],
    },
    {
        label: "Keuangan",
        items: [
            { title: "Transaksi", href: "/transactions", icon: ReceiptText },
            { title: "Laporan Keuangan", href: "/reports", icon: BarChart3 },
        ],
    },
    {
        label: "Pengaturan",
        items: [
            { title: "Pengaturan", href: "/settings", icon: Settings },
            { title: "Manajemen User", href: "/settings/users", icon: UserCog },
            { title: "Aktivitas Log", href: "/settings/activity-log", icon: ScrollText },
        ],
    },
]

/** True bila pathname sedang berada di (atau di bawah) sebuah item navigasi. */
export function isNavItemActive(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`)
}
