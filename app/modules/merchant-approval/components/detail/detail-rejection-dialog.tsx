import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { Field, FieldContent, FieldError, FieldLabel } from "~/components/ui/field"
import { Spinner } from "~/components/ui/spinner"
import { Textarea } from "~/components/ui/textarea"
import { rejectionSchema, type RejectionInput } from "../../schemas/merchant-approval.schemas"

interface DetailRejectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isSubmitting: boolean
    onConfirm: (input: RejectionInput) => void
}

export function DetailRejectionDialog({ open, onOpenChange, isSubmitting, onConfirm }: DetailRejectionDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RejectionInput>({
        resolver: zodResolver(rejectionSchema),
        defaultValues: { reason: "" },
    })

    useEffect(() => {
        if (!open) reset({ reason: "" })
    }, [open, reset])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tolak Pengajuan</DialogTitle>
                    <DialogDescription>
                        Pengajuan akan ditolak dan tidak dapat dibuka kembali. Merchant harus mengajukan aplikasi baru.
                        Berikan alasan yang jelas.
                    </DialogDescription>
                </DialogHeader>

                <form id="rejection-form" onSubmit={handleSubmit(onConfirm)} noValidate className="flex flex-col gap-4">
                    <Field data-invalid={errors.reason ? true : undefined}>
                        <FieldLabel htmlFor="rejection-reason">Alasan Penolakan</FieldLabel>
                        <FieldContent>
                            <Textarea
                                id="rejection-reason"
                                rows={4}
                                maxLength={2000}
                                placeholder="Jelaskan alasan penolakan..."
                                aria-invalid={errors.reason ? true : undefined}
                                aria-describedby={errors.reason ? "rejection-reason-error" : undefined}
                                {...register("reason")}
                            />
                            <FieldError id="rejection-reason-error" errors={[errors.reason]} />
                        </FieldContent>
                    </Field>
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" form="rejection-form" variant="destructive" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner aria-hidden="true" /> : null}
                        Tolak Pengajuan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
