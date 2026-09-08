import { Logo } from "~/components/logo"

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
                    <p className="text-sm font-semibold tracking-widest text-primary uppercase">JualAntar</p>
                    <h2 className="mt-3 text-3xl leading-tight font-semibold text-white">
                        Bersama Menggerakkan Kapuas Hulu
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-white/80">
                        Kelola operasional, pantau pertumbuhan, dan wujudkan layanan yang lebih baik untuk masyarakat
                        Kapuas Hulu.
                    </p>
                </div>
            </div>
        </div>
    )
}
