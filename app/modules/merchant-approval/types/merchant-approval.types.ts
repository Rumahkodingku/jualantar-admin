export const APPLICATION_STATUSES = [
    "draft",
    "pending",
    "in_review",
    "revision_required",
    "approved",
    "rejected",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const REVIEW_COMPONENTS = [
    "business",
    "identity",
    "legal_entity",
    "service",
    "category",
    "outlet",
    "document",
    "payout",
] as const

export type ReviewComponent = (typeof REVIEW_COMPONENTS)[number]

export const REVIEW_STATUSES = ["pending", "verified", "rejected"] as const

export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

export const REVISION_STATUSES = ["open", "resolved", "cancelled"] as const

export type RevisionStatus = (typeof REVISION_STATUSES)[number]

export type ApprovalDecision = "approved" | "rejected"

export type MerchantType = "individual" | "company"

export const APPROVAL_EVENT_TYPES = [
    "application_submitted",
    "approval_claimed",
    "approval_released",
    "component_reviewed",
    "revision_requested",
    "application_resubmitted",
    "application_approved",
    "application_rejected",
] as const

export type ApprovalEventType = (typeof APPROVAL_EVENT_TYPES)[number]

export interface ApprovalSummary {
    by_status: Record<ApplicationStatus, number>
    unassigned: number
    assigned_to_me: number
}

export interface MerchantSummary {
    id: string
    business_name: string
    slug: string
    type: MerchantType | null
    service: { id: string; name: string; slug: string } | null
}

export interface MerchantApplication {
    id: string
    merchant_id: string
    application_number: string
    status: ApplicationStatus
    submitted_at: string | null
    created_at: string | null
    updated_at: string | null
}

export interface ApprovalListItem {
    id: string
    application_id: string
    application: MerchantApplication | null
    merchant: MerchantSummary | null
    assigned_to: string | null
    assigned_at: string | null
    started_at: string | null
    completed_at: string | null
    decision: ApprovalDecision | null
    decision_reason: string | null
    created_at: string | null
    updated_at: string | null
}

export interface ApprovalActionResult {
    id: string
    application_id: string
    assigned_to: string | null
    assigned_at: string | null
    started_at: string | null
    completed_at: string | null
    decision: ApprovalDecision | null
    decision_reason: string | null
    created_at: string | null
    updated_at: string | null
}

export interface SnapshotSubject<TData> {
    subject_type: string
    subject_id: string
    data: TData
}

export interface SubjectGeography {
    village: string
    district: string
    regency: string
    province: string
}

export interface MerchantSubjectData {
    id: string
    business_name: string
    slug: string
    description: string | null
    type: MerchantType | null
    logo: string | null
    logo_url?: string | null
}

export interface IdentitySubjectData {
    id: string
    id_type: string
    id_number: string
    full_name: string
    birth_date: string | null
}

export interface LegalEntitySubjectData {
    id: string
    entity_type: string
    name: string
    nib: string | null
    npwp: string | null
    address: string | null
    village_id: string | null
    postal_code: string | null
    geography?: SubjectGeography | null
}

export interface ServiceSubjectData {
    id: string
    name?: string
    slug?: string
    description?: string
    icon?: string
    is_active?: boolean
}

export interface CategorySubjectData {
    id: string
    category_id: string
    name?: string
    slug?: string
}

export interface OutletSubjectData {
    id: string
    name: string
    phone: string | null
    email: string | null
    address: string | null
    village_id: string | null
    postal_code: string | null
    latitude: string | null
    longitude: string | null
    service_area_type: string
    service_radius_km: string | null
    operating_hours: unknown
    photos: string[]
    status: string
    geography?: SubjectGeography | null
}

export interface DocumentSubjectData {
    id: string
    document_type: string
    file_name: string
    object_key: string
    mime_type: string
    file_size: number
    url?: string | null
}

export interface PayoutSubjectData {
    id: string
    bank_id: string
    bank_name: string
    account_number: string
    account_name: string
    is_primary: boolean
}

export interface ApplicationSnapshotSubjects {
    merchant: SnapshotSubject<MerchantSubjectData> | null
    merchant_identity: SnapshotSubject<IdentitySubjectData> | null
    legal_entity: SnapshotSubject<LegalEntitySubjectData> | null
    service: SnapshotSubject<ServiceSubjectData> | null
    merchant_category: SnapshotSubject<CategorySubjectData>[]
    merchant_outlet: SnapshotSubject<OutletSubjectData>[]
    merchant_document: SnapshotSubject<DocumentSubjectData>[]
    payout_account: SnapshotSubject<PayoutSubjectData>[]
}

export interface ApplicationSnapshotData {
    version: number
    submitted_at: string
    merchant_type: MerchantType | null
    subjects: ApplicationSnapshotSubjects
}

export interface CurrentSnapshot {
    id: string
    version: number
    submitted_at: string | null
    data: ApplicationSnapshotData
}

export interface ApprovalReview {
    id: string
    approval_id: string
    component: ReviewComponent
    subject_type: string
    subject_id: string
    status: ReviewStatus
    note: string | null
    verified_by: string | null
    verified_at: string | null
    snapshot_id: string | null
    created_at: string | null
    updated_at: string | null
}

export interface ApprovalRevisionItem {
    id: string
    revision_id: string
    component: ReviewComponent
    subject_type: string
    subject_id: string
    reason: string
    resolved_at: string | null
    created_at: string | null
}

export interface ApprovalRevision {
    id: string
    approval_id: string
    requested_by: string | null
    note: string | null
    status: RevisionStatus
    requested_at: string | null
    resolved_at: string | null
    items: ApprovalRevisionItem[]
    created_at: string | null
}

export interface ApprovalEvent {
    id: string
    approval_id: string
    event_type: ApprovalEventType
    actor_id: string | null
    metadata: Record<string, unknown> | null
    created_at: string | null
}

export interface ApprovalDetailMerchant {
    id: string
    business_name: string
    slug: string
    type: MerchantType | null
    status: string
    service: { id: string; name: string; slug: string } | null
    owner: { id: string; email: string; phone: string | null } | null
    logo: string | null
    created_at: string | null
    updated_at: string | null
}

export interface ApprovalDetail {
    id: string
    application: MerchantApplication
    merchant: ApprovalDetailMerchant
    assigned_to: string | null
    assigned_at: string | null
    started_at: string | null
    completed_at: string | null
    decision: ApprovalDecision | null
    decision_reason: string | null
    current_snapshot: CurrentSnapshot | null
    reviews: ApprovalReview[]
    revisions: ApprovalRevision[]
    events: ApprovalEvent[]
    created_at: string | null
    updated_at: string | null
}

export interface ApprovalListParams {
    status?: ApplicationStatus
    assignment?: string
    search?: string
    sort?: ApprovalSortColumn
    order?: SortOrder
    page?: number
    per_page?: number
}

export type ApprovalSortColumn = "created_at" | "updated_at" | "assigned_at" | "started_at" | "completed_at"

export type SortOrder = "asc" | "desc"

export interface PaginationMeta {
    current_page: number
    per_page: number
    total: number
    last_page: number
}

export interface PaginatedApprovals {
    items: ApprovalListItem[]
    meta: PaginationMeta
}
