"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useAceitouCookies } from "@/lib/consentimento";
import { pixelLiberado, rastrear, URL_SCRIPT_PIXEL } from "@/lib/pixel";

export function MetaPixel() {
  const rota = usePathname();
  const liberado = pixelLiberado(useAceitouCookies());
  const ultimaRota = useRef("");

  useEffect(() => {
    if (!liberado || ultimaRota.current === rota) return;
    ultimaRota.current = rota;
    rastrear("track", "PageView");
  }, [liberado, rota]);

  if (!liberado) return null;

  return <Script src={URL_SCRIPT_PIXEL} strategy="afterInteractive" />;
}
