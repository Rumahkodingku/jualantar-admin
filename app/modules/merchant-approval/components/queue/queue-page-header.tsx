import { CheckCircle2, ClipboardList, Store } from "lucide-react"
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

interface QueuePageHeaderProps {
    title: string
    description: string
}

export function QueuePageHeader({ title, description }: QueuePageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link to="/dashboard" />}>
                                <Text variant="xs" weight="medium">
                                    Home
                                </Text>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link to="/merchant-approvals" />}>
                                <Text variant="xs" weight="medium">
                                    Merchant Approvals
                                </Text>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <Text variant="xs" weight="medium">
                                    Approval
                                </Text>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Text as="h1" variant="2xl" weight="bold" className="tracking-tight text-foreground">
                    {title}
                </Text>
                <Text variant="sm" className="mt-1.5 text-muted-foreground">
                    {description}
                </Text>
            </div>
        </div>
    )
}
