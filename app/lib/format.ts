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

const idRelative = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" })

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

/** Format an ISO timestamp as a relative time in Indonesian, e.g. "3 hari yang lalu". */
export function formatRelativeDate(value: string | Date | null | undefined): string {
    if (!value) return "-"
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    const diffMs = date.getTime() - Date.now()
    const absMs = Math.abs(diffMs)
    const minute = 60_000
    const hour = 3_600_000
    const day = 86_400_000
    const week = 604_800_000
    const month = 2_592_000_000
    const year = 31_536_000_000
    if (absMs < minute) return "baru saja"
    if (absMs < hour) return idRelative.format(Math.trunc(diffMs / minute), "minute")
    if (absMs < day) return idRelative.format(Math.trunc(diffMs / hour), "hour")
    if (absMs < week) return idRelative.format(Math.trunc(diffMs / day), "day")
    if (absMs < month) return idRelative.format(Math.trunc(diffMs / week), "week")
    if (absMs < year) return idRelative.format(Math.trunc(diffMs / month), "month")
    return idRelative.format(Math.trunc(diffMs / year), "year")
}
