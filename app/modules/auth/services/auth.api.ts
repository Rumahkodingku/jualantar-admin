import { api } from "~/lib/api"

import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"
import { authMockService } from "./auth.mock"
import type { AuthService, LoginResponse } from "../types/auth.types"

export const authRealService: AuthService = {
    async login(input: LoginInput): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>("/auth/login", input)
        return data
    },

    async forgotPassword(input: ForgotPasswordInput): Promise<void> {
        await api.post("/auth/forgot-password", input)
    },

    async resetPassword(input: ResetPasswordInput): Promise<void> {
        await api.post("/auth/reset-password", input)
    },
}

// Ganti menjadi authRealService ketika backend auth tersedia.
export const authService: AuthService = authMockService
