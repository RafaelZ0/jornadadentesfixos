// Só no servidor: usa o segredo da planilha.
import { emProducao } from "@/lib/ambiente";

const TIMEOUT_MS = 8000;
const TENTATIVAS = 2;

/** Envia um registro para o Apps Script. Devolve false se não conseguiu gravar. */
export async function salvarNaPlanilha(registro: Record<string, unknown>) {
  // Fora da produção, só grava numa planilha de teste. Sem ela, não grava e segue como se tivesse gravado.
  const url = emProducao
    ? process.env.GOOGLE_SHEETS_WEBHOOK_URL
    : process.env.GOOGLE_SHEETS_WEBHOOK_URL_TESTE;
  const segredo = process.env.SHEETS_SECRET;
  if (!emProducao && !url) {
    console.info("PLANILHA_TESTE: fora de produção, registro não gravado");
    return true;
  }
  if (!url || !segredo) return false;

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa += 1) {
    try {
      // O App da Web grava no POST e responde com um redirecionamento para o JSON.
      // Seguir esse redirecionamento vira um GET sem corpo, que só lê a resposta.
      const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segredo, ...registro }),
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      // Sem acesso público, o Google devolve uma página HTML, e o parse falha aqui.
      const dados = JSON.parse(await resposta.text());
      if (dados.ok === true) return true;
      console.error("Planilha recusou o registro", dados.erro, { tentativa });
    } catch (erro) {
      console.error("Falha ao falar com a planilha", String(erro), { tentativa });
    }
  }

  return false;
}
