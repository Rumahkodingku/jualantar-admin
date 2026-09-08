import { OctagonXIcon } from "lucide-react"

import { Text } from "~/components/ui/text"

interface AuthErrorProps {
    message: string
}

export function AuthError({ message }: AuthErrorProps) {
    return (
        <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
        >
            <OctagonXIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <Text variant="sm">{message}</Text>
        </div>
    )
}
