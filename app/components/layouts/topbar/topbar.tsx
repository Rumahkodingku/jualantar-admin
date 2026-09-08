import { Link } from "react-router"
import { Menu } from "lucide-react"
import { Logo } from "~/components/logo"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { useSidebar } from "~/components/ui/sidebar"
import { TopbarNotifications } from "./topbar-notifications"
import { TopbarProfile } from "./topbar-profile"
import { TopbarSearch } from "./topbar-search"

export function Topbar() {
    const { setOpenMobile } = useSidebar()

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/75 md:px-6">
            <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label="Buka menu navigasi"
                onClick={() => setOpenMobile(true)}
                className="-ms-2 rounded-xl text-foreground hover:bg-muted md:hidden"
            >
                <Menu aria-hidden="true" />
            </Button>

            <Link
                to="/dashboard"
                aria-label="JualAntar — Dashboard"
                className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:hidden"
            >
                <Logo size={26} className="text-primary" />
            </Link>

            <div className="flex min-w-0 flex-1 items-center md:ms-1">
                <TopbarSearch />
            </div>

            <div className="ms-auto flex shrink-0 items-center gap-1 md:ms-0">
                <TopbarNotifications />
                <Separator orientation="vertical" className="mx-1.5 hidden h-10 sm:block" />
                <TopbarProfile />
            </div>
        </header>
    )
}
