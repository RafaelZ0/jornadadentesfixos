"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useAceitouCookies } from "@/lib/consentimento";
import { pixelLiberado, rastrear, URL_SCRIPT_PIXEL } from "@/lib/pixel";
import { useLiberarScript } from "./useLiberarScript";

export function MetaPixel() {
  const rota = usePathname();
  const liberado = pixelLiberado(useAceitouCookies());
  const carregar = useLiberarScript(liberado);
  const ultimaRota = useRef("");

  // Os eventos ficam na fila enquanto o script do Meta espera.
  useEffect(() => {
    if (!liberado || ultimaRota.current === rota) return;
    ultimaRota.current = rota;
    rastrear("track", "PageView");
  }, [liberado, rota]);

  if (!carregar) return null;

  return <Script src={URL_SCRIPT_PIXEL} strategy="afterInteractive" />;
}
