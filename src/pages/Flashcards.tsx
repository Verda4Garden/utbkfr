import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ChevronLeft, ChevronRight, RotateCcw, Check, X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { calculateSM2 } from '../lib/sm2';

const INITIAL_FLASHCARDS = [
  { category: 'Biologi', question: 'Apa fungsi utama dari Mitokondria dalam sel?', answer: 'Sebagai tempat respirasi seluler dan penghasil energi (ATP). Mitokondria memiliki membran ganda dan DNA sendiri.' },
  { category: 'Kimia', question: 'Apa bunyi Hukum Kekekalan Massa (Hukum Lavoisier)?', answer: 'Massa zat sebelum reaksi sama dengan massa zat sesudah reaksi dalam sistem tertutup. Tidak ada massa yang hilang atau bertambah.' },
  { category: 'Biologi', question: 'Apa perbedaan utama antara sel prokariotik dan eukariotik?', answer: 'Sel eukariotik memiliki membran inti (nukleus) dan organel bermembran, sedangkan prokariotik tidak memiliki nukleus sejati.' },
  { category: 'Kimia', question: 'Berapa jumlah elektron maksimal pada kulit L?', answer: '8 elektron. Berdasarkan rumus 2n^2, dimana n=2 untuk kulit L, maka 2(2^2) = 8.' },
  { category: 'Biologi', question: 'Apa yang dimaksud dengan pembelahan Meiosis?', answer: 'Pembelahan sel yang menghasilkan 4 sel anakan dengan jumlah kromosom setengah dari induknya (haploid). Terjadi pada sel kelamin.' },
];

interface Flashcard {
  id: string;
  userId: string;
  question: string;
  answer: string;
  category: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: any;
  lastReviewed?: any;
  createdAt?: any;
}

