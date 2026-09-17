import type { CSSProperties, ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { TooltipProvider } from "~/components/ui/tooltip"
import { AppSidebar } from "./sidebar/sidebar"
import { Topbar } from "./topbar/topbar"

const SIDEBAR_WIDTH = "17rem"

export function Layout({ children }: { children: ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": SIDEBAR_WIDTH,
                    } as CSSProperties
                }
            >
                <AppSidebar />
                <SidebarInset>
                    <Topbar />
                    <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-clip px-4 py-6 md:gap-6 md:px-6 lg:px-8">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
