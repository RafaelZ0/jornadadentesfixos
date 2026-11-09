import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { evento } from "@/config/evento";
import { idCompleteRegistration } from "@/lib/event-id";

// TEMPORÁRIA (09/11/2026): reenvia o CompleteRegistration de inscrições feitas antes de o evento existir.
// Os dados chegam no corpo do pedido e nada fica gravado. Apagar esta rota e a variável REENVIO_CHAVE depois do uso.

type Inscricao = {
  eventIdLead: string;
  /** Data/hora da inscrição, ISO com fuso. */
  quando: string;
  whatsapp: string;
  nome: string;
  cidade: string;
  fbclid: string;
  url: string;
};

const hash = (valor: string) => createHash("sha256").update(valor, "utf8").digest("hex");

const primeiroNome = (nome: string) =>
  nome.trim().split(/\s+/)[0].toLocaleLowerCase("pt-BR").replace(/[^\p{L}]/gu, "");

const cidade = (texto: string) =>
  texto
    .replace(/\s+ES$/i, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

function chaveValida(recebida: string | null) {
  const esperada = process.env.REENVIO_CHAVE;
  if (!esperada || !recebida) return false;
  const a = Buffer.from(esperada);
  const b = Buffer.from(recebida);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!chaveValida(request.headers.get("x-reenvio-chave"))) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const { inscricoes, testEventCode } = (await request.json()) as {
    inscricoes: Inscricao[];
    testEventCode?: string;
  };

  const { pixelId, versaoGraph } = evento.meta;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return NextResponse.json({ ok: false, erro: "sem pixel ou token" }, { status: 500 });
  }

  const data = inscricoes.map((inscricao) => {
    const momento = new Date(inscricao.quando).getTime();
    return {
      event_name: "CompleteRegistration",
      event_time: Math.floor(momento / 1000),
      event_id: idCompleteRegistration(inscricao.eventIdLead),
      action_source: "website",
      event_source_url: inscricao.url,
      user_data: {
        ph: [hash(inscricao.whatsapp)],
        fn: [hash(primeiroNome(inscricao.nome))],
        ct: [hash(cidade(inscricao.cidade))],
        country: [hash("br")],
        fbc: `fb.1.${momento}.${inscricao.fbclid}`,
      },
    };
  });

  const resposta = await fetch(
    `https://graph.facebook.com/${versaoGraph}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, ...(testEventCode && { test_event_code: testEventCode }) }),
      cache: "no-store",
    },
  );

  // Só a resposta da Meta volta: nenhum dado pessoal no retorno nem no log.
  return NextResponse.json(
    { ok: resposta.ok, status: resposta.status, meta: await resposta.json().catch(() => null) },
    { status: resposta.ok ? 200 : 502 },
  );
}
