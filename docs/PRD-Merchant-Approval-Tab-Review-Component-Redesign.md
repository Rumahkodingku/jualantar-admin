# PRD — Redesign Merchant Approval Tab Review Components

## 1. Ringkasan

Perubahan ini meredesain area **Review Component** pada halaman detail Merchant Approval di `jualantar-admin`.

UI saat ini menampilkan seluruh komponen review sebagai kumpulan card dua kolom. Setiap card berisi data, status, textarea catatan, serta tombol **Verifikasi/Tolak**. Pola ini membuat halaman sangat panjang, setiap komponen memiliki visual weight yang sama, dan reviewer harus melakukan scanning ke banyak card secara bersamaan.

Desain target mengubah pola tersebut menjadi **accordion-based review sections** seperti referensi `Redesign UI Review Component(1).png`:

- Setiap komponen menjadi satu section horizontal yang ringkas.
- Header section selalu menampilkan icon, nama komponen, deskripsi, dan status review.
- Section hanya membuka detail ketika reviewer ingin melakukan pemeriksaan.
- Section yang sedang dibuka menampilkan data lengkap, dokumen pendukung bila relevan, guidance verifikasi, serta action **Tolak / Verifikasi**.
- Status verifikasi menjadi elemen utama pada header sehingga reviewer dapat memindai progres dengan cepat.
- Logic bisnis, permission, mutation, dan data review yang sudah ada dipertahankan.

Target utama: membuat proses review merchant lebih terstruktur, mudah dipindai, dan scalable ketika jumlah komponen atau field bertambah.

---

## 2. Referensi

### Current UI

`Review Component UI current.png`

Karakteristik saat ini:

- Grid `xl:grid-cols-2`.
- Satu `DetailComponentReviewCard` untuk setiap reviewable subject.
- Data langsung terlihat pada seluruh card.
- Catatan review dan action terdapat di setiap card.
- Dokumen menggunakan `DetailDocumentPreview`.
- Status ditampilkan melalui `ReviewStatusBadge`.
- Card menggunakan border-left berdasarkan status.

### Target UI

`Redesign UI Review Component(1).png`

Karakteristik target:

- Accordion/section list.
- Header section memiliki icon.
- Judul + deskripsi singkat.
- Status badge di sisi kanan.
- Chevron untuk membuka/menutup.
- Detail hanya dirender/ditampilkan ketika section terbuka.
- Section aktif memiliki area review lebih kaya.
- Informasi dokumen pendukung berada di dalam section terkait.
- Guidance verifikasi menggunakan informational callout.
- Action **Tolak** dan **Verifikasi** berada di area bawah detail.

---

## 3. Tujuan

### Tujuan utama

1. Mengurangi vertical scanning pada halaman review.
2. Membuat status setiap komponen dapat dipindai tanpa membuka detail.
3. Membuat reviewer fokus pada satu komponen pada satu waktu.
4. Menyatukan pola UI untuk business, identity, legal entity, service, category, outlet, document, dan payout.
5. Mempertahankan seluruh behavior review yang sudah berjalan.
6. Menyiapkan struktur UI yang mudah diperluas untuk kebutuhan verifikasi berikutnya.

### Non-goals

Perubahan ini **tidak** bertujuan untuk:

- Mengubah API merchant approval.
- Mengubah schema review.
- Mengubah endpoint mutation.
- Mengubah permission model.
- Mengubah workflow claim/release/revision/reject/approve.
- Mengubah snapshot/versioning.
- Mengubah data model merchant.

---

## 4. Analisis Codebase Saat Ini

Repository:

`Rumahkodingku/jualantar-admin`

File utama:

`app/modules/merchant-approval/components/detail/detail-component-review-card.tsx`

### Struktur saat ini

`DetailComponentReviewCard` menerima:

```ts
interface DetailComponentReviewCardProps {
    subject: ReviewableSubject
    review?: ApprovalReview
    canReview: boolean
    isSubmitting: boolean
    onVerify: (note: string) => void
    onReject: (note: string) => void
}
```

