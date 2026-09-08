import { cn } from "cn"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "~/components/ui/sidebar"
import { sidebarGroups } from "../navigation-config"
import { SidebarNavItem } from "./sidebar-nav-item"
import { AppSidebarHeader } from "./sidebar-header"

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border bg-background">
            <AppSidebarHeader />
            <SidebarContent className="bg-background">
                <nav aria-label="Menu utama" className={cn("flex flex-col gap-3 px-1.5 py-3")}>
                    {sidebarGroups.map((group) => (
                        <SidebarGroup key={group.label} className="gap-0 p-0">
                            {group.label && (
                                <SidebarGroupLabel className="px-3 text-[0.60rem] font-semibold tracking-[0.16em] text-sidebar-foreground/50 uppercase">
                                    {group.label}
                                </SidebarGroupLabel>
                            )}
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {group.items.map((item) => (
                                        <SidebarNavItem key={item.href} item={item} />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </nav>
            </SidebarContent>
        </Sidebar>
    )
}
