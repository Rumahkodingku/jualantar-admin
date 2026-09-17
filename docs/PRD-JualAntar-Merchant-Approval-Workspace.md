# PRD — Merchant Approval Detail Workspace

## JualAntar Admin

**Status:** Ready for Implementation  
**Module:** Merchant Approval  
**Route:** `/merchant-approvals/:id`  
**Primary Goal:** Redesign the Merchant Approval detail page into a complete approval workspace based on the target UI reference, while preserving all existing business logic, API contracts, permissions, data models, and approval workflow.

---

# 1. Document Purpose

Dokumen ini menjadi **PRD utama** untuk redesign halaman Detail Pengajuan Merchant pada JualAntar Admin.

PRD ini tidak hanya mengatur Tab Data Merchant. Scope utamanya adalah keseluruhan **Merchant Approval Detail Workspace**, yang terdiri dari:

- Merchant Summary
- Approval Progress
- Approval Actions
- Tab Navigation
- Main Content
- Contextual Sidebar
- Data Merchant
- Review Komponen
- Riwayat Revisi
- Timeline
- Responsive behavior
- Visual QA

Dokumen PRD lama yang hanya membahas redesign Tab Data Merchant dapat digunakan sebagai **sub-reference** untuk detail field dan presentation layer Data Merchant.

---

# 2. Source of Truth

Implementasi harus menggunakan urutan prioritas berikut:

1. **Target screenshot/reference** → source of truth untuk visual layout dan hierarchy.
2. **PRD ini** → source of truth untuk struktur, UX, behavior, constraints, dan acceptance criteria.
3. **Existing codebase** → source of truth untuk API, data model, permissions, queries, mutations, routing, dan business logic.
4. **Current screenshot** → baseline untuk mengetahui masalah implementasi saat ini.

Jangan mengubah struktur UI target menjadi desain lain hanya karena implementasi existing menggunakan accordion.

Jika terdapat konflik:

- Jangan mengubah business logic untuk memenuhi visual.
- Jangan mengubah API/data contract.
- Adaptasikan presentation layer terhadap data dan workflow existing.
- Target screenshot menjadi referensi visual utama.

---

# 3. Background

Halaman Merchant Approval saat ini sudah memiliki business logic approval yang mencakup:

- Claim review
- Release review
- Component review
- Request revision
- Reject
- Approve
- Approval status
- Reviewer assignment
- Revision history
- Approval events/timeline

Masalah utama berada pada **presentation dan workspace composition**.

Halaman perlu terasa seperti workspace yang digunakan reviewer untuk melakukan verifikasi merchant, bukan sekadar halaman dump data atau kumpulan accordion.

Reviewer harus dapat memahami dalam waktu singkat:

1. Merchant apa yang sedang diperiksa.
2. Status pengajuan.
3. Siapa reviewer-nya.
4. Tahap approval saat ini.
5. Data apa yang harus diperiksa.
6. Ringkasan status komponen.
7. Catatan reviewer.
8. Action apa yang tersedia.

---

# 4. Goals

## P0

- Membuat Merchant Approval Detail menjadi approval workspace.
- Mengikuti hierarchy visual target screenshot.
- Membuat main content dan contextual sidebar.
- Menampilkan merchant summary yang informatif.
- Menampilkan approval progress secara jelas.
- Menempatkan approval actions pada area yang mudah ditemukan.
- Mempertahankan semua business logic existing.
- Mempertahankan seluruh permission rules.
- Mempertahankan API dan query/mutation existing.

## P1

- Meningkatkan scanability data merchant.
- Memperjelas component review status.
- Memudahkan reviewer melihat revision history.
- Memudahkan reviewer membaca timeline.
- Meningkatkan responsive behavior.

## P2

- Micro-interactions.
- Subtle transitions.
- Additional visual polish.

---

# 5. Non-Goals

Jangan melakukan hal berikut:

