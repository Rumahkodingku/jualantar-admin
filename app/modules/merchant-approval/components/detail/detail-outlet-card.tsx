import { Camera, MapPin } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "~/components/ui/badge"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"
import { SERVICE_AREA_TYPE_LABELS, geographyLabel } from "../../services/merchant-approval.mappers"
import type { OutletSubjectData } from "../../types/merchant-approval.types"
import { DetailFieldGrid, DetailItem } from "./detail-detail-item"

function GroupLabel({ children }: { children: ReactNode }) {
    return (
        <Text variant="xs" weight="semibold" className="mb-2 text-muted-foreground">
            {children}
        </Text>
    )
}

export function DetailOutletCard({ outlet }: { outlet: OutletSubjectData }) {
    const isActive = outlet.status === "active"
    const hasCoords = Boolean(outlet.latitude && outlet.longitude)

    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Text variant="sm" weight="semibold" className="min-w-0 text-foreground">
                    {outlet.name}
                </Text>
                <Badge variant="secondary" className="gap-1.5">
                    <span
                        aria-hidden="true"
                        className={cn("size-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-muted-foreground/70")}
                    />
                    {isActive ? "Aktif" : "Nonaktif"}
                </Badge>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <GroupLabel>Kontak</GroupLabel>
                    <DetailFieldGrid>
                        <DetailItem label="Telepon" value={outlet.phone} />
                        <DetailItem label="Email" value={outlet.email} />
                    </DetailFieldGrid>
                </div>

                <div>
                    <GroupLabel>Lokasi</GroupLabel>
                    <DetailFieldGrid>
                        <DetailItem
                            label="Tipe Area Layanan"
                            value={
                                outlet.service_area_type
                                    ? (SERVICE_AREA_TYPE_LABELS[outlet.service_area_type] ?? outlet.service_area_type)
                                    : null
                            }
                        />
                        <DetailItem label="Radius (km)" value={outlet.service_radius_km} mono />
                        <DetailItem label="Kode Pos" value={outlet.postal_code} />
                        <DetailItem label="Wilayah" value={geographyLabel(outlet)} className="sm:col-span-2" />
                    </DetailFieldGrid>
                </div>

                <div>
                    <GroupLabel>Alamat</GroupLabel>
                    <DetailItem label="Alamat" value={outlet.address} />
                </div>
            </div>

            {(hasCoords || outlet.photos.length > 0) && (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3">
                    {hasCoords && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin aria-hidden="true" className="size-3.5" />
                            {outlet.latitude}, {outlet.longitude}
                        </span>
                    )}
                    {outlet.photos.length > 0 && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Camera aria-hidden="true" className="size-3.5" />
                            {outlet.photos.length} foto
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
