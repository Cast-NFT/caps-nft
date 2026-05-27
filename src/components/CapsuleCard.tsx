import Image from "next/image";
import type { Capsule } from "@/lib/capsules";

const glowMap: Record<Capsule["id"], string> = {
  pre: "from-white/10 via-white/5 to-transparent",
  common: "from-slate-300/16 via-slate-400/8 to-transparent",
  rare: "from-sky-400/18 via-cyan-400/10 to-transparent",
  epic: "from-violet-400/18 via-fuchsia-400/10 to-transparent",
  legendary: "from-amber-300/22 via-yellow-300/12 to-transparent",
  mythic: "from-fuchsia-400/24 via-pink-400/12 to-transparent",
};

export function CapsuleCard({ capsule }: { capsule: Capsule }) {
  return (
    <article className="glass-panel reveal-card rounded-[26px] p-4 motion-rise">
      <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-gradient-to-b from-white/5 to-transparent p-4">
        <div className={`absolute inset-0 bg-gradient-to-b ${glowMap[capsule.id]}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,108,255,0.14),transparent_56%)]" />
        <div className="relative flex min-h-[240px] items-center justify-center sm:min-h-[270px]">
          <Image
            src={capsule.image}
            alt={capsule.name}
            width={280}
            height={280}
            className="h-auto max-h-[220px] w-full max-w-[220px] object-contain sm:max-h-[260px] sm:max-w-[260px]"
            unoptimized
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">
            {capsule.name}
          </h3>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
            {capsule.tier}
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-soft">
          view
        </div>
      </div>

      <p className="mt-3 text-sm leading-7 text-text-soft">{capsule.description}</p>
    </article>
  );
}
