# Jornada dos Dentes Fixos

Site de captação da aula. Regras do projeto no `CLAUDE.md` e visual no `design.md`.

## Rastreamento (Google Tag Manager)

O Pixel da Meta no navegador roda só pelo GTM (`GTM-KLKXFHJ6`). O site não carrega o `fbevents.js`: ele envia eventos ao `dataLayer`, e cada um vira um acionador "Evento personalizado" no GTM.

| Evento no dataLayer | Quando acontece | Tag da Meta no GTM |
| --- | --- | --- |
| `gtm.js` (do próprio GTM) | Primeira página aberta | PageView, acionador "Todas as páginas" |
| `page_view_spa` | Troca de página sem recarregar (ex.: ida para /obrigado) | PageView |
| `view_content` | 10 s na página inicial | ViewContent |
| `video_play` | Toque no vídeo de convite | Personalizado `VideoPlay` |
| `replay_play` | Toque no vídeo do replay | Personalizado `ReplayPlay` |
| `lead_form_submit` | Chegada em /obrigado depois da inscrição | Lead, com `event_id` |
| `schedule_submit` | Pedido de vaga recebido em /vaga | Schedule, com `event_id` |
| `whatsapp_click` | "Chamar no WhatsApp" em /vaga | Contact |

O `event_id` de `lead_form_submit` e `schedule_submit` é o mesmo que o servidor manda pela API de Conversões. Ele precisa ir no campo Event ID da tag da Meta, senão a Meta conta cada conversão duas vezes.

Não use o acionador "Alteração no histórico" para o PageView: os botões que descem até o formulário (`#inscricao`) também mudam o histórico e contariam páginas que não existem.

## Consentimento de cookies

`NEXT_PUBLIC_PIXEL_REQUIRE_CONSENT` define como o rastreamento se comporta:

- `false` (padrão): o GTM carrega direto, e o aviso só informa.
- `true`: o GTM, os eventos do dataLayer e o Lead da API de Conversões só acontecem depois do "Entendi".

**Essa decisão é do jurídico.** Confirme antes de publicar e ajuste a variável na Vercel.

## Comandos

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
