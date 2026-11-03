import { connection, NextResponse } from "next/server";

// 307 e sem cache: o navegador não guarda o destino, então trocar o link vale na hora.
export async function redirecionarPara(destino: string, pedido: Request) {
  await connection();

  let url: URL;
  try {
    url = new URL(destino);
    if (url.protocol !== "https:") throw new Error("protocolo");
  } catch {
    // Link ainda não cadastrado: a pessoa cai na página inicial, não numa página de erro.
    url = new URL("/", pedido.url);
  }

  const resposta = NextResponse.redirect(url, 307);
  resposta.headers.set("Cache-Control", "no-store");
  return resposta;
}
