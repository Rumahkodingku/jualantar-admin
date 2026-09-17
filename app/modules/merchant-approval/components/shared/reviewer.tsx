import { UserRound } from "lucide-react"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"

interface ReviewerProps {
    assignedTo: string | null
    currentUserId?: string
    className?: string
}

export function Reviewer({ assignedTo, currentUserId, className }: ReviewerProps) {
    const isAssigned = Boolean(assignedTo)
    const isSelf = Boolean(assignedTo && currentUserId && assignedTo === currentUserId)
    const label = !isAssigned ? "Belum Ditugaskan" : isSelf ? "Anda" : "Administrator"

    return (
        <div className={cn("flex min-w-0 items-center gap-2", className)}>
            <Avatar size="sm" className="bg-muted">
                <AvatarFallback className={cn(isAssigned ? "text-foreground" : "text-muted-foreground")}>
                    <UserRound aria-hidden="true" className="size-3.5" />
                </AvatarFallback>
            </Avatar>
            <Text
                variant="xs"
                weight="semibold"
                truncate
                className={cn(isAssigned ? "text-foreground" : "text-muted-foreground")}
            >
                {label}
            </Text>
        </div>
    )
}
