import { useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"
import { MERCHANT_TYPE_LABELS } from "../services/merchant-approval.mappers"
import type { MerchantSummary, MerchantType } from "../types/merchant-approval.types"
import { Building, StoreIcon } from "lucide-react"

function merchantInitials(name: string): string {
    const parts = name.trim().split(/\s+/).slice(0, 2)
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
    return initials || "?"
}

export function MerchantLogo({ logo, name, className }: { logo?: string | null; name: string; className?: string }) {
    const [hasError, setHasError] = useState(false)
    const showImage = Boolean(logo) && !hasError

    return (
        <span
            className={cn(
                "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-xs font-semibold text-muted-foreground ring-1 ring-border",
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
                // merchantInitials(name)
                <StoreIcon className="size-4 text-muted-foreground" />
            )}
        </span>
    )
}

export function ApprovalMerchantIdentity({ merchant }: { merchant: MerchantSummary | null }) {
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

export function MerchantTypeBadge({ type }: { type: MerchantType | null }) {
    if (!type) {
        return (
            <Text variant="xs" className="text-muted-foreground">
                -
            </Text>
        )
    }

    return (
        <Badge variant="secondary" className="py-4">
            {MERCHANT_TYPE_LABELS.individual ? (
                <StoreIcon className="mr-1 size-3" />
            ) : (
                <Building className="mr-1 size-3" />
            )}
            <Text variant="xs" weight="semibold">
                {MERCHANT_TYPE_LABELS[type]}
            </Text>
        </Badge>
    )
}

export function ServiceBadge({ name }: { name?: string | null }) {
    if (!name) {
        return (
            <Text variant="xs" className="text-muted-foreground">
                -
            </Text>
        )
    }

    return (
        <Badge variant="secondary" className="py-4">
            <Text variant="xs" weight="semibold">
                {name}
            </Text>
        </Badge>
    )
}
