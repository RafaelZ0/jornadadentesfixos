# Planilha de inscritos: passo a passo

## 1. Colar o código

1. Crie uma planilha nova no Google Sheets.
2. No menu, abra **Extensões > Apps Script**.
3. Apague o conteúdo do arquivo `Código.gs` e cole todo o conteúdo de `google-apps-script/Code.gs`.
4. Clique em salvar.

## 2. Criar o segredo

1. Gere um texto longo e aleatório. No computador do projeto, este comando gera um:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. No Apps Script, clique em **Project Settings** (Configurações do projeto, a engrenagem à esquerda).
3. Em **Script Properties**, clique em **Add script property**.
4. Em **Property**, escreva `SHEETS_SECRET`. Em **Value**, cole o texto gerado.
5. Clique em **Save script properties**.

Use o mesmo texto na variável `SHEETS_SECRET` do `.env.local` e da Vercel. Não coloque esse texto em nenhum arquivo do projeto que vá para o git.

## 3. Rodar o setup()

1. Volte para o editor de código.
2. Na lista de funções, no topo, escolha `setup`.
3. Clique em **Run** (Executar).
4. Na primeira vez, o Google pede autorização. Escolha a sua conta e permita. Se aparecer um aviso de app não verificado, clique em **Advanced** (Avançado) e continue, porque o script é seu.
5. Confira a aba **Inscritos** na planilha: cabeçalho verde, primeira linha congelada, filtro e menu em "Status do contato".

## 4. Publicar como App da Web

1. No canto superior direito, clique em **Deploy > New deployment** (Implantar > Nova implantação).
2. Ao lado de "Select type", clique na engrenagem e escolha **Web app**.
3. Em **Execute as**, escolha **Me** (Eu).
4. Em **Who has access**, escolha **Anyone** (Qualquer pessoa). Quem chama é o servidor da Vercel, sem login no Google. O segredo é o que protege a gravação.
5. Clique em **Deploy** e copie a URL que termina em `/exec`.
6. Coloque essa URL na variável `GOOGLE_SHEETS_WEBHOOK_URL`.

## 5. Republicar sem mudar a URL

Alterar o código não muda o site até você publicar uma nova versão. **Não crie uma implantação nova**, porque ela gera outra URL.

1. Clique em **Deploy > Manage deployments** (Gerenciar implantações).
2. Selecione a implantação ativa e clique em **Edit** (o lápis).
3. Em **Version**, escolha **New version**.
4. Clique em **Deploy**.

## 6. Aba Vagas (pedidos de avaliação)

Depois de colar o `Code.gs` novo:

1. Rode o `setup()` de novo. Ele cria a aba **Vagas** sem mexer nos inscritos. O Google pede uma autorização nova, por causa do envio de e-mail: permita.
2. O `setup()` também muda duas configurações da planilha:
   - fuso horário para São Paulo;
   - recálculo **"Quando houver alterações e a cada minuto"**.
   Sem o recálculo a cada minuto, a cor vermelha de atraso só apareceria quando alguém editasse a planilha. Confira em **Arquivo > Configurações > Cálculo**.
3. Aviso por e-mail (opcional): em **Project Settings > Script Properties**, crie `AVISO_EMAIL` com o e-mail do comercial. Para desligar, apague a propriedade. A conta gratuita do Google envia até 100 e-mails por dia.
4. Republique sem mudar a URL (passo 5).

Como a aba Vagas funciona:

- Cada pedido entra na linha 2, logo abaixo do cabeçalho: o mais novo fica sempre no topo.
- **Vermelho:** status "Novo" há mais de 10 minutos. **Verde:** status "Agendado". A cor some quando a equipe troca o status.
- "Já era inscrito" procura o WhatsApp na aba Inscritos.
- "Ligar" e "Chamar no WhatsApp" são links. A mensagem do WhatsApp já vem escrita para o atendente.
- A coluna `event_id` fica escondida. Ela evita pedido duplicado quando o site tenta enviar de novo.
- Depois de 30/11 às 22h, os pedidos chegam com status "Lista de espera".

## Como a planilha se comporta

- WhatsApp repetido atualiza a mesma linha, inclusive a data/hora e a origem.
- "Status do contato" e "Observação" são da equipe: uma inscrição repetida não apaga o que foi escrito ali.
- Não mude o nome da aba nem a ordem das colunas sem ajustar o `Code.gs`.
- A planilha guarda dados pessoais. Compartilhe só com quem atende os inscritos.
