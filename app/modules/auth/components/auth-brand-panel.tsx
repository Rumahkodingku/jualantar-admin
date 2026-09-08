import { Logo } from "~/components/logo"
import { Text } from "~/components/ui/text"

export function AuthBrandPanel() {
    return (
        <div className="relative hidden min-h-svh overflow-hidden lg:block">
            <img
                src="/images/jualantar-landscape.jpg"
                alt="Lanskap hijau Kalimantan Barat"
                width={1600}
                height={1067}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5" />
            <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-primary/40 blur-3xl" />

            <div className="relative flex h-full min-h-svh flex-col justify-between p-10">
                <Logo size={44} className="text-primary" />
                <div className="max-w-md">
                    <Text variant="sm" transform="uppercase" className="font-semibold tracking-widest text-primary">
                        JualAntar
                    </Text>
                    <Text as="h2" variant="3xl" className="mt-3 leading-tight font-semibold text-white">
                        Bersama Menggerakkan Kapuas Hulu
                    </Text>
                    <Text variant="sm" className="mt-4 leading-relaxed text-white/80">
                        Kelola operasional, pantau pertumbuhan, dan wujudkan layanan yang lebih baik untuk masyarakat
                        Kapuas Hulu.
                    </Text>
                </div>
            </div>
        </div>
    )
}
