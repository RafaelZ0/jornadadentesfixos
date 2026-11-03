import { evento } from "@/config/evento";

export type FaseReplay = "no-ar" | "so-vaga" | "encerrado";

const fimReplay = new Date(evento.aula.fimReplay).getTime();
const fimVaga = new Date(evento.vaga.prazo).getTime();

/** Hora da visita, lida no servidor depois de connection(). */
export const horaDaVisita = () => Date.now();

export function faseDoReplay(agora: number): FaseReplay {
  if (agora < fimReplay) return "no-ar";
  if (agora < fimVaga) return "so-vaga";
  return "encerrado";
}

/** Depois do prazo, só a lista de espera. Não há como reabrir pelo site. */
export const vagasEncerradas = (agora: number) => agora >= fimVaga;
