# PRD --- JualAntar Admin Authentication UI

## 1. Overview

**Product:** JualAntar Admin Dashboard\
**Module:** Authentication UI\
**Platform:** Responsive Web Application\
**Current Phase:** UI-first development --- API authentication belum
tersedia

JualAntar membutuhkan halaman authentication khusus untuk pengguna
internal/admin. Pada fase ini fokus pengembangan adalah UI/UX
authentication, responsive behavior, form validation, loading state,
error state, dan struktur frontend yang siap dihubungkan ke API pada
tahap berikutnya.

Authentication admin **hanya menggunakan Email + Password**.

> Jangan menyediakan Google Login, social login, public registration,
> atau metode authentication lain.

## 2. Goals

- Membuat halaman login admin yang modern, profesional, dan mudah
  digunakan.
- Menjaga konsistensi visual dengan brand JualAntar.
- Responsive pada desktop, tablet, dan mobile.
- Menyiapkan UI state yang lengkap sebelum API tersedia.
- Memisahkan UI/form logic dari API integration.
- Memberikan pengalaman authentication yang jelas dan aman untuk
  pengguna internal.

## 3. Brand

- **Brand:** JualAntar
- **Tagline:** Jual Mudah, Antar Cepat
- **Primary color:** `#E53935`
- **Typography:** Plus Jakarta Sans

Supporting colors: white, near-black/dark navy, neutral gray, soft red,
dan light gray.

## 4. Target User

Halaman authentication hanya ditujukan untuk:

- Admin
- Staff internal JualAntar
- Pengguna internal yang memiliki akses dashboard

Tidak ada public registration.

## 5. Authentication Flow

```text
Login Page
    ↓
Input Email + Password
    ↓
Validasi Form
    ↓
Submit
    ↓
Loading
    ↓
Authentication API
    ├── Success → Dashboard Admin
    └── Failed  → Error State
```

Forgot/reset password flow juga disiapkan sebagai UI, tetapi API dapat
menggunakan mock service sampai backend tersedia.

## 6. Login Page

### Desktop

Gunakan split layout:

**Left --- Brand Panel** - JualAntar logo - Brand messaging - Unsplash
landscape image - Regional/Kapuas Hulu visual identity - Decorative red
shape/accent

Headline:

**Bersama Menggerakkan Kapuas Hulu**

Supporting copy:

> Kelola operasional, pantau pertumbuhan, dan wujudkan layanan yang
> lebih baik untuk masyarakat Kapuas Hulu.

### Unsplash Image

Gunakan foto landscape dari Unsplash dengan nuansa Indonesia/Kalimantan:
danau, hutan, perbukitan, dan landscape hijau.

Referensi yang relevan adalah foto **Roni Darmanto** yang berlokasi di
Melawi Regency, West Kalimantan dan tersedia sebagai free photo under
the Unsplash License:

<https://unsplash.com/photos/a-small-hut-in-the-middle-of-a-lush-green-hillside-Z9rh7L1_jvk>

Foto tersebut hanya digunakan sebagai **regional visual**, bukan sebagai
klaim bahwa lokasi foto adalah Kapuas Hulu.

Alternatif:

<https://unsplash.com/s/photos/indonesia-landscape>

Untuk production, sebaiknya download dan simpan asset terpilih secara
lokal lalu optimalkan dengan image pipeline project.

### Right --- Login Card

Header:

- Eyebrow: `SELAMAT DATANG`
- Heading: `Login ke Dashboard JualAntar`
- Description:
  `Masuk untuk mengakses panel admin dan mengelola seluruh operasional platform.`

Form:

1. **Email**
    - Type: `email`
    - Placeholder: `admin@jualantar.id`
2. **Password**
    - Type: `password`
    - Placeholder: `Masukkan password`
    - Show/hide password
3. **Remember me**
    - `Ingat saya pada perangkat ini`
