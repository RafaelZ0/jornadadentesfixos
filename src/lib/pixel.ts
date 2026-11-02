import { evento } from "@/config/evento";
import { aceitouCookies } from "@/lib/consentimento";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const URL_SCRIPT_PIXEL = "https://connect.facebook.net/en_US/fbevents.js";

export function pixelLiberado(aceitou: boolean) {
  const { pixelId, exigeConsentimento } = evento.meta;
  return Boolean(pixelId) && (!exigeConsentimento || aceitou);
}

// Mesma fila do código-base da Meta: os eventos aguardam até o fbevents.js carregar.
function instalarFila() {
  if (window.fbq) return;

  const fila: unknown[] = [];
  const fbq: Fbq = (...args) => {
    fila.push(args);
  };
  Object.assign(fbq, { push: fbq, loaded: true, version: "2.0", queue: fila });

  window.fbq = fbq;
  window._fbq = fbq;
  fbq("init", evento.meta.pixelId);
}

export function rastrear(...args: unknown[]) {
  if (!pixelLiberado(aceitouCookies())) return;
  instalarFila();
  window.fbq?.(...args);
}
