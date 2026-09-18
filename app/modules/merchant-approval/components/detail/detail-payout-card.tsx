import { Badge } from "~/components/ui/badge"
import { Text } from "~/components/ui/text"
import type { PayoutSubjectData } from "../../types/merchant-approval.types"
import { DetailFieldGrid, DetailItem } from "./detail-field"
import { maskMiddle } from "~/lib/mask"

export function DetailPayoutCard({ account }: { account: PayoutSubjectData }) {
    return (
        <div className="rounded-xl">
            <DetailFieldGrid>
                <DetailItem label="Bank" value={account.bank_name} prominent />
                <DetailItem label="Nomor Rekening" value={maskMiddle(account.account_number)} mono />
                <DetailItem label="Nama Pemilik" value={account.account_name} />
                <div className="min-w-0">
                    <Text variant="xs" weight="semibold">
                        Rekening Utama
                    </Text>
                    <div className="mt-1">
                        {account.is_primary ? (
                            <Badge className="p-4">Rekening Utama</Badge>
                        ) : (
                            <Text variant="sm" className="text-muted-foreground">
                                Bukan utama
                            </Text>
                        )}
                    </div>
                </div>
            </DetailFieldGrid>
        </div>
    )
}
