# PRODUCT REQUIREMENTS DOCUMENT - Modern Merchant Approval Queue UI

JualAntar Admin · Merchant Approval Module

## 1. Informasi Dokumen

Product: JualAntar Admin

Module: Merchant Approval

Repository: Rumahkodingku/jualantar-admin

Scope: UI/UX modernization untuk approval queue dan approval detail

Primary Routes: /merchant-approvals dan /merchant-approvals/:id

## 2. Tujuan

Mendesain ulang halaman Merchant Approval Queue menjadi dashboard operasional yang lebih modern, informatif, mudah dipindai, dan membantu administrator memproses pengajuan merchant secara cepat.

Redesign harus mempertahankan behavior existing, termasuk filtering, pencarian, assignment reviewer, sorting, pagination, claim approval, akses detail, dan permission-based actions.

## 3. Kondisi Codebase Saat Ini

Module merchant-approval sudah memiliki fondasi workflow dan data yang lengkap. Struktur utama mencakup pages, components, services, schemas, dan types.

- MerchantApprovalListPage mengelola URL search params untuk status, assignment, search, sorting, page, dan per-page.
- ApprovalTable menampilkan nomor pengajuan, nama bisnis, tipe, layanan, status, tanggal pengajuan, reviewer, dan actions.
- ApprovalStatusTabs menyediakan filter status dan count dari approval summary.
- ApprovalQueueToolbar menyediakan search, reviewer filter, sorting, dan refresh.
- Approval detail sudah menyediakan merchant header, progress review, actions, data merchant, component review, revision history, dan timeline.
- API layer sudah memiliki summary, list, detail, claim, release, component review, revision, reject, approve, events, dan revisions.
- TanStack Query digunakan untuk query dan mutation; invalidation dilakukan setelah mutation berhasil.

## 4. Masalah UI Saat Ini

- Interface masih sangat table-centric dan belum memiliki visual summary yang kuat.
- Identitas merchant pada table masih berupa text sehingga kurang mudah dipindai.
- Informasi reviewer terlalu generik.
- Status belum menjadi bagian dari visual hierarchy yang kuat.
- Detail approval memiliki banyak informasi tetapi membutuhkan struktur visual yang lebih jelas.
- Mobile membutuhkan presentation khusus agar tidak memaksakan desktop table ke layar kecil.

## 5. Design Direction

Konsep utama: Modern Operations Dashboard.

- Clean
- Minimal
- Operational
- Data-dense
- Soft rounded
- High readability
- Subtle shadows
- Strong hierarchy
  Prinsip utama: administrator harus dapat memahami kondisi antrean dalam sekitar 3–5 detik tanpa membaca seluruh table.

## 6. Struktur Halaman Approval Queue

- Breadcrumb: Home / Merchant / Approval
- Page header: Antrean Merchant Approval + description
- Optional contextual illustration di sisi kanan header
- Approval summary metrics
- Status tabs
- Search/filter/sort/refresh toolbar
- Approval table pada desktop
- Approval cards pada mobile
- Pagination footer

## 7. Approval Summary Cards

Tambahkan metric cards menggunakan data yang sudah tersedia dari approval summary API.

- Perlu Ditinjau
- Sedang Direview
- Perlu Revisi
- Disetujui
- Ditolak
- Belum Ditugaskan
  Data utama berasal dari summary.by_status dan summary.unassigned. Jangan membuat angka baru yang tidak berasal dari API atau mengubah definisi status hanya untuk kebutuhan visual.

## 8. Status Tabs

Pertahankan status tabs existing:

- Semua Status
- Menunggu Review
- Sedang Direview
- Perlu Revisi
- Disetujui
- Ditolak
  Status domain yang tersedia: draft, pending, in_review, revision_required, approved, rejected.

Gunakan active state yang jelas melalui primary text dan underline. Badge count harus kecil dan tidak mendominasi label.

## 9. Toolbar

- Search dengan placeholder: Cari bisnis, no. pengajuan, email, atau layanan...
- Pertahankan debounce search sekitar 400ms.
- Filter reviewer: Semua Reviewer, Ditugaskan ke Saya, Belum Ditugaskan.
- Sorting: Pengajuan terbaru, Pengajuan terlama, Terakhir diklaim, Terakhir diselesaikan.
- Refresh button dengan loading state.
- URL query parameters tetap menjadi source of truth untuk filter/search/sort/pagination.

## 10. Approval Table

Desktop table menjadi pusat halaman dengan hierarchy yang lebih kuat.

- Merchant
- Pengajuan
- Tipe
- Layanan
- Status
- Tanggal Pengajuan
- Reviewer
- Aksi
  Kolom No dihilangkan karena tidak memberikan informasi operasional yang berarti.

