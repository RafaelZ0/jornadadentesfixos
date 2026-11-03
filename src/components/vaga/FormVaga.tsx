"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Campo, digitarWhatsapp } from "@/components/ui/Campo";
import { evento } from "@/config/evento";
import { aceitouCookies } from "@/lib/consentimento";
import { mensagens } from "@/lib/mensagens";
import { lerOrigem } from "@/lib/origem";
import { enviarPedidoVaga } from "@/lib/vaga";
import { somenteDigitos, whatsappValido } from "@/lib/whatsapp";

type Valores = { nome: string; whatsapp: string; cidade: string; horario: string };
type Campo = keyof Valores;
type Erros = Partial<Record<Campo, string>>;

const CAMPOS: Campo[] = ["nome", "whatsapp", "cidade", "horario"];

function validar(campo: Campo, valores: Valores) {
  switch (campo) {
    case "nome":
      return valores.nome.trim().length < 2 ? mensagens.nome : undefined;
    case "whatsapp":
      if (!valores.whatsapp) return mensagens.whatsappVazio;
      return whatsappValido(valores.whatsapp) ? undefined : mensagens.whatsapp;
    case "cidade":
      return valores.cidade.trim().length < 2 ? mensagens.cidade : undefined;
    case "horario":
      return valores.horario ? undefined : mensagens.horario;
  }
}

type FormVagaProps = {
  rotuloBotao: string;
  aoConfirmar: (resultado: { eventId: string; listaDeEspera: boolean }) => void;
};

export function FormVaga({ rotuloBotao, aoConfirmar }: FormVagaProps) {
  const idCidades = useId();
  const idHorario = useId();
  const travado = useRef(false);

  const [valores, setValores] = useState<Valores>({
    nome: "",
    whatsapp: "",
    cidade: "",
    horario: "",
  });
  const [erros, setErros] = useState<Erros>({});
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  function atualizar(campo: Campo, valor: string) {
    const novos = { ...valores, [campo]: valor };
    setValores(novos);
    if (tocados[campo] || erros[campo]) {
      setErros((atuais) => ({ ...atuais, [campo]: validar(campo, novos) }));
    }
  }

  function aoSair(campo: Campo) {
    setTocados((atuais) => ({ ...atuais, [campo]: true }));
    setErros((atuais) => ({ ...atuais, [campo]: validar(campo, valores) }));
  }

  function focar(formulario: HTMLFormElement, campo: Campo) {
    const alvo = formulario.elements.namedItem(campo);
    // O horário é um grupo de opções: o foco vai para a primeira.
    const elemento = alvo instanceof RadioNodeList ? alvo[0] : alvo;
    (elemento as HTMLElement | null)?.focus();
  }

  function liberar() {
    travado.current = false;
    setEnviando(false);
  }

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (travado.current) return;

    const formulario = e.currentTarget;
    const novosErros: Erros = {};
    for (const campo of CAMPOS) novosErros[campo] = validar(campo, valores);
    setErros(novosErros);

    const primeiroInvalido = CAMPOS.find((campo) => novosErros[campo]);
    if (primeiroInvalido) {
      focar(formulario, primeiroInvalido);
      return;
    }

    travado.current = true;
    setEnviando(true);
    setErroEnvio(false);

    const robo = formulario.elements.namedItem("site") as HTMLInputElement;

    try {
      const resultado = await enviarPedidoVaga({
        ...lerOrigem(),
        nome: valores.nome.trim(),
        whatsapp: somenteDigitos(valores.whatsapp),
        cidade: valores.cidade.trim(),
        horario: valores.horario,
        site: robo.value,
        cookies_aceitos: aceitouCookies(),
      });

      if (resultado.ok) {
        aoConfirmar(resultado);
        return;
      }

      liberar();
      if (resultado.erros) {
        setErros(resultado.erros);
        const invalido = CAMPOS.find((campo) => resultado.erros?.[campo]);
        if (invalido) focar(formulario, invalido);
      } else {
        setErroEnvio(true);
      }
    } catch {
      liberar();
      setErroEnvio(true);
    }
  }

  return (
    <form noValidate onSubmit={aoEnviar} className="relative flex flex-col gap-5">
      <Campo
        rotulo="Nome"
        name="nome"
        type="text"
        autoComplete="name"
        placeholder="Seu nome"
        value={valores.nome}
        erro={erros.nome}
        onChange={(e) => atualizar("nome", e.target.value)}
        onBlur={() => aoSair("nome")}
      />
      <Campo
        rotulo="WhatsApp com DDD"
        name="whatsapp"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(28) 99999-9999"
        value={valores.whatsapp}
        erro={erros.whatsapp}
        onChange={(e) => digitarWhatsapp(e, (valor) => atualizar("whatsapp", valor))}
        onBlur={() => aoSair("whatsapp")}
      />
      <Campo
        rotulo="Cidade"
        name="cidade"
        type="text"
        autoComplete="address-level2"
        list={idCidades}
        value={valores.cidade}
        erro={erros.cidade}
        onChange={(e) => atualizar("cidade", e.target.value)}
        onBlur={() => aoSair("cidade")}
      />
      <datalist id={idCidades}>
        {evento.cidadesDaRegiao.map((cidade) => (
          <option key={cidade} value={cidade} />
        ))}
      </datalist>

      <fieldset
        aria-describedby={erros.horario ? `${idHorario}-erro` : undefined}
        className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0"
      >
        <legend className="mb-2 p-0 text-md leading-tight font-bold text-ink">
          Melhor horário para ligarmos
        </legend>
        <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2">
          {evento.vaga.horarios.map((horario) => (
            <label
              key={horario}
              className={`flex min-h-14 cursor-pointer items-center justify-center rounded-control border-2 bg-surface px-2 text-center text-md font-bold text-ink transition-colors duration-(--dur-micro) ease-out hover:border-ink has-checked:border-field has-checked:bg-field has-checked:text-on-field has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-focus ${erros.horario ? "border-error" : "border-edge"}`}
            >
              <input
                type="radio"
                name="horario"
                value={horario}
                required
                checked={valores.horario === horario}
                onChange={() => atualizar("horario", horario)}
                className="sr-only"
              />
              {horario}
            </label>
          ))}
        </div>
        {erros.horario && (
          <p id={`${idHorario}-erro`} className="text-sm leading-[1.4] font-bold text-error">
            {erros.horario}
          </p>
        )}
      </fieldset>

      {/* Campo isca: pessoas não veem, robôs preenchem. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <input type="text" name="site" aria-label="Site" tabIndex={-1} autoComplete="off" />
      </div>

      <Button
        type="submit"
        loading={enviando}
        className="mt-1 min-h-20! px-4! text-lg! sm:w-full!"
      >
        {rotuloBotao}
      </Button>

      <p className="text-sm leading-[1.5] text-ink">
        Usamos seus dados só para falar com você sobre a avaliação. Veja a{" "}
        <a
          href={evento.rotas.privacidade}
          target="_blank"
          rel="noopener"
          className="font-bold text-accent underline underline-offset-4"
        >
          Política de Privacidade
        </a>
        .
      </p>

      {erroEnvio && (
        <p role="alert" className="text-md leading-[1.5] font-bold text-error">
          Não conseguimos enviar agora. Tente de novo ou chame a gente no
          WhatsApp, logo abaixo.
        </p>
      )}
    </form>
  );
}
