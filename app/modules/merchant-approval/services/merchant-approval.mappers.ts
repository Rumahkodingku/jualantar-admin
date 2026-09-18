import type {
    ApplicationSnapshotData,
    ApplicationSnapshotSubjects,
    ApplicationStatus,
    ApprovalEvent,
    ApprovalEventType,
    ApprovalReview,
    MerchantStatus,
    MerchantType,
    ReviewComponent,
    ReviewStatus,
    RevisionStatus,
} from "../types/merchant-approval.types"

interface StatusMeta {
    label: string
    className: string
    dot: string
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
    draft: {
        label: "Draft",
        className: "bg-muted text-muted-foreground ring-border",
        dot: "bg-muted-foreground/70",
    },
    pending: {
        label: "Menunggu Review",
        className: "bg-amber-500/10 text-amber-700 ring-amber-600/30 dark:bg-amber-500/15 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    in_review: {
        label: "Sedang Direview",
        className: "bg-sky-500/10 text-sky-700 ring-sky-600/25 dark:bg-sky-500/15 dark:text-sky-400",
        dot: "bg-sky-500",
    },
    revision_required: {
        label: "Perlu Revisi",
        className: "bg-orange-500/10 text-orange-700 ring-orange-600/30 dark:bg-orange-500/15 dark:text-orange-400",
        dot: "bg-orange-500",
    },
    approved: {
        label: "Disetujui",
        className:
            "bg-emerald-500/10 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    rejected: {
        label: "Ditolak",
        className: "bg-red-500/10 text-red-700 ring-red-600/25 dark:bg-red-500/15 dark:text-red-400",
        dot: "bg-red-500",
    },
}

export const REVIEW_STATUS_META: Record<ReviewStatus, StatusMeta> = {
    pending: {
        label: "Belum Direview",
        className: "bg-muted text-muted-foreground ring-border",
        dot: "bg-muted-foreground/70",
    },
    verified: {
        label: "Terverifikasi",
        className:
            "bg-emerald-500/10 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    rejected: {
        label: "Ditolak",
        className: "bg-red-500/10 text-red-700 ring-red-600/25 dark:bg-red-500/15 dark:text-red-400",
        dot: "bg-red-500",
    },
}

export const REVISION_STATUS_META: Record<RevisionStatus, StatusMeta> = {
    open: {
        label: "Terbuka",
        className: "bg-amber-500/10 text-amber-700 ring-amber-600/30 dark:bg-amber-500/15 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    resolved: {
        label: "Selesai",
        className:
            "bg-emerald-500/10 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    cancelled: {
        label: "Dibatalkan",
        className: "bg-muted text-muted-foreground ring-border",
        dot: "bg-muted-foreground/70",
    },
}

export const MERCHANT_STATUS_META: Record<MerchantStatus, StatusMeta> = {
    inactive: {
        label: "Nonaktif",
        className: "bg-muted text-muted-foreground ring-border",
        dot: "bg-muted-foreground/70",
    },
    active: {
        label: "Aktif",
        className:
            "bg-emerald-500/10 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    suspended: {
        label: "Ditangguhkan",
        className: "bg-red-500/10 text-red-700 ring-red-600/25 dark:bg-red-500/15 dark:text-red-400",
        dot: "bg-red-500",
    },
}

export const REVIEW_COMPONENT_LABELS: Record<ReviewComponent, string> = {
    business: "Bisnis",
    identity: "Identitas",
    legal_entity: "Badan Hukum",
    service: "Layanan",
    category: "Kategori",
    outlet: "Outlet",
    document: "Dokumen",
    payout: "Pencairan Dana",
}

export const COMPONENT_SUBJECT_TYPE: Record<ReviewComponent, string> = {
    business: "merchant",
    identity: "merchant_identity",
    legal_entity: "legal_entity",
    service: "service",
    category: "merchant_category",
    outlet: "merchant_outlet",
    document: "merchant_document",
    payout: "payout_account",
}

export const EVENT_TYPE_LABELS: Record<ApprovalEventType, string> = {
    application_submitted: "Pengajuan dikirim",
    approval_claimed: "Review diklaim",
    approval_released: "Review dilepas",
    component_reviewed: "Komponen direview",
    revision_requested: "Revisi diminta",
    application_resubmitted: "Pengajuan dikirim ulang",
    application_approved: "Pengajuan disetujui",
    application_rejected: "Pengajuan ditolak",
}

