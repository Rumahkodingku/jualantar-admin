import type {
    ApplicationStatus,
    ApprovalEventType,
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

export const REVIEW_COMPONENT_TITLES: Record<ReviewComponent, string> = {
    business: "Informasi Bisnis",
    identity: "Identitas Pemilik",
    legal_entity: "Badan Hukum",
    service: "Layanan",
    category: "Kategori",
    outlet: "Outlet",
    document: "Dokumen",
    payout: "Pencairan Dana",
}

export const REVIEW_COMPONENT_DESCRIPTIONS: Record<ReviewComponent, string> = {
    business: "Informasi bisnis, tipe merchant, deskripsi, dan informasi dasar lainnya.",
    identity: "Nama lengkap, jenis identitas, nomor identitas, dan tanggal lahir.",
    legal_entity: "Informasi badan hukum untuk merchant perusahaan.",
    service: "Layanan yang diajukan oleh merchant.",
    category: "Kategori produk/layanan.",
    outlet: "Informasi outlet, alamat, kontak, dan area layanan.",
    document: "KTP, NPWP, rekening, swafoto, dan dokumen pendukung lainnya.",
    payout: "Informasi rekening bank untuk pencairan dana.",
}

export const REVIEW_COMPONENT_GUIDES: Record<ReviewComponent, string> = {
    business: "Verifikasi kesesuaian informasi bisnis dengan dokumen pendukung.",
    identity: "Verifikasi kecocokan identitas pemilik dengan dokumen identitas.",
    legal_entity: "Verifikasi keabsahan dokumen dan data badan hukum.",
    service: "Pastikan layanan yang diajukan sesuai dengan layanan merchant.",
    category: "Pastikan kategori yang dipilih sesuai dengan jenis layanan merchant.",
    outlet: "Verifikasi kebenaran alamat, kontak, dan area layanan outlet.",
    document: "Pastikan dokumen valid, terbaca, dan sesuai dengan ketentuan.",
    payout: "Verifikasi keabsahan rekening untuk pencairan dana.",
}

export const REVIEW_COMPONENT_EMPTY_STATE: Record<ReviewComponent, { title: string; description: string }> = {
    business: {
        title: "Data bisnis belum tersedia",
        description: "Informasi merchant tidak ditemukan pada snapshot pengajuan ini.",
    },
    identity: {
        title: "Identitas pemilik belum tersedia",
        description: "Data identitas pemilik tidak ditemukan pada snapshot pengajuan ini.",
    },
    legal_entity: {
        title: "Tidak ada badan hukum",
        description: "Merchant terdaftar sebagai merchant perorangan.",
    },
    service: {
        title: "Data layanan tidak tersedia",
        description: "Layanan tidak ditemukan pada snapshot pengajuan ini.",
    },
    category: {
        title: "Belum ada kategori",
        description: "Merchant belum mendaftarkan kategori pada pengajuan ini.",
    },
    outlet: {
        title: "Belum ada outlet",
        description: "Merchant belum menambahkan outlet pada pengajuan ini.",
    },
    document: {
        title: "Belum ada dokumen",
        description: "Merchant belum mengunggah dokumen pada pengajuan ini.",
    },
    payout: {
        title: "Belum ada rekening pencairan",
        description: "Merchant belum menambahkan rekening pencairan pada pengajuan ini.",
    },
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