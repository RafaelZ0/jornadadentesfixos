import { evento } from "@/config/evento";

// Cartão de contato da clínica: no celular, abre a tela de salvar contato.
export function GET() {
  const { clinicaE164 } = evento.whatsapp;
  const cartao = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${evento.clinica.nome}`,
    `ORG:${evento.clinica.nome}`,
    `TEL;TYPE=CELL,VOICE:+${clinicaE164}`,
    "END:VCARD",
    "",
  ].join("\r\n");

  return new Response(cartao, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="clinica-dr-pablo-santos.vcf"',
    },
  });
}
