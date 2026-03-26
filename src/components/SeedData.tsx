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
    difficulty: 'medium',
    topic: 'Silogisme',
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
    difficulty: 'medium',
    topic: 'Modus Tollens',
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
    difficulty: 'medium',
    topic: 'Logika Analitik',
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'P, Q, R, S, T adalah lima orang siswa yang memiliki tinggi badan berbeda. P lebih tinggi dari Q, tetapi lebih pendek dari R. S lebih pendek dari Q, tetapi lebih tinggi dari T. Siapakah yang paling pendek?',
    options: ['P', 'Q', 'R', 'S', 'T'],
    correctAnswer: 4,
    difficulty: 'hard',
    topic: 'Urutan Posisi',
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
    difficulty: 'medium',
    topic: 'Silogisme',
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika x > y and y > z, maka...',
    options: ['x < z', 'x = z', 'x > z', 'x + y < z', 'y - x > z'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Pertidaksamaan',
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
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Deret angka: 2, 4, 8, 16, 32, ... Angka selanjutnya adalah...',
    options: ['48', '60', '64', '72', '128'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Deret Angka',
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Deret angka: 1, 4, 9, 16, 25, ... Angka selanjutnya adalah...',
    options: ['30', '35', '36', '40', '49'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Deret Angka',
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika 5x + 3 = 18, maka nilai x adalah...',
    options: ['2', '3', '4', '5', '6'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Aljabar Dasar',
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
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari kata "Konvergen" adalah...',
    options: ['Memusat', 'Menyatu', 'Divergen', 'Sejajar', 'Berlawanan'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Antonim',
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
    difficulty: 'easy',
    topic: 'Makna Kata',
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
    difficulty: 'medium',
    topic: 'Analogi',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Manakah penulisan kata serapan yang benar?',
    options: ['Apotik', 'Kwitansi', 'Analisa', 'Kualitas', 'Sistim'],
    correctAnswer: 3,
    difficulty: 'medium',
    topic: 'Ejaan',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Kata "Fundamental" berarti...',
    options: ['Tambahan', 'Dasar', 'Akhir', 'Sampingan', 'Luar'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Makna Kata',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Sinonim dari "Iterasi" adalah...',
    options: ['Penghapusan', 'Pengulangan', 'Perubahan', 'Pengurangan', 'Pembagian'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Sinonim',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari "Efimer" adalah...',
    options: ['Sementara', 'Singkat', 'Abadi', 'Cepat', 'Fana'],
    correctAnswer: 2,
    difficulty: 'hard',
    topic: 'Antonim',
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
    difficulty: 'medium',
    topic: 'Kalimat Efektif',
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
    difficulty: 'easy',
    topic: 'Ejaan Judul',
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Konjungsi yang tepat untuk menghubungkan dua kalimat yang bertentangan adalah...',
    options: ['Dan', 'Serta', 'Tetapi', 'Sehingga', 'Karena'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Konjungsi',
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
    difficulty: 'easy',
    topic: 'Huruf Kapital',
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kata "di" yang berfungsi sebagai awalan terdapat pada kata...',
    options: ['Di rumah', 'Di pasar', 'Dimakan', 'Di sana', 'Di atas'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Imbuhan',
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
    difficulty: 'easy',
    topic: 'Struktur Kalimat',
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
    difficulty: 'medium',
    topic: 'Penulisan Angka',
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kata baku dari "jadual" adalah...',
    options: ['Jadwal', 'Jadual', 'Jadval', 'Schedule', 'Jaduel'],
    correctAnswer: 0,
    difficulty: 'easy',
    topic: 'Kata Baku',
  },

  // TPS - Pengetahuan Kuantitatif (PK) - 8 Soal
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika 2x + 5 = 15, maka nilai dari x² + 1 adalah...',
    options: ['25', '26', '16', '17', '10'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Aljabar',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah rata-rata dari 10, 20, 30, 40, dan 50?',
    options: ['25', '30', '35', '40', '45'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Statistika',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika sebuah persegi memiliki luas 64 cm², berapakah kelilingnya?',
    options: ['16 cm', '24 cm', '32 cm', '48 cm', '64 cm'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Geometri',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Hasil dari 3/4 + 1/2 adalah...',
    options: ['4/6', '1/4', '5/4', '1', '3/8'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Pecahan',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika a = 3 and b = -2, maka nilai dari a² - 2ab + b² adalah...',
    options: ['1', '5', '13', '25', '49'],
    correctAnswer: 3,
    difficulty: 'medium',
    topic: 'Aljabar',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah 20% dari 150?',
    options: ['15', '20', '25', '30', '35'],
    correctAnswer: 3,
    difficulty: 'easy',
    topic: 'Persentase',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + y = 10 and x - y = 4, maka nilai xy adalah...',
    options: ['14', '21', '24', '28', '40'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Sistem Persamaan',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah nilai dari √144 + √81?',
    options: ['15', '18', '21', '25', '30'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Akar Kuadrat',
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
    difficulty: 'medium',
    topic: 'Jenis Teks',
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
    difficulty: 'easy',
    topic: 'Fakta dan Opini',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Struktur teks berita yang paling penting diletakkan di bagian...',
    options: ['Ekor berita', 'Tubuh berita', 'Kepala berita (Lead)', 'Judul saja', 'Penutup'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Teks Berita',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Majas yang membandingkan dua hal secara langsung tanpa kata penghubung disebut...',
    options: ['Personifikasi', 'Metafora', 'Hiperbola', 'Simile', 'Aliterasi'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Majas',
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
    difficulty: 'easy',
    topic: 'Teks Persuasi',
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
    difficulty: 'easy',
    topic: 'Kalimat Pasif',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bagian akhir dari sebuah cerpen yang berisi penyelesaian masalah disebut...',
    options: ['Orientasi', 'Komplikasi', 'Resolusi', 'Koda', 'Abstrak'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Struktur Cerpen',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Antonim dari kata "Prolog" adalah...',
    options: ['Dialog', 'Monolog', 'Epilog', 'Katalog', 'Analog'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Antonim',
  },

  // Literasi Bahasa Inggris - 8 Soal
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Choose the correct form: "She ___ to the market every Sunday."',
    options: ['Go', 'Goes', 'Going', 'Gone', 'Went'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Grammar',
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
    difficulty: 'easy',
    topic: 'Parts of Speech',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Complete the sentence: "If I ___ rich, I would travel the world."',
    options: ['Am', 'Was', 'Were', 'Be', 'Been'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Conditional Sentences',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'What does the idiom "A piece of cake" mean?',
    options: ['Something delicious', 'Something very easy', 'A small portion', 'A birthday gift', 'A difficult task'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Idioms',
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
    difficulty: 'easy',
    topic: 'Tenses',
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
    difficulty: 'medium',
    topic: 'Geometri',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika 3 pekerja dapat menyelesaikan sebuah pekerjaan dalam 6 hari, berapa hari yang dibutuhkan jika dikerjakan oleh 9 pekerja?',
    options: ['18 hari', '12 hari', '4 hari', '2 hari', '3 hari'],
    correctAnswer: 3,
    difficulty: 'medium',
    topic: 'Perbandingan Berbalik Nilai',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah nilai dari 2⁵?',
    options: ['10', '16', '25', '32', '64'],
    correctAnswer: 3,
    difficulty: 'easy',
    topic: 'Eksponen',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah baju seharga Rp200.000 didiskon 25%. Berapakah harga setelah diskon?',
    options: ['Rp150.000', 'Rp175.000', 'Rp50.000', 'Rp125.000', 'Rp180.000'],
    correctAnswer: 0,
    difficulty: 'easy',
    topic: 'Aritmatika Sosial',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah peluang munculnya angka genap pada pelemparan sebuah dadu?',
    options: ['1/6', '1/3', '1/2', '2/3', '5/6'],
    correctAnswer: 2,
    difficulty: 'easy',
    topic: 'Peluang',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika f(x) = 2x + 3, maka f(5) adalah...',
    options: ['10', '13', '15', '18', '25'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Fungsi',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Berapakah jumlah sudut dalam sebuah segitiga?',
    options: ['90°', '180°', '270°', '360°', '540°'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Geometri',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika 2, 4, x, 16 adalah deret geometri, maka nilai x adalah...',
    options: ['6', '8', '10', '12', '14'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Deret Geometri',
  },
  // Additional Questions to reach 70+
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Semua kucing adalah hewan. Beberapa hewan adalah karnivora. Simpulan yang paling mungkin adalah...',
    options: ['Semua kucing adalah karnivora', 'Beberapa kucing adalah karnivora', 'Mungkin ada kucing yang karnivora', 'Tidak ada kucing yang karnivora', 'Semua karnivora adalah kucing'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'Silogisme',
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x + 2y = 10 and 2x + y = 11, maka nilai x + y adalah...',
    options: ['7', '8', '9', '10', '11'],
    correctAnswer: 0,
    difficulty: 'medium',
    topic: 'Sistem Persamaan',
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'The word "ubiquitous" is closest in meaning to...',
    options: ['Rare', 'Everywhere', 'Hidden', 'Unique', 'Expensive'],
    correctAnswer: 1,
    difficulty: 'hard',
    topic: 'Vocabulary',
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Rata-rata nilai 5 siswa adalah 80. Jika satu siswa dengan nilai 90 bergabung, rata-rata barunya adalah...',
    options: ['81', '81.6', '82', '82.5', '85'],
    correctAnswer: 1,
    difficulty: 'medium',
    topic: 'Statistika',
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
      const chunkSize = 15;
      for (let i = 0; i < questionIds.length; i += chunkSize) {
        const chunk = questionIds.slice(i, i + chunkSize);
        const tRef = doc(collection(db, 'tryouts'));
        batch.set(tRef, {
          title: `Simulasi UTBK SNBT 2026 - Paket ${Math.floor(i / chunkSize) + 1}`,
          duration: chunk.length * 1.5, // 1.5 minutes per question
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
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${isDone ? 'bg-green-50 text-green-500' : 'bg-indigo-50 text-indigo-500'} rounded-2xl flex items-center justify-center transition-colors`}>
          {isDone ? <CheckCircle2 size={20} /> : <Database size={20} />}
        </div>
        <div>
          <h3 className="text-sm font-bold">Comprehensive Content</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">UTBK 2026 Standards</p>
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
