// Único ponto de configuração do site. Nada destes dados deve ser repetido no código.

export type FormatoVideo = "9:16" | "4:5" | "16:9";

export const evento = {
  nome: "Jornada dos Dentes Fixos: Seu Sorriso Transformado",
  nomeCurto: "Jornada dos Dentes Fixos",
  promessa: "Devolva o seu sorriso por meio dos dentes fixos",
  fusoHorario: "America/Sao_Paulo",

  aula: {
    titulo:
      "Os 3 Passos para Trocar a Dentadura por Dentes Fixos, Sem Medo e Sem Sair da Região",
    plataforma: "YouTube",
    inicio: "2026-11-24T19:30:00-03:00",
    fimReplay: "2026-11-26T22:00:00-03:00",
    duracaoMinutos: 80,
  },

  livesAquecimento: [
    "2026-11-10",
    "2026-11-12",
    "2026-11-14",
    "2026-11-17",
    "2026-11-19",
  ],

  avaliacaoPresencial: {
    inicio: "2026-12-01",
    fim: "2026-12-12",
  },

  meta: {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    exigeConsentimento: process.env.NEXT_PUBLIC_PIXEL_REQUIRE_CONSENT === "true",
    versaoGraph: "v26.0",
  },

  // Links curtos /aula e /live. Trocou o link no YouTube: troque aqui na Vercel e republique.
  youtube: {
    aulaUrl: process.env.NEXT_PUBLIC_YOUTUBE_LIVE_URL ?? "",
    proximaLiveUrl: process.env.NEXT_PUBLIC_YOUTUBE_NEXT_LIVE_URL ?? "",
  },

  // O ID do vídeo fica em config/replay-servidor.ts, fora do código que vai para o navegador.
  replay: {
    capa: "/images/capa-replay.jpg",
    // Textos pedidos pelo usuário em 03/11/2026. Pendentes de revisão do jurídico (regras do CFO).
    condicao:
      "Condição especial de lançamento para quem marcar até 30/11 e fechar na avaliação",
    bonus: [
      "Acompanhamento pós-operatório de 24 meses, por escrito",
      "Kit de cuidados e guia impresso",
      "Prioridade na data da cirurgia para quem fechar nas primeiras 48h",
    ],
  },

  // Pedidos de vaga de avaliação (/vaga), gravados na aba "Vagas" da planilha.
  vaga: {
    // Depois deste horário, /vaga só aceita a lista de espera. O servidor também confere.
    prazo: "2026-11-30T22:00:00-03:00",
    retornoMinutos: 15,
    horarios: ["Manhã", "Tarde", "Noite"],
    // [WHATSAPP DO COMERCIAL]: só dígitos, com 55 e DDD. Vazio: usa o WhatsApp da clínica.
    whatsappComercialE164: process.env.NEXT_PUBLIC_WHATSAPP_COMERCIAL ?? "",
    mensagemWhatsapp:
      "Olá! Assisti à aula da Jornada dos Dentes Fixos e quero minha vaga de avaliação.",
    mensagemListaDeEspera:
      "Olá! Assisti à aula da Jornada dos Dentes Fixos e quero entrar na lista de espera.",
    mesListaDeEspera: "janeiro",
  },

  videoConvite: {
    id: process.env.NEXT_PUBLIC_VIDEO_CONVITE_ID ?? "",
    formato: "9:16" as FormatoVideo,
    capa: "/images/capa-video.jpg",
  },

  whatsapp: {
    clinicaExibicao: "(28) 99257-4073",
    clinicaE164: "5528992574073",
    grupoUrl: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? "",
  },

  clinica: {
    nome: "Instituto Odontológico Dr. Pablo Santos",
    nomeAlternativo: "Infinity Clinic",
    razaoSocial: "P. Santos de Oliveira Ltda.",
    cnpj: "23.869.547/0001-23",
    endereco: {
      logradouro: "Rodovia Ricardo Barbieri, nº 139 (Rod. ES 489)",
      bairro: "Boa Vista / Rui Pinto Bandeira",
      cidade: "Cachoeiro de Itapemirim",
      uf: "ES",
      cep: "29.315-442",
    },
  },

  responsavelTecnico: {
    nome: "Dr. Pablo Santos",
    titulo: "Doutor e Especialista em Implantodontia",
    cro: "CRO-ES 005206",
    // Parágrafo em primeira pessoa, escrito pelo Dr. Pablo. Vazio: não aparece em produção.
    textoPessoal: "",
    equipe: [
      { nome: "Dra. Melissa", foto: "/images/dra-melissa.jpg" },
      { nome: "Dra. Mariana", foto: "/images/dra-mariana.jpg" },
    ],
  },

  cidadesDaRegiao: [
    "Cachoeiro de Itapemirim",
    "Castelo",
    "Alegre",
    "Itapemirim",
    "Marataízes",
    "Guarapari",
    "Vargem Alta",
    "Muqui",
    "Atilio Vivácqua",
    "Mimoso do Sul",
    "Presidente Kennedy",
    "Rio Novo do Sul",
    "Iconha",
    "Piúma",
    "Anchieta",
    "Jerônimo Monteiro",
    "Guaçuí",
    "Muniz Freire",
    "Venda Nova do Imigrante",
    "Alfredo Chaves",
  ],

  legal: {
    rascunho: process.env.NEXT_PUBLIC_LEGAL_DRAFT === "true",
    atualizadoEm: "2 de novembro de 2026",
    prazoGuarda: "[PRAZO]",
    canalPrivacidade: "[E-MAIL OU WHATSAPP DE PRIVACIDADE]",
  },

  rotas: {
    termos: "/termos",
    privacidade: "/privacidade",
    replay: "/replay",
    vaga: "/vaga",
  },
} as const;
