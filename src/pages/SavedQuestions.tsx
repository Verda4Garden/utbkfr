import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Trash2, ChevronRight, Search } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function SavedQuestions() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'savedQuestions'), where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const items = await Promise.all(querySnapshot.docs.map(async (d) => {
          const data = d.data();
          const questionDoc = await getDoc(doc(db, 'questions', data.questionId));
          return {
            id: d.id,
            questionId: data.questionId,
            ...questionDoc.data()
          };
        }));
        
        setSavedItems(items);
      } catch (error) {
        console.error('Error fetching saved questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedQuestions();
  }, []);

  const removeBookmark = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'savedQuestions', id));
      setSavedItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const filteredItems = savedItems.filter(item => 
    item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white">Saved Questions</h1>
          <p className="text-gray-500 dark:text-gray-400 font-serif italic mt-1">Review your bookmarked questions for better understanding.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A5A40] transition-colors" />
            <input 
              type="text" 
              placeholder="Search saved questions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-[#151619] border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all w-full md:w-64 dark:text-white"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-[#151619] rounded-[40px] p-12 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-[#F5F5F0] dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Bookmark size={40} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-2">No saved questions yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Bookmark difficult questions during your tryouts to review them here later.</p>
          <Link 
            to="/tryouts"
            className="inline-flex items-center gap-2 bg-[#5A5A40] text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all"
          >
            Go to Tryouts
            <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#151619] rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {item.section}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                    item.difficulty === 'easy' ? 'bg-green-50 dark:bg-green-500/10 text-green-500' :
                    item.difficulty === 'medium' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>
                <button 
                  onClick={() => removeBookmark(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                <p className="text-xl text-[#1a1a1a] dark:text-white font-serif leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="bg-[#F5F5F0] dark:bg-gray-800/50 p-6 rounded-2xl border border-[#5A5A40]/10 dark:border-[#5A5A40]/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-[#5A5A40] dark:bg-[#8B8B6B] rounded-full"></div>
                  <p className="text-[10px] font-bold text-[#5A5A40] dark:text-[#8B8B6B] uppercase tracking-widest">Explanation</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic font-serif leading-relaxed">
                  {item.explanation || 'No explanation available for this question.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
