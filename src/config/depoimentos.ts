// ATENÇÃO: só entram aqui casos com AUTORIZAÇÃO POR ESCRITO do paciente, em tom
// educativo. Nada de antes e depois, nem promessa de resultado (regras do CFO).
// Enquanto a lista estiver vazia, a seção Casos reais não aparece no site.

export type Depoimento = {
  nome: string;
  cidade: string;
  frase: string;
  /** Caminho em public, como "/images/casos/maria.jpg". */
  foto?: string;
  /** ID do vídeo no YouTube. Tem prioridade sobre a foto. */
  videoId?: string;
};

export const depoimentos: Depoimento[] = [
  // {
  //   nome: "Maria da Silva",
  //   cidade: "Castelo",
  //   frase: "Frase dita pela própria paciente.",
  //   foto: "/images/casos/maria.jpg",
  // },
];
