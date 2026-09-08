import { ArrowLeftIcon } from "lucide-react"
import { Link } from "react-router"

import { AuthHeader } from "../components/auth-header"
import { ForgotPasswordForm } from "../components/forgot-password-form"

export function ForgotPasswordPage() {
    return (
        <div className="flex flex-col gap-6">
            <AuthHeader
                eyebrow="PULIHKAN AKSES"
                title="Lupa Password?"
                description="Masukkan email akun admin Anda. Kami akan mengirimkan instruksi untuk mengatur ulang password."
            />
            <ForgotPasswordForm />
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
