"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function EventoLead() {
  const eid = useSearchParams().get("eid");

  useEffect(() => {
    if (!eid) return;

    // PARTE 6: disparar aqui o evento Lead do Pixel, com o eid como eventID, para
    // deduplicar com a API de Conversões. Evitar disparo repetido ao recarregar.
    // window.fbq?.("track", "Lead", {}, { eventID: eid });
  }, [eid]);

  return null;
}
