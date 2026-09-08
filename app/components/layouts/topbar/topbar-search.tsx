import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Kbd } from "~/components/ui/kbd"

const SEARCH_INPUT_ID = "global-search"

export function TopbarSearch() {
    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault()
                document.getElementById(SEARCH_INPUT_ID)?.focus()
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    return (
        <div className="relative hidden w-full max-w-sm md:block lg:max-w-md">
            <Search
                aria-hidden="true"
                className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
                id={SEARCH_INPUT_ID}
                type="search"
                role="searchbox"
                autoComplete="off"
                placeholder="Cari pesanan, kurir, merchant, atau menu..."
                className="rounded-xl py-5.5 ps-9 pe-16"
                aria-label="Cari pesanan, kurir, merchant, atau menu"
            />
            <span className="pointer-events-none absolute inset-e-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                <Kbd className="h-5 min-w-5 rounded-[0.3rem] px-1.5 text-[0.65rem]">Ctrl K</Kbd>
            </span>
        </div>
    )
}
