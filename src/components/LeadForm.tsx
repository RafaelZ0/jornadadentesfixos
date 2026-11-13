"use client";

import { useRouter } from "next/navigation";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { Campo, digitarWhatsapp } from "@/components/ui/Campo";
import { evento } from "@/config/evento";
import { aceitouCookies } from "@/lib/consentimento";
import { enviarInscricao } from "@/lib/inscricao";
import { mensagens } from "@/lib/mensagens";
import { lerOrigem } from "@/lib/origem";
import { guardarPrimeiroNome } from "@/lib/primeiro-nome";
import { somenteDigitos, whatsappValido } from "@/lib/whatsapp";

type Valores = {
  nome: string;
  whatsapp: string;
  /** Opcional. */
  cidade: string;
};

type Campo = keyof Valores;
type Erros = Partial<Record<Campo, string>>;

const CAMPOS: Campo[] = ["nome", "whatsapp", "cidade"];

function validar(campo: Campo, valores: Valores) {
  switch (campo) {
    case "nome":
      return valores.nome.trim().length < 2 ? mensagens.nome : undefined;
    case "whatsapp":
      if (!valores.whatsapp) return mensagens.whatsappVazio;
      return whatsappValido(valores.whatsapp) ? undefined : mensagens.whatsapp;
    case "cidade":
      return undefined;
  }
}

const semMudancas = () => () => {};

// A rota de inscrição devolve para /?inscricao=erro quando o envio sem JavaScript não passa.
const voltouComErro = () =>
  new URLSearchParams(window.location.search).get("inscricao") === "erro";

type LeadFormProps = {
  /** Frase acima dos campos, como "Preencha para receber o link da aula". */
  chamada?: string;
  /** Formulário do topo: é ele que mostra o erro de um envio sem JavaScript. */
  principal?: boolean;
};

export function LeadForm({ chamada, principal = false }: LeadFormProps) {
  const router = useRouter();
  const retornoComErro = useSyncExternalStore(
    semMudancas,
    () => principal && voltouComErro(),
    () => false,
  );
  const idCidades = useId();
  const idAceite = useId();
  const travado = useRef(false);

  const [valores, setValores] = useState<Valores>({
    nome: "",
    whatsapp: "",
    cidade: "",
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
    digitarWhatsapp(evento, (valor) => atualizar("whatsapp", valor));
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
    // Com JavaScript, o aoEnviar cuida de tudo. Antes de ele carregar, o navegador manda por POST para a
    // mesma rota, que redireciona para /obrigado. Nome e telefone vão no corpo, nunca na URL.
    <form
      data-lead-form
      noValidate
      action="/api/inscricao"
      method="post"
      onSubmit={aoEnviar}
      className="relative flex flex-col gap-5"
    >
      {chamada && (
        <h2 className="font-display text-title leading-[1.25] font-semibold text-ink">
          {chamada}
        </h2>
      )}
      <Campo
        rotulo="Seu nome"
        name="nome"
        type="text"
        autoComplete="name"
        value={valores.nome}
        erro={erros.nome}
        onChange={(e) => atualizar("nome", e.target.value)}
        onBlur={() => aoSair("nome")}
      />
      <Campo
        rotulo="Seu WhatsApp com DDD"
        name="whatsapp"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        dica="Exemplo: (28) 99999-0000"
        value={valores.whatsapp}
        erro={erros.whatsapp}
        onChange={aoDigitarWhatsapp}
        onBlur={() => aoSair("whatsapp")}
      />
      <Campo
        rotulo="Sua cidade (opcional)"
        name="cidade"
        type="text"
        required={false}
        maxLength={120}
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

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          loading={enviando}
          aria-describedby={idAceite}
          className="sm:w-full!"
        >
          Quero receber o link no WhatsApp
        </Button>
        <p className="text-center text-sm leading-[1.4] text-ink-2">
          É gratuito e sem compromisso. Não pedimos pagamento.
        </p>
        {/* O aceite: quem envia o formulário concorda com este texto. A API grava o registro na planilha. */}
        <p id={idAceite} className="text-center text-xs leading-[1.5] text-balance text-ink-2">
          Ao se inscrever, você concorda em receber as informações da aula
          pelo WhatsApp e com a nossa{" "}
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
      </div>

      {(erroEnvio || (retornoComErro && !enviando)) && (
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
