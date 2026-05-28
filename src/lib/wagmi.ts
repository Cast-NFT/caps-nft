import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "EchoCapsul",
  projectId: "echocapsul-mint",
  chains: [base],
  ssr: true,
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});
