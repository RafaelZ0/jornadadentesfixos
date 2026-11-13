import { useId, type ChangeEvent, type ComponentProps, type ReactNode } from "react";
import { formatarWhatsapp, somenteDigitos } from "@/lib/whatsapp";

/** Formata o WhatsApp enquanto a pessoa digita, sem pular o cursor. */
export function digitarWhatsapp(
  evento: ChangeEvent<HTMLInputElement>,
  atualizar: (valor: string) => void,
) {
  const campo = evento.target;
  const cursor = campo.selectionStart ?? campo.value.length;
  const digitosAntes = somenteDigitos(campo.value.slice(0, cursor)).length;
  const formatado = formatarWhatsapp(campo.value);

  atualizar(formatado);

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

/** Mensagem de erro logo abaixo do campo, com ícone para não depender só da cor. */
export function ErroCampo({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 text-sm leading-[1.4] font-bold text-error"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mt-px size-5 shrink-0 fill-current"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM13.1 6.5l-.35 6.5h-1.5l-.35-6.5h2.2Z" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export const estiloCampo =
  "min-h-14 w-full rounded-control border-2 border-edge bg-surface px-4 text-md text-ink transition-colors duration-(--dur-micro) ease-out placeholder:text-edge aria-invalid:border-error";

export function Campo({
  rotulo,
  erro,
  dica,
  ...props
}: ComponentProps<"input"> & {
  rotulo: string;
  erro?: string;
  /** Texto fixo abaixo do campo, como um exemplo de preenchimento. */
  dica?: string;
}) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;
  const descricao = [dica && idDica, erro && idErro].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-md leading-tight font-bold text-ink">
        {rotulo}
      </label>
      <input
        id={id}
        required
        aria-required={props.required === false ? undefined : true}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao || undefined}
        className={estiloCampo}
        {...props}
      />
      {dica && (
        <p id={idDica} className="text-sm leading-[1.4] text-ink-2">
          {dica}
        </p>
      )}
      {erro && <ErroCampo id={idErro}>{erro}</ErroCampo>}
    </div>
  );
}
