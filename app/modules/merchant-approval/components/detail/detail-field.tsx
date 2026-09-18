import type { ReactNode } from "react"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"

const MISSING = "–"

export function DetailFieldGrid({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>
}

interface DetailItemProps {
    label: ReactNode
    value: ReactNode
    mono?: boolean
    prominent?: boolean
    muted?: boolean
    className?: string
}

export function DetailItem({ label, value, mono, prominent, muted, className }: DetailItemProps) {
    const isEmpty = value === null || value === undefined || value === ""
    const display = isEmpty ? MISSING : value

    return (
        <div className={cn("mt-4 flex min-w-0 flex-col", className)}>
            <Text variant="xs" weight="semibold">
                {label}
            </Text>
            <Text variant="xs" className="mt-1 leading-relaxed text-muted-foreground">
                {display}
            </Text>
        </div>
    )
}