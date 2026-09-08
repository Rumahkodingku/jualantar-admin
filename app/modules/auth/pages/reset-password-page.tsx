import { ArrowLeftIcon } from "lucide-react"
import { Link } from "react-router"

import { AuthHeader } from "../components/auth-header"
import { ResetPasswordForm } from "../components/reset-password-form"

export function ResetPasswordPage() {
    return (
        <div className="flex flex-col gap-6">
            <AuthHeader
                eyebrow="PULIHKAN AKSES"
                title="Buat Password Baru"
                description="Masukkan password baru untuk akun admin Anda."
            />
            <ResetPasswordForm />
            <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeftIcon className="size-4" aria-hidden="true" />
                Kembali ke Login
            </Link>
        </div>
    )
}
