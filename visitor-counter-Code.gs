const SHEET_ID = '1t4Dq7ZX92aa-0VL4NLlt4PwHl7iN10jMjfoNAg7Fw-A';
const SHEET_NAME = 'Visitors';
const STARTING_COUNT = 30000;

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'get').toLowerCase();
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);
    const sheet = getVisitorSheet_();
    const countCell = sheet.getRange('A2');
    let count = Number(countCell.getValue());

    if (!Number.isFinite(count) || count < STARTING_COUNT) {
      count = STARTING_COUNT;
    }

    if (action === 'visit') {
      count += 1;
      countCell.setValue(count);
      sheet.getRange('B2').setValue(new Date());
    }

    return jsonResponse_({ success: true, visitors: count, updatedAt: new Date().toISOString() });
  } catch (error) {
    return jsonResponse_({ success: false, visitors: STARTING_COUNT, error: String(error) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function getVisitorSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  sheet.getRange('A1').setValue('Total Visitors');
  sheet.getRange('B1').setValue('Last Visit');

  const currentCount = Number(sheet.getRange('A2').getValue());
  if (!Number.isFinite(currentCount) || currentCount < STARTING_COUNT) {
    sheet.getRange('A2').setValue(STARTING_COUNT);
  }

  if (!sheet.getRange('B2').getValue()) sheet.getRange('B2').setValue(new Date());

  sheet.getRange('A1:B1').setFontWeight('bold').setBackground('#111827').setFontColor('#39ff88');
  sheet.getRange('A2').setFontWeight('bold').setFontColor('#00ff88').setNumberFormat('#,##0');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