- Mengubah API contract.
- Mengubah `ApprovalDetail`.
- Mengubah application status.
- Mengubah review status.
- Mengubah revision status.
- Mengubah approval decision semantics.
- Mengubah permission model.
- Mengubah assignment behavior.
- Mengubah endpoint.
- Mengubah query/mutation semantics.
- Menambahkan fitur edit merchant.
- Mengubah workflow approval.
- Mengubah business rules hanya demi desain.
- Menghapus tab existing.
- Mengganti framework/component library tanpa alasan teknis yang kuat.

---

# 6. Existing Business Logic Constraints

Existing approval behavior harus tetap bekerja.

Permission yang sudah digunakan oleh halaman:

- `merchant.approval.claim`
- `merchant.approval.review`
- `merchant.approval.revision`
- `merchant.approval.reject`
- `merchant.approval.approve`

Action availability tetap mengikuti logic existing:

- Claim Review
- Release Review
- Review Component
- Request Revision
- Reject
- Approve

Jangan memindahkan business rules ke UI baru.

UI hanya menjadi presentation layer terhadap behavior existing.

---

# 7. Target Page Structure

Struktur halaman yang diharapkan:

```text
Merchant Approval Detail
│
├── Breadcrumb
│
├── Page Header
│   ├── Title
│   ├── Description
│   └── Approval Actions
│
├── Merchant Summary Card
│
├── Approval Progress
│
├── Tab Navigation
│   ├── Data Merchant
│   ├── Review Komponen
│   ├── Riwayat Revisi
│   └── Timeline
│
└── Workspace
    │
    ├── Main Content
    │   └── Active Tab Content
    │
    └── Contextual Sidebar
        ├── Status & Actions
        ├── Informasi Reviewer
        ├── Ringkasan Komponen
        ├── Catatan Reviewer
        └── Timeline Approval
```

---

# 8. Page Header

Header harus memiliki:

### Breadcrumb

Contoh:

```text
Merchant Approval / Detail Pengajuan
```

### Title

```text
Detail Pengajuan Merchant
```

### Description

Gunakan deskripsi singkat yang menjelaskan bahwa halaman digunakan untuk memeriksa dan memproses pengajuan merchant.

### Actions

Area kanan atas:

```text
[⋯] [Minta Revisi] [Tolak] [Setujui]
```

Action harus:

- Menggunakan permission existing.
- Menggunakan mutation existing.
- Menggunakan dialog existing jika tersedia.
- Mengikuti status/assignment rules existing.
- Tidak membuat action baru yang tidak didukung backend.

Jika action tidak boleh digunakan, jangan hanya menyembunyikan alasan secara visual. Pertahankan semantics permission/status yang sudah ada.

---

# 9. Merchant Summary Card

Di bawah page header tampilkan merchant summary.

## Informasi utama

Tampilkan:

- Merchant logo jika tersedia.
- Nama bisnis.
- Slug.
- Tipe merchant.
- Deskripsi.
- Lokasi.
- Nomor pengajuan.
- Layanan.
- Tanggal pengajuan.
- Reviewer.

## Visual hierarchy

Nama bisnis harus menjadi informasi paling menonjol.

Slug dan identifier menjadi metadata.

Status menggunakan semantic badge.

Nomor pengajuan dapat menggunakan monospace.

## Merchant image

Jika snapshot/API menyediakan gambar merchant:

- tampilkan pada sisi kanan summary card desktop.
- gunakan object-fit yang sesuai.
- jangan menyebabkan card menjadi terlalu tinggi.
- pada mobile image dapat berpindah ke bagian atas atau menjadi full-width media.

Jika data image tidak tersedia:

- gunakan empty state yang subtle.
- jangan membuat broken image.

---

# 10. Approval Progress

Tampilkan horizontal approval progress setelah merchant summary.

Tahapan:

```text
Pengajuan
    ↓
Review Diklaim
    ↓
Komponen Direview
    ↓
Pengajuan Disetujui
```

Representasikan sebagai progress/timeline horizontal.

Progress harus berasal dari state existing, bukan state UI baru.

