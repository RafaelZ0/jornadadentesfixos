import { evento } from "@/config/evento";

const inicio = new Date(evento.aula.inicio);
const fuso = { timeZone: evento.fusoHorario };

export const dataDaAula = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  day: "numeric",
  month: "long",
}).format(inicio);

export const diaDaAula = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  weekday: "long",
}).format(inicio);

export const horaDaAula = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  hour: "2-digit",
  minute: "2-digit",
})
  .format(inicio)
  .replace(":", "h");

const fimReplay = new Date(evento.aula.fimReplay);

export const horaFimReplay = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  hour: "numeric",
})
  .format(fimReplay)
  .replace(/\D/g, "")
  .concat("h");

export const dataFimReplay = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  day: "2-digit",
  month: "2-digit",
}).format(fimReplay);

export const diaFimReplay = new Intl.DateTimeFormat("pt-BR", {
  ...fuso,
  weekday: "long",
})
  .format(fimReplay)
  .replace("-feira", "");

const { duracaoMinutos } = evento.aula;
const horas = Math.floor(duracaoMinutos / 60);
const minutos = duracaoMinutos % 60;

export const duracaoPorExtenso = `${horas} hora${horas > 1 ? "s" : ""}${minutos ? ` e ${minutos} minutos` : ""}`;
