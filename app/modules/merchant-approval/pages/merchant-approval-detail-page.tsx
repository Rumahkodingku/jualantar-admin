import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router"

import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { Text } from "~/components/ui/text"
import { ApiError } from "~/lib/api"
import { ApprovalDetailView } from "../components/approval-detail"
import { useApproval } from "../services/merchant-approval.queries"

function DetailSkeleton() {
    return (
        <div className="flex flex-col gap-5" aria-busy="true" aria-label="Memuat detail approval">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-9 w-80 rounded-lg" />
            <div className="grid gap-4 xl:grid-cols-2">
                <Skeleton className="h-52 rounded-xl" />
                <Skeleton className="h-52 rounded-xl" />
            </div>
        </div>
    )
}

export function MerchantApprovalDetailPage() {
    const { approvalId = "" } = useParams()
    const { data, isLoading, isError, error, refetch } = useApproval(approvalId)

    const isNotFound = error instanceof ApiError && error.status === 404

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
            <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                nativeButton={false}
                render={<Link to="/merchant-approvals/queue" />}
            >
                <ArrowLeft aria-hidden="true" />
                Kembali ke Antrean
            </Button>

            {isLoading ? (
                <DetailSkeleton />
            ) : isError ? (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card p-8">
                    <div className="flex max-w-sm flex-col items-center gap-4 text-center">
                        <div>
                            <Text variant="base" weight="semibold" className="text-foreground">
                                {isNotFound ? "Pengajuan tidak ditemukan." : "Detail gagal dimuat."}
                            </Text>
                            <Text variant="sm" className="mt-1 text-muted-foreground">
                                {isNotFound
                                    ? "Pengajuan yang Anda cari tidak tersedia atau telah dihapus."
                                    : "Terjadi kesalahan saat memuat detail pengajuan. Silakan coba lagi."}
                            </Text>
                        </div>
                        {!isNotFound && (
                            <Button variant="outline" onClick={() => refetch()}>
                                Coba lagi
                            </Button>
                        )}
                    </div>
                </div>
            ) : data ? (
                <ApprovalDetailView approval={data} />
            ) : null}
        </div>
    )
}
