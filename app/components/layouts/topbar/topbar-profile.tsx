import { Link } from "react-router"
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Text } from "~/components/ui/text"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

const ADMIN_NAME = "Super Admin"
const ADMIN_ROLE = "Administrator"
const ADMIN_EMAIL = "superadmin@jualantar.id"

export function TopbarProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button
                        type="button"
                        aria-label={`Akun ${ADMIN_NAME}, ${ADMIN_ROLE}`}
                        className="flex items-center gap-2 rounded-xl py-1 ps-1 pe-1.5 text-start transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-muted lg:pe-2.5"
                    >
                        <Avatar size="default" className="size-8">
                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                                SA
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden min-w-0 leading-tight lg:block">
                            <Text variant="sm" className="block max-w-28 truncate font-medium text-foreground">
                                {ADMIN_NAME}
                            </Text>
                            <Text variant="xs" className="block max-w-28 truncate text-muted-foreground">
                                {ADMIN_ROLE}
                            </Text>
                        </span>
                        <ChevronDown aria-hidden="true" className="hidden size-3.5 text-muted-foreground lg:block" />
                    </button>
                }
            />
            <DropdownMenuContent align="end" sideOffset={10} className="w-60">
                <DropdownMenuLabel>
                    <Text variant="sm" className="block truncate font-medium text-foreground">
                        {ADMIN_NAME}
                    </Text>
                    <Text variant="xs" className="block truncate font-normal text-muted-foreground">
                        {ADMIN_EMAIL}
                    </Text>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link to="/settings" />}>
                        <UserRound aria-hidden="true" />
                        Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link to="/settings" />}>
                        <Settings aria-hidden="true" />
                        Pengaturan
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" render={<Link to="/login" />}>
                    <LogOut aria-hidden="true" />
                    Keluar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
