import { RotateCw, TriangleAlert } from "lucide-react"

import { Button } from "~/components/ui/button"

export function DashboardError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-card p-8">
            <div className="flex max-w-sm flex-col items-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                    <TriangleAlert aria-hidden="true" className="size-5" />
                </span>
                <div>
                    <p className="font-heading text-base font-semibold text-foreground">Data gagal dimuat.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Terjadi kesalahan saat memuat ringkasan dashboard. Silakan coba lagi.
                    </p>
                </div>
                <Button type="button" variant="outline" onClick={onRetry}>
                    <RotateCw aria-hidden="true" />
                    Coba lagi
                </Button>
            </div>
        </div>
    )
}
