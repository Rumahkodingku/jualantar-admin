interface AuthHeaderProps {
    eyebrow: string
    title: string
    description: string
}

export function AuthHeader({ eyebrow, title, description }: AuthHeaderProps) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{eyebrow}</p>
            <h1 className="text-4xl font-black tracking-tight text-foreground">{title}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
    )
}
