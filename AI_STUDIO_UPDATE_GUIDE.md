# AI Studio Güncelleme Kılavuzu

## 🎯 Senaryo
Lokal projedeki güncel kodları AI Studio'daki projeye manuel olarak kopyalayacaksın.

## 📋 Güncellenecek Dosyalar

### 1️⃣ Core Files (Mutlaka Güncellenecek)

#### `src/context/AppContext.tsx`
**EN ÖNEMLİ DOSYA** - CORS fix, DEV_MODE, tüm yeni fonksiyonlar burada
- Lokal: `/Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets/src/context/AppContext.tsx`
- AI Studio: `context/AppContext.tsx`
- **Aksiyon:** TAMAMINI kopyala-yapıştır

#### `src/types.ts`
- Lokal: `/Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets/src/types.ts`
- AI Studio: `types.ts`
- **Aksiyon:** TAMAMINI değiştir

#### `src/App.tsx`
- Lokal: `/Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets/src/App.tsx`
- AI Studio: `App.tsx`
- **Aksiyon:** TAMAMINI değiştir

---

### 2️⃣ Dashboard Components (Yeni/Güncel)

#### `src/components/Dashboard/TaskList.tsx`
- Filtering özelliği eklendi
- **Aksiyon:** TAMAMINI değiştir

#### `src/components/Dashboard/TaskDetail.tsx`
- Admin completion özelliği eklendi
- **Aksiyon:** TAMAMINI değiştir

#### `src/components/Dashboard/Sidebar.tsx`
- Clickable editor names eklendi
- **Aksiyon:** TAMAMINI değiştir

#### `src/components/Dashboard/Statistics.tsx`
- ✅ Var mı AI Studio'da? Yoksa YENİ EKLE

#### `src/components/Dashboard/NewTaskModal.tsx`
- File upload improvements
- **Aksiyon:** TAMAMINI değiştir

#### `src/components/Dashboard/SelfTaskModal.tsx`
- ✅ YENİ DOSYA - AI Studio'ya EKLE

---

### 3️⃣ Login Components

#### `src/components/Login/Login.tsx`
- Hero design, Marvel/Galatasaray theme
- **Aksiyon:** TAMAMINI değiştir

---

### 4️⃣ UI Components

#### `src/components/UI/NeumorphButton.tsx`
- ✅ Zaten var mı? Yoksa YENİ EKLE

#### `src/components/UI/NeumorphCard.tsx`
- ✅ Zaten var mı? Yoksa YENİ EKLE

---

### 5️⃣ Config Files

#### `tailwind.config.js`
- Neumorphic shadows, Galatasaray colors
- **Aksiyon:** TAMAMINI değiştir

#### `src/index.css`
- Animations, scrollbar styles
- **Aksiyon:** TAMAMINI değiştir

---

### 6️⃣ Assets (Public)

#### `public/marvel-heroes.png`
- ⚠️ AI Studio'da upload etmen gerekebilir
- Eğer upload alanı varsa ekle

#### `public/galatasaray-logo.png`
- ⚠️ Aynı şekilde upload

---

## 🤖 Daha Kolay Yöntem: GitHub Workflow

AI Studio'yu manuel güncellemek yerine:

### Option A: GitHub Desktop (En Kolay)
```bash
# 1. Lokal projeyi GitHub'a push et
cd /Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets
git init
git add .
git commit -m "TaskFlow v2.0 - Complete rewrite"

# 2. GitHub'da yeni repo oluştur
# 3. Remote ekle
git remote add origin https://github.com/YOUR_USERNAME/taskflow-sheets.git
git push -u origin main

# 4. AI Studio'ya git import et
# Import from GitHub > Repo'yu seç
```

### Option B: ZIP Export/Import
```bash
# 1. Projeyi ziple
cd /Users/yamarenya/.gemini/antigravity/scratch
zip -r taskflow-sheets.zip taskflow-sheets -x "*/node_modules/*" -x "*/.git/*"

# 2. AI Studio'da "Import Project"
# ZIP'i upload et
```

---

## ✅ Manuel Update Checklist (Eğer GitHub kullanmıyorsan)

- [ ] AppContext.tsx güncellendi
- [ ] types.ts güncellendi
- [ ] App.tsx güncellendi
- [ ] TaskList.tsx güncellendi
- [ ] TaskDetail.tsx güncellendi
- [ ] Sidebar.tsx güncellendi
- [ ] Statistics.tsx eklendi (YENİ)
- [ ] NewTaskModal.tsx güncellendi
- [ ] SelfTaskModal.tsx eklendi (YENİ)
- [ ] Login.tsx güncellendi
- [ ] NeumorphButton.tsx eklendi
- [ ] NeumorphCard.tsx eklendi
- [ ] tailwind.config.js güncellendi
- [ ] index.css güncellendi
- [ ] Assets (images) eklendi

---

## 🎯 Önerim

**GitHub workflow kullan!** Çünkü:
- 🚀 Tek seferde tüm dosyalar güncel olur
- 🔄 Versiyonlama var
- 🌐 Direkt Netlify'a bağlanır
- 💾 Backup otomatik

Manuel update çok zahmetli ve hata riski yüksek!

---

## 🆘 Hangi Yöntemi Tercih Edersin?

1. **GitHub** (Önerilen) → Lokal projeyi push, AI Studio import
2. **ZIP** → Projeyi zipleyip AI Studio'ya upload
3. **Manuel** → Her dosyayı tek tek kopyala (Zor!)

Söyle hangisini yapalım! 🚀
