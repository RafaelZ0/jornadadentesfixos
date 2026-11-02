import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { evento } from "@/config/evento";

const FOTO = "/images/dr-pablo-hero.jpg";
const temFoto = existsSync(path.join(process.cwd(), "public", FOTO));
// Em produção, sem a foto, o espaço some: a página nunca vai ao ar com um buraco.
const mostrarFoto = temFoto || process.env.NODE_ENV !== "production";

export function Hero() {
  return (
    <>
      <p className="section-field bg-field px-(--gutter) py-2 text-center text-xs leading-[1.35] font-bold text-balance text-on-field uppercase">
        <span className="inline-block">Aula gratuita e ao vivo</span>
        <span className="hidden sm:inline"> · </span>{" "}
        <span className="inline-block">Terça, 24/11, às 19h30</span>
      </p>

      <section className="bg-paper pt-5 pb-10 md:pt-14 md:pb-20">
        <Container
          className={`grid grid-cols-[minmax(0,1fr)] gap-3 md:gap-x-16 md:gap-y-8 ${mostrarFoto ? "md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""}`}
        >
          <div className="flex flex-col gap-3 md:gap-6 md:self-end">
            <Heading nivel={1} tamanho="hero">
              {evento.promessa}
            </Heading>
            <Text className="md:text-lg md:leading-[1.5]">
              Na aula gratuita do {evento.responsavelTecnico.nome}, você vai
              entender, em linguagem simples, os 3 passos para trocar a dentadura
              por dentes fixos, sem medo e sem sair da região.
            </Text>
          </div>

          {mostrarFoto && (
            <figure className="relative m-0 aspect-[2/1] overflow-hidden rounded-card md:col-start-2 md:row-span-2 md:row-start-1 md:aspect-[4/5]">
              {temFoto ? (
                <Image
                  src={FOTO}
                  alt={`${evento.responsavelTecnico.nome} na clínica`}
                  fill
                  preload
                  sizes="(min-width: 768px) 460px, calc(100vw - 40px)"
                  className="object-cover object-[50%_25%]"
                />
              ) : (
                <div className="flex size-full items-center justify-center border-2 border-dashed border-edge bg-paper-2 p-4 text-center text-sm leading-[1.4] text-ink-2">
                  Foto do {evento.responsavelTecnico.nome} na clínica
                </div>
              )}
            </figure>
          )}

          <div className="flex flex-col gap-2 md:items-start md:self-start">
            <Button href="#inscricao">Quero assistir à aula gratuita</Button>
            <p className="text-center text-xs leading-[1.4] text-ink-2 md:text-left">
              O link da aula chega no seu WhatsApp.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
