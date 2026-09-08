import { ShieldCheckIcon } from "lucide-react"

import { Text } from "~/components/ui/text"

export function AuthSecurityNotice() {
    return (
        <Text as="p" variant="xs" className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <ShieldCheckIcon className="size-4" aria-hidden="true" />
            Hanya untuk pengguna internal JualAntar
        </Text>
    )
}