Status yang harus dapat dibedakan:

- Completed
- Current
- Pending

Gunakan semantic styling.

Jangan menggunakan warna sebagai satu-satunya indikator.

---

# 11. Tab Navigation

Pertahankan empat tab existing:

```text
Data Merchant
Review Komponen
Riwayat Revisi
Timeline
```

Tab harus:

- Tetap menggunakan routing/state mechanism existing.
- Tidak merusak permission.
- Tidak mengubah API.
- Memiliki active state yang jelas.
- Responsive pada layar kecil.

---

# 12. Workspace Layout

Desktop:

```text
┌───────────────────────────────────────────────┬───────────────┐
│                                               │               │
│              MAIN CONTENT                     │   SIDEBAR     │
│                                               │               │
│                                               │               │
└───────────────────────────────────────────────┴───────────────┘
```

Rekomendasi:

- Main content: sekitar 68–72%.
- Sidebar: sekitar 28–32%.
- Gap konsisten.
- Sidebar tidak boleh mengambil perhatian lebih besar daripada main content.

Gunakan CSS grid/flex sesuai existing design system.

### Sidebar behavior

Desktop:

- Sidebar berada di sisi kanan.
- Card tersusun vertikal.
- Sidebar dapat menggunakan sticky positioning jika tidak menyebabkan masalah UX.

Tablet:

- Main content tetap dominan.
- Sidebar dapat turun di bawah content jika ruang tidak cukup.

Mobile:

```text
Main Content
↓
Status
↓
Reviewer
↓
Component Summary
↓
Reviewer Notes
↓
Timeline
```

Tidak boleh terjadi horizontal overflow.

---

# 13. Sidebar — Status & Actions

Card:

```text
Status Pengajuan

[Status Badge]

Reviewer
Nama Reviewer

Actions
...
```

Tampilkan:

- Current application status.
- Reviewer assignment.
- Started at.
- Completed at jika tersedia.
- Decision jika tersedia.
- Decision reason jika tersedia.

Jangan duplikasi logic status dari backend.

Gunakan existing mapper/formatter.

---

# 14. Sidebar — Informasi Reviewer

Tampilkan:

- Nama reviewer.
- Avatar jika tersedia.
- Assignment status.
- Claimed at.
- Started at.
- Completed at.

Jika belum ditugaskan:

```text
Belum ada reviewer
```

Gunakan empty state yang informatif.

---

# 15. Sidebar — Ringkasan Komponen

Tampilkan summary review components.

Component existing:

- Business
- Identity
- Legal Entity
- Service
- Category
- Outlet
- Document
- Payout

Review status existing:

- Pending
- Verified
- Rejected

Representasikan dalam compact list.

Contoh:

```text
Ringkasan Komponen

✓ Bisnis             Terverifikasi
✓ Identitas          Terverifikasi
• Badan Hukum        Menunggu
✓ Layanan            Terverifikasi
! Dokumen            Ditolak
```

Jangan membuat status baru.

---

# 16. Sidebar — Catatan Reviewer

Jika reviewer notes tersedia, tampilkan ringkasan.

Jika tidak tersedia:

```text
Belum ada catatan reviewer.
```

Catatan tidak boleh mengubah data review.

Jika notes terlalu panjang:

- truncate secara visual.
- gunakan expand/view detail jika pattern existing mendukung.

---

# 17. Sidebar — Timeline Approval

Tampilkan timeline ringkas:

```text
Pengajuan dikirim
↓
Review diklaim
↓
Komponen direview
↓
Revisi diminta
↓
Pengajuan disetujui
```

Gunakan events existing.

Jangan membuat event baru di frontend.

Gunakan:

- event type existing.
- timestamp existing.
- actor existing.

---

# 18. Data Merchant Tab

Tab Data Merchant menggunakan struktur:

```text
Data Merchant
├── Informasi Bisnis
├── Identitas Pemilik
├── Badan Hukum
├── Layanan
├── Kategori
├── Outlet
├── Dokumen
└── Pencairan Dana
```

