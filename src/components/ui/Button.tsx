import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  loading?: boolean;
  loadingLabel?: string;
  href?: string;
  /** Roda quando o link (com href) é tocado, antes de a página mudar. */
  aoAbrirLink?: () => void;
  /** Abre o link em outra aba, para a página continuar viva e terminar de enviar o evento. */
  novaAba?: boolean;
  /** Só para a página /estilo: congela um estado para ele poder ser visto. */
  demo?: "hover" | "focus" | "active";
  children: ReactNode;
};

const base =
  "inline-flex min-h-15 w-full items-center justify-center gap-3 rounded-control px-5 py-3 text-center font-body text-md leading-tight font-bold tracking-wide uppercase no-underline transition-colors duration-(--dur-micro) ease-out focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus sm:w-auto";

const ativo =
  "cursor-pointer bg-action text-on-action hover:bg-action-hover active:translate-y-px active:bg-action-hover";

const carregando = "cursor-progress bg-action text-on-action";

const desabilitado = "cursor-not-allowed bg-paper-3 text-ink-2";

const demos = {
  hover: "bg-action-hover!",
  focus: "outline-3 outline-offset-3 outline-focus",
  active: "translate-y-px bg-action-hover!",
};

export function Button({
  loading = false,
  loadingLabel = "Enviando...",
  disabled = false,
  href,
  aoAbrirLink,
  novaAba = false,
  demo,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const estado = loading ? carregando : disabled ? desabilitado : ativo;
  const classes = [base, estado, demo ? demos[demo] : "", className].join(" ");

  if (href && !disabled && !loading) {
    return (
      <a
        href={href}
        onClick={aoAbrirLink}
        target={novaAba ? "_blank" : undefined}
        rel={novaAba ? "noopener" : undefined}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="keep-motion size-5 shrink-0 animate-spin rounded-full border-3 border-current border-t-transparent"
          />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
