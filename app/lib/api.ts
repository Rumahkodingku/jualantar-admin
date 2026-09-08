import axios, { type AxiosInstance } from "axios"

import { API_BASE_URL } from "./config"

export class ApiError extends Error {
    readonly status?: number
    readonly details?: unknown

    constructor(message: string, status?: number, details?: unknown) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.details = details
    }
}

export function normalizeApiError(error: unknown): ApiError {
    if (error instanceof ApiError) return error

    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data
        const message =
            data && typeof data === "object" && "message" in data
                ? String((data as { message: unknown }).message)
                : error.message
        return new ApiError(message, status, data)
    }

    if (error instanceof Error) return new ApiError(error.message)

    return new ApiError("Unknown error")
}

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
})

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeApiError(error))
)
