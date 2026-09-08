import { ArrowUpRight } from "lucide-react"

import { Text } from "~/components/ui/text"

export function LocalImpactCard() {
    return (
        <section
            aria-label="Kapuas Hulu, Kalimantan Barat"
            className="relative min-w-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/10"
        >
            <img
                src="/images/jualantar-landscape.jpg"
                alt="Pemandangan lanskap hijau Kapuas Hulu, Kalimantan Barat"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />

            <button
                type="button"
                aria-label="Lihat informasi program Kapuas Hulu"
                className="absolute top-3.5 right-3.5 flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70"
            >
                <ArrowUpRight aria-hidden="true" className="size-4" />
            </button>

            <div className="relative flex min-h-[220px] flex-col justify-end p-4">
                <Text as="h3" variant="lg" className="leading-snug font-semibold text-white">
                    Kapuas Hulu, Kalimantan Barat
                </Text>
                <Text variant="sm" className="mt-1.5 leading-relaxed text-white/85">
                    Layanan yang lebih baik untuk masyarakat Kapuas Hulu.
                </Text>
                <Text variant="xs" className="mt-1 leading-relaxed text-white/65">
                    Terus bergerak, menghadirkan kemudahan di setiap perjalanan.
                </Text>
            </div>
        </section>
    )
}
