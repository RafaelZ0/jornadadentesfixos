const JANELA_MS = 60_000;
// Folgado de propósito: no 4G, muitas pessoas da mesma operadora saem pelo mesmo IP.
const MAXIMO_POR_JANELA = 20;

const tentativas = new Map<string, { total: number; fim: number }>();

/** Limite simples por IP. Vale por instância do servidor, não é global. */
export function excedeuLimite(ip: string) {
  const agora = Date.now();

  for (const [chave, registro] of tentativas) {
    if (registro.fim <= agora) tentativas.delete(chave);
  }

  const registro = tentativas.get(ip);
  if (!registro) {
    tentativas.set(ip, { total: 1, fim: agora + JANELA_MS });
    return false;
  }

  registro.total += 1;
  return registro.total > MAXIMO_POR_JANELA;
}
