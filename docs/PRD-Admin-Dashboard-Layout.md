# PRD — JualAntar Admin Dashboard Layout

## 1. Overview

**Product:** JualAntar Admin Dashboard  
**Module:** Admin Dashboard Layout  
**Platform:** Responsive Web Application  
**User:** Super Admin / Admin Internal

Implement the approved JualAntar admin dashboard UI as a reusable, responsive layout. The API is not yet available, so use mock/static data while keeping the presentation layer ready for future API integration.

## 2. Goals

- Modern, professional, clean, and easy to use.
- Consistent with JualAntar branding.
- Responsive on desktop, tablet, and mobile.
- Clear information hierarchy.
- Group sidebar navigation by function.
- Keep UI/data concerns separated.
- Prepare the layout for future API integration.

## 3. Brand

- **Brand:** JualAntar
- **Tagline:** Jual Mudah, Antar Cepat
- **Primary:** `#E53935`
- **Typography:** Plus Jakarta Sans
- Supporting: white, dark navy, neutral gray, soft red, green, blue, yellow.

## 4. Overall Structure

```text
DashboardLayout
├── Sidebar
├── Topbar
└── Main Content
```

Desktop uses a fixed/sticky sidebar and topbar. The content area must use the remaining viewport efficiently.

## 5. Sidebar

The sidebar must be wider than the initial 50/50 reference layout so menu labels and grouping remain easy to read.

### Header

- JualAntar logo
- Sidebar collapse button at the top

### Navigation Groups

```text
DASHBOARD
  Dashboard

OPERASIONAL
  Pesanan
  Kurir
  Pelanggan

MANAJEMEN BISNIS
  Merchant
  Produk & Menu
  Promosi

KEUANGAN
  Transaksi
  Laporan Keuangan

PENGATURAN
  Pengaturan
  Manajemen User
  Aktivitas Log
```

Group labels use small uppercase muted typography.

### Active State

- Soft red background
- JualAntar red icon/text
- Rounded container

### Important

Do **not** place a user profile/dropdown at the bottom of the sidebar.

Do **not** place a “Sembunyikan Sidebar” button at the bottom.

The collapse control exists only at the top of the sidebar. The admin user profile/dropdown is handled by the topbar.

### Collapsed State

- Icon-only sidebar.
- Hide group labels.
- Provide tooltips for icons.
- Compact logo/brand mark.
- Main content expands accordingly.

## 6. Topbar

Topbar contains:

### Search

Placeholder:

`Cari pesanan, kurir, merchant, atau menu...`

Show shortcut:

`Ctrl K`

### Right Side

- Notification button
- Notification indicator
- Admin avatar
- `Super Admin`
- `Administrator`
- Profile dropdown

User profile must exist only in the topbar.

## 7. Dashboard Header

Display:

**Selamat datang kembali, Super Admin 👋**

Supporting text:

**Berikut ringkasan aktivitas JualAntar hari ini.**

Desktop may show:

```text
Selasa, 9 September 2025
Pukul 14:32 WIB
```

Use dynamic date/time when real application data is available.

## 8. KPI Cards

Display four cards:

| Metric          | Value | Trend |
| --------------- | ----: | ----: |
| Total Pesanan   | 1.248 |  +12% |
| Total Merchant  |    86 |   +8% |
| Total Kurir     |   320 |  +15% |
| Total Pelanggan | 5.482 |  +11% |

Each card contains icon, label, value, trend, and supporting text.

Treat these as mock data until verified API data exists.

## 9. Revenue Card

Title:

**Pendapatan**

Display:

`↑ 20% dari minggu lalu`

`Rp 48.250.000`

Use a responsive line chart with:

`7 Hari Terakhir`

The chart should use JualAntar red as the primary accent and provide readable labels/tooltips.

## 10. Order Status Card

Use a responsive donut chart.

Center:

```text
1.248
Total
```

Statuses:

```text
Selesai      842   67%
Diproses     180   14%
Dibatalkan    96    8%
Menunggu     132   11%
```

Provide both visual and textual status information.

## 11. Kapuas Hulu Highlight

Use a rounded scenic landscape card.

Content:

**Kapuas Hulu, Kalimantan Barat**

**Layanan yang lebih baik untuk masyarakat Kapuas Hulu.**

**Terus bergerak, menghadirkan kemudahan di setiap perjalanan.**

Include a compact arrow CTA.

Use the image as secondary dashboard content; it must not compete with operational data.

## 12. Recent Orders

Title:

**Pesanan Terbaru**

Action:

**Lihat semua**

Columns:

```text
#
Pelanggan
Merchant
Total
Status
Waktu
```

Mock examples:

