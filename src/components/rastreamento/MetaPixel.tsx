"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useAceitouCookies } from "@/lib/consentimento";
import { pixelLiberado, rastrear, URL_SCRIPT_PIXEL } from "@/lib/pixel";

const ESPERA_MS = 3000;
const INTERACOES = ["pointerdown", "scroll", "keydown"];
// Páginas de conversão: o script carrega na hora para não perder o evento.
const SEM_ESPERA = ["/obrigado", "/vaga"];

export function MetaPixel() {
  const rota = usePathname();
  const liberado = pixelLiberado(useAceitouCookies());
  const ultimaRota = useRef("");
  const [espera, setEspera] = useState(true);

  useEffect(() => {
    if (!liberado || ultimaRota.current === rota) return;
    ultimaRota.current = rota;
    rastrear("track", "PageView");
  }, [liberado, rota]);

  // Os eventos ficam na fila enquanto o script do Meta espera, sem pesar no carregamento.
  useEffect(() => {
    if (!liberado || !espera) return;

    const encerrar = () => setEspera(false);
    const relogio = setTimeout(encerrar, ESPERA_MS);
    INTERACOES.forEach((nome) =>
      window.addEventListener(nome, encerrar, { once: true, passive: true }),
    );

    return () => {
      clearTimeout(relogio);
      INTERACOES.forEach((nome) => window.removeEventListener(nome, encerrar));
    };
  }, [liberado, espera]);

  if (!liberado || (espera && !SEM_ESPERA.includes(rota))) return null;

  return <Script src={URL_SCRIPT_PIXEL} strategy="afterInteractive" />;
}
