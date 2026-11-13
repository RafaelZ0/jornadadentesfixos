import { randomUUID } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { evento } from "@/config/evento";
import { excedeuLimite } from "@/lib/limite";
import { mensagens } from "@/lib/mensagens";
import { idCompleteRegistration } from "@/lib/event-id";
import { enviarLeadMeta } from "@/lib/meta";
import { salvarNaPlanilha } from "@/lib/planilha";
import { somenteDigitos, whatsappValido } from "@/lib/whatsapp";

const textoOpcional = z.string().max(500).optional();

const esquema = z.object({
  nome: z.string().trim().min(2, mensagens.nome).max(120, mensagens.nome),
  whatsapp: z.string().refine(whatsappValido, mensagens.whatsapp),
  // Opcional: vazia, vai como texto vazio para a planilha.
  cidade: z.string().trim().max(120, mensagens.cidade).default(""),
  utm_source: textoOpcional,
  utm_medium: textoOpcional,
  utm_campaign: textoOpcional,
  utm_content: textoOpcional,
  utm_term: textoOpcional,
  fbclid: textoOpcional,
  url_origem: z.string().max(2000).optional(),
  fbclid_em: z.number().int().positive().optional(),
  cookies_aceitos: z.boolean().optional(),
});

type Lead = z.infer<typeof esquema> & {
  event_id: string;
  consentimento: true;
  consentimento_registro: string;
};

// O aceite é o texto abaixo do botão: quem envia o formulário concorda com ele.
function registroDoAceite() {
  const quando = new Intl.DateTimeFormat("pt-BR", {
    timeZone: evento.fusoHorario,
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date());
  return `aceito via texto (inscrição) em ${quando}`;
}

const PARAMETROS_DE_ORIGEM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

/** Envio sem JavaScript: a origem (UTMs e fbclid) vem do endereço da página em que a pessoa estava. */
function origemDaPagina(referer: string | null) {
  if (!referer) return {};
  try {
    const url = new URL(referer);
    const origem: Record<string, string | number> = { url_origem: referer.slice(0, 2000) };
    for (const parametro of PARAMETROS_DE_ORIGEM) {
      const valor = url.searchParams.get(parametro);
      if (valor) origem[parametro] = valor.slice(0, 500);
    }
    if (origem.fbclid) origem.fbclid_em = Date.now();
    return origem;
  } catch {
    return {};
  }
}

async function lerCorpo(request: NextRequest, nativo: boolean) {
  if (!nativo) return request.json().catch(() => null);

  const dados = await request.formData().catch(() => null);
  if (!dados) return null;
  const texto = (campo: string) => String(dados.get(campo) ?? "");
  return {
    ...origemDaPagina(request.headers.get("referer")),
    nome: texto("nome"),
    whatsapp: somenteDigitos(texto("whatsapp")),
    cidade: texto("cidade"),
    site: texto("site"),
    cookies_aceitos: false,
  };
}

export async function POST(request: NextRequest) {
  // Formulário enviado pelo navegador antes de o JavaScript carregar: responde com redirecionamento,
  // não com JSON. 303 faz o navegador abrir o destino com GET.
  const tipo = request.headers.get("content-type") ?? "";
  const nativo =
    tipo.includes("application/x-www-form-urlencoded") ||
    tipo.includes("multipart/form-data");

  const sucesso = (eventId: string) =>
    nativo
      ? NextResponse.redirect(
          new URL(`/obrigado?eid=${encodeURIComponent(eventId)}`, request.url),
          303,
        )
      : NextResponse.json({ ok: true, eventId });

  const falha = (status: number, erros?: Record<string, string | undefined>) =>
    nativo
      ? NextResponse.redirect(new URL("/?inscricao=erro#inscricao", request.url), 303)
      : NextResponse.json({ ok: false, ...(erros && { erros }) }, { status });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (excedeuLimite(ip ?? "desconhecido")) return falha(429);

  const corpo = await lerCorpo(request, nativo);
  if (typeof corpo !== "object" || corpo === null) return falha(400);

  const event_id = randomUUID();

  // Campo isca preenchido: parece sucesso para o robô, mas nada é gravado.
  if ("site" in corpo && corpo.site) return sucesso(event_id);

  const validacao = esquema.safeParse(corpo);
  if (!validacao.success) {
    const campos = z.flattenError(validacao.error).fieldErrors;
    const erros = Object.fromEntries(
      Object.entries(campos).map(([campo, lista]) => [campo, lista?.[0]]),
    );
    return falha(400, erros);
  }

  const lead: Lead = {
    ...validacao.data,
    whatsapp: `55${somenteDigitos(validacao.data.whatsapp)}`,
    event_id,
    // true mantém o "Sim" no Apps Script antigo; o registro entra quando o script novo for publicado.
    consentimento: true,
    consentimento_registro: registroDoAceite(),
  };

  if (!(await salvarNaPlanilha(lead))) {
    // A pessoa segue em frente. O lead fica no log do servidor para recuperar depois.
    console.error("LEAD_NAO_SALVO", JSON.stringify(lead));
  }

  if (!evento.meta.exigeConsentimento || lead.cookies_aceitos) {
    // Roda depois da resposta: a Meta não atrasa o formulário.
    after(() =>
      enviarLeadMeta({
        eventId: event_id,
        // A campanha otimiza por CompleteRegistration. O navegador manda o mesmo par de eventos.
        eventosExtras: [
          {
            nomeEvento: "CompleteRegistration",
            eventId: idCompleteRegistration(event_id),
          },
        ],
        urlOrigem: lead.url_origem ?? request.headers.get("referer") ?? undefined,
        whatsapp: lead.whatsapp,
        nome: lead.nome,
        cidade: lead.cidade,
        ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        fbp: request.cookies.get("_fbp")?.value,
        fbc: request.cookies.get("_fbc")?.value,
        fbclid: lead.fbclid,
        fbclidEm: lead.fbclid_em,
      }),
    );
  }

  return sucesso(event_id);
}
