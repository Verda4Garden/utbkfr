import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';

export default function TryoutResults() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#F5F5F0] p-6">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif font-bold text-2xl">Tryout Results</h1>
      </header>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Score: {result.score}</h2>
        <div className="space-y-8">
          {questions.map((q, idx) => {
            const userAnswer = result.answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className={`p-6 rounded-3xl border-2 ${isCorrect ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'}`}>
                <div className="flex items-center gap-3 mb-4">
                  {isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                  <h3 className="font-bold text-lg">Question {idx + 1}</h3>
                </div>
                <p className="mb-4">{q.content}</p>
                <div className="font-semibold mb-2">Your Answer: {q.options[userAnswer]}</div>
                {!isCorrect && <div className="font-semibold text-green-600 mb-4">Correct Answer: {q.options[q.correctAnswer]}</div>}
                <div className="bg-white p-4 rounded-xl border border-gray-100 italic text-gray-700">
                  <span className="font-bold not-italic text-black">Pembahasan:</span> {q.explanation || 'No explanation available.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
