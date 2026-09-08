import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { Field, FieldContent, FieldError, FieldLabel } from "~/components/ui/field"
import { Spinner } from "~/components/ui/spinner"
import { toast } from "~/components/ui/toast"

import { resetPasswordSchema, type ResetPasswordInput } from "../schemas/auth.schemas"
import { useResetPasswordMutation } from "../services/auth.mutations"
import { authEvents } from "../services/auth.events"
import { AuthError } from "./auth-error"
import { PasswordInput } from "./password-input"

const DEFAULT_RESET_ERROR = "Terjadi kesalahan. Silakan coba lagi."

export function ResetPasswordForm() {
    const resetPasswordMutation = useResetPasswordMutation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    })

    function onSubmit(values: ResetPasswordInput) {
        resetPasswordMutation.mutate(values, {
            onSuccess: () => {
                authEvents.resetPasswordSuccess()
                toast.add({
                    type: "success",
                    title: "Password diperbarui",
                    description: "Password berhasil diperbarui. Silakan login kembali.",
                })
            },
        })
    }

    const isPending = resetPasswordMutation.isPending

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            {resetPasswordMutation.isError && (
                <AuthError message={resetPasswordMutation.error?.message ?? DEFAULT_RESET_ERROR} />
            )}

            <Field>
                <FieldLabel htmlFor="password">Password baru</FieldLabel>
                <FieldContent>
                    <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        placeholder="Masukkan password baru"
                        aria-invalid={errors.password ? true : undefined}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        {...register("password")}
                    />
                    <FieldError id="password-error" errors={[errors.password]} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel htmlFor="confirm-password">Konfirmasi password</FieldLabel>
                <FieldContent>
                    <PasswordInput
                        id="confirm-password"
                        autoComplete="new-password"
                        placeholder="Ulangi password baru"
                        aria-invalid={errors.confirmPassword ? true : undefined}
                        aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                        {...register("confirmPassword")}
                    />
                    <FieldError id="confirm-password-error" errors={[errors.confirmPassword]} />
                </FieldContent>
            </Field>

            <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full">
                {isPending ? (
                    <>
                        <Spinner aria-hidden="true" />
                        Menyimpan...
                    </>
                ) : (
                    "Simpan Password"
                )}
            </Button>
        </form>
    )
}
