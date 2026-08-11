import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/cookie-banner";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  alternates: {
    canonical: "/",
  },
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-center" />
            <CookieBanner />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
