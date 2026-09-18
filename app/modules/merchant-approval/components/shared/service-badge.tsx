import { Badge } from "~/components/ui/badge"
import { Text } from "~/components/ui/text"

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