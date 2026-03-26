import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, ShieldCheck, Bookmark } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export default function TryoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tryout, setTryout] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());

  // Anti-cheat: Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchTryoutData = useCallback(async () => {
    try {
      const tryoutDoc = await getDoc(doc(db, 'tryouts', id!));
      if (!tryoutDoc.exists()) {
        navigate('/');
        return;
      }
      const data = tryoutDoc.data();
      setTryout(data);
      setTimeLeft(data.duration * 60);

      // Fetch questions
      const questionPromises = data.questionIds.map((qId: string) => getDoc(doc(db, 'questions', qId)));
      const questionSnapshots = await Promise.all(questionPromises);
      setQuestions(questionSnapshots.map(snap => ({ id: snap.id, ...snap.data() })));

      // Fetch saved questions
      const savedQ = await getDocs(query(collection(db, 'savedQuestions'), where('userId', '==', auth.currentUser?.uid)));
      setSavedQuestions(new Set(savedQ.docs.map(d => d.data().questionId)));
    } catch (error) {
      console.error('Error fetching tryout:', error);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const toggleBookmark = async (questionId: string) => {
    try {
      if (savedQuestions.has(questionId)) {
        const q = query(collection(db, 'savedQuestions'), where('userId', '==', auth.currentUser?.uid), where('questionId', '==', questionId));
        const snap = await getDocs(q);
        await deleteDoc(snap.docs[0].ref);
        setSavedQuestions(prev => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
      } else {
        await addDoc(collection(db, 'savedQuestions'), {
          userId: auth.currentUser?.uid,
          questionId,
          createdAt: serverTimestamp()
        });
        setSavedQuestions(prev => new Set(prev).add(questionId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // ... (rest of the component)

  useEffect(() => {
    fetchTryoutData();
  }, [fetchTryoutData]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 && !loading) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let totalWeight = 0;
      let earnedWeight = 0;
      
      questions.forEach(q => {
        // IRT-like weighting: Harder questions are worth significantly more
        const weight = q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : q.difficulty === 'super hard' ? 5 : 1;
        totalWeight += weight;
        if (answers[q.id] === q.correctAnswer) {
          earnedWeight += weight;
        }
      });
      
      const score = Math.round((earnedWeight / totalWeight) * 1000);

      const resultData = {
        userId: auth.currentUser?.uid,
        tryoutId: id,
        score,
        answers,
        timeTaken: (tryout.duration * 60) - timeLeft,
        tabSwitches,
        completedAt: serverTimestamp(),
      };

      const resultRef = await addDoc(collection(db, 'results'), resultData);
      navigate('/tryout-results/' + resultRef.id);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F0] dark:bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
    </div>
  );

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#0a0a0a] flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#151619] border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif font-bold text-lg leading-none dark:text-white">{tryout?.title}</h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono font-bold ${timeLeft < 300 ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B]'}`}>
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#5A5A40] text-white px-6 py-2 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Finish'}
            <Send size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-[#151619] rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {currentQuestion?.section}
                </span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                  currentQuestion?.difficulty === 'easy' ? 'bg-green-50 dark:bg-green-500/10 text-green-500' :
                  currentQuestion?.difficulty === 'medium' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500' : 
                  currentQuestion?.difficulty === 'hard' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' :
                  'bg-purple-50 dark:bg-purple-500/10 text-purple-500'
                }`}>
                  {currentQuestion?.difficulty}
                </span>
              </div>

              <div className="prose prose-slate max-w-none mb-12 dark:prose-invert">
                <p className="text-xl font-serif leading-relaxed text-[#1a1a1a] dark:text-white">
                  {currentQuestion?.content}
                </p>
              </div>

              <div className="space-y-4">
                {currentQuestion?.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }))}
                    className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                      answers[currentQuestion.id] === idx 
                        ? 'border-[#5A5A40] bg-[#5A5A40]/5 dark:bg-[#5A5A40]/10' 
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-colors ${
                      answers[currentQuestion.id] === idx 
                        ? 'bg-[#5A5A40] text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`font-medium ${answers[currentQuestion.id] === idx ? 'text-[#1a1a1a] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between px-4">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#5A5A40] font-bold disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button 
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#5A5A40] font-bold disabled:opacity-30 transition-colors"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white dark:bg-[#151619] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-gray-400 dark:text-gray-500">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    currentIdx === idx 
                      ? 'bg-[#5A5A40] text-white ring-4 ring-[#5A5A40]/20' 
                      : answers[q.id] !== undefined 
                        ? 'bg-[#5A5A40]/10 text-[#5A5A40] dark:bg-[#5A5A40]/20 dark:text-[#8B8B6B]' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-[32px] p-6 border border-orange-100 dark:border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Exam Mode Active</span>
            </div>
            <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70 font-serif italic">
              Tab switching is monitored. Please stay on this page to avoid automatic submission.
            </p>
            {tabSwitches > 0 && (
              <div className="mt-3 flex items-center gap-2 text-red-500">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold">Warnings: {tabSwitches}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
