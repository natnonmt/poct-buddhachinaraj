/**
 * POCT Tracking System Backend
 * Hospital: Buddhachinaraj Phitsanulok
 * Database: Google Sheets
 */

const SPREADSHEET_ID = '1kGUv80XNjUHyN7O8sUEBW9E2cuJifi5z6N993dca16U'; // User must replace this or leave blank if script is bound to sheet

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
      case 'getEQA': return getEQA(data);
      case 'addEQA': return addEQA(data);
      case 'getCompetency': return getCompetency(data);
      case 'addCompetency': return addCompetency(data);
      case 'getMaintenance': return getMaintenance(data);
      case 'addMaintenance': return addMaintenance(data);
      case 'getReports': return getReports();
      case 'getDashboardStats': return getDashboardStats();
      case 'validateUser': return validateUser(data);
      default: throw new Error('Invalid action: ' + action);
    }
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// ... existing equipment logic ...

// --- EQA Logic ---
function getEQA(data) {
  const sheet = getSheet('EQALog');
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
  if (data.test_program) {
    filteredRows = filteredRows.filter(r => r.test_program === data.test_program);
  }

  return { status: 'success', data: filteredRows };
}

function addEQA(data) {
  const sheet = getSheet('EQALog');
  const id = 'EQA' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMddHHmmss');
  const row = [
    id, data.equipment_id, data.test_program, data.provider,
    data.round_date, data.due_date, data.result, data.score,
    data.pass_fail, data.corrective_action, data.user, new Date()
  ];
  sheet.appendRow(row);
  return { status: 'success', id: id };
}

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

// --- Competency Logic ---
function getCompetency(data) {
  const sheet = getSheet('CompetencyLog');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  let filteredRows = values.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  if (data.staff_name) {
    filteredRows = filteredRows.filter(r => r.staff_name.includes(data.staff_name));
  }
  if (data.department) {
    filteredRows = filteredRows.filter(r => r.department === data.department);
  }

  return { status: 'success', data: filteredRows };
}

function addCompetency(data) {
  const sheet = getSheet('CompetencyLog');
  const id = 'COMP' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMddHHmmss');
  const row = [
    id, data.staff_name, data.department, data.test_program,
    data.training_date, data.assessor, data.result, data.next_due_date,
    data.user, new Date()
  ];
  sheet.appendRow(row);
  return { status: 'success', id: id };
}

// --- Maintenance Logic ---
function getMaintenance(data) {
  const sheet = getSheet('MaintenanceLog');
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

function addMaintenance(data) {
  const sheet = getSheet('MaintenanceLog');
  const id = 'MNT' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMddHHmmss');
  const row = [
    id, data.equipment_id, data.maintenance_date, data.performed_by,
    data.findings, data.next_due_date, data.user, new Date()
  ];
  sheet.appendRow(row);
  return { status: 'success', id: id };
}

function getReports() {
  const eqData = getEquipment().data;
  const iqcData = getIQC({}).data;
  const eqaData = getEQA({}).data;

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const monthlyIQC = iqcData.filter(r => new Date(r.test_date) >= thirtyDaysAgo);
  const iqcFailCount = monthlyIQC.filter(r => r.rule_evaluation !== 'ผ่าน').length;

  return {
    status: 'success',
    data: {
      equipmentSummary: {
        total: eqData.length,
        overdue: eqData.filter(e => new Date(e.next_calibration_due) < now).length,
        warning: eqData.filter(e => {
          const d = new Date(e.next_calibration_due);
          return d >= now && d < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }).length,
      },
      iqcSummary: {
        totalTests: monthlyIQC.length,
        fails: iqcFailCount,
        passRate: monthlyIQC.length ? ((monthlyIQC.length - iqcFailCount) / monthlyIQC.length * 100).toFixed(2) : 0,
      },
      eqaSummary: {
        total: eqaData.length,
        pass: eqaData.filter(r => r.pass_fail === 'ผ่าน').length,
        fail: eqaData.filter(r => r.pass_fail === 'ไม่ผ่าน').length,
      }
    }
  };
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
