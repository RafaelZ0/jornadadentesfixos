import { IconeWhatsapp } from "@/components/IconeWhatsapp";
import { Button } from "@/components/ui/Button";
import { evento } from "@/config/evento";

export function BotaoGrupo() {
  const { grupoUrl } = evento.whatsapp;

  return (
    <Button
      href={grupoUrl || undefined}
      disabled={!grupoUrl}
      className="min-h-20! px-4! text-lg! sm:w-full!"
    >
      <IconeWhatsapp />
      Entrar no grupo da Jornada
    </Button>
  );
}
