// ============================================================
// TAMO JUNTO — Google Apps Script para integração do calendário
//
// ESTRUTURA DA PLANILHA (aba "datas_ocupadas"):
// | A: Data       |
// |---------------|
// | 2026-07-12    |
// | 2026-07-19    |
//
// Toda linha com data preenchida é tratada como reservada.
// Retorna: { ocupados: ['2026-07-12', '2026-07-19', ...] }
// ============================================================

function doGet(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('datas_ocupadas');

  const rows = sheet.getDataRange().getValues();

  const ocupados = rows
    .slice(1)
    .filter(row => row[0] !== '')
    .map(row => {
      const raw = row[0];
      if (raw instanceof Date) {
        const y = raw.getFullYear();
        const m = String(raw.getMonth() + 1).padStart(2, '0');
        const d = String(raw.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      return String(raw).trim();
    });

  return ContentService
    .createTextOutput(JSON.stringify({ ocupados }))
    .setMimeType(ContentService.MimeType.JSON);
}
