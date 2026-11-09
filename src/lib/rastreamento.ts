import { evento } from "@/config/evento";
import { aceitouCookies } from "@/lib/consentimento";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Eventos que o site envia ao dataLayer. No GTM, cada um vira um acionador "Evento personalizado". */
export type EventoGtm =
  | "page_view_spa"
  | "view_content"
  | "video_play"
  | "replay_play"
  | "lead_form_submit"
  | "complete_registration"
  | "schedule_submit"
  | "whatsapp_click"
  | "aula_acesso"
  | "live_acesso";

export function rastreamentoLiberado(aceitou: boolean) {
  return !evento.meta.exigeConsentimento || aceitou;
}

// Os eventos esperam na fila do dataLayer até o GTM carregar.
export function enviarEvento(nome: EventoGtm, dados: Record<string, unknown> = {}) {
  if (!rastreamentoLiberado(aceitouCookies())) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: nome, ...dados });
}
