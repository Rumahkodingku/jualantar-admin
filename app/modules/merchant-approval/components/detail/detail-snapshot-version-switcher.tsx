import { History } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import { Text } from "~/components/ui/text"
import { formatDate } from "~/lib/format"
import { cn } from "~/lib/utils"
import type { CurrentSnapshot } from "../../types/merchant-approval.types"

interface DetailSnapshotVersionSwitcherProps {
    snapshots: CurrentSnapshot[]
    selectedVersion: number
    changedVersions?: Set<number>
    onSelect: (version: number) => void
}

export function DetailSnapshotVersionSwitcher({
    snapshots,
    selectedVersion,
    changedVersions,
    onSelect,
}: DetailSnapshotVersionSwitcherProps) {
    const latestVersion = snapshots[0]?.version

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
                <History aria-hidden="true" className="size-3.5 text-muted-foreground" />
                <Text variant="xs" weight="semibold" className="text-muted-foreground">
                    Riwayat Versi Data
                </Text>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih versi data">
                {snapshots.map((snapshot) => {
                    const isLatest = snapshot.version === latestVersion
                    const isSelected = snapshot.version === selectedVersion
                    const hasChanged = changedVersions?.has(snapshot.version) ?? false

                    return (
                        <button
                            key={snapshot.id}
                            type="button"
                            onClick={() => onSelect(snapshot.version)}
                            aria-pressed={isSelected}
                            className={cn(
                                "group inline-flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                                isSelected
                                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/25"
                                    : "border-border bg-card hover:bg-muted/40"
                            )}
                        >
                            <span className="flex min-w-0 flex-col">
                                <Text
                                    variant="xs"
                                    weight="bold"
                                    className={isSelected ? "text-primary" : "text-foreground"}
                                >
                                    Versi {snapshot.version}
                                </Text>
                                <Text variant="xs" className="text-muted-foreground">
                                    {formatDate(snapshot.submitted_at)}
                                </Text>
                            </span>

                            {isLatest && (
                                <Badge
                                    variant="secondary"
                                    className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                >
                                    Aktif
                                </Badge>
                            )}

                            {!isLatest && hasChanged && (
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                                >
                                    Berubah
                                </Badge>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