Detail field dan presentation layer dapat mengikuti PRD:

**`PRD-JualAntar-Merchant-Approval-Data-Merchant-UI.md`**

Namun accordion tidak boleh menjadi struktur visual utama seluruh halaman.

Data Merchant berada di dalam **main content workspace**.

---

# 19. Data Merchant — Information Hierarchy

Gunakan:

- Section card.
- Section title.
- Description/metadata.
- Field grid.
- Compact value presentation.

Prinsip:

```text
Primary Information
    ↓
Secondary Metadata
    ↓
Supporting Information
```

Nama bisnis dan informasi utama harus lebih menonjol daripada slug/identifier.

---

# 20. Informasi Bisnis

Tampilkan:

```text
Informasi Bisnis
Informasi utama merchant

Nama Bisnis          Tipe Merchant
Warung Borneo        Perorangan

Slug
warung-borneo

Deskripsi
...
```

Gunakan existing mapper:

- `MERCHANT_TYPE_LABELS`

Slug dapat menggunakan monospace.

---

# 21. Identitas Pemilik

Tampilkan:

```text
Identitas Pemilik

Nama Lengkap      Jenis Identitas     Nomor Identitas
Thomas Alberto    KTP                 6106********8883

Tanggal Lahir
...
```

Nomor identitas mengikuti masking presentation layer.

Gunakan:

- `IDENTITY_TYPE_LABELS`

---

# 22. Badan Hukum

Merchant perorangan:

```text
Badan Hukum

ⓘ Tidak ada badan hukum
Merchant terdaftar sebagai merchant perorangan.
```

Merchant perusahaan:

Tampilkan:

- Nama badan hukum.
- Jenis badan hukum.
- NIB.
- NPWP.
- Alamat.
- Wilayah.
- Kode pos.

Gunakan:

- `LEGAL_ENTITY_TYPE_LABELS`

NIB/NPWP dapat menggunakan monospace.

---

# 23. Layanan

Tampilkan:

```text
Layanan
Layanan yang dipilih merchant.

Nama Layanan       Slug
JAfood             jafood
```

Gunakan mapper/service badge existing jika tersedia.

---

# 24. Kategori

Gunakan compact list:

```text
Kategori
3 kategori terdaftar

Dessert                         #dessert
Makanan                         #makanan
Minuman                         #minuman
```

Gunakan muted background dan rounded item.

---

# 25. Outlet

Outlet merupakan data operasional yang relatif padat.

Gunakan nested card:

```text
Outlet Utama                         [Aktif]

Kontak
Telepon                  Email

Lokasi
Tipe Area Layanan        Radius
Kode Pos                 Wilayah

Alamat
Jl. ...
```

Grid:

- Small: 2 kolom.
- Large: 3 kolom jika sesuai ruang.
- Address full width.
- Long geography text dapat full width.

Gunakan:

- `SERVICE_AREA_TYPE_LABELS`
- `geographyLabel()`

Latitude/longitude dapat menjadi metadata sekunder.

---

# 26. Dokumen

Dokumen harus terasa seperti supporting evidence.

Contoh:

```text
Dokumen
3 dokumen diunggah

┌─────────────────────────────────────┐
│ [thumbnail] KTP             [Buka] │
│             ktp.jpg · 41.5 KB      │
└─────────────────────────────────────┘
```

Rules:

- Thumbnail 40–48px.
- Nama dokumen medium/bold.
- Filename dan size muted.
- Button `Buka`.
- Row clickable jika pattern existing mendukung.
- Keyboard accessible.
- Tetap menggunakan/refactor `DetailDocumentPreview`.
- Gunakan `DOCUMENT_TYPE_LABELS`.

---

# 27. Pencairan Dana

Gunakan nested card:

```text
Pencairan Dana
1 rekening terdaftar

Bank                    Nomor Rekening
BANK OF CHINA            1234567890

Nama Pemilik             Rekening Utama
THOMAS ALBERTO            Ya
```

