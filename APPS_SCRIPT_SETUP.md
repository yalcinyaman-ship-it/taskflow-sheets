# Google Apps Script Kurulum - Adım Adım

## 🎯 Sorun
Apps Script URL'e gittiğinde Google Drive hatası veriyor. Düzgün deploy edilmemiş.

## ✅ Çözüm Adımları

### 1. Google Sheets'i Aç
İş Listesi sheet'inin olduğu dosyayı aç.

### 2. Apps Script Editörü
- **Extensions > Apps Script**
- Yeni pencere açılacak

### 3. Mevcut Kodu Temizle
- Sol tarafta **Code.gs** dosyası var
- İçindeki **HER ŞEYİ SİL**

### 4. Yeni Kodu Yapıştır
Lokal projeden kopyala: `google-script-deploy.js`

**VEYA** şu dosyayı aç VS Code'da:
```
/Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets/google-script-deploy.js
```

**TAMAMINI** (222 satır) kopyala → Apps Script'e yapıştır

### 5. Kaydet
- **File > Save** (veya Cmd+S)
- Proje ismi sor -> "TaskFlow Backend" yaz

### 6. Test Et (ÖNEMLİ!)
Apps Script editöründe:
- Üst menüden fonksiyon seç: **getTasks**
- **Run** butonuna bas
- İlk seferde authorization isteyecek → **Review Permissions**
- **Advanced** > **Go to TaskFlow Backend (unsafe)** 
- **Allow** de
- Log'da hata var mı kontrol et

### 7. Deploy Et
- Üst menü: **Deploy > New Deployment**
- **Select type** dişli simgesine tıkla → **Web app** seç
- **Description:** "TaskFlow v1"
- **Execute as:** Me (yalcinyaman@timas.com.tr)
- **Who has access:** **Anyone** ⚠️ ÇOOK ÖNEMLİ!
- **Deploy** butonuna bas
- Tekrar authorization isterse ver
- **Deployment ID** ile birlikte URL çıkacak
- **URL'İ KOPYALA**

### 8. URL'i Test Et
Tarayıcıda şu formatta URL'e git (sonuna ?action=getTasks ekle):
```
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=getTasks
```

**Görmek istediğimiz:**
```json
{"status":"success","data":[...]}
```

**Görmememiz gereken:**
- Google Drive hatası ❌
- Authorization error ❌
- 404 ❌

### 9. URL'i Koda Ekle
Eğer JSON görüyorsan ✅:
- VS Code'da `AppContext.tsx` aç
- Satır 8'e yeni URL'i yapıştır
- DEV_MODE'u false yap (satır 5)
- Kaydet
- GitHub'a push et

---

## 🐛 Sık Sorunlar

### "Script function not found: getTasks"
→ Kodu kopyalarken eksik kalmış, tekrar yapıştır

### "Authorization needed"
→ Deploy ayarlarında "Who has access: Anyone" seçilmemiş

### "Google Drive Error" 
→ Deploy URL'i yanlış veya deployment doğru yapılmamış

---

## ✅ Başarılı Deployment Kontrolü

URL'e gittiğinde şunu görmelisin:
```json
{
  "status": "success",
  "data": [
    {
      "is_id": "...",
      "is_basligi": "...",
      ...
    }
  ]
}
```

Eğer bu görünüyorsa 🎉 **BAŞARILI!**

---

## 📞 İletişim
Sorun çözülmezse:
- Apps Script Log'ları kontrol et (View > Logs)
- Sheet yapısını kontrol et (kolonlar doğru mu?)
- Execution log'ları incele (View > Executions)