```text
#JA-1001 | Budi Santoso | Warung Makan Sederhana | Rp 45.000 | Selesai  | 5 menit lalu
#JA-1002 | Siti Rahma   | Kedai Kopi Kita         | Rp 28.000 | Diproses | 12 menit lalu
#JA-1003 | Andi Pratama | Ayam Geprek Mantap      | Rp 36.000 | Selesai  | 18 menit lalu
#JA-1004 | Dewi Lestari | Bakso Pak Jono          | Rp 22.000 | Menunggu | 25 menit lalu
#JA-1005 | Rizki Maulana| Soto Banjar             | Rp 30.000 | Selesai  | 32 menit lalu
```

Use status badges.

On mobile, transform to a readable list/card or use a contained horizontal scroll. Never cause page-level horizontal overflow.

## 13. Recent Activity

Title:

**Aktivitas Terbaru**

Action:

**Lihat semua**

Mock activities:

- Pesanan baru #JA-1005 — 32 menit lalu
- Kurir Budi mulai pengantaran — 45 menit lalu
- Merchant baru bergabung — 1 jam lalu
- Pembayaran diterima — 2 jam lalu
- Pesanan #JA-1003 selesai — 2 jam lalu

Use consistent icons per activity type.

## 14. Online Couriers

Title:

**Kurir Online**

Action:

**Lihat semua**

Display avatar, name, activity, and online/offline status.

Mock users:

- Budi Santoso — Sedang mengantar — Online
- Andi Pratama — Tersedia — Online
- Rizki Maulana — Tersedia — Online
- Dewi Lestari — Istirahat — Offline
- Fajar Nugroho — Tersedia — Online

## 15. Order Statistics

Title:

**Statistik Pesanan**

Filter:

`7 Hari Terakhir`

Use responsive bar chart.

Mock values:

```text
1 Sep  120
2 Sep  180
3 Sep  220
4 Sep  145
5 Sep  185
6 Sep  195
7 Sep  235
8 Sep  270
9 Sep  300
```

## 16. Top Merchant

Title:

**Top Merchant**

Action:

**Lihat semua**

Columns:

```text
#
Merchant
Total Pesanan
```

Mock data:

```text
1 | Warung Makan Sederhana | 320
2 | Kedai Kopi Kita         | 276
3 | Ayam Geprek Mantap      | 245
4 | Bakso Pak Jono          | 198
5 | Soto Banjar             | 154
```

## 17. Desktop Grid

Target composition:

```text
KPI
┌──────┬──────┬──────┬──────┐
│ KPI  │ KPI  │ KPI  │ KPI  │
└──────┴──────┴──────┴──────┘

┌──────────────────┬──────────────┬──────────────┐
│ Pendapatan       │ Status       │ Kapuas Hulu  │
└──────────────────┴──────────────┴──────────────┘

┌──────────────────────────┬──────────────────────┬──────────────┐
│ Pesanan Terbaru          │ Aktivitas Terbaru   │ Kurir Online │
└──────────────────────────┴──────────────────────┴──────────────┘

┌──────────────────────────────────────┬─────────────────────────┐
│ Statistik Pesanan                    │ Top Merchant            │
└──────────────────────────────────────┴─────────────────────────┘
```

Do not force this exact grid on smaller screens; prioritize readability.

## 18. Responsive Requirements

### Desktop — ≥1280px

- Wide grouped sidebar.
- Full topbar.
- Four KPI columns.
- Multi-column dashboard grid.
- Full tables/charts.

### Tablet — 768–1279px

- Sidebar may collapse to icon navigation.
- KPI becomes two columns.
- Cards use two-column layouts where appropriate.
- Reduce padding/spacing.
- Search becomes narrower.

### Mobile — <768px

Use:

```text
Topbar
  Menu
  Logo
  Notification
  Profile

Main Content
```

- Desktop sidebar becomes a mobile drawer/sheet.
- Keep the same navigation groups.
- KPI cards: one or two columns depending on width.
- Dashboard cards: one column.
- Charts: full width with responsive height.
- Tables become lists/cards or contained horizontal scrolling.
- No page-level horizontal overflow.

## 19. Mobile Navigation

Mobile drawer must preserve the same groups:

```text
DASHBOARD
Dashboard

OPERASIONAL
Pesanan
Kurir
Pelanggan

MANAJEMEN BISNIS
Merchant
Produk & Menu
Promosi

KEUANGAN
Transaksi
Laporan Keuangan

PENGATURAN
Pengaturan
Manajemen User
Aktivitas Log
```

Use accessible open/close behavior and close the drawer after navigation.

## 20. Component Structure

Recommended:

```text
DashboardLayout
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarGroup
│   ├── SidebarItem
│   └── SidebarCollapseButton
├── Topbar
│   ├── Search
│   ├── Notification
│   └── AdminProfile
└── DashboardContent
    ├── DashboardHeader
    ├── StatsGrid
    │   └── StatCard
    ├── RevenueCard
    ├── OrderStatusCard
    ├── LocalImpactCard
    ├── RecentOrdersCard
    ├── RecentActivityCard
    ├── OnlineCouriersCard
    ├── OrderStatisticsCard
    └── TopMerchantsCard
```

Reuse existing shadcn/ui primitives where available. Avoid unnecessary abstraction.

## 21. Data Boundary

Current:

```text
Mock Data
   ↓
Dashboard Components
```

Future:

```text
API
 ↓
Query/Data Layer
 ↓
Dashboard Components
```

Do not put fetch/axios calls directly inside dashboard presentation components.

## 22. UI States

Implement reusable:

### Loading

- Skeletons
- Chart placeholders
- No layout jumping

### Empty

Examples:

`Belum ada pesanan`

`Belum ada aktivitas`

`Belum ada kurir online`

### Error

Example:

`Data gagal dimuat.`

`Coba lagi`

## 23. Accessibility

- Semantic HTML.
- Correct heading hierarchy.
- Keyboard navigation.
- Visible focus states.
- Accessible buttons and navigation.
- Tooltips for collapsed sidebar icons.
- Charts have textual summaries.
- Status is not communicated by color alone.
- Touch targets around 44px or larger.
- Sufficient contrast.
- Respect `prefers-reduced-motion`.

## 24. Visual Design

- Modern
- Minimal
- Professional
- Clean
- Friendly
- Reliable

Cards:

- Radius: `16–20px`
- Subtle border
- Subtle shadow
- Consistent padding

Use Lucide Icons or the project's existing icon system.

## 25. Motion

Use subtle motion only:

- Sidebar collapse
- Mobile drawer
- Dropdown
- Hover
- Loading

Recommended duration:

`150–300ms`

Respect `prefers-reduced-motion`.

## 26. Performance

- Optimize images.
- Use responsive image sizing.
- Lazy-load non-critical content when appropriate.
- Keep charts lightweight.
- Avoid unnecessary JavaScript.
- Prevent layout shifts.
- Avoid page-level horizontal overflow.

## 27. Security

The dashboard is an authenticated/private area.

```text
Unauthenticated
    ↓
Login
    ↓
Authenticated
    ↓
Dashboard
```

If authentication expires:

```text
Dashboard
    ↓
Session expired
    ↓
Login
```

Frontend visibility is not a security boundary; authorization must be enforced by the backend later.

## 28. SEO

Admin pages are private and should not be indexed by search engines.

## 29. Out of Scope

- Backend API
- Database
- Real-time data
- Authentication implementation
- Authorization backend
- Order management logic
- Courier management logic
- Merchant management logic
- Payment processing
- Actual analytics implementation

## 30. Acceptance Criteria

### Layout

- [ ] Dashboard layout implemented.
- [ ] Wide grouped sidebar implemented.
- [ ] Sidebar collapse works.
- [ ] User profile is only in topbar.
- [ ] No user profile/dropdown at sidebar bottom.
- [ ] No “Sembunyikan Sidebar” button at sidebar bottom.
- [ ] Topbar search, notification, and profile implemented.

### Dashboard

- [ ] Greeting implemented.
- [ ] Four KPI cards implemented.
- [ ] Revenue chart implemented.
- [ ] Order status chart implemented.
- [ ] Kapuas Hulu highlight card implemented.
- [ ] Recent orders implemented.
- [ ] Recent activity implemented.
- [ ] Online couriers implemented.
- [ ] Order statistics implemented.
- [ ] Top merchants implemented.

### Responsive

- [ ] Desktop works correctly.
- [ ] Tablet works correctly.
- [ ] Mobile works correctly.
- [ ] Mobile navigation uses drawer/sheet.
- [ ] No page-level horizontal overflow.
- [ ] Tables remain usable.
- [ ] Charts remain responsive.
- [ ] KPI cards adapt to viewport.

### UI States

- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Active navigation state.
- [ ] Hover state.
- [ ] Collapsed sidebar state.

### Accessibility

- [ ] Keyboard navigation.
- [ ] Visible focus.
- [ ] Accessible navigation/buttons.
- [ ] Chart textual alternatives.
- [ ] Adequate touch targets.
- [ ] Reduced-motion support.

## 31. Implementation Principle

Prioritize:

```text
Readability
    ↓
Information Hierarchy
    ↓
Responsive Behavior
    ↓
Consistency
    ↓
Visual Polish
```

The dashboard should feel like the **operational control center of JualAntar**: important information is visible quickly, navigation is easy to understand, and the layout can evolve cleanly when the API becomes available.