Rules:

- Nomor rekening dapat dimasking.
- Nomor rekening dapat menggunakan monospace.
- Primary account menggunakan badge.
- Jangan memberikan emphasis sama pada semua field.

---

# 28. Review Komponen Tab

Tab Review Komponen harus tetap menggunakan component review semantics existing.

Setiap component harus dapat menunjukkan:

- Component name.
- Current review status.
- Reviewer.
- Review timestamp.
- Reviewer note jika tersedia.
- Available review action sesuai permission.

Status:

```text
Pending
Verified
Rejected
```

Jangan membuat status baru.

Component review mutation harus tetap menggunakan existing API.

---

# 29. Riwayat Revisi Tab

Gunakan revision data existing.

Tampilkan:

- Revision number jika tersedia.
- Component.
- Reason.
- Requested by.
- Requested at.
- Status.
- Resolved at jika tersedia.

Revision status existing:

```text
Open
Resolved
Cancelled
```

Jangan mengubah revision semantics.

---

# 30. Timeline Tab

Gunakan approval events existing.

Event type existing mencakup event seperti:

- Submitted
- Claimed
- Released
- Component Reviewed
- Revision Requested
- Resubmitted
- Approved
- Rejected

Timeline harus menunjukkan:

- Event.
- Actor.
- Timestamp.
- Context jika tersedia.

Tidak boleh membuat event client-side yang tidak berasal dari backend.

---

# 31. Existing Component Strategy

Existing component tree:

```text
components/detail/
├── detail-view.tsx
├── detail-snapshot-sections.tsx
├── detail-component-review-card.tsx
├── detail-document-preview.tsx
├── detail-revision-history.tsx
├── detail-timeline.tsx
└── approval action dialogs
```

Strategi:

### Pertahankan

- `detail-view.tsx` sebagai parent orchestration jika memungkinkan.
- Approval dialogs.
- Query hooks.
- Mutation hooks.
- Mapper.
- Permission checks.
- Existing review/revision/timeline components jika compatible.

### Refactor

`detail-snapshot-sections.tsx` dapat direfactor menjadi presentation components yang lebih modular.

Contoh:

```text
detail/
├── detail-view.tsx
├── detail-header.tsx
├── detail-merchant-summary.tsx
├── detail-approval-progress.tsx
├── detail-workspace.tsx
├── detail-sidebar.tsx
├── detail-snapshot-sections.tsx
├── detail-snapshot-section.tsx
├── detail-outlet-card.tsx
├── detail-document-preview.tsx
├── detail-payout-card.tsx
├── detail-component-review-card.tsx
├── detail-revision-history.tsx
└── detail-timeline.tsx
```

Tidak wajib memecah file jika menyebabkan kompleksitas yang tidak perlu.

---

# 32. Data & Mapper Constraints

Pertahankan existing helpers:

- `MERCHANT_TYPE_LABELS`
- `IDENTITY_TYPE_LABELS`
- `LEGAL_ENTITY_TYPE_LABELS`
- `SERVICE_AREA_TYPE_LABELS`
- `DOCUMENT_TYPE_LABELS`
- `geographyLabel()`
- `formatDate()`
- `subjectFields()`

Jangan menduplikasi mapper di component.

Jika formatter existing sudah tersedia, gunakan formatter tersebut.

---

# 33. API & Query Constraints

Jangan mengubah:

- API endpoint.
- HTTP method.
- Request schema.
- Response schema.
- Query keys.
- Mutation behavior.
- Invalidation strategy.

Existing services harus tetap menjadi sumber data.

UI redesign tidak boleh menyebabkan perubahan backend contract.

---

# 34. Permission Constraints

Semua action harus tetap permission-aware.

At minimum:

```text
merchant.approval.claim
merchant.approval.review
merchant.approval.revision
merchant.approval.reject
merchant.approval.approve
```

Jangan mengasumsikan user memiliki permission.

Jangan menambahkan permission baru hanya untuk redesign.

