import type { Origem } from "@/lib/origem";

export type Inscricao = Origem & {
  nome: string;
  whatsapp: string;
  cidade: string;
  consentimento: true;
};

// Simulação: o envio real para a rota de API entra na Parte 4.
export async function enviarInscricao(inscricao: Inscricao) {
  if (process.env.NODE_ENV === "development") {
    console.debug("Inscrição simulada", inscricao);
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
}
