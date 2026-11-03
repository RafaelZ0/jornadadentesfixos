"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { evento } from "@/config/evento";
import { useAceitouCookies } from "@/lib/consentimento";
import { enviarEvento, rastreamentoLiberado } from "@/lib/rastreamento";
import { useLiberarScript } from "./useLiberarScript";

const { id } = evento.googleTagManager;

// Mesmo código-base do Google: a fila dataLayer e o evento gtm.js, que dispara as tags de "Todas as páginas".
const CODIGO_BASE = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`;

export function GoogleTagManager() {
  const rota = usePathname();
  const aceitou = useAceitouCookies();
  const liberado = Boolean(id) && rastreamentoLiberado(aceitou);
  const carregar = useLiberarScript(liberado);
  const ultimaRota = useRef("");

  // A primeira página conta pelo gtm.js. As trocas sem recarregar (como a ida para /obrigado) contam por aqui.
  useEffect(() => {
    if (!liberado || ultimaRota.current === rota) return;
    if (ultimaRota.current) enviarEvento("page_view_spa", { page_path: rota });
    ultimaRota.current = rota;
  }, [liberado, rota]);

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

/** Para quem está com o JavaScript desligado. Com consentimento obrigatório, não entra: não há como aceitar. */
export function GoogleTagManagerNoscript() {
  if (!id || evento.meta.exigeConsentimento) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
