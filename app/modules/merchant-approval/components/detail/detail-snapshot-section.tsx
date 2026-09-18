import { Info, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { Alert } from "~/components/ui/alert"
import { Text } from "~/components/ui/text"

interface DetailSnapshotSectionProps {
    value: string
    icon: LucideIcon
    title: string
    description?: string
    guide?: string
    badge?: string
    children: ReactNode
}

export function DetailSnapshotSection({
    value,
    icon: Icon,
    title,
    description,
    guide,
    badge,
    children,
}: DetailSnapshotSectionProps) {
    return (
        <AccordionItem
            value={value}
            className="overflow-hidden rounded-xl border border-border bg-card not-last:border-b"
        >
            <AccordionTrigger className="gap-3 px-4 py-3.5 hover:no-underline">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                    <Text variant="sm" weight="bold" className="text-foreground">
                        {title}
                    </Text>
                    {description && (
                        <Text variant="xs" weight="normal" className="mt-0.5 text-muted-foreground">
                            {description}
                        </Text>
                    )}
                </span>
                {badge && (
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                        {badge}
                    </span>
                )}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
                {guide && (
                    <p role="note" className="mb-4 flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2">
                        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <Text variant="xs" className="text-muted-foreground">
                            {guide}
                        </Text>
                    </p>
                )}
                {children}
            </AccordionContent>
        </AccordionItem>
    )
}
