import { useState } from "react"
import { StoreIcon } from "lucide-react"

import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"
import type { MerchantSummary } from "../../types/merchant-approval.types"

export function MerchantLogo({ logo, name, className }: { logo?: string | null; name: string; className?: string }) {
    const [hasError, setHasError] = useState(false)
    const showImage = Boolean(logo) && !hasError

    return (
        <span
            className={cn(
                "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-xs font-semibold text-muted-foreground",
                className
            )}
        >
            {showImage ? (
                <img
                    src={logo ?? ""}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                    onError={() => setHasError(true)}
                />
            ) : (
                <StoreIcon className="size-4 text-muted-foreground" />
            )}
        </span>
    )
}

export function MerchantIdentity({ merchant }: { merchant: MerchantSummary | null }) {
    if (!merchant) {
        return (
            <Text variant="sm" className="text-muted-foreground">
                -
            </Text>
        )
    }

    return (
        <div className="flex min-w-0 items-center gap-3">
            <MerchantLogo logo={merchant.logo} name={merchant.business_name} />
            <div className="min-w-0">
                <Text variant="sm" weight="semibold" truncate className="text-foreground">
                    {merchant.business_name}
                </Text>
                <Text variant="xs" truncate className="text-muted-foreground">
                    {merchant.slug}
                </Text>
            </div>
        </div>
    )
}