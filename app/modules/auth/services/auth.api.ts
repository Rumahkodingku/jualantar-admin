import { api, ApiError } from "~/lib/api"
import { setAuthToken } from "~/lib/auth"

import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"
import { authMockService } from "./auth.mock"
import type { AuthService, LoginResponse } from "../types/auth.types"

interface LoginEnvelope {
    data: LoginResponse
}

export const authRealService: AuthService = {
    async login(input: LoginInput): Promise<LoginResponse> {
        const { data } = await api.post<LoginEnvelope>("/auth/login", input)
        const { token, token_type, user } = data.data
        setAuthToken(token)
        return {
            token,
            token_type,
            user: {
                id: String(user.id),
                name: user.name || user.email.split("@")[0],
                email: user.email,
                roles: user.roles ?? [],
            },
        }
    },

    async forgotPassword(): Promise<void> {
        throw new ApiError("Fitur reset password belum tersedia.", 501)
    },

    async resetPassword(): Promise<void> {
        throw new ApiError("Fitur reset password belum tersedia.", 501)
    },
}

const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true"

export const authService: AuthService = useMockAuth ? authMockService : authRealService