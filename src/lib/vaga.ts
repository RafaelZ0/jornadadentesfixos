import type { Origem } from "@/lib/origem";

export type PedidoVaga = Origem & {
  nome: string;
  whatsapp: string;
  cidade: string;
  horario: string;
  /** Campo isca contra robôs. */
  site: string;
  cookies_aceitos: boolean;
};

type Resultado =
  | { ok: true; eventId: string; listaDeEspera: boolean }
  | { ok: false; erros?: Record<string, string> };

export async function enviarPedidoVaga(pedido: PedidoVaga): Promise<Resultado> {
  const resposta = await fetch("/api/vaga", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
    signal: AbortSignal.timeout(25_000),
  });

  return resposta.json();
}