Card saat ini:

- Mengambil field melalui `subjectFields(subject.component, subject.data)`.
- Menentukan document dengan `subject.component === "document"`.
- Mengambil status dari `review?.status ?? "pending"`.
- Menampilkan data field dalam `<dl>`.
- Menampilkan `DetailDocumentPreview` untuk document.
- Menampilkan existing reviewer note.
- Menampilkan textarea catatan ketika `canReview`.
- Menjalankan `onVerify(note)`.
- Membuka confirmation dialog sebelum `onReject(note)`.
- Mengubah border-left sesuai status.

### Integrasi pada `detail-view.tsx`

Review tab saat ini menggunakan:

```tsx
<DetailTabLayout sidebar={sidebar}>
    {subjects.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
            {subjects.map((subject) => (
                <DetailComponentReviewCard
                    key={subjectKey(subject)}
                    subject={subject}
                    review={findReview(
                        approval.reviews,
                        subject.subjectType,
                        subject.subjectId
                    )}
                    canReview={canReview}
                    isSubmitting={
                        review.isPending &&
                        reviewingKey === subjectKey(subject)
                    }
                    onVerify={(note) =>
                        handleReview(subject, "verified", note)
                    }
                    onReject={(note) =>
                        handleReview(subject, "rejected", note)
                    }
                />
            ))}
        </div>
    ) : (
        ...
    )}
</DetailTabLayout>
```

Konsekuensinya, redesain membutuhkan perubahan pada **parent layout**, bukan hanya styling `DetailComponentReviewCard`.

---

## 5. Data dan Domain yang Harus Dipertahankan

Mapper saat ini mendefinisikan delapan review component:

```ts
business
identity
legal_entity
service
category
outlet
document
payout
```

Label saat ini:

| Component      | Label          |
| -------------- | -------------- |
| `business`     | Bisnis         |
| `identity`     | Identitas      |
| `legal_entity` | Badan Hukum    |
| `service`      | Layanan        |
| `category`     | Kategori       |
| `outlet`       | Outlet         |
| `document`     | Dokumen        |
| `payout`       | Pencairan Dana |

Urutan ini harus dipertahankan karena `collectReviewableSubjects()` memakai:

```ts
const COMPONENT_ORDER = [
    "business",
    "identity",
    "legal_entity",
    "service",
    "category",
    "outlet",
    "document",
    "payout",
]
```

Jangan mengubah subject identity atau subject id hanya untuk kebutuhan UI.

---

## 6. Requirement UI Baru

### 6.1 Review root layout

Review tab tidak lagi menggunakan grid dua kolom.

Ganti menjadi:

```text
Accordion
 ├── Business
 ├── Identity
 ├── Legal Entity
 ├── Service
 ├── Category
 ├── Outlet
 ├── Document
 └── Payout
```

Semua item memiliki lebar penuh.

Gunakan spacing antar section yang konsisten, dengan visual hierarchy menyerupai referensi target.

---

## 7. Struktur Review Section

Setiap review component harus mengikuti struktur:

```text
┌───────────────────────────────────────────────────────┐
│ [Icon]  Title                         [Status]    [⌃] │
│         Short description                              │
├───────────────────────────────────────────────────────┤
│ Detail content                                         │
│                                                       │
│ [supporting document jika tersedia]                  │
│                                                       │
│ [information / verification guidance]                 │
│                                                       │
│                                   [Tolak] [Verifikasi]│
└───────────────────────────────────────────────────────┘
```

Saat collapsed hanya header yang terlihat.

Saat expanded, detail review ditampilkan.

---

## 8. Header Section

Header wajib memiliki:

### Icon

Gunakan Lucide icon yang konsisten dengan domain.

Rekomendasi awal:

| Component    | Icon                             |
| ------------ | -------------------------------- |
| business     | `Store`                          |
| identity     | `User`                           |
| legal_entity | `Building2`                      |
| service      | `Layers` / icon service existing |
| category     | `Tags`                           |
| outlet       | `MapPin`                         |
| document     | `FileText`                       |
| payout       | `Landmark`                       |

