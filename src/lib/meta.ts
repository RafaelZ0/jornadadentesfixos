import { createHash } from "node:crypto";
import { evento } from "@/config/evento";

type LeadMeta = {
  /** Evento padrão da Meta. Lead na inscrição, Schedule no pedido de vaga. */
  nomeEvento?: "Lead" | "Schedule";
  eventId: string;
  urlOrigem?: string;
  whatsapp: string;
  nome: string;
  cidade: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  fbclidEm?: number;
};

const hash = (valor: string) =>
  createHash("sha256").update(valor, "utf8").digest("hex");

/** fn: minúsculas, sem pontuação, mantendo acentos em UTF-8. */
function normalizarNome(nome: string) {
  const primeiro = nome.trim().split(/\s+/)[0];
  return primeiro.toLocaleLowerCase("pt-BR").replace(/[^\p{L}]/gu, "");
}

/** ct: minúsculas, sem pontuação, sem caracteres especiais e sem espaços. */
function normalizarCidade(cidade: string) {
  return cidade
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function montarFbc({ fbc, fbclid, fbclidEm }: LeadMeta) {
  if (fbc) return fbc;
  if (!fbclid) return undefined;
  return `fb.1.${fbclidEm ?? Date.now()}.${fbclid}`;
}

/** Nunca lança erro: uma falha aqui não pode afetar a inscrição. */
export async function enviarLeadMeta(lead: LeadMeta) {
  const { pixelId, versaoGraph } = evento.meta;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  const corpo = {
    data: [
      {
        event_name: lead.nomeEvento ?? "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.urlOrigem,
        user_data: {
          ph: [hash(lead.whatsapp)],
          fn: [hash(normalizarNome(lead.nome))],
          ct: [hash(normalizarCidade(lead.cidade))],
          country: [hash("br")],
          client_ip_address: lead.ip,
          client_user_agent: lead.userAgent,
          fbp: lead.fbp,
          fbc: montarFbc(lead),
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE && {
      test_event_code: process.env.META_TEST_EVENT_CODE,
    }),
  };

  try {
    const resposta = await fetch(
      `https://graph.facebook.com/${versaoGraph}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!resposta.ok) {
      const { error } = await resposta.json().catch(() => ({ error: null }));
      console.error("META_CAPI_ERRO", resposta.status, error?.message);
    }
  } catch (erro) {
    // Só o nome do erro: a mensagem pode trazer a URL, que contém o token.
    console.error("META_CAPI_ERRO", erro instanceof Error ? erro.name : "falha");
  }
}
