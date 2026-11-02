import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { evento } from "@/config/evento";

const { clinica, responsavelTecnico, rotas } = evento;
const { endereco } = clinica;

const linkLegal =
  "inline-flex min-h-11 items-center text-ink underline underline-offset-4 hover:text-accent";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper-2 py-10 text-sm leading-[1.5] text-ink-2 md:py-14">
      <Container className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-(--gap-columns)">
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg leading-[1.3] font-semibold text-ink">
            {clinica.nome}
          </p>
          <p>
            Responsável técnico: {responsavelTecnico.nome},{" "}
            {responsavelTecnico.cro}
          </p>
          <p>
            {clinica.razaoSocial}, CNPJ {clinica.cnpj}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <address className="not-italic">
            {endereco.logradouro}
            <br />
            {endereco.bairro}
            <br />
            {endereco.cidade} - {endereco.uf}, CEP {endereco.cep}
          </address>
          <nav aria-label="Documentos legais" className="flex gap-6">
            <Link href={rotas.termos} className={linkLegal}>
              Termos de uso
            </Link>
            <Link href={rotas.privacidade} className={linkLegal}>
              Privacidade
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
