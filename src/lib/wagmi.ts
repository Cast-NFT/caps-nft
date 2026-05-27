import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "EchoCapsul",
  projectId: "echocapsul-mint",
  chains: [base],
  ssr: true,
});