## 11. Merchant Cell

Merchant harus menjadi focal point pada setiap row.

- Tampilkan logo/avatar jika tersedia.
- Tampilkan business name sebagai primary text.
- Tampilkan slug atau identifier sebagai secondary text.
- Gunakan typography yang membedakan merchant identity dari metadata.

## 12. Application Cell

Nomor pengajuan menggunakan typography yang mudah dikenali, misalnya font-mono dan medium weight. Klik nomor pengajuan membuka halaman detail approval.

## 13. Merchant Type & Service

- Merchant type ditampilkan sebagai badge: Individual/Person atau Company.
- Service ditampilkan sebagai badge atau compact metadata, misalnya JAfood.
- Gunakan mapping existing dari module; jangan membuat nilai baru di UI.

## 14. Status

Gunakan status pill/badge dengan visual yang konsisten. Warna harus subtle, tidak terlalu saturated, dan tetap memiliki contrast yang baik.

- Pending → Menunggu Review
- In Review → Sedang Direview
- Revision Required → Perlu Revisi
- Approved → Disetujui
- Rejected → Ditolak

## 15. Reviewer

- Gunakan avatar + identity ketika reviewer tersedia.
- Jika current user adalah reviewer, tampilkan 'Anda'.
- Jika belum assigned, tampilkan 'Belum Ditugaskan'.
- Tetap hormati permission dan ownership rules existing.

## 16. Actions

- Primary action: Lihat Detail.
- Secondary actions dapat ditempatkan pada kebab menu jika diperlukan.
- Klaim hanya tersedia ketika approval pending dan belum assigned serta user memiliki permission.
- Lepas Review, Minta Revisi, Tolak, dan Setujui hanya muncul sesuai status, ownership, dan permission.
- Jangan mengubah authorization logic hanya untuk kebutuhan UI.

## 17. Claim Flow

Flow claim existing dipertahankan:

1. Admin menekan Klaim.
1. Button masuk loading state.
1. API claim dipanggil.
1. Success toast ditampilkan.
1. Reviewer pada row/detail berubah.
1. Summary dan queue di-invalidate/refetch.

## 18. Loading, Empty, dan Error States

- Loading: gunakan skeleton table/card dengan beberapa row.
- Empty tanpa filter: jelaskan bahwa belum ada pengajuan.
- Empty setelah filter: jelaskan tidak ada hasil dan tampilkan Reset Filter.
- Error: gunakan inline error state dengan Coba Lagi.
- Jangan menggunakan full-page error untuk error queue biasa.

## 19. Pagination

Footer menampilkan jumlah item dan total, misalnya: 'Menampilkan 15 dari 128 pengajuan'. Pagination mempertahankan current_page, per_page, total, dan last_page dari API.

## 20. Responsive Design

Desktop menggunakan table. Tablet dapat menggunakan compact table/collapsed navigation. Mobile tidak boleh memaksakan table desktop.

Mobile menggunakan approval card dengan pola:

- Logo + business name
- Application number
- Service/type
- Status
- Submission date
- Reviewer
- Lihat Detail + overflow action

## 21. Approval Detail Redesign

Detail page mengikuti visual language queue.

- Breadcrumb + back navigation
- Merchant identity header
- Application number
- Status badge
- Reviewer information
- Review progress
- Action group
- Data Merchant tab
- Review Komponen tab
- Riwayat Revisi tab
- Timeline tab

## 22. Review Progress

Tampilkan progress secara visual, misalnya progress bar dan ringkasan '6 / 8 terverifikasi'. Tampilkan jumlah verified, rejected, dan pending. Gunakan helper existing summarizeReviewProgress sebagai dasar.

## 23. Component Review

Component review harus mudah dipindai. Setiap component dapat ditampilkan sebagai card yang berisi nama component, status review, data yang relevan, note, dan action.

- business
- identity
- legal_entity
- service
- category
- outlet
- document
- payout
  Review status yang tersedia: pending, verified, rejected.

## 24. Data Merchant

Data snapshot dibagi menjadi section/accordion agar tidak menjadi satu block panjang.

- Business
- Identity
- Legal Entity
- Service
- Category
- Outlet
- Documents
- Payout

## 25. Revision History

Tampilkan revision sebagai timeline/card dengan revision number, tanggal, requested by, note, component yang perlu diperbaiki, dan status open/resolved/cancelled.

## 26. Approval Timeline

Timeline menampilkan event approval secara chronological. Event type yang tersedia meliputi application_submitted, approval_claimed, approval_released, component_reviewed, revision_requested, application_resubmitted, application_approved, dan application_rejected.

