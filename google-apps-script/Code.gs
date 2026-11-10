// Recebe as inscrições do site (aba "Inscritos") e os pedidos de vaga (aba "Vagas").
// Passo a passo em google-apps-script/LEIA-ME.md.
// O segredo fica em Propriedades do script (SHEETS_SECRET), nunca neste arquivo.
// Aviso por e-mail dos pedidos de vaga: propriedade AVISO_EMAIL com o endereço. Vazia, não envia.

var ABA = 'Inscritos';
var FUSO = 'America/Sao_Paulo';
var LINHAS_DA_ABA = 5000;
var ESPERA_DA_TRAVA_MS = 7000;

var COLUNAS = [
  'Data/hora',
  'Nome',
  'WhatsApp',
  'Cidade',
  'Origem',
  'Mídia',
  'Campanha',
  'Conteúdo',
  'Termo',
  'fbclid',
  'Página',
  'Consentimento',
  'event_id',
  'Status do contato',
  'Observação',
];

var COLUNA_WHATSAPP = COLUNAS.indexOf('WhatsApp') + 1;
var COLUNA_STATUS = COLUNAS.indexOf('Status do contato') + 1;
var STATUS = ['Novo', 'Em contato', 'Sem resposta', 'Não quer'];

var ABA_VAGAS = 'Vagas';
var COLUNAS_VAGAS = [
  'Data/hora',
  'Nome',
  'WhatsApp',
  'Cidade',
  'Melhor horário',
  'Já era inscrito',
  'Status',
  'Atendido por',
  'Data da avaliação',
  'Observação',
  'Ligar',
  'Chamar no WhatsApp',
  'event_id',
];
var STATUS_VAGAS = ['Novo', 'Em contato', 'Agendado', 'Sem resposta', 'Não quer', 'Lista de espera'];
var VAGA_STATUS = COLUNAS_VAGAS.indexOf('Status') + 1;
var VAGA_DATA_AVALIACAO = COLUNAS_VAGAS.indexOf('Data da avaliação') + 1;
var VAGA_EVENT_ID = COLUNAS_VAGAS.indexOf('event_id') + 1;
var MINUTOS_DE_ATRASO = 10;

function doPost(e) {
  var trava = LockService.getScriptLock();
  var comTrava = false;
  var avisar = null;

  try {
    var dados = JSON.parse(e.postData.contents);

    if (!segredoValido_(dados.segredo)) {
      return responder_(false, 'nao_autorizado');
    }
    if (!dados.whatsapp || !dados.nome) {
      return responder_(false, 'dados_invalidos');
    }

    comTrava = trava.tryLock(ESPERA_DA_TRAVA_MS);
    if (!comTrava) return responder_(false, 'planilha_ocupada');

    var planilha = SpreadsheetApp.getActiveSpreadsheet();

    if (dados.tipo === 'vaga') {
      var vagas = planilha.getSheetByName(ABA_VAGAS);
      if (!vagas) return responder_(false, 'aba_ausente');
      if (gravarVaga_(vagas, planilha.getSheetByName(ABA), dados)) avisar = dados;
    } else {
      var aba = planilha.getSheetByName(ABA);
      if (!aba) return responder_(false, 'aba_ausente');
      gravar_(aba, dados);
    }

    SpreadsheetApp.flush();
  } catch (erro) {
    console.error(erro);
    return responder_(false, 'erro_interno');
  } finally {
    if (comTrava) trava.releaseLock();
  }

  // Depois de soltar a trava: o e-mail não segura os outros pedidos. Se falhar, o pedido já está salvo.
  if (avisar) avisarPorEmail_(avisar);
  return responder_(true);
}

function doGet() {
  return responder_(false, 'metodo_invalido');
}

// Rode pelo editor para preparar a planilha. Pode ser repetida sem perder dados.
function setup() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);

  if (aba.getMaxRows() < LINHAS_DA_ABA) {
    aba.insertRowsAfter(aba.getMaxRows(), LINHAS_DA_ABA - aba.getMaxRows());
  }

  aba
    .getRange(1, 1, 1, COLUNAS.length)
    .setValues([COLUNAS])
    .setFontWeight('bold')
    .setBackground('#23413a')
    .setFontColor('#fbf7f0');
  aba.setFrozenRows(1);

  var dados = aba.getRange(2, 1, LINHAS_DA_ABA - 1, COLUNAS.length);
  dados.setNumberFormat('@');
  aba
    .getRange(2, COLUNA_STATUS, LINHAS_DA_ABA - 1, 1)
    .setDataValidation(regraDeStatus_());

  if (!aba.getFilter()) {
    aba.getRange(1, 1, LINHAS_DA_ABA, COLUNAS.length).createFilter();
  }
  aba.autoResizeColumns(1, COLUNAS.length);

  setupVagas_(planilha);
}

