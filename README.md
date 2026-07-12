# PrepMaster 🍽️

PrepMaster, kullanıcıların hem mutfak stoklarını akıllıca yönetmelerini hem de yapay zeka desteğiyle yemek tarifleri planlamalarını sağlayan kapsamlı ve modern bir web uygulamasıdır. Gelişmiş stok takibi ve AI entegrasyonu sayesinde mutfak deneyimini dijitalleştirirken gıda israfının da önüne geçmeyi hedefler.

## 🚀 Özellikler

* **Gelişmiş Stok ve Envanter Takibi:** Mutfaktaki veya kilerdeki ürünlerinizi sisteme ekleyerek mevcut durumlarını ve miktarlarını detaylı bir şekilde kontrol edebilirsiniz.
* **Akıllı Uyarı Sistemi:** Son kullanma tarihi yaklaşan ürünler ve tükenmekte olan stoklar için otomatik bildirimler alarak israfı önler ve eksikleri zamanında fark edersiniz.
* **Yapay Zeka Destekli Tarifler:** Groq API entegrasyonu ile elinizdeki malzemelere uygun, pratik ve kişiselleştirilmiş tarif alternatifleri anında üretilir.
* **Dinamik ve Akıcı Kullanıcı Arayüzü:** Framer Motion kullanılarak hazırlanmış, göze hitap eden animasyonlar ve pürüzsüz geçişler ile üst düzey kullanıcı deneyimi.
* **Güvenilir Veritabanı Yönetimi:** Firebase altyapısı ile hızlı, güvenli veri depolama ve gerçek zamanlı senkronizasyon.
* **Canlı Yayın (Deployment):** Vercel üzerinden kesintisiz, güvenli ve hızlı erişim.

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React / Next.js (Framer Motion ile)
* **Backend / Database:** Firebase
* **Yapay Zeka Entegrasyonu:** Groq API
* **Deployment:** Vercel

## ⚙️ Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda (local) çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Projeyi Klonlayın:**
   ```bash
   git clone [https://github.com/sameddcicekk/PrepMaster.git](https://github.com/sameddcicekk/PrepMaster.git)
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
