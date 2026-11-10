import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { BarraTopo } from "@/components/BarraTopo";
import { LeadForm } from "@/components/LeadForm";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";
import { horaDaVisita } from "@/lib/replay";

const FOTO = "/images/dr-pablo-hero.jpg";
const temFoto = existsSync(path.join(process.cwd(), "public", FOTO));
// Em produção, sem a foto, o espaço some: a página nunca vai ao ar com um buraco.
const mostrarFoto = temFoto || process.env.NODE_ENV !== "production";

const { nome } = evento.responsavelTecnico;

// A data muda a cada visita; o resto da página continua estático.
async function BarraDaVisita() {
  await connection();
  return <BarraTopo agoraServidor={horaDaVisita()} />;
}

// Reserva a mesma altura da barra para a página não pular quando ela chega.
function BarraReservada() {
  return (
    <p
      aria-hidden="true"
      className="section-field bg-field px-(--gutter) py-2 text-xs leading-[1.35]"
    >
      &nbsp;
    </p>
  );
}

// O formulário fica na primeira tela, como pede o lançamento semente: ninguém precisa rolar para se inscrever.
export function Hero() {
  return (
    <>
      <Suspense fallback={<BarraReservada />}>
        <BarraDaVisita />
      </Suspense>

      <section id="inscricao" className="bg-paper pt-4 pb-10 md:pt-12 md:pb-16">
        <Container className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-x-14 md:gap-y-8">
          <div className="flex flex-col gap-3 md:gap-5">
            <Heading
              nivel={1}
              tamanho="secao"
              className="md:text-display md:leading-[1.12]"
            >
              Usa dentadura? Descubra se você pode ter dentes fixos, mesmo com
              pouco osso ou mais de 60 anos
            </Heading>
            <Text className="md:text-lg md:leading-[1.5]">
              Aula gratuita e ao vivo com o {nome}. Sem compromisso. O link
              chega no seu WhatsApp.
            </Text>
          </div>

          {temFoto && (
            <div className="flex items-center gap-3 border-y border-edge py-3 md:hidden">
              <Image
                src={FOTO}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-full object-cover object-[50%_12%]"
              />
              {/* Cada item fica inteiro na linha: o ponto nunca começa uma linha sozinho. */}
              <p className="text-sm leading-[1.4] text-ink">
                <span className="block font-bold">{nome}</span>
                <span className="sr-only"> · </span>
                <span className="whitespace-nowrap">15+ anos ·</span>{" "}
                <span className="whitespace-nowrap">8.000+ casos ·</span>{" "}
                <span className="whitespace-nowrap">Cachoeiro de Itapemirim</span>
              </p>
            </div>
          )}

          <div className="surface-card rounded-card border border-edge bg-surface p-4 md:col-start-2 md:row-span-2 md:row-start-1 md:self-start md:p-7">
            <LeadForm />
          </div>

          {mostrarFoto && (
            <figure className="relative m-0 aspect-[2/1] overflow-hidden rounded-card md:aspect-[16/9]">
              {temFoto ? (
                <Image
                  src={FOTO}
                  alt={`${nome} na clínica`}
                  fill
                  preload
                  sizes="(min-width: 768px) 640px, calc(100vw - 40px)"
                  className="object-cover object-[50%_8%]"
                />
              ) : (
                <div className="flex size-full items-center justify-center border-2 border-dashed border-edge bg-paper-2 p-4 text-center text-sm leading-[1.4] text-ink-2">
                  Foto do {nome} na clínica
                </div>
              )}
            </figure>
          )}
        </Container>
      </section>
    </>
  );
}
