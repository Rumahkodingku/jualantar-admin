import { Text } from "~/components/ui/text"

interface AuthHeaderProps {
    eyebrow: string
    title: string
    description: string
}

export function AuthHeader({ eyebrow, title, description }: AuthHeaderProps) {
    return (
        <div className="flex flex-col gap-2">
            <Text variant="xs" transform="uppercase" className="font-semibold tracking-widest text-muted-foreground">
                {eyebrow}
            </Text>
            <Text as="h1" variant="4xl" className="font-black tracking-tight text-foreground">
                {title}
            </Text>
            <Text variant="sm" className="leading-relaxed text-muted-foreground">
                {description}
            </Text>
        </div>
    )
}