4. **Forgot password**
    - `Lupa password?`
5. **Primary CTA**
    - `Masuk`
6. **Security notice**
    - `Hanya untuk pengguna internal JualAntar`

**Tidak ada Google Login dan tidak ada social login.**

## 7. Login States

### Default

Form kosong dan siap digunakan.

### Filled

Email valid dan password terisi.

### Validation Error

Contoh: - `Email wajib diisi.` - `Format email tidak valid.` -
`Password wajib diisi.`

### Loading

- Disable submit.
- Spinner.
- Button text: `Memproses...`
- Prevent duplicate submission.

### Authentication Error

> Email atau password yang Anda masukkan salah.

Jangan membocorkan informasi sensitif mengenai keberadaan akun.

### Success

```text
Login berhasil
→ Redirect ke Dashboard Admin
```

## 8. Forgot Password

Route:

```text
/forgot-password
```

UI:

- Heading: `Lupa Password?`
- Description:
  `Masukkan email akun admin Anda. Kami akan mengirimkan instruksi untuk mengatur ulang password.`
- Email input
- CTA: `Kirim Instruksi`
- Secondary action: `Kembali ke Login`

States:

- Default
- Validation
- Loading
- Success
- Error

Success message:

> Jika email tersebut terdaftar, instruksi reset password akan
> dikirimkan.

## 9. Reset Password

Route:

```text
/reset-password
```

Fields:

- Password baru
- Konfirmasi password

Validation:

- Minimal sesuai rule backend.
- Password dan konfirmasi harus sama.

CTA:

`Simpan Password`

Success:

> Password berhasil diperbarui. Silakan login kembali.

## 10. Responsive Design

### Desktop --- ≥1024px

Split layout dengan brand/image panel sekitar 45--50% dan login panel
sekitar 50--55%.

### Tablet --- 768--1023px

Layout fleksibel. Kurangi padding dan ukuran visual jika diperlukan.

### Mobile --- \<768px

Sembunyikan large left image section.

Urutan:

```text
JualAntar Logo
↓
Login Card
↓
Security Notice
```

Requirements:

- Full-width inputs
- Full-width CTA
- Touch target sekitar 44px+
- Comfortable spacing
- No horizontal overflow
- Responsive typography

## 11. Visual Design

Style:

- Modern
- Minimal
- Professional
- Clean
- Friendly
- Reliable

Cards: `20–24px` radius\
Buttons: pill/rounded\
Shadows: subtle\
Focus ring: JualAntar red

Decorative elements dapat menggunakan curved red shape dan soft
gradients, tetapi jangan berlebihan.

## 12. Accessibility

- Semantic HTML.
- Proper labels.
- Keyboard navigation.
- Visible focus states.
- Accessible validation errors.
- `aria-invalid` dan `aria-describedby` saat diperlukan.
- Accessible password visibility button.
- Contrast yang memadai.
- Touch target sekitar 44px+.
- Loading state accessible.
- Jangan hanya menggunakan warna untuk error.

## 13. Component Structure

```text
Auth
├── LoginPage
│   ├── AuthBrandPanel
│   ├── LoginCard
│   │   ├── AuthHeader
│   │   ├── LoginForm
│   │   ├── PasswordInput
│   │   ├── RememberMe
│   │   ├── ForgotPasswordLink
│   │   └── AuthSecurityNotice
│   └── AuthError
├── ForgotPasswordPage
│   ├── AuthHeader
│   └── ForgotPasswordForm
└── ResetPasswordPage
    ├── AuthHeader
    └── ResetPasswordForm
```

Jaga component tetap sederhana dan jangan membuat abstraction
berlebihan.

## 14. Form Architecture

Pisahkan UI dari API:

```text
UI
 ↓
Form State
 ↓
Schema Validation
 ↓
Auth Service
 ↓
API
```

Jika project menggunakan React Hook Form + Zod, gunakan stack tersebut.

