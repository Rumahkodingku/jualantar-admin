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

function coordinates(outlet: OutletSubjectData): { lat: number; lng: number } | null {
    if (!outlet.latitude || !outlet.longitude) return null

    const lat = Number(outlet.latitude)
    const lng = Number(outlet.longitude)

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return null
    }

    return { lat, lng }
}

export function DetailOutletCard({ outlet }: { outlet: OutletSubjectData }) {
    const isActive = outlet.status === "active"
    const coords = coordinates(outlet)
    const photos = outlet.photos_url?.filter((url): url is string => Boolean(url)) ?? []

    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Text variant="sm" weight="bold" className="min-w-0 text-foreground">
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

            <div className="flex flex-col gap-4">
                <div>
                    <DetailFieldGrid>
                        <DetailItem label="Telepon" value={outlet.phone} />
                        <DetailItem label="Email" value={outlet.email} />
                    </DetailFieldGrid>
                </div>

                <div>
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
                    <DetailItem label="Alamat" value={outlet.address} />
                </div>

                <div>
                    <Text variant="xs" weight="semibold" className="mb-2 flex items-center gap-1.5">
                        <Camera aria-hidden="true" className="size-3.5" />
                        Foto Outlet
                    </Text>

                    {photos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {photos.map((photo, index) => (
                                <a
                                    key={photo}
                                    href={photo}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`Buka foto outlet ${index + 1}`}
                                    className="group overflow-hidden rounded-lg border border-border transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
                                >
                                    <img
                                        src={photo}
                                        alt={`Foto outlet ${outlet.name} ${index + 1}`}
                                        loading="lazy"
                                        className="aspect-4/3 w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <Text variant="xs" className="text-muted-foreground">
                            Tidak ada foto outlet.
                        </Text>
                    )}
                </div>

                {coords && (
                    <div className="mt-2">
                        <Text variant="xs" weight="semibold" className="mb-2 flex items-center gap-1.5">
                            <MapPin aria-hidden="true" className="size-3.5" />
                            Peta Lokasi
                        </Text>

                        <Text variant="xs" weight="medium" className="text-muted-foreground">
                            {outlet.latitude}, {outlet.longitude}
                        </Text>

                        <iframe
                            src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                            title={`Peta lokasi ${outlet.name}`}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            className="mt-2 h-56 w-full rounded-lg border border-border"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
