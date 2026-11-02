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

  rotas: {
    termos: "/termos",
    privacidade: "/privacidade",
  },
} as const;
