import type { ReactNode } from "react"
import { cn } from "cn"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

interface SectionCardProps {
    title: string
    description?: string
    action?: ReactNode
    className?: string
    bodyClassName?: string
    children: ReactNode
}

/** Shell kartu konsisten untuk setiap widget section dashboard. */
export function SectionCard({ title, description, action, className, bodyClassName, children }: SectionCardProps) {
    return (
        <Card className={cn("min-w-0 overflow-hidden", className)}>
            <CardHeader className="flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                {action && <CardAction>{action}</CardAction>}
            </CardHeader>
            <CardContent className={cn("min-w-0", bodyClassName)}>{children}</CardContent>
        </Card>
    )
}