---

# 35. Visual Design Direction

Target visual:

- Clean.
- Modern.
- Professional admin dashboard.
- Data-dense tetapi mudah dipindai.
- Rounded cards.
- Subtle border.
- Soft shadow secukupnya.
- Red sebagai JualAntar action accent.
- Semantic status colors.
- Muted labels.
- High-contrast values.
- Monospace untuk identifier yang sesuai.

Hindari:

- Excessive gradients.
- Excessive shadows.
- Decorative elements tanpa fungsi.
- Oversized typography.
- Giant empty areas.
- Excessive borders.
- Warna custom yang tidak konsisten.
- Accordion yang memenuhi seluruh page sebagai visual utama.

---

# 36. Responsive Design

## Desktop

Target utama:

- Merchant summary horizontal.
- Approval progress horizontal.
- Main + sidebar.
- Main content sekitar 68–72%.
- Sidebar sekitar 28–32%.

## Tablet

- Main content tetap dominan.
- Sidebar dapat turun jika width tidak cukup.
- Grid fields 2 kolom.

## Mobile

Urutan:

```text
Header
↓
Merchant Summary
↓
Approval Progress
↓
Tabs
↓
Main Content
↓
Status
↓
Reviewer
↓
Component Summary
↓
Notes
↓
Timeline
```

Rules:

- Tidak ada horizontal page overflow.
- Long text harus wrap.
- Identifier tidak memaksa horizontal scroll.
- Document row tetap usable.
- Action area harus tetap accessible.

---

# 37. Accessibility

Wajib:

- Keyboard navigation.
- Focus-visible.
- Accessible label untuk icon-only button.
- Status tidak hanya menggunakan warna.
- Buttons memiliki label yang jelas.
- Document preview accessible.
- Tab navigation accessible.
- Accordion accessible jika tetap digunakan.
- Contrast memadai.

---

# 38. Loading State

Gunakan skeleton untuk:

- Merchant summary.
- Approval progress.
- Main content.
- Sidebar cards.
- Document rows.
- Component summary.

Hindari spinner besar yang menggantikan seluruh page.

---

# 39. Error State

Jika detail gagal dimuat:

```text
Data pengajuan tidak dapat ditampilkan.

Coba muat ulang data pengajuan.

[ Muat Ulang ]
```

Jika hanya satu bagian gagal, isolasi error pada bagian tersebut jika arsitektur data memungkinkan.

Jangan menghapus seluruh workspace karena satu component gagal.

---

# 40. Empty State

Bedakan:

1. Data memang tidak relevan.
2. Data belum tersedia.
3. Data gagal dimuat.

Contoh badan hukum merchant perorangan:

```text
Tidak ada badan hukum

Merchant terdaftar sebagai merchant perorangan.
```

Jangan menggunakan:

```text
Data tidak tersedia
```

untuk kondisi yang sebenarnya valid.

---

# 41. Security / Sensitive Data Presentation

Data sensitif harus mengikuti existing presentation policy.

Potentially sensitive fields:

- NIK.
- NPWP.
- Nomor rekening.
- Dokumen identitas.

Gunakan masking jika policy existing mengharuskannya.

Jangan menambahkan logging data sensitif.

Jangan expose sensitive data melalui URL.

---

# 42. Implementation Sequence

Implementasi disarankan dalam urutan:

## Phase 1 — Workspace Shell

1. Page header.
2. Breadcrumb.
3. Merchant summary.
4. Approval progress.
5. Tabs.
6. Main/sidebar grid.

## Phase 2 — Sidebar

1. Status & Actions.
2. Reviewer.
3. Component summary.
4. Reviewer notes.
5. Timeline summary.

## Phase 3 — Data Merchant

1. Business.
2. Identity.
3. Legal entity.
4. Service.
5. Category.
6. Outlet.
7. Documents.
8. Payout.

## Phase 4 — Existing Tabs

1. Review Component.
2. Revision History.
3. Timeline.

