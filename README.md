# PrepMaster 🍽️

PrepMaster, kullanıcıların yapay zeka desteğiyle yemek tarifleri ve hazırlık süreçlerini yönetmelerini sağlayan modern bir web uygulamasıdır. Gelişmiş AI entegrasyonu sayesinde kişiselleştirilmiş tarif önerileri sunar ve kullanıcı dostu arayüzüyle mutfak deneyimini bir üst seviyeye taşır.

## 🚀 Özellikler

* **Yapay Zeka Destekli Tarifler:** Groq API entegrasyonu ile akıllı ve hızlı tarif üretimi.
* **Dinamik ve Akıcı Kullanıcı Arayüzü:** Framer Motion kullanılarak hazırlanmış, göze hitap eden animasyonlar ve geçişler.
* **Güvenilir Veritabanı Yönetimi:** Firebase altyapısı ile hızlı ve güvenli veri depolama/kullanıcı yönetimi.
* **Canlı Yayın (Deployment):** Vercel üzerinden kesintisiz ve hızlı erişim.

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React / Next.js (Framer Motion ile)
* **Backend / Database:** Firebase
* **Yapay Zeka Entegrasyonu:** Groq API
* **Deployment:** Vercel

## ⚙️ Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda (local) çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/sameddcicekk/PrepMaster.git
   ```

2. **Dizin İçine Girin:**
   ```bash
   cd prepmaster
   ```

3. **Gerekli Paketleri Yükleyin:**
   ```bash
   npm install
   ```
   *(Eğer hata alırsanız `framer-motion` ve `firebase` paketlerinin doğru yüklendiğinden emin olun.)*

4. **Çevresel Değişkenleri (Environment Variables) Ayarlayın:**
   Ana dizinde bir `.env.local` dosyası oluşturun ve aşağıdaki anahtarları kendi bilgilerinizle doldurun:
   ```env
   GROQ_API_KEY=senin_groq_api_anahtarin
   NEXT_PUBLIC_FIREBASE_API_KEY=senin_firebase_api_anahtarin
   ```

5. **Projeyi Başlatın:**
   ```bash
   npm run dev
   ```
   Proje `http://localhost:3000` adresinde çalışmaya başlayacaktır.

## 🌐 Canlı Demo

Projenin canlı ve çalışan haline buradan ulaşabilirsiniz: **[PrepMaster Canlı Demo Linki](https://prep-master-zeta.vercel.app/)**

---
*Geliştirme süreci ve güncellemeler devam etmektedir.*
