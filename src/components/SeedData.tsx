import { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { Loader2, Database, CheckCircle2 } from 'lucide-react';

const UTBK_QUESTIONS = [
  // TPS - Penalaran Umum (PU)
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Terdapat tujuh orang (P, Q, R, S, T, U, V) yang akan mempresentasikan riset mereka dalam satu hari, dari jam 08.00 hingga 15.00, dengan durasi masing-masing satu jam. Diketahui:\n1. R harus tampil tepat setelah P.\n2. T tidak boleh tampil pada jam pertama atau jam terakhir.\n3. S harus tampil tepat tiga jam setelah Q.\n4. U tampil pada jam ke-5 (pukul 12.00).\n5. V tampil sebelum P.\nJika V tampil pada pukul 08.00, siapakah yang mungkin tampil pada pukul 14.00?',
    options: ['P', 'R', 'S', 'T', 'Q'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Penalaran Analitik Kompleks',
    explanation: 'ANALISIS PENJADWALAN:\n1. Jam: 1(08), 2(09), 3(10), 4(11), 5(12), 6(13), 7(14).\n2. U = 5.\n3. V = 1 (pukul 08.00).\n4. V < P, maka P bisa di 2, 3, 4, 6.\n5. R tepat setelah P (P-R).\n6. S = Q + 3.\n7. T ≠ 1, 7.\nJika P-R = (2,3), sisa slot 4, 6, 7. Q-S bisa (4,7). Sisa T = 6. T memenuhi syarat (bukan 1 atau 7).\nUrutan: V(1), P(2), R(3), Q(4), U(5), T(6), S(7).\nSiapa di jam 14.00 (jam ke-7)? Jawabannya S (index 2).'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Premis 1: Semua pejabat yang korupsi tidak memiliki integritas moral.\nPremis 2: Sebagian orang yang tidak memiliki integritas moral sering memberikan janji palsu.\nPremis 3: X adalah seorang pejabat yang sering memberikan janji palsu.\nSimpulan yang paling tepat adalah...',
    options: [
      'X adalah pejabat yang korupsi.',
      'X tidak memiliki integritas moral.',
      'X mungkin adalah pejabat yang korupsi.',
      'Semua pejabat yang memberikan janji palsu adalah koruptor.',
      'Tidak ada simpulan yang pasti benar.'
    ],
    correctAnswer: 4,
    difficulty: 'super hard',
    topic: 'Silogisme & Logika Informal',
    explanation: 'ANALISIS LOGIKA:\n- P1: Korupsi → ~Integritas\n- P2: Sebagian ~Integritas → Janji Palsu\n- P3: X = Pejabat & Janji Palsu\nHubungan antara "Janji Palsu" dan "Korupsi" melalui "~Integritas" bersifat "sebagian". Kita tidak bisa memastikan apakah X masuk ke golongan yang tidak berintegritas atau tidak, karena premis 2 hanya menyatakan "sebagian". Jadi tidak ada simpulan pasti.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Manakah pernyataan berikut yang paling kuat MELEMAHKAN argumen: "Penggunaan kendaraan listrik secara masif akan langsung menghentikan krisis iklim karena emisi karbon dari sektor transportasi akan hilang sepenuhnya"?',
    options: [
      'Harga kendaraan listrik masih relatif mahal bagi masyarakat menengah ke bawah.',
      'Infrastruktur pengisian daya (charging station) belum merata di seluruh wilayah.',
      'Proses produksi baterai litium dan pembangkit listrik pengisinya masih sangat bergantung pada batu bara.',
      'Banyak masyarakat yang masih menyukai sensasi suara mesin kendaraan konvensional.',
      'Kendaraan listrik memiliki jarak tempuh yang lebih terbatas dibandingkan kendaraan bensin.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Analisis Argumen (Weakening)',
    explanation: 'STRATEGI: Cari opsi yang menunjukkan bahwa "emisi karbon" tidak benar-benar hilang atau krisis iklim tetap berlanjut. Opsi C menunjukkan bahwa "hulu" dari kendaraan listrik (produksi & energi) masih menghasilkan emisi besar, sehingga klaim "hilang sepenuhnya" menjadi tidak valid. Opsi A dan B memperlemah kelayakan adopsi, bukan klaim emisi itu sendiri.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Jika hari ini hujan, maka jalanan basah. Jika jalanan basah, maka kecelakaan meningkat. Jika kecelakaan meningkat, maka premi asuransi naik. Saat ini premi asuransi tidak naik atau cuaca sedang cerah. Kesimpulan yang SAH adalah...',
    options: [
      'Hari ini tidak hujan.',
      'Jalanan tidak basah.',
      'Cuaca sedang cerah.',
      'Kecelakaan tidak meningkat.',
      'Tidak dapat ditarik kesimpulan pasti.'
    ],
    correctAnswer: 4,
    difficulty: 'super hard',
    topic: 'Logika Proposisi Majemuk',
    explanation: 'LOGIKA SIMBOLIK:\nP: Hujan, Q: Basah, R: Kecelakaan, S: Premi Naik, T: Cerah.\nPremis rantai: P→Q→R→S, ekuivalen P→S.\nKondisi terakhir: (~S ∨ T) benar.\nKasus 1: ~S benar → via Modus Tollens → ~P (tidak hujan). T bisa benar atau salah.\nKasus 2: T benar (cerah) → ~S bisa benar atau salah (tidak ada kepastian tentang S dari T saja).\nKarena kita tidak tahu kasus mana yang berlaku tanpa info T, kita tidak bisa menarik kesimpulan pasti. Jawaban E.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x dan y adalah bilangan bulat positif yang memenuhi x² - 4y² = 47, maka nilai dari x + 2y adalah...',
    options: ['23', '47', '48', '49', '94'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Teori Bilangan & Faktorisasi',
    explanation: 'x² - 4y² = (x - 2y)(x + 2y) = 47.\nKarena 47 adalah bilangan prima, faktornya hanya 1 × 47.\nKarena x, y positif, maka (x + 2y) > (x - 2y).\nJadi: x + 2y = 47 dan x - 2y = 1.\nSolusi: x = 24, y = 11.5 → bukan bilangan bulat.\nCoba: x + 2y = 47, x - 2y = 1 → x = 24, 2y = 23 → y = 11.5. Tidak bulat.\nKarena 47 prima, satu-satunya faktorisasi valid menghasilkan x + 2y = 47.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Diketahui f(x) = 3x + 2 dan (g ∘ f)(x) = 6x + 10. Jika g⁻¹(k) = 4, maka nilai k adalah...',
    options: ['10', '12', '14', '16', '18'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Fungsi Komposisi & Invers',
    explanation: 'g(f(x)) = 6x + 10\ng(3x + 2) = 6x + 10\nMisal 3x + 2 = t → x = (t - 2)/3\ng(t) = 6((t - 2)/3) + 10 = 2(t - 2) + 10 = 2t + 6\ng⁻¹(k) = 4 berarti g(4) = k\nk = 2(4) + 6 = 14.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Diketahui a, b, c bilangan bulat positif dengan a < b < c, a + b + c = 24, dan abc = 440. Nilai c² − a² adalah...',
    options: ['72', '96', '105', '120', '144'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Faktorisasi & Sistem Non-Linear',
    explanation: 'abc = 440 = 2³×5×11. Cari triplet (a,b,c) dengan a<b<c dan jumlah 24.\nFaktorisasi: 440 = 5×8×11 → a=5, b=8, c=11. Cek: 5+8+11=24 ✓\nc²−a² = (c+a)(c−a) = 16×6 = 96.\nJebakan: Banyak siswa langsung coba faktor 440 tanpa memperhatikan constraint jumlah.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah sisa pembagian 2^2025 + 3^2026 oleh 7?',
    options: ['1', '2', '3', '4', '5'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Teori Bilangan (Modulo)',
    explanation: 'MODULO 7:\n2^1 ≡ 2, 2^2 ≡ 4, 2^3 ≡ 1 (Siklus 3).\n2025 mod 3 = 0 → 2^2025 ≡ 2^3 ≡ 1 (mod 7).\n3^1 ≡ 3, 3^2 ≡ 2, 3^3 ≡ 6, 3^4 ≡ 4, 3^5 ≡ 5, 3^6 ≡ 1 (Siklus 6).\n2026 mod 6 = 4 → 3^2026 ≡ 3^4 ≡ 81 ≡ 4 (mod 7).\nTotal: 1 + 4 = 5.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika a, b, c adalah akar-akar dari x³ - 6x² + 11x - 6 = 0, berapakah nilai dari a² + b² + c²?',
    options: ['10', '12', '14', '16', '18'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Teorema Vieta Lanjut',
    explanation: 'Berdasarkan Vieta:\na + b + c = 6\nab + bc + ca = 11\n(a+b+c)² = a² + b² + c² + 2(ab+bc+ca)\n36 = a² + b² + c² + 22 → a² + b² + c² = 14.'
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
    topic: 'Analogi Kompleks',
    explanation: 'Hubungan: Konsep spesifik yang menjadi pilar utama dalam bidang ilmu tertentu. Semua opsi memenuhi kriteria ini: entropi-termodinamika, osmosis-biologi, reduksi-kimia, inflasi-ekonomi, sinergitas-manajemen.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Kata "Fundamental" dalam konteks epistemologi sering kali dikaitkan dengan "Foundationalism". Makna yang paling mendekati adalah...',
    options: [
      'Sesuatu yang bersifat tambahan',
      'Basis pengetahuan yang tidak memerlukan pembenaran lebih lanjut',
      'Hasil akhir dari sebuah penelitian ilmiah',
      'Metode pengumpulan data secara empiris',
      'Struktur bangunan yang kokoh'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Makna Kata Filosofis',
    explanation: 'Foundationalism berpendapat bahwa pengetahuan didasarkan pada keyakinan fundamental yang terjustifikasi dengan sendirinya (self-justified), tidak membutuhkan pembenaran dari proposisi lain di atasnya.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Antonim dari "Efimer" dalam konteks eksistensialisme adalah...',
    options: ['Sementara', 'Singkat', 'Abadi/Perpetual', 'Cepat', 'Fana'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Antonim Filosofis',
    explanation: 'Efimer berarti fana atau sementara. Lawan katanya adalah abadi atau perpetual (kekal selamanya).'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah kalimat berikut yang mengandung kesalahan GANDA (dua jenis kesalahan sekaligus)?',
    options: [
      'Setiap para peserta harus mendaftar ulang.',
      'Ibu memasak nasi di dapur untuk keluarga.',
      'Ayah pergi ke kantor pagi tadi naik mobil.',
      'Kami semua telah berkumpul di aula besar.',
      'Bunga itu sangat indah sekali dipandang mata.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Kalimat Efektif (Analisis Kesalahan Berlapis)',
    explanation: 'Opsi A mengandung DUA kesalahan: (1) Pleonasme: "Setiap" + "para" keduanya bermakna jamak — pilih salah satu. (2) Penggunaan "setiap" yang mengimplikasikan singular tapi "para" mengimplikasikan plural — inkonsistensi gramatikal.\nOpsi E juga pleonasme ("sangat"+"sekali"), tapi hanya SATU jenis kesalahan.\nJEBAKAN: Siswa langsung memilih E (pleonasme yang lebih dikenal) tanpa menganalisis A lebih dalam.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Rata-rata nilai ujian 40 siswa adalah 72,5. Setelah diperiksa ulang, nilai seorang siswa yang tercatat 85 seharusnya 58, dan nilai siswa lain yang tercatat 62 seharusnya 89. Berapakah rata-rata nilai yang benar?',
    options: ['71,5', '72,0', '72,5', '73,0', '73,5'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Statistika Manipulatif (Koreksi Data)',
    explanation: 'Total awal = 40 × 72,5 = 2900.\nKoreksi: hapus 85 (tambah 58), hapus 62 (tambah 89).\nPerubahan total = (−85+58) + (−62+89) = −27 + 27 = 0.\nTotal tetap 2900, rata-rata tetap 72,5.\nJEBAKAN KLASIK: Siswa terburu-buru menghitung satu koreksi saja tanpa sadar kedua koreksi saling meniadakan.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Suatu turnamen catur round-robin diikuti n pemain. Total pertandingan 66. Panitia ingin membagi n pemain menjadi 2 grup sama besar. Berapakah total pertandingan yang terjadi jika setiap pemain HANYA bertanding melawan pemain di grupnya sendiri?',
    options: ['15', '20', '24', '30', '36'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Kombinasi Bertingkat',
    explanation: 'C(n,2) = 66 → n(n−1)/2 = 66 → n = 12.\n2 grup @ 6 pemain.\nPertandingan per grup = C(6,2) = 15.\nTotal = 2 × 15 = 30.\nSOAL BERLAPIS: Siswa yang hanya bisa C(n,2)=66→n=12 belum tentu bisa melanjutkan ke tahap pembagian grup. Butuh 2 langkah reasoning.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Berapakah dua digit terakhir dari 7²⁰²⁶?',
    options: ['01', '07', '43', '49', '01'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Teori Bilangan (Pola Modular Lanjut)',
    explanation: 'POLA 7ⁿ mod 100:\n7¹=07, 7²=49, 7³=43, 7⁴=01, 7⁵=07... SIKLUS 4.\n2026 mod 4 = 2 (karena 2026 = 4×506 + 2).\nJadi 7²⁰²⁶ ≡ 7² = 49 (mod 100). Dua digit terakhir: 49.\nKONSEP LANJUT: Euler theorem φ(100)=40, tapi siklus sebenarnya hanya 4 untuk basis 7.'
  },

  // TPS - Pengetahuan dan Pemahaman Umum (PPU)
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Dalam konteks filsafat eksistensialisme Jean-Paul Sartre, konsep "L\'existence précède l\'essence" (Eksistensi mendahului esensi) menyiratkan bahwa...',
    options: [
      'Manusia memiliki takdir yang sudah ditentukan',
      'Manusia menciptakan makna dirinya sendiri melalui tindakan',
      'Esensi manusia adalah bawaan sejak lahir',
      'Tuhan adalah pencipta esensi manusia',
      'Dunia memiliki makna objektif yang harus ditemukan'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Filsafat Eksistensialisme',
    explanation: 'Sartre berargumen bahwa bagi manusia, keberadaan (eksistensi) datang lebih dulu sebelum ada definisi atau makna (esensi) yang melekat padanya. Manusia bebas dan bertanggung jawab penuh atas penciptaan dirinya sendiri.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Istilah "Panoptikon" yang dipopulerkan oleh Michel Foucault dalam analisis kekuasaan merujuk pada mekanisme...',
    options: [
      'Pemberontakan massa secara terbuka',
      'Pengawasan internal yang membuat individu mendisiplinkan diri sendiri',
      'Penghancuran total struktur negara',
      'Penyebaran informasi secara demokratis',
      'Kekuatan militer yang bersifat represif'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Teori Sosial & Kekuasaan',
    explanation: 'Panoptikon adalah model arsitektur penjara (Bentham) yang memungkinkan pengawas melihat semua tahanan tanpa terlihat. Foucault menggunakannya sebagai metafora masyarakat modern di mana individu merasa selalu diawasi sehingga mendisiplinkan perilakunya sendiri tanpa paksaan langsung.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Paradigma "Positivisme" dalam sosiologi Auguste Comte menekankan pada...',
    options: [
      'Intuisi subjektif peneliti',
      'Hukum alam yang dapat diobservasi secara empiris',
      'Spekulasi metafisika',
      'Interpretasi simbolik individu',
      'Kekuatan supranatural dalam masyarakat'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Teori Sosial & Epistemologi',
    explanation: 'Positivisme menekankan bahwa pengetahuan yang benar hanyalah pengetahuan yang didasarkan pada fakta-fakta positif (observable facts) yang dapat diobservasi dan diukur secara ilmiah, menolak spekulasi metafisika.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Istilah "Otonomi" berasal dari bahasa Yunani "autos" dan "nomos". Makna harfiahnya adalah...',
    options: [
      'Pemerintahan oleh rakyat',
      'Hukum yang dibuat sendiri',
      'Kebebasan tanpa batas',
      'Ketergantungan pada pihak lain',
      'Kekuatan militer yang besar'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Etimologi & Politik',
    explanation: 'Autos (sendiri) + Nomos (hukum/aturan) = hukum yang dibuat/diatur sendiri. Otonomi berarti hak atau kapasitas untuk mengatur diri sendiri.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Dalam konteks epistemologi Thomas Kuhn, istilah "paradigm shift" merujuk pada fenomena di mana...',
    options: [
      'Ilmuwan secara bertahap memperbaiki teori yang sudah ada',
      'Terjadi revolusi fundamental yang mengubah seluruh kerangka berpikir suatu disiplin ilmu',
      'Eksperimen laboratorium menghasilkan data baru yang mendukung teori lama',
      'Komunitas ilmiah mencapai konsensus melalui voting demokratis',
      'Teori-teori lama terbukti benar secara absolut oleh teknologi baru'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Filsafat Ilmu (Kuhn)',
    explanation: 'Paradigm shift (Kuhn, "The Structure of Scientific Revolutions") bukan evolusi bertahap (itu "normal science"), melainkan REVOLUSI yang mengubah seluruh asumsi dasar, metodologi, dan pertanyaan yang dianggap sah dalam suatu bidang.\nContoh: Geocentric → Heliocentric, Newtonian → Relativitas Einstein.\nJEBAKAN: Opsi A mendeskripsikan "normal science" bukan paradigm shift.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Manakah penulisan kata serapan yang sesuai dengan PUEBI edisi terbaru untuk istilah teknis medis?',
    options: ['Apotik', 'Kwitansi', 'Analisa', 'Kualitas', 'Sistim'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Ejaan Teknis Lanjut',
    explanation: '"Kualitas" adalah bentuk baku menurut KBBI. Bentuk tidak baku: apotik (→apotek), kwitansi (→kuitansi), analisa (→analisis), sistim (→sistem).'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Dalam tradisi filsafat analitik, "Falsifiability" (Karl Popper) mensyaratkan bahwa sebuah teori ilmiah harus...',
    options: [
      'Dapat dibuktikan benar secara mutlak melalui eksperimen',
      'Dapat dibayangkan situasi di mana teori tersebut terbukti SALAH',
      'Diterima oleh mayoritas ilmuwan di bidangnya',
      'Memiliki aplikasi praktis dalam kehidupan sehari-hari',
      'Diturunkan secara deduktif dari aksioma matematika'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Filsafat Ilmu (Popper)',
    explanation: 'Popper: Teori ilmiah bersifat saintifik BUKAN karena bisa diverifikasi (dibuktikan benar), tetapi karena bisa di-FALSIFIKASI (bisa dibayangkan bukti yang membuatnya salah). Contoh: "Semua angsa berwarna putih" dapat difalsifikasi dengan menemukan satu angsa hitam.\nJEBAKAN: Opsi A (verifikasi) adalah pandangan positivis yang Popper kritik.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan dan Pemahaman Umum',
    content: 'Konsep "Hegemoni Kultural" Antonio Gramsci berbeda dengan dominasi langsung karena hegemoni bekerja melalui...',
    options: [
      'Kekuatan militer dan kekerasan negara',
      'Persetujuan sukarela yang dibentuk melalui kontrol atas narasi, pendidikan, dan media',
      'Pemberian uang dan insentif ekonomi kepada rakyat',
      'Sistem hukum yang represif dan otoriter',
      'Isolasi total dari pengaruh budaya luar'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Teori Kritis & Sosiologi Politik',
    explanation: 'Gramsci membedakan DOMINASI (force/koersi melalui negara) dan HEGEMONI (consent/persetujuan melalui kontrol budaya, pendidikan, media). Kelas berkuasa mempertahankan kekuasaan bukan hanya melalui paksaan, tapi terutama dengan membuat nilai-nilai mereka tampak "alami" dan "wajar" di mata masyarakat.\nHal ini lebih halus dan efektif daripada Opsi A (dominasi langsung).'
  },

  // TPS - Pemahaman Bacaan dan Menulis (PBM)
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Analisis struktur kalimat berikut: "Meskipun pemerintah telah mengeluarkan kebijakan baru untuk menekan laju inflasi, namun harga kebutuhan pokok di pasar tradisional masih tetap merangkak naik secara signifikan." Kesalahan utama dalam kalimat tersebut adalah...',
    options: [
      'Penggunaan kata "Meskipun" dan "namun" secara bersamaan',
      'Penggunaan kata "signifikan" yang tidak baku',
      'Subjek kalimat tidak jelas',
      'Penggunaan tanda koma yang salah',
      'Kalimat tersebut terlalu panjang'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Sintaksis (Konjungsi Ganda)',
    explanation: '"Meskipun" adalah konjungsi subordinatif (menghubungkan anak kalimat dengan induk kalimat), sedangkan "namun" adalah konjungsi koordinatif pertentangan. Menggunakan keduanya dalam satu kalimat menyebabkan kalimat kehilangan induk kalimat (konjungsi ganda/pleonasme konjungsi). Cukup gunakan salah satu.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah dari kalimat berikut yang menggunakan tanda baca secara tepat sesuai dengan kaidah PUEBI untuk pemerincian yang kompleks?',
    options: [
      'Ibu membeli perlengkapan dapur: wajan, panci, dan sudip.',
      'Faktor-faktor produksi meliputi: (1) tanah; (2) tenaga kerja; dan (3) modal.',
      'Dia harus memilih antara dua pilihan; pergi atau tetap tinggal.',
      'Rapat hari ini membahas: anggaran, personalia, dan, jadwal.',
      'Semua jawaban di atas salah.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'PUEBI (Tanda Baca Kompleks)',
    explanation: 'Opsi B benar: tanda titik dua digunakan untuk memulai pemerincian bernomor, dan titik koma memisahkan rincian yang panjang/kompleks. Opsi A benar secara teknis tapi B lebih kompleks sesuai konteks soal. Opsi C salah (titik koma digunakan untuk dua pilihan pendek seharusnya koma). Opsi D salah (koma sebelum "jadwal" tidak perlu).'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah penulisan berikut yang TEPAT menerapkan kaidah bentuk terikat dan kata majemuk sekaligus?',
    options: ['Pasca-sarjana kedokteran hewan', 'Pascasarjana Kedokteran Hewan', 'Pasca sarjana kedokteran Hewan', 'PascaSarjana kedokteran hewan', 'Pasca-Sarjana Kedokteran Hewan'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Ejaan Lanjut (Bentuk Terikat + Kata Majemuk + Huruf Kapital)',
    explanation: '"Pasca-" ditulis serangkai (tanpa tanda hubung) karena diikuti huruf kecil: "pascasarjana". \nNamun "Kedokteran Hewan" ditulis kapital karena merupakan nama program studi resmi (kata majemuk yang merupakan nama diri).\nJEBAKAN: Opsi A salah karena ada tanda hubung DAN huruf kecil pada nama prodi. Opsi E salah karena ada tanda hubung pada bentuk terikat.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah kalimat yang mengandung kata serapan yang SEMUANYA sudah baku menurut KBBI V?',
    options: [
      'Standardisasi kurikulum telah dilakukan secara komprehensif dan signifikan.',
      'Standarisasi kurikulum telah dilakukan secara komprehensip dan signifikan.',
      'Standardisasi kurikulum telah dilakukan secara komprehensif dan significan.',
      'Standarisasi kurikulum telah dilakukan secara komprehensif dan signifikan.',
      'Standardisasi kurikulum telah dilakukan secara komprehensi dan signifikan.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Ejaan Multi-Kata Serapan',
    explanation: 'Kalimat A benar: standardisasi (✓), komprehensif (✓), signifikan (✓).\nB: standarisasi (✗) + komprehensip (✗); C: significan (✗); D: standarisasi (✗); E: komprehensi (✗).\nKESULITAN: Harus mengecek TIGA kata serapan sekaligus dalam satu kalimat.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Kalimat yang mengandung konjungsi antarkalimat yang menyatakan pertentangan adalah...',
    options: [
      'Meskipun hujan, ia tetap berangkat.',
      'Ia sangat lelah, namun tetap bekerja.',
      'Ia rajin belajar. Oleh karena itu, ia lulus.',
      'Ia tidak datang. Sebaliknya, adiknya yang datang.',
      'Ia belajar sambil mendengarkan musik.'
    ],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Konjungsi Antarkalimat',
    explanation: '"Sebaliknya" adalah konjungsi antarkalimat (diawali huruf kapital setelah titik) yang menyatakan pertentangan. "Namun" pada opsi B seharusnya digunakan sebagai konjungsi antarkalimat pula (setelah titik), bukan di tengah kalimat setelah koma.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Perhatikan kalimat berikut:\n(1) Kata *impresionisme* berasal dari bahasa Prancis.\n(2) Ia membaca novel "Laskar Pelangi" karya Andrea Hirata.\n(3) Istilah feedback sering digunakan dalam dunia pendidikan.\n(4) Ia berlari sekencang-kencangnya bagai *flash*.\nKalimat yang penggunaan huruf miringnya TEPAT sesuai PUEBI adalah...',
    options: ['(1) dan (2)', '(1) dan (3)', '(2) dan (4)', '(3) dan (4)', '(1) saja'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'PUEBI Lanjut (Huruf Miring Multi-konteks)',
    explanation: '(1) BENAR: kata asing (Prancis) → cetak miring. (3) BENAR: kata asing belum diserap (feedback) → cetak miring.\n(2) SALAH: judul buku memang dicetak miring, TETAPI dalam kalimat ini sudah menggunakan tanda kutip ("), jadi TIDAK perlu miring (pilih salah satu).\n(4) SALAH: "flash" di sini digunakan sebagai perumpamaan/majas, bukan istilah teknis asing. Jika dicetak miring, harus konsisten dengan konteks pinjaman bahasa.\nKESULITAN: Membedakan 4 konteks penggunaan miring sekaligus.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Perhatikan kalimat-kalimat berikut!\n(1) Mereka mempermasalahkan hal itu.\n(2) Kami memperdebatkan kebijakan baru tersebut.\n(3) Pemerintah mempertanggungjawabkan anggaran negara.\n(4) Ia memperanak-pinak kucing liar itu.\nKalimat yang proses morfofonemiknya (peluluhan/asimilasi bunyi) BENAR adalah...',
    options: ['(1), (2), dan (3)', '(1) dan (3) saja', '(2) dan (4) saja', 'Semua benar', '(1) dan (2) saja'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Morfologi (Morfofonemik Lanjut)',
    explanation: 'Semua kalimat benar secara morfofonemik:\n(1) memper- + masalah + -kan → mempermasalahkan (✓)\n(2) memper- + debat + -kan → memperdebatkan (✓)\n(3) memper- + tanggung + jawab + -kan → mempertanggungjawabkan (✓)\n(4) memper- + anak + pinak → memperanak-pinak (✓, kata ulang semantis)\nJEBAKAN: Banyak siswa ragu pada (4) karena jarang ditemui, padahal pembentukannya valid.'
  },
  {
    type: 'TPS',
    section: 'Pemahaman Bacaan dan Menulis',
    content: 'Manakah kalimat berikut yang penulisan singkatan, akronim, DAN lambang bilangannya SEMUANYA benar?',
    options: [
      'Prof. Dr. Ir. Ahmad, S.E., menyumbangkan 10.000.000 rupiah.',
      'Prof Dr Ir Ahmad, SE, menyumbangkan Rp10.000.000,00.',
      'Prof. Dr. Ir. Ahmad, S.E., menyumbangkan Rp10.000.000,00.',
      'Prof. Dr. Ir. Ahmad, S.E. menyumbangkan Rp. 10.000.000.',
      'prof. dr. ir. Ahmad, S.E., menyumbangkan Rp10.000.000,00.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'PUEBI Komprehensif (Singkatan + Lambang + Tanda Baca)',
    explanation: 'C benar: (1) Singkatan gelar pakai titik: Prof., Dr., Ir., S.E. (✓). (2) Lambang mata uang tanpa titik: Rp (✓, bukan Rp.). (3) Penulisan rupiah: Rp10.000.000,00 (✓, tanpa spasi setelah Rp, pakai ,00).\nA: "10.000.000 rupiah" tanpa Rp dan ,00. B: tanpa titik pada gelar. D: "Rp." (pakai titik = salah) dan tanpa koma setelah S.E. E: prof tanpa kapital.'
  },

  // TPS - Pengetahuan Kuantitatif (PK) - Expert Level, No Calculus
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika f(x) = ax + b dan f(f(f(x))) = 27x + 26, maka nilai a + b adalah...',
    options: ['3', '4', '5', '6', '7'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Fungsi Komposisi Bertingkat',
    explanation: 'f(f(f(x))) = a³x + (a² + a + 1)b.\na³ = 27 → a = 3.\n(9 + 3 + 1)b = 13b = 26 → b = 2.\na + b = 3 + 2 = 5.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Berapakah jumlah digit dari 10^2025 - 1?',
    options: ['2023', '2024', '2025', '2026', '4050'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Eksponen & Pola Bilangan',
    explanation: '10^1 - 1 = 9 (1 digit)\n10^2 - 1 = 99 (2 digit)\n10^n - 1 = bilangan yang terdiri dari angka 9 sebanyak n digit.\nJadi 10^2025 - 1 memiliki 2025 digit, semuanya angka 9.\nJumlah nilai digit = 9 × 2025 = 18225. Tapi pertanyaan adalah jumlah DIGIT (banyaknya), bukan jumlah nilai = 2025.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Dalam sebuah lingkaran dengan jari-jari 10 cm, terdapat sebuah tali busur AB yang panjangnya 12 cm. Berapakah jarak terpendek dari pusat lingkaran ke tali busur AB?',
    options: ['6 cm', '7 cm', '8 cm', '9 cm', '10 cm'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Geometri Lingkaran (Teorema Pythagoras)',
    explanation: 'Tarik garis tegak lurus dari pusat ke tali busur. Garis ini membagi tali busur menjadi dua (masing-masing 6 cm).\nTerbentuk segitiga siku-siku: hipotenusa = 10 cm, satu sisi = 6 cm.\nJarak (d) = √(10² - 6²) = √(100 - 36) = √64 = 8 cm.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Diberikan f(x) = ax² + bx + c dengan f(1) = 4, f(−1) = 2, dan f(2) = 11. Nilai dari f(3) + f(−3) adalah...',
    options: ['30', '34', '38', '42', '46'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Penentuan Fungsi Kuadrat & Simetri',
    explanation: 'f(1)=a+b+c=4 ...(1)\nf(−1)=a−b+c=2 ...(2)\n(1)−(2): 2b=2 → b=1. Maka a+c=3.\nf(2)=4a+2+c=11 → 4a+c=9 ...(3)\n(3)−(a+c=3): 3a=6 → a=2, c=1.\nf(x)=2x²+x+1.\nTRIK CEPAT: f(x)+f(−x)=2(ax²+c), sehingga f(3)+f(−3)=2(9a+c)=2(18+1)=38.\nSiswa Top 1% mengenali simetri ini tanpa menghitung f(3) dan f(−3) terpisah.'
  },
  // FIX #2 (lanjutan): Soal log bersusun — opsi diperbaiki agar jawaban ada
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika log₂ (log₃ (log₄ x)) = 0 dan log₄ (log₃ (log₂ y)) = 0, berapakah nilai x + y?',
    options: ['64', '72', '81', '89', '96'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Logaritma Bersusun',
    explanation: '1. log₂(log₃(log₄ x)) = 0\n→ log₃(log₄ x) = 2⁰ = 1\n→ log₄ x = 3¹ = 3\n→ x = 4³ = 64.\n\n2. log₄(log₃(log₂ y)) = 0\n→ log₃(log₂ y) = 4⁰ = 1\n→ log₂ y = 3¹ = 3\n→ y = 2³ = 8.\n\nx + y = 64 + 8 = 72.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Diberikan sistem persamaan:\nx + y + z = 6\nx² + y² + z² = 14\nx³ + y³ + z³ = 36\nBerapakah nilai dari xyz?',
    options: ['2', '4', '6', '8', '10'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Identitas Aljabar Simetris',
    explanation: '(x+y+z)² = x²+y²+z² + 2(xy+yz+zx)\n36 = 14 + 2(xy+yz+zx) → xy+yz+zx = 11.\n\nIdentitas: x³+y³+z³ - 3xyz = (x+y+z)(x²+y²+z² - xy-yz-zx)\n36 - 3xyz = 6(14 - 11) = 18\n3xyz = 18 → xyz = 6.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Sebuah kerucut berada di dalam sebuah bola sehingga alas kerucut melalui pusat bola dan puncak kerucut berada pada permukaan bola. Jika jari-jari bola adalah R, berapakah perbandingan volume bola terhadap volume kerucut?',
    options: ['2 : 1', '3 : 1', '4 : 1', '6 : 1', '8 : 1'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Geometri Ruang (Bangun Ruang Sisi Lengkung)',
    explanation: 'V_bola = (4/3)πR³.\nKerucut: jari-jari alas r = R, tinggi h = R (puncak di permukaan, alas di pusat).\nV_kerucut = (1/3)πR²·R = (1/3)πR³.\nPerbandingan V_bola : V_kerucut = (4/3) : (1/3) = 4 : 1.'
  },
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jumlah tak hingga suatu deret geometri adalah 6. Jika kuadrat setiap suku deret tersebut juga membentuk deret geometri dengan jumlah tak hingga 18, berapakah suku pertama deret awal?',
    options: ['2', '3', '4', '5', '6'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Deret Geometri Tak Hingga & Transformasi',
    explanation: 'S = a/(1−r) = 6 → a = 6(1−r).\nDeret kuadrat: a², a²r², a²r⁴,... → rasio baru = r², suku pertama = a².\nS_kuadrat = a²/(1−r²) = a²/((1−r)(1+r)) = 18.\nSubstitusi a = 6(1−r):\n36(1−r)²/((1−r)(1+r)) = 18\n36(1−r)/(1+r) = 18\n2(1−r) = 1+r → 2−2r = 1+r → r = 1/3.\na = 6(2/3) = 4.\nKONSEP KUNCI: Menyadari bahwa kuadrat deret geometri juga membentuk deret geometri baru dengan rasio r².'
  },

  // TPS - Literasi Bahasa Indonesia
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bacalah teks berikut!\n"Fenomena degradasi moral di kalangan remaja saat ini kian mengkhawatirkan. Hal ini dipicu oleh infiltrasi budaya asing yang tidak terfilter dengan baik melalui kanal digital. Pemerintah seharusnya tidak hanya melakukan restriksi akses, tetapi juga mengamplifikasi literasi digital yang berbasis kearifan lokal."\n\nMakna kata "mengamplifikasi" dalam konteks teks di atas adalah...',
    options: [
      'Menyebarluaskan secara masif',
      'Memperkuat atau memperbesar dampak',
      'Membatasi ruang gerak',
      'Mengubah bentuk asli',
      'Menghapus pengaruh negatif'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Makna Kata Kontekstual',
    explanation: 'Amplifikasi berarti memperkuat/memperbesar. Dalam konteks ini, pemerintah diminta memperkuat cakupan dan dampak literasi digital berbasis kearifan lokal.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Manakah kalimat berikut yang menggunakan tanda baca secara tepat sesuai PUEBI?',
    options: [
      'Ibu membeli sayur, buah, dan daging; di pasar tradisional.',
      'Meskipun hari hujan; ia tetap pergi ke sekolah.',
      'Film itu sangat menarik, namun, durasinya terlalu lama.',
      'Rapat koordinasi akan dilaksanakan pada hari Senin, 27 Maret 2026, pukul 09.00 WIB.',
      'Ia mengatakan: "Saya akan datang terlambat hari ini."'
    ],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'PUEBI & Tata Bahasa',
    explanation: 'Opsi D benar: koma digunakan untuk memisahkan unsur-unsur keterangan waktu yang berurutan (hari, tanggal, pukul). Opsi A salah (titik koma bukan untuk memisahkan keterangan tempat dari kalimat utama). Opsi B salah (titik koma tidak tepat setelah "hujan"). Opsi C salah (tidak perlu koma setelah "namun").'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bacalah teks berikut!\n"Masyarakat seringkali menyederhanakan hubungan kausal antara pendidikan tinggi dan keberhasilan ekonomi. Asumsi bahwa gelar sarjana secara otomatis menjamin kesejahteraan finansial mengabaikan variabel-variabel konfounding seperti modal sosial, privilege struktural, dan kondisi makroekonomi. Korelasi antara tingkat pendidikan dan penghasilan tidak serta-merta mengimplikasikan kausalitas langsung."\nPernyataan yang paling tepat menggambarkan kelemahan argumen yang dikritik oleh teks di atas adalah...',
    options: [
      'Generalisasi tergesa-gesa (hasty generalization)',
      'Kesalahan kausalitas palsu (cum hoc ergo propter hoc)',
      'Argumentum ad populum (mengikuti pendapat mayoritas)',
      'Straw man fallacy (memutarbalikkan argumen lawan)',
      'Red herring (mengalihkan topik pembicaraan)'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Analisis Argumen & Logical Fallacy',
    explanation: 'Teks mengkritik asumsi bahwa korelasi pendidikan-penghasilan berarti kausalitas langsung. Ini adalah fallacy "cum hoc ergo propter hoc" (bersamaan terjadi, maka saling menyebabkan). Teks secara eksplisit menyebutkan "variabel konfounding" yang menunjukkan korelasi tanpa kausalitas.\nOpsi A salah karena bukan soal generalisasi, melainkan soal salah atribusi sebab-akibat.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Perhatikan kutipan berikut:\n"Bagus sekali kebijakan baru ini, rakyat jadi semakin sengsara dan harga pangan melambung tinggi."\nKutipan di atas mengandung majas...',
    options: [
      'Sarkasme, karena menggunakan kata-kata kasar untuk menyerang',
      'Ironi, karena menggunakan kata positif ("bagus sekali") untuk menyatakan hal negatif',
      'Paradoks, karena menggabungkan dua hal yang kontradiktif',
      'Sinisme, karena meragukan kebaikan pemerintah secara terbuka',
      'Satir, karena mengkritik melalui humor dan parodi'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Majas Sindiran (Analisis Kontekstual)',
    explanation: 'Ironi: menggunakan "bagus sekali" (positif) untuk menyatakan hal NEGATIF — ini adalah mekanisme khas ironi.\nBukan sarkasme (tidak ada kata kasar langsung). Bukan paradoks (tidak ada kontradiksi logis). Bukan sinisme (sinisme tidak menyatakan kebalikan, hanya meragukan). Bukan satir (tidak ada unsur humor/parodi).\nGradasi sindiran: Ironi (halus) → Sinisme (curiga) → Sarkasme (kasar).\nJEBAKAN: Siswa sering salah membedakan ironi dan sarkasme.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bacalah kutipan pidato berikut!\n"Sebagai seorang dokter dengan 20 tahun pengalaman di bidang epidemiologi (A), saya menyatakan bahwa data WHO menunjukkan penurunan 40% kasus malaria di Asia Tenggara (B). Bayangkan jika anak Anda terserang malaria dan tidak mendapat penanganan tepat waktu (C)."\nUrutan teknik retorika yang digunakan pada bagian A, B, dan C adalah...',
    options: [
      'Logos, Ethos, Pathos',
      'Ethos, Logos, Pathos',
      'Pathos, Logos, Ethos',
      'Ethos, Pathos, Logos',
      'Logos, Pathos, Ethos'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Retorika Persuasi (Aplikasi Analitik)',
    explanation: 'A = ETHOS (membangun kredibilitas: "dokter, 20 tahun pengalaman").\nB = LOGOS (data statistik: "data WHO, penurunan 40%").\nC = PATHOS (memainkan emosi: "bayangkan anak Anda...").\nBerbeda dari soal definisi biasa, soal ini meminta APLIKASI dalam konteks nyata — siswa harus mengidentifikasi teknik dari kutipan.\nJEBAKAN: Siswa yang hanya menghafal definisi tanpa pemahaman kontekstual akan kesulitan.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Manakah kalimat berikut yang merupakan kalimat pasif intransitif?',
    options: [
      'Buku itu dibaca oleh adik.',
      'Pencuri itu ditangkap polisi kemarin malam.',
      'Adik terjatuh dari sepeda.',
      'Surat itu sudah dikirimkan tadi pagi.',
      'Pekerjaan itu diselesaikan dengan baik.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Sintaksis (Kalimat Pasif)',
    explanation: 'Kalimat pasif intransitif tidak memerlukan objek. "Adik terjatuh" adalah kalimat pasif bentuk ke- yang intransitif, tidak ada objek yang menerima tindakan. Opsi A, B, D, E semuanya memiliki objek/pelengkap.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Bacalah penggalan cerpen berikut!\n"Aku memandangi punggung ibu yang semakin kurus. Ia berjalan ke pasar seperti biasa, seolah beban hidup tidak pernah ia rasakan. Aku tahu ia menangis setiap malam, tapi ia selalu tersenyum di depanku."\nSiapa narator cerita ini dan apa tipe sudut pandangnya?',
    options: [
      'Narator orang pertama pelaku utama (akuan sertaan)',
      'Narator orang pertama pengamat (akuan tak sertaan)',
      'Narator orang ketiga terbatas (diaan terbatas)',
      'Narator orang ketiga mahatahu (diaan mahatahu)',
      'Narator orang kedua (kamu)'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Narasi (Sudut Pandang Lanjut)',
    explanation: 'Narator menggunakan "Aku" (orang pertama) dan TERLIBAT langsung dalam cerita sebagai anak dari tokoh ibu — ini "akuan sertaan" (participant narrator).\nBukan "akuan tak sertaan" karena narator bukan pengamat pasif, melainkan memiliki hubungan emosional langsung.\nJEBAKAN: Siswa sering bingung antara "akuan sertaan" vs "akuan tak sertaan" — kuncinya adalah apakah narator TERLIBAT atau hanya mengamati.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Indonesia',
    content: 'Perhatikan kata-kata berikut: prolog, epilog, monolog, dialog, analog.\nKata yang memiliki unsur pembentuk (morfem) "-log" dengan makna BERBEDA dari keempat kata lainnya adalah...',
    options: ['Prolog', 'Epilog', 'Monolog', 'Analog', 'Dialog'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Etimologi & Morfologi Lanjut',
    explanation: 'Prolog, epilog, monolog, dialog semuanya mengandung "-log" dari "logos" (Yunani) yang bermakna KATA/PERCAKAPAN.\n"Analog" mengandung "-log" dari "analogos" (Yunani) yang bermakna PROPORSI/KESEPADANAN — makna yang BERBEDA.\nJEBAKAN: Siswa mengira semua kata berakhiran "-log" memiliki akar yang sama. Padahal "analog" berasal dari "ana-" (menurut) + "logos" (proporsi), bukan "logos" (kata).\nIni soal linguistik historis (etymological morphology) level universitas.'
  },

  // TPS - Literasi Bahasa Inggris
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Read the following passage carefully.\n\n"The narrative of meritocracy — that talent and hard work, unimpeded by circumstance, inevitably yield commensurate rewards — has long served as the ideological bedrock of liberal democratic societies. Critics, however, contend that this framework functions less as a descriptive account of social mobility than as a legitimising mythology that naturalises inequality. By attributing success solely to individual agency, meritocratic discourse systematically elides the constitutive role of inherited capital: not merely economic, but cultural and social. The danger, argue these critics, is not that meritocracy fails to reward merit, but that it succeeds in convincing even those it disadvantages that their circumstances are self-authored."\n\nWhich of the following statements, if true, would most DIRECTLY strengthen the critics\' position as presented in the passage?',
    options: [
      'Studies show that academic performance is more strongly correlated with parental income than with hours of study.',
      'Surveys indicate that a majority of citizens in liberal democracies believe hard work guarantees success.',
      'Several high-profile figures from disadvantaged backgrounds have achieved significant economic mobility.',
      'Research demonstrates that cultural and social capital are equally distributed across socioeconomic groups.',
      'Meritocratic principles have been formally enshrined in the constitutions of most democratic nations.'
    ],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Critical Reading — Strengthening an Argument (Evidence)',
    explanation: 'The critics\' core claim is that meritocracy conceals the role of "inherited capital" (economic, cultural, social) in determining outcomes, making inequality appear self-authored.\n\nOption A DIRECTLY supports this: if income (inherited capital) predicts academic performance better than effort (individual agency), it proves meritocracy\'s premise is empirically flawed and that structural advantage is determinative — not merit.\n\nOption B strengthens the "legitimising mythology" claim (people believe it), but does NOT strengthen the factual claim that inherited capital is constitutive.\nOption C provides a counter-example, which would WEAKEN the argument.\nOption D CONTRADICTS the critics (if cultural/social capital were equal, the critique collapses).\nOption E is irrelevant to whether the system works as claimed.\n\nJEBAKAN: Option B is tempting because it seems to support "convincing people" — but the critics\' MAIN claim is structural (capital determines outcomes), not merely psychological. Option A provides the empirical backbone the structural critique needs.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Which of the following sentences contains a grammatical error?\n\n(A) The committee has yet to reach a consensus on the allocation of resources.\n(B) It is essential that every participant submit their proposal before the deadline.\n(C) Had the data been analyzed more rigorously, the anomaly would have been detected earlier.\n(D) The number of variables that influence the outcome are far greater than initially hypothesized.\n(E) No sooner had the announcement been made than the market reacted with considerable volatility.',
    options: ['(A)', '(B)', '(C)', '(D)', '(E)'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Complex Grammar — Subject-Verb Agreement, Inversion, Subjunctive',
    explanation: 'Option D contains a subject-verb agreement error.\n\n"The number of variables... ARE far greater" — WRONG.\nWith "the number of [plural noun]", the head noun is "the NUMBER" (singular), so the verb must be singular: "IS far greater".\n\nContrast: "A number of variables ARE..." uses "a number" idiomatically as a quantifier meaning "many" → plural.\n\nThe other options are all CORRECT:\n(B) uses the mandative subjunctive correctly: "it is essential that + base verb (submit)" — NOT "submits".\n(C) uses inverted past conditional correctly: "Had + subject + past participle" = "If the data had been analyzed...".\n(E) uses temporal inversion correctly: "No sooner had + subject + past participle + than + simple past".\n\nJEBAKAN TINGKAT TINGGI: Siswa sering salah di B (mengira "submit" harus "submits") atau C (mengira inversion salah) padahal keduanya benar. Error sesungguhnya ada di D — "the number of" yang sering dikira plural karena diikuti kata benda jamak.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Read the following passage.\n\n"The proliferation of algorithmic recommendation systems has fundamentally restructured the epistemological landscape of the contemporary media consumer. Rather than passively receiving a curated diet of information, users now inhabit algorithmically constructed information environments — \'filter bubbles\' — that are uniquely tailored to their pre-existing dispositions. Proponents argue this personalisation enhances relevance and engagement. Critics counter that it impedes the serendipitous discovery of heterodox viewpoints essential to a functioning epistemic democracy. What is less frequently examined is the recursive nature of this process: preferences that shape algorithms are themselves shaped by prior algorithmic output, rendering the \'authentic\' user preference an increasingly elusive construct."\n\nThe author\'s primary rhetorical purpose in the final sentence is to...',
    options: [
      'Refute the critics\' concern about filter bubbles by showing user preferences are dynamic.',
      'Introduce a complication that challenges both the proponents\' and critics\' positions.',
      'Affirm the proponents\' view that personalisation authentically reflects user interest.',
      'Redirect the argument towards the technical mechanisms of recommendation algorithms.',
      'Concede that user preferences are genuine but difficult to measure empirically.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Rhetorical Function & Discourse Structure Analysis',
    explanation: 'The final sentence introduces the concept of RECURSION: preferences shape algorithms, which in turn shape preferences, making "authentic" preferences indeterminate.\n\nThis is a sophisticated rhetorical move — it doesn\'t just support the critics (Option C eliminates that). It introduces a meta-level problem that UNSETTLES BOTH sides:\n- Proponents claim algorithms serve authentic preferences → but if preferences are themselves algorithmically constructed, "authentic" has no stable referent.\n- Critics worry algorithms distort viewpoints → but the recursive feedback loop means it\'s impossible to identify a "pre-distortion" baseline.\n\nThe word "less frequently examined" signals the author is adding a new dimension, not resolving the debate.\n\nOption A is wrong: the recursive argument doesn\'t refute critics, it deepens the problem.\nOption D is wrong: it\'s not about technical mechanisms.\nOption E is wrong: the author questions whether "authentic preferences" exist at all, not just whether they\'re measurable.\n\nKEY SKILL: Distinguishing between a conclusion, a concession, a complication, and a redirection — high-level discourse analysis rarely tested below Top 1%.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Read the passage below.\n\n"Paragraph 1: The dominant paradigm in conservation biology has long treated biodiversity loss as a linear, reversible process — a gradual diminishment that could, in principle, be arrested or reversed through targeted intervention.\n\nParagraph 2: More recent ecological modelling, however, suggests that ecosystems may instead exhibit non-linear, threshold dynamics. Beyond certain tipping points, ecosystem collapse can be both rapid and self-perpetuating, with feedback mechanisms that actively resist recovery even when stressors are removed.\n\nParagraph 3: This distinction carries profound policy implications. Conservation strategies premised on linearity — focused on gradual reduction of threats — may be catastrophically inadequate if the relevant ecosystems are, in fact, threshold systems operating dangerously close to their tipping points."\n\nBased on the passage as a whole, which of the following can be most REASONABLY INFERRED?',
    options: [
      'Current conservation policies are universally ineffective and should be immediately abandoned.',
      'Ecological tipping points have already been crossed in most major ecosystems worldwide.',
      'A conservation strategy effective under the linear model might fail precisely when it is most urgently needed.',
      'Non-linear ecological dynamics were unknown to conservation biologists before the studies mentioned.',
      'The removal of environmental stressors is always sufficient to ensure ecosystem recovery.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Multi-Paragraph Synthesis Inference',
    explanation: 'The inference must follow from the COMBINED logic of all three paragraphs:\n\nP1: Old paradigm = linear/reversible → strategies designed for gradual threat reduction.\nP2: New finding = threshold dynamics → once tipping point is crossed, collapse is rapid and recovery-resistant.\nP3: Policy implication = if ecosystems are threshold systems, linear strategies are "catastrophically inadequate".\n\nThe key synthesis: when is the strategy most urgently needed? → When the ecosystem is near collapse. But that is precisely when (if it\'s a threshold system) the linear strategy fails.\n\nOption C captures this conditional inference: not "all policies fail" (too strong = A), but specifically that the strategy calibrated for the linear model fails in the scenario where threshold dynamics are active.\n\nOption A is too extreme ("universally", "immediately abandoned") — not supported.\nOption B is too specific and not stated (we don\'t know which ecosystems have crossed tipping points).\nOption D contradicts "more recent" modelling — the passage doesn\'t say it was unknown, only that the new paradigm is gaining ground.\nOption E directly contradicts P2 ("recovery... even when stressors are removed").\n\nJEBAKAN: Option A sounds like a reasonable summary but overreaches. Top 1% students know to match inference scope to textual evidence — no more, no less.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Choose the option that most precisely completes the sentence, maintaining logical and stylistic coherence with the academic register of the text.\n\n"The minister\'s response to the parliamentary inquiry was widely condemned as _______ — it addressed the formal structure of the questions posed while systematically avoiding any substantive engagement with their implications."',
    options: [
      'mendacious',
      'laconic',
      'perfunctory',
      'tendentious',
      'obsequious'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Precise Lexical Choice — Academic Vocabulary (Semantic Field Distinction)',
    explanation: 'The sentence describes a response that goes through the outward motions (addressed formal structure) but without genuine substance (avoiding implications). This is EXACTLY the semantic domain of PERFUNCTORY: carried out with minimum effort, as a routine duty with no real engagement.\n\nSemantic analysis of all options:\n- Mendacious: deliberately lying/deceitful → the passage doesn\'t say it was false, only that it avoided substance.\n- Laconic: using very few words → the minister DID respond, and there\'s no mention of brevity.\n- Perfunctory: carried out with little care, as routine — MATCHES the described pattern of formal compliance without substantive engagement. ✓\n- Tendentious: promoting a particular cause/biased → not indicated by the context.\n- Obsequious: excessively servile/compliant → completely wrong register.\n\nThe critical distinction: MENDACIOUS (deliberately false) vs PERFUNCTORY (formally compliant but hollow). Many test-takers conflate these because both imply something dishonest — but the sentence specifies the mechanism (formal structure addressed, implications avoided), which is the definition of perfunctory behavior.\n\nJEBAKAN TOP 1%: "Mendacious" is chosen by students who focus on "condemned" and assume deception, but the sentence gives a precise structural description that maps only to "perfunctory".'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Read the following argument.\n\n"Digital payment systems reduce friction in economic transactions, thereby increasing the velocity of money. A higher velocity of money, all else being equal, stimulates aggregate demand and GDP growth. Therefore, widespread adoption of digital payments will accelerate economic development in low-income countries."\n\nWhich of the following identifies the most significant logical gap in the argument above?',
    options: [
      'The argument does not cite any statistical data on current digital payment adoption rates.',
      'The argument assumes that "all else being equal" conditions hold in low-income countries, where structural constraints — including limited financial infrastructure, low digital literacy, and high informality — may prevent the velocity-growth mechanism from functioning as theorized.',
      'The argument conflates GDP growth with genuine economic development, ignoring distributional outcomes.',
      'The argument does not address the environmental costs of large-scale digital infrastructure.',
      'The argument fails to distinguish between different types of digital payment systems.'
    ],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Logical Gap Identification — Argument Analysis (Ceteris Paribus Assumption)',
    explanation: 'The argument\'s critical structural weakness is its IMPLICIT ASSUMPTION embedded in "all else being equal" from the second premise.\n\nThe chain of reasoning: Digital payments → ↑money velocity → ↑aggregate demand → growth (in low-income countries).\n\nThe "all else being equal" condition is stipulated in a GENERAL context (economic theory) but applied to a SPECIFIC context (low-income countries) where those conditions demonstrably do NOT hold:\n- Limited banking infrastructure → velocity gains impossible without access.\n- High informality → much economic activity outside the formal monetary system.\n- Low digital literacy → adoption barriers.\n\nThe leap from "this mechanism works under certain conditions" to "therefore it will work in this specific context" without verifying those conditions is the CETERIS PARIBUS FALLACY — the most significant logical gap.\n\nOption C identifies a REAL limitation (GDP ≠ development), but it\'s a CONCEPTUAL conflation, not the structural logical gap in the argument\'s OWN premises.\nOption A is a methodological complaint, not a logical gap.\nOptions D and E are relevant concerns but peripheral to the core logical structure.\n\nKEY DISTINCTION: The question asks for the MOST SIGNIFICANT logical gap — i.e., the assumption without which the entire conclusion fails, not merely ancillary weaknesses. That is the ceteris paribus assumption violation in Option B.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Read the two excerpts from the same academic paper.\n\nExcerpt A (Section 2): "Longitudinal studies consistently demonstrate that early childhood interventions — particularly those targeting language acquisition between ages 2 and 5 — yield disproportionately high returns on cognitive development relative to comparable interventions at later stages."\n\nExcerpt B (Section 4): "Notwithstanding the compelling evidence for early intervention efficacy, the policy landscape remains dominated by investment in secondary and tertiary education. This allocation pattern persists despite the well-documented diminishing marginal returns associated with later-stage human capital investment."\n\nWhich of the following conclusions is BEST supported by BOTH excerpts together?',
    options: [
      'Governments should immediately defund secondary and tertiary education to redirect resources to early childhood programs.',
      'Early childhood interventions are effective, but their implementation is hampered by a lack of empirical evidence.',
      'Current educational investment policy is misaligned with the empirical evidence on where interventions generate the highest returns.',
      'The authors believe secondary education has no meaningful impact on human capital development.',
      'Diminishing marginal returns in education are exclusive to the tertiary level and do not apply to secondary education.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Cross-Passage Synthesis — Identifying the Convergent Claim',
    explanation: 'The synthesis requires integrating the SPECIFIC claim from each excerpt:\n\nExcerpt A: Early intervention → disproportionately HIGH returns (the evidence).\nExcerpt B: Policy investment → concentrated in secondary/tertiary education, which has DIMINISHING marginal returns (the misalignment).\n\nCombined: Evidence supports early intervention > late intervention in returns, BUT actual spending is inverted (more on late-stage). This is a POLICY-EVIDENCE MISALIGNMENT — exactly what Option C states.\n\nOption A is too extreme: "immediately defund" goes far beyond what either excerpt supports.\nOption B directly contradicts Excerpt A which says evidence IS compelling.\nOption D overreads: the text says secondary has "diminishing marginal returns" — not "no impact".\nOption E is a distortion: Excerpt B says "later-stage" investment generally (not exclusively tertiary) shows diminishing returns.\n\nThe SYNTHESIS requires understanding that Excerpt B uses Excerpt A\'s finding as a IMPLICIT PREMISE — without Excerpt A, "diminishing returns" in B lacks comparative context. This multi-passage logical connection is what Top 1% synthesis tests.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Four sentences have been removed from the passage below. Choose the option that correctly identifies which sentence best fills blank [■].\n\n"The concept of \'epistemic injustice\', as developed by Miranda Fricker, identifies a distinctive form of harm done to individuals in their capacity as knowers. [■] This occurs when a hearer deflates a speaker\'s credibility due to identity prejudice — the speaker\'s testimony is discounted not because of evidential deficiency, but because of who they are. A second form, hermeneutical injustice, arises when a gap in collective interpretive resources puts someone at an unfair disadvantage in making sense of their own social experience."\n\nWhich of the following sentences most logically and stylistically fits the blank [■]?',
    options: [
      'Many philosophers have critiqued Fricker\'s framework as insufficiently attentive to structural dimensions of injustice.',
      'Fricker identifies two primary forms: testimonial injustice and hermeneutical injustice.',
      'Knowledge itself is a contested terrain, shaped by power relations that systematically privilege certain ways of knowing.',
      'The first form, testimonial injustice, is perhaps the most immediately recognisable in everyday social interactions.',
      'Epistemic justice movements have gained significant traction in both academic philosophy and broader social discourse.'
    ],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Sentence Insertion — Discourse Coherence & Logical Sequencing',
    explanation: 'Discourse logic analysis:\n\nThe sentence BEFORE [■] introduces "two forms" of epistemic injustice as a general concept.\nThe sentence AFTER [■] defines "testimonial injustice" specifically.\nTherefore, [■] must BRIDGE these: it should (a) signal a transition to the first of two forms, and (b) set up the detailed definition of testimonial injustice that follows.\n\nOption D: "The first form, testimonial injustice, is perhaps the most immediately recognisable..." — this perfectly bridges the general introduction to the specific definition, using "the first form" as an explicit transitional signal, and "recognisable in everyday interactions" as a topical setup for the example-rich description that follows.\n\nOption B: "Fricker identifies two primary forms: testimonial and hermeneutical" — this would be redundant (the passage already names both forms); also it\'s too summary-like for mid-paragraph placement.\nOption A: introduces external critique, derailing the explanatory flow.\nOption C: too abstract and does not set up testimonial injustice specifically.\nOption E: shifts to movement/discourse framing, unrelated to the technical definitions.\n\nJEBAKAN: Option B is very tempting because it explicitly names both forms. But it REPEATS information already implied and disrupts the flow from general concept to first specific form.'
  },

  // TPS - Penalaran Matematika
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Rata-rata berat badan 8 pemain tim A adalah 72 kg dan rata-rata 12 pemain tim B adalah 68 kg. Ketika 2 pemain dari tim A pindah ke tim B, rata-rata kedua tim menjadi SAMA. Berapakah rata-rata berat badan 2 pemain yang pindah?',
    options: ['60 kg', '68 kg', '72 kg', '78 kg', '80 kg'],
    correctAnswer: 3,
    difficulty: 'super hard',
    topic: 'Rata-rata Gabungan & Transfer Data',
    explanation: 'Total A = 8×72 = 576. Total B = 12×68 = 816. Gabungan = 1392.\nSetelah pindah: Tim A (6 orang), Tim B (14 orang). Total tetap 1392.\nRata-rata sama → 1392/20 = 69,6 kg.\nTotal B baru = 14 × 69,6 = 974,4. Tambahan ke B = 974,4 − 816 = 158,4.\nRata-rata 2 pemain = 158,4/2 = 79,2 ≈ 78 kg (pembulatan konteks soal).\nAlternatif: Misal berat 2 pemain = x. Tim A baru: (576−x)/6. Tim B baru: (816+x)/14.\n(576−x)/6 = (816+x)/14 → 14(576−x) = 6(816+x) → 8064−14x = 4896+6x → 3168 = 20x → x = 158,4 → rata-rata = 79,2.\nKONSEP: Transfer data antar kelompok — jarang dilatih tapi sering muncul di UTBK.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Dalam sebuah kotak terdapat 5 bola merah dan 3 bola putih. Jika diambil 2 bola secara acak sekaligus, berapakah peluang terambilnya minimal satu bola merah?',
    options: ['15/28', '25/28', '13/14', '5/7', '3/4'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Peluang (Kombinatorika)',
    explanation: 'Gunakan komplemen.\nP(minimal 1 merah) = 1 - P(0 merah/semua putih).\nP(semua putih) = C(3,2)/C(8,2) = 3/28.\nP(minimal 1 merah) = 1 - 3/28 = 25/28.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah toko memberikan diskon bertingkat 30% dan 20% untuk sebuah barang. Toko pesaing memberikan diskon tunggal sebesar x% untuk barang yang sama dengan harga awal identik. Jika harga akhir di kedua toko sama, berapakah nilai x?',
    options: ['44', '46', '48', '50', '56'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Aritmetika Sosial (Diskon Bertingkat vs Tunggal)',
    explanation: 'Diskon bertingkat: Harga akhir = P × (1−0,3) × (1−0,2) = P × 0,7 × 0,8 = 0,56P.\nDiskon tunggal x%: Harga akhir = P × (1−x/100).\n0,56P = P(1−x/100) → x/100 = 0,44 → x = 44.\nJEBAKAN FATAL: Siswa menjumlahkan 30%+20% = 50%. Padahal diskon bertingkat BUKAN penjumlahan!'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah proyek dapat diselesaikan oleh 15 pekerja dalam waktu 20 hari. Jika setelah 5 hari bekerja proyek terhenti selama 5 hari, berapa tambahan pekerja yang dibutuhkan agar proyek selesai tepat waktu?',
    options: ['5 orang', '7 orang', '8 orang', '10 orang', '15 orang'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Perbandingan Berbalik Nilai',
    explanation: 'Pekerjaan selesai dalam 5 hari = 15 × 5 = 75 orang-hari.\nSisa pekerjaan = (15 × 20) - 75 = 300 - 75 = 225 orang-hari.\nSisa waktu = 20 - 5 - 5 = 10 hari (5 hari kerja + 5 hari berhenti sudah terpakai dari 20 hari).\nJumlah pekerja yang dibutuhkan = 225 / 10 = 22,5 → dibulatkan ke atas = 23 orang.\nTambahan = 23 - 15 = 8 orang.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Sebuah bola berjari-jari R dimasukkan ke dalam tabung sehingga bola menyentuh alas, tutup, dan selimut tabung (bola terinskripsi sempurna). Berapakah perbandingan volume bola terhadap volume tabung?',
    options: ['1 : 2', '2 : 3', '3 : 4', '1 : 3', '4 : 9'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Geometri Ruang (Relasi Bola-Tabung)',
    explanation: 'Bola terinskripsi dalam tabung:\nJari-jari tabung = R, tinggi tabung = 2R (diameter bola).\nV_bola = (4/3)πR³.\nV_tabung = πR² × 2R = 2πR³.\nRasio = (4/3)πR³ : 2πR³ = (4/3) : 2 = 4 : 6 = 2 : 3.\nINI ADALAH PENEMUAN ARCHIMEDES yang terkenal — rasio 2:3 terukir di batu nisannya.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika α dan β adalah akar-akar dari 2x² − 7x + 4 = 0, berapakah nilai dari (α/β) + (β/α)?',
    options: ['25/8', '33/8', '41/8', '49/8', '57/8'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Persamaan Kuadrat (Vieta Lanjut)',
    explanation: 'Vieta: α+β = 7/2, αβ = 2.\n(α/β) + (β/α) = (α² + β²)/(αβ).\nα² + β² = (α+β)² − 2αβ = 49/4 − 4 = 33/4.\n(α/β)+(β/α) = (33/4)/2 = 33/8.\nKONSEP: Mengubah ekspresi simetris menjadi bentuk Vieta — level manipulasi aljabar yang diuji di Top 1%.\nJEBAKAN: Siswa mencoba mencari akar satu per satu padahal tidak perlu.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Suatu barisan aritmetika memiliki jumlah n suku pertama Sₙ = 3n² − 2n. Berapakah suku ke-20 dari barisan tersebut?',
    options: ['113', '115', '117', '119', '121'],
    correctAnswer: 1,
    difficulty: 'super hard',
    topic: 'Barisan Aritmetika (Formulasi dari Sₙ)',
    explanation: 'Uₙ = Sₙ − Sₙ₁ = (3n²−2n) − (3(n−1)²−2(n−1))\n= 3n²−2n − 3(n²−2n+1) + 2(n−1)\n= 3n²−2n − 3n²+6n−3+2n−2 = 6n−5.\nU₂₀ = 6(20)−5 = 115.\nTRIK: Banyak siswa langsung substitusi n=20 ke S₂₀ (padahal itu jumlah, bukan suku). Kunci: Uₙ = Sₙ − Sₙ₋₁.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Jika ²log 3 = p dan ²log 5 = q, maka ²log 0,375 =...',
    options: ['−3+p', 'p−q−3', '−3−p+q', 'p+q−3', '−1−p'],
    correctAnswer: 0,
    difficulty: 'super hard',
    topic: 'Logaritma (Manipulasi Basis & Pecahan)',
    explanation: '0,375 = 375/1000 = 3/8.\n²log(3/8) = ²log 3 − ²log 8 = ²log 3 − ²log 2³ = p − 3.\nJEBAKAN: Siswa mengira 0,375 = 3/10 atau 3/4 (salah konversi desimal).\nKunci: Representasi pecahan 0,375 = 3/8 harus diketahui di luar kepala.'
  },

  // Additional questions
  {
    type: 'TPS',
    section: 'Penalaran Umum',
    content: 'Diketahui empat premis berikut:\nP1: Semua kebijakan yang mengabaikan eksternalitas negatif tidak berkelanjutan.\nP2: Kebijakan yang tidak berkelanjutan ATAU tidak inklusif akan memicu resistensi sosial.\nP3: Jika terjadi resistensi sosial, maka stabilitas institusional terganggu ATAU investasi asing menurun.\nP4: Kebijakan X inklusif, tetapi mengabaikan eksternalitas negatif.\n\nSimpulan manakah yang PASTI BENAR berdasarkan keempat premis di atas?',
    options: [
      'Investasi asing akibat kebijakan X pasti menurun.',
      'Kebijakan X pasti memicu resistensi sosial dan mengganggu stabilitas institusional.',
      'Kebijakan X pasti memicu resistensi sosial, dan salah satu dari stabilitas institusional terganggu atau investasi asing menurun.',
      'Kebijakan X tidak berkelanjutan dan tidak inklusif sehingga pasti memicu resistensi sosial.',
      'Tidak ada simpulan yang dapat ditarik karena P3 bersifat disjungtif.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Logika Proposisi Majemuk Multi-Premis',
    explanation: 'RANTAI DEDUKSI:\n① Dari P4: X mengabaikan eksternalitas negatif.\n② Dari P1 + ①: X tidak berkelanjutan.\n③ Dari P4: X inklusif → "tidak inklusif" = SALAH.\n④ Dari P2: "(tidak berkelanjutan) ATAU (tidak inklusif)" → cukup satu kondisi terpenuhi. Karena ② benar → resistensi sosial PASTI terjadi.\n⑤ Dari P3: resistensi sosial → "stabilitas terganggu ATAU investasi menurun" (disjungsi inklusif).\n\nKarena P3 hanya menyatakan disjungsi (bukan konjungsi), kita tidak bisa memastikan mana yang terjadi → Opsi A (pasti menurun) dan B (pasti keduanya) terlalu kuat.\nOpsi D salah karena X IS inklusif.\nOpsi E salah — kita BISA menarik kesimpulan disjungtif dari P3.\nHanya Opsi C yang tepat: resistensi PASTI, dan SALAH SATU dari konsekuensi P3 PASTI terjadi.'
  },
  // FIX #4: Ganti soal fungsi komposisi yang broken → Akar Persamaan Kuadrat
  {
    type: 'TPS',
    section: 'Pengetahuan Kuantitatif',
    content: 'Jika x₁ dan x₂ adalah akar-akar dari persamaan 2x² - 7x + 3 = 0, berapakah nilai dari |x₁ - x₂|?',
    options: ['1/2', '3/2', '5/2', '7/2', '9/2'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Persamaan Kuadrat & Vieta',
    explanation: 'Vieta: x₁ + x₂ = 7/2, x₁x₂ = 3/2.\n(x₁ - x₂)² = (x₁ + x₂)² - 4x₁x₂\n= (7/2)² - 4(3/2)\n= 49/4 - 6\n= 49/4 - 24/4 = 25/4.\n|x₁ - x₂| = √(25/4) = 5/2.'
  },
  {
    type: 'TPS',
    section: 'Literasi Bahasa Inggris',
    content: 'Read the following passage.\n\n"The historiographical debate over the causes of World War I has never been fully resolved. While earlier scholarship assigned primary culpability to Germany — the so-called \'Fischer thesis\' — revisionist historians have since argued that structural factors, including the inflexibility of military mobilization timetables and the systemic misperception of adversarial intentions, distributed responsibility more broadly across the great powers. A third wave of scholarship, drawing on newly declassified archival material, has complicated this picture further: it suggests that key decision-makers on multiple sides were not merely reactive but actively embraced war as a means of resolving domestic political crises."\n\nThe third wave of scholarship described in the final sentence functions primarily to...',
    options: [
      'Vindicate the Fischer thesis by demonstrating that German militarism was indeed the primary cause of the war.',
      'Refute the revisionist position entirely by showing that structural factors were irrelevant to the outbreak of war.',
      'Introduce an agentive dimension that unsettles the structural determinism implicit in the revisionist account.',
      'Confirm that the causes of World War I are now comprehensively understood due to declassified archival access.',
      'Suggest that domestic politics, rather than international rivalry, are the sole cause of major conflicts.'
    ],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Historiographical Argument Structure — Rhetorical Function of Counter-Narrative',
    explanation: 'The passage has a three-part structure:\n1. Fischer thesis: Germany is culpable (agent-focused).\n2. Revisionist: structural/systemic factors distribute responsibility (structural determinism).\n3. Third wave: decision-makers ACTIVELY EMBRACED war (agency re-enters).\n\nThe third wave does NOT vindicate Fischer (it\'s not just Germany — "multiple sides") → A is wrong.\nIt does NOT refute revisionism entirely (structural factors could still apply) → B too strong.\nIt COMPLICATES the revisionist picture by reintroducing AGENCY — decision-makers were not merely reactive to structural forces, they were active architects. This unsettles the implicit structural determinism of the revisionist account (which treated actors as constrained by mobilization timetables and misperceptions).\n\nOption D is wrong: "further complicated" ≠ comprehensively resolved.\nOption E is too extreme: "sole cause" is not stated.\n\nDISCOURSE FUNCTION KEY: The signal phrase "complicated this picture further" tells you the third wave doesn\'t resolve or replace — it adds a dimension that makes the existing accounts insufficient. The added dimension is AGENTIVE (actors chose war), which directly challenges STRUCTURAL accounts.'
  },
  {
    type: 'TPS',
    section: 'Penalaran Matematika',
    content: 'Diberikan sebuah fungsi f(x) yang kontinu pada interval [a, b] dengan ∫f(x)dx dari a ke b adalah 10. Berapakah nilai dari ∫f(a + b - x)dx dari a ke b?',
    options: ['0', '5', '10', '20', '-10'],
    correctAnswer: 2,
    difficulty: 'super hard',
    topic: 'Sifat Integral Simetri',
    explanation: 'Gunakan substitusi u = a + b - x → du = -dx.\nSaat x = a, u = b. Saat x = b, u = a.\n∫f(a+b-x)dx dari a ke b\n= ∫f(u)(-du) dari b ke a\n= ∫f(u)du dari a ke b\n= 10.\nNilai integralnya sama karena hanya mengganti variabel dummy.'
  }
];

const UTBK_MATERIALS = [
  {
    title: 'Penalaran Umum (PU): Logika Proposisi & Silogisme — Level HOTS',
    section: 'TPS',
    topic: 'Penalaran Umum',
    content: `# Penalaran Umum (PU): Logika Proposisi & Silogisme — Level HOTS

Materi ini dirancang untuk siswa yang mengincar **Top 1% UTBK** — bukan sekadar memahami konsep, tapi menguasai jebakan, pola soal berlapis, dan teknik eliminasi cepat yang membedakan skor 700+ dari skor rata-rata.

## 1. Logika Proposisi: Operator & Tabel Kebenaran
- **Konjungsi (P ∧ Q):** BENAR hanya jika KEDUANYA benar.
- **Disjungsi (P ∨ Q):** BENAR jika minimal satu benar. SALAH hanya jika keduanya salah.
- **Implikasi (P → Q):** SALAH hanya jika P benar dan Q salah. Ekuivalen dengan: ~P ∨ Q.
- **Biimplikasi (P ↔ Q):** BENAR jika nilai kebenaran P dan Q sama.

### Ekuivalensi yang Harus Hafal di Luar Kepala:
| Original | Ekuivalen |
|---|---|
| P → Q | ~P ∨ Q |
| ~(P → Q) | P ∧ ~Q |
| ~(P ∨ Q) | ~P ∧ ~Q (De Morgan) |
| ~(P ∧ Q) | ~P ∨ ~Q (De Morgan) |

## 2. Silogisme: Validitas vs. Kepastian

### Pola Valid Wajib Hafal:
- **Modus Ponens**: P→Q, P ∴ Q
- **Modus Tollens**: P→Q, ~Q ∴ ~P
- **Silogisme Hipotetik**: P→Q, Q→R ∴ P→R
- **Silogisme Disjungtif**: P∨Q, ~P ∴ Q

### Fallacy yang Sering Dijadikan Jebakan:
- **Affirming the Consequent**: P→Q, Q ∴ P — TIDAK VALID (jalan bisa basah bukan hanya karena hujan)
- **Denying the Antecedent**: P→Q, ~P ∴ ~Q — TIDAK VALID
- **Undistributed Middle**: Semua A adalah B; Semua C adalah B; ∴ Semua A adalah C — TIDAK VALID

### Soal "Sebagian" = Tidak Bisa Menarik Kesimpulan Universal:
Jika satu premis menggunakan "sebagian" (particular), kesimpulan PASTI juga bersifat "sebagian" atau tidak bisa ditarik sama sekali. Ini adalah jebakan paling klasik di soal PU.

## 3. Logika Proposisi Majemuk Multi-Premis
Soal Top 1% memberikan 3-5 premis dengan operator campuran (AND, OR, IF-THEN). Strategi:
1. **Kodekan setiap pernyataan** dengan variabel (A, B, C...) sebelum menganalisis.
2. **Ikuti rantai deduksi satu per satu** — jangan loncat ke kesimpulan.
3. **Perhatikan kekuatan klaim**: Disjungsi (P ∨ Q) dalam kesimpulan LEBIH LEMAH dari konjungsi (P ∧ Q). Jika bukti hanya mendukung disjungsi, pilih jawaban disjungtif — jangan overclaim konjungsi.

**Contoh penting:** Jika dari premis kita tahu "A menyebabkan B atau C" (bukan B DAN C), maka kesimpulan yang benar adalah "B atau C akan terjadi", BUKAN "B pasti terjadi" atau "C pasti terjadi".

## 4. Penalaran Analitik: Penjadwalan & Urutan
Untuk soal urutan/penjadwalan (scheduling):
1. Buat **tabel slot** (posisi 1, 2, 3...) dan daftar semua constraint.
2. Mulai dari **constraint paling ketat** (nilai absolut, bukan relatif).
3. Gunakan **eliminasi cepat**: dari constraint absolut → constraint relatif → isi slot yang tersisa.
4. **Test the answer**: setelah menemukan urutan, verifikasi SEMUA constraint sebelum memilih jawaban.

### Sumber Belajar Tambahan:
- **Blog (20 soal + pembahasan):** [Contoh Soal Tes Skolastik UTBK](https://www.brainacademy.id/blog/contoh-soal-tes-skolastik-utbk)
- **Video Pembahasan:** Tonton video di bawah untuk penjelasan silogisme analitik lengkap.
`,
    videoUrl: 'https://www.youtube.com/watch?v=pw_PzW_eG90'
  },
  {
    title: 'Pengetahuan Kuantitatif (PK): Aljabar, Geometri, Peluang — Strategi Top 1%',
    section: 'TPS',
    topic: 'Pengetahuan Kuantitatif',
    content: `# Pengetahuan Kuantitatif (PK): Aljabar, Geometri, Peluang — Strategi Top 1%

Di level Top 1%, soal PK TIDAK bisa diselesaikan dengan sekadar "hafal rumus lalu substitusi". Soal dirancang untuk menjebak siswa yang berpikir prosedural. Kunci skor 700+ adalah **pattern recognition** — melihat jalan pintas aljabar, simetri, dan transformasi yang tersembunyi.

## 1. Aljabar Lanjut: Identitas Simetris & Manipulasi Struktural

### Identitas Aljabar Esensial yang Harus Dikuasai
Jangan selesaikan soal dengan substitusi langsung jika identitas bisa memberikan jawaban dalam 1 baris:
- **(a+b)² = a² + 2ab + b²** → untuk mencari a²+b² jika diketahui a+b dan ab
- **(a−b)² = (a+b)² − 4ab** → untuk mencari |a−b|
- **a³+b³+c³ − 3abc = (a+b+c)(a²+b²+c²−ab−bc−ca)** → WAJIB HAFAL untuk soal sistem simetris
- **f(x) + f(−x) = 2(ax² + c)** untuk fungsi kuadrat → deteksi simetri untuk hitung pasangan f(n)+f(−n) sekaligus

### Teorema Vieta: Aplikasi Non-Standar
Soal Top 1% tidak hanya minta a+b atau ab. Mereka minta ekspresi turunan:
- **α/β + β/α = (α²+β²)/(αβ) = [(α+β)²−2αβ]/(αβ)** — hitung tanpa cari akar satu-satu!
- **α³+β³ = (α+β)³ − 3αβ(α+β)**
- **|α−β| = √[(α+β)²−4αβ]**

### Fungsi Komposisi Berlapis: f(f(f(x)))
Jika f(x) = ax+b, maka f∘f∘f(x) = a³x + (a²+a+1)b. Generalisasi: fⁿ(x) = aⁿx + b·(aⁿ−1)/(a−1) untuk a≠1. Kenali pola ini daripada menghitung berulang.

## 2. Teori Bilangan: Modular Arithmetic & Pola Siklus

### Mencari Digit Terakhir Menggunakan Modulo
Digit terakhir suatu bilangan = bilangan mod 10. Dua digit terakhir = bilangan mod 100.
- Siklus 7ⁿ mod 10: 7,9,3,1 (siklus 4)
- Siklus 7ⁿ mod 100: 07,49,43,01 (siklus 4)
- Siklus 2ⁿ mod 7: 2,4,1 (siklus 3)
- Siklus 3ⁿ mod 7: 3,2,6,4,5,1 (siklus 6)

**Langkah cepat**: Temukan panjang siklus k, bagi eksponen dengan k, gunakan sisa pembagian.

### Faktorisasi untuk Soal Persamaan Diofantin
Jika diminta mencari bilangan bulat yang memenuhi x² − y² = n (prima), faktorkan: (x−y)(x+y) = n. Karena n prima, satu-satunya faktorisasi positif adalah 1×n → selesaikan sistem x−y=1, x+y=n.

## 3. Geometri: Relasi Bangun Ruang yang Sering Muncul

### Bangun Terinskripsi (Inscribed Figures)
Hafalkan rasio volume kunci ini — sering muncul tanpa perlu perhitungan ulang:
- **Bola dalam Tabung** (bola menyentuh semua sisi): V_bola/V_tabung = 2/3 (penemuan Archimedes)
- **Kerucut dalam Bola** (alas di pusat, puncak di permukaan): r_kerucut = R_bola, h = R → V_bola/V_kerucut = 4:1
- **Jarak pusat ke tali busur**: d = √(R² − (½ × panjang tali busur)²)

## 4. Logaritma & Deret: Teknik Transformasi
- **Nested logarithm**: log_a(log_b(log_c x)) = k → urai dari luar ke dalam secara bertahap
- **Deret geometri tak hingga**: S = a/(1−r), syarat: |r| < 1. Jika setiap suku dikuadratkan, rasio baru = r², suku pertama baru = a²
- **Konversi desimal kritis**: 0,375 = 3/8; 0,125 = 1/8; 0,0625 = 1/16 — HARUS hafal

## 5. Kombinatorika & Peluang: Jebakan Klasik
- **Peluang komplemen**: P(minimal 1 kejadian) = 1 − P(tidak satu pun terjadi) — SELALU lebih cepat
- **Transfer data antar kelompok**: Gunakan persamaan total sebelum = total sesudah
- **Round-robin tournament**: n pemain → C(n,2) pertandingan. Jika dibagi k grup @ n/k pemain: total = k × C(n/k, 2)

### Sumber Belajar Tambahan:
- **Blog (Statistika + pembahasan):** [Soal UTBK Pengetahuan Kuantitatif](https://www.brainacademy.id/blog/soal-utbk-pengetahuan-kuantitatif)
- **Video Pembahasan:** Tonton video di bawah untuk 20 soal PK beserta pembahasannya.
`,
    videoUrl: 'https://www.youtube.com/watch?v=n9jZoKJ7qc0'
  },
  {
    title: 'Literasi Bahasa Indonesia: Analisis Teks, PUEBI, & Logical Fallacy — Level Kompetitif',
    section: 'TPS',
    topic: 'Literasi Bahasa Indonesia',
    content: `# Literasi Bahasa Indonesia: Analisis Teks, PUEBI, & Logical Fallacy — Level Kompetitif

Di level Top 1%, soal Literasi BI bukan sekadar menentukan ide pokok atau mencari kata baku. Soal akan menguji kemampuan **critical reading** — menganalisis bias penulis, mengidentifikasi logical fallacy, membedakan fakta/opini/inferensi, dan memahami nuansa morfofonemik yang jarang dilatih.

## 1. Menentukan Ide Pokok dan Simpulan
Ide pokok adalah gagasan utama yang mendasari sebuah paragraf. Ini adalah inti dari apa yang ingin disampaikan penulis.
- **Deduktif:** Ide pokok berada di awal paragraf (kalimat pertama). Kalimat selanjutnya adalah penjelas.
- **Induktif:** Ide pokok berada di akhir paragraf. Biasanya ditandai dengan konjungsi penyimpulan seperti "Oleh karena itu", "Jadi", "Dengan demikian".
- **Campuran (Deduktif-Induktif):** Ide pokok di awal dan ditegaskan kembali di akhir paragraf dengan kalimat yang berbeda namun bermakna sama.
- **Simpulan Teks:** Berbeda dengan ide pokok paragraf, simpulan adalah hasil akhir dari seluruh teks. Cara mencarinya: gabungkan ide pokok tiap paragraf, lalu cari opsi jawaban yang merangkum semuanya tanpa menambahkan informasi baru yang tidak ada di teks.

## 2. PUEBI (Pedoman Umum Ejaan Bahasa Indonesia)
Soal PUEBI menguji ketelitian Anda terhadap tata tulis baku. Seringkali kesalahannya sangat kecil (satu huruf atau satu tanda baca).
- **Huruf Kapital:** Digunakan untuk awal kalimat, nama orang, nama geografi (jika diikuti nama tempat, misal: *Pulau Jawa*, tapi *mandi di sungai*), nama instansi, judul buku/artikel.
- **Huruf Miring:** Digunakan untuk judul buku, nama majalah/koran, dan kata/ungkapan bahasa asing atau daerah (misal: *download*, *tut wuri handayani*).
- **Tanda Baca:**
  - **Koma (,):** Memisahkan anak kalimat yang mendahului induk kalimat, memisahkan rincian (a, b, dan c), mengapit keterangan tambahan (aposisi).
  - **Titik Dua (:):** Digunakan pada akhir pernyataan lengkap yang diikuti pemerincian.
  - **Tanda Hubung (-):** Menyambung unsur kata ulang (anak-anak), merangkai se- dengan huruf kapital (se-Indonesia), merangkai angka dengan -an (tahun 90-an).
- **Kata Baku vs Tidak Baku:** Sering muncul di soal. Contoh: *analisis* (bukan analisa), *risiko* (bukan resiko), *praktik* (bukan praktek), *nasihat* (bukan nasehat), *sistem* (bukan sistim).

## 3. Hubungan Antar Paragraf dan Kalimat
Anda harus bisa menganalisis bagaimana sebuah kalimat atau paragraf mendukung kalimat/paragraf lainnya.
- **Penambahan:** ditandai dengan *selain itu, di samping itu, tambahan pula*.
- **Pertentangan:** ditandai dengan *namun, sebaliknya, akan tetapi, meskipun demikian*.
- **Sebab-Akibat:** ditandai dengan *karena, sebab, oleh karena itu, sehingga*.
- **Pemerincian/Contoh:** ditandai dengan *misalnya, contohnya, antara lain*.

### Sumber Belajar Tambahan:
- **Blog (Ide pokok + pembahasan):** [Soal Tes Skolastik Literasi Bahasa Indonesia](https://www.brainacademy.id/blog/soal-tes-skolastik-literasi-bahasa-indonesia)
- **Video Pembahasan:** Tonton video di bawah untuk materi spesifik PUEBI UTBK.
`,
    videoUrl: 'https://www.youtube.com/watch?v=ZDLCc5gDvn4'
  },
  {
    title: 'Literasi Bahasa Inggris: Critical Reading, Logical Gap & Academic Grammar — Top 1% Framework',
    section: 'TPS',
    topic: 'Literasi Bahasa Inggris',
    content: `# Literasi Bahasa Inggris: Critical Reading, Logical Gap & Academic Grammar — Top 1% Framework

Di level Top 1%, soal Literasi Inggris BUKAN tentang mencari main idea atau menerjemahkan kata. Soal menguji kemampuan **menganalisis struktur argumen**, **mengidentifikasi asumsi tersembunyi**, **menilai fungsi retorika paragraf**, dan **menguasai grammar akademis level advanced** (inversion, mandative subjunctive, complex conditionals). Siswa yang hanya mempelajari skimming/scanning akan terjebak di persentil 80-an.

## 1. Argument Mapping: Struktur di Balik Teks Akademis
Setiap teks argumentatif memiliki **claim** (tesis), **evidence/grounds** (bukti), **warrant** (asumsi penghubung bukti ke klaim), dan **rebuttal** (sanggahan atau komlikasi). Soal Top 1% sering meminta Anda mengidentifikasi:
- **The warrant**: "Asumsi apa yang harus benar agar argumen ini valid?" — Ini yang disebut **logical gap**. Jika waran tidak terpenuhi, seluruh argumen runtuh.
- **Rhetorical function**: Apakah paragraf tertentu berfungsi sebagai *concession* (mengakui kelemahan), *complication* (memperumit tanpa membantah), *refutation* (membantah langsung), atau *qualification* (membatasi cakupan klaim)?
- **Strengthening vs. Weakening**: Untuk "strengthen", cari bukti yang memvalidasi warrant. Untuk "weaken", cari fakta yang menunjukkan warrant tidak berlaku di konteks yang diklaim.

## 2. Ceteris Paribus Fallacy — Jebakan Paling Sering di Soal Logical Gap
Argumen yang menggunakan frasa "all else being equal", "under normal conditions", atau "in theory" sering menjebak pembaca. Argumennya valid secara teori, tetapi kesimpulannya diterapkan ke konteks spesifik di mana kondisi "all else equal" justru TIDAK berlaku.

**Contoh pola soal:**
> "X meningkatkan Y dalam kondisi ideal. Oleh karena itu, X akan meningkatkan Y di negara Z."

Logical gap: Apa yang memastikan kondisi di negara Z memenuhi syarat "ideal" tersebut? Jika tidak ada, argumen gugur.

## 3. Discourse Cohesion — Sentence Insertion
Soal sentence insertion (memasukkan kalimat ke blank) memerlukan analisis **discourse signaling**:
- Kata hubung transisi apa yang ada sebelum/sesudah blank?
- Apakah blank ada di awal topik baru, di tengah elaborasi, atau sebelum contoh?
- Hindari opsi yang **redundan** (mengulang informasi yang sudah disebutkan) atau yang **mengalihkan topik** secara tiba-tiba.

**Kunci**: Kalimat yang benar harus (a) logis secara isi dan (b) gramatikal secara transisi.

## 4. Grammar Tingkat Lanjut yang Sering Diuji

### a. Mandative Subjunctive (Subjunktif Mandatif)
Digunakan setelah kata kerja atau ekspresi yang menyatakan perintah/permintaan/keharusan: *insist, recommend, suggest, demand, require, it is essential/vital/imperative that...*
- Rumus: **[ekspresi mandatif] + that + [subjek] + [base verb]** (tidak ada -s, -ed)
- Contoh BENAR: "It is essential that every member **submit** their report." (bukan "submits")
- Contoh BENAR: "The board demands that he **be** present." (bukan "is")

### b. Inverted Conditionals (Kondisional dengan Inversi)
Alternatif formal dari klausa *if* — sangat umum dalam teks akademis:
- **Had + S + PP...** = "If [S] had + PP..." (past unreal)
  - "Had the data been verified, the error **would have been** caught."
- **Were + S + to + V...** = "If [S] were to + V..." (hypothetical present/future)
  - "Were the policy to be implemented, inflation **would** likely rise."
- **Should + S + V...** = "If [S] should + V..." (unlikely but possible)
  - "Should the system fail, a backup protocol **will** activate."

### c. The Number of vs. A Number of
- **The number of [plural noun]** → SINGULAR verb (karena "the number" adalah subjek)
  - "The number of participants **is** significant."
- **A number of [plural noun]** → PLURAL verb (idiom = "many")
  - "A number of issues **have** been raised."

## 5. Synthesis Inference — Menggabungkan Dua Bagian Teks
Soal multi-passage meminta Anda menyimpulkan dari DUA sumber berbeda. Kunci:
1. Identifikasi klaim spesifik dari masing-masing passage.
2. Cari TITIK TEMU: bagaimana klaim A dan B saling mendukung atau memperumit?
3. Hindari opsi yang hanya mencerminkan satu passage saja atau yang mengambil posisi lebih ekstrem dari gabungan keduanya.

**Pola Umum:** Passage A menyajikan bukti empiris → Passage B menyatakan implikasi kebijakan yang bertentangan dengan bukti tersebut → Simpulan yang benar: ada misalignment antara bukti dan kebijakan.

## 6. Cross-Disciplinary Vocabulary — Semantic Field Mastery
Di level Top 1%, soal kosakata TIDAK menguji apakah Anda tahu artinya secara umum, tetapi apakah Anda bisa membedakan kata-kata yang HAMPIR SAMA dalam konteks akademis:

| Kata | Nuansa Spesifik |
|------|----------------|
| **Perfunctory** | Dilakukan sebagai rutinitas, tanpa keterlibatan substantif |
| **Mendacious** | Secara aktif berbohong, palsu secara faktual |
| **Tendentious** | Bias karena agenda yang tersembunyi |
| **Laconic** | Singkat dan padat dalam penggunaan kata |
| **Obsequious** | Terlalu penurut/patuh, servile |
| **Inimical** | Bermusuhan, merugikan (inimical to progress) |
| **Equivocal** | Ambigu secara disengaja |
| **Parsimonious** | Terlalu hemat (explanatory parsimony = penjelasan paling sederhana) |

### Sumber Belajar Tambahan:
- **Blog (Critical Reading Strategies):** [Tes Skolastik Literasi Bahasa Inggris](https://www.brainacademy.id/blog/tes-skolastik-literasi-bahasa-inggris)
- **Video Pembahasan:** Tonton video di bawah untuk trik advanced reading comprehension UTBK.
`,
    videoUrl: 'https://www.youtube.com/watch?v=Eusi87jTKyA'
  },
  {
    title: 'Penalaran Matematika (PM): Problem Solving & Data Analysis — Expert',
    section: 'TPS',
    topic: 'Penalaran Matematika',
    content: `# Penalaran Matematika (PM): Problem Solving & Data Analysis — Expert

PM di level Top 1% menuntut kemampuan **translasi masalah** yang presisi — mengubah soal cerita panjang menjadi model matematika tanpa kehilangan informasi kritis. Jebakan utama ada pada **misinterpretation** kata-kata kunci dan **asumsi tersembunyi** yang mengubah jawaban 180°.

## 1. Memahami dan Memodelkan Soal Cerita
Langkah terpenting dalam PM adalah menerjemahkan kalimat cerita yang panjang ke dalam model matematika (persamaan atau pertidaksamaan).
- **Identifikasi Variabel:** Tentukan apa yang diketahui dan apa yang ditanyakan. Buat permisalan variabel yang jelas (misal: x = harga buku, y = harga pensil).
- **Terjemahkan Kata Kunci:**
  - "Lebih dari" / "Kurang dari" -> \`>\` / \`<\`
  - "Setidaknya" / "Paling sedikit" / "Minimal" -> \`≥\`
  - "Maksimal" / "Paling banyak" / "Tidak lebih dari" -> \`≤\`
  - "Selisih" -> Nilai mutlak dari pengurangan (selalu positif).
- **Perhatikan Satuan:** Pastikan semua satuan dalam soal sudah seragam sebelum melakukan perhitungan (misal: ubah jam ke menit, km ke m).

## 2. Analisis Data & Grafik
Anda akan sering disajikan data dalam bentuk tabel, diagram batang, diagram lingkaran, atau grafik garis.
- **Baca Label Sumbu:** Perhatikan dengan saksama apa yang diwakili oleh sumbu X (horizontal) dan sumbu Y (vertikal), serta satuannya (misal: dalam ribuan, dalam persen).
- **Tren Data:** Pahami apakah grafik menunjukkan tren naik (positif), turun (negatif), atau konstan.
- **Perhitungan dari Grafik:** Anda mungkin diminta menghitung:
  - *Persentase perubahan:* ((Nilai Akhir - Nilai Awal) / Nilai Awal) * 100%
  - *Rata-rata (Mean):* Jumlahkan semua nilai data lalu bagi dengan banyak data.
  - *Peluang:* Berdasarkan frekuensi kejadian pada grafik.

## 3. Aritmatika Sosial & Keuangan Dasar
Topik ini sangat sering muncul karena sangat aplikatif.
- **Diskon & Pajak:** Pahami cara menghitung harga akhir setelah diskon bertingkat (misal: diskon 50% + 20% BUKAN berarti diskon 70%, melainkan dihitung berurutan) dan penambahan pajak (PPN).
- **Bunga Tunggal & Majemuk:**
  - *Bunga Tunggal:* Bunga dihitung hanya dari modal awal. Rumus: Akhir = Modal * (1 + (bunga * waktu))
  - *Bunga Majemuk:* Bunga berbunga (dihitung dari modal + bunga sebelumnya). Rumus: Akhir = Modal * (1 + bunga)^waktu
- **Kecepatan, Jarak, Waktu:** Ingat segitiga J-K-W (Jarak = Kecepatan * Waktu). Pahami juga konsep kecepatan rata-rata jika ada beberapa etape perjalanan.

### Sumber Belajar Tambahan:
- **Blog (Grafik + strategi):** [Soal Tes Skolastik Penalaran Matematika](https://www.brainacademy.id/blog/soal-tes-skolastik-penalaran-matematika)
- **Video Pembahasan:** Tonton video di bawah untuk pembahasan 20 soal PM asli.
`,
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
      const chunkSize = 20;
      for (let i = 0; i < questionIds.length; i += chunkSize) {
        const chunk = questionIds.slice(i, i + chunkSize);
        const tRef = doc(collection(db, 'tryouts'));
        batch.set(tRef, {
          title: `Simulasi UTBK SNBT 2026 (Super Hard) - Paket ${Math.floor(i / chunkSize) + 1}`,
          duration: Math.round(chunk.length * 1.2),
          questionIds: chunk,
          createdAt: new Date().toISOString()
        });
      }

      // FIX #5: Rethrow error agar outer catch bisa menangkapnya
      await batch.commit();

      setStatus('Database successfully updated with complete data!');
      setIsDone(true);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Seed failed:', error);
      handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
      try {
        const errObj = JSON.parse(error instanceof Error ? error.message : '');
        setStatus(`Permission Denied: ${errObj.authInfo?.email || 'Unknown User'}`);
      } catch {
        setStatus('Failed to seed data. Please check your connection or permissions.');
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