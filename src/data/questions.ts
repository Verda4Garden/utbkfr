export type Category =
  | 'Penalaran Umum'
  | 'Pengetahuan Kuantitatif'
  | 'Pengetahuan dan Pemahaman Umum'
  | 'Kemampuan Memahami Bacaan dan Menulis'
  | 'Penalaran Matematika'
  | 'Literasi dalam Bahasa Indonesia'
  | 'Literasi dalam Bahasa Inggris';

export type Difficulty = 'Mudah' | 'Sedang' | 'Susah';

export interface Question {
  id: string;
  category: Category;
  topic: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const UTBK_TOPICS: Record<Category | string, string[]> = {
  'Penalaran Umum': ['Logika Kuantor', 'Negasi Pernyataan Majemuk', 'Diagram Venn', 'Argumen & Kesimpulan', 'Silogisme', 'Analitik'],
  'Pengetahuan Kuantitatif': ['Aljabar', 'Aritmetika', 'Geometri', 'Statistika', 'Peluang', 'Limit', 'Transformasi Fungsi', 'Sistem Non-Linear', 'Optimasi', 'Inequality', 'Kombinatorika Restriksi', 'Fungsi Grafik Interpretasi'],
  'Pengetahuan dan Pemahaman Umum': ['Sinonim', 'Antonim', 'Pemahaman Bacaan', 'Ejaan', 'Parafrase', 'Judul Tepat', 'Simpulan Implisit Dalam', 'Sebab-Akibat Teks'],
  'Kemampuan Memahami Bacaan dan Menulis': ['Ide Pokok', 'Kesimpulan', 'Tanda Baca', 'Kata Baku', 'Struktur S-P-O-K Kacau', 'Ambiguitas', 'Paragraf Tidak Logis', 'Logika Antarkalimat'],
  'Penalaran Matematika': ['Fungsi', 'Persamaan Linear', 'Pertidaksamaan', 'Matriks', 'Multi-konsep', 'Jebakan Investasi', 'Median + x', 'Geometri Terapan'],
  'Literasi dalam Bahasa Indonesia': ['Teks Sastra', 'Teks Informasi', 'Bacaan Panjang', 'Perbandingan 2 Teks'],
  'Literasi dalam Bahasa Inggris': ['Main Idea', 'Specific Information', 'Vocabulary', 'Inference', 'Long Passage', 'Grammar in Context', 'Cloze Test']
};

export const questions: Question[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // PENALARAN UMUM (PU) — LANJUTAN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'pu-adv-1',
    category: 'Penalaran Umum',
    topic: 'Logika Kuantor',
    difficulty: 'Susah',
    text: 'Perhatikan ketiga pernyataan berikut.\n\n(1) Semua mahasiswa yang lulus seleksi nasional mendapatkan beasiswa penuh.\n(2) Sebagian penerima beasiswa penuh berasal dari keluarga kurang mampu.\n(3) Dika lulus seleksi nasional.\n\nManakah pernyataan yang **pasti benar** berdasarkan premis di atas?\n\n**I.** Dika mendapatkan beasiswa penuh.\n**II.** Dika berasal dari keluarga kurang mampu.\n**III.** Ada penerima beasiswa penuh yang bukan berasal dari keluarga kurang mampu.',
    options: [
      'Hanya I',
      'Hanya I dan II',
      'Hanya I dan III',
      'I, II, dan III',
      'Hanya II dan III',
    ],
    correctAnswerIndex: 0,
    explanation:
      '**Analisis tiap pernyataan dengan logika kuantor:**\n\n**Pernyataan I — Dika mendapat beasiswa penuh:**\n- P1: ∀x, Lulus seleksi → dapat beasiswa penuh\n- P3: Dika lulus seleksi\n- Kesimpulan (**modus ponens**): Dika dapat beasiswa penuh. **PASTI BENAR ✅**\n\n**Pernyataan II — Dika dari keluarga kurang mampu:**\n- P2 hanya menyatakan "sebagian" penerima berasal dari keluarga kurang mampu.\n- Kuantor "sebagian" (∃) **tidak bisa** diterapkan ke individu spesifik.\n- Dika mungkin termasuk atau tidak termasuk "sebagian" itu. **TIDAK PASTI ❌**\n\n**Pernyataan III — Ada penerima beasiswa yang bukan dari keluarga kurang mampu:**\n- P2: "sebagian" penerima berasal dari keluarga kurang mampu.\n- "Sebagian" dalam logika = ada yang iya. Namun "sebagian" **tidak menyiratkan** bahwa sisanya tidak — itu interpretasi yang tidak sah dari pernyataan P2 saja.\n- **TIDAK PASTI ❌**\n\nJawaban: **Hanya I**.\n\n> 💡 **Kunci SNBT:** Kuantor "semua" memungkinkan **modus ponens** untuk individu. Kuantor "sebagian" hanya menyatakan keberadaan — **tidak bisa** digunakan untuk menarik kesimpulan tentang individu tertentu, dan tidak menyiratkan komplemen.',
  },

  {
    id: 'pu-adv-2',
    category: 'Penalaran Umum',
    topic: 'Logika Kuantor',
    difficulty: 'Susah',
    text: 'Perhatikan pernyataan-pernyataan berikut.\n\n(1) Tidak ada peserta olimpiade yang tidak pernah berlatih soal.\n(2) Sebagian peserta yang rajin berlatih soal berhasil meraih medali.\n(3) Semua yang meraih medali diundang ke pelatnas.\n(4) Sinta adalah peserta olimpiade.\n\nManakah yang **pasti benar**?\n\n**I.** Sinta pernah berlatih soal.\n**II.** Sinta meraih medali.\n**III.** Jika Sinta meraih medali, maka Sinta diundang ke pelatnas.',
    options: [
      'Hanya I',
      'Hanya III',
      'Hanya I dan II',
      'Hanya I dan III',
      'I, II, dan III',
    ],
    correctAnswerIndex: 3,
    explanation:
      '**Terjemahkan P1 terlebih dahulu:**\n- "Tidak ada peserta olimpiade yang tidak pernah berlatih" = **Semua peserta olimpiade pernah berlatih soal.**\n\n**Pernyataan I — Sinta pernah berlatih soal:**\n- P1 (ditraslasi): Semua peserta olimpiade → pernah berlatih\n- P4: Sinta adalah peserta olimpiade\n- **Modus ponens → Sinta pernah berlatih. PASTI BENAR ✅**\n\n**Pernyataan II — Sinta meraih medali:**\n- P2: Sebagian yang rajin berlatih → meraih medali (kuantor ∃, bukan ∀)\n- Sinta pernah berlatih, tetapi kita tidak tahu apakah ia termasuk "sebagian" yang meraih medali.\n- **TIDAK PASTI ❌**\n\n**Pernyataan III — Jika Sinta meraih medali, maka Sinta diundang ke pelatnas:**\n- P3: Semua peraih medali → diundang ke pelatnas\n- Ini adalah implikasi umum yang berlaku untuk siapa pun, termasuk Sinta — bukan klaim bahwa Sinta meraih medali.\n- **PASTI BENAR ✅** (ini hanya menyatakan implikasi kondisional, bukan fakta)\n\nJawaban: **I dan III → D**\n\n> 💡 **Jebakan klasik:** Pernyataan III terlihat "lemah" karena bersyarat, tetapi justru PASTI BENAR karena hanya meneruskan implikasi universal dari P3.',
  },

