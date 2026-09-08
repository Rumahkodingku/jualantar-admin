import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().min(1, "Email wajib diisi.").email("Format email tidak valid."),
    password: z.string().min(1, "Password wajib diisi."),
    rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email wajib diisi.").email("Format email tidak valid."),
})

export const resetPasswordSchema = z
    .object({
        password: z.string().min(1, "Password wajib diisi.").min(8, "Password minimal 8 karakter."),
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password dan konfirmasi password harus sama.",
        path: ["confirmPassword"],
    })

export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
