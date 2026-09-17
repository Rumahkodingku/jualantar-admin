export function maskMiddle(value: string, visibleStart = 4, visibleEnd = 4): string {
    if (!value) return value

    const length = value.length

    if (length <= visibleStart + visibleEnd) {
        const head = value.slice(0, Math.min(2, length))
        const tail = length > 1 ? value.slice(-1) : ""
        const hidden = Math.max(length - head.length - tail.length, 0)
        return `${head}${"*".repeat(hidden)}${tail}`
    }

    const head = value.slice(0, visibleStart)
    const tail = value.slice(-visibleEnd)
    return `${head}${"*".repeat(length - visibleStart - visibleEnd)}${tail}`
}
