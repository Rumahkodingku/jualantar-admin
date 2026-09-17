import type { ReactNode } from "react"
import { cn } from "~/lib/utils"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { Text } from "~/components/ui/text"
import { formatDate } from "~/lib/format"
import {
    geographyLabel,
    IDENTITY_TYPE_LABELS,
    LEGAL_ENTITY_TYPE_LABELS,
    MERCHANT_TYPE_LABELS,
    SERVICE_AREA_TYPE_LABELS,
} from "../../services/merchant-approval.mappers"
import type { ApplicationSnapshotData } from "../../types/merchant-approval.types"
import { DetailDocumentPreview } from "./detail-document-preview"

function SnapshotSection({
    value,
    title,
    description,
    children,
}: {
    value: string
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <AccordionItem value={value} className="rounded-xl border border-border bg-card px-4 not-last:border-b">
            <AccordionTrigger className="py-3.5 hover:no-underline">
                <div className="min-w-0">
                    <Text variant="sm" weight="semibold" className="text-foreground">
                        {title}
                    </Text>
                    {description && (
                        <Text variant="xs" className="mt-0.5 text-muted-foreground">
                            {description}
                        </Text>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
    )
}

function FieldGrid({ children }: { children: ReactNode }) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function DetailItem({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
    return (
        <div className="min-w-0">
            <Text variant="xs" className="text-muted-foreground">
                {label}
            </Text>
            <div className={cn("mt-0.5 text-sm wrap-break-word text-foreground", mono && "font-mono text-xs")}>
                {value === null || value === undefined || value === "" ? "-" : value}
            </div>
        </div>
    )
}

function EmptyText({ children }: { children: ReactNode }) {
    return (
        <Text variant="sm" className="text-muted-foreground">
            {children}
        </Text>
    )
}

export function DetailSnapshotSections({ snapshot }: { snapshot: ApplicationSnapshotData }) {
    const subjects = snapshot.subjects
    const business = subjects.merchant?.data
    const identity = subjects.merchant_identity?.data
    const legalEntity = subjects.legal_entity?.data
    const service = subjects.service?.data

    return (
        <Accordion multiple defaultValue={["business"]} className="gap-3">
            <SnapshotSection value="business" title="Bisnis">
                {business ? (
                    <FieldGrid>
                        <DetailItem label="Nama Bisnis" value={business.business_name} />
                        <DetailItem label="Slug" value={business.slug} mono />
                        <DetailItem
                            label="Tipe Merchant"
                            value={business.type ? MERCHANT_TYPE_LABELS[business.type] : null}
                        />
                        <div className="sm:col-span-2 lg:col-span-3">
                            <DetailItem label="Deskripsi" value={business.description} />
                        </div>
                    </FieldGrid>
                ) : (
                    <EmptyText>Data bisnis tidak tersedia.</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection value="identity" title="Identitas Pemilik">
                {identity ? (
                    <FieldGrid>
                        <DetailItem label="Nama Lengkap" value={identity.full_name} />
                        <DetailItem
                            label="Jenis Identitas"
                            value={IDENTITY_TYPE_LABELS[identity.id_type] ?? identity.id_type}
                        />
                        <DetailItem label="Nomor Identitas" value={identity.id_number} mono />
                        <DetailItem label="Tanggal Lahir" value={formatDate(identity.birth_date)} />
                    </FieldGrid>
                ) : (
                    <EmptyText>Data identitas tidak tersedia.</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection value="legal_entity" title="Badan Hukum">
                {legalEntity ? (
                    <FieldGrid>
                        <DetailItem label="Nama Badan Hukum" value={legalEntity.name} />
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
                    </FieldGrid>
                ) : (
                    <EmptyText>Tidak ada badan hukum (merchant perorangan).</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection value="service" title="Layanan">
                {service ? (
                    <FieldGrid>
                        <DetailItem label="Nama Layanan" value={service.name} />
                        <DetailItem label="Slug" value={service.slug} mono />
                    </FieldGrid>
                ) : (
                    <EmptyText>Data layanan tidak tersedia.</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection
                value="category"
                title="Kategori"
                description={`${subjects.merchant_category.length} kategori terdaftar`}
            >
                {subjects.merchant_category.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                        {subjects.merchant_category.map((category, index) => (
                            <li
                                key={category.subject_id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
                            >
                                <Text variant="sm" truncate className="text-foreground">
                                    {category.data.name ?? category.data.slug ?? `Kategori ${index + 1}`}
                                </Text>
                                <Text variant="xs" className="shrink-0 text-muted-foreground">
                                    {category.data.slug ? `#${category.data.slug}` : `Kategori ${index + 1}`}
                                </Text>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyText>Belum ada kategori.</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection
                value="outlet"
                title="Outlet"
                description={`${subjects.merchant_outlet.length} outlet aktif`}
            >
                {subjects.merchant_outlet.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {subjects.merchant_outlet.map((outlet) => (
                            <div key={outlet.subject_id} className="rounded-lg border border-border p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Text variant="sm" weight="medium" className="text-foreground">
                                        {outlet.data.name}
                                    </Text>
                                    <Text variant="xs" className="text-muted-foreground">
                                        {outlet.data.status === "active" ? "Aktif" : "Nonaktif"}
                                    </Text>
                                </div>
                                <div className="mt-3">
                                    <FieldGrid>
                                        <DetailItem label="Telepon" value={outlet.data.phone} />
                                        <DetailItem label="Email" value={outlet.data.email} />
                                        <DetailItem
                                            label="Tipe Area Layanan"
                                            value={
                                                SERVICE_AREA_TYPE_LABELS[outlet.data.service_area_type] ??
                                                outlet.data.service_area_type
                                            }
                                        />
                                        <DetailItem label="Radius (km)" value={outlet.data.service_radius_km} />
                                        <DetailItem label="Kode Pos" value={outlet.data.postal_code} />
                                        <DetailItem label="Wilayah" value={geographyLabel(outlet.data)} />
                                        <DetailItem label="Jumlah Foto" value={outlet.data.photos.length} />
                                        <div className="sm:col-span-2 lg:col-span-3">
                                            <DetailItem label="Alamat" value={outlet.data.address} />
                                        </div>
                                    </FieldGrid>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyText>Belum ada outlet.</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection
                value="document"
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
                    <EmptyText>Belum ada dokumen.</EmptyText>
                )}
            </SnapshotSection>

            <SnapshotSection
                value="payout"
                title="Pencairan Dana"
                description={`${subjects.payout_account.length} rekening terdaftar`}
            >
                {subjects.payout_account.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {subjects.payout_account.map((account) => (
                            <div key={account.subject_id} className="rounded-lg border border-border p-3">
                                <FieldGrid>
                                    <DetailItem label="Bank" value={account.data.bank_name} />
                                    <DetailItem label="Nomor Rekening" value={account.data.account_number} mono />
                                    <DetailItem label="Nama Pemilik" value={account.data.account_name} />
                                    <DetailItem
                                        label="Rekening Utama"
                                        value={account.data.is_primary ? "Ya" : "Tidak"}
                                    />
                                </FieldGrid>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyText>Belum ada rekening pencairan.</EmptyText>
                )}
            </SnapshotSection>
        </Accordion>
    )
}
