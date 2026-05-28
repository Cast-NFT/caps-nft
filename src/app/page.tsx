"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { capsules, roadmap, type Capsule } from "@/lib/capsules";
import { CapsuleCard } from "@/components/CapsuleCard";
import { ForgeDiagram } from "@/components/ForgeDiagram";
import { ECHO_CAPSUL_ABI, ECHO_CAPSUL_CONTRACT_ADDRESS } from "@/lib/contract";

export default function Home() {
  const [mintCount, setMintCount] = useState(1);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule>(capsules[0]);

  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: hash, error: writeError, isPending: isMintSubmitting, writeContract } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: mintConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        address: ECHO_CAPSUL_CONTRACT_ADDRESS,
        abi: ECHO_CAPSUL_ABI,
        functionName: "totalSupply",
      },
      {
        address: ECHO_CAPSUL_CONTRACT_ADDRESS,
        abi: ECHO_CAPSUL_ABI,
        functionName: "MAX_SUPPLY",
      },
      {
        address: ECHO_CAPSUL_CONTRACT_ADDRESS,
        abi: ECHO_CAPSUL_ABI,
        functionName: "mintPrice",
      },
      {
        address: ECHO_CAPSUL_CONTRACT_ADDRESS,
        abi: ECHO_CAPSUL_ABI,
        functionName: "MAX_PER_TX",
      },
      {
        address: ECHO_CAPSUL_CONTRACT_ADDRESS,
        abi: ECHO_CAPSUL_ABI,
        functionName: "mintActive",
      },
    ],
  });

  const { data: mintedByWallet } = useReadContract({
    address: ECHO_CAPSUL_CONTRACT_ADDRESS,
    abi: ECHO_CAPSUL_ABI,
    functionName: "mintedPerWallet",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const minted = Number(contractData?.[0]?.result ?? BigInt(0));
  const maxSupply = Number(contractData?.[1]?.result ?? BigInt(10000));
  const mintPriceWei = (contractData?.[2]?.result as bigint | undefined) ?? parseEther("0");
  const maxPerTx = Number(contractData?.[3]?.result ?? BigInt(5));
  const mintActive = Boolean(contractData?.[4]?.result ?? false);
  const mintedWalletCount = Number(mintedByWallet ?? BigInt(0));

  const price = Number(formatEther(mintPriceWei));
  const totalPriceWei = mintPriceWei * BigInt(mintCount);
  const totalPrice = useMemo(() => formatEther(totalPriceWei), [totalPriceWei]);

  const wrongNetwork = chain?.id !== base.id;
  const canMint = isConnected && !wrongNetwork && mintActive;

  function handleMint() {
    if (!isConnected) return;
    if (wrongNetwork) {
      switchChain({ chainId: base.id });
      return;
    }

    writeContract({
      address: ECHO_CAPSUL_CONTRACT_ADDRESS,
      abi: ECHO_CAPSUL_ABI,
      functionName: "mint",
      args: [BigInt(mintCount)],
      value: totalPriceWei,
      chainId: base.id,
    });
  }

  const mintButtonLabel = !isConnected
    ? "CONNECT WALLET TO MINT"
    : wrongNetwork
      ? "SWITCH TO BASE"
      : !mintActive
        ? "MINT NOT LIVE YET"
        : isMintSubmitting
          ? "CHECK WALLET..."
          : isMintConfirming
            ? "CONFIRMING..."
            : "SEAL CAPSULE NOW";

  const mintButtonDisabled = (!isConnected ? false : wrongNetwork ? false : !mintActive || isMintSubmitting || isMintConfirming);

  return (
    <main className="relative min-h-screen overflow-hidden text-text">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07060a]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
            <div className="flex items-center gap-4 motion-rise">
              <Image src="/echocapsul-logo.png" alt="EchoCapsul logo" width={36} height={36} className="h-9 w-9 object-contain" priority />
              <div>
                <div className="pixel-title text-[10px] text-white">EchoCapsul</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">sealed archive on base</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-text-soft lg:flex motion-rise motion-delay-1">
              <a href="#mint" className="hover:text-white">Mint</a>
              <a href="#reveal" className="hover:text-white">Reveal</a>
              <a href="#furnace" className="hover:text-white">Furnace</a>
              <a href="#roadmap" className="hover:text-white">Roadmap</a>
              <Link href="/gallery" className="hover:text-white">Gallery</Link>
            </nav>

            <div className="hidden items-center gap-3 lg:flex motion-rise motion-delay-2">
              <span className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ${mintActive ? "border-terminal/25 bg-terminal/10 text-terminal" : "border-gold/25 bg-gold/10 text-gold"}`}>
                {mintActive ? "Mint Live" : "Mint Paused"}
              </span>
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
            </div>
          </div>

          <div className="border-t border-white/6 lg:hidden">
            <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-5 py-3 text-sm text-text-soft">
              <a href="#mint" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:text-white">Mint</a>
              <a href="#reveal" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:text-white">Reveal</a>
              <a href="#furnace" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:text-white">Furnace</a>
              <a href="#roadmap" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:text-white">Roadmap</a>
              <Link href="/gallery" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:text-white">Gallery</Link>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="flex flex-col justify-center motion-rise">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft">
              <span className="h-2 w-2 rounded-full bg-terminal" />
              Chapter I Active
            </div>

            <div className="hero-copy">
              <h1 className="pixel-title text-[19px] leading-[2.1] text-white sm:text-[23px] lg:text-[30px]">
                Seal the box.
                <br />
                Let the capsule speak later.
              </h1>
              <p className="mt-8 max-w-2xl text-[15px] leading-8 text-text-soft sm:text-[17px]">
                EchoCapsul is a time capsule NFT collection on Base. Every holder starts with a sealed Mystery Box. Once mint closes, each box opens into a Capsule with its own rarity, shell, traits, and forge potential — while the Inner Archive stays locked.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#mint" className="rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_18px_40px_rgba(255,255,255,0.08)] transition hover:opacity-92">Open Mint Panel</a>
              <a href="#reveal" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8">View Reveal Spectrum</a>
              <Link href="/gallery" className="rounded-xl border border-echo/20 bg-echo/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-echo/15">Open Gallery</Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <MetricCard label="Network" value="Base" note="low-fee minting" />
              <MetricCard label="Contract" value="Live" note="deployed on mainnet" />
            </div>
          </div>

          <div className="glass-panel rounded-[30px] p-4 sm:p-5 motion-rise motion-delay-1">
            <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <div className="text-sm font-medium text-white">Live capsule preview</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">selected visual state</div>
              </div>
              <div className="rounded-full border border-echo/20 bg-echo/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-echo">{selectedCapsule.tier}</div>
            </div>

            <div className={`relative overflow-hidden rounded-[26px] border border-white/8 bg-gradient-to-b ${selectedCapsule.accent} from-0% via-transparent to-transparent p-4 sm:p-6`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,108,255,0.10),transparent_48%)]" />
              <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[460px]">
                <Image src={selectedCapsule.image} alt={selectedCapsule.name} width={430} height={430} priority className="h-auto max-h-[300px] w-full max-w-[300px] object-contain sm:max-h-[430px] sm:max-w-[430px]" unoptimized />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {capsules.map((capsule) => (
                <button key={capsule.id} onClick={() => setSelectedCapsule(capsule)} className={`rounded-2xl border p-2 transition ${selectedCapsule.id === capsule.id ? "border-echo bg-echo/10" : "border-white/8 bg-white/4 hover:bg-white/7"}`}>
                  <Image src={capsule.image} alt={capsule.name} width={88} height={88} className="mx-auto h-14 w-14 object-contain sm:h-16 sm:w-16" unoptimized loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 lg:px-8" id="mint">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8 motion-rise">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.88fr_1.12fr]">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-dim">// Mint Flow</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">One clean path from sealed mint to live contract.</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-text-soft">The mint contract is now live on Base. Wallets can mint directly against the deployed NFT contract once public mint is switched on by the owner.</p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Stat label="Minted" value={`${minted}`} detail={`/ ${maxSupply}`} />
                  <Stat label="Price" value={price.toFixed(4)} detail="ETH" />
                  <Stat label="Phase" value={mintActive ? "LIVE" : "PAUSED"} detail="Sealed Mint" />
                </div>
              </div>

              <div>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                    <span className="h-2.5 w-2.5 rounded-full bg-terminal" />
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">mint.echocapsul</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ${mintActive ? "border-terminal/25 bg-terminal/10 text-terminal" : "border-gold/25 bg-gold/10 text-gold"}`}>{mintActive ? "Public Mint Live" : "Owner Activation Needed"}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft">Base Mainnet</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">current command</div>
                  <div className="mt-2 text-sm text-white">[ SEAL CAPSULE ] x {mintCount}</div>
                  {hash ? (
                    <div className="mt-3 flex flex-col gap-2 font-mono text-[11px] text-text-soft sm:flex-row sm:items-center sm:gap-3">
                      <span className="break-all">tx: {hash}</span>
                      <a
                        href={`https://basescan.org/tx/${hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-echo underline-offset-4 hover:underline"
                      >
                        View on BaseScan
                      </a>
                    </div>
                  ) : null}
                  {writeError ? <div className="mt-3 text-sm text-danger">{writeError.message}</div> : null}
                  {mintConfirmed ? <div className="mt-3 text-sm text-terminal">Mint confirmed on Base.</div> : null}
                </div>

                <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-text-soft">Mint quantity</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">up to {maxPerTx} per transaction</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setMintCount((prev) => Math.max(1, prev - 1))} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white hover:bg-white/10">−</button>
                    <div className="min-w-14 text-center text-2xl font-semibold tracking-[-0.04em] text-white">{mintCount}</div>
                    <button onClick={() => setMintCount((prev) => Math.min(maxPerTx, prev + 1))} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white hover:bg-white/10">+</button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4 sm:col-span-2">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">estimate cost</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{totalPrice} ETH</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">wallet minted</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{mintedWalletCount}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <button onClick={handleMint} disabled={mintButtonDisabled} className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold transition ${mintButtonDisabled ? "cursor-not-allowed border border-white/10 bg-white/10 text-white/55" : "border border-white/10 bg-white text-black hover:opacity-90"}`}>
                    {mintButtonLabel}
                  </button>
                  <div className="flex justify-start sm:justify-end">
                    <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
                  </div>
                </div>

                <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim sm:text-left">contract: {ECHO_CAPSUL_CONTRACT_ADDRESS}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8" id="reveal">
          <div className="mb-8 max-w-2xl motion-rise">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-dim">// Reveal Spectrum</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">The shell opens. The archive stays sealed.</h2>
            <p className="mt-4 text-sm leading-7 text-text-soft sm:text-base">Reveal is where the collection splits into real market identities. Tier, shell, traits, and forge potential become visible. The Inner Archive does not.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capsules.map((capsule) => <CapsuleCard key={capsule.id} capsule={capsule} />)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8" id="furnace">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.84fr_1.16fr]">
            <div className="glass-panel rounded-[30px] p-6 sm:p-8 motion-rise">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-dim">// The Furnace</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">Supply leaves. Story stays.</h2>
              <p className="mt-4 text-sm leading-7 text-text-soft sm:text-base">The Furnace turns lower tiers into higher forms while preserving origin history. That means Common remains useful, forged assets feel earned, and Mythic stays rare enough to matter.</p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoMini title="Echo Inheritance" desc="Forged Capsules carry visible traces of their parent path." />
                <InfoMini title="Deflationary" desc="Every forge removes more supply than it creates." />
                <InfoMini title="Mythic Hunt" desc="Mythic stays extremely limited and remains a true endgame tier." />
                <InfoMini title="Market Depth" desc="Tier plus sub-traits keeps the market richer than a simple rarity ladder." />
              </div>
            </div>
            <div className="glass-panel rounded-[30px] p-6 sm:p-8 motion-rise motion-delay-1">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">Forge Diagram</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">tier flow // burn // upgrade</div>
                </div>
                <div className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">active in phase II</div>
              </div>
              <ForgeDiagram />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8" id="roadmap">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10 motion-rise">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-dim">// Project Flow</div>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">A roadmap with structure, not empty promises.</h2>
              </div>
              <div className="max-w-md text-sm leading-7 text-text-soft">The focus stays on mint, reveal, market formation, and forge utility. The Inner Archive exists as a deeper layer, not as vague future utility.</div>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-5">
              {roadmap.map((item) => {
                const active = item.status === "ACTIVE";
                const sealed = item.status === "SEALED";
                return (
                  <div key={item.title} className={`rounded-[24px] p-5 soft-card ${active ? "roadmap-active" : sealed ? "roadmap-sealed" : "roadmap-locked"}`}>
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-soft">{active ? "● ACTIVE" : sealed ? "◌ SEALED" : "◦ LOCKED"}</div>
                    <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-text-soft">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/8 px-5 py-8 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto] md:items-start">
            <div>
              <div className="pixel-title text-[9px] text-white">EchoCapsul</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">base network // phase i build</div>
              <p className="mt-4 max-w-md text-sm leading-7 text-text-soft">A sealed time capsule NFT system built around reveal, market structure, forging, and a deeper archive layer that stays locked until it matters.</p>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">Navigation</div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-text-soft">
                <a href="#mint" className="hover:text-white">Mint</a>
                <a href="#reveal" className="hover:text-white">Reveal</a>
                <a href="#furnace" className="hover:text-white">Furnace</a>
                <a href="#roadmap" className="hover:text-white">Roadmap</a>
                <Link href="/gallery" className="hover:text-white">Gallery</Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">Collection</div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-text-soft">
                <span>Contract: {ECHO_CAPSUL_CONTRACT_ADDRESS}</span>
                <span>Mint: Free</span>
                <span>Network: Base</span>
                <span>© 2026 EchoCapsul</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="soft-card rounded-2xl p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>
      <div className="mt-1 text-sm text-text-soft">{note}</div>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">{label}</div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-[-0.04em] text-white">{value}</span>
        <span className="pb-1 text-sm text-text-soft">{detail}</span>
      </div>
    </div>
  );
}

function InfoMini({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="mt-2 text-sm leading-7 text-text-soft">{desc}</div>
    </div>
  );
}
