import type { ReactNode } from "react"

import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { Spinner } from "~/components/ui/spinner"

interface ApprovalConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    confirmLabel: string
    variant?: "default" | "destructive"
    isSubmitting: boolean
    onConfirm: () => void
    children?: ReactNode
}

export function ApprovalConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    variant = "default",
    isSubmitting,
    onConfirm,
    children,
}: ApprovalConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                {children}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="button" variant={variant} onClick={onConfirm} disabled={isSubmitting}>
                        {isSubmitting ? <Spinner aria-hidden="true" /> : null}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
