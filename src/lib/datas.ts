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
