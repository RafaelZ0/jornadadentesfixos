import type { Origem } from "@/lib/origem";

export type Inscricao = Origem & {
  nome: string;
  whatsapp: string;
  cidade: string;
  consentimento: true;
  /** Campo isca contra robôs. */
  site: string;
};

type Resultado =
  | { ok: true; eventId: string }
  | { ok: false; erros?: Record<string, string> };

export async function enviarInscricao(
  inscricao: Inscricao,
): Promise<Resultado> {
  const resposta = await fetch("/api/inscricao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inscricao),
    signal: AbortSignal.timeout(25_000),
  });

  return resposta.json();
}
