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

  // Lives de aquecimento no YouTube. Temas e horários passados pelo usuário em 06/11/2026.
  // url: link da transmissão programada. O /live leva sempre para a próxima live (ou a que está no ar).
  livesAquecimento: [
    {
      data: "2026-11-10",
      hora: "19h30",
      url: "https://www.youtube.com/live/ufjoACDqO_0",
      tema: "Os 5 medos de quem usa dentadura, e o que é verdade",
    },
    {
      data: "2026-11-12",
      hora: "19h30",
      url: "",
      tema: "Tenho pouco osso, sou diabético, tenho 70 anos: posso fazer implante?",
    },
    {
      data: "2026-11-14",
      hora: "10h",
      url: "",
      tema: "Caso real com o paciente convidado",
    },
    {
      data: "2026-11-17",
      hora: "19h30",
      url: "",
      tema: "Dentadura, protocolo ou implante unitário: qual é para você?",
    },
    {
      data: "2026-11-19",
      hora: "19h30",
      url: "",
      tema: "Como funciona a cirurgia por dentro: do medo ao primeiro sorriso (bastidores)",
    },
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

  // Vazio na Vercel desliga o Tag Manager.
  googleTagManager: {
    id: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KLKXFHJ6",
  },

  // Tag Manager e Pixel só carregam neste endereço. No computador e nos previews da Vercel, não.
  // Trocou de domínio: mude aqui antes de publicar.
  dominioProducao: "jornadadentesfixos.vercel.app",

  // Link curto /aula. proximaLiveUrl só vale quando nenhuma live da lista acima tem link para agora.
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
    // Em primeira pessoa. Rascunho de 10/11/2026: o Dr. Pablo precisa ler e aprovar.
    // Lista vazia: o bloco não aparece em produção.
    textoPessoal: [
      "Eu me formei em Odontologia pela UFES em 2006. Nos primeiros anos de consultório, reparei numa coisa que se repetia: muita gente falava comigo com a mão na frente da boca.",
      "Eram pessoas que tinham parado de sorrir em foto, que escolhiam o que comer pela dentadura e que já tinham ouvido que era tarde demais. Foi por elas que fui estudar implante. Fiz a especialização em 2013, o doutorado em 2014, e hoje também ensino outros dentistas.",
      "Depois de mais de 8.000 casos, o que mais me marca ainda é a primeira conversa. A pessoa chega com medo e cheia de dúvidas. Quase sempre, o que ela precisava era de alguém que explicasse com calma o que dá e o que não dá para fazer no caso dela. É isso que eu vou fazer na aula.",
    ] as string[],
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
    // Textos aprovados pelo jurídico, segundo o usuário, em 06/11/2026.
    rascunho: false,
    atualizadoEm: "6 de novembro de 2026",
    prazoGuarda: "2 anos",
    canalPrivacidade: "e-mail, em institutopso@gmail.com",
  },

  rotas: {
    termos: "/termos",
    privacidade: "/privacidade",
    replay: "/replay",
    vaga: "/vaga",
    grupo: "/grupo",
  },
} as const;
