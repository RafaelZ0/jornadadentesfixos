import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

const FOTO = "/images/dr-pablo-hero.jpg";
const temFoto = existsSync(path.join(process.cwd(), "public", FOTO));
// Em produção, sem a foto, o espaço some: a página nunca vai ao ar com um buraco.
const mostrarFoto = temFoto || process.env.NODE_ENV !== "production";

// O formulário fica na primeira tela, como pede o lançamento semente: ninguém precisa rolar para se inscrever.
export function Hero() {
  return (
    <>
      <p className="section-field bg-field px-(--gutter) py-2 text-center text-xs leading-[1.35] font-bold text-balance text-on-field uppercase">
        <span className="inline-block">Aula gratuita e ao vivo</span>
        <span className="hidden sm:inline"> · </span>{" "}
        <span className="inline-block">Terça, 24/11, às 19h30</span>
      </p>

      <section id="inscricao" className="bg-paper pt-4 pb-10 md:pt-12 md:pb-16">
        <Container className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-x-14 md:gap-y-8">
          <div className="flex flex-col gap-3 md:gap-5">
            <Heading nivel={1} tamanho="hero">
              {evento.promessa}
            </Heading>
            <Text className="md:text-lg md:leading-[1.5]">
              Na aula gratuita, o {evento.responsavelTecnico.nome} explica os 3
              passos para trocar a dentadura por dentes fixos.
            </Text>
          </div>

          <div className="surface-card rounded-card border border-edge bg-surface p-4 md:col-start-2 md:row-span-2 md:row-start-1 md:self-start md:p-7">
            <LeadForm />
          </div>

          {mostrarFoto && (
            <figure className="relative m-0 aspect-[2/1] overflow-hidden rounded-card md:aspect-[16/9]">
              {temFoto ? (
                <Image
                  src={FOTO}
                  alt={`${evento.responsavelTecnico.nome} na clínica`}
                  fill
                  preload
                  sizes="(min-width: 768px) 640px, calc(100vw - 40px)"
                  className="object-cover object-[50%_8%]"
                />
              ) : (
                <div className="flex size-full items-center justify-center border-2 border-dashed border-edge bg-paper-2 p-4 text-center text-sm leading-[1.4] text-ink-2">
                  Foto do {evento.responsavelTecnico.nome} na clínica
                </div>
              )}
            </figure>
          )}
        </Container>
      </section>
    </>
  );
}