Jangan membuat icon baru hanya untuk kebutuhan desain.

### Title

Gunakan title domain yang human-readable:

- Informasi Bisnis
- Identitas Pemilik
- Layanan
- Kategori
- Outlet
- Dokumen
- Pencairan Dana

Untuk `legal_entity`, gunakan:

**Badan Hukum**

### Description

Header harus mempunyai deskripsi singkat dan statis.

Contoh:

```text
Informasi bisnis, tipe merchant, deskripsi, dan informasi dasar lainnya.
Nama lengkap, jenis identitas, nomor identitas, dan tanggal lahir.
Layanan yang diajukan oleh merchant.
Kategori produk/layanan.
Informasi outlet, alamat, kontak, dan area layanan.
KTP, NPWP, rekening, swafoto, dan dokumen pendukung lainnya.
Informasi rekening bank untuk pencairan dana.
```

Deskripsi dapat dibuat berdasarkan component map di mapper atau constant UI baru.

---

## 9. Status Header

Status harus terlihat ketika section collapsed maupun expanded.

Gunakan status existing:

```ts
pending
verified
rejected
```

Label:

```text
Belum Direview
Terverifikasi
Ditolak
```

Visual harus konsisten dengan `ReviewStatusBadge`.

Status tidak boleh dipindahkan hanya ke isi detail.

### Status color semantics

- Pending → neutral/muted.
- Verified → emerald/green.
- Rejected → red.

Jangan mengubah semantic color yang sudah digunakan di codebase.

---

## 10. Accordion Behavior

### Default state

Semua section collapsed secara default, kecuali section yang pertama kali difokuskan oleh reviewer.

Implementasi boleh menggunakan controlled accordion.

Prefer controlled state agar future behavior dapat dibuat:

```ts
const [openComponent, setOpenComponent] = useState<string | undefined>()
```

Namun jangan memaksakan hanya single-open jika library existing lebih cocok untuk multiple-open.

### Rekomendasi

Gunakan **single-open** untuk menjaga fokus reviewer:

- ketika satu section dibuka, section lain menutup.
- state tidak boleh menghapus review/status.

### Navigation

Chevron pada kanan header menunjukkan state:

- closed → chevron right/down sesuai convention library.
- open → chevron up.

Gunakan primitive Accordion dari `~/components/ui/accordion` karena project sudah mempunyai abstraction tersebut dan `DetailSnapshotSection` sudah menggunakannya.

---

## 11. Detail Content

Data detail yang sekarang dihasilkan oleh:

```ts
subjectFields(subject.component, subject.data)
```

tetap digunakan sebagai source of truth untuk review card.

Namun presentation diubah agar lebih cocok untuk accordion.

### Business

Tampilkan:

- Nama Bisnis
- Tipe Merchant
- Deskripsi apabila tersedia

Supporting document jika ada:

- dokumen izin usaha yang relevan

Guidance:

> Verifikasi kesesuaian informasi bisnis dengan dokumen pendukung.

### Identity

Tampilkan:

- Nama Lengkap
- Jenis Identitas
- Nomor Identitas
- Tanggal Lahir

Gunakan masking existing apabila sudah ada helper yang sesuai.

Guidance:

> Verifikasi kecocokan identitas pemilik dengan dokumen identitas.

### Legal Entity

Tampilkan:

- Nama Badan Hukum
- Jenis Badan Hukum
- NIB
- NPWP
- Alamat
- Wilayah
- Kode Pos

Hanya tampilkan meaningful content jika subject tersedia.

Untuk merchant `individual` tanpa badan hukum, tampilkan empty state explanatory, bukan fake data.

### Service

Tampilkan:

- Nama Layanan
- Slug bila masih diperlukan internal UI.

### Category

Tampilkan semua kategori dalam list yang compact.

Jangan membuat satu accordion per category.

### Outlet

Karena satu merchant dapat mempunyai lebih dari satu outlet:

```text
Outlet
  ├── Outlet 1
  ├── Outlet 2
  └── Outlet N
```

