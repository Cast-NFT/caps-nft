import Link from "next/link";
import { capsules } from "@/lib/capsules";
import { CapsuleCard } from "@/components/CapsuleCard";

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-text">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/8 bg-[#07060a]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
            <div>
              <div className="text-sm font-semibold tracking-[-0.02em] text-white">EchoCapsul Gallery</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
                visual archive // sealed to mythic
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/8">
                Back Home
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 pb-10 pt-12 lg:px-8 lg:pt-16">
          <div className="max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-dim">
              // Collection View
            </div>
            <h1 className="mt-3 text-5xl font-semibold leading-[1.03] tracking-[-0.06em] text-white sm:text-6xl">
              Every visual state, from sealed to mythic.
            </h1>
            <p className="mt-5 text-sm leading-7 text-text-soft sm:text-base">
              A single view for reviewing the full EchoCapsul range. Use it to compare mood,
              rarity feel, silhouette strength, and how each tier reads at a glance.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {capsules.map((capsule) => (
              <a
                key={capsule.id}
                href={`#${capsule.id}`}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-sm text-text-soft transition hover:bg-white/[0.06] hover:text-white"
              >
                {capsule.tier}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capsules.map((capsule) => (
              <div key={capsule.id} id={capsule.id} className="scroll-mt-24">
                <CapsuleCard capsule={capsule} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
