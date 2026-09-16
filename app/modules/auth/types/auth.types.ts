import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"

export interface AuthUser {
    id: string
    name: string
    email: string
    roles: string[]
}

export interface LoginResponse {
    token: string
    token_type: string
    user: AuthUser
}

export interface AuthService {
    login(input: LoginInput): Promise<LoginResponse>
    forgotPassword(input: ForgotPasswordInput): Promise<void>
    resetPassword(input: ResetPasswordInput): Promise<void>
}