export const MERCHANT_TYPE_LABELS: Record<MerchantType, string> = {
    individual: "Perorangan",
    company: "Perusahaan",
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
    ktp: "KTP",
    swafoto: "Swafoto",
    npwp: "NPWP",
    nib: "NIB",
    siup: "SIUP",
    izin_usaha: "Izin Usaha",
    akta_pendirian: "Akta Pendirian",
    identitas_direktur: "Identitas Direktur",
    rekening: "Rekening",
    foto_outlet: "Foto Outlet",
    lainnya: "Lainnya",
}

export const IDENTITY_TYPE_LABELS: Record<string, string> = {
    ktp: "KTP",
    sim: "SIM",
    paspor: "Paspor",
}

export const LEGAL_ENTITY_TYPE_LABELS: Record<string, string> = {
    pt: "PT",
    cv: "CV",
    ud: "UD",
    koperasi: "Koperasi",
    yayasan: "Yayasan",
}

export const SERVICE_AREA_TYPE_LABELS: Record<string, string> = {
    radius: "Radius",
    province: "Provinsi",
    regency: "Kabupaten/Kota",
    district: "Kecamatan",
    village: "Desa/Kelurahan",
}

export interface ReviewableSubject {
    component: ReviewComponent
    subjectType: string
    subjectId: string
    label: string
    data: Record<string, unknown>
}

function labelFor(component: ReviewComponent, data: Record<string, unknown>, index: number): string {
    switch (component) {
        case "business":
            return String(data.business_name ?? "Data bisnis")
        case "identity":
            return String(data.full_name ?? "Identitas pemilik")
        case "legal_entity":
            return String(data.name ?? "Badan hukum")
        case "service":
            return String(data.name ?? "Layanan")
        case "category":
            return String(data.name ?? `Kategori ${index + 1}`)
        case "outlet":
            return String(data.name ?? `Outlet ${index + 1}`)
        case "document":
            return `${DOCUMENT_TYPE_LABELS[String(data.document_type)] ?? "Dokumen"} · ${String(data.file_name ?? "")}`
        case "payout":
            return `${String(data.bank_name ?? "Bank")} · ${String(data.account_number ?? "")}`
        default:
            return "Komponen"
    }
}

const COMPONENT_ORDER: ReviewComponent[] = [
    "business",
    "identity",
    "legal_entity",
    "service",
    "category",
    "outlet",
    "document",
    "payout",
]

/** Flatten snapshot subjects into an ordered list of reviewable subjects. */
export function collectReviewableSubjects(snapshot: ApplicationSnapshotData | null): ReviewableSubject[] {
    if (!snapshot) return []

    const subjects = snapshot.subjects
    const result: ReviewableSubject[] = []

    for (const component of COMPONENT_ORDER) {
        const subjectType = COMPONENT_SUBJECT_TYPE[component]
        const entry = subjects[subjectType as keyof typeof subjects]

        if (entry === null || entry === undefined) continue

        const list = Array.isArray(entry) ? entry : [entry]

        list.forEach((subject, index) => {
            result.push({
                component,
                subjectType: subject.subject_type,
                subjectId: subject.subject_id,
                label: labelFor(component, subject.data as unknown as Record<string, unknown>, index),
                data: subject.data as unknown as Record<string, unknown>,
            })
        })
    }

    return result
}

export function findReview(
    reviews: ApprovalReview[],
    subjectType: string,
    subjectId: string
): ApprovalReview | undefined {
    return reviews.find((review) => review.subject_type === subjectType && review.subject_id === subjectId)
}

export interface ReviewProgress {
    total: number
    verified: number
    rejected: number
    pending: number
}

export function summarizeReviewProgress(subjects: ReviewableSubject[], reviews: ApprovalReview[]): ReviewProgress {
    let verified = 0
    let rejected = 0

    for (const subject of subjects) {
        const review = findReview(reviews, subject.subjectType, subject.subjectId)

        if (review?.status === "verified") verified += 1
        else if (review?.status === "rejected") rejected += 1
    }

    return {
        total: subjects.length,
        verified,
        rejected,
        pending: subjects.length - verified - rejected,
    }
}

export function formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"

    const units = ["B", "KB", "MB", "GB"]
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    const value = bytes / 1024 ** exponent

    return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

export interface SubjectField {
    label: string
    value: string
}

/** Format a resolved geography object as "village, district, regency, province". */
export function geographyLabel(data: { geography?: unknown }): string {
    const geography = data.geography

    if (!geography || typeof geography !== "object") return "-"

    const { village, district, regency, province } = geography as Record<string, unknown>
    const parts = [village, district, regency, province].filter(
        (part): part is string => typeof part === "string" && part.trim() !== ""
    )

    return parts.length > 0 ? parts.join(", ") : "-"
}

