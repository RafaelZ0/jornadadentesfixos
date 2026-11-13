"use client";

import { useSyncExternalStore } from "react";
import { evento } from "@/config/evento";
import { diaDaAula, horaDaAula, porExtenso } from "@/lib/datas";
import { inicioDaLive } from "@/lib/lives";

const { livesAquecimento, aula } = evento;

// Duas horas depois do início, a live sai da lista.
const TEMPO_NA_LISTA_MS = 2 * 60 * 60 * 1000;

// Meio-dia: a data não muda de dia por causa do fuso. A numeração é fixa: a Live 3 continua Live 3.
const lives = livesAquecimento.map((live, indice) => ({
  ...live,
  numero: indice + 1,
  termina: inicioDaLive(live.data, live.hora) + TEMPO_NA_LISTA_MS,
  quando: porExtenso(`${live.data}T12:00:00-03:00`),
}));

function assinar(aoMudar: () => void) {
  const relogio = setInterval(aoMudar, 60_000);
  return () => clearInterval(relogio);
}

const minutoAtual = () => Math.floor(Date.now() / 60_000) * 60_000;

const faltamDetalhes = lives.some((live) => !live.hora || !live.tema);

const linha =
  "grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[8.5rem_minmax(0,1fr)]";
const data =
  "font-display text-lg leading-[1.35] font-semibold whitespace-nowrap text-ink";
const hora = "block font-body text-md leading-[1.5] font-bold text-ink";

/** Datas das lives de aquecimento e da aula, como no lançamento semente. */
export function Programacao() {
  const emDesenvolvimento = process.env.NODE_ENV !== "production";
  // A página é gerada antes: no HTML vão todas as lives, e o navegador tira as que já passaram.
  const agora = useSyncExternalStore(assinar, minutoAtual, () => null);
  const proximas =
    agora === null ? lives : lives.filter((live) => live.termina > agora);

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col">
        {proximas.map((live) => (
          <li key={live.data} className={`${linha} border-t border-rule py-3`}>
            <span className={data}>
              {live.quando.dia.slice(0, 3)}, {live.quando.data}
              {live.hora && <span className={hora}>{live.hora}</span>}
            </span>
            <span className="text-md leading-[1.5] text-ink">
              Live {live.numero} no {aula.plataforma}
              {live.tema && (
                <span className="block text-ink-2">{live.tema}</span>
              )}
            </span>
          </li>
        ))}
        <li className={`${linha} border-t-2 border-b-2 border-ink py-4`}>
          <span className={data}>
            {diaDaAula.slice(0, 3)}, {porExtenso(aula.inicio).data}
            <span className={hora}>{horaDaAula}</span>
          </span>
          <span className="text-md leading-[1.5] text-ink">
            <strong className="font-bold">Aula ao vivo</strong>
            <span className="block text-ink-2">{aula.titulo}</span>
          </span>
        </li>
      </ol>

      {faltamDetalhes && emDesenvolvimento && (
        <p className="rounded-control border-2 border-dashed border-error p-3 text-md font-bold text-error">
          [HORÁRIO E TEMA DE CADA LIVE] em evento.ts
        </p>
      )}
    </div>
  );
}