Sebelum API tersedia, gunakan mock service:

```text
authService.login()
authService.forgotPassword()
authService.resetPassword()
```

Jangan menempatkan fetch/axios langsung di UI component.

## 15. Routing

Minimal:

```text
/login
/forgot-password
/reset-password
```

Setelah login:

```text
/dashboard
```

Jika menggunakan route group:

```text
(auth)
├── login
├── forgot-password
└── reset-password
```

## 16. Security Rules

- Hanya Email + Password.
- Tidak ada Google/social login.
- Tidak ada public registration.
- Password masked secara default.
- Jangan menyimpan password di localStorage.
- Remember-me mengikuti mekanisme authentication backend.
- Token/session dikelola authentication layer.
- Jangan menampilkan detail error sensitif.
- Prevent duplicate submission.

## 17. Analytics

Siapkan event:

```text
login_submitted
login_success
login_failed
forgot_password_clicked
forgot_password_submitted
forgot_password_success
reset_password_success
```

Jangan pernah mengirim password atau credential ke analytics.

## 18. Performance

- Optimize Unsplash asset.
- Gunakan responsive image sizing.
- Hindari JavaScript yang tidak diperlukan.
- Jangan load large left image pada mobile jika tidak digunakan.
- Prevent layout shift.
- Gunakan font project.
- Keep animation lightweight.

## 19. Motion

Gunakan motion sederhana:

- Input focus transition
- Button hover
- Loading spinner
- Subtle card entrance

Durasi sekitar `150–300ms`.

Respect:

```css
prefers-reduced-motion
```

## 20. Out of Scope

- Backend authentication
- Database admin
- JWT/session implementation
- OAuth
- Google Login
- Social Login
- Role/permission backend
- 2FA
- Email service implementation
- Password reset API
- Dashboard functionality

Fokus fase ini adalah **UI/UX authentication frontend** dan architecture
boundary yang siap diintegrasikan dengan API.

## 21. Acceptance Criteria

### Login

- [ ] Login page tersedia.
- [ ] Email input tersedia.
- [ ] Password input tersedia.
- [ ] Password visibility toggle tersedia.
- [ ] Remember-me tersedia.
- [ ] Forgot password tersedia.
- [ ] Login CTA tersedia.
- [ ] Tidak ada Google/social login.
- [ ] Tidak ada public registration.
- [ ] Validation state tersedia.
- [ ] Loading state tersedia.
- [ ] Authentication error tersedia.
- [ ] Success redirect tersedia.

### Forgot/Reset Password

- [ ] Forgot password page tersedia.
- [ ] Email validation tersedia.
- [ ] Loading/success/error state tersedia.
- [ ] Reset password UI tersedia.
- [ ] Password confirmation validation tersedia.
- [ ] Kembali ke login tersedia.

### Responsive

- [ ] Desktop bekerja baik.
- [ ] Tablet bekerja baik.
- [ ] Mobile bekerja baik.
- [ ] Left image disembunyikan pada mobile.
- [ ] Tidak ada horizontal overflow.
- [ ] Form nyaman digunakan di layar kecil.

### Accessibility

- [ ] Semua input memiliki label.
- [ ] Keyboard navigation bekerja.
- [ ] Focus state terlihat.
- [ ] Error message accessible.
- [ ] Touch target memadai.
- [ ] Contrast memadai.

### Branding

- [ ] JualAntar branding konsisten.
- [ ] Primary color menggunakan merah JualAntar.
- [ ] Plus Jakarta Sans digunakan.
- [ ] Unsplash landscape digunakan pada brand panel.
- [ ] Tidak ada social login.

## 22. Final UX Principle

> **Simple, secure, professional, dan langsung ke tujuan.**

Admin membuka halaman → memasukkan email dan password → login → masuk ke
dashboard.

Tidak perlu pilihan authentication tambahan atau onboarding yang tidak
diperlukan.