## Phase 5 — Responsive

Desktop → Tablet → Mobile.

## Phase 6 — Visual QA

Compare implementation screenshot dengan target screenshot.

---

# 43. Visual QA Workflow

Setelah implementasi:

1. Jalankan aplikasi.
2. Buka `/merchant-approvals/:id`.
3. Gunakan data pengajuan representative.
4. Screenshot halaman.
5. Bandingkan dengan target screenshot.
6. Periksa:
    - Layout.
    - Spacing.
    - Card hierarchy.
    - Sidebar width.
    - Header.
    - Merchant summary.
    - Approval progress.
    - Tabs.
    - Typography.
    - Status badges.
    - Responsive.
7. Perbaiki perbedaan visual.
8. Screenshot ulang.
9. Ulangi sampai layout sesuai.

Visual comparison harus dilakukan pada:

- Desktop.
- Tablet.
- Mobile.

---

# 44. AI Agent Instructions

Jika PRD ini digunakan oleh OpenCode atau coding agent:

## Sebelum coding

Agent wajib:

1. Membaca PRD ini.
2. Membaca target screenshot.
3. Membaca screenshot current implementation jika tersedia.
4. Membaca existing `detail-view.tsx`.
5. Membaca `detail-snapshot-sections.tsx`.
6. Membaca mapper.
7. Membaca queries/mutations.
8. Memahami permission checks.
9. Memahami approval status.
10. Memahami component review status.

Jangan langsung menulis code sebelum memahami existing implementation.

## Saat coding

Agent harus:

- Preserve business logic.
- Reuse existing services.
- Reuse existing mapper.
- Reuse existing permission checks.
- Reuse existing dialogs.
- Reuse existing design system components.
- Refactor incrementally.
- Hindari duplicate logic.

## Setelah coding

Agent wajib:

- Run TypeScript check.
- Run lint.
- Run relevant tests.
- Run application.
- Inspect rendered UI.
- Take screenshot.
- Compare terhadap target.
- Fix visual mismatch.

---

# 45. Critical Anti-Patterns

Jangan menghasilkan implementasi seperti:

```text
Page
└── Huge Accordion
    ├── Business
    ├── Identity
    ├── Legal
    ├── Service
    ├── Category
    ├── Outlet
    ├── Documents
    └── Payout
```

sebagai keseluruhan visual page.

Accordion boleh digunakan di dalam Data Merchant jika sesuai, tetapi **bukan sebagai pengganti Merchant Approval Workspace**.

Jangan:

- Menghilangkan sidebar.
- Menghilangkan merchant summary.
- Menghilangkan approval progress.
- Menghilangkan tab navigation.
- Mengubah approval actions menjadi sekadar static button.
- Mengubah business logic.
- Membuat mock data.
- Membuat duplicate API layer.
- Membuat state approval baru di frontend.

---

# 46. Acceptance Criteria

## Page Structure

- [ ] Breadcrumb tersedia.
- [ ] Page title tersedia.
- [ ] Description tersedia.
- [ ] Approval actions tersedia sesuai permission.
- [ ] Merchant summary tersedia.
- [ ] Approval progress tersedia.
- [ ] Empat tab tersedia.
- [ ] Main + sidebar workspace tersedia.

## Merchant Summary

- [ ] Business name.
- [ ] Slug.
- [ ] Merchant type.
- [ ] Description.
- [ ] Location.
- [ ] Application number.
- [ ] Service.
- [ ] Submission date.
- [ ] Reviewer.
- [ ] Merchant image jika tersedia.

## Sidebar

- [ ] Status & Actions.
- [ ] Reviewer information.
- [ ] Component summary.
- [ ] Reviewer notes.
- [ ] Approval timeline.

## Data Merchant

- [ ] Business.
- [ ] Identity.
- [ ] Legal entity.
- [ ] Service.
- [ ] Category.
- [ ] Outlet.
- [ ] Documents.
- [ ] Payout.

## Functional