function setupVagas_(planilha) {
  var aba = planilha.getSheetByName(ABA_VAGAS) || planilha.insertSheet(ABA_VAGAS);
  var total = COLUNAS_VAGAS.length;

  // A cor de atraso usa AGORA(): sem recálculo a cada minuto, ela só muda quando alguém edita.
  planilha.setSpreadsheetTimeZone(FUSO);
  planilha.setRecalculationInterval(SpreadsheetApp.RecalculationInterval.ON_CHANGE_AND_MINUTE);

  aba
    .getRange(1, 1, 1, total)
    .setValues([COLUNAS_VAGAS])
    .setFontWeight('bold')
    .setBackground('#23413a')
    .setFontColor('#fbf7f0');
  aba.setFrozenRows(1);
  aba.hideColumns(VAGA_EVENT_ID);

  var linhas = aba.getMaxRows() - 1;
  if (linhas > 0) {
    formatarLinhasDeVaga_(aba.getRange(2, 1, linhas, total));
  }

  // Colunas inteiras: pedidos novos entram na linha 2 e continuam cobertos pelas regras.
  var tudo = aba.getRange(1, 1, aba.getMaxRows(), total);
  // Multiplicação no lugar de AND(): não depende do separador (vírgula ou ponto e vírgula) da planilha.
  var atrasado = '=($G1="Novo")*(NOW()-$A1>' + MINUTOS_DE_ATRASO + '/1440)';
  aba.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(atrasado)
      .setBackground('#f6d5d2')
      .setFontColor('#7a1a14')
      .setRanges([tudo])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$G1="Agendado"')
      .setBackground('#d3eadb')
      .setFontColor('#0b4a26')
      .setRanges([tudo])
      .build(),
  ]);

  if (!aba.getFilter()) tudo.createFilter();
  aba.autoResizeColumns(1, total);
}

function formatarLinhasDeVaga_(intervalo) {
  var aba = intervalo.getSheet();
  var inicio = intervalo.getRow();
  var quantas = intervalo.getNumRows();

  intervalo.setNumberFormat('@');
  aba.getRange(inicio, 1, quantas, 1).setNumberFormat('dd/MM/yyyy HH:mm');
  aba.getRange(inicio, VAGA_DATA_AVALIACAO, quantas, 1).setNumberFormat('dd/MM/yyyy');
  aba.getRange(inicio, VAGA_STATUS, quantas, 1).setDataValidation(regraDeStatusVaga_());
}

function gravar_(aba, d) {
  var whatsapp = String(d.whatsapp).replace(/\D/g, '');
  var linha = encontrarLinha_(aba, whatsapp);
  var nova = !linha;
  if (nova) linha = aba.getLastRow() + 1;

  // As duas últimas colunas são da equipe: uma inscrição repetida não mexe nelas.
  var valores = [
    Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss'),
    texto_(d.nome),
    whatsapp,
    texto_(d.cidade),
    texto_(d.utm_source),
    texto_(d.utm_medium),
    texto_(d.utm_campaign),
    texto_(d.utm_content),
    texto_(d.utm_term),
    texto_(d.fbclid),
    texto_(d.url_origem),
    consentimento_(d),
    texto_(d.event_id),
  ];

  // Formato de texto antes de gravar: o WhatsApp não vira número.
  aba.getRange(linha, 1, 1, COLUNAS.length).setNumberFormat('@');
  aba.getRange(linha, 1, 1, valores.length).setValues([valores]);

  if (nova) {
    aba
      .getRange(linha, COLUNA_STATUS)
      .setDataValidation(regraDeStatus_())
      .setValue(STATUS[0]);
  }
}

// O site manda o registro do aceite ("aceito via texto (inscrição) em ...").
// Sem ele (versão antiga do site), vale o Sim/Não de antes.
function consentimento_(d) {
  if (d.consentimento_registro) return texto_(d.consentimento_registro);
  return d.consentimento === true ? 'Sim' : 'Não';
}

