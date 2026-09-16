const idNumber = new Intl.NumberFormat("id-ID")

const idCurrency = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
})

const idDateTime = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Pontianak",
})

const idDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Pontianak",
})

/** Format a number with Indonesian digit grouping, e.g. 1248 -> "1.248". */
export function formatNumber(value: number): string {
    return idNumber.format(value)
}

/** Format an amount as Indonesian Rupiah without decimals, e.g. 45000 -> "Rp 45.000". */
export function formatIDR(value: number): string {
    return idCurrency.format(value)
}

/** Format an ISO timestamp as a localized date and time, e.g. "16 Sep 2026, 18.21". */
export function formatDateTime(value: string | Date | null | undefined): string {
    if (!value) return "-"
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return idDateTime.format(date)
}

/** Format an ISO timestamp as a localized date, e.g. "16 Sep 2026". */
export function formatDate(value: string | Date | null | undefined): string {
    if (!value) return "-"
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return idDate.format(date)
}
