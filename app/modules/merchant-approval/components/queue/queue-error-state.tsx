import { TriangleAlert } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

export function QueueErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div
            role="alert"
            className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card p-8 text-center"
        >
            <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <TriangleAlert aria-hidden="true" className="size-5" />
            </span>
            <div className="max-w-sm">
                <Text variant="base" weight="semibold" className="text-foreground">
                    Antrean gagal dimuat.
                </Text>
                <Text variant="sm" className="mt-1 text-muted-foreground">
                    Terjadi kesalahan saat memuat daftar pengajuan. Silakan coba lagi.
                </Text>
            </div>
            <Button variant="outline" onClick={onRetry}>
                Coba Lagi
            </Button>
        </div>
    )
}