// Cada pedido entra na linha 2, logo abaixo do cabeçalho: os mais novos ficam no topo.
// Devolve false quando o pedido já estava gravado (o site tentou de novo).
function gravarVaga_(aba, inscritos, d) {
  var eventId = texto_(d.event_id);
  if (eventId && encontrarEm_(aba, VAGA_EVENT_ID, eventId)) return false;

  var whatsapp = String(d.whatsapp).replace(/\D/g, '');
  var nome = texto_(d.nome);
  var status = STATUS_VAGAS.indexOf(d.status) >= 0 ? d.status : 'Novo';
  var inscrito = inscritos && encontrarEm_(inscritos, COLUNA_WHATSAPP, whatsapp) ? 'Sim' : 'Não';

  aba.insertRowsAfter(1, 1);
  var linha = aba.getRange(2, 1, 1, COLUNAS_VAGAS.length);
  // A linha nova herdaria o verde do cabeçalho.
  linha.clearFormat();
  formatarLinhasDeVaga_(linha);

  linha.setValues([
    [
      new Date(),
      nome,
      whatsapp,
      texto_(d.cidade),
      texto_(d.horario),
      inscrito,
      status,
      '',
      '',
      '',
      '',
      '',
      eventId,
    ],
  ]);

  var ligar = aba.getRange(2, COLUNAS_VAGAS.indexOf('Ligar') + 1);
  try {
    ligar.setRichTextValue(link_('Ligar', 'tel:+' + whatsapp));
  } catch (erro) {
    // Se a planilha recusar o link tel:, fica o número para discar.
    ligar.setValue('+' + whatsapp);
  }
  aba
    .getRange(2, COLUNAS_VAGAS.indexOf('Chamar no WhatsApp') + 1)
    .setRichTextValue(
      link_(
        'Abrir conversa',
        'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(mensagemDoCrc_(nome, status)),
      ),
    );
  return true;
}

function mensagemDoCrc_(nome, status) {
  var primeiro = String(nome).replace(/^'/, '').split(/\s+/)[0];
  if (status === 'Lista de espera') {
    return (
      'Olá, ' + primeiro + '! Aqui é da equipe do Dr. Pablo Santos. ' +
      'Recebemos seu pedido para a lista de espera da Jornada dos Dentes Fixos. ' +
      'Assim que abrirmos as vagas de janeiro, falamos com você por aqui.'
    );
  }
  return (
    'Olá, ' + primeiro + '! Aqui é da equipe do Dr. Pablo Santos. ' +
    'Recebemos seu pedido de vaga de avaliação da Jornada dos Dentes Fixos. ' +
    'Qual o melhor dia para você vir à clínica, entre 01/12 e 12/12?'
  );
}

function link_(textoDoLink, url) {
  return SpreadsheetApp.newRichTextValue().setText(textoDoLink).setLinkUrl(url).build();
}

function avisarPorEmail_(d) {
  var destino = PropertiesService.getScriptProperties().getProperty('AVISO_EMAIL');
  if (!destino) return;

  try {
    var whatsapp = String(d.whatsapp).replace(/\D/g, '');
    var lista = d.status === 'Lista de espera';
    MailApp.sendEmail({
      to: destino,
      subject: (lista ? 'Lista de espera: ' : 'Novo pedido de vaga: ') + texto_(d.nome),
      body: [
        lista ? 'Novo pedido para a lista de espera.' : 'Novo pedido de vaga de avaliação. Ligar em até 15 minutos.',
        '',
        'Nome: ' + texto_(d.nome),
        'WhatsApp: +' + whatsapp,
        'Cidade: ' + texto_(d.cidade),
        'Melhor horário: ' + texto_(d.horario),
        '',
        'Planilha: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      ].join('\n'),
    });
  } catch (erro) {
    console.error('Falha no aviso por e-mail', erro);
  }
}

function encontrarLinha_(aba, whatsapp) {
  return encontrarEm_(aba, COLUNA_WHATSAPP, whatsapp);
}

function encontrarEm_(aba, coluna, valor) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return 0;

  var achado = aba
    .getRange(2, coluna, ultima - 1, 1)
    .createTextFinder(valor)
    .matchEntireCell(true)
    .findNext();

  return achado ? achado.getRow() : 0;
}

function regraDeStatus_() {
  return SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS, true)
    .setAllowInvalid(false)
    .build();
}

function regraDeStatusVaga_() {
  return SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_VAGAS, true)
    .setAllowInvalid(false)
    .build();
}

// Um "=" no começo de um campo viraria fórmula na planilha.
function texto_(valor) {
  var limpo = String(valor === undefined || valor === null ? '' : valor)
    .trim()
    .slice(0, 2000);
  return /^[=+\-@]/.test(limpo) ? "'" + limpo : limpo;
}

function segredoValido_(recebido) {
  var segredo = PropertiesService.getScriptProperties().getProperty('SHEETS_SECRET');
  return Boolean(segredo) && recebido === segredo;
}

function responder_(ok, erro) {
  var corpo = ok ? { ok: true } : { ok: false, erro: erro };
  return ContentService.createTextOutput(JSON.stringify(corpo)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
