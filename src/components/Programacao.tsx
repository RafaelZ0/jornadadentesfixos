import { evento } from "@/config/evento";
import { diaDaAula, horaDaAula, porExtenso } from "@/lib/datas";

const { livesAquecimento, aula } = evento;

// Meio-dia: a data não muda de dia por causa do fuso.
const lives = livesAquecimento.map((live) => ({
  ...live,
  quando: porExtenso(`${live.data}T12:00:00-03:00`),
}));

const faltamDetalhes = lives.some((live) => !live.hora || !live.tema);

/** Datas das lives de aquecimento e da aula, como no lançamento semente. */
export function Programacao() {
  const emDesenvolvimento = process.env.NODE_ENV !== "production";

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col">
        {lives.map((live, indice) => (
          <li
            key={live.data}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[8.5rem_minmax(0,1fr)] border-t border-rule py-3"
          >
            <span className="font-display text-lg leading-[1.35] font-semibold whitespace-nowrap text-ink">
              {live.quando.dia.slice(0, 3)}, {live.quando.data}
            </span>
            <span className="text-md leading-[1.5] text-ink">
              Live {indice + 1} no {aula.plataforma}
              {live.hora && `, às ${live.hora}`}
              {live.tema && (
                <span className="block text-ink-2">{live.tema}</span>
              )}
            </span>
          </li>
        ))}
        <li className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[8.5rem_minmax(0,1fr)] border-t-2 border-b-2 border-ink py-4">
          <span className="font-display text-lg leading-[1.35] font-semibold whitespace-nowrap text-ink">
            {diaDaAula.slice(0, 3)}, {porExtenso(aula.inicio).data}
          </span>
          <span className="text-md leading-[1.5] text-ink">
            <strong className="font-bold">Aula ao vivo, às {horaDaAula}</strong>
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
