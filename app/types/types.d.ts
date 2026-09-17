export interface DataEnvelope<T> {
    data: T
}

export interface PaginatedEnvelope<T> {
    data: T[]
    meta: {
        current_page: number
        per_page: number
        total: number
        last_page: number
    }
}
