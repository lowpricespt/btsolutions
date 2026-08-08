import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

const descricao =
  "Eletricidade, telecomunicações, carpintaria e muito mais — serviços técnicos ao domicílio na Grande Área do Porto, Braga e Aveiro. Pede, acompanha e avalia tudo numa só plataforma."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BTS — Bizarro Total Solutions",
    template: "%s · BTS",
  },
  description: descricao,
  keywords: [
    "eletricista Porto",
    "serviços técnicos ao domicílio",
    "carpintaria Porto",
    "instalação CCTV Porto",
    "montagem de móveis",
    "BTS Bizarro Total Solutions",
  ],
  authors: [{ name: "BTS — Bizarro Total Solutions" }],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "BTS — Bizarro Total Solutions",
    title: "BTS — Bizarro Total Solutions",
    description: descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: "BTS — Bizarro Total Solutions",
    description: descricao,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-center" />
          <CookieBanner />
        </TooltipProvider>
      </body>
    </html>
  );
}
