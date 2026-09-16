import axios, { type AxiosInstance } from "axios"

import { clearAuthToken, getAuthToken } from "./auth"
import { API_BASE_URL } from "./config"

export interface ProblemDetails {
    type?: string
    title?: string
    status?: number
    detail?: string
    instance?: string
    code?: string
    errors?: Record<string, string[]>
}

export class ApiError extends Error {
    readonly status?: number
    readonly code?: string
    readonly errors?: Record<string, string[]>
    readonly details?: unknown

    constructor(message: string, status?: number, details?: unknown) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.details = details

        if (details && typeof details === "object") {
            const problem = details as { code?: unknown; errors?: unknown }
            if (typeof problem.code === "string") {
                this.code = problem.code
            }
            if (isFieldErrors(problem.errors)) {
                this.errors = problem.errors
            }
        }
    }
}

function isFieldErrors(value: unknown): value is Record<string, string[]> {
    if (!value || typeof value !== "object") return false
    return Object.values(value).every((entry) => Array.isArray(entry))
}

function isProblemDetails(value: unknown): value is ProblemDetails {
    if (!value || typeof value !== "object") return false
    return "detail" in value || "title" in value || "code" in value
}

export function normalizeApiError(error: unknown): ApiError {
    if (error instanceof ApiError) return error

    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data

        if (isProblemDetails(data)) {
            const message = data.detail ?? data.title ?? error.message
            return new ApiError(message, status, data)
        }

        const message =
            data && typeof data === "object" && "message" in data
                ? String((data as { message: unknown }).message)
                : error.message
        return new ApiError(message, status, data)
    }

    if (error instanceof Error) return new ApiError(error.message)

    return new ApiError("Unknown error")
}

function isLoginRequest(error: unknown): boolean {
    if (!axios.isAxiosError(error)) return false
    return error.config?.url?.includes("/auth/login") ?? false
}

function handleUnauthenticated(): void {
    clearAuthToken()

    if (typeof window === "undefined") return
    if (window.location.pathname === "/login") return

    window.location.assign("/login")
}

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
})

api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const normalized = normalizeApiError(error)

        if (normalized.status === 401 && !isLoginRequest(error)) {
            handleUnauthenticated()
        }

        return Promise.reject(normalized)
    }
)
