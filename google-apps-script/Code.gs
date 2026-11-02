// Recebe as inscrições do site e grava na aba "Inscritos".
// Passo a passo em google-apps-script/LEIA-ME.md.
// O segredo fica em Propriedades do script (SHEETS_SECRET), nunca neste arquivo.

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

function doPost(e) {
  var trava = LockService.getScriptLock();
  var comTrava = false;

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

    var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
    if (!aba) return responder_(false, 'aba_ausente');

    gravar_(aba, dados);
    SpreadsheetApp.flush();
    return responder_(true);
  } catch (erro) {
    console.error(erro);
    return responder_(false, 'erro_interno');
  } finally {
    if (comTrava) trava.releaseLock();
  }
}

function doGet() {
  return responder_(false, 'metodo_invalido');
}

// Rode uma vez, pelo editor, para preparar a planilha. Pode ser repetida sem perder dados.
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
    d.consentimento === true ? 'Sim' : 'Não',
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

function encontrarLinha_(aba, whatsapp) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return 0;

  var achado = aba
    .getRange(2, COLUNA_WHATSAPP, ultima - 1, 1)
    .createTextFinder(whatsapp)
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
