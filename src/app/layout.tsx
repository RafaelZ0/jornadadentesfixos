import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Literata } from "next/font/google";
import { AvisoCookies } from "@/components/AvisoCookies";
import { CapturaOrigem } from "@/components/CapturaOrigem";
import { Footer } from "@/components/Footer";
import { MetaPixel } from "@/components/rastreamento/MetaPixel";
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

export const metadata: Metadata = {
  title: evento.nome,
  description: `Aula gratuita e ao vivo: ${evento.aula.titulo}. Com o ${evento.responsavelTecnico.nome}, em Cachoeiro de Itapemirim.`,
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
        <main className="flex-1">{children}</main>
        <Footer />
        <CapturaOrigem />
        <MetaPixel />
        <AvisoCookies />
      </body>
    </html>
  );
}