  {
    id: 'pu-adv-3',
    category: 'Penalaran Umum',
    topic: 'Negasi Pernyataan Majemuk',
    difficulty: 'Susah',
    text: 'Perhatikan pernyataan berikut.\n\n*"Jika inflasi meningkat dan nilai tukar rupiah melemah, maka harga barang impor naik atau cadangan devisa berkurang."*\n\nNegasi yang **tepat** dari pernyataan di atas adalah...',
    options: [
      'Inflasi tidak meningkat atau nilai tukar rupiah tidak melemah, dan harga barang impor naik dan cadangan devisa berkurang.',
      'Inflasi meningkat dan nilai tukar rupiah melemah, tetapi harga barang impor tidak naik dan cadangan devisa tidak berkurang.',
      'Jika inflasi tidak meningkat atau nilai tukar rupiah tidak melemah, maka harga barang impor tidak naik dan cadangan devisa tidak berkurang.',
      'Inflasi tidak meningkat dan nilai tukar rupiah tidak melemah, atau harga barang impor naik dan cadangan devisa berkurang.',
      'Jika harga barang impor tidak naik dan cadangan devisa tidak berkurang, maka inflasi tidak meningkat atau nilai tukar rupiah tidak melemah.',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Pernyataan asal berbentuk **p → q**, di mana:\n- **p** = "inflasi meningkat **DAN** nilai tukar rupiah melemah"\n- **q** = "harga barang impor naik **ATAU** cadangan devisa berkurang"\n\n**Negasi dari (p → q)** = **p ∧ ¬q** (kondisi terpenuhi tapi konsekuensi gagal)\n\n**Hitung ¬q** dengan Hukum De Morgan:\n$$\\neg(A \\lor B) = \\neg A \\land \\neg B$$\n$$\\neg q = \\text{"harga barang impor TIDAK naik DAN cadangan devisa TIDAK berkurang"}$$\n\n**Negasi lengkap:**\n> "Inflasi meningkat **dan** nilai tukar rupiah melemah, **tetapi** harga barang impor tidak naik **dan** cadangan devisa tidak berkurang."\n\nIni sesuai **pilihan B ✅**\n\n**Mengapa pilihan lain salah?**\n- **A:** Ini adalah negasi dari **p** dikalikan **q** — bukan negasi dari implikasi.\n- **C:** Ini adalah **kontraposisi** yang dimódifikasi — bukan negasi.\n- **E:** Ini adalah kontraposisi (**¬q → ¬p**) — valid secara ekuivalen, tetapi bukan **negasi**.\n\n> 💡 **Rumus cepat:** ¬(p→q) = p ∧ ¬q. Ingat selalu terapkan De Morgan ke q jika q berbentuk disjungsi (ATAU → DAN setelah dinegasi).',
  },

  {
    id: 'pu-adv-4',
    category: 'Penalaran Umum',
    topic: 'Diagram Venn',
    difficulty: 'Susah',
    text: 'Survei terhadap 100 mahasiswa tentang mata kuliah favorit menghasilkan data berikut:\n\n- Menyukai Matematika (M): 45 orang\n- Menyukai Fisika (F): 40 orang\n- Menyukai Kimia (K): 35 orang\n- Menyukai M dan F: 18 orang\n- Menyukai F dan K: 15 orang\n- Menyukai M dan K: 12 orang\n- Menyukai ketiganya: 5 orang\n\nBerapa banyak mahasiswa yang **hanya menyukai tepat satu** mata kuliah dari ketiga pilihan tersebut?',
    options: ['35', '40', '45', '50', '55'],
    correctAnswerIndex: 2,
    explanation:
      '**Metode: Hitung tiap wilayah eksklusif satu per satu.**\n\nLangkah 1 — Hitung irisan dua set (tidak termasuk tiga):\n- M∩F saja = 18 − 5 = **13**\n- F∩K saja = 15 − 5 = **10**\n- M∩K saja = 12 − 5 = **7**\n\nLangkah 2 — Hitung wilayah eksklusif (hanya satu):\n$$|\\text{Hanya M}| = 45 - 13 - 7 - 5 = 20$$\n$$|\\text{Hanya F}| = 40 - 13 - 10 - 5 = 12$$\n$$|\\text{Hanya K}| = 35 - 10 - 7 - 5 = 13$$\n\nLangkah 3 — Total tepat satu:\n$$20 + 12 + 13 = \\mathbf{45}$$\n\n**Verifikasi:** Total = 45 (hanya 1) + 30 (tepat 2: 13+10+7) + 5 (ketiganya) = 80. Tidak suka ketiganya = 20. Total = 100. ✅\n\n**Rumus alternatif cepat:**\n$$|\\text{Tepat satu}| = |M|+|F|+|K| - 2|M{\\cap}F| - 2|F{\\cap}K| - 2|M{\\cap}K| + 3|M{\\cap}F{\\cap}K|$$\n$$= 120 - 36 - 30 - 24 + 15 = 45$$\n\n> ⚠️ **Jebakan umum:** Menghitung "Hanya M = 45 − 18 − 12 = 15" tanpa menambahkan kembali irisan tiga, menghasilkan total 30 — salah.',
  },

  {
    id: 'pu-adv-5',
    category: 'Penalaran Umum',
    topic: 'Argumen & Kesimpulan',
    difficulty: 'Susah',
    text: 'Bacalah argumen berikut dengan cermat.\n\n*"Penjualan produk organik meningkat 40% dalam dua tahun terakhir di kota-kota besar. Ini membuktikan bahwa masyarakat perkotaan semakin peduli terhadap kesehatan mereka."*\n\nAsumsi tersembunyi yang **harus benar** agar kesimpulan dalam argumen ini menjadi valid adalah...',
    options: [
      'Produk organik selalu lebih mahal dari produk konvensional.',
      'Masyarakat perkotaan memiliki daya beli yang lebih tinggi dari masyarakat pedesaan.',
      'Peningkatan penjualan produk organik terutama didorong oleh motif kesehatan, bukan faktor lain seperti tren gaya hidup atau prestise sosial.',
      'Produk organik terbukti secara ilmiah lebih sehat dari produk konvensional.',
      'Kepedulian terhadap kesehatan selalu meningkat seiring meningkatnya pendapatan.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Identifikasi celah logika dalam argumen:**\n\n- **Fakta:** Penjualan produk organik meningkat 40%.\n- **Kesimpulan:** Masyarakat semakin peduli kesehatan.\n\n**Lompatan logika:** Argumen berasumsi bahwa kenaikan penjualan = kepedulian kesehatan. Namun penjualan bisa naik karena alasan **lain**: tren media sosial, pengaruh influencer, anjuran dokter yang viral, atau sekadar gengsi sosial ("organik = orang kaya").\n\n**Asumsi yang menutup celah ini:**\n→ Bahwa orang membeli produk organik **karena alasan kesehatan**, bukan karena faktor lain.\n→ Inilah isi **pilihan C ✅**\n\n**Mengapa pilihan lain salah?**\n- **A & B:** Fakta tentang harga/daya beli tidak berhubungan langsung dengan motivasi pembelian.\n- **D:** Kualitas ilmiah produk organik tidak diperlukan sebagai asumsi — argumen hanya bicara tentang niat/motivasi pembeli.\n- **E:** Hubungan pendapatan-kesehatan tidak relevan dengan argumen ini.\n\n> 💡 **Teknik "jembatan asumsi":** Tanyakan diri sendiri: *"Fakta apa yang harus benar agar fakta mengarah ke kesimpulan secara logis?"* Itulah asumsinya.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PENGETAHUAN KUANTITATIF (PK) — LANJUTAN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'pk-adv-1',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Limit Fungsi',
    difficulty: 'Susah',
    text: 'Nilai dari $\\displaystyle\\lim_{x \\to 2} \\dfrac{x^3 - 8}{x^2 - 4}$ adalah...',
    options: ['$\\dfrac{1}{2}$', '$1$', '$3$', '$\\dfrac{3}{2}$', '$4$'],
    correctAnswerIndex: 2,
    explanation:
      'Substitusi langsung $x=2$ menghasilkan $\\frac{0}{0}$ (bentuk tak tentu). Faktorkan pembilang dan penyebut.\n\n**Faktorisasi:**\n- Pembilang: $x^3 - 8 = (x-2)(x^2+2x+4)$ ← *selisih dua kubik*\n- Penyebut: $x^2 - 4 = (x-2)(x+2)$ ← *selisih dua kuadrat*\n\n**Sederhanakan** (faktor $(x-2)$ saling hapus, $x \\neq 2$):\n$$\\lim_{x \\to 2} \\frac{(x-2)(x^2+2x+4)}{(x-2)(x+2)} = \\lim_{x \\to 2} \\frac{x^2+2x+4}{x+2}$$\n\n**Substitusi $x=2$:**\n$$= \\frac{4+4+4}{2+2} = \\frac{12}{4} = \\mathbf{3}$$\n\n> 💡 **Pola hafalan:** $a^3 - b^3 = (a-b)(a^2+ab+b^2)$. Soal limit bentuk $\\frac{0}{0}$ selalu diselesaikan dengan **faktorisasi** atau **L\'Hôpital** — substitusi langsung tidak cukup.',
  },

  {
    id: 'pk-adv-2',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Transformasi Fungsi',
    difficulty: 'Susah',
    text: 'Diketahui $f(x) = x^2 - 4x + 1$. Grafik $y = f(x)$ **digeser 3 satuan ke kanan**, kemudian **dicerminkan terhadap sumbu-$x$**. Persamaan grafik hasil transformasi adalah...',
    options: [
      '$y = -x^2 + 10x - 22$',
      '$y = -x^2 + 10x + 22$',
      '$y = x^2 - 10x + 22$',
      '$y = -x^2 - 10x + 22$',
      '$y = x^2 + 10x - 22$',
    ],
    correctAnswerIndex: 0,
    explanation:
      '**Langkah 1 — Geser 3 satuan ke kanan:**\nGanti $x$ dengan $(x-3)$:\n$$f(x-3) = (x-3)^2 - 4(x-3) + 1$$\n$$= x^2 - 6x + 9 - 4x + 12 + 1$$\n$$= x^2 - 10x + 22$$\n\n**Langkah 2 — Cerminkan terhadap sumbu-$x$:**\nNegasikan seluruh fungsi (cermin sumbu-$x$: $y \\to -y$):\n$$y = -(x^2 - 10x + 22) = -x^2 + 10x - 22$$\n\nJawaban: **$y = -x^2 + 10x - 22$ → A ✅**\n\n> ⚠️ **Urutan transformasi sangat penting!** Geser dulu, baru cermin. Membalik urutan akan menghasilkan jawaban berbeda.\n\n> 💡 **Ringkasan transformasi dasar:**\n> - Geser $k$ ke kanan: ganti $x \\to (x-k)$\n> - Geser $k$ ke atas: tambah $+k$ pada fungsi\n> - Cermin sumbu-$x$: negasikan fungsi ($y \\to -y$)\n> - Cermin sumbu-$y$: ganti $x \\to -x$',
  },

  {
    id: 'pk-adv-3',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Sistem Persamaan Non-Linear',
    difficulty: 'Susah',
    text: 'Diketahui $x$ dan $y$ adalah bilangan real positif yang memenuhi:\n$$x^2 + y^2 = 25 \\quad \\text{dan} \\quad x + y = 7$$\n\nNilai dari $x^2 y + x y^2$ adalah...',
    options: ['42', '60', '72', '84', '98'],
    correctAnswerIndex: 3,
    explanation:
      '**Jangan mencari $x$ dan $y$ satu per satu — ada cara lebih cepat!**\n\nFaktorkan ekspresi yang ditanya:\n$$x^2y + xy^2 = xy(x+y)$$\n\nKita sudah tahu $x+y = 7$. Yang dibutuhkan hanya **nilai $xy$**.\n\n**Cari $xy$ dari identitas:**\n$$(x+y)^2 = x^2 + 2xy + y^2$$\n$$49 = 25 + 2xy$$\n$$2xy = 24 \\implies xy = 12$$\n\n**Hitung hasilnya:**\n$$x^2y + xy^2 = xy(x+y) = 12 \\times 7 = \\mathbf{84}$$\n\n> ⚠️ **Jebakan:** Banyak siswa langsung menyelesaikan sistem → $x^2 - 7x + 12 = 0 \\to x = 3$ atau $x = 4$, lalu substitusi. Hasilnya sama (84), tetapi 3× lebih lambat!\n\n> 💡 **Strategi:** Selalu faktorkan ekspresi yang ditanya terlebih dahulu sebelum mencari nilai variabel individual.',
  },

  {
    id: 'pk-adv-4',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Optimasi',
    difficulty: 'Susah',
    text: 'Seorang peternak memiliki kawat sepanjang **120 meter** untuk membuat kandang berbentuk persegi panjang. Satu sisi kandang memanfaatkan dinding gudang (tidak memerlukan kawat). Agar luas kandang **maksimum**, berapa panjang sisi yang **sejajar dengan dinding** tersebut?',
    options: ['20 m', '30 m', '40 m', '60 m', '80 m'],
    correctAnswerIndex: 3,
    explanation:
      'Misalkan sisi tegak lurus dinding = $x$, sisi sejajar dinding = $y$.\n\n**Kendala kawat** (hanya 3 sisi yang butuh kawat):\n$$2x + y = 120 \\implies y = 120 - 2x$$\n\n**Fungsi luas:**\n$$L(x) = x \\cdot y = x(120 - 2x) = 120x - 2x^2$$\n\n**Maksimumkan** dengan turunan pertama:\n$$L\'(x) = 120 - 4x = 0 \\implies x = 30$$\n\n**Sisi sejajar dinding:**\n$$y = 120 - 2(30) = 60 \\text{ m}$$\n\n**Luas maksimum** = $30 \\times 60 = 1.800$ m².\n\nJawaban: **D (60 m) ✅**\n\n> ⚠️ **Jebakan:** Soal menanya sisi sejajar dinding ($y$), bukan sisi tegak lurus ($x$). Banyak siswa berhenti di $x = 30$ dan memilih pilihan "30 m".\n\n> 💡 Cek: $L\'\'(x) = -4 < 0$ → memang maksimum (bukan minimum).',
  },

  {
    id: 'pk-adv-5',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Pertidaksamaan (Inequality)',
    difficulty: 'Susah',
    text: 'Himpunan penyelesaian dari pertidaksamaan $\\dfrac{x^2 - 5x + 6}{x - 1} < 0$ adalah...',
    options: [
      '$x < 1$ atau $2 < x < 3$',
      '$1 < x < 2$ atau $x > 3$',
      '$x < 2$ atau $1 < x < 3$',
      '$x < 1$ atau $x > 3$',
      '$2 < x < 3$',
    ],
    correctAnswerIndex: 0,
    explanation:
      '**Faktorkan pembilang:**\n$$x^2 - 5x + 6 = (x-2)(x-3)$$\n\nPertidaksamaan menjadi: $\\dfrac{(x-2)(x-3)}{x-1} < 0$ dengan syarat $x \\neq 1$.\n\n**Titik kritis:** $x = 1, 2, 3$. Buat garis bilangan:\n\n| Interval | $(x-2)$ | $(x-3)$ | $(x-1)$ | Hasil |\n|----------|---------|---------|---------|-------|\n| $x < 1$ | $-$ | $-$ | $-$ | $\\frac{(+)}{(-)} < 0$ ✅ |\n| $1 < x < 2$ | $-$ | $-$ | $+$ | $\\frac{(+)}{(+)} > 0$ ❌ |\n| $2 < x < 3$ | $+$ | $-$ | $+$ | $\\frac{(-)}{(+)} < 0$ ✅ |\n| $x > 3$ | $+$ | $+$ | $+$ | $\\frac{(+)}{(+)} > 0$ ❌ |\n\n**Penyelesaian:** $x < 1$ **atau** $2 < x < 3$ (eksklusif pada $x = 1, 2, 3$)\n\nJawaban: **A ✅**\n\n> 💡 **Metode garis bilangan:** Tandai titik kritis, uji tanda setiap faktor per interval. Perhatikan tanda penyebut — pembuat nol penyebut ($x=1$) **tidak boleh** masuk ke himpunan penyelesaian.',
  },

  {
    id: 'pk-adv-6',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Kombinatorika',
    difficulty: 'Susah',
    text: 'Dari 5 pasang sepatu (5 sepatu kiri dan 5 sepatu kanan yang saling berpasangan), diambil **4 sepatu secara acak**. Banyaknya cara memilih 4 sepatu sedemikian sehingga **tidak terdapat satu pasang pun yang lengkap** adalah...',
    options: ['60', '70', '80', '90', '100'],
    correctAnswerIndex: 2,
    explanation:
      '**Strategi:** Pilih dulu pasang-pasang yang akan diwakili, lalu ambil hanya satu dari tiap pasang.\n\n**Langkah 1:** Pilih 4 dari 5 pasang sepatu (pasang mana yang diwakili):\n$$\\binom{5}{4} = 5 \\text{ cara}$$\n\n**Langkah 2:** Dari tiap pasang yang terpilih, ambil **hanya satu** (kiri atau kanan — 2 pilihan per pasang):\n$$2^4 = 16 \\text{ cara}$$\n\n**Total:**\n$$5 \\times 16 = \\mathbf{80} \\text{ cara}$$\n\nJawaban: **C ✅**\n\n**Verifikasi dengan komplemen:**\n- Total pilih 4 dari 10: $\\binom{10}{4} = 210$\n- Yang punya ≥ 1 pasang lengkap:\n  - Tepat 1 pasang: $\\binom{5}{1} \\times \\binom{8}{2} = 5 \\times 28 = 140$\n  - Tepat 2 pasang: $\\binom{5}{2} = 10$\n  - Berpasangan semua = 0 (hanya 4 sepatu diambil, max 2 pasang)\n  - Total berpasangan = 140 + 10 = 150\n  - Yang tidak berpasangan = 210 - 150 = **60** ???\n\nHmm — cara komplemen berbeda. Mari re-cek cara langsung:\n$\\binom{5}{4} \\times 2^4 = 5 \\times 16 = 80$. ✅ (cara langsung benar)\n\nKesalahan komplemen di atas: "tepat 1 pasang" = $\\binom{5}{1}$ (pilih pasang) × $\\binom{8}{2}$ — tapi ini sudah termasuk kasus 2 pasang dihitung 2× → perlu inklusi-eksklusi lebih hati-hati.\n\n> 💡 Cara **langsung** lebih aman untuk soal ini. Selalu identifikasi apakah "counting direct" atau "complement" lebih sederhana.',
  },

  {
    id: 'pk-adv-7',
    category: 'Pengetahuan Kuantitatif',
    topic: 'Fungsi & Komposisi',
    difficulty: 'Susah',
    text: 'Grafik fungsi $y = f(x)$ pada interval $[0, 6]$ terdiri dari dua segmen garis lurus:\n- Segmen I: dari titik $(0, 1)$ ke titik $(4, 5)$\n- Segmen II: dari titik $(4, 5)$ ke titik $(6, 1)$\n\nJika $g(x) = f(2x) + 3$, nilai dari $g(1) + g(2)$ adalah...',
    options: ['13', '15', '16', '17', '18'],
    correctAnswerIndex: 2,
    explanation:
      '**Langkah 1 — Tentukan persamaan tiap segmen $f$:**\n\n*Segmen I* — melalui $(0,1)$ dan $(4,5)$:\n$$\\text{Gradien} = \\frac{5-1}{4-0} = 1 \\implies f(x) = x + 1 \\quad (0 \\le x \\le 4)$$\n\n*Segmen II* — melalui $(4,5)$ dan $(6,1)$:\n$$\\text{Gradien} = \\frac{1-5}{6-4} = -2 \\implies f(x) = -2(x-4)+5 = -2x+13 \\quad (4 < x \\le 6)$$\n\n**Langkah 2 — Evaluasi $g(1)$ dan $g(2)$:**\n\n$$g(1) = f(2 \\times 1) + 3 = f(2) + 3$$\n$$f(2) = 2 + 1 = 3 \\quad (\\text{karena } 2 \\in [0,4])$$\n$$g(1) = 3 + 3 = 6$$\n\n$$g(2) = f(2 \\times 2) + 3 = f(4) + 3$$\n$$f(4) = 4 + 1 = 5 \\quad (\\text{gunakan Segmen I untuk titik ujung})$$\n$$g(2) = 5 + 3 = 8$$\n\n**Hasil:**\n$$g(1) + g(2) = 6 + 8 = \\mathbf{16}$$\n\nJawaban: **C ✅**\n\n> 💡 Perhatikan argumen $f(2x)$ — kompresi horizontal! Interval $g$ dari $[0,3]$ (bukan $[0,6]$). Tentukan segmen yang tepat berdasarkan nilai $2x$.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PENALARAN MATEMATIKA (PM) — LANJUTAN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'pm-adv-1',
    category: 'Penalaran Matematika',
    topic: 'Statistika',
    difficulty: 'Susah',
    text: 'Sebuah perusahaan memiliki tiga divisi dengan data gaji sebagai berikut:\n\n| Divisi | Jumlah Karyawan | Rata-rata Gaji |\n|--------|----------------|----------------|\n| A      | 40 orang       | Rp5.000.000    |\n| B      | 30 orang       | Rp7.000.000    |\n| C      | 30 orang       | Rp6.000.000    |\n\nJika seluruh karyawan mendapat kenaikan gaji sebesar **10%**, berapa rata-rata gaji seluruh karyawan **setelah kenaikan**?',
    options: [
      'Rp6.160.000',
      'Rp6.270.000',
      'Rp6.380.000',
      'Rp6.490.000',
      'Rp6.600.000',
    ],
    correctAnswerIndex: 3,
    explanation:
      '**Jebakan:** Banyak siswa menghitung rata-rata divisi dulu → $(5+7+6)/3 = 6$ juta → ×1,1 = Rp6.600.000. Ini **SALAH** karena jumlah karyawan tiap divisi berbeda!\n\n**Cara benar — rata-rata tertimbang:**\n\n*Total gaji sebelum kenaikan:*\n$$40 \\times 5.000.000 + 30 \\times 7.000.000 + 30 \\times 6.000.000$$\n$$= 200.000.000 + 210.000.000 + 180.000.000 = 590.000.000$$\n\n*Total karyawan:* $40 + 30 + 30 = 100$\n\n*Rata-rata sebelum:* $590.000.000 / 100 = \\text{Rp}5.900.000$\n\n*Setelah kenaikan 10%:*\n$$5.900.000 \\times 1{,}10 = \\mathbf{Rp6.490.000}$$\n\nJawaban: **D ✅**\n\n> 💡 **Rata-rata tertimbang** wajib digunakan jika jumlah data per kelompok **tidak sama**. Cara cepat: kalikan terlebih dahulu, baru rata-ratakan setelah dikenaikan — atau cukup rata-ratakan dulu, lalu kali 1,1.',
  },

  {
    id: 'pm-adv-2',
    category: 'Penalaran Matematika',
    topic: 'Aritmetika Sosial',
    difficulty: 'Susah',
    text: 'Pak Rudi menginvestasikan Rp20.000.000 ke dalam dua instrumen: sebagian ke deposito berbunga **8% per tahun**, dan sisanya ke reksa dana saham berpotensi keuntungan **12% per tahun**. Setelah satu tahun, total keuntungan yang diperoleh Pak Rudi adalah **Rp1.960.000**.\n\nBerapa besar dana yang ditempatkan Pak Rudi di **reksa dana saham**?',
    options: [
      'Rp7.000.000',
      'Rp8.000.000',
      'Rp9.000.000',
      'Rp11.000.000',
      'Rp13.000.000',
    ],
    correctAnswerIndex: 2,
    explanation:
      'Misalkan deposito = $x$, maka reksa dana = $(20.000.000 - x)$.\n\n**Persamaan keuntungan:**\n$$0{,}08x + 0{,}12(20.000.000 - x) = 1.960.000$$\n$$0{,}08x + 2.400.000 - 0{,}12x = 1.960.000$$\n$$-0{,}04x = -440.000$$\n$$x = 11.000.000 \\quad \\text{(ini deposito!)}$$\n\n**Reksa dana** = $20.000.000 - 11.000.000 = \\mathbf{Rp9.000.000}$\n\nJawaban: **C ✅**\n\n**Verifikasi:**\n- Deposito: $11.000.000 \\times 8\\% = 880.000$\n- Reksa dana: $9.000.000 \\times 12\\% = 1.080.000$\n- Total: $880.000 + 1.080.000 = 1.960.000$ ✅\n\n> ⚠️ **Jebakan klasik:** Siswa menemukan $x = 11.000.000$ (deposito) dan langsung memilih "Rp11.000.000" — SALAH! Soal menanya reksa dana, bukan deposito. Selalu baca ulang pertanyaan sebelum menjawab.',
  },

  {
    id: 'pm-adv-3',
    category: 'Penalaran Matematika',
    topic: 'Statistika',
    difficulty: 'Susah',
    text: 'Data nilai lima siswa (belum terurut): **63, 71, 77, 97,** dan **$x$**.\n\nDiketahui bahwa rata-rata data tersebut adalah **80**. Berapakah **median** dari data tersebut?',
    options: ['77', '80', '81', '87', '$x$'],
    correctAnswerIndex: 0,
    explanation:
      '**Langkah 1 — Cari nilai $x$:**\n$$\\frac{63 + 71 + 77 + 97 + x}{5} = 80$$\n$$308 + x = 400$$\n$$x = 92$$\n\n**Langkah 2 — Urutkan data (WAJIB sebelum mencari median):**\n$$63, \\; 71, \\; 77, \\; 92, \\; 97$$\n\n**Langkah 3 — Tentukan median (data ke-3 dari 5 data):**\n$$\\text{Median} = 77$$\n\nJawaban: **A ✅**\n\n> ⚠️ **Jebakan berlapis:**\n> - **Jebakan 1:** Siswa yang tidak mengurutkan ulang setelah menemukan $x$ akan mengambil data ke-3 dari urutan asli: 63, 71, **77**, 97, 92 → median = 77 (kebetulan sama, tapi alasan salah)\n> - **Jebakan 2:** Siswa yang keliru mengira $x = 92$ adalah mediannya memilih pilihan E\n> - **Jebakan 3:** Siswa yang mengira median = rata-rata (80) memilih B\n\n> 💡 **Aturan wajib:** **Urutkan data terlebih dahulu**, terutama jika ada variabel $x$ yang nilainya bisa mengubah posisi dalam urutan.',
  },

  {
    id: 'pm-adv-4',
    category: 'Penalaran Matematika',
    topic: 'Geometri Terapan',
    difficulty: 'Susah',
    text: 'Sebuah kolam renang berbentuk trapesium dengan panjang sisi sejajar 20 m dan 12 m, serta tinggi 8 m. Kolam tersebut akan dilapisi keramik di seluruh permukaan **dasar dan keempat dindingnya** (bukan bagian atas/permukaan air). Dinding tegak lurus memiliki tinggi 2 m, sedangkan kedua dinding miring menghubungkan sisi sejajar ke dasar dengan tinggi yang sama.\n\nJika dasar kolam memiliki lebar sesuai sisi sejajar yang lebih pendek (12 m) dan panjang 20 m, tentukan **luas total permukaan yang dilapisi keramik** *(hanya dasar dan keempat dinding, kolam berbentuk balok sederhana dengan alas 20 m × 12 m dan tinggi 2 m)*.',
    options: [
      '$240$ m²',
      '$368$ m²',
      '$448$ m²',
      '$480$ m²',
      '$512$ m²',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Kolam berbentuk **balok** dengan dimensi: panjang $= 20$ m, lebar $= 12$ m, tinggi $= 2$ m.\n\n**Permukaan yang dilapisi keramik** = dasar + 4 dinding (bukan tutup atas).\n\n**Luas dasar:**\n$$L_{\\text{dasar}} = 20 \\times 12 = 240 \\text{ m}^2$$\n\n**Luas dinding:**\n- Dua dinding panjang: $2 \\times (20 \\times 2) = 80 \\text{ m}^2$\n- Dua dinding lebar: $2 \\times (12 \\times 2) = 48 \\text{ m}^2$\n- Total dinding: $80 + 48 = 128 \\text{ m}^2$\n\n**Total keramik:**\n$$240 + 128 = \\mathbf{368} \\text{ m}^2$$\n\nJawaban: **B ✅**\n\n> ⚠️ **Jebakan:** Siswa yang menghitung luas permukaan total balok (termasuk tutup atas) akan mendapat $2(20\\times12 + 20\\times2 + 12\\times2) = 2(240+40+24) = 608$ m² — SALAH, karena permukaan air tidak dilapisi keramik.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PENGETAHUAN DAN PEMAHAMAN UMUM (PPU) — LANJUTAN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ppu-adv-1',
    category: 'Pengetahuan dan Pemahaman Umum',
    topic: 'Parafrase Kalimat',
    difficulty: 'Susah',
    text: 'Cermati kalimat berikut.\n\n*"Ketidakhadiran tenaga pendidik yang berkualitas di daerah terpencil menjadi penghambat signifikan bagi kemajuan pendidikan di wilayah tersebut."*\n\nParafrase yang **paling tepat** dari kalimat di atas adalah...',
    options: [
      'Guru yang tidak hadir di daerah terpencil menghalangi pendidikan.',
      'Kemajuan pendidikan di wilayah terpencil terhambat secara nyata oleh minimnya tenaga pendidik yang kompeten.',
      'Tenaga pendidik di daerah terpencil tidak berkualitas sehingga pendidikan terhambat.',
      'Tidak ada guru berkualitas di daerah terpencil.',
      'Daerah terpencil kekurangan pendidikan karena tidak ada guru yang hadir.',
    ],
    correctAnswerIndex: 1,
    explanation:
      '**Analisis kalimat asli:**\n- Subjek: ketidakhadiran tenaga pendidik berkualitas\n- Predikat: menjadi penghambat signifikan\n- Objek: kemajuan pendidikan di wilayah terpencil\n\n**Evaluasi tiap pilihan:**\n- **A ❌:** Menyederhanakan "ketidakhadiran tenaga pendidik berkualitas" menjadi "guru yang tidak hadir" — makna bergeser (bisa bermakna guru hadir tapi tidak kompeten, bukan sekadar absen).\n- **B ✅:** Mengubah struktur kalimat (objek menjadi subjek), mempertahankan makna "penghambat signifikan" → "terhambat secara nyata", dan "tenaga pendidik berkualitas" → "tenaga pendidik yang kompeten". **Paling akurat.**\n- **C ❌:** Mengubah makna — kalimat asli tidak menyatakan guru yang ada tidak berkualitas, tetapi guru berkualitas tidak hadir/tidak cukup.\n- **D ❌:** Terlalu ekstrem dan menyederhanakan.\n- **E ❌:** Menggabungkan "tidak ada" dan "tidak hadir" — distorsi makna.\n\n> 💡 **Parafrase yang baik:** Ubah struktur kalimat, ganti diksi dengan sinonim yang setara, tetapi **jaga makna keseluruhan** tanpa menambah atau mengurangi informasi.',
  },

  {
    id: 'ppu-adv-2',
    category: 'Pengetahuan dan Pemahaman Umum',
    topic: 'Judul Teks',
    difficulty: 'Susah',
    text: 'Bacalah paragraf berikut.\n\nPertanian hidroponik kian diminati masyarakat urban yang memiliki keterbatasan lahan. Berbeda dengan pertanian konvensional yang membutuhkan tanah subur dalam jumlah besar, hidroponik memanfaatkan air bernutrisi sebagai media tanam. Teknik ini tidak hanya menghemat lahan hingga 90%, tetapi juga menghasilkan panen 30–50% lebih cepat dibandingkan metode tanah. Namun, investasi awal yang diperlukan cukup besar, dan keberhasilannya sangat bergantung pada konsistensi pemantauan kadar nutrisi dan pH air. Para ahli agribisnis menilai bahwa dengan pelatihan yang tepat, hidroponik berpotensi menjadi solusi ketahanan pangan di kawasan perkotaan.\n\nJudul yang **paling tepat** untuk paragraf tersebut adalah...',
    options: [
      'Cara Bercocok Tanam Hidroponik di Rumah',
      'Keunggulan Pertanian Hidroponik bagi Masyarakat Urban',
      'Hidroponik: Solusi dan Tantangan Pertanian Modern di Perkotaan',
      'Investasi Mahal dalam Dunia Pertanian Hidroponik',
      'Pertanian Tanpa Tanah untuk Masa Depan Indonesia',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Analisis isi paragraf:**\n- Kelebihan hidroponik: hemat lahan, panen cepat\n- **Kekurangan/tantangan:** investasi mahal, pemantauan ketat\n- Potensi: solusi ketahanan pangan urban\n\nParagraf membahas **dua sisi** — keunggulan DAN tantangan.\n\n**Evaluasi pilihan:**\n- **A:** Terlalu teknis dan prosedural — paragraf tidak berisi cara/langkah.\n- **B:** Hanya mencerminkan aspek positif — mengabaikan tantangan yang dibahas.\n- **C ✅:** Mencakup kedua dimensi: "solusi" (keunggulan/potensi) dan "tantangan" (hambatan) — paling representatif.\n- **D:** Hanya menonjolkan aspek negatif — terlalu sempit.\n- **E:** Terlalu luas dan tidak spesifik — paragraf berfokus pada masyarakat urban, bukan Indonesia secara umum.\n\n> 💡 **Judul terbaik** harus: (1) mencakup topik utama secara menyeluruh, (2) tidak terlalu luas atau sempit, (3) netral dan tidak hanya mencerminkan satu sisi jika teks membahas dua sisi.',
  },

  {
    id: 'ppu-adv-3',
    category: 'Pengetahuan dan Pemahaman Umum',
    topic: 'Simpulan Implisit',
    difficulty: 'Susah',
    text: 'Bacalah teks berikut.\n\nAngka pernikahan dini di Provinsi X menurun 18% dalam lima tahun terakhir sejak program beasiswa khusus perempuan diluncurkan. Di sisi lain, Provinsi Y yang memiliki kondisi ekonomi dan budaya serupa namun tidak memiliki program sejenis justru mencatat peningkatan angka pernikahan dini sebesar 7% pada periode yang sama.\n\nSimpulan yang **paling logis dan terukur** berdasarkan teks tersebut adalah...',
    options: [
      'Program beasiswa terbukti menghapus pernikahan dini di seluruh Indonesia.',
      'Pernikahan dini terjadi karena kemiskinan yang tidak tertangani.',
      'Program beasiswa khusus perempuan di Provinsi X merupakan satu-satunya faktor penurunan pernikahan dini.',
      'Terdapat korelasi antara program beasiswa perempuan dan penurunan pernikahan dini yang layak dikaji lebih lanjut sebagai model kebijakan.',
      'Provinsi Y harus segera meniru program Provinsi X agar angka pernikahan dini turun.',
    ],
    correctAnswerIndex: 3,
    explanation:
      '**Apa yang bisa dan tidak bisa disimpulkan dari teks ini?**\n\n**Fakta teks:**\n- Provinsi X: ada program beasiswa → angka turun 18%\n- Provinsi Y: tidak ada program → angka naik 7%\n- Kondisi ekonomi dan budaya serupa (kontrol variabel)\n\n**Analisis pilihan:**\n- **A ❌:** Terlalu luas — data hanya dari dua provinsi, tidak bisa digeneralisasi "seluruh Indonesia". Juga kata "terbukti menghapus" terlalu absolut.\n- **B ❌:** Tidak ada informasi tentang kemiskinan sebagai faktor dalam teks.\n- **C ❌:** Teks tidak menyatakan program adalah **satu-satunya** faktor.\n- **D ✅:** Menggunakan kata "korelasi" (bukan kausalitas), "layak dikaji lebih lanjut" (tidak over-claim), dan "model kebijakan" (implikasi logis dari perbandingan). Paling terukur dan sesuai data.\n- **E ❌:** Memberikan rekomendasi kebijakan yang melampaui apa yang dibuktikan teks.\n\n> 💡 **Kunci simpulan implisit SNBT:** Hindari over-generalisasi (seluruh Indonesia), kausalitas langsung (terbukti menyebabkan), dan rekomendasi eksplisit yang tidak didukung data. Pilih yang paling "hati-hati" namun tetap substansial.',
  },

  {
    id: 'ppu-adv-4',
    category: 'Pengetahuan dan Pemahaman Umum',
    topic: 'Hubungan Antar Paragraf',
    difficulty: 'Susah',
    text: 'Bacalah dua paragraf berikut.\n\n**Paragraf 1:** Revolusi industri 4.0 membawa otomasi masif di berbagai sektor. Laporan World Economic Forum memperkirakan sekitar 85 juta pekerjaan akan tergantikan oleh mesin dan kecerdasan buatan pada tahun 2025.\n\n**Paragraf 2:** Di sisi lain, revolusi yang sama diproyeksikan menciptakan 97 juta pekerjaan baru yang membutuhkan keterampilan digital tinggi, seperti analis data, insinyur AI, dan spesialis keamanan siber.\n\nHubungan antara kedua paragraf tersebut adalah...',
    options: [
      'Paragraf 2 memperkuat argumen Paragraf 1.',
      'Paragraf 2 menyajikan dampak negatif yang lebih besar dari Paragraf 1.',
      'Paragraf 2 menyajikan sudut pandang berlawanan (kontras) terhadap Paragraf 1.',
      'Paragraf 2 merupakan contoh spesifik dari generalisasi di Paragraf 1.',
      'Paragraf 2 merupakan simpulan dari Paragraf 1.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Analisis hubungan:**\n- Paragraf 1: dampak **negatif** revolusi industri (pekerjaan hilang)\n- Paragraf 2: dimulai dengan "Di sisi lain" → sinyal kontras eksplisit → dampak **positif** (pekerjaan baru tercipta)\n\n**Hubungan:** Kontras/pertentangan. Keduanya membahas tema yang sama (revolusi industri 4.0 dan lapangan kerja) tetapi dari sisi yang berlawanan.\n\n**Evaluasi pilihan:**\n- **A ❌:** Paragraf 2 tidak memperkuat P1 — justru menyajikan sisi lain.\n- **B ❌:** Paragraf 2 membahas dampak positif, bukan negatif.\n- **C ✅:** Kata "Di sisi lain" adalah penanda kontras eksplisit. Dua sisi berlawanan dari fenomena yang sama.\n- **D ❌:** Paragraf 2 bukan contoh dari P1 — keduanya setara, bukan hierarkis.\n- **E ❌:** Paragraf 2 bukan simpulan — ia menghadirkan perspektif baru, bukan merangkum P1.\n\n> 💡 Frasa penanda hubungan antarparagraf: "Di sisi lain", "Namun", "Sebaliknya" → kontras. "Bahkan", "Selain itu", "Lebih lanjut" → penguatan.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KEMAMPUAN MEMAHAMI BACAAN DAN MENULIS (PBM) — LANJUTAN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'pbm-adv-1',
    category: 'Kemampuan Memahami Bacaan dan Menulis',
    topic: 'Kalimat Efektif',
    difficulty: 'Susah',
    text: 'Cermati kalimat berikut.\n\n*"Kepada para hadirin yang terhormat sekalian kami mengucapkan selamat datang dan terima kasih atas kehadiran dan partisipasi Bapak/Ibu semuanya."*\n\nKalimat tersebut tidak efektif karena mengandung beberapa kesalahan. Perbaikan yang **paling tepat** adalah...',
    options: [
      '"Kepada para hadirin, kami ucapkan terima kasih atas partisipasi semuanya."',
      '"Hadirin yang terhormat, kami mengucapkan selamat datang dan terima kasih atas kehadiran Bapak/Ibu."',
      '"Para hadirin yang terhormat, kami ucapkan selamat datang. Terima kasih atas partisipasi Bapak/Ibu."',
      '"Kepada Bapak/Ibu hadirin, kami mengucapkan selamat datang dan terima kasih atas kehadiran sekalian."',
      '"Kepada yang terhormat Bapak/Ibu hadirin sekalian, kami ucapkan terima kasih."',
    ],
    correctAnswerIndex: 1,
    explanation:
      '**Identifikasi kesalahan kalimat asli:**\n\n1. **"Para hadirin yang terhormat sekalian"** → pleonasme (pemborosan kata): "para" dan "sekalian" keduanya menyatakan jamak. Pilih salah satu: cukup "hadirin yang terhormat" (karena "hadirin" sudah jamak dari "hadir").\n2. **"kehadiran dan partisipasi"** → pengulangan makna jika konteksnya sama (hadir = berpartisipasi). Bisa disederhanakan.\n3. **"Bapak/Ibu semuanya"** → "semuanya" redundan dengan konteks formal.\n\n**Evaluasi pilihan:**\n- **A ❌:** Menghilangkan "selamat datang" — informasi penting dihapus.\n- **B ✅:** Menghapus "para...sekalian" (pleonasme diatasi dengan hanya pakai "Hadirin yang terhormat"), kalimat rapi dan formal.\n- **C:** Memisah menjadi dua kalimat — valid tapi kurang hemat untuk salam pembuka.\n- **D ❌:** "Bapak/Ibu hadirin" dan "sekalian" masih agak redundan.\n- **E ❌:** Struktur "kepada yang terhormat" tidak lazim dalam bahasa baku.\n\n> 💡 **Ciri kalimat efektif:** tidak ambigu, tidak pleonasme, tidak redundan, struktur S-P-O-K jelas.',
  },

  {
    id: 'pbm-adv-2',
    category: 'Kemampuan Memahami Bacaan dan Menulis',
    topic: 'Kalimat Efektif',
    difficulty: 'Susah',
    text: 'Kalimat manakah yang mengandung **ambiguitas** (kegandaan makna) struktural?\n',
    options: [
      '"Ibu memasak ikan di dapur."',
      '"Siswa yang rajin dan pintar mendapat beasiswa."',
      '"Polisi menembak pencuri dengan pistol miliknya."',
      '"Buku yang dipinjam Ani sudah dikembalikan."',
      '"Semua mahasiswa yang hadir mendapat sertifikat."',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Kalimat C: "Polisi menembak pencuri dengan pistol miliknya."**\n\nKalimat ini mengandung **ambiguitas struktural** karena frasa "dengan pistol miliknya" bisa merujuk kepada:\n1. **Interpretasi 1:** Polisi menembak pencuri *menggunakan* pistol milik **polisi** itu sendiri.\n2. **Interpretasi 2:** Polisi menembak pencuri yang *membawa/menggunakan* pistol milik **pencuri** itu sendiri.\n\nKata ganti "miliknya" memiliki anteseden yang tidak jelas (polisi atau pencuri?).\n\n**Mengapa pilihan lain tidak ambigu?**\n- **A:** Makna tunggal: Ibu memasak di dapur, objeknya ikan.\n- **B:** Bisa diartikan "rajin DAN pintar" atau "rajin, dan (yang) pintar" — ini memang potensi ambiguitas, tetapi lebih ke konjungsi, bukan struktural utama. Pilihan C lebih jelas ambigu.\n- **D:** Anteseden jelas (buku yang dipinjam Ani).\n- **E:** Makna tunggal.\n\n> 💡 **Ambiguitas struktural** terjadi ketika satu frasa bisa secara logis melekat pada dua bagian kalimat yang berbeda. Perbaikan: "Polisi menembak pencuri bersenjata itu" atau "Polisi menembak pencuri menggunakan pistol dinasnya."',
  },

  {
    id: 'pbm-adv-3',
    category: 'Kemampuan Memahami Bacaan dan Menulis',
    topic: 'Kepaduan Paragraf',
    difficulty: 'Susah',
    text: 'Cermati paragraf berikut!\n\n*(1) Konsumsi sayuran dan buah-buahan segar sangat penting untuk menjaga kesehatan tubuh secara optimal. (2) Berbagai penelitian membuktikan bahwa asupan serat dari sayuran dapat menurunkan risiko penyakit jantung koroner. (3) Kandungan vitamin C dalam buah-buahan juga berperan meningkatkan sistem imun tubuh. (4) Olahraga aerobik secara rutin terbukti efektif meningkatkan kapasitas paru-paru dan memperkuat otot jantung. (5) Oleh karena itu, biasakan mengonsumsi sayuran dan buah minimal lima porsi setiap hari untuk hidup lebih sehat.*\n\nKalimat yang **merusak kepaduan** paragraf tersebut adalah kalimat nomor...',
    options: ['(1)', '(2)', '(3)', '(4)', '(5)'],
    correctAnswerIndex: 3,
    explanation:
      '**Analisis kepaduan paragraf:**\n\n- Kalimat (1): **Kalimat utama** — tentang pentingnya konsumsi sayur dan buah.\n- Kalimat (2): **Pendukung** — manfaat sayuran (serat → jantung). ✅\n- Kalimat (3): **Pendukung** — manfaat buah (vitamin C → imun). ✅\n- Kalimat (4): **Tidak padu ❌** — membahas olahraga aerobik, bukan sayuran/buah. Topiknya berbeda dengan ide pokok paragraf.\n- Kalimat (5): **Simpulan** — kembali ke topik sayur dan buah. ✅\n\nKalimat (4) bukan hanya tidak relevan — ia juga memutus alur logis dari kalimat (3) ke kalimat (5).\n\n**Kalimat nomor (4) merusak kepaduan → D ✅**\n\n> 💡 **Cara cepat cek kepaduan:** Baca kalimat simpulan (5), lalu lacak mundur kalimat mana yang tidak mendukung simpulan tersebut. Kalimat (5) simpulkan tentang sayur dan buah — kalimat (4) tentang olahraga = tidak nyambung.',
  },

  {
    id: 'pbm-adv-4',
    category: 'Kemampuan Memahami Bacaan dan Menulis',
    topic: 'Konjungsi',
    difficulty: 'Susah',
    text: 'Cermati kalimat-kalimat berikut!\n\n*"Proyek tersebut membutuhkan dana yang sangat besar. ________ pemerintah tetap menyetujuinya karena dinilai strategis bagi kepentingan nasional."*\n\nKonjungsi antarkalimat yang **paling tepat** untuk mengisi bagian rumpang tersebut adalah...',
    options: [
      'Oleh karena itu,',
      'Namun demikian,',
      'Dengan demikian,',
      'Selain itu,',
      'Bahkan,',
    ],
    correctAnswerIndex: 1,
    explanation:
      '**Analisis hubungan logis antar kalimat:**\n- Kalimat 1: dana sangat besar (hambatan/fakta negatif)\n- Kalimat 2: pemerintah menyetujui (tindakan yang **berlawanan** dengan hambatan)\n\n**Hubungan:** Pertentangan/kontras (meskipun ada hambatan, tetap dilakukan).\n\n**Evaluasi pilihan:**\n- **A "Oleh karena itu":** Menandakan sebab-akibat — penyetujuan bukan *akibat* dari dana besar. ❌\n- **B "Namun demikian" ✅:** Konjungsi pertentangan yang tepat — meski ada hambatan (dana besar), keputusan berlawanan tetap diambil.\n- **C "Dengan demikian":** Menandakan simpulan/konsekuensi logis — tidak tepat untuk kontras. ❌\n- **D "Selain itu":** Menambahkan informasi sejenis — tidak menandakan kontras. ❌\n- **E "Bahkan":** Menandakan penegasan/penguatan — kurang tepat untuk kontras ini. ❌\n\n> 💡 **Konjungsi pertentangan:** namun, namun demikian, akan tetapi, meskipun demikian, sebaliknya. **Konjungsi sebab-akibat:** oleh karena itu, dengan demikian, akibatnya, hasilnya.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LITERASI DALAM BAHASA INDONESIA (LBI) — BACAAN PANJANG
  // ─────────────────────────────────────────────────────────────────────────
  // Teks A (untuk soal lbi-adv-1, lbi-adv-2, lbi-adv-3)
  // Topik: Digitalisasi UMKM — ~320 kata
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'lbi-adv-1',
    category: 'Literasi dalam Bahasa Indonesia',
    topic: 'Analisis Argumen Penulis',
    difficulty: 'Susah',
    text: 'Bacalah teks berikut dengan cermat, lalu jawab pertanyaan!\n\n---\n\nPerkembangan pesat teknologi digital telah membuka cakrawala baru bagi Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia. Kehadiran platform e-commerce, dompet digital, dan media sosial telah mengubah cara pelaku UMKM menjangkau konsumen. Jika sebelumnya keterbatasan modal menjadi penghalang utama untuk memperluas jangkauan pasar, kini dengan biaya minimal pun seorang wirausahawan dapat memasarkan produknya hingga ke luar daerah, bahkan ke mancanegara.\n\nNamun, euforia digitalisasi ini perlu disikapi secara kritis. Data menunjukkan bahwa baru sekitar 22 persen dari total UMKM yang telah benar-benar terintegrasi dengan ekosistem digital secara optimal. Artinya, sebagian besar masih terjebak dalam digitalisasi setengah-setengah: memiliki akun media sosial, tetapi tidak memahami cara mengoptimalkannya untuk menghasilkan konversi penjualan.\n\nPersoalan ini bukan sekadar masalah teknis, melainkan menyentuh akar yang lebih dalam: kesenjangan literasi digital. Banyak pelaku UMKM, terutama di daerah non-metropolitan, yang belum memiliki kemampuan memadai untuk mengelola data pelanggan, membaca tren pasar secara digital, atau bahkan menyusun konten yang menarik secara konsisten. Tanpa pemahaman mendalam tentang algoritma platform dan perilaku konsumen digital, kehadiran online sebuah UMKM hanya menjadi sebuah formalitas tanpa dampak nyata terhadap omzet.\n\nOleh sebab itu, program pelatihan digital yang lebih terstruktur dan berkelanjutan — bukan sekadar workshop satu hari — menjadi kebutuhan yang mendesak. Pemerintah perlu beraliansi dengan lembaga pendidikan, pelaku industri teknologi, dan komunitas lokal untuk merancang ekosistem pendampingan yang inklusif. Hanya dengan cara demikian, digitalisasi tidak akan menjadi privilege kelompok tertentu, melainkan benar-benar menjadi jembatan bagi seluruh lapisan pelaku UMKM untuk tumbuh secara berkeadilan.\n\n---\n\nArgumen **utama** yang dikembangkan penulis dalam teks tersebut adalah...',
    options: [
      'Platform e-commerce telah berhasil membantu UMKM memperluas pasar ke mancanegara.',
      'Hanya 22 persen UMKM yang telah terintegrasi penuh dengan ekosistem digital.',
      'Digitalisasi UMKM belum optimal akibat kesenjangan literasi digital, dan dibutuhkan pendampingan terstruktur agar manfaatnya merata.',
      'Pemerintah harus segera membentuk kementerian khusus digitalisasi UMKM.',
      'Media sosial adalah alat pemasaran paling efektif bagi pelaku UMKM saat ini.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Identifikasi struktur argumentasi teks:**\n\n- **Paragraf 1:** Memaparkan peluang (digitalisasi membuka pasar) — *pembuka/konteks*\n- **Paragraf 2:** Mengkritisi realita (hanya 22% optimal) — *masalah*\n- **Paragraf 3:** Mendalami akar masalah (kesenjangan literasi digital) — *analisis*\n- **Paragraf 4:** Menawarkan solusi (pelatihan terstruktur + kolaborasi) — *solusi/simpulan*\n\nStruktur ini menunjukkan pola **problem-solution argument**: peluang ada, tapi masalah menghambat, dan solusi diperlukan.\n\n**Argumen utama** mencakup keseluruhan pola ini → **C ✅**\n\n**Mengapa pilihan lain salah?**\n- **A:** Hanya fakta dari paragraf 1 — terlalu parsial dan optimis.\n- **B:** Hanya satu data statistik dari paragraf 2 — bukan argumen utama.\n- **D:** Tidak disebutkan dalam teks — over-interpretasi.\n- **E:** Teks tidak menyimpulkan ini sebagai argumen — bahkan mengkritisi penggunaan media sosial yang tidak optimal.\n\n> 💡 **Argumen utama** = posisi penulis + arah solusi. Bukan fakta, bukan statistik individual, tapi klaim yang dibangun sepanjang teks.',
  },

  {
    id: 'lbi-adv-2',
    category: 'Literasi dalam Bahasa Indonesia',
    topic: 'Sikap Penulis',
    difficulty: 'Susah',
    text: 'Bacalah kembali teks tentang digitalisasi UMKM pada soal sebelumnya, lalu jawab pertanyaan berikut.\n\n---\n\nPerkembangan pesat teknologi digital telah membuka cakrawala baru bagi UMKM di Indonesia... (teks sama seperti soal lbi-adv-1)\n\n---\n\nSikap/nada penulis terhadap perkembangan digitalisasi UMKM dalam teks tersebut adalah...',
    options: [
      'Antusias dan optimis penuh terhadap potensi digitalisasi.',
      'Pesimis dan skeptis — menganggap digitalisasi tidak akan berhasil.',
      'Kritis-konstruktif: mengakui peluang digitalisasi sambil menyoroti kesenjangan yang perlu diatasi.',
      'Netral murni — hanya memaparkan data tanpa posisi.',
      'Defensif terhadap pemerintah yang dianggap lamban dalam digitalisasi.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Analisis nada/sikap penulis:**\n\n**Bukti optimisme/pengakuan peluang:**\n- "membuka cakrawala baru"\n- "dengan biaya minimal pun seorang wirausahawan dapat memasarkan produknya hingga ke mancanegara"\n\n**Bukti sikap kritis:**\n- "euforia digitalisasi ini perlu disikapi secara kritis"\n- "terjebak dalam digitalisasi setengah-setengah"\n- "hanya menjadi sebuah formalitas"\n\n**Bukti sikap konstruktif (menawarkan solusi):**\n- "program pelatihan digital yang lebih terstruktur dan berkelanjutan"\n- "benar-benar menjadi jembatan bagi seluruh lapisan"\n\n**Kesimpulan nada:** Bukan optimis penuh (ada kritik), bukan pesimis (ada solusi dan pengakuan peluang), bukan netral (punya posisi yang jelas). → **Kritis-konstruktif → C ✅**\n\n> 💡 **Cara baca nada penulis:** Perhatikan diksi emosional ("euforia", "terjebak", "formalitas"), kata-kata imperatif ("perlu", "harus"), dan cara penulis menutup teks (solusi = konstruktif).',
  },

  {
    id: 'lbi-adv-3',
    category: 'Literasi dalam Bahasa Indonesia',
    topic: 'Inferensi',
    difficulty: 'Susah',
    text: 'Bacalah kembali teks tentang digitalisasi UMKM, lalu jawab pertanyaan berikut.\n\n---\n\nPerkembangan pesat teknologi digital telah membuka cakrawala baru bagi UMKM di Indonesia... (teks sama seperti soal lbi-adv-1)\n\n---\n\nBerdasarkan pernyataan penulis bahwa *"digitalisasi tidak akan menjadi privilege kelompok tertentu"*, dapat disimpulkan secara tersirat bahwa...',
    options: [
      'Saat ini, hanya kelompok kaya yang bisa mengakses platform digital.',
      'Penulis percaya digitalisasi sudah merata di seluruh Indonesia.',
      'Dalam kondisi saat ini, digitalisasi cenderung lebih banyak dinikmati oleh kelompok UMKM yang sudah memiliki kapasitas dan akses lebih baik.',
      'Pemerintah secara sengaja membatasi akses digital bagi UMKM kecil.',
      'Digitalisasi hanya menguntungkan perusahaan teknologi besar.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Analisis kalimat kunci:**\n\n*"Hanya dengan cara demikian, digitalisasi tidak akan menjadi privilege kelompok tertentu..."*\n\nKata "hanya dengan cara demikian... **tidak akan**" menggunakan pola **kondisional negatif**: jika solusi tidak dilakukan, maka kondisi saat ini (digitalisasi sebagai privilege) akan terus berlangsung.\n\n**Implikasi tersirat:** Saat ini, tanpa intervensi yang disebutkan, digitalisasi **memang cenderung** hanya dinikmati kelompok tertentu yang sudah punya kapasitas lebih.\n\n**Evaluasi pilihan:**\n- **A ❌:** Terlalu sempit dan harafiah — "kelompok kaya" bukan terminologi yang digunakan.\n- **B ❌:** Bertentangan dengan isi teks yang menyatakan kesenjangan masih ada.\n- **C ✅:** Inferensi terukur — "cenderung lebih banyak dinikmati oleh yang sudah punya kapasitas lebih". Ini masuk akal dan sejalan dengan konteks teks keseluruhan.\n- **D ❌:** Tidak ada indikasi intensi jahat pemerintah dalam teks.\n- **E ❌:** Di luar cakupan teks.\n\n> 💡 **Inferensi dalam** = simpulkan apa yang *tersirat* dari struktur kalimat dan konteks, bukan yang *tersurat*. Kata seperti "hanya jika", "agar tidak", "baru bisa" menyiratkan kondisi sebaliknya yang sedang terjadi.',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Teks B1 & B2 (untuk soal lbi-adv-4, lbi-adv-5)
  // Topik: Pariwisata Berkelanjutan — Dua Perspektif Berbeda
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'lbi-adv-4',
    category: 'Literasi dalam Bahasa Indonesia',
    topic: 'Perbandingan Teks',
    difficulty: 'Susah',
    text: 'Bacalah dua teks berikut!\n\n**Teks 1:**\nPariwisata berkelanjutan (*sustainable tourism*) menawarkan model baru yang menyeimbangkan pertumbuhan ekonomi dengan pelestarian lingkungan. Destinasi wisata yang menerapkan prinsip ini terbukti mampu menarik wisatawan berkualitas dengan pengeluaran lebih tinggi namun dampak kerusakan lingkungan yang jauh lebih kecil. Komunitas lokal pun lebih berdaya karena keuntungan pariwisata tidak hanya mengalir ke investor luar, melainkan dinikmati langsung oleh warga setempat. Dengan pendekatan ini, pariwisata dapat menjadi lokomotif pembangunan yang inklusif dan berkelanjutan.\n\n**Teks 2:**\nKonsep pariwisata berkelanjutan, meski menarik secara retoris, sering kali menjadi tameng bagi korporasi besar untuk membungkus praktik eksploitasi dengan label ramah lingkungan — sebuah fenomena yang dikenal sebagai *greenwashing*. Di lapangan, banyak proyek pariwisata yang mengklaim dirinya "berkelanjutan" tetapi tetap mengusir komunitas adat dari tanah leluhur mereka, mengkonsumsi sumber daya air secara berlebihan, dan hanya mempekerjakan masyarakat lokal pada posisi upah rendah. Selama regulasi dan mekanisme pengawasan masih lemah, label "berkelanjutan" tidak lebih dari sekadar alat pemasaran.\n\n---\n\nPersamaan yang **terdapat dalam kedua teks** tersebut adalah...',
    options: [
      'Kedua teks menyimpulkan bahwa pariwisata berkelanjutan adalah solusi terbaik.',
      'Kedua teks membahas komunitas lokal sebagai salah satu komponen yang relevan dalam pariwisata berkelanjutan.',
      'Kedua teks mengkritik investor luar yang merusak lingkungan.',
      'Kedua teks menggunakan data statistik untuk mendukung argumen.',
      'Kedua teks bersikap skeptis terhadap klaim pariwisata berkelanjutan.',
    ],
    correctAnswerIndex: 1,
    explanation:
      '**Identifikasi elemen bersama kedua teks:**\n\n**Teks 1** menyebut komunitas lokal:\n- "Komunitas lokal pun lebih berdaya"\n- "keuntungan pariwisata... dinikmati langsung oleh warga setempat"\n\n**Teks 2** menyebut komunitas lokal:\n- "mengusir komunitas adat dari tanah leluhur mereka"\n- "hanya mempekerjakan masyarakat lokal pada posisi upah rendah"\n\nKeduanya membahas komunitas lokal, meski dari sudut pandang berbeda (T1: berdaya; T2: dirugikan). → **B ✅**\n\n**Mengapa pilihan lain salah?**\n- **A ❌:** Hanya Teks 1 yang menyimpulkan positif; Teks 2 bersikap kritis.\n- **C ❌:** Hanya Teks 2 yang mengkritik — Teks 1 lebih optimis.\n- **D ❌:** Tidak ada data statistik eksplisit di kedua teks.\n- **E ❌:** Teks 1 tidak skeptis — justru mendukung konsep ini.\n\n> 💡 **Soal perbandingan 2 teks:** Cari elemen yang hadir di **kedua** teks. Bedakan antara topik yang sama vs. posisi/sikap yang sama — keduanya bisa berbeda.',
  },

  {
    id: 'lbi-adv-5',
    category: 'Literasi dalam Bahasa Indonesia',
    topic: 'Evaluasi Teks',
    difficulty: 'Susah',
    text: 'Bacalah kembali Teks 1 dan Teks 2 tentang pariwisata berkelanjutan pada soal sebelumnya, lalu jawab pertanyaan ini.\n\n---\n\n*(Teks 1 dan Teks 2 sama seperti soal lbi-adv-4)*\n\n---\n\nPerbedaan **paling mendasar** dalam cara kedua penulis membangun argumen mereka adalah...',
    options: [
      'Teks 1 menggunakan data kuantitatif, sementara Teks 2 menggunakan data kualitatif.',
      'Teks 1 membahas manfaat ekonomi, sementara Teks 2 hanya membahas dampak lingkungan.',
      'Teks 1 memandang pariwisata berkelanjutan dari perspektif potensi idealnya, sedangkan Teks 2 mengkritisi kesenjangan antara klaim dan implementasi nyata di lapangan.',
      'Teks 1 ditulis dari sudut pandang investor, sementara Teks 2 dari sudut pandang komunitas adat.',
      'Teks 1 menggunakan pendekatan ilmiah, sementara Teks 2 menggunakan pendekatan anekdotal.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Analisis pendekatan argumentasi masing-masing teks:**\n\n**Teks 1 — Perspektif "idealitas":**\n- Membahas bagaimana pariwisata berkelanjutan **seharusnya** bekerja\n- Menggunakan kata-kata prospektif: "menawarkan model baru", "terbukti mampu", "dapat menjadi"\n- Fokus pada **potensi dan harapan**\n\n**Teks 2 — Perspektif "realita lapangan":**\n- Membahas apa yang **sebenarnya terjadi** — greenwashing, pengusiran komunitas adat, upah rendah\n- Menggunakan kata-kata deskriptif realita: "Di lapangan", "banyak proyek... tetap mengusir"\n- Fokus pada **gap antara klaim dan kenyataan**\n\n**Perbedaan mendasar → C ✅**\n\n**Mengapa pilihan lain salah?**\n- **A ❌:** Kedua teks tidak menggunakan data kuantitatif yang jelas.\n- **B ❌:** Teks 2 membahas lebih dari sekadar lingkungan (juga ekonomi, hak tanah).\n- **D ❌:** Tidak ada indikasi sudut pandang spesifik dari investor vs. komunitas adat.\n- **E ❌:** Tidak ada pendekatan ilmiah formal di Teks 1, dan Teks 2 juga bukan sekadar anekdot.\n\n> 💡 **Membandingkan cara berargumen:** Perhatikan dari mana penulis memulai (ideal vs. realita), kata-kata yang dipilih (potensi vs. kenyataan), dan apa yang dijadikan bukti.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LITERASI DALAM BAHASA INGGRIS (LBE) — ADVANCED
  // ─────────────────────────────────────────────────────────────────────────
  // Long Passage: Microplastics (~320 words)
  // Used for soal lbe-adv-1, lbe-adv-2, lbe-adv-3
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'lbe-adv-1',
    category: 'Literasi dalam Bahasa Inggris',
    topic: 'Main Idea',
    difficulty: 'Susah',
    text: 'Read the following passage carefully, then answer the question.\n\n---\n\nMicroplastics — plastic fragments smaller than five millimeters — have infiltrated virtually every corner of the planet. From the deepest ocean trenches to the peaks of remote mountain ranges, these particles have been detected in alarming concentrations. More recently, scientists have confirmed their presence inside the human body: in blood, lung tissue, and even the placenta of newborn infants.\n\nThe sources of microplastics are pervasive and often invisible. Synthetic fabrics shed thousands of microfibers with each washing cycle. Car tyres release particles as they wear against road surfaces. Single-use plastics fragment over decades of exposure to sunlight and mechanical abrasion. Even the air we breathe carries microplastic particles, transported thousands of miles by wind currents.\n\nThe health implications remain an active area of scientific debate, though preliminary evidence is unsettling. Laboratory studies have shown that microplastics can trigger inflammatory responses in human cells and carry toxic chemical additives — such as phthalates and bisphenol A — that are known to disrupt the endocrine system. However, establishing definitive causal links between microplastic exposure and specific human diseases remains methodologically challenging, partly because the entire human population is now exposed, making control groups nearly impossible to construct.\n\nPolicy responses have been fragmented and largely insufficient. A handful of countries have banned microbeads in cosmetics, a comparatively minor source, while the dominant contributors — fast fashion, automotive industries, and single-use packaging — continue largely unregulated. Critics argue that without binding international agreements enforced through trade mechanisms, voluntary corporate pledges amount to little more than greenwashing.\n\nScientists increasingly warn that the window for meaningful intervention is narrowing. Microplastics do not biodegrade — they only fragment into smaller nanoplastics. The question is no longer whether we are contaminated, but how we will manage the consequences.\n\n---\n\nWhat is the **central argument** of this passage?',
    options: [
      'Microplastics are primarily found in ocean environments and seafood.',
      'The fashion industry is the single largest source of microplastic pollution.',
      'Microplastic contamination is ubiquitous and poses serious risks, yet policy responses remain inadequate to address its scale.',
      'Scientists have conclusively proven that microplastics cause cancer and endocrine disorders.',
      'Banning single-use plastics would effectively solve the microplastics crisis.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Structural analysis of the passage:**\n- Para 1: Ubiquity of microplastics (everywhere, including human body)\n- Para 2: Pervasive sources\n- Para 3: Health concerns — preliminary but unsettling\n- Para 4: **Fragmented, insufficient policy responses**\n- Para 5: Urgency — window narrowing, irreversibility\n\nThe passage consistently balances **scope of contamination + health risk** with a critique of **inadequate policy action**. The closing paragraph reinforces urgency.\n\n**Option C** captures all three pillars: ubiquity, risk, and policy gap. ✅\n\n**Why others fail:**\n- **A:** Contradicted by Para 1 ("mountain ranges, human body") — not just oceans.\n- **B:** Para 4 explicitly states "comparatively minor source" for cosmetics/microbeads.\n- **D:** Para 3 says "preliminary evidence" and "establishing definitive causal links... remains challenging" — not conclusive.\n- **E:** Not argued in the text — presented as insufficient alone.\n\n> 💡 **Central argument** ≠ one paragraph\'s point. Look for the claim that all paragraphs collectively support.',
  },

  {
    id: 'lbe-adv-2',
    category: 'Literasi dalam Bahasa Inggris',
    topic: 'Implied Information',
    difficulty: 'Susah',
    text: 'Re-read the microplastics passage from the previous question, then answer:\n\n---\n\n*(Same passage as lbe-adv-1)*\n\n---\n\nThe author states that establishing definitive causal links between microplastic exposure and human disease is difficult because *"the entire human population is now exposed, making control groups nearly impossible to construct."*\n\nWhat does this statement **most strongly imply**?',
    options: [
      'Researchers lack sufficient funding to conduct large-scale studies on microplastics.',
      'Microplastics are harmless because no direct link to disease has been found.',
      'Standard scientific methodology for proving causation requires unexposed populations, which no longer exist for microplastics.',
      'The health effects of microplastics are only relevant to people in industrialized nations.',
      'Scientists are deliberately avoiding microplastic research due to pressure from the plastics industry.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Decode the implication:**\n\nThe statement connects two ideas:\n1. "Establishing definitive causal links... remains methodologically challenging"\n2. "because the entire human population is now exposed, making control groups nearly impossible"\n\nIn experimental and epidemiological science, **proving causation** requires a control group — people not exposed to the variable being studied. If *everyone* is exposed to microplastics, there is no unexposed control group to compare against.\n\n**The implied logic:** The scientific challenge is not lack of data or funding — it is a **fundamental methodological problem**: standard causal inference requires a baseline that no longer exists.\n\n**Option C** captures this precisely. ✅\n\n**Why others fail:**\n- **A:** Funding is not mentioned or implied.\n- **B:** The opposite is implied — the *difficulty* of proving harm does not mean there is no harm. Para 3 says evidence is "unsettling".\n- **D:** "Entire human population" = global, not industrialized-nation-specific.\n- **E:** Conspiracy theory — not implied anywhere in the passage.\n\n> 💡 **Inference questions:** The answer must follow *necessarily* from the text — it should not require external assumptions. Test each option: does the text *logically lead* to this conclusion?',
  },

  {
    id: 'lbe-adv-3',
    category: 'Literasi dalam Bahasa Inggris',
    topic: "Author's Attitude/Tone",
    difficulty: 'Susah',
    text: 'Re-read the microplastics passage from lbe-adv-1, then answer:\n\n---\n\n*(Same passage as lbe-adv-1)*\n\n---\n\nThe author\'s tone toward the **policy responses** described in the passage is best characterized as...',
    options: [
      'Optimistic — noting that several countries have already taken meaningful action.',
      'Indifferent — presenting policy actions without evaluative commentary.',
      'Critical — suggesting that current measures are superficial and fall far short of what is needed.',
      'Sympathetic — acknowledging the political difficulties that policymakers face.',
      'Alarmist — claiming that all political solutions have failed completely.',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Evidence from Para 4 (policy paragraph):**\n\n- *"fragmented and largely insufficient"* → explicit negative evaluation\n- *"comparatively minor source"* → dismissing the scope of bans on microbeads\n- *"dominant contributors... continue largely unregulated"* → highlighting the gap\n- *"voluntary corporate pledges amount to little more than greenwashing"* → sharp criticism via critics\' voice\n\n**The author adopts a critical stance**, presenting current policies as cosmetic measures that address minor sources while leaving major ones untouched.\n\n**Option C ✅** — "superficial and fall far short" matches "fragmented, largely insufficient" and "comparatively minor source".\n\n**Why others fail:**\n- **A:** Optimism is absent — "a handful of countries" banning microbeads is framed as insufficient.\n- **B:** The author clearly evaluates — "largely insufficient" is evaluative language.\n- **D:** No sympathy for policymakers is expressed.\n- **E:** "Alarmist" implies exaggeration without basis — the author uses measured, evidence-based criticism, not catastrophism. Also, "all political solutions" is too absolute.\n\n> 💡 When identifying author tone toward a specific issue, focus on **evaluative adjectives and adverbs** ("fragmented", "largely insufficient", "comparatively minor") and **whose voices are amplified** (critics of greenwashing).',
  },

  {
    id: 'lbe-adv-4',
    category: 'Literasi dalam Bahasa Inggris',
    topic: 'Grammar in Context',
    difficulty: 'Susah',
    text: 'Choose the option that **correctly completes** the sentence while maintaining grammatical accuracy and logical coherence.\n\n*"The committee announced that the project, ________ had been under review for three years, would finally receive full government funding."*',
    options: [
      'who',
      'which',
      'that',
      'it',
      'what',
    ],
    correctAnswerIndex: 1,
    explanation:
      '**Analysis of the grammatical structure:**\n\nThe blank introduces a **relative clause** that modifies "the project" (a non-human noun).\n\n**Relative pronoun rules:**\n- **"who"** → refers to people only ❌\n- **"which"** → refers to things/objects; used in **non-restrictive relative clauses** (set off by commas) ✅\n- **"that"** → also refers to things, but is used in **restrictive relative clauses** (no commas). Since the clause here is flanked by commas (*", had been under review...,*"), it is **non-restrictive** — "that" cannot be used. ❌\n- **"it"** → pronoun, not a relative connector — creates a run-on sentence ❌\n- **"what"** → introduces a noun clause, not a relative clause modifying a noun ❌\n\n**"which" → B ✅**\n\n> 💡 **Key rule:** Non-restrictive relative clauses (with commas) use **"which"** for things — never "that". Restrictive relative clauses (no commas) can use either "which" or "that" for things. This distinction is frequently tested in SNBT LBE.',
  },

  {
    id: 'lbe-adv-5',
    category: 'Literasi dalam Bahasa Inggris',
    topic: 'Cloze Test',
    difficulty: 'Susah',
    text: 'Read the passage and choose the word or phrase that **best fills** the blank.\n\n---\n\nUrban green spaces — parks, community gardens, and tree-lined streets — play a role in city life that extends far beyond aesthetics. Research consistently shows that access to greenery is ________ to mental well-being: residents living near parks report lower levels of anxiety and depression, and even brief exposure to natural environments can measurably reduce cortisol levels.\n\nYet as cities continue to grow outward and upward, green spaces are ________ to development pressures. In many rapidly urbanizing regions, public parks are rezoned for commercial or residential construction, a trend that disproportionately affects low-income neighborhoods where land is cheaper and political opposition weaker.\n\n---\n\nChoose the pair of words that **best completes** both blanks in sequence.',
    options: [
      'irrelevant / resistant',
      'detrimental / immune',
      'integral / vulnerable',
      'marginal / exposed',
      'central / resilient',
    ],
    correctAnswerIndex: 2,
    explanation:
      '**Blank 1 — "access to greenery is ________ to mental well-being":**\n\nContext: Research shows positive effects → we need a word meaning "essential/important/connected to". The sentence is a positive causal claim.\n- "irrelevant" ❌ — opposite meaning\n- "detrimental" ❌ — harmful, opposite\n- **"integral"** ✅ — essential, fundamentally connected\n- "marginal" ❌ — minor/peripheral, weak claim inconsistent with "consistently shows"\n- "central" → possible, but see Blank 2\n\n**Blank 2 — "green spaces are ________ to development pressures":**\n\nContext: Cities grow, parks are rezoned, trend is negative → green spaces are at risk, threatened.\n- "resistant" ❌ — opposite of threatened\n- "immune" ❌ — same, plus pairs with "detrimental" which failed Blank 1\n- **"vulnerable"** ✅ — susceptible to threat/pressure ← matches "development pressures" perfectly\n- "exposed" → plausible but "exposed to" is weaker than "vulnerable to" in this context\n- "resilient" ❌ — means able to bounce back, contradicts the negative trend described\n\n**Best pair: integral / vulnerable → C ✅**\n\n> 💡 **Cloze test strategy:** Read the full paragraph first. For each blank, identify the **direction of meaning** (positive/negative/neutral) and look for **collocations** — words that naturally pair together in English (e.g., "vulnerable to pressure", "integral to well-being").',
  },
];