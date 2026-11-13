import { createHash } from "node:crypto";
import { evento } from "@/config/evento";
import { emProducao } from "@/lib/ambiente";

type NomeEvento = "Lead" | "Schedule" | "CompleteRegistration";

type LeadMeta = {
  /** Evento padrão da Meta. Lead na inscrição, Schedule no pedido de vaga. */
  nomeEvento?: NomeEvento;
  eventId: string;
  /** Outros eventos na mesma chamada, com os mesmos dados do usuário e de contexto. */
  eventosExtras?: { nomeEvento: NomeEvento; eventId: string }[];
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

  // Fora da produção, o evento só vai com o código de teste da Meta (aba Eventos de teste).
  // Sem o código, não vai: teste no computador ou em preview não entra no pixel de produção.
  const codigoDeTeste = emProducao ? undefined : process.env.META_TEST_EVENT_CODE;
  if (!emProducao && !codigoDeTeste) return;

  const contexto = {
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: lead.urlOrigem,
    user_data: {
      ph: [hash(lead.whatsapp)],
      fn: [hash(normalizarNome(lead.nome))],
      // Cidade é opcional no formulário: vazia, o campo não vai.
      ...(normalizarCidade(lead.cidade) && {
        ct: [hash(normalizarCidade(lead.cidade))],
      }),
      country: [hash("br")],
      client_ip_address: lead.ip,
      client_user_agent: lead.userAgent,
      fbp: lead.fbp,
      fbc: montarFbc(lead),
    },
  };

  const eventos = [
    { nomeEvento: lead.nomeEvento ?? "Lead", eventId: lead.eventId },
    ...(lead.eventosExtras ?? []),
  ];

  const corpo = {
    data: eventos.map(({ nomeEvento, eventId }) => ({
      event_name: nomeEvento,
      event_id: eventId,
      ...contexto,
    })),
    ...(codigoDeTeste && { test_event_code: codigoDeTeste }),
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