export default function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '', category: 'Umum' });

  const fetchCards = useCallback(async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'flashcards'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('nextReview', 'asc')
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        // Seed initial cards if none exist
        const seedPromises = INITIAL_FLASHCARDS.map(card => 
          addDoc(collection(db, 'flashcards'), {
            ...card,
            userId: auth.currentUser?.uid,
            interval: 0,
            repetition: 0,
            easeFactor: 2.5,
            nextReview: new Date(),
            createdAt: serverTimestamp()
          })
        );
        await Promise.all(seedPromises);
        const newSnap = await getDocs(q);
        setCards(newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Flashcard)));
      } else {
        setCards(snap.docs.map(d => ({ id: d.id, ...d.data() } as Flashcard)));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'flashcards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleReview = async (quality: number) => {
    const card = cards[currentIdx];
    const { interval, repetition, easeFactor, nextReview } = calculateSM2(
      quality,
      card.interval || 0,
      card.repetition || 0,
      card.easeFactor || 2.5
    );

    try {
      await updateDoc(doc(db, 'flashcards', card.id), {
        interval,
        repetition,
        easeFactor,
        nextReview,
        lastReviewed: serverTimestamp()
      });

      // Move to next card or refresh
      if (currentIdx < cards.length - 1) {
        handleNext();
      } else {
        fetchCards();
        setCurrentIdx(0);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'flashcards');
    }
  };

  const handleAddCard = async () => {
    if (!newCard.question || !newCard.answer) return;
    try {
      await addDoc(collection(db, 'flashcards'), {
        ...newCard,
        userId: auth.currentUser?.uid,
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        nextReview: new Date(),
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewCard({ question: '', answer: '', category: 'Umum' });
      fetchCards();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'flashcards');
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'flashcards', id));
      fetchCards();
      if (currentIdx >= cards.length - 1) setCurrentIdx(0);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'flashcards');
    }
  };

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % cards.length);
    }, 100);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length);
    }, 100);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
    </div>
  );

  const currentCard = cards[currentIdx];
  const dueCount = cards.filter(c => new Date(c.nextReview?.toDate?.() || c.nextReview) <= new Date()).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white flex items-center gap-3">
            Flashcards <Brain className="text-[#5A5A40] dark:text-[#8B8B6B]" size={28} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-serif italic mt-1">Spaced Repetition (Anki) for long-term memory.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-[#5A5A40] text-white rounded-2xl hover:bg-opacity-90 transition-all shadow-lg"
          >
            <Plus size={20} />
          </button>
          <div className="bg-white dark:bg-[#151619] px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="text-sm font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{cards.length > 0 ? currentIdx + 1 : 0} / {cards.length}</span>
          </div>
        </div>
      </div>

      {cards.length > 0 ? (
        <>
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
                    <div className="absolute top-8 right-8 flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCard(currentCard.id); }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
                    
                    <div className="grid grid-cols-4 gap-2 mt-8 w-full max-w-md">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReview(1); }}
                        className="flex flex-col items-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                      >
                        <span className="text-xs font-bold">Again</span>
                        <span className="text-[10px] opacity-60">1m</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReview(3); }}
                        className="flex flex-col items-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                      >
                        <span className="text-xs font-bold">Hard</span>
                        <span className="text-[10px] opacity-60">2d</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReview(4); }}
                        className="flex flex-col items-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                      >
                        <span className="text-xs font-bold">Good</span>
                        <span className="text-[10px] opacity-60">4d</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReview(5); }}
                        className="flex flex-col items-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                      >
                        <span className="text-xs font-bold">Easy</span>
                        <span className="text-[10px] opacity-60">7d</span>
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
        </>
      ) : (
        <div className="bg-white dark:bg-[#151619] rounded-[40px] p-20 text-center border border-dashed border-gray-200 dark:border-gray-800">
          <Brain className="mx-auto text-gray-300 dark:text-gray-700 mb-6" size={64} />
          <h2 className="text-2xl font-serif font-bold dark:text-white mb-2">No flashcards yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Start adding cards to master your UTBK materials.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#5A5A40] text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all"
          >
            Add First Card
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white dark:bg-[#151619] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
            <Check size={20} />
          </div>
          <h4 className="font-bold dark:text-white">Total Cards</h4>
          <p className="text-2xl font-bold text-green-500">{cards.length}</p>
        </div>
        <div className="bg-white dark:bg-[#151619] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center mb-4">
            <RotateCcw size={20} />
          </div>
          <h4 className="font-bold dark:text-white">Due for Review</h4>
          <p className="text-2xl font-bold text-yellow-500">{dueCount}</p>
        </div>
        <div className="bg-white dark:bg-[#151619] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4">
            <Sparkles size={20} />
          </div>
          <h4 className="font-bold dark:text-white">Mastery Level</h4>
          <p className="text-2xl font-bold text-red-500">
            {cards.length > 0 ? Math.round((cards.filter(c => c.repetition > 5).length / cards.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#151619] w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-2xl font-serif font-bold dark:text-white mb-6">Add New Flashcard</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                <input 
                  type="text"
                  value={newCard.category}
                  onChange={(e) => setNewCard({...newCard, category: e.target.value})}
                  className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-none rounded-2xl p-4 dark:text-white focus:ring-2 ring-[#5A5A40]"
                  placeholder="e.g. Biologi, Kimia, PK"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Question</label>
                <textarea 
                  value={newCard.question}
                  onChange={(e) => setNewCard({...newCard, question: e.target.value})}
                  className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-none rounded-2xl p-4 dark:text-white focus:ring-2 ring-[#5A5A40] h-24"
                  placeholder="Enter the question..."
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Answer</label>
                <textarea 
                  value={newCard.answer}
                  onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
                  className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-none rounded-2xl p-4 dark:text-white focus:ring-2 ring-[#5A5A40] h-24"
                  placeholder="Enter the answer..."
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCard}
                className="flex-1 bg-[#5A5A40] text-white px-6 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all"
              >
                Save Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
