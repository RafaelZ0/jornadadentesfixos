import { randomUUID } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { evento } from "@/config/evento";
import { excedeuLimite } from "@/lib/limite";
import { mensagens } from "@/lib/mensagens";
import { enviarLeadMeta } from "@/lib/meta";
import { salvarNaPlanilha } from "@/lib/planilha";
import { horaDaVisita, vagasEncerradas } from "@/lib/replay";
import { somenteDigitos, whatsappValido } from "@/lib/whatsapp";

const textoOpcional = z.string().max(500).optional();

const esquema = z.object({
  nome: z.string().trim().min(2, mensagens.nome).max(120, mensagens.nome),
  whatsapp: z.string().refine(whatsappValido, mensagens.whatsapp),
  cidade: z.string().trim().min(2, mensagens.cidade).max(120, mensagens.cidade),
  horario: z.enum(evento.vaga.horarios, { error: mensagens.horario }),
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

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (excedeuLimite(`vaga:${ip ?? "desconhecido"}`)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const corpo = await request.json().catch(() => null);
  if (typeof corpo !== "object" || corpo === null) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event_id = randomUUID();
  // Quem decide é o relógio do servidor: depois do prazo, todo pedido vira lista de espera.
  const listaDeEspera = vagasEncerradas(horaDaVisita());

  // Campo isca preenchido: parece sucesso para o robô, mas nada é gravado.
  if ("site" in corpo && corpo.site) {
    return NextResponse.json({ ok: true, eventId: event_id, listaDeEspera });
  }

  const validacao = esquema.safeParse(corpo);
  if (!validacao.success) {
    const campos = z.flattenError(validacao.error).fieldErrors;
    const erros = Object.fromEntries(
      Object.entries(campos).map(([campo, lista]) => [campo, lista?.[0]]),
    );
    return NextResponse.json({ ok: false, erros }, { status: 400 });
  }

  const pedido = {
    ...validacao.data,
    tipo: "vaga",
    status: listaDeEspera ? "Lista de espera" : "Novo",
    whatsapp: `55${somenteDigitos(validacao.data.whatsapp)}`,
    event_id,
  };

  if (!(await salvarNaPlanilha(pedido))) {
    // Sem gravar, a equipe não liga: a pessoa precisa saber e ter o WhatsApp como saída.
    console.error("VAGA_NAO_SALVA", JSON.stringify(pedido));
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  // Lista de espera não é agendamento: não conta como Schedule na Meta.
  if (!listaDeEspera && (!evento.meta.exigeConsentimento || pedido.cookies_aceitos)) {
    after(() =>
      enviarLeadMeta({
        nomeEvento: "Schedule",
        eventId: event_id,
        urlOrigem: pedido.url_origem ?? request.headers.get("referer") ?? undefined,
        whatsapp: pedido.whatsapp,
        nome: pedido.nome,
        cidade: pedido.cidade,
        ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        fbp: request.cookies.get("_fbp")?.value,
        fbc: request.cookies.get("_fbc")?.value,
        fbclid: pedido.fbclid,
        fbclidEm: pedido.fbclid_em,
      }),
    );
  }

  return NextResponse.json({ ok: true, eventId: event_id, listaDeEspera });
}
