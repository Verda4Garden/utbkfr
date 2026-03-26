import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronLeft, ChevronRight, RotateCcw, Check, X, Sparkles } from 'lucide-react';

const FLASHCARDS = [
  { id: 1, category: 'Biologi', question: 'Apa fungsi utama dari Mitokondria dalam sel?', answer: 'Sebagai tempat respirasi seluler dan penghasil energi (ATP). Mitokondria memiliki membran ganda dan DNA sendiri.' },
  { id: 2, category: 'Kimia', question: 'Apa bunyi Hukum Kekekalan Massa (Hukum Lavoisier)?', answer: 'Massa zat sebelum reaksi sama dengan massa zat sesudah reaksi dalam sistem tertutup. Tidak ada massa yang hilang atau bertambah.' },
  { id: 3, category: 'Biologi', question: 'Apa perbedaan utama antara sel prokariotik dan eukariotik?', answer: 'Sel eukariotik memiliki membran inti (nukleus) dan organel bermembran, sedangkan prokariotik tidak memiliki nukleus sejati.' },
  { id: 4, category: 'Kimia', question: 'Berapa jumlah elektron maksimal pada kulit L?', answer: '8 elektron. Berdasarkan rumus 2n^2, dimana n=2 untuk kulit L, maka 2(2^2) = 8.' },
  { id: 5, category: 'Biologi', question: 'Apa yang dimaksud dengan pembelahan Meiosis?', answer: 'Pembelahan sel yang menghasilkan 4 sel anakan dengan jumlah kromosom setengah dari induknya (haploid). Terjadi pada sel kelamin.' },
  { id: 6, category: 'Biologi', question: 'Hormon apa yang berfungsi menurunkan kadar gula darah?', answer: 'Insulin, yang dihasilkan oleh sel beta di pulau Langerhans pankreas.' },
  { id: 7, category: 'Kimia', question: 'Apa yang dimaksud dengan Reaksi Eksoterm?', answer: 'Reaksi kimia yang melepaskan kalor dari sistem ke lingkungan, ditandai dengan kenaikan suhu lingkungan dan entalpi negatif (ΔH < 0).' },
  { id: 8, category: 'Biologi', question: 'Apa itu Enzim dan bagaimana cara kerjanya?', answer: 'Enzim adalah biokatalisator yang mempercepat reaksi dengan menurunkan energi aktivasi. Bekerja secara spesifik (Lock and Key atau Induced Fit).' },
  { id: 9, category: 'Kimia', question: 'Apa itu Larutan Penyangga (Buffer)?', answer: 'Larutan yang dapat mempertahankan pH-nya meskipun ditambahkan sedikit asam, basa, atau diencerkan. Terdiri dari asam lemah & basa konjugasinya atau sebaliknya.' },
  { id: 10, category: 'Biologi', question: 'Apa fungsi dari Ribosom?', answer: 'Tempat terjadinya sintesis protein. Ribosom dapat ditemukan bebas di sitoplasma atau menempel pada Retikulum Endoplasma Kasar.' },
  { id: 11, category: 'Kimia', question: 'Apa itu Ikatan Kovalen?', answer: 'Ikatan kimia yang terbentuk karena penggunaan bersama pasangan elektron oleh dua atom non-logam untuk mencapai kestabilan.' },
  { id: 12, category: 'Biologi', question: 'Apa itu Fotolisis dalam Fotosintesis?', answer: 'Proses pemecahan molekul air (H2O) oleh cahaya matahari menjadi elektron, proton, dan oksigen. Terjadi pada Reaksi Terang di Tilakoid.' },
];

export default function Flashcards() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % FLASHCARDS.length);
    }, 100);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    }, 100);
  };

  const currentCard = FLASHCARDS[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white flex items-center gap-3">
            Flashcards <Brain className="text-[#5A5A40] dark:text-[#8B8B6B]" size={28} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-serif italic mt-1">Master difficult concepts with active recall.</p>
        </div>
        <div className="bg-white dark:bg-[#151619] px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <span className="text-sm font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{currentIdx + 1} / {FLASHCARDS.length}</span>
        </div>
      </div>

      <div className="relative h-[400px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            className="w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative preserve-3d transition-transform duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#151619] rounded-[40px] p-12 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center space-y-6">
                <span className="bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {currentCard.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white leading-relaxed">
                  {currentCard.question}
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest font-bold animate-pulse">
                  Click to reveal answer
                </p>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-[#5A5A40] rounded-[40px] p-12 shadow-xl flex flex-col items-center justify-center text-center space-y-6 rotate-y-180"
              >
                <Sparkles className="text-white/30" size={40} />
                <p className="text-xl md:text-2xl font-serif font-medium text-white leading-relaxed">
                  {currentCard.answer}
                </p>
                <div className="flex gap-4 mt-8">
                  <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white">
                    <X size={20} />
                  </button>
                  <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white">
                    <Check size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={handlePrev}
          className="p-4 bg-white dark:bg-[#151619] text-[#1a1a1a] dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B] px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <RotateCcw size={20} />
          Flip Card
        </button>
        <button 
          onClick={handleNext}
          className="p-4 bg-white dark:bg-[#151619] text-[#1a1a1a] dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white dark:bg-[#151619] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
            <Check size={20} />
          </div>
          <h4 className="font-bold dark:text-white">Mastered</h4>
          <p className="text-2xl font-bold text-green-500">12</p>
        </div>
        <div className="bg-white dark:bg-[#151619] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center mb-4">
            <RotateCcw size={20} />
          </div>
          <h4 className="font-bold dark:text-white">Learning</h4>
          <p className="text-2xl font-bold text-yellow-500">8</p>
        </div>
        <div className="bg-white dark:bg-[#151619] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4">
            <X size={20} />
          </div>
          <h4 className="font-bold dark:text-white">To Review</h4>
          <p className="text-2xl font-bold text-red-500">4</p>
        </div>
      </div>
    </div>
  );
}
