import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  AlertCircle,
  Calculator,
  X,
  Maximize2,
  Minimize2,
  Brain
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Simple Calculator Component
const MiniCalculator = ({ onClose }: { onClose: () => void }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-20 right-20 w-64 bg-white dark:bg-[#151619] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden"
    >
      <div className="bg-[#5A5A40] p-4 flex items-center justify-between text-white cursor-move">
        <div className="flex items-center gap-2">
          <Calculator size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Kalkulator</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-[#F5F5F0] dark:bg-gray-800 p-4 rounded-2xl text-right">
          <div className="text-[10px] text-gray-400 h-4">{equation}</div>
          <div className="text-xl font-bold dark:text-white truncate">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', '/'].map(btn => (
            <button key={btn} onClick={() => btn === '/' ? handleOp('/') : handleNumber(btn)} className="p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl hover:bg-gray-100 font-bold">{btn}</button>
          ))}
          {['4', '5', '6', '*'].map(btn => (
            <button key={btn} onClick={() => btn === '*' ? handleOp('*') : handleNumber(btn)} className="p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl hover:bg-gray-100 font-bold">{btn}</button>
          ))}
          {['1', '2', '3', '-'].map(btn => (
            <button key={btn} onClick={() => btn === '-' ? handleOp('-') : handleNumber(btn)} className="p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl hover:bg-gray-100 font-bold">{btn}</button>
          ))}
          {['0', 'C', '=', '+'].map(btn => (
            <button 
              key={btn} 
              onClick={() => {
                if (btn === 'C') { setDisplay('0'); setEquation(''); }
                else if (btn === '=') calculate();
                else if (btn === '+') handleOp('+');
                else handleNumber('0');
              }} 
              className={`p-3 rounded-xl font-bold ${btn === '=' ? 'bg-[#5A5A40] text-white' : 'bg-gray-50 dark:bg-gray-800 dark:text-white'}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function TryoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tryout, setTryout] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [uncertainAnswers, setUncertainAnswers] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  // Tab switching detection
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
    if (!id) return;
    try {
      const tryoutDoc = await getDoc(doc(db, 'tryouts', id));
      if (!tryoutDoc.exists()) {
        navigate('/tryouts');
        return;
      }
      const data = tryoutDoc.data();
      setTryout(data);
      setTimeLeft(data.duration * 60);

      // Fetch questions
      const questionPromises = data.questionIds.map((qId: string) => getDoc(doc(db, 'questions', qId)));
      const questionSnaps = await Promise.all(questionPromises);
      setQuestions(questionSnaps.map(snap => ({ id: snap.id, ...snap.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'tryouts');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTryoutData();
  }, [fetchTryoutData]);

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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let totalWeight = 0;
      let earnedWeight = 0;
      const sectionScores: Record<string, number> = {};

      questions.forEach((q) => {
        const weight = q.difficulty === 'super hard' ? 10 : q.difficulty === 'hard' ? 7 : q.difficulty === 'medium' ? 5 : 3;
        totalWeight += weight;
        
        const isCorrect = answers[q.id] === q.correctAnswer;
        if (isCorrect) {
          earnedWeight += weight;
          sectionScores[q.section] = (sectionScores[q.section] || 0) + weight;
        }
      });

      // UTBK scale typically ranges from 200 to 1000
      // Using a non-linear curve (power of 1.5) to simulate IRT where higher scores are exponentially harder to achieve
      const accuracyRatio = totalWeight > 0 ? earnedWeight / totalWeight : 0;
      const score = Math.round(200 + Math.pow(accuracyRatio, 1.5) * 800);

      const resultData = {
        userId: auth.currentUser?.uid,
        tryoutId: id,
        score,
        sectionScores,
        answers,
        timeTaken: tryout.duration * 60 - timeLeft,
        tabSwitches,
        completedAt: serverTimestamp(),
      };

      const resultRef = await addDoc(collection(db, 'results'), resultData);
      navigate(`/tryout-results/${resultRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'results');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F0] dark:bg-[#0a0a0a]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5A5A40] mx-auto"></div>
        <p className="font-serif italic text-gray-500">Menyiapkan Lembar Ujian...</p>
      </div>
    </div>
  );

  const currentQuestion = questions[currentIdx];
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#0a0a0a] flex flex-col">
      {/* CBT Header */}
      <header className="bg-white dark:bg-[#151619] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-[#5A5A40] text-white p-2 rounded-xl">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="font-serif font-bold dark:text-white leading-none">{tryout?.title}</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">SNBT 2026 Simulation Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-2xl border border-red-100 dark:border-red-900/30">
            <Timer className="text-red-500" size={20} />
            <span className={`font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-red-500'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Kalkulator"
            >
              <Calculator size={20} />
            </button>
            <button 
              onClick={toggleFullScreen}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Full Screen"
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
          <button 
            onClick={() => { if(window.confirm('Selesaikan ujian sekarang?')) handleSubmit(); }}
            className="bg-[#5A5A40] text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#5A5A40]/20"
          >
            Selesai Ujian
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-[#151619] rounded-[32px] p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#5A5A40]"></div>
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A5A40] dark:text-[#8B8B6B]">
                  Soal Nomor {currentIdx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                    currentQuestion.difficulty === 'hard' ? 'bg-red-50 text-red-500' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-500' :
                    'bg-green-50 text-green-500'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                <p className="text-xl font-serif leading-relaxed text-[#1a1a1a] dark:text-white">
                  {currentQuestion.content}
                </p>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setAnswers({ ...answers, [currentQuestion.id]: idx })}
                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all text-left group ${
                      answers[currentQuestion.id] === idx
                        ? 'border-[#5A5A40] bg-[#F5F5F0] dark:bg-[#5A5A40]/10'
                        : 'border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                      answers[currentQuestion.id] === idx
                        ? 'bg-[#5A5A40] text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`flex-1 font-medium ${
                      answers[currentQuestion.id] === idx ? 'text-[#1a1a1a] dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
                Sebelumnya
              </button>

              <button
                onClick={() => setUncertainAnswers({ ...uncertainAnswers, [currentQuestion.id]: !uncertainAnswers[currentQuestion.id] })}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                  uncertainAnswers[currentQuestion.id]
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-white dark:bg-[#151619] text-orange-500 border border-orange-200 dark:border-orange-900/30'
                }`}
              >
                <Flag size={20} fill={uncertainAnswers[currentQuestion.id] ? "currentColor" : "none"} />
                Ragu-ragu
              </button>

              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIdx === questions.length - 1}
                className="flex items-center gap-2 px-8 py-4 bg-[#5A5A40] text-white rounded-2xl font-bold hover:bg-opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-[#5A5A40]/20"
              >
                Selanjutnya
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar Navigation */}
        <aside className="w-80 bg-white dark:bg-[#151619] border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto hidden lg:block">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold dark:text-white">Navigasi Soal</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#5A5A40]"></div>
                  <span className="text-[10px] font-bold text-gray-400">ISI</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] font-bold text-gray-400">RAGU</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all border-2 ${
                    currentIdx === idx
                      ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/20 scale-110 z-10'
                      : 'border-transparent'
                  } ${
                    uncertainAnswers[q.id]
                      ? 'bg-orange-500 text-white'
                      : answers[q.id] !== undefined
                      ? 'bg-[#5A5A40] text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Terjawab</span>
                <span className="font-bold dark:text-white">{Object.keys(answers).length} / {questions.length}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#5A5A40] h-full transition-all duration-500" 
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="bg-[#F5F5F0] dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Peringatan</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Pastikan semua soal terjawab sebelum menekan tombol "Selesai Ujian". Jawaban ragu-ragu tetap akan dihitung.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showCalculator && <MiniCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
}
