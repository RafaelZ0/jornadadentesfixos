import type { ReactNode } from "react";
import { LeadForm } from "@/components/LeadForm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function SecaoInscricao({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <Section id={id} fundo="destaque">
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:items-center md:gap-16">
        <div>{children}</div>
        <div className="surface-card rounded-card bg-surface p-5 md:p-8">
          <LeadForm />
        </div>
      </Container>
    </Section>
  );
}
