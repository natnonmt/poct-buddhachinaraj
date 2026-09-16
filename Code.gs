/**
 * POCT Tracking System Backend
 * Hospital: Buddhachinaraj Phitsanulok
 * Database: Google Sheets
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // User must replace this or leave blank if script is bound to sheet

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

function doGet(e) {
  const action = e.parameter.action;
  const result = handleAction(action, e.parameter);
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  const result = handleAction(action, params);
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAction(action, data) {
  try {
    switch (action) {
      case 'getEquipment': return getEquipment();
      case 'addEquipment': return addEquipment(data);
      case 'updateEquipment': return updateEquipment(data);
      case 'getIQC': return getIQC(data);
      case 'addIQC': return addIQC(data);
      case 'getDashboardStats': return getDashboardStats();
      case 'validateUser': return validateUser(data);
      default: throw new Error('Invalid action: ' + action);
    }
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// --- Equipment Logic ---
function getEquipment() {
  const sheet = getSheet('EquipmentMaster');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  return { status: 'success', data: rows };
}

function addEquipment(data) {
  const sheet = getSheet('EquipmentMaster');
  const id = 'EQ' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMddHHmmss');
  const row = [
    id, data.test_program, data.brand, data.model, data.serial_number,
    data.asset_no, data.department, data.responsible_person, data.received_date,
    data.warranty_expiry, data.last_calibration_date, data.calibration_interval_months,
    '', data.calibrated_by, data.calibration_result, data.status,
    data.user, new Date()
  ];
  sheet.appendRow(row);

  // Calculate next calibration
  const lastCal = new Date(data.last_calibration_date);
  const interval = parseInt(data.calibration_interval_months);
  const nextCal = new Date(lastCal.setMonth(lastCal.getMonth() + interval));
  sheet.getRange(sheet.getLastRow(), 13).setValue(nextCal);

  return { status: 'success', id: id };
}

function updateEquipment(data) {
  const sheet = getSheet('EquipmentMaster');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rowIndex = values.findIndex(row => row[0] === data.equipment_id);

  if (rowIndex === -1) throw new Error('Equipment not found');

  const rowNum = rowIndex + 1;
  headers.forEach((h, i) => {
    if (data[h] !== undefined) {
      sheet.getRange(rowNum, i + 1).setValue(data[h]);
    }
  });

  return { status: 'success' };
}

// --- IQC Logic ---
function getIQC(data) {
  const sheet = getSheet('IQCLog');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  let filteredRows = values.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  if (data.equipment_id) {
    filteredRows = filteredRows.filter(r => r.equipment_id === data.equipment_id);
  }

  return { status: 'success', data: filteredRows };
}

function addIQC(data) {
  const sheet = getSheet('IQCLog');
  const id = 'IQC' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMddHHmmss');
  const row = [
    id, data.equipment_id, data.test_date, data.material_code,
    data.material_level, data.material_expiry, data.measured_value,
    data.target_range, data.rule_evaluation, data.operator,
    data.corrective_action, data.user, new Date()
  ];
  sheet.appendRow(row);
  return { status: 'success', id: id };
}

// --- Dashboard Stats ---
function getDashboardStats() {
  const eqSheet = getSheet('EquipmentMaster');
  const eqData = eqSheet.getDataRange().getValues();
  const headers = eqData[0];
  const rows = eqData.slice(1);

  const nextCalIdx = headers.indexOf('next_calibration_due');
  const statusIdx = headers.indexOf('status');

  const now = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(now.getDate() + 30);

  let overdue = 0;
  let warning = 0;
  let active = 0;

  rows.forEach(row => {
    if (row[statusIdx] === 'ใช้งาน') active++;
    const nextCal = new Date(row[nextCalIdx]);
    if (nextCal < now) overdue++;
    else if (nextCal < thirtyDaysLater) warning++;
  });

  return {
    status: 'success',
    stats: {
      total: rows.length,
      active,
      overdue,
      warning
    }
  };
}

// --- Auth Logic ---
function validateUser(data) {
  const sheet = getSheet('Users');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const userIdx = headers.indexOf('pin_or_email');
  const roleIdx = headers.indexOf('role');
  const nameIdx = headers.indexOf('name');

  const userRow = values.find(row => row[userIdx] === data.password);
  if (userRow) {
    return {
      status: 'success',
      user: {
        name: userRow[nameIdx],
        role: userRow[roleIdx]
      }
    };
  }
  return { status: 'error', message: 'Invalid credentials' };
}
