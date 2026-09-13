# 🎨 Pikso - Şekil, Renk ve Eşleme Tanıma Oyunu

**Pikso**, React Native ve Expo ile geliştirilmiş; kullanıcının sesli/yazılı ipuçlarına göre doğru **Şekil**, **Renk** veya **Kavramsal Benzerlik / Çağrışım** nesnesini bulduğu, tamamen **%100 internetsiz (çevrimdışı / offline)** çalışan, giderek zorlaşan, tatlı ve sade (pastel minimalist) tasarıma sahip eğlenceli bir mobil oyundur.

---

## 🌟 Temel Özellikler

- **⚡ %100 Çevrimdışı (Offline-First):** Harici hiçbir API veya internet bağlantısına ihtiyaç duymaz. Tüm sesler, 40+ kavramlık offline Türkçe kelime ve çağrışım kütüphanesi, şekil üreteçleri ve skor veritabanı cihaz içinde çalışır.
- **🎯 3 Farklı Tanıma & Eşleştirme Modu:**
  - **Şekil & Renk Avı:** *"Mavi Üçgeni bul!"*, *"Sarı Yıldızı seç!"*, *"Daire olmayan şekli bul!"* (Negasyon / Dikkat çeldiricileri).
  - **Benzerlik & Çağrışım:** *"Yazın külaha konan tatlı lezzet"* 🍦, *"Göklerde süzülen kanatlı dost"* 🕊️, *"Geceleri parlayan hilal"* 🌙 gibi yaratıcı ipuçları.
  - **Karma & Mantık:** *"Köşesi olmayan ve Mavi olanı seç!"*, *"Dört kenarı olan şekli bul!"*.
- **📈 Kademeli Zorluk (Progressive Difficulty):**
  - Seviye ilerledikçe seçenek sayısı 3'ten 6'ya çıkar.
  - Yanıtlama süresi 18-14 saniyeden kademeli olarak 6-4 saniyeye iner.
  - Kombo çarpanı (`1.0x` -> `1.2x` -> `1.5x` -> `2.0x` -> `2.5x`) devreye girer.
  - Her 5 seride oyuncu +1 ekstra can ödülü kazanır.
- **🎵 Ses & Müzik Motoru:**
  - Özel oluşturulmuş döngüsel dinlendirici tatlı oyun fon müziği (`bgm.wav`).
  - Doğru/yanlış ve buton tıkı ses efektleri (`correct.wav`, `wrong.wav`, `click.wav`, `gameover.wav`).
  - Ayarlar menüsünden bağımsız olarak müzik ve ses efektleri açılıp kapatılabilir.
- **⚙️ Ayarlar & Skor Kaydı:**
  - Kolay / Orta / Zor başlangıç modu seçimi.
  - Her zorluk seviyesi için ayrı kaydedilen offline rekor skorlar (`AsyncStorage`).
  - Dokunsal titreşim (Haptic) ayarı ve skor sıfırlama.
- **🍬 Tatlı & Sade UI (Pastel Minimalist):**
  - Yumuşak bulut beyazı, pastel mor, şeftali, mint yeşili ve bal sarısı renk paleti.
  - Dokunma geri bildirimli, kabarık ve yaylı (spring) buton animasyonları.
  - Görsel can göstergesi (HeartBar) ve akıcı zaman çubuğu (TimerBar).

---

## 🏛️ Mimari Yapı: AAP & SOLID

Proje kullanıcı kurallarına uygun olarak **Reusable - SOLID - AAP (Atomic Architecture Pattern)** yapısına göre modüler tasarlanmıştır:

```
src/
├── core/
│   ├── types/                  # Domain tipleri (game.ts, audio.ts, settings.ts)
│   ├── constants/              # Renkler, şekiller, kavramlar ve seviye kuralları
│   └── storage/                # AsyncStorage wrapper (StorageService.ts)
├── engine/                     # Saf iş mantığı ve algoritmalar
│   └── QuestionGenerator.ts    # Şekil, renk ve çağrışım soruları üreten motor
├── services/                   # Harici servis soyutlamaları
│   └── SoundManager.ts         # Expo Audio ile döngüsel BGM ve düşük gecikmeli SFX
├── context/                    # Dependency Inversion ve durum yönetimi
│   ├── SettingsContext.tsx     # Kullanıcı tercihleri ve rekorlar
│   ├── AudioContext.tsx        # Ses kontrolü ve tık tınıları
│   └── GameContext.tsx         # Oyun döngüsü, skor, seri, can ve süre kontrolü
├── components/                 # Atomic Architecture Pattern (AAP)
│   ├── atoms/                  # AppButton, AppText, ShapeRenderer, HeartBar, TimerBar, Badge
│   ├── molecules/              # AnswerCard, ScoreBoard, SettingToggleRow
│   └── organisms/              # GameHeader, QuestionBoard, GameOverModal, SettingsModal, PauseModal
├── screens/
│   ├── HomeScreen.tsx          # Ana Sayfa (Maskot, Rekor, Başlat, Ayarlar, Rehber)
│   └── GameScreen.tsx          # Aktif Oyun Alanı ve HUD
└── theme/                      # Tasarım sistemi ve pastel renk paleti
    └── theme.ts
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler:
- Node.js (v18+)
- npm veya yarn

### Adımlar:
```bash
# Bağımlılıkları yükleyin
npm install

# Ses dosyalarını oluşturun (gerekirse)
npm run generate-sounds

# Expo geliştirici sunucusunu başlatın
npx expo start
```

### Komutlar:
- `npm run android` - Android cihazda / emülatörde çalıştırır
- `npm run ios` - iOS simülatöründe çalıştırır
- `npm run web` - Tarayıcıda çalıştırır
- `npx tsc --noEmit` - TypeScript tip doğrulaması yapar

---

## 🔄 CI/CD Pipeline

Proje, GitHub Actions (`.github/workflows/ci.yml`) üzerinde her `master` branch push ve PR işleminde:
1. Node.js ve önbellek yapılandırmasını doğrular.
2. Temiz bağımlılık kurulumunu yapar (`npm ci`).
3. TypeScript statik tip kontrollerini eksiksiz denetler (`npx tsc --noEmit`).

---

## 📄 Lisans
MIT License.
