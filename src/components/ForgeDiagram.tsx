import Image from "next/image";

const tierVisuals = {
  common: { label: "Common", image: "/capsules/capsule_common.gif", glow: "from-slate-300/16 via-slate-400/8 to-transparent" },
  rare: { label: "Rare", image: "/capsules/capsule_rare.gif", glow: "from-sky-400/18 via-cyan-400/10 to-transparent" },
  epic: { label: "Epic", image: "/capsules/capsule_epic.gif", glow: "from-violet-400/18 via-fuchsia-400/10 to-transparent" },
  legendary: { label: "Legendary", image: "/capsules/capsule_legendary.gif", glow: "from-amber-300/22 via-yellow-300/12 to-transparent" },
  mythic: { label: "Mythic", image: "/capsules/capsule_mythic.gif", glow: "from-fuchsia-400/24 via-pink-400/12 to-transparent" },
} as const;

const forgeRoutes = [
  { input: "3× Common", output: "Rare", from: tierVisuals.common, to: tierVisuals.rare, type: "step path" },
  { input: "2× Rare", output: "Epic", from: tierVisuals.rare, to: tierVisuals.epic, type: "step path" },
  { input: "7× Common", output: "Epic", from: tierVisuals.common, to: tierVisuals.epic, type: "skip path" },
  { input: "2× Epic", output: "Legendary", from: tierVisuals.epic, to: tierVisuals.legendary, type: "step path" },
  { input: "15× Common", output: "Legendary", from: tierVisuals.common, to: tierVisuals.legendary, type: "skip path" },
  { input: "2× Legendary", output: "Mythic", from: tierVisuals.legendary, to: tierVisuals.mythic, type: "step path" },
  { input: "1× C + 1× R + 1× E + 1× L", output: "Mythic", from: tierVisuals.epic, to: tierVisuals.mythic, type: "rainbow path" },
] as const;

export function ForgeDiagram() {
  return (
    <div className="space-y-4">
      {forgeRoutes.map((route) => (
        <div
          key={`${route.input}-${route.output}`}
          className="forge-path rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ForgeNode title={route.input} visual={route.from} align="left" />

              <div className="flex items-center justify-center">
                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft">
                  forge
                </div>
                <div className="mx-3 text-lg text-echo">→</div>
              </div>

              <ForgeNode title={route.output} visual={route.to} align="right" />
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                {route.type}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-soft">
                Echo Inheritance
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ForgeNode({
  title,
  visual,
  align,
}: {
  title: string;
  visual: { label: string; image: string; glow: string };
  align: "left" | "right";
}) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "sm:flex-row-reverse" : ""}`}>
      <div className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/5 to-transparent p-2 ${align === "right" ? "order-2 sm:order-none" : ""}`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${visual.glow}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,108,255,0.14),transparent_56%)]" />
        <div className="relative flex h-20 w-20 items-center justify-center">
          <Image
            src={visual.image}
            alt={visual.label}
            width={72}
            height={72}
            className="h-16 w-16 object-contain"
            unoptimized
            loading="lazy"
          />
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-dim">
          {visual.label}
        </div>
        <div className="mt-1 text-sm font-semibold text-white sm:text-base">{title}</div>
      </div>
    </div>
  );
}
