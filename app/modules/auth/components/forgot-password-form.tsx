import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { Field, FieldContent, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { toast } from "~/components/ui/toast"

import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas/auth.schemas"
import { useForgotPasswordMutation } from "../services/auth.mutations"
import { authEvents } from "../services/auth.events"
import { AuthError } from "./auth-error"

const DEFAULT_FORGOT_ERROR = "Terjadi kesalahan. Silakan coba lagi."

export function ForgotPasswordForm() {
    const forgotPasswordMutation = useForgotPasswordMutation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    })

    function onSubmit(values: ForgotPasswordInput) {
        authEvents.forgotPasswordSubmitted()
        forgotPasswordMutation.mutate(values, {
            onSuccess: () => {
                authEvents.forgotPasswordSuccess()
                toast.add({
                    type: "success",
                    title: "Instruksi terkirim",
                    description: "Jika email tersebut terdaftar, instruksi reset password akan dikirimkan.",
                })
            },
        })
    }

    const isPending = forgotPasswordMutation.isPending

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            {forgotPasswordMutation.isError && (
                <AuthError message={forgotPasswordMutation.error?.message ?? DEFAULT_FORGOT_ERROR} />
            )}

            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@jualantar.id"
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email")}
                    />
                    <FieldError id="email-error" errors={[errors.email]} />
                </FieldContent>
            </Field>

            <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full">
                {isPending ? (
                    <>
                        <Spinner aria-hidden="true" />
                        Mengirim...
                    </>
                ) : (
                    "Kirim Instruksi"
                )}
            </Button>
        </form>
    )
}
