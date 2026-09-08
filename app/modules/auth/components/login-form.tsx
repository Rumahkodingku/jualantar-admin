import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Field, FieldContent, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { loginSchema, type LoginInput } from "../schemas/auth.schemas"
import { useLoginMutation } from "../services/auth.mutations"
import { authEvents } from "../services/auth.events"
import { PasswordInput } from "./password-input"
import { ArrowRight, Mail } from "lucide-react"
import { toast } from "~/components/ui/toast"

const DEFAULT_LOGIN_ERROR = "Email atau password yang Anda masukkan salah."

export function LoginForm() {
    const navigate = useNavigate()
    const loginMutation = useLoginMutation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    const onSubmit = (values: LoginInput) => {
        authEvents.loginSubmitted()
        loginMutation.mutate(values, {
            onSuccess: () => {
                authEvents.loginSuccess()
                toast.add({
                    title: "Berhasil masuk",
                    description: "Selamat datang kembali!",
                    type: "success",
                })
                navigate("/dashboard")
            },
            onError: () => {
                authEvents.loginFailed()
                toast.add({
                    title: "Gagal masuk",
                    description: DEFAULT_LOGIN_ERROR,
                    type: "error",
                })
            },
        })
    }

    const isPending = loginMutation.isPending

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                    <div className="relative">
                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="admin@jualantar.id"
                            aria-invalid={errors.email ? true : undefined}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            className="pl-10"
                            {...register("email")}
                        />
                    </div>
                    <FieldError id="email-error" errors={[errors.email]} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        placeholder="Masukkan password"
                        aria-invalid={errors.password ? true : undefined}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        {...register("password")}
                    />
                    <FieldError id="password-error" errors={[errors.password]} />
                </FieldContent>
            </Field>

            <div className="flex items-center justify-between gap-4">
                <label
                    htmlFor="remember-me"
                    className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                >
                    <input
                        id="remember-me"
                        type="checkbox"
                        className="size-4 rounded-lg border border-input accent-primary"
                        {...register("rememberMe")}
                    />
                    Ingat saya pada perangkat ini
                </label>
                <Link
                    to="/forgot-password"
                    onClick={() => authEvents.forgotPasswordClicked()}
                    className="text-xs font-semibold text-primary hover:underline"
                >
                    Lupa password?
                </Link>
            </div>

            <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full">
                {isPending ? (
                    <>
                        <Spinner aria-hidden="true" />
                        Memproses...
                    </>
                ) : (
                    <>
                        Masuk <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                )}
            </Button>
        </form>
    )
}
