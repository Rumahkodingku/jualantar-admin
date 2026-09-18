import { Copy, Image, MapPin, StoreIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Text } from "~/components/ui/text"
import { formatDateTime, formatRelativeDate } from "~/lib/format"
import type { ApprovalDetail } from "../../types/merchant-approval.types"
import { MerchantLogo } from "../shared/merchant-identity"
import { MerchantTypeBadge } from "../shared/merchant-type-badge"
import { Reviewer } from "../shared/reviewer"
import { ServiceBadge } from "../shared/service-badge"
import { ApprovalTimeline, type ApprovalStep } from "./approval-timeline"

interface DetailMerchantSummaryProps {
    approval: ApprovalDetail
    currentUserId?: string
    timelineSteps: ApprovalStep[]
}

export function DetailMerchantSummary({ approval, currentUserId, timelineSteps }: DetailMerchantSummaryProps) {
    const merchantLogo = approval.current_snapshot?.data.subjects.merchant?.data.logo_url ?? approval.merchant.logo
    const merchantType = approval.current_snapshot?.data.merchant_type ?? approval.merchant.type
    const merchantDescription = approval.current_snapshot?.data.subjects.merchant?.data.description ?? null
    const merchantAddress =
        approval.current_snapshot?.data.subjects.merchant_outlet[0]?.data.address ??
        approval.current_snapshot?.data.subjects.legal_entity?.data.address ??
        null
    const merchantPhoto = approval.current_snapshot?.data.subjects.merchant_outlet[0]?.data.photos_url?.[0] ?? null
    const serviceName =
        approval.current_snapshot?.data?.subjects?.service?.data?.name ?? approval.merchant.service?.name ?? null

    const handleViewPhoto = () => {
        if (merchantPhoto) window.open(merchantPhoto, "_blank", "noopener,noreferrer")
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="px-6">
                    {merchantLogo ? (
                        <MerchantLogo
                            logo={merchantLogo}
                            name={approval.merchant.business_name}
                            className="size-14 shrink-0 rounded-xl text-sm"
                        />
                    ) : (
                        <div className="mb-2 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                            <StoreIcon />
                        </div>
                    )}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Text
                                            as="h1"
                                            variant="xl"
                                            weight="bold"
                                            className="truncate text-foreground"
                                        >
                                            {approval.merchant.business_name}
                                        </Text>
                                    </div>

                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                        <Text variant="xs" className="text-muted-foreground">
                                            {approval.merchant.slug}
                                        </Text>

                                        <span className="text-muted-foreground/40">-</span>

                                        <MerchantTypeBadge type={merchantType} />

                                        <span className="text-muted-foreground/40">-</span>

                                        <ServiceBadge name={serviceName} />
                                    </div>

                                    <div className="mt-2 space-y-1">
                                        {merchantDescription && (
                                            <Text variant="xs" className="text-muted-foreground">
                                                {merchantDescription}
                                            </Text>
                                        )}

                                        {merchantAddress && (
                                            <div className="mt-6 flex items-center gap-1.5">
                                                <MapPin
                                                    aria-hidden="true"
                                                    className="size-3.5 shrink-0 text-muted-foreground"
                                                />

                                                <Text variant="xs" className="truncate text-muted-foreground">
                                                    {merchantAddress}
                                                </Text>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
                                        <div className="min-w-0">
                                            <Text variant="xs" className="text-muted-foreground">
                                                No. Pengajuan
                                            </Text>

                                            <div className="mt-1 flex min-w-0 items-center gap-1.5">
                                                <Text
                                                    variant="xs"
                                                    weight="semibold"
                                                    className="truncate text-foreground"
                                                >
                                                    {approval.application.application_number}
                                                </Text>

                                                <Button
                                                    variant="ghost"
                                                    size="icon-xs"
                                                    className="size-5 shrink-0"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            approval.application.application_number
                                                        )
                                                    }
                                                    aria-label="Salin nomor pengajuan"
                                                >
                                                    <Copy aria-hidden="true" className="size-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <Text variant="xs" className="text-muted-foreground">
                                                Layanan
                                            </Text>

                                            <div className="mt-1 flex items-center gap-2">
                                                <Text
                                                    variant="xs"
                                                    weight="semibold"
                                                    className="truncate text-foreground"
                                                >
                                                    {serviceName}
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <Text variant="xs" className="text-muted-foreground">
                                                Tanggal Pengajuan
                                            </Text>

                                            <div className="mt-1 flex items-start gap-2">
                                                <div className="flex min-w-0 flex-col">
                                                    <Text
                                                        variant="xs"
                                                        weight="semibold"
                                                        className="truncate text-foreground"
                                                    >
                                                        {formatDateTime(approval.application.created_at)}
                                                    </Text>

                                                    <Text
                                                        variant="xs"
                                                        className="mt-1 text-muted-foreground italic"
                                                    >
                                                        {formatRelativeDate(approval.application.created_at)}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <Text variant="xs" className="text-muted-foreground">
                                                Reviewer
                                            </Text>

                                            <div className="mt-1 flex items-center gap-2">
                                                <div className="min-w-0">
                                                    <div className="truncate">
                                                        <Reviewer
                                                            assignedTo={approval.assigned_to}
                                                            currentUserId={currentUserId}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted sm:h-44 xl:w-72">
                            {merchantPhoto ? (
                                <img
                                    src={merchantPhoto}
                                    alt={`Foto ${approval.merchant.business_name}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted-foreground">
                                    Tidak ada foto
                                </div>
                            )}

                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute right-2.5 bottom-2.5 gap-1.5 bg-background/95 shadow-sm backdrop-blur-sm hover:bg-background"
                                onClick={handleViewPhoto}
                            >
                                <Image aria-hidden="true" className="size-3.5" />
                                Lihat Foto
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <ApprovalTimeline steps={timelineSteps} label="Status pengajuan" className="w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}