import { useMutation } from "@tanstack/react-query"

import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from "../schemas/auth.schemas"
import { authService } from "./auth.api"

export function useLoginMutation() {
    return useMutation({
        mutationFn: (input: LoginInput) => authService.login(input),
    })
}

export function useForgotPasswordMutation() {
    return useMutation({
        mutationFn: (input: ForgotPasswordInput) => authService.forgotPassword(input),
    })
}

export function useResetPasswordMutation() {
    return useMutation({
        mutationFn: (input: ResetPasswordInput) => authService.resetPassword(input),
    })
}
