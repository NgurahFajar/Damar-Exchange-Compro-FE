import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Anda dapat menambahkan file terjemahan di sini
const resources = {
  en: {
    translation: {
      home: 'Home',
      "currency": "Currency",
      "converter": "Converter",
      companyProfile: 'Company Profile',
      location: 'Location',
      contact: 'Contact',
      welcome_message: "Welcome to",
      tag_line: "Trusted Solution for Your Foreign Exchange Needs",
      tag_line_deliver: "Deliver to customers' locations",
      tag_line2: "Competitive Rates",
      tag_line3: "Trusted & Officially Licensed",
      tag_line4: "Fast & Professional Service",
      tag_line5: "Multiple Currency Exchange",
      currency_dashboard: "Currency Dashboard",
      competitive_exchange_rate: "Competitive Exchange Rate",
      trusted_and_licensed: "Trusted & Licensed",
      fast_and_professional: "Fast & Professional Service",
      //Location
      "damarExchangeTitle": "Damar {{exchange}} Location",
      //
      location_description: "Visit our office for trusted foreign exchange services",
      operational_hours: "Operational Hours",
      hours: {
        monday_to_sunday: "Mon - Sun: 08:00 - 22:00 WITA"
      },
      //Image Gallery
      office_gallery: "Our Office Gallery",
      office_gallery_description: "Explore our modern and comfortable office space",
      //About
      about_description1: "Damar Exchange is a non-bank foreign exchange company established on December 6, 2024 and has obtained No.ID 1566.199-001/DPR.",
      about_description2: "Damar Exchange is also one of the money changers that provides Delivery Service, offering the option to deliver Indonesian Rupiah or foreign currency to customers' locations.",
      about : "About",
      work_culture: "'SMILE' Work Culture",
      satifaction: "Customer satisfaction is our main goal.",
      Meaningful: "Serving customers sincerely and wholeheartedly.",
      Impressive: "Always providing excellent and memorable service to customers.",
      Leading: "Being at the forefront in terms of professionalism in service.",
      Excellence : "Creating a harmonious work atmosphere and fostering good teamwork.",
      vision_commitment : "Vision & Commitment",
      description_vision_commitment: "We are committed to specializing in the foreign exchange industry by offering money changer services that provide trust, security, and satisfaction for our customers. Our goal is to be recognized as the best foreign exchange company wherever we are.",
      about_message: "PT. Damar Artha Abadi has been a trusted money changer in Indonesia. We pride ourselves on providing competitive rates and exceptional service, ensuring every transaction is transparent with no hidden fees.",
      security_message: "We prioritize our customers' security and peace of mind through our protected transaction environment. We offer exchanges for all major world currencies including USD, EUR, AUD, SGD, JPY, and others, serving diverse international needs.",
      reputation_message: "Our reputation is built on trust, reliability, and highly competitive exchange rates. We maintain a straightforward approach without hidden fees or extra commissions. Whether for small or large transactions, our dedicated team ensures a professional and satisfactory experience.",
      customer_satisfaction: "Customer Satisfaction Priority",
      competitive_rates: "Competitive Rates",
      // Credibility Section
      "credibility": {
        "section_title": "Our Credibility",
        "intro": "Trusted and certified by leading financial institutions",
        "partner_title": "Your Trusted Money Exchange Partner",
        "partner_description": "With over a years of experience in currency exchange services, we maintain the highest standards of security and reliability. Our commitment to excellence is backed by official certifications and licenses from Bank Indonesia, ensuring your transactions are always safe and compliant with regulations.",
        "features": {
          "licensed_by_bank_indonesia": "Licensed by Bank Indonesia",
          "established_since_2024": "Established since 2024",
          "certified_money_changer": "Certified Money Changer"
        }
      },
      // Currency Dashboard
      currency_dashboard_title: "Currency Dashboard",
      currency_dashboard_subtitle: "Stay updated with our real-time exchange rates for all major world currencies. We provide accurate and competitive rates, ensuring you get the best value for your money exchange needs.",
      refresh_rates: "Refresh Rates",
      table_headers: {
        flag: "Flag",
        currency: "Currency",
        name: "Name",
        we_buy: "We Buy",
        we_sell: "We Sell"
      },
      last_updated: "Last updated: {{time}}",
      // Currency Converter Section
      currency_converter: "Currency Converter",
      currency_converter_subtitle: "Convert between IDR and other currencies instantly with real-time exchange rates. Get precise calculations for your transactions.",
      amount: "Amount",
      amount_placeholder: "0.00",
      from: "From",
      to: "To",
      select_currency: "Select currency",
      convert_button: "CONVERT",
      reset: "Reset",
      error_fill_fields: "Please fill in all fields",
      conversion_result: {
        equals: "=",
        exchange_rate: "Exchange Rate",
        currency_pair: {
          first: "1 {{fromCurrency}} =",
          second: "1 {{toCurrency}} ="
        },
        scroll_hint: "← Swipe left or right to see more conversions →",
      },
      // Reviews Section
      customer_reviews: "Customer Reviews",
      customer_reviews_subtitle: "What our customers say about our service",
      view_all_reviews: "Review us on Google Maps →",
      // Review Data
      review_irina: {
        author: "Irina Kapkanova",
        text: "I urgently needed to exchange IDR for EUR. Before coming here, I visited six exchange offices, but none of them had euros. Only here was I able to make the exchange. Thank you so much!"
      },
      review_carlo: {
        author: "Carlo Thielen",
        text: "Legit and fast service. The counting machine shows you how many bills you get. Highly recommend!"
      },
      review_diva: {
        author: "Diva Wira",
        text: "Good and faster service, apriciate to the worker there'r very nice people's"
      },
      review_arpan: {
        author: "Arpan Jain",
        text: "Please do come for currency exchange\nThey offer best rates\nMr ali is a good person"
      },
      review_reksa: {
        author: "Reksa Wijaya",
        text: "The service is very friendly and the rates are also good"
      },
      market_rate_message: "This is for informational purposes only.",
      footer: {
        contact: {
          title: "CONTACT US",
          address: "Address : Jl. Raya Pererenan Tanah Lot No.99, Pererenan, Kec. Mengwi, Kabupaten Badung, Bali 80351"
        },
        links: {
          title: "LINK"
        },

        message: {
          title: "SEND A MESSAGE",
          form: {
            name: "Name",
            subject: "Subject",
            email: "Email",
            message: "Message",
            send: "SEND",
            sending: "SENDING...",
            preview: "PREVIEW"
          },
          status: {
            success: "Message sent successfully!",
            error: "Failed to send message. Please try again."
          },
          preview_modal: {
            title: "Email Preview"
          }
        },
        copyright: "Copyright © {{year}} Damar Exchange. All rights reserved."
      },
      time: {
        to: "to", // "ke" in Indonesian
        last_updated: "Last updated", // "Terakhir diperbarui" in Indonesian
        time: "Time", // "Waktu" in Indonesian
        updated: "Updated" // "Diperbarui" in Indonesian
      }
    },
  },
  id: {
    translation: {
      home: 'Beranda',
      "currency": "Mata Uang",
      "converter": "Konversi",
      companyProfile: 'Profil Perusahaan',
      location: 'Cabang',
      contact: 'Kontak',
      welcome_message: "Selamat Datang di",
      tag_line: "Solusi Terpercaya untuk Kebutuhan Valuta Asing Anda",
      tag_line_deliver: "Mengantarkan ke lokasi pelanggan",
      tag_line2: "Kurs Kompetitif",
      tag_line3: "Terpercaya & Berizin Resmi",
      tag_line4: "Layanan Cepat & Professional",
      tag_line5: "Penukaran Multi Mata Uang",
      currency_dashboard: "Dashboard Mata Uang",
      competitive_exchange_rate: "Kurs Kompetitif",
      trusted_and_licensed: "Terpercaya & Berizin Resmi",
      fast_and_professional: "Layanan Cepat & Profesional",
      //Location
      "damarExchangeTitle": "Lokasi Damar {{exchange}}",
      //Image Gallery
      office_gallery: "Galeri Kantor Kami",
      office_gallery_description: "Jelajahi ruang kantor kami yang modern dan nyaman",
      location_description: "Kunjungi kantor kami untuk layanan penukaran mata uang asing terpercaya",
      operational_hours: "Jam Operasional",
      hours: {
        monday_to_sunday: "Senin - Minggu: 09:00 - 22:00 WITA"
      },
      about_description1: "Damar Exchange adalah perusahan yang bergerak dalam industri valuta asing non-perbankan yang didirikan tanggal 6 desember 2024 dan telah mendapatkan No.ID 1566.199-001/DPR.",
      about_description2: "Damar Exchange juga merupakan salah satu money changer yang dapat memberikan pelayanan pengantaran uang rupiah atau mata uang asing ke tempat para customer.",
      about : "Tentang",
      work_culture: "Budaya Kerja 'SMILE'",
      satifaction: "Kepuasan pelanggan adalah tujuan utama kami.",
      Meaningful: "Melayani pelanggan dengan tulus dan sepenuh hati.",
      Impressive: "Selalu memberikan pelayanan yang prima dan berkesan kepada para pelanggan.",
      Leading: "Menjadi yang terdepan dalam hal profesionalisme pada segi pelayanan.",
      Excellence : "Menciptakan suasana dan hubungan kerja yang harmonis serta kerjasama tim yang baik.",
      vision_commitment : "Visi & Komitmen",
      description_vision_commitment: "Kami memilih untuk mengambil spesialiasasi dalam industri valuta asing dengan menawarkan pelayanan jasa money changer yang memberikan rasa kepercayaan, keamanan dan kepuasan bagi pelanggan. Tujuan kami adalah untuk diakui sebagai perusahaan valuta asing terbaik dimanapun kami berada.",
      about_message: "PT. Damar Artha Abadi telah menjadi money changer terpercaya di Indonesia. Kami bangga dapat memberikan kurs yang kompetitif dan layanan yang istimewa, memastikan setiap transaksi transparan tanpa biaya tersembunyi.",
      security_message: "Kami memprioritaskan keamanan dan ketenangan pikiran pelanggan kami melalui lingkungan transaksi yang terlindungi. Kami menawarkan penukaran untuk semua mata uang utama dunia termasuk USD, EUR, AUD, SGD, JPY, dan lainnya, melayani berbagai kebutuhan internasional.",
      reputation_message: "Reputasi kami dibangun atas dasar kepercayaan, keandalan, dan kurs yang sangat kompetitif. Kami menerapkan pendekatan yang lugas tanpa biaya tersembunyi atau komisi tambahan. Baik untuk transaksi kecil maupun besar, tim kami yang berdedikasi memastikan pengalaman yang profesional dan memuaskan.",
      customer_satisfaction: "Kepuasan Pelanggan NO.1",
      competitive_rates: "Tarif Kompetitif",
      // Currency Dashboard
      currency_dashboard_title: "Dashboard Mata Uang",
      currency_dashboard_subtitle: "Dapatkan informasi terkini tentang nilai tukar mata uang dunia secara real-time. Kami menyediakan kurs yang akurat dan kompetitif, memastikan Anda mendapatkan nilai terbaik untuk kebutuhan penukaran uang Anda.",
      refresh_rates: "Perbarui Kurs",
      table_headers: {
        flag: "Bendera",
        currency: "Mata Uang",
        name: "Nama",
        we_buy: "Kami Beli",
        we_sell: "Kami Jual"
      },
      last_updated: "Terakhir diperbarui: {{time}}",
      // Credibility Section
      "credibility": {
        "section_title": "Kredibilitas Kami",
        "intro": "Dipercaya dan tersertifikasi oleh institusi keuangan terkemuka",
        "partner_title": "Partner Penukaran Uang Terpercaya Anda",
        "partner_description": "Dengan pengalaman dalam layanan penukaran mata uang, kami menjaga standar tertinggi keamanan dan keandalan. Komitmen kami terhadap keunggulan didukung oleh sertifikasi dan lisensi resmi dari Bank Indonesia, memastikan transaksi Anda selalu aman dan sesuai dengan peraturan.",
        "features": {
          "licensed_by_bank_indonesia": "Berlisensi Bank Indonesia",
          "established_since_2024": "Berdiri sejak 2024",
          "certified_money_changer": "Money Changer Tersertifikasi"
        }
      },
      // Currency Converter Section
      currency_converter: "Konverter Mata Uang",
      currency_converter_subtitle: "Konversikan antara IDR dan mata uang lainnya secara instan dengan kurs real-time. Dapatkan perhitungan yang akurat untuk transaksi Anda.",
      amount: "Jumlah",
      amount_placeholder: "0,00",
      from: "Dari",
      to: "Ke",
      select_currency: "Pilih mata uang",
      convert_button: "KONVERSI",
      reset: "Reset",
      error_fill_fields: "Harap isi semua kolom",
      conversion_result: {
        equals: "=",
        exchange_rate: "Kurs",
        currency_pair: {
          first: "1 {{fromCurrency}} =",
          second: "1 {{toCurrency}} ="
        },
        scroll_hint: "← Geser ke kiri atau kanan untuk melihat konversi lainnya →",
      },
      // Reviews Section
      customer_reviews: "Ulasan Pelanggan",
      customer_reviews_subtitle: "Apa kata pelanggan tentang layanan kami",
      view_all_reviews: "Ulas kami di Google Maps →",

      // Review Data
      review_irina: {
        author: "Irina Kapkanova",
        text: "Saya sangat membutuhkan penukaran IDR ke EUR. Sebelum ke sini, saya mengunjungi enam tempat penukaran uang, tapi tidak ada yang memiliki euro. Hanya di sini saya bisa menukar. Terima kasih banyak!"
      },
      review_carlo: {
        author: "Carlo Thielen",
        text: "Layanan yang sah dan cepat. Mesin penghitung menunjukkan berapa lembar uang yang Anda dapatkan. Sangat direkomendasikan!"
      },
      review_diva: {
        author: "Diva Wira",
        text: "Layanan bagus dan cepat, apresiasi untuk pekerja di sana yang sangat ramah"
      },
      review_arpan: {
        author: "Arpan Jain",
        text: "Silakan datang untuk penukaran mata uang\nMereka menawarkan kurs terbaik\nPak Ali adalah orang yang baik"
      },
      review_reksa: {
        author: "Reksa Wijaya",
        text: "Layanannya sangat ramah dan kursnya juga bagus"
      },
      market_rate_message: "Ini hanya untuk tujuan informasi saja.",
      footer: {
        contact: {
          title: "HUBUNGI KAMI",
          address: "Alamat : Jl. Raya Pererenan Tanah Lot No.99, Pererenan, Kec. Mengwi, Kabupaten Badung, Bali 80351"
        },
        links: {
          title: "TAUTAN"
        },
        message: {
          title: "KIRIM PESAN",
          form: {
            name: "Nama",
            subject: "Subjek",
            email: "Email",
            message: "Pesan",
            send: "KIRIM",
            sending: "MENGIRIM...",
            preview: "PRATINJAU"
          },
          status: {
            success: "Pesan berhasil dikirim!",
            error: "Gagal mengirim pesan. Silakan coba lagi."
          },
          preview_modal: {
            title: "Pratinjau Email"
          }
        },
        copyright: "Hak Cipta © {{year}} Damar Exchange. Seluruh hak dilindungi."
      },
      time: {
        to: "ke", // "ke" in Indonesian
        last_updated: "Terakhir diperbarui", // "Terakhir diperbarui" in Indonesian
        time: "Pukul", // "Waktu" in Indonesian
        updated: "Diperbarui" // "Diperbarui" in Indonesian
      }
    },
  },
};

i18n
  .use(initReactI18next) // Menghubungkan i18next dengan React
  .init({
    resources,
    lng: 'en', // Bahasa default
    fallbackLng: 'en', // Bahasa cadangan jika tidak ditemukan
    interpolation: {
      escapeValue: false, // React sudah meng-handle escaping
    },
  });

export default i18n;
