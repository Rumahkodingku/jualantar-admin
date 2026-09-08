import { useLocation } from "react-router"
import { useSidebar } from "~/components/ui/sidebar"
import { Text } from "~/components/ui/text"
import { isNavItemActive, type NavItem } from "../navigation-config"
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar"
import { Link } from "react-router"

export function SidebarNavItem({ item }: { item: NavItem }) {
    const { pathname } = useLocation()
    const { isMobile, setOpenMobile } = useSidebar()
    const active = isNavItemActive(pathname, item.href)
    const Icon = item.icon

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                render={<Link to={item.href} aria-current={active ? "page" : undefined} />}
                isActive={active}
                tooltip={item.title}
                onClick={() => {
                    if (isMobile) setOpenMobile(false)
                }}
                className="rounded-lg p-4.5 text-[0.92rem] md:text-sm"
            >
                <Icon aria-hidden="true" />
                <Text variant="xs" className="truncate" weight="medium">
                    {item.title}
                </Text>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
