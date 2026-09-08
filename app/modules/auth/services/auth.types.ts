import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"

export interface LoginResponse {
    token: string
    user: {
        id: string
        name: string
        email: string
    }
}

export interface AuthService {
    login(input: LoginInput): Promise<LoginResponse>
    forgotPassword(input: ForgotPasswordInput): Promise<void>
    resetPassword(input: ResetPasswordInput): Promise<void>
}
