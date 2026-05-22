import type { Metadata } from "next";
import { DM_Mono, Playfair_Display } from "next/font/google";
import { BetaBanner } from "./components/beta-banner";
import { SiteChrome } from "./components/site-chrome";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GramWise — Pastry costing calculator",
  description:
    "Spread monthly overhead, cost your recipes, and price with margin on selling price.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable}`}>
      <body>
        <BetaBanner />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
