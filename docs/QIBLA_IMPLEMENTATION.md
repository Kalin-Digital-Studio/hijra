# Arah Kiblat

Arah awal lingkaran besar dihitung dengan atan2 menuju lintang 21.4225° N dan bujur 39.8262° E, dinormalisasi ke 0–360° dari utara sejati. [Rujukan perhitungan dan koordinat](https://www.geomete.com/abdali/papers/qibcomp.pdf). Uji numerik mencakup Jakarta sekitar 295.15° dan New York 58.48°.

Input koordinat bisa digunakan offline. [Expo Location SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/location/) menyediakan lokasi foreground dan heading di Expo Go, dengan izin hanya saat pengguna menekan tombol. Tidak ada background task. Heading sejati diprioritaskan. Heading magnetik ditandai sebagai perkiraan tanpa koreksi deklinasi. Arah statis tersedia jika sensor gagal. Heading dihaluskan lewat selisih sudut terpendek, dengan pembersihan langganan ketika layar kehilangan fokus atau aplikasi masuk background. Pengujian orientasi, izin, kalibrasi, dan sensor pada perangkat fisik masih terbuka.
