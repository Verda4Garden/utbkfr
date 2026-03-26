import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Bookmark, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';

export default function TryoutResults() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'savedQuestions'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setSavedQuestions(new Set(querySnapshot.docs.map(doc => doc.data().questionId)));
    };
    fetchSavedQuestions();
  }, []);

  const toggleBookmark = async (questionId: string) => {
    if (!auth.currentUser) return;
    const bookmarkRef = doc(db, 'savedQuestions', `${auth.currentUser.uid}_${questionId}`);
    if (savedQuestions.has(questionId)) {
      await deleteDoc(bookmarkRef);
      setSavedQuestions(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      await setDoc(bookmarkRef, { userId: auth.currentUser.uid, questionId });
      setSavedQuestions(prev => new Set(prev).add(questionId));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultDoc = await getDoc(doc(db, 'results', resultId!));
        if (!resultDoc.exists()) {
          navigate('/');
          return;
        }
        const resultData = resultDoc.data();
        setResult(resultData);

        const tryoutDoc = await getDoc(doc(db, 'tryouts', resultData.tryoutId));
        const tryoutData = tryoutDoc.data();
        
        const questionPromises = tryoutData?.questionIds.map((qId: string) => getDoc(doc(db, 'questions', qId)));
        const questionSnapshots = await Promise.all(questionPromises || []);
        setQuestions(questionSnapshots.map(snap => ({ id: snap.id, ...snap.data() })));
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resultId, navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#0a0a0a] p-6 transition-colors duration-300">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 bg-white dark:bg-[#151619] rounded-full shadow-sm dark:text-white dark:border dark:border-gray-800">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif font-bold text-2xl dark:text-white">Tryout Results</h1>
      </header>

      <div className="bg-white dark:bg-[#151619] rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-6 dark:text-white">Score: {result.score}</h2>
        <div className="space-y-8">
          {questions.map((q, idx) => {
            const userAnswer = result.answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className={`p-6 rounded-3xl border-2 ${isCorrect ? 'border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10' : 'border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10'}`}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    <h3 className="font-bold text-lg dark:text-white">Question {idx + 1}</h3>
                  </div>
                  <button 
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-1.5 rounded-full transition-colors ${savedQuestions.has(q.id) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'}`}
                  >
                    <Bookmark size={18} fill={savedQuestions.has(q.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <p className="mb-4 dark:text-gray-300">{q.content}</p>
                <div className="font-semibold mb-2 dark:text-white">Your Answer: {q.options[userAnswer]}</div>
                {!isCorrect && <div className="font-semibold text-green-600 dark:text-green-400 mb-4">Correct Answer: {q.options[q.correctAnswer]}</div>}
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 italic text-gray-700 dark:text-gray-300">
                  <span className="font-bold not-italic text-black dark:text-white">Pembahasan:</span> {q.explanation || 'No explanation available.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