Detail outlet mempertahankan capability existing:

- telepon
- email
- service area
- radius
- wilayah
- alamat
- foto outlet
- map

Gunakan `DetailOutletCard` existing sebagai subcomponent apabila memungkinkan.

### Document

Tetap gunakan `DetailDocumentPreview`.

Dokumen harus tetap dapat dibuka pada tab/window baru.

Jika document berupa image, preview thumbnail tetap dipertahankan.

### Payout

Tampilkan:

- Bank
- Nomor Rekening (masked sesuai existing helper)
- Nama Pemilik
- status rekening utama

Gunakan `DetailPayoutCard` existing apabila bisa dipertahankan.

---

## 12. Supporting Documents

Konsep pada desain target menunjukkan bahwa informasi pendukung berada pada section yang sedang direview.

Implementasi yang direkomendasikan:

```text
[Detail Content]

Dokumen Pendukung
┌─────────────────────────────────────┐
│ file icon  Surat Izin Usaha         │
│            slug-warung-kapuas.pdf   │
│            245 KB             Buka  │
└─────────────────────────────────────┘
```

Jangan menduplikasi file preview component.

Gunakan:

```tsx
<DetailDocumentPreview ... />
```

atau abstraksi kecil di atasnya jika dibutuhkan layout khusus.

---

## 13. Verification Guidance

Setiap section boleh memiliki guidance khusus.

Gunakan visual `Alert`/informational callout existing.

Struktur:

```text
[Info icon]
Verifikasi kesesuaian informasi bisnis dengan dokumen pendukung.
```

Guidance adalah instruksi reviewer, bukan catatan merchant.

Simpan dalam constant:

```ts
const REVIEW_COMPONENT_GUIDES: Record<ReviewComponent, string> = { ... }
```

Jangan hard-code string berulang di JSX.

---

## 14. Reviewer Note

Behavior existing harus dipertahankan.

Saat review sudah memiliki:

```ts
review.note
```

tampilkan sebagai:

```text
Catatan Reviewer
{review.note}
```

Saat `canReview === true`, reviewer dapat mengisi catatan baru.

Textarea tidak harus selalu memenuhi seluruh section. Gunakan spacing yang compact.

Contoh:

```text
Catatan (opsional)
┌────────────────────────────────────────────┐
│ Tambahkan catatan untuk keputusan ini...  │
└────────────────────────────────────────────┘
```

Maksimum tetap:

```text
2000 characters
```

---

## 15. Action Verifikasi

Button:

```text
✓ Verifikasi
```

Behavior:

- tetap memanggil `onVerify(note)`.
- disable ketika `isSubmitting`.
- tampilkan spinner selama mutation.
- tidak mengubah API contract.

Setelah berhasil:

- status section berubah menjadi `Terverifikasi`.
- section tidak boleh reset data note secara tidak terduga.
- progress sidebar tetap ikut update berdasarkan state parent.

---

## 16. Action Tolak

Button:

```text
× Tolak
```

Behavior:

- tetap membuka confirmation dialog existing.
- gunakan `AlertDialog` yang sekarang.
- jangan pindahkan rejection workflow ke parent jika tidak diperlukan.
- `onReject(note)` tetap menjadi callback akhir.

Dialog title/description tetap sesuai domain existing.

---

## 17. Existing Review Logic

Redesign UI **tidak boleh** mengubah logic berikut di `detail-view.tsx`:

### Permission

```ts
canReviewPermission
```

### Assignment

```ts
isAssignedToMe
```

### Availability

```ts
const canReview =
    canReviewPermission &&
    isInReview &&
    isAssignedToMe
```

### Mutation

```ts
useReviewComponent()
```

### Reviewing key

```ts
reviewingKey
```

### Review lookup

```ts
findReview(
    approval.reviews,
    subject.subjectType,
    subject.subjectId
)
```

### Progress

```ts
summarizeReviewProgress(
    subjects,
    approval.reviews
)
```

Semua tetap menjadi source of truth.

---

## 18. Component Architecture yang Direkomendasikan

