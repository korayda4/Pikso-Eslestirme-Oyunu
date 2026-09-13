# 📸 Pikso - Kamera ile Şekil, Renk & Yüz İfadesi Avı Oyunu

**Pikso**, React Native ve Expo ile geliştirilmiş; kullanıcının etrafındaki **Renkleri**, **Eşyaları**, **Şekilleri** ve **Komik Yüz İfadelerini** gerçek kamera ile bulup fotoğrafladığı, tamamen **%100 internetsiz (çevrimdışı / offline)** çalışan, yapay zeka tabanlı benzerlik analizi yapan, tatlı ve sade (pastel minimalist) tasarıma sahip eğlenceli bir mobil oyundur.

---

## 🌟 Temel Özellikler

- **⚡ %100 Çevrimdışı (Offline-First):**
  - Harici hiçbir sunucu veya internet bağlantısı gerektirmez.
  - Fotoğraflar cihaz üzerinde yerel algoritmalar ile taranır, renk yoğunlukları ve mimik benzerlik oranları anında hesaplanır.
- **🎯 4 Farklı Dedektiflik & Görev Kategorisi:**
  - **🔴 Renk Avı:** *"Kırmızı bir eşya bul!"*, *"Yeşil bir bitki veya yaprak yakala!"*, *"Sarı veya altın tonları bul!"*
  - **😜 Komik Yüz & Mimik Pozları:** *"Dilini dışarı çıkar ve şaşı bak!"*, *"Ağzını kocaman açıp şok yüzü yap!"*, *"Filozof gibi tavana bak!"*, *"Kedi gibi yanaklarını şişir!"*
  - **☕ Ev & Oda Eşyaları:** *"Kahve kupası veya bardak bul!"*, *"Ayakkabı veya terlik yakala!"*, *"Elektronik ekran veya kumanda çek!"*
  - **📐 Şekiller:** *"Dört köşeli kitap veya defter bul!"*, *"Tamamen yuvarlak bir kapak veya tabak yakala!"*
- **📊 Yapay Zeka Benzerlik Analizi & Komik Yorumlar:**
  - Fotoğraf çekildiğinde `%62` ile `%98` arasında gerçekçi bir **Benzerlik Oranı** hesaplanır.
  - Göreve özel esprili ve tatlı geri bildirim mesajları verilir (*"Kahkaha Krizi! Jüri bu komik yüze bayıldı!"*, *"Şahin Gözler! Aradığımız kırmızı tonu parlıyor!"*).
- **🛡️ %100 Expo Go Uyumlu & Çökmesiz (Zero-Crash) Mimari:**
  - `expo-av` kaynaklı `Cannot find native module ExponentAV` hatası tamamen kaldırıldı.
  - Yerleşik sıfır-bağımlılıklı haptik titreşim motoru ile kusursuz dokunma hissi.
- **📱 Safe Area ve Tatlı UI:**
  - `react-native-safe-area-context` ile çentikler ve alt barlar düşünülerek tasarlandı.
  - Yumuşak pastel renkler, kabarık butonlar ve akıcı animasyonlar.

---

## 🚀 Çalıştırma

```bash
cd "d:\React Native Projeleri\pikso"
npx expo start --tunnel
```
Ekranda çıkan QR kodu telefonunuzdaki **Expo Go** uygulaması ile okutarak anında kameranızı açıp oynayabilirsiniz!

---

## 📄 Lisans
MIT License.
