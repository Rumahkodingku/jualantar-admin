import { z } from "zod"

import { REVIEW_COMPONENTS } from "../types/merchant-approval.types"

export const reviewSchema = z.object({
    component: z.enum(REVIEW_COMPONENTS),
    subject_type: z.string().min(1),
    subject_id: z.string().min(1),
    status: z.enum(["verified", "rejected"]),
    note: z.string().max(2000).optional(),
})

export const reviewNoteSchema = z.object({
    note: z.string().max(2000).optional(),
})

export const revisionItemSchema = z.object({
    component: z.enum(REVIEW_COMPONENTS),
    subject_type: z.string().min(1),
    subject_id: z.string().min(1),
    reason: z.string().min(1, "Alasan revisi wajib diisi.").max(2000),
})

export const revisionSchema = z.object({
    note: z.string().max(2000).optional(),
    items: z.array(revisionItemSchema).min(1, "Pilih minimal satu komponen untuk direvisi."),
})

export const rejectionSchema = z.object({
    reason: z.string().min(1, "Alasan penolakan wajib diisi.").max(2000),
})

export type ReviewInput = z.infer<typeof reviewSchema>
export type ReviewNoteInput = z.infer<typeof reviewNoteSchema>
export type RevisionInput = z.infer<typeof revisionSchema>
export type RevisionItemInput = z.infer<typeof revisionItemSchema>
export type RejectionInput = z.infer<typeof rejectionSchema>
