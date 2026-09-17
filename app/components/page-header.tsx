import { Fragment, type ReactNode } from "react"
import { Link } from "react-router"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Text } from "~/components/ui/text"
import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

export interface PageHeaderBreadcrumbItem {
    label: string
    to?: string
}

export interface PageHeaderProps {
    isBack?: boolean
    title: string
    description?: string
    breadcrumbs?: PageHeaderBreadcrumbItem[]
    actions?: ReactNode
    className?: string
}

export function PageHeader({
    isBack = false,
    title,
    description,
    breadcrumbs = [],
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div className="min-w-0">
                {isBack ? (
                    <Button
                        variant="secondary"
                        size="lg"
                        className="mb-6 w-fit"
                        nativeButton={false}
                        render={<Link to="/merchant-approvals/queue" />}
                    >
                        <ArrowLeft aria-hidden="true" />
                        <Text variant="xs" weight="semibold">
                            Kembali ke halaman sebelumnya
                        </Text>
                    </Button>
                ) : null}

                {breadcrumbs.length > 0 && (
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            {breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1
                                const isCurrent = !item.to || isLast

                                return (
                                    <Fragment key={`${item.label}-${index}`}>
                                        {index > 0 && <BreadcrumbSeparator />}
                                        <BreadcrumbItem>
                                            {isCurrent ? (
                                                <BreadcrumbPage>
                                                    <Text variant="xs" weight="medium">
                                                        {item.label}
                                                    </Text>
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink render={<Link to={item.to as string} />}>
                                                    <Text variant="xs" weight="medium">
                                                        {item.label}
                                                    </Text>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </Fragment>
                                )
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                )}

                <Text as="h1" variant="2xl" weight="bold" className="tracking-tight text-foreground">
                    {title}
                </Text>
                {description && (
                    <Text variant="sm" className="mt-1.5 text-muted-foreground">
                        {description}
                    </Text>
                )}
            </div>

            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    )
}
