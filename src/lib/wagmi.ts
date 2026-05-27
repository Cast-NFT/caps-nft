import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "EchoCapsules",
  projectId: "echocapsules-mint",
  chains: [base, baseSepolia],
  ssr: true,
});
