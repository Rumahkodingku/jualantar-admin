type AnalyticsProps = Record<string, unknown>

export function trackEvent(name: string, props?: AnalyticsProps) {
    if (import.meta.env.DEV) {
        console.debug("[analytics]", name, props ?? {})
    }
}
