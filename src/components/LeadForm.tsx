"use client";

import { useRouter } from "next/navigation";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { evento } from "@/config/evento";
import { aceitouCookies } from "@/lib/consentimento";
import { enviarInscricao } from "@/lib/inscricao";
import { mensagens } from "@/lib/mensagens";
import { lerOrigem } from "@/lib/origem";
import { guardarPrimeiroNome } from "@/lib/primeiro-nome";
import {
  formatarWhatsapp,
  somenteDigitos,
  whatsappValido,
} from "@/lib/whatsapp";

type Valores = {
  nome: string;
  whatsapp: string;
  cidade: string;
  consentimento: boolean;
};

type Campo = keyof Valores;
type Erros = Partial<Record<Campo, string>>;

const CAMPOS: Campo[] = ["nome", "whatsapp", "cidade", "consentimento"];

function validar(campo: Campo, valores: Valores) {
  switch (campo) {
    case "nome":
      return valores.nome.trim().length < 2 ? mensagens.nome : undefined;
    case "whatsapp":
      if (!valores.whatsapp) return mensagens.whatsappVazio;
      return whatsappValido(valores.whatsapp) ? undefined : mensagens.whatsapp;
    case "cidade":
      return valores.cidade.trim().length < 2 ? mensagens.cidade : undefined;
    case "consentimento":
      return valores.consentimento ? undefined : mensagens.consentimento;
  }
}

const estiloCampo =
  "min-h-14 w-full rounded-control border-2 border-edge bg-surface px-4 text-md text-ink transition-colors duration-(--dur-micro) ease-out placeholder:text-edge aria-invalid:border-error";

function Campo({
  rotulo,
  erro,
  ...props
}: ComponentProps<"input"> & { rotulo: string; erro?: string }) {
  const id = useId();
  const idErro = `${id}-erro`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-md leading-tight font-bold text-ink">
        {rotulo}
      </label>
      <input
        id={id}
        required
        aria-required="true"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={estiloCampo}
        {...props}
      />
      {erro && (
        <p id={idErro} className="text-sm leading-[1.4] font-bold text-error">
          {erro}
        </p>
      )}
    </div>
  );
}

export function LeadForm() {
  const router = useRouter();
  const idCidades = useId();
  const idConsentimento = useId();
  const travado = useRef(false);

  const [valores, setValores] = useState<Valores>({
    nome: "",
    whatsapp: "",
    cidade: "",
    consentimento: false,
  });
  const [erros, setErros] = useState<Erros>({});
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  function atualizar<C extends Campo>(campo: C, valor: Valores[C]) {
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

  function aoDigitarWhatsapp(evento: ChangeEvent<HTMLInputElement>) {
    const campo = evento.target;
    const cursor = campo.selectionStart ?? campo.value.length;
    const digitosAntes = somenteDigitos(campo.value.slice(0, cursor)).length;
    const formatado = formatarWhatsapp(campo.value);

    atualizar("whatsapp", formatado);

    // Mantém o cursor no lugar quando a pessoa corrige um dígito no meio do número.
    requestAnimationFrame(() => {
      let posicao = 0;
      let contados = 0;
      while (posicao < formatado.length && contados < digitosAntes) {
        if (/\d/.test(formatado[posicao])) contados += 1;
        posicao += 1;
      }
      campo.setSelectionRange(posicao, posicao);
    });
  }

  function liberar() {
    travado.current = false;
    setEnviando(false);
  }

  function focar(formulario: HTMLFormElement, campo: Campo) {
    (formulario.elements.namedItem(campo) as HTMLInputElement).focus();
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
      const resultado = await enviarInscricao({
        ...lerOrigem(),
        nome: valores.nome.trim(),
        whatsapp: somenteDigitos(valores.whatsapp),
        cidade: valores.cidade.trim(),
        consentimento: true,
        site: robo.value,
        cookies_aceitos: aceitouCookies(),
      });

      if (resultado.ok) {
        guardarPrimeiroNome(valores.nome);
        router.push(`/obrigado?eid=${encodeURIComponent(resultado.eventId)}`);
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
    <form
      data-lead-form
      noValidate
      onSubmit={aoEnviar}
      className="relative flex flex-col gap-5"
    >
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
        onChange={aoDigitarWhatsapp}
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

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input
            id={idConsentimento}
            name="consentimento"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={erros.consentimento ? true : undefined}
            aria-describedby={
              erros.consentimento ? `${idConsentimento}-erro` : undefined
            }
            checked={valores.consentimento}
            onChange={(e) => atualizar("consentimento", e.target.checked)}
            className="mt-0.5 size-8 shrink-0 cursor-pointer accent-action"
          />
          <label
            htmlFor={idConsentimento}
            className="cursor-pointer text-sm leading-[1.5] text-ink"
          >
            Aceito receber as informações da aula pelo WhatsApp e li a{" "}
            <a
              href={evento.rotas.privacidade}
              target="_blank"
              rel="noopener"
              className="font-bold text-accent underline underline-offset-4"
            >
              Política de Privacidade
            </a>
          </label>
        </div>
        {erros.consentimento && (
          <p
            id={`${idConsentimento}-erro`}
            className="text-sm leading-[1.4] font-bold text-error"
          >
            {erros.consentimento}
          </p>
        )}
      </div>

      {/* Campo isca: pessoas não veem, robôs preenchem. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <input
          type="text"
          name="site"
          aria-label="Site"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" loading={enviando} className="sm:w-full!">
        Quero me inscrever
      </Button>

      {erroEnvio && (
        <p role="alert" className="text-sm leading-[1.4] font-bold text-error">
          Não conseguimos enviar. Confira seu WhatsApp e tente de novo.{" "}
          <a
            href={`https://wa.me/${evento.whatsapp.clinicaE164}`}
            target="_blank"
            rel="noopener"
            className="text-accent underline underline-offset-4"
          >
            Falar com a clínica no WhatsApp
          </a>
        </p>
      )}
    </form>
  );
}
