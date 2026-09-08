import { ApiError } from "~/lib/api"

import type { DashboardOverview } from "./dashboard.types"

/**
 * Simulasi state data dashboard untuk keperluan preview UI.
 * - "success" -> data lengkap (default)
 * - "empty"   -> semua bagian kosong (belum ada data)
 * - "error"   -> request gagal, menampilkan error state
 *
 * Ganti nilai ini untuk memeriksa tiap UI state tanpa menyentuh komponen.
 */
export type DashboardMockState = "success" | "empty" | "error"

export const DASHBOARD_MOCK_STATE: DashboardMockState = "success"

const MOCK_DELAY_MS = 600

function simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

const successOverview: DashboardOverview = {
    kpis: [
        {
            id: "orders",
            label: "Total Pesanan",
            value: 1248,
            changePercent: 12,
            trend: "up",
            helperText: "vs periode sebelumnya",
        },
        {
            id: "merchants",
            label: "Total Merchant",
            value: 86,
            changePercent: 8,
            trend: "up",
            helperText: "vs periode sebelumnya",
        },
        {
            id: "couriers",
            label: "Total Kurir",
            value: 320,
            changePercent: 15,
            trend: "up",
            helperText: "vs periode sebelumnya",
        },
        {
            id: "customers",
            label: "Total Pelanggan",
            value: 5482,
            changePercent: 11,
            trend: "up",
            helperText: "vs periode sebelumnya",
        },
    ],
    revenue: {
        total: 48_250_000,
        changePercent: 20,
        points: [
            { label: "3 Sep", value: 6_150_000 },
            { label: "4 Sep", value: 6_780_000 },
            { label: "5 Sep", value: 6_420_000 },
            { label: "6 Sep", value: 7_310_000 },
            { label: "7 Sep", value: 6_950_000 },
            { label: "8 Sep", value: 7_460_000 },
            { label: "9 Sep", value: 8_120_000 },
        ],
    },
    orderStatus: {
        total: 1248,
        slices: [
            { key: "selesai", count: 842 },
            { key: "diproses", count: 180 },
            { key: "dibatalkan", count: 96 },
            { key: "menunggu", count: 132 },
        ],
    },
    recentOrders: [
        {
            id: "JA-1001",
            customer: "Budi Santoso",
            merchant: "Warung Makan Sederhana",
            amount: 45_000,
            status: "selesai",
            time: "5 menit lalu",
        },
        {
            id: "JA-1002",
            customer: "Siti Rahma",
            merchant: "Kedai Kopi Kita",
            amount: 28_000,
            status: "diproses",
            time: "12 menit lalu",
        },
        {
            id: "JA-1003",
            customer: "Andi Pratama",
            merchant: "Ayam Geprek Mantap",
            amount: 36_000,
            status: "selesai",
            time: "18 menit lalu",
        },
        {
            id: "JA-1004",
            customer: "Dewi Lestari",
            merchant: "Bakso Pak Jono",
            amount: 22_000,
            status: "menunggu",
            time: "25 menit lalu",
        },
        {
            id: "JA-1005",
            customer: "Rizki Maulana",
            merchant: "Soto Banjar",
            amount: 30_000,
            status: "selesai",
            time: "32 menit lalu",
        },
    ],
    recentActivities: [
        { id: "a1", kind: "order", title: "Pesanan baru #JA-1005", time: "32 menit lalu" },
        { id: "a2", kind: "courier", title: "Kurir Budi mulai pengantaran", time: "45 menit lalu" },
        { id: "a3", kind: "merchant", title: "Merchant baru bergabung", time: "1 jam lalu" },
        { id: "a4", kind: "payment", title: "Pembayaran diterima", time: "2 jam lalu" },
        { id: "a5", kind: "done", title: "Pesanan #JA-1003 selesai", time: "2 jam lalu" },
    ],
    couriers: [
        { id: "c1", name: "Budi Santoso", activity: "Sedang mengantar", online: true },
        { id: "c2", name: "Andi Pratama", activity: "Tersedia", online: true },
        { id: "c3", name: "Rizki Maulana", activity: "Tersedia", online: true },
        { id: "c4", name: "Dewi Lestari", activity: "Istirahat", online: false },
        { id: "c5", name: "Fajar Nugroho", activity: "Tersedia", online: true },
    ],
    orderStatistics: [
        { label: "1 Sep", orders: 120 },
        { label: "2 Sep", orders: 180 },
        { label: "3 Sep", orders: 220 },
        { label: "4 Sep", orders: 145 },
        { label: "5 Sep", orders: 185 },
        { label: "6 Sep", orders: 195 },
        { label: "7 Sep", orders: 235 },
        { label: "8 Sep", orders: 270 },
        { label: "9 Sep", orders: 300 },
    ],
    topMerchants: [
        { rank: 1, name: "Warung Makan Sederhana", totalOrders: 320 },
        { rank: 2, name: "Kedai Kopi Kita", totalOrders: 276 },
        { rank: 3, name: "Ayam Geprek Mantap", totalOrders: 245 },
        { rank: 4, name: "Bakso Pak Jono", totalOrders: 198 },
        { rank: 5, name: "Soto Banjar", totalOrders: 154 },
    ],
}

function emptyOverview(): DashboardOverview {
    return {
        kpis: [
            {
                id: "orders",
                label: "Total Pesanan",
                value: 0,
                changePercent: 0,
                trend: "up",
                helperText: "vs periode sebelumnya",
            },
            {
                id: "merchants",
                label: "Total Merchant",
                value: 0,
                changePercent: 0,
                trend: "up",
                helperText: "vs periode sebelumnya",
            },
            {
                id: "couriers",
                label: "Total Kurir",
                value: 0,
                changePercent: 0,
                trend: "up",
                helperText: "vs periode sebelumnya",
            },
            {
                id: "customers",
                label: "Total Pelanggan",
                value: 0,
                changePercent: 0,
                trend: "up",
                helperText: "vs periode sebelumnya",
            },
        ],
        revenue: { total: 0, changePercent: 0, points: [] },
        orderStatus: { total: 0, slices: [] },
        recentOrders: [],
        recentActivities: [],
        couriers: [],
        orderStatistics: [],
        topMerchants: [],
    }
}

/** Ambil data ringkasan dashboard. Menggantikan panggilan API sungguhan nantinya. */
export async function getDashboardOverview(): Promise<DashboardOverview> {
    await simulateDelay()

    if (DASHBOARD_MOCK_STATE === "error") {
        throw new ApiError("Terjadi kesalahan saat memuat data dashboard.")
    }

    return DASHBOARD_MOCK_STATE === "empty" ? emptyOverview() : successOverview
}
