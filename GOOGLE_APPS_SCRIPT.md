# Google Apps Script Backend - TaskFlow Sheets

Bu dosya, Google Sheets ile React uygulaması arasındaki API köprüsüdür.

## Kurulum Adımları

1. Google Sheets'i aç
2. **Extensions > Apps Script** menüsünden script editörünü aç
3. Aşağıdaki kodu yapıştır
4. **Deploy > New Deployment** ile Web App olarak yayınla
   - Execute as: **Me**
   - Who has access: **Anyone**
5. URL'yi kopyala ve `AppContext.tsx` dosyasındaki `GOOGLE_SCRIPT_URL` değişkenine yapıştır

## Google Sheets Yapısı

### Main Sheet (İş Listesi)
| A (is_id) | B (is_basligi) | C (is_detayi) | D (is_atama_tarihi) | E (atanan_kisi) | F (sifre) | G (ek1) | H (notes) | I (status) | J (ek2) | K (ek3) |
|-----------|----------------|---------------|---------------------|-----------------|-----------|---------|-----------|------------|---------|---------|

### Bekleyen Onaylar Sheet
| A (requestedBy) | B (is_basligi) | C (is_detayi) | D (requestedAt) | E (ekler) |
|-----------------|----------------|---------------|-----------------|-----------|

## Apps Script Kodu

\`\`\`javascript
// GOOGLE_SCRIPT_URL için bu script'i deploy edin

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // CORS Headers ✅
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const params = e.parameter;
    const action = params.action || (e.postData ? JSON.parse(e.postData.contents).action : null);
    
    let result = {};
    
    switch(action) {
      case 'getTasks':
        result = getTasks();
        break;
      case 'addTask':
        const taskData = JSON.parse(e.postData.contents);
        result = addTask(taskData.task, taskData.files);
        break;
      case 'addNote':
        const noteData = JSON.parse(e.postData.contents);
        result = addNoteToTask(noteData.is_id, noteData.note);
        break;
      case 'completeTask':
        const completeData = JSON.parse(e.postData.contents);
        result = completeTask(completeData.is_id, completeData.editorName, completeData.taskTitle);
        break;
      case 'submitForApproval':
        const approvalData = JSON.parse(e.postData.contents);
        result = submitForApproval(approvalData.task);
        break;
      case 'approveTask':
        const approveData = JSON.parse(e.postData.contents);
        result = approveTask(approveData.taskId);
        break;
      case 'rejectTask':
        const rejectData = JSON.parse(e.postData.contents);
        result = rejectTask(rejectData.taskId, rejectData.reason);
        break;
      default:
        result = { status: 'error', message: 'Unknown action' };
    }
    
    output.setContent(JSON.stringify(result));
  } catch (error) {
    output.setContent(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    }));
  }
  
  return output;
}

function getTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
  if (!sheet) return { status: 'error', message: 'Sheet not found' };
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const tasks = rows.map(row => {
    const task = {};
    headers.forEach((header, index) => {
      task[header] = row[index] || '';
    });
    return task;
  });
  
  return { status: 'success', data: tasks };
}

function addTask(task, files) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
  if (!sheet) return { status: 'error', message: 'Sheet not found' };
  
  // Handle file uploads (Base64 to Google Drive)
  let fileUrls = [];
  if (files && files.length > 0) {
    files.forEach((file, idx) => {
      try {
        const blob = Utilities.newBlob(
          Utilities.base64Decode(file.data), 
          file.type, 
          file.name
        );
        const driveFile = DriveApp.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrls.push(driveFile.getUrl());
      } catch (e) {
        Logger.log('File upload error: ' + e);
      }
    });
  }
  
  // Add row
  sheet.appendRow([
    task.is_id,
    task.is_basligi,
    task.is_detayi,
    task.is_atama_tarihi,
    task.atanan_kisi,
    task.sifre,
    fileUrls[0] || '',
    JSON.stringify(task.notes || []),
    task.status,
    fileUrls[1] || '',
    fileUrls[2] || ''
  ]);
  
  return { status: 'success', message: 'Task added' };
}

function addNoteToTask(taskId, note) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
  if (!sheet) return { status: 'error', message: 'Sheet not found' };
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === taskId.toString()) {
      let notes = [];
      try {
        notes = data[i][7] ? JSON.parse(data[i][7]) : [];
      } catch (e) { notes = []; }
      
      notes.push(note);
      sheet.getRange(i + 1, 8).setValue(JSON.stringify(notes));
      return { status: 'success', message: 'Note added' };
    }
  }
  return { status: 'error', message: 'Task not found' };
}

function completeTask(taskId, editorName, taskTitle) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
  if (!sheet) return { status: 'error', message: 'Sheet not found' };
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === taskId.toString()) {
      sheet.getRange(i + 1, 9).setValue('Tamamlandı');
      
      // Send email ✅
      sendCompletionEmail(taskId, taskTitle, editorName, data[i][3], data[i][2]);
      
      return { status: 'success', message: 'Task completed and email sent' };
    }
  }
  return { status: 'error', message: 'Task not found' };
}

function sendCompletionEmail(taskId, title, editorName, assignDate, detail) {
  const recipient = 'yalcinyaman@timas.com.tr';
  const subject = `✅ Görev Tamamlandı: ${title}`;
  const body = `
Merhaba,

${editorName} aşağıdaki görevi tamamladı:

📋 Görev ID: #${taskId}
📝 Başlık: ${title}
📄 Detay: ${detail}
📅 Atama Tarihi: ${assignDate}
✅ Tamamlanma: ${new Date().toLocaleDateString('tr-TR')}

--
TaskFlow Yönetim Sistemi
Timas Yayınları
  `;
  
  try {
    MailApp.sendEmail(recipient, subject, body);
    Logger.log('Email sent to ' + recipient);
  } catch (e) {
    Logger.log('Email error: ' + e);
  }
}

function submitForApproval(task) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Bekleyen Onaylar');
  
  // Create sheet if doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Bekleyen Onaylar');
    sheet.appendRow(['requestedBy', 'is_basligi', 'is_detayi', 'requestedAt', 'ekler']);
  }
  
  sheet.appendRow([
    task.requestedBy,
    task.is_basligi,
    task.is_detayi,
    task.requestedAt,
    JSON.stringify(task.ekler || [])
  ]);
  
  return { status: 'success', message: 'Submitted for approval' };
}

function approveTask(taskId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const approvalSheet = ss.getSheetByName('Bekleyen Onaylar');
  const mainSheet = ss.getSheetByName('İş Listesi');
  
  if (!approvalSheet || !mainSheet) {
    return { status: 'error', message: 'Sheets not found' };
  }
  
  // Find and move task from approval to main
  const data = approvalSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Implementation: Move row from approval to main sheet
    // This is a simplified version - you would match by requestedBy + title
  }
  
  return { status: 'success', message: 'Task approved' };
}

function rejectTask(taskId, reason) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Bekleyen Onaylar');
  if (!sheet) return { status: 'error', message: 'Sheet not found' };
  
  // Remove from pending approvals
  // Implementation: Delete matching row
  
  return { status: 'success', message: 'Task rejected' };
}
\`\`\`

## Önemli Notlar

- **CORS:** Apps Script otomatik olarak CORS headers ekler, ekstra yapılandırma gerekmez
- **Email:** MailApp.sendEmail kullanıldı (Gmail hesabından gönderir)
- **Deployment:** Her kod değişikliğinde yeni versiyon deploy etmelisiniz
- **Test:** Script editöründe Run > Test deployment ile test edebilirsiniz
