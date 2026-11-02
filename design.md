# Design: Jornada dos Dentes Fixos

O sistema travado do projeto. Toda página e toda execução da hallmark leem este arquivo primeiro, e as páginas compartilham este sistema. Mude de propósito; o arquivo é a regra. Se algo aqui conflitar com o `CLAUDE.md`, o `CLAUDE.md` vence.

## Direção

- **Ideia:** um convite em letra grande. Cada tela se lê como uma carta do Dr. Pablo impressa em corpo grande para quem tem vista cansada: uma ideia por tela, com a calma de uma conversa no consultório.
- **Para quem:** pessoa de 55 a 75 anos, de dentadura ou com dentes perdidos, num Android pequeno, às vezes com internet fraca. Sente vergonha, medo de dor e acha que passou da idade.
- **O que deve sentir:** segurança, cuidado e esperança. Não tecnologia, nem luxo distante.
- **Assinatura:** a data real da aula composta em tamanho de manchete, como num convite. É o fato mais forte que a página tem.
- **Tom:** editorial, sóbrio e caloroso (vibe: "carta calma em letra grande").
- **Gênero e postura:** editorial, cor Comprometida: o verde-escuro da faixa de destaque dá o peso, e o terracota fica como sinal raro.

## Tokens

`src/app/tokens.css` é a fonte de verdade. Os papéis:

```css
--color-paper: #FBF7F0;      /* fundo creme */
--color-surface: #FFFFFF;    /* cartões e campos */
--color-ink: #1C1A17;        /* texto */
--color-ink-2: #4A443C;      /* texto secundário */
--color-accent: #8F3F1E;     /* destaque terracota: links, sublinhados, marcas pequenas */
--color-action: #0F7A3E;     /* botão principal */
--color-action-hover: #0B5F30;
--color-field: #23413A;      /* faixa de destaque */
--color-on-field: #FBF7F0;   /* texto sobre a faixa */
--color-edge: #7A6F60;       /* borda de campo */
--color-rule: #E3DACB;       /* fio decorativo, nunca borda de controle */
--color-error: #B3261E;
--font-display: Literata;    /* títulos, 600 */
--font-body: Atkinson Hyperlegible; /* corpo, 400 e 700 */
```

## Tipografia

| Papel | Celular | Desktop | Peso | Entrelinha |
| --- | --- | --- | --- | --- |
| Manchete (h1) | 40px | 64px | 600 | 1.12 |
| Seção (h2) | 32px | 44px | 600 | 1.18 |
| Título (h3) | 25px | 28px | 600 | 1.25 |
| Abertura | 22px | 24px | 400 | 1.5 |
| Corpo | 19px | 20px | 400 | 1.6 |
| Apoio (rodapé, legendas, ajuda de campo) | 17px | 17px | 400 | 1.5 |

- Nada abaixo de 16px. Apoio nunca usa cor mais clara que `--color-ink-2`.
- Títulos com um peso e uma cor só. Ênfase vem da quebra de linha, nunca de uma palavra colorida ou em itálico.
- Medida de leitura de 60 caracteres no máximo: frases curtas pedem linhas curtas.
- Data e hora em destaque usam Literata: a Atkinson corta o zero com um traço, o que atrapalha em "19h30".

## Espaço e superfícies

- Escala de 4 em 4: 8, 12, 16, 24, 40, 64, 96, 144px.
- Respiro de seção: 64px no celular, 112px no desktop. Margem lateral: 20px no celular, 40px no desktop. Container de 1120px, texto em 680px.
- Raios: 10px em controles, 16px em cartões e fotos.
- Sombra só uma, discreta, em cartões sobre o creme. Nunca borda e sombra juntas, nunca cartão dentro de cartão.

## Controles

- **Primário:** verde `--color-action`, texto branco, 60px de altura (mínimo do projeto: 56px), raio de 10px, largura total até 640px, caixa alta curta com verbo de ação.
- **Estados:** repouso, passar o dedo ou mouse, foco, toque, desabilitado, carregando e erro sempre desenhados. O foco é um anel de 3px, afastado do botão, em tinta sobre fundo claro e em creme sobre a faixa verde.
- **Um primário por tela.** Não há botão secundário preenchido.

## Movimento

- Calmo. Só um fade curto ao rolar, sem deslocamento perceptível, e nenhum sob `prefers-reduced-motion`.
- Sem carrossel, pop-up, parallax ou contador piscando. Conteúdo visível sem JavaScript.

## Fotos

- Fotos reais da clínica e do Dr. Pablo, grandes, com gente de verdade e luz natural. Nada de banco de imagens de sorriso branco, nada de antes e depois.

## Decisões registradas (hallmark x CLAUDE.md)

Visual aprovado pelo usuário em 02/11/2026 na página `/estilo`, com creme, terracota, Literata e Atkinson Hyperlegible. O `CLAUDE.md` vence nestes pontos:

- **Caixa alta no botão:** a hallmark proíbe rótulos em caixa alta; o projeto pede. Mantida só no botão.
- **Creme, serifa e terracota (portão 65):** é a combinação que a hallmark considera mais associada a sites feitos por IA. A paleta está fixada no `CLAUDE.md`. A Literata é uma serifa de baixo contraste e o terracota fica como sinal raro; o verde-escuro carrega o peso.
- **Tamanhos de botão:** 60px, acima dos 44 a 52px da hallmark.

## Exportações

`src/app/tokens.css`, com Tailwind v4 (`@theme static`) e utilitários como `bg-paper`, `text-ink`, `font-display`.
