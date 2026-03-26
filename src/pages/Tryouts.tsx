import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Clock, ChevronRight, Search, Filter, Stethoscope, Zap, Award } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Tryouts() {
  const [tryouts, setTryouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tryouts'));
        setTryouts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching tryouts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTryouts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">UTBK Simulations</h1>
          <p className="text-gray-500 font-serif italic mt-1">Realistic practice to boost your confidence.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A5A40] transition-colors" />
            <input 
              type="text" 
              placeholder="Search tryouts..." 
              className="bg-white border border-gray-100 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tryouts.map((tryout, i) => (
            <motion.div
              key={tryout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#5A5A40]/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-[#F5F5F0] rounded-2xl flex items-center justify-center text-[#5A5A40] group-hover:scale-110 transition-transform">
                  <GraduationCap size={24} />
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Available</span>
                </div>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-2 group-hover:text-[#5A5A40] transition-colors">{tryout.title}</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock size={14} />
                  <span className="text-xs font-medium">{tryout.duration} Minutes</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Zap size={14} />
                  <span className="text-xs font-medium">{tryout.questionIds?.length || 0} Questions</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Difficulty</span>
                  <span className="text-[#1a1a1a]">Medium</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[60%]"></div>
                </div>
              </div>

              <Link 
                to={`/tryout/${tryout.id}`}
                className="mt-8 w-full bg-[#5A5A40] text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-[#5A5A40]/10"
              >
                Start Simulation
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
