"use client";

import Script from "next/script";
import { evento } from "@/config/evento";
import { useAceitouCookies } from "@/lib/consentimento";
import { useLiberarScript } from "./useLiberarScript";

const { id } = evento.googleTagManager;

// Mesmo código-base do Google: a fila dataLayer e o evento gtm.js, que dispara as tags de "Todas as páginas".
const CODIGO_BASE = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`;

export function GoogleTagManager() {
  const aceitou = useAceitouCookies();
  // Segue a mesma regra de consentimento do Pixel.
  const carregar = useLiberarScript(
    Boolean(id) && (!evento.meta.exigeConsentimento || aceitou),
  );

  if (!carregar) return null;

  return (
    <>
      <Script id="gtm-base" strategy="afterInteractive">
        {CODIGO_BASE}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