## 27. Dialogs

Pertahankan dialog existing dan modernisasi visualnya.

- Reject: alasan penolakan wajib/valid sesuai schema.
- Revision: pilih component yang perlu diperbaiki + catatan.
- Approve: tampilkan merchant, nomor pengajuan, dan ringkasan review sebelum konfirmasi.
- Release: tampilkan confirmation bahwa approval kembali ke antrean.

## 28. Architecture Constraints

Jangan melakukan rewrite architecture. Pertahankan module boundaries dan abstraction yang sudah ada.

- React Router
- TanStack Query
- URLSearchParams
- Permission system
- API abstraction di lib/api.ts
- TypeScript types
- Existing API endpoints
- Existing mutation invalidation

## 29. Target Component Structure

- components/approval-page-header.tsx
- components/approval-summary.tsx
- components/approval-summary-card.tsx
- components/approval-status-tabs.tsx
- components/approval-filter.tsx
- components/approval-queue-toolbar.tsx
- components/approval-table.tsx
- components/approval-table-row.tsx
- components/approval-mobile-card.tsx
- components/approval-reviewer.tsx
- components/approval-status-badge.tsx
- components/approval-empty-state.tsx
- components/approval-error-state.tsx
- components/approval-loading-state.tsx

## 30. File Prioritas

High priority:

- pages/merchant-approval-list-page.tsx
- components/approval-table.tsx
- components/approval-status-tabs.tsx
- components/approval-queue-toolbar.tsx
- components/approval-status-badge.tsx
  Medium priority:

- components/approval-detail.tsx
- components/component-review-card.tsx
- components/snapshot-sections.tsx
- components/revision-history.tsx
- components/approval-timeline.tsx

## 31. API Requirement

Untuk UI redesign ini tidak diperlukan endpoint baru. Existing API sudah menyediakan kebutuhan queue dan detail.

- GET /admin/merchant-approvals/summary
- GET /admin/merchant-approvals
- GET /admin/merchant-approvals/:id
- POST /admin/merchant-approvals/:id/claim
- POST /admin/merchant-approvals/:id/release
- POST /admin/merchant-approvals/:id/reviews
- POST /admin/merchant-approvals/:id/revision
- POST /admin/merchant-approvals/:id/reject
- POST /admin/merchant-approvals/:id/approve
- GET /admin/merchant-approvals/:id/events
- GET /admin/merchant-approvals/:id/revisions

## 32. Acceptance Criteria — Queue

- ☐ Header modern dengan breadcrumb.
- ☐ Summary metrics tampil dan mengambil data dari approval summary.
- ☐ Status tabs tetap berfungsi.
- ☐ Search tetap menggunakan URL query parameter dan debounce.
- ☐ Reviewer filter tetap berfungsi.
- ☐ Sorting tetap berfungsi.
- ☐ Refresh tetap berfungsi.
- ☐ Pagination tetap berfungsi.
- ☐ Claim tetap berfungsi.
- ☐ Permission tetap mengontrol action.
- ☐ Loading, empty, dan error states tersedia.
- ☐ Desktop menggunakan table dengan merchant identity yang jelas.
- ☐ Mobile menggunakan card layout.

## 33. Acceptance Criteria — Detail

- ☐ Merchant header lebih prominent.
- ☐ Status terlihat jelas.
- ☐ Reviewer terlihat jelas.
- ☐ Review progress memiliki visual progress.
- ☐ Action sesuai permission dan state.
- ☐ Snapshot dibagi menjadi section.
- ☐ Review component mudah dipindai.
- ☐ Revision history tersedia.
- ☐ Timeline tersedia.
- ☐ Dialog approval/rejection/revision/release tetap berfungsi.

## 34. Non-Goals

- Mengubah approval state machine.
- Mengubah API contract.
- Mengubah permission model.
- Mengubah review component model.
- Mengubah snapshot architecture.
- Mengubah revision model.
- Mengubah timeline event model.
- Mengubah authentication.
- Mengubah routing architecture.

## 35. Expected User Experience

Admin masuk → melihat summary approval → memahami jumlah pending/review/revision → memilih status → search/filter → scan merchant → melihat reviewer dan status → claim atau membuka detail → melakukan review component → approve/reject/revision.

Redesign tidak mengubah workflow bisnis; redesign memperbaiki information hierarchy, readability, responsiveness, dan operational efficiency.

## 36. Implementation Principle

Gambar desain yang telah dibuat sebelumnya menjadi target visual. Codebase existing menjadi source of truth untuk behavior dan data. Implementasi harus menghasilkan UI yang lebih modern tanpa memutus workflow approval yang sudah berjalan.
