const CHAVE = "jornada_origem";

const PARAMETROS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type Origem = Partial<Record<(typeof PARAMETROS)[number], string>> & {
  url_origem?: string;
  /** Quando o fbclid foi visto pela primeira vez, em milissegundos. */
  fbclid_em?: number;
};

export function lerOrigem(): Origem {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE) ?? "{}");
  } catch {
    return {};
  }
}

/** Guarda a origem na chegada. Uma navegação interna, sem UTMs, não apaga nada. */
export function capturarOrigem() {
  const origem = lerOrigem();
  const url = new URL(window.location.href);

  let chegouComUtm = false;
  for (const parametro of PARAMETROS) {
    const valor = url.searchParams.get(parametro);
    if (valor) {
      origem[parametro] = valor;
      chegouComUtm = true;
    }
  }
  if (origem.fbclid) origem.fbclid_em ??= Date.now();
  if (chegouComUtm || !origem.url_origem) origem.url_origem = url.href;

  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(origem));
  } catch {
    // Sem sessionStorage (navegação privada restrita): a inscrição segue sem UTMs guardadas.
  }
}