### File existing

Pertahankan:

```text
app/modules/merchant-approval/components/detail/detail-component-review-card.tsx
```

Namun ubah semantic-nya dari "Card" menjadi review accordion item.

Nama file **tidak wajib diubah** pada phase ini agar import dan scope perubahan tetap kecil.

### Suggested internal structure

```tsx
export function DetailComponentReviewCard(...) {
    return (
        <AccordionItem>
            <AccordionTrigger>
                <ReviewSectionHeader />
            </AccordionTrigger>

            <AccordionContent>
                <ReviewSectionContent />
                <ReviewGuidance />
                <ReviewActions />
            </AccordionContent>
        </AccordionItem>
    )
}
```

Boleh mengekstrak helper component:

```text
ReviewSectionHeader
ReviewSectionContent
ReviewGuidance
ReviewActions
```

hanya jika kompleksitas JSX meningkat.

Jangan membuat terlalu banyak file kecil untuk satu redesign.

---

## 19. Perubahan Parent Layout

Pada:

`app/modules/merchant-approval/components/detail/detail-view.tsx`

ubah:

```tsx
<div className="grid gap-4 xl:grid-cols-2">
```

menjadi container accordion.

Contoh konseptual:

```tsx
<Accordion
    type="single"
    collapsible
    className="flex flex-col gap-2"
>
    {subjects.map((subject) => (
        <DetailComponentReviewCard ... />
    ))}
</Accordion>
```

`DetailComponentReviewCard` menjadi `AccordionItem`.

Pastikan hanya terdapat satu parent Accordion untuk seluruh collection agar state open/close terkoordinasi.

---

## 20. Responsive Design

### Desktop

- Section width penuh pada content column.
- Header detail terbaca tanpa wrapping berlebihan.
- Status berada di kanan.
- Action buttons sejajar horizontal.

### Tablet

- Header tetap horizontal.
- Action tetap horizontal jika space mencukupi.
- Supporting fields dapat turun menjadi 1 column.

### Mobile

Walaupun admin saat ini desktop-oriented, section harus tetap usable:

- title dan description boleh wrap.
- status tetap terlihat.
- action buttons dapat menjadi horizontal full-width atau stack sesuai space.
- document preview tidak boleh overflow horizontal.
- field values harus memiliki `wrap-break-word`.

---

## 21. Visual Design Rules

Pertahankan design system existing:

- shadcn-like components.
- Tailwind.
- Lucide icons.
- existing `Text`.
- existing `Badge`.
- existing `Button`.
- existing `Accordion`.
- existing `Alert`.

### Border

Gunakan:

```text
border border-border
rounded-xl
```

Tidak perlu lagi menggunakan border-left status seperti implementasi current card.

Status diekspresikan melalui badge/header, bukan decorative vertical strip.

### Background

- Normal header: `bg-card`.
- Detail: `bg-card`.
- Guidance: muted/light informational background.
- Existing dark mode harus tetap bekerja.

### Spacing

Gunakan spacing konsisten:

- section gap: `8px–12px`
- header padding: `16px`
- detail content: `16px–24px`
- internal fields: `12px–16px`

Nilai akhir mengikuti existing spacing tokens bila tersedia.

---

## 22. Accessibility

Accordion harus:

- menggunakan native/primitive Accordion semantics.
- dapat dioperasikan keyboard.
- memiliki trigger yang jelas.
- memiliki visible focus ring.

Button:

- memiliki text label.
- spinner tetap `aria-hidden`.
- jangan mengandalkan warna saja untuk status.

Document links:

- memiliki `aria-label`.

Textarea:

- label terhubung dengan `htmlFor`.

---

## 23. State Behavior Matrix

| Review Status | Header           | Content                      | Actions                                           |
| ------------- | ---------------- | ---------------------------- | ------------------------------------------------- |
| Pending       | `Belum Direview` | Detail data                  | Verifikasi + Tolak jika reviewer punya permission |
| Verified      | `Terverifikasi`  | Detail data + existing note  | Tetap tampil sesuai policy parent                 |
| Rejected      | `Ditolak`        | Detail data + rejection note | Tetap tampil sesuai policy parent                 |
| Cannot review | status badge     | Read-only                    | Tidak ada review actions                          |

