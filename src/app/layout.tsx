import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Literata } from "next/font/google";
import { AvisoCookies } from "@/components/AvisoCookies";
import { CapturaOrigem } from "@/components/CapturaOrigem";
import { Footer } from "@/components/Footer";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/rastreamento/GoogleTagManager";
import { evento } from "@/config/evento";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const descricao = `Aula gratuita e ao vivo com o ${evento.responsavelTecnico.nome}: entenda os 3 passos para trocar a dentadura por dentes fixos. Terça, 24/11, às 19h30.`;

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: { default: evento.nome, template: `%s | ${evento.nomeCurto}` },
  description: descricao,
  openGraph: {
    title: evento.aula.titulo,
    description: descricao,
    siteName: evento.nomeCurto,
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#23413a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${literata.variable} ${atkinson.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <GoogleTagManagerNoscript />
        <main className="flex-1">{children}</main>
        <Footer />
        <CapturaOrigem />
        <GoogleTagManager />
        <AvisoCookies />
      </body>
    </html>
  );
}
