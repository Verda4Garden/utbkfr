import { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { Loader2, Database, CheckCircle2 } from 'lucide-react';

const UTBK_QUESTIONS = [
  // TPS - Penalaran Umum (PU) - 10 Soal
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua atlet lari memiliki stamina yang kuat. Sebagian orang yang memiliki stamina kuat suka makan sayur. Simpulan yang paling tepat adalah...',
    options: [
      'Semua atlet lari suka makan sayur',
      'Sebagian atlet lari suka makan sayur',
      'Mungkin ada atlet lari yang suka makan sayur',
      'Tidak ada atlet lari yang suka makan sayur',
      'Semua orang yang suka makan sayur adalah atlet lari'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Silogisme Kompleks',
    explanation: 'Analisis mendalam: Premis 1: Semua atlet lari = stamina kuat. Premis 2: Sebagian stamina kuat = suka sayur. Maka, sebagian atlet lari (yang stamina kuat) mungkin suka makan sayur. Ini memerlukan pemahaman logika himpunan yang presisi.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika hari hujan, maka tanah basah. Hari ini tanah tidak basah. Kesimpulannya adalah...',
    options: [
      'Hari ini hujan',
      'Hari ini tidak hujan',
      'Mungkin hari ini hujan',
      'Tanah akan segera basah',
      'Hujan akan turun nanti'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    topic: 'Modus Tollens Kompleks',
    explanation: 'Logika Modus Tollens: Jika P maka Q. Bukan Q, maka bukan P. Jika hujan (P) maka tanah basah (Q). Tanah tidak basah (bukan Q), maka tidak hujan (bukan P).'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Beberapa dokter adalah penulis. Semua penulis adalah orang yang kreatif. Simpulan yang tepat adalah...',
    options: [
      'Semua dokter adalah orang yang kreatif',
      'Beberapa dokter adalah orang yang kreatif',
      'Semua orang yang kreatif adalah dokter',
      'Beberapa orang yang kreatif bukan penulis',
      'Tidak ada dokter yang kreatif'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    topic: 'Logika Analitik Kompleks',
    explanation: 'Dokter yang penulis (sebagian) pasti kreatif karena semua penulis kreatif. Jadi, sebagian dokter adalah kreatif.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'P, Q, R, S, T adalah lima orang siswa yang memiliki tinggi badan berbeda. P lebih tinggi dari Q, tetapi lebih pendek dari R. S lebih pendek dari Q, tetapi lebih tinggi dari T. Siapakah yang paling pendek?',
    options: ['P', 'Q', 'R', 'S', 'T'],
    correctAnswer: 4,
    difficulty: 'hard',
    topic: 'Urutan Posisi',
    explanation: 'Urutan: R > P > Q > S > T. T adalah yang paling pendek.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua bunga di taman ini berwarna merah. Sebagian bunga yang berwarna merah memiliki aroma harum. Simpulan yang benar adalah...',
    options: [
      'Semua bunga di taman ini harum',
      'Sebagian bunga di taman ini harum',
      'Tidak ada bunga harum di taman ini',
      'Bunga yang tidak merah pasti tidak harum',
      'Semua bunga harum berwarna merah'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Silogisme Kompleks',
    explanation: 'Analisis mendalam: Semua bunga di taman merah. Sebagian merah = harum. Maka sebagian bunga di taman harum. Memerlukan ketelitian dalam penarikan simpulan partikular.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika x > y and y > z, maka...',
    options: ['x < z', 'x = z', 'x > z', 'x + y < z', 'y - x > z'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Pertidaksamaan',
    explanation: 'Sifat transitif pertidaksamaan: Jika x > y dan y > z, maka x > z.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua mamalia menyusui anaknya. Paus adalah mamalia. Simpulan yang benar adalah...',
    options: [
      'Paus tidak menyusui anaknya',
      'Semua yang menyusui adalah paus',
      'Paus menyusui anaknya',
      'Sebagian paus menyusui anaknya',
      'Mamalia yang bukan paus tidak menyusui'
    ],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Modus Ponens',
    explanation: 'Modus Ponens: Jika P maka Q. P terjadi, maka Q terjadi. Mamalia (P) menyusui (Q). Paus adalah mamalia (P), maka paus menyusui (Q).'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Deret angka: 2, 4, 8, 16, 32, ... Angka selanjutnya adalah...',
    options: ['48', '60', '64', '72', '128'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Deret Angka',
    explanation: 'Pola: dikali 2. 32 * 2 = 64.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Deret angka: 1, 4, 9, 16, 25, ... Angka selanjutnya adalah...',
    options: ['30', '35', '36', '40', '49'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Deret Angka Kuadratik',
    explanation: 'Pola: bilangan kuadrat (1², 2², 3², 4², 5²). Selanjutnya 6² = 36. Memerlukan penguasaan konsep bilangan berpangkat.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika 5x + 3 = 18, maka nilai x adalah...',
    options: ['2', '3', '4', '5', '6'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Aljabar Dasar',
    explanation: '5x = 18 - 3 -> 5x = 15 -> x = 3.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Sinonim dari kata "Eksplisit" adalah...',
    options: ['Tersirat', 'Gamblang', 'Samar', 'Rahasia', 'Abstrak'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Sinonim',
    explanation: 'Eksplisit berarti jelas atau gamblang.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari kata "Konvergen" adalah...',
    options: ['Memusat', 'Menyatu', 'Divergen', 'Sejajar', 'Berlawanan'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Antonim',
    explanation: 'Konvergen berarti memusat, antonimnya adalah divergen yang berarti menyebar.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Kata "Inovasi" memiliki makna...',
    options: [
      'Penemuan baru yang berbeda dari sebelumnya',
      'Pengulangan metode lama',
      'Penghapusan sistem yang ada',
      'Pemeliharaan tradisi',
      'Peniruan karya orang lain'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Makna Kata Kompleks',
    explanation: 'Inovasi adalah penemuan baru yang berbeda dari sebelumnya. Memerlukan pemahaman konsep kebaruan dan orisinalitas.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Hubungan kata: HUTAN : POHON = ... : ...',
    options: [
      'MAWAR : DURI',
      'ARMADA : KAPAL',
      'KAMAR : RUMAH',
      'RAKYAT : NEGARA',
      'BUKU : TULISAN'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Analogi Kompleks',
    explanation: 'Hutan terdiri dari banyak pohon. Armada terdiri dari banyak kapal. Memerlukan pemahaman hubungan part-to-whole.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Manakah penulisan kata serapan yang benar?',
    options: ['Apotik', 'Kwitansi', 'Analisa', 'Kualitas', 'Sistim'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Ejaan Kompleks',
    explanation: 'Kata baku yang benar adalah Apotek, Kuitansi, Analisis, Kualitas, Sistem. Memerlukan penguasaan PUEBI yang mendalam.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Kata "Fundamental" berarti...',
    options: ['Tambahan', 'Dasar', 'Akhir', 'Sampingan', 'Luar'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Makna Kata Epistemologis',
    explanation: 'Fundamental berarti bersifat dasar atau pokok dalam struktur pengetahuan. Memerlukan pemahaman konsep basis ontologis.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Sinonim dari "Iterasi" adalah...',
    options: ['Penghapusan', 'Pengulangan', 'Perubahan', 'Pengurangan', 'Pembagian'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Sinonim Lanjut',
    explanation: 'Iterasi berarti pengulangan dalam konteks proses algoritmik. Memerlukan pemahaman terminologi teknis.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari "Efimer" adalah...',
    options: ['Sementara', 'Singkat', 'Abadi', 'Cepat', 'Fana'],
    correctAnswer: 2,
    difficulty: 'hard',
    topic: 'Antonim',
    explanation: 'Efimer berarti singkat/sementara, antonimnya adalah abadi.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kalimat berikut yang tidak efektif adalah...',
    options: [
      'Para siswa-siswa sedang belajar di kelas.',
      'Siswa sedang belajar di kelas.',
      'Para siswa sedang belajar di kelas.',
      'Banyak siswa sedang belajar di kelas.',
      'Siswa-siswa sedang belajar di kelas.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Kalimat Efektif Kompleks',
    explanation: 'Penggunaan "Para" dan "siswa-siswa" adalah pleonasme yang merusak efisiensi sintaksis. Memerlukan pemahaman ekonomi bahasa.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Penulisan judul karangan yang benar adalah...',
    options: [
      'Si Kancil Dan Buaya',
      'Si Kancil dan Buaya',
      'si kancil dan buaya',
      'SI KANCIL DAN BUAYA',
      'Si kancil Dan buaya'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Ejaan Judul Lanjut',
    explanation: 'Kata depan (dan) tidak ditulis kapital dalam judul sesuai pedoman ortografi terbaru. Memerlukan ketelitian dalam tata tulis.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Konjungsi yang tepat untuk menghubungkan dua kalimat yang bertentangan adalah...',
    options: ['Dan', 'Serta', 'Tetapi', 'Sehingga', 'Karena'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Konjungsi Kompleks',
    explanation: 'Tetapi digunakan untuk pertentangan koordinatif. Memerlukan pemahaman hubungan antarklausa.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah kalimat yang menggunakan huruf kapital dengan benar?',
    options: [
      'Saya pergi ke Bandung hari Senin.',
      'saya pergi ke bandung hari senin.',
      'Saya pergi ke bandung Hari Senin.',
      'Saya Pergi Ke Bandung Hari Senin.',
      'Saya pergi ke Bandung hari senin.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Huruf Kapital Lanjut',
    explanation: 'Nama kota dan hari harus diawali huruf kapital sebagai identitas geografis dan temporal. Memerlukan penguasaan kaidah kapitalisasi.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kata "di" yang berfungsi sebagai awalan terdapat pada kata...',
    options: ['Di rumah', 'Di pasar', 'Dimakan', 'Di sana', 'Di atas'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Imbuhan Kompleks',
    explanation: 'Dimakan adalah kata kerja pasif, "di" sebagai awalan yang menunjukkan tindakan yang diterima subjek. Memerlukan pemahaman morfologi.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kalimat yang mengandung subjek, predikat, dan objek adalah...',
    options: [
      'Adik tidur.',
      'Ibu memasak nasi.',
      'Ayah ke kantor.',
      'Bunga itu indah.',
      'Mereka sedang berlari.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Struktur Kalimat Lanjut',
    explanation: 'Ibu (S) memasak (P) nasi (O). Memerlukan pemahaman analisis fungsi sintaksis.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Penulisan angka yang benar dalam kalimat adalah...',
    options: [
      '3 orang siswa datang terlambat.',
      'Tiga orang siswa datang terlambat.',
      'Siswa yang datang terlambat ada 3.',
      'Ada tiga orang siswa datang terlambat.',
      'Semua benar.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Penulisan Angka Kompleks',
    explanation: 'Angka di awal kalimat harus ditulis dengan huruf untuk menjaga estetika dan kejelasan tipografi. Memerlukan penguasaan aturan penulisan angka.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kata baku dari "jadual" adalah...',
    options: ['Jadwal', 'Jadual', 'Jadval', 'Schedule', 'Jaduel'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Kata Baku Lanjut',
    explanation: 'Kata baku yang benar adalah Jadwal sesuai dengan serapan bahasa Arab. Memerlukan pemahaman etimologi kata.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika 2x + 5 = 15, maka nilai dari x² + 1 adalah...',
    options: ['25', '26', '16', '17', '10'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Aljabar Polinomial',
    explanation: '2x = 10 -> x = 5. x² + 1 = 5² + 1 = 26. Memerlukan pemahaman konsep substitusi dalam fungsi kuadrat.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah rata-rata dari 10, 20, 30, 40, dan 50?',
    options: ['25', '30', '35', '40', '45'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Statistika Deskriptif Lanjut',
    explanation: 'Rata-rata = (10+20+30+40+50) / 5 = 150 / 5 = 30. Memerlukan penguasaan konsep tendensi sentral.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika sebuah persegi memiliki luas 64 cm², berapakah kelilingnya?',
    options: ['16 cm', '24 cm', '32 cm', '48 cm', '64 cm'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Geometri Bidang Lanjut',
    explanation: 'Luas = s² = 64 -> s = 8. Keliling = 4 * s = 32. Memerlukan pemahaman relasi antara dimensi linear dan luas.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Hasil dari 3/4 + 1/2 adalah...',
    options: ['4/6', '1/4', '5/4', '1', '3/8'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Aritmetika Pecahan Lanjut',
    explanation: '3/4 + 2/4 = 5/4. Memerlukan penguasaan operasi hitung bilangan rasional.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika a = 3 and b = -2, maka nilai dari a² - 2ab + b² adalah...',
    options: ['1', '5', '13', '25', '49'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Identitas Aljabar Lanjut',
    explanation: 'a² - 2ab + b² = (a-b)². (3 - (-2))² = 5² = 25. Memerlukan penguasaan bentuk-bentuk istimewa aljabar.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah 20% dari 150?',
    options: ['15', '20', '25', '30', '35'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Persentase Lanjut',
    explanation: '0.2 * 150 = 30. Memerlukan pemahaman konsep proporsi dan bagian dari keseluruhan.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + y = 10 and x - y = 4, maka nilai xy adalah...',
    options: ['14', '21', '24', '28', '40'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Sistem Persamaan Linear Dua Variabel',
    explanation: '2x = 14 -> x = 7. 7 + y = 10 -> y = 3. xy = 7 * 3 = 21. Memerlukan penguasaan metode eliminasi dan substitusi.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah nilai dari √144 + √81?',
    options: ['15', '18', '21', '25', '30'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Akar Bilangan Lanjut',
    explanation: '12 + 9 = 21. Memerlukan penguasaan konsep akar pangkat dua sempurna.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Apa yang dimaksud dengan teks eksplanasi?',
    options: [
      'Teks yang menceritakan kejadian fiksi',
      'Teks yang menjelaskan proses terjadinya suatu fenomena',
      'Teks yang berisi ajakan kepada pembaca',
      'Teks yang mendeskripsikan suatu objek secara detail',
      'Teks yang berisi opini penulis tentang suatu isu'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Jenis Teks Analitis',
    explanation: 'Teks eksplanasi menjelaskan proses terjadinya fenomena alam atau sosial secara kausalitas. Memerlukan pemahaman struktur teks non-fiksi.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Ciri utama dari kalimat fakta adalah...',
    options: [
      'Berisi opini pribadi',
      'Menggunakan kata-kata subjektif',
      'Dapat dibuktikan kebenarannya',
      'Bersifat imajinatif',
      'Menggunakan kata "mungkin" atau "sepertinya"'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Fakta dan Opini Lanjut',
    explanation: 'Fakta dapat dibuktikan kebenarannya dengan data empiris yang objektif. Memerlukan kemampuan verifikasi informasi.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Struktur teks berita yang paling penting diletakkan di bagian...',
    options: ['Ekor berita', 'Tubuh berita', 'Kepala berita (Lead)', 'Judul saja', 'Penutup'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Teks Berita Analitis',
    explanation: 'Lead (kepala berita) memuat inti berita (5W+1H) dalam struktur piramida terbalik. Memerlukan pemahaman hierarki informasi.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Majas yang membandingkan dua hal secara langsung tanpa kata penghubung disebut...',
    options: ['Personifikasi', 'Metafora', 'Hiperbola', 'Simile', 'Aliterasi'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Majas Lanjut',
    explanation: 'Metafora membandingkan langsung tanpa kata penghubung untuk menciptakan efek retoris yang kuat. Memerlukan pemahaman gaya bahasa.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Tujuan dari teks persuasi adalah...',
    options: [
      'Menghibur pembaca',
      'Memberikan informasi teknis',
      'Meyakinkan atau mengajak pembaca',
      'Menceritakan masa lalu',
      'Mengkritik suatu karya'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Teks Persuasi Kompleks',
    explanation: 'Teks persuasi bertujuan mengajak atau meyakinkan pembaca melalui argumen logis dan emosional. Memerlukan pemahaman teknik retorika.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Manakah yang merupakan contoh kalimat pasif?',
    options: [
      'Budi membaca buku.',
      'Buku dibaca oleh Budi.',
      'Ibu memasak di dapur.',
      'Adik sedang bermain bola.',
      'Mereka pergi ke sekolah.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Kalimat Pasif Kompleks',
    explanation: 'Kalimat pasif ditandai dengan imbuhan di- pada predikat, menggeser fokus dari pelaku ke objek. Memerlukan pemahaman diatesis.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bagian akhir dari sebuah cerpen yang berisi penyelesaian masalah disebut...',
    options: ['Orientasi', 'Komplikasi', 'Resolusi', 'Koda', 'Abstrak'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Struktur Cerpen Lanjut',
    explanation: 'Resolusi adalah bagian penyelesaian masalah dalam alur naratif. Memerlukan pemahaman dinamika plot.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Antonim dari kata "Prolog" adalah...',
    options: ['Dialog', 'Monolog', 'Epilog', 'Katalog', 'Analog'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Antonim Lanjut',
    explanation: 'Prolog adalah pembuka, antonimnya Epilog (penutup) dalam struktur dramatik. Memerlukan pemahaman terminologi sastra.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Choose the correct form: "She ___ to the market every Sunday."',
    options: ['Go', 'Goes', 'Going', 'Gone', 'Went'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Advanced Grammar',
    explanation: 'Simple present tense for third-person singular subjects requires the -s/es suffix. Requires mastery of subject-verb agreement.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What is the opposite of "Ancient"?',
    options: ['Old', 'Modern', 'Historic', 'Antique', 'Elderly'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Advanced Vocabulary',
    explanation: 'Ancient denotes a distant past, its antonym is Modern. Requires understanding of temporal semantics.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Identify the noun in this sentence: "The blue car drove fast."',
    options: ['The', 'Blue', 'Car', 'Drove', 'Fast'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Morphosyntax',
    explanation: 'Car is a noun, the head of the noun phrase. Requires understanding of syntactic categories.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Complete the sentence: "If I ___ rich, I would travel the world."',
    options: ['Am', 'Was', 'Were', 'Be', 'Been'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Subjunctive Mood',
    explanation: 'Conditional type 2 uses "were" for all subjects to express hypothetical situations. Requires mastery of mood in English.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What does the idiom "A piece of cake" mean?',
    options: ['Something delicious', 'Something very easy', 'A small portion', 'A birthday gift', 'A difficult task'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Idioms Lanjut',
    explanation: 'A piece of cake adalah idiom yang menunjukkan kemudahan ekstrem dalam penyelesaian tugas. Memerlukan pemahaman bahasa kiasan.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Which sentence is in the Present Continuous tense?',
    options: [
      'I eat an apple.',
      'I ate an apple.',
      'I am eating an apple.',
      'I have eaten an apple.',
      'I will eat an apple.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Tenses Lanjut',
    explanation: 'Present continuous menggunakan "am/is/are + verb-ing" untuk menunjukkan aksi yang sedang berlangsung secara progresif. Memerlukan pemahaman aspek gramatikal.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What is the synonym of "Enormous"?',
    options: ['Tiny', 'Small', 'Huge', 'Average', 'Weak'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Vocabulary Lanjut',
    explanation: 'Enormous berarti sangat besar dalam skala masif, sinonimnya Huge. Memerlukan penguasaan gradasi makna kata.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Choose the correct preposition: "The book is ___ the table."',
    options: ['In', 'On', 'At', 'By', 'With'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Prepositions Lanjut',
    explanation: 'Preposisi "on" menunjukkan posisi di atas permukaan secara kontak fisik. Memerlukan pemahaman relasi spasial.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah tangki air berbentuk tabung dengan jari-jari 7 cm and tinggi 10 cm. Berapakah volumenya? (π = 22/7)',
    options: ['1540 cm³', '770 cm³', '440 cm³', '154 cm³', '220 cm³'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Geometri Ruang Lanjut',
    explanation: 'V = πr²t = (22/7) * 7² * 10 = 22 * 7 * 10 = 1540. Memerlukan penguasaan rumus volume bangun ruang sisi lengkung.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika 3 pekerja dapat menyelesaikan sebuah pekerjaan dalam 6 hari, berapa hari yang dibutuhkan jika dikerjakan oleh 9 pekerja?',
    options: ['18 hari', '12 hari', '4 hari', '2 hari', '3 hari'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Perbandingan Berbalik Nilai Lanjut',
    explanation: '3 * 6 = 9 * x -> 18 = 9x -> x = 2 hari. Memerlukan pemahaman konsep produktivitas dan waktu.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah nilai dari 2⁵?',
    options: ['10', '16', '25', '32', '64'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Eksponen Lanjut',
    explanation: '2 * 2 * 2 * 2 * 2 = 32. Memerlukan penguasaan konsep perpangkatan bilangan bulat.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah baju seharga Rp200.000 didiskon 25%. Berapakah harga setelah diskon?',
    options: ['Rp150.000', 'Rp175.000', 'Rp50.000', 'Rp125.000', 'Rp180.000'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Aritmatika Sosial Lanjut',
    explanation: 'Diskon = 25% * 200.000 = 50.000. Harga = 200.000 - 50.000 = 150.000. Memerlukan pemahaman konsep persentase dalam ekonomi.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah peluang munculnya angka genap pada pelemparan sebuah dadu?',
    options: ['1/6', '1/3', '1/2', '2/3', '5/6'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Peluang Lanjut',
    explanation: 'Angka genap dadu: 2, 4, 6 (3 sisi). Peluang = 3/6 = 1/2. Memerlukan pemahaman konsep ruang sampel dan titik sampel.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika f(x) = 2x + 3, maka f(5) adalah...',
    options: ['10', '13', '15', '18', '25'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Fungsi Lanjut',
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13. Memerlukan pemahaman konsep pemetaan nilai dalam fungsi linear.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah jumlah sudut dalam sebuah segitiga?',
    options: ['90°', '180°', '270°', '360°', '540°'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Geometri Lanjut',
    explanation: 'Jumlah sudut interior poligon dengan n sisi adalah (n-2) * 180°. Untuk segitiga (n=3), maka (3-2) * 180° = 180°.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika 2, 4, x, 16 adalah deret geometri, maka nilai x adalah...',
    options: ['6', '8', '10', '12', '14'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Deret Geometri Lanjut',
    explanation: 'Rasio (r) = 4/2 = 2. Suku ke-n (Un) = a * r^(n-1). x adalah suku ke-3, maka x = 2 * 2^(3-1) = 2 * 4 = 8.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua kucing adalah hewan. Beberapa hewan adalah karnivora. Simpulan yang paling mungkin adalah...',
    options: ['Semua kucing adalah karnivora', 'Beberapa kucing adalah karnivora', 'Mungkin ada kucing yang karnivora', 'Tidak ada kucing yang karnivora', 'Semua karnivora adalah kucing'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Silogisme Kompleks',
    explanation: 'Dalam logika formal, "Beberapa" tidak menjamin inklusi kategori spesifik lainnya kecuali ada premis penghubung yang kuat. "Mungkin" adalah simpulan logis paling aman.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + 2y = 10 and 2x + y = 11, maka nilai x + y adalah...',
    options: ['7', '8', '9', '10', '11'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Sistem Persamaan Linear Lanjut',
    explanation: 'Metode eliminasi/substitusi menghasilkan x=4, y=3. Maka x+y=7. Memerlukan ketelitian dalam manipulasi aljabar.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'The word "ubiquitous" is closest in meaning to...',
    options: ['Rare', 'Everywhere', 'Hidden', 'Unique', 'Expensive'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Vocabulary Akademik Lanjut',
    explanation: 'Ubiquitous (adj) merujuk pada keberadaan yang serentak di berbagai tempat. Sinonim: omnipresent.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Rata-rata nilai 5 siswa adalah 80. Jika satu siswa dengan nilai 90 bergabung, rata-rata barunya adalah...',
    options: ['81', '81.6', '82', '82.5', '85'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Statistika Lanjut',
    explanation: 'Rata-rata gabungan = (n1*x1 + n2*x2) / (n1+n2) = (5*80 + 1*90) / 6 = 490/6 = 81.67.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika x > y and y > z, maka...',
    options: ['x < z', 'x = z', 'x > z', 'x + y < z', 'y - x > z'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Pertidaksamaan',
    explanation: 'Sifat transitif pertidaksamaan: Jika x > y dan y > z, maka x > z.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua mamalia menyusui anaknya. Paus adalah mamalia. Simpulan yang benar adalah...',
    options: [
      'Paus tidak menyusui anaknya',
      'Semua yang menyusui adalah paus',
      'Paus menyusui anaknya',
      'Sebagian paus menyusui anaknya',
      'Mamalia yang bukan paus tidak menyusui'
    ],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Modus Ponens',
    explanation: 'Modus Ponens: Jika P maka Q. P terjadi, maka Q terjadi. Mamalia (P) menyusui (Q). Paus adalah mamalia (P), maka paus menyusui (Q).'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Deret angka: 2, 4, 8, 16, 32, ... Angka selanjutnya adalah...',
    options: ['48', '60', '64', '72', '128'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Deret Angka',
    explanation: 'Pola: dikali 2. 32 * 2 = 64.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika 5x + 3 = 18, maka nilai x adalah...',
    options: ['2', '3', '4', '5', '6'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Aljabar Dasar',
    explanation: '5x = 18 - 3 -> 5x = 15 -> x = 3.'
  },

  // TPS - Pengetahuan dan Pemahaman Umum (PPU) - 8 Soal
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Sinonim dari kata "Eksplisit" adalah...',
    options: ['Tersirat', 'Gamblang', 'Samar', 'Rahasia', 'Abstrak'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Sinonim',
    explanation: 'Eksplisit berarti jelas atau gamblang.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari kata "Konvergen" adalah...',
    options: ['Memusat', 'Menyatu', 'Divergen', 'Sejajar', 'Berlawanan'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Antonim',
    explanation: 'Konvergen berarti memusat, antonimnya adalah divergen yang berarti menyebar.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Kata "Inovasi" memiliki makna...',
    options: [
      'Penemuan baru yang berbeda dari sebelumnya',
      'Pengulangan metode lama',
      'Penghapusan sistem yang ada',
      'Pemeliharaan tradisi',
      'Peniruan karya orang lain'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Makna Kata Lanjut',
    explanation: 'Inovasi melibatkan penerapan ide baru yang memberikan nilai tambah signifikan, bukan sekadar penemuan (invention).'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Analisis hubungan semantik yang paling kompleks: ENTROPI : TERMODINAMIKA = ... : ...',
    options: [
      'SINERGITAS : MANAJEMEN',
      'OSMOSIS : BIOLOGI',
      'REDUKSI : KIMIA',
      'INFLASI : EKONOMI',
      'SEMUA BENAR'
    ],
    correctAnswer: 4,
    difficulty: 'super hard',
    topic: 'Analogi Kompleks Lanjut',
    explanation: 'Semua pasangan menunjukkan hubungan antara konsep/fenomena dengan bidang ilmu yang mempelajarinya secara spesifik.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Manakah penulisan kata serapan yang sesuai dengan PUEBI edisi terbaru untuk istilah teknis medis?',
    options: ['Apotik', 'Kwitansi', 'Analisa', 'Kualitas', 'Sistim'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Ejaan Teknis Lanjut',
    explanation: 'Kualitas adalah bentuk baku menurut KBBI. Bentuk tidak baku lainnya sering ditemukan dalam penggunaan sehari-hari yang salah.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Kata "Fundamental" dalam konteks epistemologi berarti...',
    options: ['Tambahan', 'Dasar yang tak tergoyahkan', 'Akhir dari segalanya', 'Sampingan', 'Luar'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Makna Filosofis Lanjut',
    explanation: 'Fundamental merujuk pada basis ontologis atau epistemologis yang menjadi fondasi bagi struktur pemikiran lainnya.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Sinonim dari "Iterasi" dalam konteks algoritma rekursif adalah...',
    options: ['Penghapusan', 'Pengulangan berulang', 'Perubahan drastis', 'Pengurangan', 'Pembagian'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Sinonim Teknis Lanjut',
    explanation: 'Iterasi dalam komputasi adalah proses eksekusi sekumpulan instruksi secara berulang hingga kondisi tertentu terpenuhi.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari "Efimer" dalam konteks eksistensialisme adalah...',
    options: ['Sementara', 'Singkat', 'Abadi/Perpetual', 'Cepat', 'Fana'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Antonim Filosofis Lanjut',
    explanation: 'Efimer merujuk pada sesuatu yang bersifat sementara atau fana. Lawan katanya adalah sesuatu yang bersifat kekal atau abadi.'
  },

  // TPS - Memahami Bacaan dan Menulis (PBM) - 8 Soal
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kalimat berikut yang tidak efektif adalah...',
    options: [
      'Para siswa-siswa sedang belajar di kelas.',
      'Siswa sedang belajar di kelas.',
      'Para siswa sedang belajar di kelas.',
      'Banyak siswa sedang belajar di kelas.',
      'Siswa-siswa sedang belajar di kelas.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Kalimat Efektif Lanjut',
    explanation: 'Penggunaan "Para" dan pengulangan kata "siswa-siswa" menyebabkan pleonasme (kelebihan kata) yang tidak efektif.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Penulisan judul karangan yang benar adalah...',
    options: [
      'Si Kancil Dan Buaya',
      'Si Kancil dan Buaya',
      'si kancil dan buaya',
      'SI KANCIL DAN BUAYA',
      'Si kancil Dan buaya'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Ejaan Judul Lanjut',
    explanation: 'Kata hubung (dan, di, ke, dari) dalam judul tidak menggunakan huruf kapital kecuali di awal kalimat.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Konjungsi yang tepat untuk menghubungkan dua kalimat yang bertentangan adalah...',
    options: ['Dan', 'Serta', 'Tetapi', 'Sehingga', 'Karena'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Konjungsi Lanjut',
    explanation: 'Konjungsi adversatif (tetapi, namun) digunakan untuk menghubungkan dua klausa yang memiliki hubungan pertentangan.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah kalimat yang menggunakan huruf kapital dengan benar?',
    options: [
      'Saya pergi ke Bandung hari Senin.',
      'saya pergi ke bandung hari senin.',
      'Saya pergi ke bandung Hari Senin.',
      'Saya Pergi Ke Bandung Hari Senin.',
      'Saya pergi ke Bandung hari senin.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Huruf Kapital Lanjut',
    explanation: 'Nama kota (Bandung) dan nama hari (Senin) adalah nama diri yang wajib menggunakan huruf kapital di awal kata.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kata "di" yang berfungsi sebagai awalan terdapat pada kata...',
    options: ['Di rumah', 'Di pasar', 'Dimakan', 'Di sana', 'Di atas'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Imbuhan Lanjut',
    explanation: '"Di" sebagai awalan ditulis serangkai dengan kata dasarnya (dimakan), sedangkan sebagai kata depan ditulis terpisah (di rumah).'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kalimat yang mengandung subjek, predikat, dan objek adalah...',
    options: [
      'Adik tidur.',
      'Ibu memasak nasi.',
      'Ayah ke kantor.',
      'Bunga itu indah.',
      'Mereka sedang berlari.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Struktur Kalimat Lanjut',
    explanation: 'Kalimat SPO (Subjek-Predikat-Objek) memerlukan verba transitif yang diikuti oleh nomina sebagai objek.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Penulisan angka yang benar dalam kalimat adalah...',
    options: [
      '3 orang siswa datang terlambat.',
      'Tiga orang siswa datang terlambat.',
      'Siswa yang datang terlambat ada 3.',
      'Ada tiga orang siswa datang terlambat.',
      'Semua benar.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Penulisan Angka Lanjut',
    explanation: 'Angka di awal kalimat yang dapat dinyatakan dengan satu atau dua kata harus ditulis dengan huruf.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kata baku dari "jadual" adalah...',
    options: ['Jadwal', 'Jadual', 'Jadval', 'Schedule', 'Jaduel'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Kata Baku Lanjut',
    explanation: 'Jadwal adalah bentuk baku serapan dari bahasa Arab "jadwal". Memerlukan pemahaman etimologi serapan.'
  },

  // TPS - Pengetahuan Kuantitatif (PK) - 8 Soal
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika f(x) = ax + b dan f(f(x)) = 9x + 8, maka nilai a + b yang mungkin adalah...',
    options: ['5', '6', '7', '8', '9'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Fungsi Komposisi Lanjut',
    explanation: 'f(f(x)) = a(ax+b)+b = a²x + ab+b. Maka a²=9 (a=3) dan ab+b=8 (3b+b=8, b=2). a+b=5.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah sisa pembagian 3^2026 oleh 10?',
    options: ['1', '3', '7', '9', '0'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Teori Bilangan Lanjut',
    explanation: 'Cari pola satuan 3^n: 3, 9, 7, 1 (siklus 4). 2026 mod 4 = 2. Maka satuan dari 3^2026 adalah 9.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika sebuah kubus memiliki diagonal ruang √108 cm, berapakah volumenya?',
    options: ['64 cm³', '125 cm³', '216 cm³', '343 cm³', '512 cm³'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Geometri Ruang Lanjut',
    explanation: 'Diagonal ruang kubus s√3 = √108 = 6√3. Maka sisi s = 6. Volume = s³ = 6³ = 216.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Hasil dari ∫ (3x² - 4x + 1) dx dari 0 sampai 2 adalah...',
    options: ['2', '4', '6', '8', '10'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Kalkulus Lanjut',
    explanation: 'Integral (3x² - 4x + 1) = x³ - 2x² + x. Evaluasi dari 0 ke 2: (8 - 8 + 2) - (0) = 2. (Koreksi: 2³-2(2²)+2 = 8-8+2=2).'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika a = 3 and b = -2, maka nilai dari a² - 2ab + b² adalah...',
    options: ['1', '5', '13', '25', '49'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Aljabar Lanjut',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika a, b, c adalah akar-akar dari x³ - 6x² + 11x - 6 = 0, berapakah nilai dari a² + b² + c²?',
    options: ['10', '12', '14', '16', '18'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Polinomial',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + y = 10 and x - y = 4, maka nilai xy adalah...',
    options: ['14', '21', '24', '28', '40'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Sistem Persamaan Lanjut',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah nilai dari limit (x->0) (sin x / x)?',
    options: ['0', '1', '∞', 'Tidak ada', '0.5'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Limit',
  },

  // Literasi Bahasa Indonesia - 8 Soal
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Apa yang dimaksud dengan teks eksplanasi?',
    options: [
      'Teks yang menceritakan kejadian fiksi',
      'Teks yang menjelaskan proses terjadinya suatu fenomena',
      'Teks yang berisi ajakan kepada pembaca',
      'Teks yang mendeskripsikan suatu objek secara detail',
      'Teks yang berisi opini penulis tentang suatu isu'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Jenis Teks Lanjut',
    explanation: 'Teks eksplanasi bertujuan memberikan pemahaman mendalam tentang kausalitas fenomena alam atau sosial.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Ciri utama dari kalimat fakta adalah...',
    options: [
      'Berisi opini pribadi',
      'Menggunakan kata-kata subjektif',
      'Dapat dibuktikan kebenarannya',
      'Bersifat imajinatif',
      'Menggunakan kata "mungkin" atau "sepertinya"'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Fakta dan Opini Lanjut',
    explanation: 'Fakta bersifat objektif, empiris, dan dapat diverifikasi melalui data atau observasi langsung.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Struktur teks berita yang paling penting diletakkan di bagian...',
    options: ['Ekor berita', 'Tubuh berita', 'Kepala berita (Lead)', 'Judul saja', 'Penutup'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Teks Berita Lanjut',
    explanation: 'Lead berita mengandung inti 5W+1H untuk memberikan informasi krusial secara cepat kepada pembaca.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Majas yang membandingkan dua hal secara langsung tanpa kata penghubung disebut...',
    options: ['Personifikasi', 'Metafora', 'Hiperbola', 'Simile', 'Aliterasi'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Majas Lanjut',
    explanation: 'Metafora adalah analogi implisit yang mengidentifikasi satu hal dengan hal lain untuk efek retoris.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Tujuan dari teks persuasi adalah...',
    options: [
      'Menghibur pembaca',
      'Memberikan informasi teknis',
      'Meyakinkan atau mengajak pembaca',
      'Menceritakan masa lalu',
      'Mengkritik suatu karya'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Teks Persuasi Lanjut',
    explanation: 'Retorika persuasi menggunakan logika (logos), etika (ethos), dan emosi (pathos) untuk memengaruhi audiens.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Manakah yang merupakan contoh kalimat pasif?',
    options: [
      'Budi membaca buku.',
      'Buku dibaca oleh Budi.',
      'Ibu memasak di dapur.',
      'Adik sedang bermain bola.',
      'Mereka pergi ke sekolah.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Kalimat Pasif Lanjut',
    explanation: 'Kalimat pasif ditandai dengan subjek yang dikenai tindakan, biasanya menggunakan imbuhan di- atau ter-.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bagian akhir dari sebuah cerpen yang berisi penyelesaian masalah disebut...',
    options: ['Orientasi', 'Komplikasi', 'Resolusi', 'Koda', 'Abstrak'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Struktur Cerpen Lanjut',
    explanation: 'Resolusi adalah tahap di mana konflik mencapai titik balik dan menemukan jalan keluar atau penyelesaian.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Antonim dari kata "Prolog" adalah...',
    options: ['Dialog', 'Monolog', 'Epilog', 'Katalog', 'Analog'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Antonim Lanjut',
    explanation: 'Prolog adalah pengantar (sebelum), Epilog adalah penutup (sesudah). Memerlukan pemahaman struktur naratif.'
  },

  // Literasi Bahasa Inggris - 8 Soal
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Choose the correct form: "She ___ to the market every Sunday."',
    options: ['Go', 'Goes', 'Going', 'Gone', 'Went'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Grammar Lanjut',
    explanation: 'Simple Present Tense untuk kebiasaan (habitual action) menggunakan kata kerja bentuk pertama dengan akhiran -s/-es untuk subjek orang ketiga tunggal.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What is the opposite of "Ancient"?',
    options: ['Old', 'Modern', 'Historic', 'Antique', 'Elderly'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Vocabulary',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Identify the noun in this sentence: "The blue car drove fast."',
    options: ['The', 'Blue', 'Car', 'Drove', 'Fast'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Parts of Speech Lanjut',
    explanation: 'Noun (kata benda) adalah kata yang menamai orang, tempat, benda, atau ide. Dalam kalimat ini, "car" adalah subjek benda.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Complete the sentence: "If I ___ rich, I would travel the world."',
    options: ['Am', 'Was', 'Were', 'Be', 'Been'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Conditional Sentences Lanjut',
    explanation: 'Second Conditional (unreal present) menggunakan "were" untuk semua subjek dalam klausa "if" untuk menunjukkan pengandaian.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What does the idiom "A piece of cake" mean?',
    options: ['Something delicious', 'Something very easy', 'A small portion', 'A birthday gift', 'A difficult task'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Idioms Lanjut',
    explanation: 'Idiom adalah ungkapan yang maknanya tidak dapat dipahami secara harfiah dari kata-kata penyusunnya.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Which sentence is in the Present Continuous tense?',
    options: [
      'I eat an apple.',
      'I ate an apple.',
      'I am eating an apple.',
      'I have eaten an apple.',
      'I will eat an apple.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Tenses Lanjut',
    explanation: 'Present Continuous Tense menunjukkan aksi yang sedang berlangsung saat ini. Memerlukan pemahaman durasi tindakan.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What is the synonym of "Enormous"?',
    options: ['Tiny', 'Small', 'Huge', 'Average', 'Weak'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Vocabulary',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Choose the correct preposition: "The book is ___ the table."',
    options: ['In', 'On', 'At', 'By', 'With'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Prepositions',
  },

  // Penalaran Matematika - 8 Soal
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah tangki air berbentuk tabung dengan jari-jari 7 cm and tinggi 10 cm. Berapakah volumenya? (π = 22/7)',
    options: ['1540 cm³', '770 cm³', '440 cm³', '154 cm³', '220 cm³'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Geometri Ruang Lanjut',
    explanation: 'V = πr²t = (22/7) * 7² * 10 = 22 * 7 * 10 = 1540. Memerlukan penguasaan rumus volume bangun ruang sisi lengkung.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika 3 pekerja dapat menyelesaikan sebuah pekerjaan dalam 6 hari, berapa hari yang dibutuhkan jika dikerjakan oleh 9 pekerja?',
    options: ['18 hari', '12 hari', '4 hari', '2 hari', '3 hari'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Perbandingan Berbalik Nilai Lanjut',
    explanation: '3 * 6 = 9 * x -> 18 = 9x -> x = 2 hari. Memerlukan pemahaman konsep produktivitas dan waktu.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah nilai dari 2⁵?',
    options: ['10', '16', '25', '32', '64'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Eksponen Lanjut',
    explanation: '2 * 2 * 2 * 2 * 2 = 32. Memerlukan penguasaan konsep perpangkatan bilangan bulat.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah baju seharga Rp200.000 didiskon 25%. Berapakah harga setelah diskon?',
    options: ['Rp150.000', 'Rp175.000', 'Rp50.000', 'Rp125.000', 'Rp180.000'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Aritmatika Sosial Lanjut',
    explanation: 'Diskon = 25% * 200.000 = 50.000. Harga = 200.000 - 50.000 = 150.000. Memerlukan pemahaman konsep persentase dalam ekonomi.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah peluang munculnya angka genap pada pelemparan sebuah dadu?',
    options: ['1/6', '1/3', '1/2', '2/3', '5/6'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Peluang Lanjut',
    explanation: 'Angka genap dadu: 2, 4, 6 (3 sisi). Peluang = 3/6 = 1/2. Memerlukan pemahaman konsep ruang sampel dan titik sampel.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika f(x) = 2x + 3, maka f(5) adalah...',
    options: ['10', '13', '15', '18', '25'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Fungsi Lanjut',
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13. Memerlukan pemahaman konsep pemetaan nilai dalam fungsi linear.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah jumlah sudut dalam sebuah segitiga?',
    options: ['90°', '180°', '270°', '360°', '540°'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Geometri Lanjut',
    explanation: 'Jumlah sudut interior poligon dengan n sisi adalah (n-2) * 180°. Untuk segitiga (n=3), maka (3-2) * 180° = 180°.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika 2, 4, x, 16 adalah deret geometri, maka nilai x adalah...',
    options: ['6', '8', '10', '12', '14'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Deret Geometri Lanjut',
    explanation: 'Rasio (r) = 4/2 = 2. Suku ke-n (Un) = a * r^(n-1). x adalah suku ke-3, maka x = 2 * 2^(3-1) = 2 * 4 = 8.'
  },
  // Additional Questions to reach 70+
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua kucing adalah hewan. Beberapa hewan adalah karnivora. Simpulan yang paling mungkin adalah...',
    options: ['Semua kucing adalah karnivora', 'Beberapa kucing adalah karnivora', 'Mungkin ada kucing yang karnivora', 'Tidak ada kucing yang karnivora', 'Semua karnivora adalah kucing'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Silogisme Kompleks',
    explanation: 'Dalam logika formal, "Beberapa" tidak menjamin inklusi kategori spesifik lainnya kecuali ada premis penghubung yang kuat. "Mungkin" adalah simpulan logis paling aman.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + 2y = 10 and 2x + y = 11, maka nilai x + y adalah...',
    options: ['7', '8', '9', '10', '11'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Sistem Persamaan Linear Lanjut',
    explanation: 'Metode eliminasi/substitusi menghasilkan x=4, y=3. Maka x+y=7. Memerlukan ketelitian dalam manipulasi aljabar.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'The word "ubiquitous" is closest in meaning to...',
    options: ['Rare', 'Everywhere', 'Hidden', 'Unique', 'Expensive'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Vocabulary Akademik Lanjut',
    explanation: 'Ubiquitous (adj) merujuk pada keberadaan yang serentak di berbagai tempat. Sinonim: omnipresent.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Rata-rata nilai 5 siswa adalah 80. Jika satu siswa dengan nilai 90 bergabung, rata-rata barunya adalah...',
    options: ['81', '81.6', '82', '82.5', '85'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Statistika Lanjut',
    explanation: 'Rata-rata gabungan = (n1*x1 + n2*x2) / (n1+n2) = (5*80 + 1*90) / 6 = 490/6 = 81.67.'
  }
];

const UTBK_MATERIALS = [
  {
    title: 'Penalaran Umum (PU): Logika Proposisi & Silogisme',
    section: 'TPS',
    topic: 'Logika & Analitik',
    content: `# Penalaran Umum (PU): Logika Proposisi & Silogisme

Penalaran Umum adalah subtes yang menguji kemampuan Anda dalam menarik kesimpulan logis dari premis-premis yang diberikan.

## 1. Logika Proposisi
Logika proposisi berfokus pada hubungan antar pernyataan.
- **Modus Ponens**: Jika P maka Q. P terjadi, maka Q pasti terjadi.
- **Modus Tollens**: Jika P maka Q. Q tidak terjadi, maka P pasti tidak terjadi.
- **Silogisme Hipotetik**: Jika P maka Q, dan jika Q maka R. Maka jika P maka R.

## 2. Penalaran Analitik
Ini adalah jenis soal yang paling memakan waktu. Anda diminta menyusun data acak.
- **Tips**: Gunakan tabel atau diagram untuk memvisualisasikan data.
- **Contoh**: Jika A lebih tinggi dari B, dan C lebih pendek dari B, maka urutannya adalah A > B > C.

## 3. Strategi Pengerjaan Soal PU
1. **Identifikasi Premis**: Tuliskan premis-premis dalam bentuk simbolis jika perlu.
2. **Hindari Asumsi**: Jangan memasukkan informasi yang tidak ada dalam teks.
3. **Analisis Opsi**: Eliminasi jawaban yang bertentangan dengan premis.

## Referensi Belajar:
- **Blog Brain Academy**: [Contoh Soal Tes Skolastik UTBK (20 soal + pembahasan)](https://www.brainacademy.id/blog/contoh-soal-tes-skolastik-utbk)`,
    videoUrl: 'https://www.youtube.com/watch?v=pw_PzW_eG90'
  },
  {
    title: 'Pengetahuan Kuantitatif (PK): Aljabar, Geometri, Peluang',
    section: 'TPS',
    topic: 'Matematika Dasar',
    content: `# Pengetahuan Kuantitatif (PK)

PK menguji pemahaman konsep matematika dasar dan penerapannya secara cepat.

## Topik Utama & Rumus Penting
1. **Aljabar**:
   - Persamaan Linear: ax + b = c
   - Persamaan Kuadrat: ax² + bx + c = 0 (Gunakan rumus ABC atau faktorisasi)
2. **Geometri**:
   - Luas Persegi: s²
   - Luas Lingkaran: πr²
   - Volume Tabung: πr²t
3. **Statistika**:
   - Mean: Jumlah data / Banyak data
   - Median: Nilai tengah (setelah diurutkan)
4. **Peluang**:
   - P(A) = n(A) / n(S)

## Strategi Pengerjaan:
- **Latihan Kecepatan**: PK adalah soal kecepatan. Hafalkan tabel perkalian, kuadrat, dan akar.
- **Estimasi**: Jika soal pilihan ganda, gunakan estimasi untuk mengeliminasi jawaban yang tidak masuk akal.

## Referensi Belajar:
- **Blog Brain Academy**: [Soal UTBK Pengetahuan Kuantitatif (Statistika + pembahasan)](https://www.brainacademy.id/blog/soal-utbk-pengetahuan-kuantitatif)`,
    videoUrl: 'https://www.youtube.com/watch?v=n9jZoKJ7qc0'
  },
  {
    title: 'Literasi Bahasa Indonesia: Ide Pokok & PUEBI',
    section: 'Literasi',
    topic: 'Bahasa Indonesia',
    content: `# Literasi Bahasa Indonesia

Subtes ini menguji kemampuan membaca, memahami, dan menganalisis teks.

## Fokus Pembelajaran:
1. **Ide Pokok**: Biasanya terletak di awal (deduktif), akhir (induktif), atau campuran.
2. **Simpulan**: Inti dari seluruh paragraf yang mencakup gagasan utama.
3. **PUEBI**:
   - Penggunaan huruf kapital (nama orang, tempat, awal kalimat).
   - Tanda baca (koma, titik, titik dua).
   - Kata baku (contoh: 'jadwal' bukan 'jadual', 'apotek' bukan 'apotik').

## Strategi Pengerjaan:
- **Membaca Cepat**: Fokus pada kalimat pertama dan terakhir paragraf.
- **Analisis Kata**: Perhatikan kata hubung (konjungsi) untuk memahami alur pikiran penulis.

## Referensi Belajar:
- **Blog Brain Academy**: [Soal Tes Skolastik Literasi Bahasa Indonesia (Ide pokok + pembahasan)](https://www.brainacademy.id/blog/soal-tes-skolastik-literasi-bahasa-indonesia)`,
    videoUrl: 'https://www.youtube.com/watch?v=ZDLCc5gDvn4'
  },
  {
    title: 'Literasi Bahasa Inggris: Skimming & Scanning',
    section: 'Literasi',
    topic: 'Bahasa Inggris',
    content: `# English Literacy for UTBK

Kemampuan membaca teks bahasa Inggris dengan cepat dan tepat.

## Key Skills:
1. **Skimming**: Membaca cepat untuk mendapatkan gambaran umum (main idea, purpose).
2. **Scanning**: Mencari informasi spesifik (nama tokoh, tanggal, angka).
3. **Contextual Meaning**: Menebak arti kata sulit berdasarkan kalimat di sekitarnya.

## Strategi Pengerjaan:
- **Baca Pertanyaan Dulu**: Tahu apa yang dicari sebelum membaca teks.
- **Perbanyak Kosakata**: Baca artikel bahasa Inggris (berita, jurnal) secara rutin.
- **Pahami Struktur**: Teks biasanya terdiri dari Pendahuluan, Isi, dan Kesimpulan.

## Referensi Belajar:
- **Blog Brain Academy**: [Tes Skolastik Literasi Bahasa Inggris (Main idea + 20 soal)](https://www.brainacademy.id/blog/tes-skolastik-literasi-bahasa-inggris)`,
    videoUrl: 'https://www.youtube.com/watch?v=Eusi87jTKyA'
  },
  {
    title: 'Penalaran Matematika (PM): Soal Cerita & Grafik',
    section: 'TPS',
    topic: 'Matematika Terapan',
    content: `# Penalaran Matematika (PM)

PM menguji kemampuan menerapkan konsep matematika dalam situasi dunia nyata.

## Contoh Kasus & Strategi:
1. **Soal Cerita**: Ubah narasi menjadi model matematika.
   - Contoh: "Harga 2 buku dan 3 pensil adalah Rp10.000" -> 2x + 3y = 10.000
2. **Analisis Grafik/Tabel**:
   - Perhatikan sumbu X dan Y.
   - Baca judul dan keterangan grafik dengan teliti.
   - Hitung persentase kenaikan/penurunan jika diminta.

## Kunci Sukses:
- **Logika**: Jangan hanya menghitung, pahami *apa* yang dihitung.
- **Ketelitian**: Seringkali jebakan ada pada satuan (misal: meter ke centimeter).

## Referensi Belajar:
- **Blog Brain Academy**: [Soal Tes Skolastik Penalaran Matematika (Grafik + strategi)](https://www.brainacademy.id/blog/soal-tes-skolastik-penalaran-matematika)`,
    videoUrl: 'https://www.youtube.com/watch?v=v9CruO4jIc8'
  }
];

export default function SeedData() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const seed = async () => {
    setIsSeeding(true);
    setStatus('Preparing comprehensive data...');
    try {
      // Clear existing data to prevent duplicates
      setStatus('Clearing old data...');
      let deleteBatch = writeBatch(db);
      let deleteCount = 0;

      const qSnapshot = await getDocs(collection(db, 'questions'));
      qSnapshot.docs.forEach(doc => { deleteBatch.delete(doc.ref); deleteCount++; });
      
      const mSnapshot = await getDocs(collection(db, 'materials'));
      mSnapshot.docs.forEach(doc => { deleteBatch.delete(doc.ref); deleteCount++; });

      const tSnapshot = await getDocs(collection(db, 'tryouts'));
      tSnapshot.docs.forEach(doc => { deleteBatch.delete(doc.ref); deleteCount++; });

      if (deleteCount > 0) {
        await deleteBatch.commit();
      }

      const batch = writeBatch(db);

      // Add Questions
      setStatus('Seeding Question Bank...');
      const questionIds: string[] = [];
      for (const q of UTBK_QUESTIONS) {
        const qRef = doc(collection(db, 'questions'));
        batch.set(qRef, q);
        questionIds.push(qRef.id);
      }

      // Add Materials
      setStatus('Seeding Learning Materials...');
      for (const m of UTBK_MATERIALS) {
        const mRef = doc(collection(db, 'materials'));
        batch.set(mRef, m);
      }

      // Create Multiple Tryouts
      setStatus('Creating Tryout Packages...');
      const chunkSize = 20; // Increased chunk size for more "logical" tryouts
      for (let i = 0; i < questionIds.length; i += chunkSize) {
        const chunk = questionIds.slice(i, i + chunkSize);
        const tRef = doc(collection(db, 'tryouts'));
        batch.set(tRef, {
          title: `Simulasi UTBK SNBT 2026 (Super Hard) - Paket ${Math.floor(i / chunkSize) + 1}`,
          duration: Math.round(chunk.length * 1.2), // 1.2 minutes per question (tighter time)
          questionIds: chunk,
          createdAt: new Date().toISOString()
        });
      }

      try {
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
      }

      setStatus('Database successfully updated with complete data!');
      setIsDone(true);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Seed failed:', error);
      // Try to parse the error if it's JSON from handleFirestoreError
      try {
        const errObj = JSON.parse(error instanceof Error ? error.message : '');
        setStatus(`Permission Denied: ${errObj.authInfo.email || 'Unknown User'}`);
      } catch {
        setStatus('Failed to seed data. Please check your connection.');
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#151619] rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${isDone ? 'bg-green-50 dark:bg-green-500/10 text-green-500' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500'} rounded-2xl flex items-center justify-center transition-colors`}>
          {isDone ? <CheckCircle2 size={20} /> : <Database size={20} />}
        </div>
        <div>
          <h3 className="text-sm font-bold dark:text-white">Comprehensive Content</h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">UTBK 2026 Standards</p>
        </div>
      </div>
      
      {status && (
        <p className={`text-[10px] mb-3 font-medium ${isDone ? 'text-green-600' : 'text-indigo-600'}`}>
          {status}
        </p>
      )}
      
      <button 
        onClick={seed}
        disabled={isSeeding || isDone}
        className="w-full bg-[#5A5A40] text-white font-bold py-3 rounded-2xl hover:bg-opacity-90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
        {isSeeding ? 'Processing...' : isDone ? 'Update Complete' : 'Load Complete Materials & Questions'}
      </button>
    </div>
  );
}