- [ ] Claim works.
- [ ] Release works.
- [ ] Component review works.
- [ ] Request revision works.
- [ ] Reject works.
- [ ] Approve works.
- [ ] Permission behavior unchanged.
- [ ] Status behavior unchanged.
- [ ] Revision behavior unchanged.
- [ ] Timeline still displays existing events.
- [ ] Document preview works.

## Technical

- [ ] No API contract changes.
- [ ] No ApprovalDetail changes.
- [ ] No mutation semantic changes.
- [ ] Existing mapper reused.
- [ ] Existing query/mutation hooks reused.
- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Relevant tests pass.

## Responsive

- [ ] Desktop matches target composition.
- [ ] Tablet remains usable.
- [ ] Mobile has no page-level horizontal overflow.
- [ ] Sidebar moves below content appropriately.
- [ ] Actions remain accessible.
- [ ] Document rows remain usable.

## Visual QA

- [ ] Target screenshot comparison completed.
- [ ] Main/sidebar proportions are visually aligned.
- [ ] Merchant summary hierarchy is aligned.
- [ ] Approval progress hierarchy is aligned.
- [ ] Tabs hierarchy is aligned.
- [ ] Card spacing is consistent.
- [ ] Typography hierarchy is consistent.
- [ ] Status colors are semantic.
- [ ] No unnecessary decorative UI introduced.

---

# 47. Definition of Done

Redesign dianggap selesai apabila:

1. Halaman telah berubah menjadi Merchant Approval Detail Workspace.
2. Layout utama mengikuti target reference.
3. Merchant summary tersedia.
4. Approval progress tersedia.
5. Main content + contextual sidebar tersedia.
6. Empat tab existing tetap berfungsi.
7. Semua approval actions tetap bekerja.
8. Permission tidak berubah.
9. API contract tidak berubah.
10. Data model tidak berubah.
11. Existing mapper dan formatter digunakan.
12. Review component tetap berfungsi.
13. Revision history tetap berfungsi.
14. Timeline tetap berfungsi.
15. Document preview tetap berfungsi.
16. Data Merchant mengikuti hierarchy yang ditentukan.
17. Desktop/tablet/mobile telah diuji.
18. Tidak ada page-level horizontal overflow.
19. TypeScript/lint/test lulus.
20. Screenshot implementasi telah dibandingkan dengan target dan mismatch utama telah diperbaiki.

---

# 48. Reference Files

Repository:

```text
https://github.com/Rumahkodingku/jualantar-admin
```

Module:

```text
app/modules/merchant-approval
```

Relevant existing files:

```text
app/modules/merchant-approval/components/detail/detail-view.tsx
app/modules/merchant-approval/components/detail/detail-snapshot-sections.tsx
app/modules/merchant-approval/components/detail/detail-component-review-card.tsx
app/modules/merchant-approval/components/detail/detail-document-preview.tsx
app/modules/merchant-approval/components/detail/detail-revision-history.tsx
app/modules/merchant-approval/components/detail/detail-timeline.tsx
app/modules/merchant-approval/services/merchant-approval.api.ts
app/modules/merchant-approval/services/merchant-approval.mappers.ts
app/modules/merchant-approval/services/merchant-approval.mutations.ts
app/modules/merchant-approval/services/merchant-approval.queries.ts
app/modules/merchant-approval/types/merchant-approval.types.ts
```

Data Merchant sub-reference:

```text
PRD-JualAntar-Merchant-Approval-Data-Merchant-UI.md
```

---

# 49. Final Implementation Principle

Tujuan redesign bukan membuat halaman yang sekadar "lebih cantik".

Tujuan utamanya adalah mengubah halaman menjadi:

> **A focused workspace where an admin reviewer can understand a merchant application, verify its components, inspect supporting evidence, understand its history, and perform the appropriate approval action without losing context.**

Visual target harus diterjemahkan ke dalam struktur UI yang nyata, bukan sekadar menambahkan styling pada implementation existing.

**Preserve the system. Redesign the workspace.**
