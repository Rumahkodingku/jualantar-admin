import type { ReactNode } from "react"
import { Logo } from "~/components/logo"
import { AuthBrandPanel } from "./auth-brand-panel"

interface AuthLayoutProps {
    children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh bg-background lg:grid-cols-[7fr_4fr]">
            {/* Left Section */}
            <AuthBrandPanel />

            {/* Right Section */}
            <main className="flex min-h-svh flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
                <div className="mx-auto flex w-full max-w-md flex-col gap-8 lg:mx-0">
                    <Logo size={60} className="text-primary lg:hidden" />
                    {children}
                </div>
            </main>
        </div>
    )
}
