import { ApiError } from "~/lib/api"

import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"
import type { AuthService, LoginResponse } from "../types/auth.types"

const MOCK_DELAY_MS = 800
const MOCK_ADMIN_EMAIL = "admin@jualantar.id"
const MOCK_ADMIN_PASSWORD = "password"

function simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
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
            user: {
                id: "1",
                name: "Admin JualAntar",
                email,
                roles: ["super-admin"],
            },
        }
    },
    async forgotPassword(_input: ForgotPasswordInput): Promise<void> {
        await simulateDelay()
    },
    async resetPassword(_input: ResetPasswordInput): Promise<void> {
        await simulateDelay()
    },
}
