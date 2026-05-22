import type { Metadata, Viewport } from "next";
import { DM_Mono, Playfair_Display } from "next/font/google";
import { BetaBanner } from "./components/beta-banner";
import { Providers } from "./components/providers";
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
  appleWebApp: {
    capable: true,
    title: "GramWise",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable}`}>
      <body>
        <Providers>
          <BetaBanner />
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