Catatan: availability action mengikuti `canReview`, bukan hanya status component.

---

## 24. Loading / Submission State

Saat mutation review berjalan:

- hanya section yang sedang di-submit yang menunjukkan loading.
- section lain tetap usable/read-only.
- `isSubmitting` tetap berasal dari:

```ts
review.isPending && reviewingKey === subjectKey(subject)
```

Jangan menggunakan global loading yang mengunci seluruh accordion.

---

## 25. Empty State

Jika `subjects.length === 0`, pertahankan empty state current:

```text
Tidak ada komponen untuk direview.
```

Jangan membuat accordion kosong.

Untuk subject individual yang datanya tidak tersedia:

- tampilkan explanatory empty state.
- jangan menyebabkan seluruh accordion crash.

---

## 26. Error Handling

Jangan mengubah existing error handling.

Error mutation tetap diproses oleh:

```ts
errorMessage(error, fallback)
```

dan ditampilkan melalui toast.

UI accordion tidak boleh swallow exception dari child component.

---

## 27. Data Privacy

Data sensitif tetap mengikuti behavior existing.

Khusus identity dan payout:

- gunakan masking existing apabila sudah tersedia.
- jangan memperluas visibility field sensitif hanya karena redesign.
- jangan logging data sensitif ke console.

---

## 28. Scope File

### Primary

```text
app/modules/merchant-approval/components/detail/detail-component-review-card.tsx
app/modules/merchant-approval/components/detail/detail-view.tsx
```

### Potentially touched

```text
app/modules/merchant-approval/services/merchant-approval.mappers.ts
```

Hanya jika diperlukan untuk:

- section descriptions
- review guidance
- display metadata

### Reuse existing

```text
detail-snapshot-section.tsx
detail-document-preview.tsx
detail-outlet-card.tsx
detail-payout-card.tsx
detail-rejection-dialog.tsx
```

Jangan rewrite file-file tersebut hanya untuk visual redesign apabila tidak perlu.

---

## 29. Tidak Perlu Perubahan Backend

Tidak ada kebutuhan endpoint baru.

Tidak ada perubahan request payload.

Tidak ada perubahan response DTO.

Tidak ada migration database.

Tidak ada perubahan permission.

---

## 30. Acceptance Criteria

### AC-01 Accordion

- [ ] Review tab menggunakan satu accordion/list section.
- [ ] Tidak ada lagi two-column review card grid pada desktop.
- [ ] Semua review subject tetap muncul sesuai order existing.

### AC-02 Header

- [ ] Setiap section memiliki icon.
- [ ] Setiap section memiliki title.
- [ ] Setiap section memiliki description.
- [ ] Status badge terlihat saat collapsed.
- [ ] Chevron menunjukkan state accordion.

### AC-03 Content

- [ ] Detail bisnis tetap muncul.
- [ ] Detail identity tetap muncul.
- [ ] Detail legal entity tetap muncul untuk company.
- [ ] Detail service tetap muncul.
- [ ] Semua category tetap muncul.
- [ ] Semua outlet tetap dapat direview.
- [ ] Semua document tetap dapat dibuka.
- [ ] Payout data tetap tersedia.

### AC-04 Review Action

- [ ] Verifikasi masih memanggil callback existing.
- [ ] Tolak masih menggunakan confirmation dialog existing.
- [ ] Catatan reviewer tetap bisa diisi.
- [ ] Max note length tetap 2000.
- [ ] Loading hanya aktif pada component yang sedang disubmit.

### AC-05 Status

- [ ] Pending → Belum Direview.
- [ ] Verified → Terverifikasi.
- [ ] Rejected → Ditolak.
- [ ] Status selalu sinkron dengan `approval.reviews`.

### AC-06 Permission

