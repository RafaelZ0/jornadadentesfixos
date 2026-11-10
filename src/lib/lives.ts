import { evento } from "@/config/evento";

// Depois do início, o /live continua levando para a mesma live por este tempo (ela pode atrasar ou demorar).
const TOLERANCIA_MS = 3 * 60 * 60 * 1000;

// "19h30" ou "10h" vira o horário de Brasília em milissegundos.
export function inicioDaLive(data: string, hora: string) {
  const [, h = "0", m = "0"] = hora.match(/^(\d{1,2})h(\d{2})?$/) ?? [];
  const relogio = `${h.padStart(2, "0")}:${(m || "0").padStart(2, "0")}`;
  return new Date(`${data}T${relogio}:00-03:00`).getTime();
}

/** Link da live que está no ar ou da próxima. Sem link cadastrado para ela, usa o da Vercel. */
export function linkDaLive(agora: number) {
  const atual = evento.livesAquecimento.find(
    (live) => inicioDaLive(live.data, live.hora) + TOLERANCIA_MS > agora,
  );
  return atual?.url || evento.youtube.proximaLiveUrl;
}
