export const capsules = [
  {
    id: "pre",
    name: "Mystery Box",
    tier: "SEALED",
    image: "/capsules/capsule_prereveal_22f0c7c5.gif",
    description:
      "Every holder starts from the same sealed object. Tier, shell, traits, and forge value remain hidden.",
    accent: "from-white/10 to-white/0",
  },
  {
    id: "common",
    name: "Common Capsule",
    tier: "COMMON",
    image: "/capsules/capsule_common.gif",
    description:
      "The base supply. Liquid, actively traded, and essential as primary fuel for The Furnace.",
    accent: "from-slate-300/10 to-transparent",
  },
  {
    id: "rare",
    name: "Rare Capsule",
    tier: "RARE",
    image: "/capsules/capsule_rare.gif",
    description:
      "A mid-tier target for collectors and traders, separating itself from the main floor.",
    accent: "from-sky-400/15 to-transparent",
  },
  {
    id: "epic",
    name: "Epic Capsule",
    tier: "EPIC",
    image: "/capsules/capsule_epic.gif",
    description:
      "Tighter supply, stronger collector pull, and a more premium presence once reveal begins.",
    accent: "from-violet-400/15 to-transparent",
  },
  {
    id: "legendary",
    name: "Legendary Capsule",
    tier: "LEGENDARY",
    image: "/capsules/capsule_legendary.gif",
    description:
      "The premium natural tier. Scarce by default and valuable even before forge history is considered.",
    accent: "from-amber-300/20 to-transparent",
  },
  {
    id: "mythic",
    name: "Mythic Capsule",
    tier: "MYTHIC",
    image: "/capsules/capsule_mythic.gif",
    description:
      "The rarest tier in the system, expected to appear mostly through forging rather than standard distribution.",
    accent: "from-fuchsia-400/20 to-transparent",
  },
] as const;

export type Capsule = (typeof capsules)[number];

export const forgePaths = [
  "3 Common → 1 Rare",
  "2 Rare → 1 Epic",
  "7 Common → 1 Epic",
  "2 Epic → 1 Legendary",
  "15 Common → 1 Legendary",
  "2 Legendary → 1 Mythic",
  "1 Common + 1 Rare + 1 Epic + 1 Legendary → 1 Mythic",
] as const;

export const roadmap = [
  {
    title: "Chapter I — Sealed Mint",
    status: "ACTIVE",
    desc: "Mint the Mystery Box. Every object remains fully sealed.",
  },
  {
    title: "Chapter II — Capsule Reveal",
    status: "LOCKED",
    desc: "Visual shell, rarity, traits, and forge potential become visible.",
  },
  {
    title: "Chapter III — Open Market",
    status: "LOCKED",
    desc: "Trading, sweeping, set building, and floor discovery begin to take shape.",
  },
  {
    title: "Chapter IV — The Furnace",
    status: "LOCKED",
    desc: "Burn-combine becomes active, and Echo Inheritance starts defining collector value.",
  },
  {
    title: "Chapter V — The Inner Archive",
    status: "SEALED",
    desc: "The personal message layer remains closed until its proper opening point.",
  },
] as const;
