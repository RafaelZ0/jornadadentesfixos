"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAceitouCookies } from "@/lib/consentimento";
import { enviarEvento, rastreamentoLiberado } from "@/lib/rastreamento";

function jaEnviou(chave: string) {
  try {
    return localStorage.getItem(chave) !== null;
  } catch {
    return false;
  }
}

function marcarEnviado(chave: string) {
  try {
    localStorage.setItem(chave, "1");
  } catch {
    // Sem armazenamento: a deduplicação por eventID ainda protege a contagem.
  }
}

export function EventoLead() {
  const eid = useSearchParams().get("eid");
  const liberado = rastreamentoLiberado(useAceitouCookies());

  useEffect(() => {
    if (!eid || !liberado) return;

    const chave = `jornada_lead_${eid}`;
    if (jaEnviou(chave)) return;

    marcarEnviado(chave);
    // event_id igual ao da API de Conversões: no GTM, vai no campo Event ID da tag Lead.
    enviarEvento("lead_form_submit", { event_id: eid });
  }, [eid, liberado]);

  return null;
}
