import { Building, StoreIcon } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import { Text } from "~/components/ui/text"
import { MERCHANT_TYPE_LABELS } from "../../services/merchant-approval.labels"
import type { MerchantType } from "../../types/merchant-approval.types"

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
            {type === "company" ? <Building className="mr-1 size-3" /> : <StoreIcon className="mr-1 size-3" />}
            <Text variant="xs" weight="semibold">
                {MERCHANT_TYPE_LABELS[type]}
            </Text>
        </Badge>
    )
}