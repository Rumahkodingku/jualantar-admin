import { AuthHeader } from "../components/auth-header"
import { AuthSecurityNotice } from "../components/auth-security-notice"
import { LoginForm } from "../components/login-form"

export function LoginPage() {
    return (
        <div className="flex flex-col gap-6">
            <AuthHeader
                eyebrow="SELAMAT DATANG"
                title="Login ke Dashboard JualAntar"
                description="Masuk untuk mengakses panel admin dan mengelola seluruh operasional platform."
            />
            <LoginForm />
            <AuthSecurityNotice />
        </div>
    )
}
