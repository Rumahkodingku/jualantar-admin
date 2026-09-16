import { ApiError } from "~/lib/api"

import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"
import type { AuthService, AuthUser, LoginResponse } from "../types/auth.types"

const MOCK_DELAY_MS = 800
const MOCK_ADMIN_EMAIL = "admin@jualantar.id"
const MOCK_ADMIN_PASSWORD = "password"

const MOCK_PERMISSIONS = [
    "merchant.approval.view",
    "merchant.approval.claim",
    "merchant.approval.review",
    "merchant.approval.revision",
    "merchant.approval.reject",
    "merchant.approval.approve",
]

function simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

const mockAdmin: AuthUser = {
    id: "1",
    name: "Admin JualAntar",
    email: MOCK_ADMIN_EMAIL,
    roles: ["super-admin"],
    permissions: MOCK_PERMISSIONS,
}

export const authMockService: AuthService = {
    async login({ email, password }): Promise<LoginResponse> {
        await simulateDelay()

        if (email !== MOCK_ADMIN_EMAIL || password !== MOCK_ADMIN_PASSWORD) {
            throw new ApiError("Email atau password yang Anda masukkan salah.", 401)
        }

        return {
            token: "mock-token",
            token_type: "Bearer",
            user: { ...mockAdmin, email },
        }
    },
    async me(): Promise<AuthUser> {
        await simulateDelay()
        return mockAdmin
    },
    async forgotPassword(_input: ForgotPasswordInput): Promise<void> {
        await simulateDelay()
    },
    async resetPassword(_input: ResetPasswordInput): Promise<void> {
        await simulateDelay()
    },
}
