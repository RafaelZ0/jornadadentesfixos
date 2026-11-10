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

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (excedeuLimite(ip ?? "desconhecido")) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const corpo = await request.json().catch(() => null);
  if (typeof corpo !== "object" || corpo === null) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event_id = randomUUID();

  // Campo isca preenchido: parece sucesso para o robô, mas nada é gravado.
  if ("site" in corpo && corpo.site) {
    return NextResponse.json({ ok: true, eventId: event_id });
  }

  const validacao = esquema.safeParse(corpo);
  if (!validacao.success) {
    const campos = z.flattenError(validacao.error).fieldErrors;
    const erros = Object.fromEntries(
      Object.entries(campos).map(([campo, lista]) => [campo, lista?.[0]]),
    );
    return NextResponse.json({ ok: false, erros }, { status: 400 });
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

  return NextResponse.json({ ok: true, eventId: event_id });
}
