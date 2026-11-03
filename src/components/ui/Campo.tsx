import { useId, type ChangeEvent, type ComponentProps } from "react";
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

export const estiloCampo =
  "min-h-14 w-full rounded-control border-2 border-edge bg-surface px-4 text-md text-ink transition-colors duration-(--dur-micro) ease-out placeholder:text-edge aria-invalid:border-error";

export function Campo({
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
