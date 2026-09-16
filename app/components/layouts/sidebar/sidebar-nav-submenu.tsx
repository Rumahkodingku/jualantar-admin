import { Link, useLocation } from "react-router"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "~/components/ui/sidebar"
import { Text } from "~/components/ui/text"
import { isNavChildItemActive, type NavItem } from "../navigation-config"

export function SidebarNavSubmenu({ item }: { item: NavItem }) {
    const { pathname } = useLocation()
    const { isMobile, setOpenMobile } = useSidebar()
    const children = item.children ?? []
    const hasActiveChild = isNavChildItemActive(pathname, item)
    const Icon = item.icon

    const closeMobile = () => {
        if (isMobile) setOpenMobile(false)
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={hasActiveChild} className="group/collapsible">
                <CollapsibleTrigger
                    render={
                        <SidebarMenuButton
                            tooltip={item.title}
                            isActive={hasActiveChild}
                            className="rounded-lg p-4.5 text-[0.92rem] md:text-sm"
                        />
                    }
                >
                    <Icon aria-hidden="true" />
                    <Text variant="xs" className="truncate" weight="medium">
                        {item.title}
                    </Text>
                    <ChevronRight
                        aria-hidden="true"
                        className="ml-auto transition-transform group-data-open/collapsible:rotate-90"
                    />
                </CollapsibleTrigger>
                <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSub>
                        {children.map((child) => {
                            const childActive = pathname === child.href

                            return (
                                <SidebarMenuSubItem key={child.href}>
                                    <SidebarMenuSubButton
                                        render={
                                            <Link to={child.href} aria-current={childActive ? "page" : undefined} />
                                        }
                                        isActive={childActive}
                                        onClick={closeMobile}
                                    >
                                        <Text variant="xs" className="truncate" weight="medium">
                                            {child.title}
                                        </Text>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}
