import { Building2, Contact, FileText, Landmark, Layers, MapPin, Store, Tags, type LucideIcon } from "lucide-react"
import { Accordion } from "~/components/ui/accordion"
import { Text } from "~/components/ui/text"
import { formatDate } from "~/lib/format"
import {
    geographyLabel,
    IDENTITY_TYPE_LABELS,
    LEGAL_ENTITY_TYPE_LABELS,
    MERCHANT_TYPE_LABELS,
} from "../../services/merchant-approval.mappers"
import type { ApplicationSnapshotData } from "../../types/merchant-approval.types"
import { DetailFieldGrid, DetailItem } from "./detail-detail-item"
import { DetailDocumentPreview } from "./detail-document-preview"
import { DetailOutletCard } from "./detail-outlet-card"
import { DetailPayoutCard } from "./detail-payout-card"
import { DetailSnapshotSection } from "./detail-snapshot-section"
import { maskMiddle } from "~/lib/mask"

function EmptyNote({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
                <Text variant="sm" weight="medium" className="text-foreground">
                    {title}
                </Text>
                <Text variant="xs" className="mt-0.5 text-muted-foreground">
                    {description}
                </Text>
            </div>
        </div>
    )
}

export function DetailSnapshotSections({ snapshot }: { snapshot: ApplicationSnapshotData }) {
    const subjects = snapshot.subjects
    const business = subjects.merchant?.data
    const identity = subjects.merchant_identity?.data
    const legalEntity = subjects.legal_entity?.data
    const service = subjects.service?.data
    const activeOutletCount = subjects.merchant_outlet.filter((outlet) => outlet.data.status === "active").length

    return (
        <Accordion multiple defaultValue={["business"]} className="gap-3">
            <DetailSnapshotSection
                value="business"
                icon={Store}
                title="Informasi Bisnis"
                description="Informasi utama merchant"
            >
                {business ? (
                    <DetailFieldGrid>
                        <DetailItem label="Nama Bisnis" value={business.business_name} prominent />
                        <DetailItem
                            label="Tipe Merchant"
                            value={business.type ? MERCHANT_TYPE_LABELS[business.type] : null}
                            prominent
                        />
                        <DetailItem label="Slug" value={business.slug} mono muted />
                        <div className="sm:col-span-2 lg:col-span-3">
                            <DetailItem label="Deskripsi Bisnis" value={business.description} />
                        </div>
                    </DetailFieldGrid>
                ) : (
                    <EmptyNote
                        icon={Store}
                        title="Data bisnis belum tersedia"
                        description="Informasi merchant tidak ditemukan pada snapshot pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="identity"
                icon={Contact}
                title="Identitas Pemilik"
                description="Identitas utama pemilik merchant"
            >
                {identity ? (
                    <DetailFieldGrid>
                        <DetailItem label="Nama Lengkap" value={identity.full_name} prominent />
                        <DetailItem
                            label="Jenis Identitas"
                            value={IDENTITY_TYPE_LABELS[identity.id_type] ?? identity.id_type}
                        />
                        <DetailItem label="Nomor Identitas" value={maskMiddle(identity.id_number)} mono />
                        <DetailItem label="Tanggal Lahir" value={formatDate(identity.birth_date)} />
                    </DetailFieldGrid>
                ) : (
                    <EmptyNote
                        icon={Contact}
                        title="Identitas pemilik belum tersedia"
                        description="Data identitas pemilik tidak ditemukan pada snapshot pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="legal_entity"
                description="Informasi badan hukum (Khusus merchant perusahaan)"
                icon={Building2}
                title="Badan Hukum"
            >
                {legalEntity ? (
                    <DetailFieldGrid>
                        <DetailItem label="Nama Badan Hukum" value={legalEntity.name} prominent />
                        <DetailItem
                            label="Jenis Badan Hukum"
                            value={LEGAL_ENTITY_TYPE_LABELS[legalEntity.entity_type] ?? legalEntity.entity_type}
                        />
                        <DetailItem label="NIB" value={legalEntity.nib} mono />
                        <DetailItem label="NPWP" value={legalEntity.npwp} mono />
                        <div className="sm:col-span-2">
                            <DetailItem label="Alamat" value={legalEntity.address} />
                        </div>
                        <DetailItem label="Wilayah" value={geographyLabel(legalEntity)} />
                        <DetailItem label="Kode Pos" value={legalEntity.postal_code} />
                    </DetailFieldGrid>
                ) : (
                    <EmptyNote
                        icon={Building2}
                        title="Tidak ada badan hukum"
                        description="Merchant terdaftar sebagai merchant perorangan."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="service"
                icon={Layers}
                title="Layanan"
                description="Layanan yang dipilih merchant."
            >
                {service ? (
                    <DetailFieldGrid>
                        <DetailItem label="Nama Layanan" value={service.name} prominent />
                        <DetailItem label="Slug" value={service.slug} mono muted />
                    </DetailFieldGrid>
                ) : (
                    <EmptyNote
                        icon={Layers}
                        title="Data layanan tidak tersedia"
                        description="Layanan tidak ditemukan pada snapshot pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="category"
                icon={Tags}
                title="Kategori"
                description={`${subjects.merchant_category.length} kategori terdaftar`}
            >
                {subjects.merchant_category.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                        {subjects.merchant_category.map((category, index) => (
                            <li
                                key={category.subject_id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 transition-colors hover:bg-muted/60"
                            >
                                <Text variant="sm" weight="medium" className="min-w-0 truncate text-foreground">
                                    {category.data.name ?? category.data.slug ?? `Kategori ${index + 1}`}
                                </Text>
                                <Text variant="xs" className="shrink-0 text-muted-foreground">
                                    {category.data.slug ? `#${category.data.slug}` : `Kategori ${index + 1}`}
                                </Text>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyNote
                        icon={Tags}
                        title="Belum ada kategori"
                        description="Merchant belum mendaftarkan kategori pada pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="outlet"
                icon={MapPin}
                title="Outlet"
                description={`${activeOutletCount} outlet aktif`}
            >
                {subjects.merchant_outlet.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {subjects.merchant_outlet.map((outlet) => (
                            <DetailOutletCard key={outlet.subject_id} outlet={outlet.data} />
                        ))}
                    </div>
                ) : (
                    <EmptyNote
                        icon={MapPin}
                        title="Belum ada outlet"
                        description="Merchant belum menambahkan outlet pada pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="document"
                icon={FileText}
                title="Dokumen"
                description={`${subjects.merchant_document.length} dokumen diunggah`}
            >
                {subjects.merchant_document.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {subjects.merchant_document.map((document) => (
                            <DetailDocumentPreview key={document.subject_id} document={document.data} />
                        ))}
                    </div>
                ) : (
                    <EmptyNote
                        icon={FileText}
                        title="Belum ada dokumen"
                        description="Merchant belum mengunggah dokumen pada pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>

            <DetailSnapshotSection
                value="payout"
                icon={Landmark}
                title="Pencairan Dana"
                description={`${subjects.payout_account.length} rekening terdaftar`}
            >
                {subjects.payout_account.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {subjects.payout_account.map((account) => (
                            <DetailPayoutCard key={account.subject_id} account={account.data} />
                        ))}
                    </div>
                ) : (
                    <EmptyNote
                        icon={Landmark}
                        title="Belum ada rekening pencairan"
                        description="Merchant belum menambahkan rekening pencairan pada pengajuan ini."
                    />
                )}
            </DetailSnapshotSection>
        </Accordion>
    )
}
