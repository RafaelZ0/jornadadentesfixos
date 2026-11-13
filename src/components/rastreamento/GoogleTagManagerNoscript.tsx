import { evento } from "@/config/evento";
import { emProducao } from "@/lib/ambiente";

const { id } = evento.googleTagManager;

/**
 * Para quem está com o JavaScript desligado. Só no site de produção: no computador e nos
 * previews não entra. Com consentimento obrigatório, também não: não há como aceitar.
 */
export function GoogleTagManagerNoscript() {
  if (!id || !emProducao || evento.meta.exigeConsentimento) return null;

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
