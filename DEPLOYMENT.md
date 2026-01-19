# TaskFlow - Netlify Deployment Kılavuzu

## 🚀 Adım Adım Deployment

### 1. Google Apps Script Setup

1. **Google Sheets'i Aç**
   - İş Listesi sheet'inin olduğu dosyayı aç
   - Sheet yapısı:
     ```
     is_id | is_basligi | is_detayi | is_atama_tarihi | atanan_kisi | sifre | ek1 | notes | status | ek2 | ek3
     ```

2. **Apps Script Editörü**
   - Menü: **Extensions > Apps Script**
   - Yeni bir script projesi açılacak

3. **Kodu Yapıştır**
   - `google-script-deploy.js` dosyasındaki TAMAMINI kopyala
   - Apps Script editörüne yapıştır
   - Kaydet (Ctrl+S veya Cmd+S)

4. **Deploy Et**
   - Üst menüden: **Deploy > New Deployment**
   - **Select type:** Web app
   - **Execute as:** Me
   - **Who has access:** Anyone
   - **Deploy** butonuna bas
   - **✅ URL'yi KOPYALA** (örn: https://script.google.com/macros/s/ABC123.../exec)

5. **İzinleri Onayla**
   - İlk deployment'ta izin isteyecek
   - "Advanced" > "Go to [project name]"
   - "Allow" butonuna bas

---

### 2. Frontend Konfigürasyonu

1. **AppContext.tsx'i Güncelle**
   
   Dosya: `src/context/AppContext.tsx`
   
   **Satır 7:** Kopyaladığın URL'yi yapıştır:
   ```typescript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/.../exec"; // BURAYA
   ```

2. **DEV_MODE Kontrolü**
   
   **Satır 5:** False olmalı:
   ```typescript
   const DEV_MODE = false; // ✅ Production
   ```

---

### 3. Local Test (İsteğe Bağlı)

```bash
npm run dev
```

- http://localhost:5173
- Admin (4337) ile giriş yap
- Yeni görev ekle
- **Google Sheets'te kontrolü et!**
- Eğer görünüyorsa ✅ hazırsın!

---

### 4. Production Build

```bash
npm run build
```

- `dist/` klasörü oluşacak
- Bu klasör Netlify'a deploy edilecek

---

### 5. Netlify Deployment

#### Yöntem A: Git Integration (Önerilen)

1. **GitHub'a Push**
   ```bash
   cd /Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets
   git init
   git add .
   git commit -m "Initial commit - TaskFlow v2.0"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Netlify'a Bağla**
   - https://app.netlify.com
   - **Add new site > Import an existing project**
   - **GitHub** seç
   - Repository'ni seç
   - Build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - **Deploy site** bas

#### Yöntem B: Manual Deploy (Hızlı)

1. **Netlify Drag & Drop**
   - https://app.netlify.com
   - **Sites** sekmesi
   - `dist/` klasörünü sürükle-bırak
   - Hepsi bu! 🎉

---

### 6. Environment Variables (Opsiyonel)

Eğer URL'yi kod içinde göstermek istemiyorsan:

1. **Netlify Dashboard**
   - Site settings > Build & deploy > Environment
   - **Add variable:**
     - Key: `VITE_GOOGLE_SCRIPT_URL`
     - Value: Script URL

2. **AppContext.tsx Güncelle**
   ```typescript
   const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "fallback_url";
   ```

---

## ✅ Deployment Checklist

- [ ] Google Apps Script deploy edildi
- [ ] URL kopyalandı
- [ ] `AppContext.tsx` güncellendi (satır 7)
- [ ] `DEV_MODE = false` (satır 5)
- [ ] Local test yapıldı (npm run dev)
- [ ] Google Sheets'te data görüldü
- [ ] Production build yapıldı (npm run build)
- [ ] Netlify'a deploy edildi
- [ ] Live site test edildi

---

## 🐛 Troubleshooting

### "Failed to fetch" Hatası
- ✅ DEV_MODE false mu?
- ✅ GOOGLE_SCRIPT_URL doğru mu?
- ✅ Apps Script deploy edildi mi?
- ✅ Tarayıcı console'da CORS hatası var mı?

### "Unauthorized" Hatası
- ✅ Apps Script izinleri verildi mi?
- ✅ "Who has access: Anyone" seçildi mi?

### Görevler Google Sheets'e Yazılmıyor
- ✅ DEV_MODE kapalı mı?
- ✅ Sheet adı "İş Listesi" mi?
- ✅ Column headers doğru mu?

---

## 🎯 Canlı URL

Netlify deployment tamamlandıktan sonra:
- URL: `https://your-site-name.netlify.app`
- Custom domain ekleyebilirsin

---

## 📧 Destek

Sorunlar için: yalcinyaman@timas.com.tr

**Başarılar! 🚀**
