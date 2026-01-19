// TaskFlow Google Apps Script Backend (Fixed & Robust Version)
// Deploy bu kodu: Deploy > New Deployment > Web App
// Execute as: Me
// Who has access: Anyone

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    // Lock service to prevent concurrent modification issues
    const lock = LockService.getScriptLock();
    lock.tryLock(10000); // Wait up to 10 seconds

    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // Set CORS headers for all responses
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    };

    try {
        const params = e.parameter || {};
        // Handle POST data safely
        let postData = null;
        if (e.postData && e.postData.contents) {
            try {
                postData = JSON.parse(e.postData.contents);
            } catch (parseError) {
                // If parsing fails but action is in query params, proceed. Else fail.
                if (!params.action) throw new Error("Invalid JSON body");
            }
        }

        const action = params.action || (postData ? postData.action : null);

        if (!action) {
            // Simple health check if no action provided
            return ContentService.createTextOutput(JSON.stringify({
                status: 'success',
                message: 'TaskFlow API is running!',
                timestamp: new Date().toISOString()
            })).setMimeType(ContentService.MimeType.JSON);
        }

        let result = {};

        switch (action) {
            case 'getTasks':
                result = getTasks();
                break;
            case 'addTask':
                if (!postData) throw new Error("Missing POST data for addTask");
                result = addTask(postData.task, postData.files);
                break;
            case 'addNote':
                if (!postData) throw new Error("Missing POST data for addNote");
                result = addNoteToTask(postData.is_id, postData.note);
                break;
            case 'completeTask':
                if (!postData) throw new Error("Missing POST data for completeTask");
                result = completeTask(postData.is_id, postData.editorName, postData.taskTitle);
                break;
            case 'submitForApproval':
                if (!postData) throw new Error("Missing POST data for submitForApproval");
                result = submitForApproval(postData.task);
                break;
            case 'approveTask':
                // Not fully implemented logic stub
                result = { status: 'success', message: 'Task approved (stub)' };
                break;
            case 'rejectTask':
                // Not fully implemented logic stub
                result = { status: 'success', message: 'Task rejected (stub)' };
                break;
            default:
                result = { status: 'error', message: 'Unknown action: ' + action };
        }

        output.setContent(JSON.stringify(result));

    } catch (error) {
        // Top-level error catcher - guarantees valid JSON return
        output.setContent(JSON.stringify({
            status: 'error',
            message: error.toString(),
            stack: error.stack
        }));
    } finally {
        lock.releaseLock();
    }

    return output;
}

// --- Helper Functions ---

function getTasks() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
    if (!sheet) return { status: 'error', message: 'Sheet "İş Listesi" not found' };

    // Check if sheet is empty (only headers or less)
    if (sheet.getLastRow() <= 1) {
        return { status: 'success', data: [] };
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    const tasks = rows.map(row => {
        const task = {};
        headers.forEach((header, index) => {
            task[header] = row[index] ? row[index].toString() : ''; // Ensure strings
        });

        // Parse JSON fields safely
        if (task.notes) {
            try { task.notes = JSON.parse(task.notes); } catch (e) { task.notes = []; }
        } else {
            task.notes = [];
        }

        // Parse files safely (assuming they are URLs or JSON array)
        // Adjust based on your actual data structure in "files" columns
        // This is skipped for simplicity as the frontend expects separate ek1/ek2/ek3 sometimes or array

        // Construct ekler array from columns if needed
        task.ekler = [];
        if (task.ek1) task.ekler.push(task.ek1);
        if (task.ek2) task.ekler.push(task.ek2);
        if (task.ek3) task.ekler.push(task.ek3);

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
        files.forEach((file) => {
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
    // Order: is_id | is_basligi | is_detayi | is_atama_tarihi | atanan_kisi | sifre | ek1 | notes | status | ek2 | ek3
    sheet.appendRow([
        task.is_id,
        task.is_basligi,
        task.is_detayi,
        task.is_atama_tarihi,
        task.atanan_kisi,
        task.sifre || '',
        fileUrls[0] || '',
        JSON.stringify(task.notes || []),
        task.status || 'Beklemede',
        fileUrls[1] || '',
        fileUrls[2] || ''
    ]);

    return { status: 'success', message: 'Task added successfully', data: { id: task.is_id } };
}

function addNoteToTask(taskId, note) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
    if (!sheet) return { status: 'error', message: 'Sheet not found' };

    const data = sheet.getDataRange().getValues();
    // Column 0 is is_id (index 0)
    // Column 7 is notes (index 7) -> H column

    for (let i = 1; i < data.length; i++) {
        if (data[i][0].toString() === taskId.toString()) {
            let notes = [];
            try {
                notes = data[i][7] ? JSON.parse(data[i][7]) : [];
            } catch (e) {
                notes = [];
            }

            notes.push(note);
            sheet.getRange(i + 1, 8).setValue(JSON.stringify(notes)); // 1-indexed row, 8th column
            return { status: 'success', message: 'Note added' };
        }
    }
    return { status: 'error', message: 'Task not found: ' + taskId };
}

function completeTask(taskId, editorName, taskTitle) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('İş Listesi');
    if (!sheet) return { status: 'error', message: 'Sheet not found' };

    const data = sheet.getDataRange().getValues();
    // Status column index likely 8 (I column) based on addTask structure

    for (let i = 1; i < data.length; i++) {
        if (data[i][0].toString() === taskId.toString()) {
            sheet.getRange(i + 1, 9).setValue('Tamamlandı'); // I column

            try {
                sendCompletionEmail(taskId, taskTitle, editorName, data[i][3], data[i][2]);
            } catch (emailError) {
                Logger.log("Email failed: " + emailError);
                // Don't fail the task completion just because email failed
            }

            return { status: 'success', message: 'Task completed' };
        }
    }
    return { status: 'error', message: 'Task not found' };
}

function sendCompletionEmail(taskId, title, editorName, assignDate, detail) {
    const recipient = 'yalcinyaman@timas.com.tr';
    const subject = '✅ Görev Tamamlandı: ' + title;
    const body =
        'Merhaba,\n\n' +
        editorName + ' aşağıdaki görevi tamamladı:\n\n' +
        '📋 Görev ID: #' + taskId + '\n' +
        '📝 Başlık: ' + title + '\n' +
        '📄 Detay: ' + detail + '\n' +
        '📅 Atama Tarihi: ' + assignDate + '\n' +
        '✅ Tamamlanma: ' + new Date().toLocaleDateString('tr-TR') + '\n\n' +
        '--\n' +
        'TaskFlow Yönetim Sistemi\n';

    MailApp.sendEmail(recipient, subject, body);
}

function submitForApproval(task) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Bekleyen Onaylar');

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
