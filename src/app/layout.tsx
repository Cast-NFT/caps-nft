import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://caps-nft.vercel.app"),
  title: "EchoCapsul — Sealed Time Capsule NFT on Base",
  description:
    "Mint a sealed Mystery Box. Reveal a Capsule with rarity, traits, and forge potential. The Inner Archive remains sealed.",
  icons: {
    icon: [
      {
        url: "/echocapsul-logo.png",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "EchoCapsul — Sealed Time Capsule NFT on Base",
    description:
      "Seal the box. Let the capsule speak later.",
    url: "https://caps-nft.vercel.app",
    siteName: "EchoCapsul",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "EchoCapsul preview image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoCapsul — Sealed Time Capsule NFT on Base",
    description: "Seal the box. Let the capsule speak later.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
