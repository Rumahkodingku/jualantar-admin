import type { LucideIcon } from "lucide-react"
import {
    BarChart3,
    Bike,
    KeyRound,
    Landmark,
    LayoutDashboard,
    MapPinned,
    Megaphone,
    ReceiptText,
    ScrollText,
    Settings,
    ShieldCheck,
    ShoppingCart,
    Store,
    UserCog,
    Users,
    UtensilsCrossed,
    WalletCards,
} from "lucide-react"

export interface NavChildItem {
    title: string
    href: string
}

export interface NavItem {
    title: string
    href: string
    icon: LucideIcon
    children?: NavChildItem[]
}

export interface NavGroup {
    label?: string
    items: NavItem[]
}

export const sidebarGroups: NavGroup[] = [
    {
        items: [
            {
                // Overview kondisi platform secara keseluruhan:
                // statistik merchant, kurir, pelanggan, pesanan, dan aktivitas platform.
                title: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Operasional",
        items: [
            {
                // Melihat dan memantau seluruh pesanan yang terjadi di platform.
                // Termasuk status order dan detail perjalanan pesanan.
                title: "Pesanan",
                href: "/orders",
                icon: ShoppingCart,
            },
            {
                // Mengelola data kurir serta proses verifikasi,
                // aktivasi, penonaktifan, dan suspend kurir.
                title: "Kurir",
                href: "/couriers",
                icon: Bike,
            },
            {
                // Melihat seluruh pelanggan yang terdaftar
                // serta mengelola status akun pelanggan.
                title: "Pelanggan",
                href: "/customers",
                icon: Users,
            },
        ],
    },
    {
        label: "Manajemen Bisnis",
        items: [
            {
                // Mengelola merchant dan proses verifikasi merchant,
                // termasuk profil, dokumen, dan status merchant.
                title: "Merchant",
                href: "/merchants",
                icon: Store,
                children: [
                    {
                        // Mengelola data merchant yang sudah diverifikasi dan aktif beroperasi di platform.
                        title: "Aktif Beroperasi",
                        href: "/merchants/active",
                    },
                    {
                        // Mengelola data merchant yang sedang dalam proses verifikasi dan belum aktif beroperasi di platform.
                        title: "Pending Verifikasi",
                        href: "/merchants/pending",
                    },
                ],
            },
            {
                // Mengelola program promosi platform seperti voucher,
                // diskon, dan promo yang dapat digunakan pelanggan.
                title: "Promosi",
                href: "/promotions",
                icon: Megaphone,
            },
        ],
    },
    {
        label: "Keuangan",
        items: [
            {
                // Mengelola permintaan penarikan dana dari merchant dan kurir,
                // termasuk review, approve, reject, dan monitoring status pencairan.
                title: "Penarikan Dana",
                href: "/withdrawals",
                icon: WalletCards,
            },
            {
                // Melihat seluruh aktivitas transaksi finansial platform,
                // seperti pembayaran order, pendapatan, fee, refund, dan withdrawal.
                title: "Transaksi",
                href: "/transactions",
                icon: ReceiptText,
            },
        ],
    },
    {
        label: "Master Data",
        items: [
            {
                // Menyediakan referensi bank yang digunakan untuk
                // data rekening merchant dan kurir.
                title: "Bank",
                href: "/master-data/banks",
                icon: Landmark,
            },
            {
                // Mengelola referensi wilayah Indonesia secara hierarkis:
                // provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan.
                title: "Wilayah",
                href: "/master-data/regions",
                icon: MapPinned,
                children: [
                    {
                        // Mengelola data provinsi di seluruh Indonesia.
                        title: "Provinsi",
                        href: "/master-data/regions/provinsi",
                    },
                    {
                        // Mengelola data kabupaten/kota di setiap provinsi.
                        title: "Kabupaten/Kota",
                        href: "/master-data/regions/kabupaten-kota",
                    },
                    {
                        // Mengelola data kecamatan di setiap kabupaten/kota.
                        title: "Kecamatan",
                        href: "/master-data/regions/kecamatan",
                    },
                    {
                        // Mengelola data kelurahan/desa di setiap kecamatan.
                        title: "Kelurahan/Desa",
                        href: "/master-data/regions/kelurahan-desa",
                    },
                ],
            },
        ],
    },
    {
        label: "Access Control",
        items: [
            {
                // Mengelola role administrator/internal user
                // beserta kumpulan permission yang dimilikinya.
                title: "Roles",
                href: "/settings/roles",
                icon: ShieldCheck,
            },
            {
                // Mengelola permission/action yang tersedia
                // untuk mengatur hak akses setiap role.
                title: "Permissions",
                href: "/settings/permissions",
                icon: KeyRound,
            },
        ],
    },
    {
        label: "Sistem",
        items: [
            {
                // Mengelola konfigurasi umum platform JualAntar.
                title: "Pengaturan",
                href: "/settings",
                icon: Settings,
            },
            {
                // Mengelola akun administrator/internal user
                // yang memiliki akses ke dashboard admin.
                title: "Manajemen User",
                href: "/settings/users",
                icon: UserCog,
            },
            {
                // Mencatat aktivitas penting administrator,
                // seperti verifikasi, penolakan, suspend, dan perubahan akses.
                title: "Aktivitas Log",
                href: "/settings/activity-log",
                icon: ScrollText,
            },
        ],
    },
]

/** True bila pathname sedang berada di (atau di bawah) sebuah item navigasi. */
export function isNavItemActive(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`)
}

/** True bila salah satu sub menu (children) dari sebuah item sedang aktif. */
export function isNavChildItemActive(pathname: string, item: NavItem): boolean {
    return item.children?.some((child) => isNavItemActive(pathname, child.href)) ?? false
}