- [ ] Reviewer tanpa permission tidak melihat review actions.
- [ ] Reviewer yang bukan assignee tidak dapat review.
- [ ] Existing `canReview` rule tidak berubah.

### AC-07 Responsive

- [ ] Desktop usable.
- [ ] Tablet usable.
- [ ] Tidak ada horizontal overflow pada mobile width.
- [ ] Text panjang wrap dengan benar.

### AC-08 Accessibility

- [ ] Accordion keyboard accessible.
- [ ] Focus state terlihat.
- [ ] Buttons mempunyai accessible names.
- [ ] Document links mempunyai label.

---

## 31. Testing Plan

### Manual

Uji minimal pada:

1. Semua component masih pending.
2. Sebagian component verified.
3. Sebagian component rejected.
4. Merchant individual tanpa legal entity.
5. Merchant company dengan legal entity.
6. Banyak category.
7. Banyak outlet.
8. Banyak document.
9. Reviewer assigned.
10. User tidak assigned.
11. Mutation success.
12. Mutation error.
13. Long note.
14. Dark mode.
15. Browser resize desktop → tablet → mobile.

### Automated

Pertimbangkan unit/component test untuk:

- status rendering.
- correct subject ordering.
- `canReview`.
- document rendering.
- accordion open state.
- callback `onVerify`.
- callback `onReject`.

Tidak perlu mengubah existing mapper tests jika behavior domain tidak berubah.

---

## 32. Implementation Notes untuk AI Coding Agent

Saat implementasi:

1. Baca terlebih dahulu:
    - `detail-component-review-card.tsx`
    - `detail-view.tsx`
    - `detail-snapshot-section.tsx`
    - `detail-snapshot-sections.tsx`
    - `detail-document-preview.tsx`
    - `detail-outlet-card.tsx`
    - `detail-payout-card.tsx`
    - `merchant-approval.mappers.ts`

2. Gunakan komponen UI existing sebelum membuat abstraction baru.

3. Jangan mengubah business logic mutation.

4. Jangan mengubah API contract.

5. Jangan membuat mock data baru.

6. Gunakan `approval.reviews` dan `ReviewableSubject` sebagai source of truth.

7. Prioritaskan perubahan pada presentation layer.

8. Pastikan existing Sidebar, Tabs, Timeline, Revision History dan status summary tidak ikut berubah.

9. Jangan menghapus `DetailComponentReviewCard` tanpa replacement yang setara.

10. Setelah implementasi, lakukan type-check/build dan pastikan tidak muncul error TypeScript dari icon/component typing.

---

## 33. Definition of Done

Perubahan dianggap selesai ketika:

- UI Review Component menyerupai struktur referensi target.
- Review list berubah dari grid card menjadi accordion section.
- Semua data dan actions existing tetap berfungsi.
- Tidak ada perubahan API/backend.
- Tidak ada regression pada workflow approval.
- Responsive behavior aman.
- TypeScript lint/type-check/build berhasil.
- Tidak ada console error ketika membuka dan melakukan review setiap component.

---

## 34. Ringkasan Implementasi

Perubahan inti dapat diringkas sebagai:

```text
CURRENT

Review Tab
└── 2-column Card Grid
    ├── Business Card
    ├── Identity Card
    ├── Legal Entity Card
    ├── Service Card
    ├── Category Card
    ├── Outlet Card
    ├── Document Card
    └── Payout Card


TARGET

Review Tab
└── Accordion
    ├── Informasi Bisnis       [Status]
    ├── Identitas Pemilik      [Status]
    ├── Badan Hukum            [Status]
    ├── Layanan                [Status]
    ├── Kategori               [Status]
    ├── Outlet                 [Status]
    ├── Dokumen                [Status]
    └── Pencairan Dana         [Status]

Expanded Section
└── Detail Data
    ├── Supporting Documents
    ├── Reviewer Guidance
    ├── Reviewer Note
    └── [Tolak] [Verifikasi]
```

Dokumen ini merupakan PRD perubahan UI/presentation layer untuk `Merchant Approval Review Component` dan tidak mengubah workflow bisnis approval yang sudah berjalan.
