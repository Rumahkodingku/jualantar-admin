import { Link } from "react-router"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "cn"

import { Logo } from "~/components/logo"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    useSidebar,
} from "~/components/ui/sidebar"

import { sidebarGroups } from "./navigation-config"
import { SidebarNavItem } from "./sidebar-nav-item"

function AppSidebarHeader() {
    const { state, toggleSidebar } = useSidebar()
    const collapsed = state === "collapsed"

    return (
        <SidebarHeader className="border-b border-sidebar-border/70 p-2">
            {collapsed ? (
                <div className="flex flex-col items-center gap-2.5 pt-2">
                    <Link
                        to="/dashboard"
                        aria-label="JualAntar — Dashboard"
                        className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                    >
                        <Logo size={24} className="text-primary" />
                    </Link>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        aria-label="Perluas sidebar"
                        className="hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
                    >
                        <PanelLeftOpen aria-hidden="true" />
                    </Button>
                </div>
            ) : (
                <div className="flex h-12 items-center justify-between gap-2 pr-1 pl-2">
                    <Link
                        to="/dashboard"
                        aria-label="JualAntar — Dashboard"
                        className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                    >
                        <Logo size={30} className="shrink-0 text-primary" />
                        <span className="min-w-0 leading-none">
                            <span className="block truncate font-heading text-[0.95rem] font-bold tracking-tight text-sidebar-foreground">
                                JualAntar
                            </span>
                            <span className="mt-1 block truncate text-[0.65rem] font-semibold tracking-[0.16em] text-sidebar-foreground/45 uppercase">
                                Admin
                            </span>
                        </span>
                    </Link>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        aria-label="Ciutkan sidebar"
                        className="hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
                    >
                        <PanelLeftClose aria-hidden="true" />
                    </Button>
                </div>
            )}
        </SidebarHeader>
    )
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <AppSidebarHeader />
            <SidebarContent>
                <nav aria-label="Menu utama" className={cn("flex flex-col gap-3 px-1.5 py-3")}>
                    {sidebarGroups.map((group) => (
                        <SidebarGroup key={group.label} className="gap-0 p-0">
                            <SidebarGroupLabel className="px-3 pb-1 text-[0.68rem] font-semibold tracking-[0.12em] text-sidebar-foreground/45 uppercase">
                                {group.label}
                            </SidebarGroupLabel>
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
