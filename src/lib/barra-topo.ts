import { evento } from "@/config/evento";
import { horaDaAula, porExtenso } from "@/lib/datas";
import { inicioDaLive } from "@/lib/lives";

// Depois deste tempo do início, a barra passa para a próxima data da programação.
const DURACAO_LIVE_MS = 90 * 60 * 1000;
const DIA_MS = 24 * 60 * 60 * 1000;

const inicioAula = new Date(evento.aula.inicio).getTime();
const fimReplay = new Date(evento.aula.fimReplay).getTime();

// Dia no horário de Brasília, no formato 2026-11-10, para comparar "hoje" e "amanhã".
const diaEmBrasilia = (instante: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: evento.fusoHorario }).format(
    instante,
  );

/** "hoje, 10/11, às 19h30", "amanhã, 12/11, às 19h30" ou "quinta, 12/11, às 19h30". */
function quando(instante: number, hora: string, agora: number) {
  const { dia, data } = porExtenso(new Date(instante).toISOString());
  const nome =
    diaEmBrasilia(instante) === diaEmBrasilia(agora)
      ? "hoje"
      : diaEmBrasilia(instante) === diaEmBrasilia(agora + DIA_MS)
        ? "amanhã"
        : dia;
  return `${nome}, ${data}, às ${hora}`;
}

export type AvisoTopo = {
  principal: string;
  complemento?: string;
  link?: string;
};

/** O que a barra do topo mostra agora: a próxima live, a aula ou o replay. */
export function avisoDoTopo(agora: number): AvisoTopo {
  const { data: dataAula } = porExtenso(evento.aula.inicio);

  const proxima = evento.livesAquecimento.findIndex(
    (live) => inicioDaLive(live.data, live.hora) + DURACAO_LIVE_MS > agora,
  );

  if (proxima >= 0) {
    const live = evento.livesAquecimento[proxima];
    const inicio = inicioDaLive(live.data, live.hora);
    const ordem = `${proxima + 1}ª live`;
    return {
      principal:
        agora >= inicio
          ? `${ordem} ao vivo agora`
          : `${ordem} ${quando(inicio, live.hora, agora)}`,
      complemento: `Aula final ${dataAula}`,
    };
  }

  if (agora < inicioAula) {
    return {
      principal: `Aula final ${quando(inicioAula, horaDaAula, agora)}`,
      complemento: "Gratuita e ao vivo",
    };
  }

  if (agora < fimReplay) {
    const { dia, data, hora } = porExtenso(evento.aula.fimReplay);
    return {
      principal: "Assista ao replay da aula",
      complemento: `No ar até ${dia}, ${data}, às ${hora}`,
      link: evento.rotas.replay,
    };
  }

  return { principal: "O replay da aula já saiu do ar" };
}
