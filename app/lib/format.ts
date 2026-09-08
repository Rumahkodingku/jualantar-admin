const idNumber = new Intl.NumberFormat("id-ID")

const idCurrency = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
})

/** Format a number with Indonesian digit grouping, e.g. 1248 -> "1.248". */
export function formatNumber(value: number): string {
    return idNumber.format(value)
}

/** Format an amount as Indonesian Rupiah without decimals, e.g. 45000 -> "Rp 45.000". */
export function formatIDR(value: number): string {
    return idCurrency.format(value)
}
