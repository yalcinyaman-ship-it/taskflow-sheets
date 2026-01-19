# GitHub Private Repo Push Kılavuzu

## 🔴 Problem
Private repo olduğu için terminal'den push authentication hatası veriyor.

## ✅ Çözüm 1: GitHub Desktop (ÖNERİLEN)

### Adımlar:
1. **GitHub Desktop'ı İndir/Aç**
   - https://desktop.github.com/

2. **Add Repository**
   - File > Add Local Repository
   - Choose: `/Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets`

3. **Publish**
   - Sol üstte "Publish repository" butonunu gör
   - İsim: `taskflow-sheets`
   - ✅ "Keep this code private" işaretle
   - Publish!

4. **✅ Bitti!**
   - GitHub'da repo'yu gör: https://github.com/yalcinyaman-ship-it/taskflow-sheets

---

## ✅ Çözüm 2: Personal Access Token (Terminal)

Eğer GitHub Desktop kullanamıyorsan:

### 1. Token Oluştur
1. GitHub > Settings > Developer settings
2. Personal access tokens > Tokens (classic)
3. Generate new token (classic)
4. Name: `taskflow-deploy`
5. Scopes: **`repo`** (tümünü işaretle)
6. Generate token
7. **TOKEN'İ KOPYALA** (bir daha göremezsin!)

### 2. Terminal'de Kullan
```bash
cd /Users/yamarenya/.gemini/antigravity/scratch/taskflow-sheets

# Remote URL'i token'la güncelle
git remote set-url origin https://TOKEN@github.com/yalcinyaman-ship-it/taskflow-sheets.git

# Push
git push -u origin main
```

**TOKEN yerine gerçek token'i yapıştır!**

---

## ✅ Çözüm 3: SSH Key (İleri Seviye)

### 1. SSH Key Oluştur
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Enter basarak devam et
```

### 2. SSH Key'i GitHub'a Ekle
```bash
# Public key'i clipboard'a kopyala
pbcopy < ~/.ssh/id_ed25519.pub
```

1. GitHub > Settings > SSH and GPG keys
2. New SSH key
3. Yapıştır
4. Add SSH key

### 3. Remote URL'i SSH'a Çevir
```bash
git remote set-url origin git@github.com:yalcinyaman-ship-it/taskflow-sheets.git
git push -u origin main
```

---

## 🎯 Hangi Yöntem?

**→ GitHub Desktop** = En kolay, 2 dakika  
**→ Token** = Hızlı ama token saklamak gerekiyor  
**→ SSH** = One-time setup, sonra rahat

**ÖNERİM: GitHub Desktop kullan!** 🚀
