import { formatDate } from "~/lib/format"
import { maskMiddle } from "~/lib/mask"
import {
    DOCUMENT_TYPE_LABELS,
    IDENTITY_TYPE_LABELS,
    LEGAL_ENTITY_TYPE_LABELS,
    MERCHANT_TYPE_LABELS,
} from "./merchant-approval.labels"
import type {
    ApplicationSnapshotData,
    ApplicationSnapshotSubjects,
    ApprovalEvent,
    ApprovalReview,
    MerchantType,
    ReviewComponent,
    ReviewStatus,
} from "../types/merchant-approval.types"

export const COMPONENT_ORDER: ReviewComponent[] = [
    "business",
    "identity",
    "legal_entity",
    "service",
    "category",
    "outlet",
    "document",
    "payout",
]

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

export interface ReviewableSubject {
    component: ReviewComponent
    subjectType: string
    subjectId: string
    label: string
    data: Record<string, unknown>
}

export interface ComponentSubjectGroup {
    component: ReviewComponent
    subjects: ReviewableSubject[]
}

/** Stable unique key for a reviewable subject. */
export function subjectKey(subject: ReviewableSubject): string {
    return `${subject.subjectType}:${subject.subjectId}`
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

/** Group flattened reviewable subjects into ordered component groups. */
export function groupSubjectsByComponent(subjects: ReviewableSubject[]): ComponentSubjectGroup[] {
    const grouped = new Map<ReviewComponent, ReviewableSubject[]>()

    for (const subject of subjects) {
        const list = grouped.get(subject.component)
        if (list) list.push(subject)
        else grouped.set(subject.component, [subject])
    }

    return COMPONENT_ORDER.map((component) => ({
        component,
        subjects: grouped.get(component) ?? [],
    }))
}

/** Derive a single header status for a component from its subject statuses. */
export function deriveComponentReviewStatus(statuses: ReviewStatus[]): ReviewStatus {
    if (statuses.length === 0) return "pending"
    if (statuses.every((status) => status === "verified")) return "verified"
    if (statuses.every((status) => status === "rejected")) return "rejected"
    return "pending"
}

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
                ...(data.description ? [{ label: "Deskripsi", value: text("description") }] : []),
            ]
        case "identity":
            return [
                { label: "Nama Lengkap", value: text("full_name") },
                { label: "Jenis Identitas", value: IDENTITY_TYPE_LABELS[text("id_type")] ?? text("id_type") },
                { label: "Nomor Identitas", value: maskMiddle(text("id_number")) },
                { label: "Tanggal Lahir", value: formatDate(data.birth_date as string | null | undefined) },
            ]
        case "legal_entity":
            return [
                { label: "Nama", value: text("name") },
                { label: "Jenis", value: LEGAL_ENTITY_TYPE_LABELS[text("entity_type")] ?? text("entity_type") },
                { label: "NIB", value: text("nib") },
                { label: "NPWP", value: text("npwp") },
                { label: "Alamat", value: text("address") },
                { label: "Wilayah", value: geographyLabel(data) },
                { label: "Kode Pos", value: text("postal_code") },
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