/** Compact read-only fields shown on a review card. */
export function subjectFields(component: ReviewComponent, data: Record<string, unknown>): SubjectField[] {
    const text = (key: string): string => {
        const value = data[key]
        if (value === null || value === undefined || value === "") return "-"
        return String(value)
    }

    switch (component) {
        case "business":
            return [
                { label: "Nama Bisnis", value: text("business_name") },
                {
                    label: "Tipe",
                    value: data.type ? (MERCHANT_TYPE_LABELS[data.type as MerchantType] ?? text("type")) : "-",
                },
            ]
        case "identity":
            return [
                { label: "Nama Lengkap", value: text("full_name") },
                { label: "Jenis Identitas", value: IDENTITY_TYPE_LABELS[text("id_type")] ?? text("id_type") },
                { label: "Nomor Identitas", value: text("id_number") },
            ]
        case "legal_entity":
            return [
                { label: "Nama", value: text("name") },
                { label: "Jenis", value: LEGAL_ENTITY_TYPE_LABELS[text("entity_type")] ?? text("entity_type") },
                { label: "NIB", value: text("nib") },
                { label: "NPWP", value: text("npwp") },
                { label: "Wilayah", value: geographyLabel(data) },
            ]
        case "service":
            return [
                { label: "Nama Layanan", value: text("name") },
                { label: "Slug", value: text("slug") },
            ]
        case "category":
            return [{ label: "Nama Kategori", value: text("name") === "-" ? text("slug") : text("name") }]
        case "outlet":
            return [
                { label: "Nama Outlet", value: text("name") },
                { label: "Telepon", value: text("phone") },
                { label: "Alamat", value: text("address") },
                { label: "Wilayah", value: geographyLabel(data) },
            ]
        case "document":
            return [
                { label: "Jenis Dokumen", value: DOCUMENT_TYPE_LABELS[text("document_type")] ?? text("document_type") },
                { label: "Nama File", value: text("file_name") },
            ]
        case "payout":
            return [
                { label: "Bank", value: text("bank_name") },
                { label: "Nomor Rekening", value: text("account_number") },
                { label: "Nama Pemilik", value: text("account_name") },
            ]
        default:
            return []
    }
}

export type SnapshotSectionKey =
    "business" | "identity" | "legal_entity" | "service" | "category" | "outlet" | "document" | "payout"

export const SNAPSHOT_SECTION_BY_SUBJECT: Record<keyof ApplicationSnapshotSubjects, SnapshotSectionKey> = {
    merchant: "business",
    merchant_identity: "identity",
    legal_entity: "legal_entity",
    service: "service",
    merchant_category: "category",
    merchant_outlet: "outlet",
    merchant_document: "document",
    payout_account: "payout",
}

/** Enrichment-only fields that vary between requests (signed URLs, derived labels). */
const ENRICHMENT_KEYS = new Set(["logo_url", "photos_url", "url", "geography"])

function stripEnrichment(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(stripEnrichment)

    if (value !== null && typeof value === "object") {
        const result: Record<string, unknown> = {}

        for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
            if (ENRICHMENT_KEYS.has(key)) continue
            result[key] = stripEnrichment(child)
        }

        return result
    }

    return value
}

function normalizeSubjects(snapshot: ApplicationSnapshotData): Record<string, unknown> {
    const normalized: Record<string, unknown> = {}

    for (const [subjectType, entry] of Object.entries(snapshot.subjects)) {
        if (entry === null || entry === undefined) continue

        const list = Array.isArray(entry) ? entry : [entry]
        normalized[subjectType] = Object.fromEntries(
            list.map((subject) => [subject.subject_id, stripEnrichment(subject.data)])
        )
    }

    return normalized
}

/**
 * Compare two snapshot versions and return the section keys whose submitted
 * data differs. Enrichment-only fields (temporary signed URLs, derived
 * geography labels) are ignored so revisions are not falsely flagged.
 */
export function diffSnapshotSubjects(
    previous: ApplicationSnapshotData,
    current: ApplicationSnapshotData
): Set<SnapshotSectionKey> {
    const changed = new Set<SnapshotSectionKey>()
    const prev = normalizeSubjects(previous)
    const curr = normalizeSubjects(current)

    for (const [subjectType, sectionKey] of Object.entries(SNAPSHOT_SECTION_BY_SUBJECT)) {
        if (JSON.stringify(prev[subjectType]) !== JSON.stringify(curr[subjectType])) {
            changed.add(sectionKey)
        }
    }

    return changed
}

export function eventActorLabel(event: ApprovalEvent, currentUserId: string | undefined): string {
    if (!event.actor_id) return "Sistem"
    if (currentUserId && event.actor_id === currentUserId) return "Anda"
    return "Administrator"
}
