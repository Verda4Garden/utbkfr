import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, School, TrendingUp, ChevronRight, Search, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const UNIVERSITIES = [
  { id: 1, name: 'Universitas Indonesia (UI)', location: 'Depok', passingGrade: 745, tightness: '1.2%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/0/0b/Logo_Universitas_Indonesia.svg/1200px-Logo_Universitas_Indonesia.svg.png' },
  { id: 2, name: 'Universitas Gadjah Mada (UGM)', location: 'Yogyakarta', passingGrade: 738, tightness: '1.5%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/a2/Logo_UGM_hitam.svg/1200px-Logo_UGM_hitam.svg.png' },
  { id: 3, name: 'Universitas Airlangga (UNAIR)', location: 'Surabaya', passingGrade: 725, tightness: '2.1%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/b/b1/Logo_Universitas_Airlangga.png/1200px-Logo_Universitas_Airlangga.png' },
  { id: 4, name: 'Universitas Padjadjaran (UNPAD)', location: 'Bandung', passingGrade: 715, tightness: '2.5%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/1/1a/Logo_Universitas_Padjadjaran.svg/1200px-Logo_Universitas_Padjadjaran.svg.png' },
  { id: 5, name: 'Universitas Diponegoro (UNDIP)', location: 'Semarang', passingGrade: 705, tightness: '3.0%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/2/2d/Logo_Undip.png/1200px-Logo_Undip.png' },
  { id: 6, name: 'Universitas Brawijaya (UB)', location: 'Malang', passingGrade: 695, tightness: '3.2%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/b/bb/Logo_Universitas_Brawijaya.svg/1200px-Logo_Universitas_Brawijaya.svg.png' },
  { id: 7, name: 'Universitas Sebelas Maret (UNS)', location: 'Surakarta', passingGrade: 690, tightness: '3.5%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/a8/Logo_Universitas_Sebelas_Maret.svg/1200px-Logo_Universitas_Sebelas_Maret.svg.png' },
  { id: 8, name: 'Universitas Hasanuddin (UNHAS)', location: 'Makassar', passingGrade: 685, tightness: '4.0%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/a2/Logo_Unhas.svg/1200px-Logo_Unhas.svg.png' },
  { id: 9, name: 'Universitas Lambung Mangkurat (ULM)', location: 'Banjarmasin', passingGrade: 675, tightness: '4.5%', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/a2/Logo_Universitas_Lambung_Mangkurat.png/1200px-Logo_Universitas_Lambung_Mangkurat.png' },
];

export default function Predictor() {
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUni, setSelectedUni] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const fetchLatestScore = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'results'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('completedAt', 'desc'),
        limit(3)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const scores = snapshot.docs.map(d => d.data().score);
        setScoreHistory(scores);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        setUserScore(avg);
      }
    } catch (error) {
      console.error('Error fetching score:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestScore();
  }, []);

  const getChance = (passingGrade: number) => {
    const diff = userScore - passingGrade;
    if (diff >= 20) return { label: 'Very High', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10', icon: CheckCircle2 };
    if (diff >= -10) return { label: 'High', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', icon: TrendingUp };
    if (diff >= -40) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', icon: Info };
    return { label: 'Low', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', icon: AlertCircle };
  };

  const filteredUnis = UNIVERSITIES.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white">FK Predictor</h1>
          <p className="text-gray-500 dark:text-gray-400 font-serif italic mt-1">Predict your admission chances based on your latest tryout results.</p>
        </div>

        <div className="bg-white dark:bg-[#151619] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Your Avg Score</p>
            <p className="text-3xl font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{userScore || '---'}</p>
          </div>
          <div className="w-px h-10 bg-gray-100 dark:bg-gray-800"></div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Target</p>
            <p className="text-3xl font-bold text-[#1a1a1a] dark:text-white">750</p>
          </div>
        </div>
      </div>

      <div className="relative group max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A5A40] transition-colors" />
        <input 
          type="text" 
          placeholder="Search university..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white dark:bg-[#151619] border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all w-full dark:text-white"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUnis.map((uni, i) => {
            const chance = getChance(uni.passingGrade);
            const ChanceIcon = chance.icon;
            
            return (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#151619] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40]/5 dark:bg-[#5A5A40]/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="w-14 h-14 bg-[#F5F5F0] dark:bg-gray-800 rounded-2xl flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700">
                    <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full ${chance.bg} flex items-center gap-2`}>
                    <ChanceIcon size={14} className={chance.color} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${chance.color}`}>{chance.label} Chance</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-serif font-bold text-[#1a1a1a] dark:text-white mb-1 group-hover:text-[#5A5A40] dark:group-hover:text-[#8B8B6B] transition-colors">{uni.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-6 flex items-center gap-1">
                    <School size={12} />
                    {uni.location}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#F5F5F0] dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-50 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Passing Grade</p>
                      <p className="text-xl font-bold text-[#1a1a1a] dark:text-white">{uni.passingGrade}</p>
                    </div>
                    <div className="bg-[#F5F5F0] dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-50 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Tightness</p>
                      <p className="text-xl font-bold text-[#1a1a1a] dark:text-white">{uni.tightness}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-gray-400 dark:text-gray-500">Your Score Match</span>
                      <span className={chance.color}>{Math.round((userScore / uni.passingGrade) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (userScore / uni.passingGrade) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${chance.color.replace('text', 'bg')}`}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedUni(uni);
                    setShowAnalysis(true);
                  }}
                  className="mt-8 w-full bg-[#F5F5F0] dark:bg-gray-800 text-[#1a1a1a] dark:text-white font-bold py-3 rounded-2xl hover:bg-[#5A5A40] hover:text-white transition-all text-xs flex items-center justify-center gap-2 group/btn"
                >
                  View Detail Analysis
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="bg-[#5A5A40] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-[#5A5A40]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-serif font-bold mb-4">How are these predictions calculated?</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 font-serif italic">
            MedPrep uses historical SNBT data from previous years, combined with current competition trends and Item Response Theory (IRT) modeling. While these predictions are highly accurate, they should be used as a guide for your study strategy.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Data Source</p>
              <p className="text-sm font-bold">Official LTMPT/SNPMB 2023-2025</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Update Frequency</p>
              <p className="text-sm font-bold">Weekly based on National Tryouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && selectedUni && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#151619] w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowAnalysis(false)}
                className="absolute top-8 right-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-[#F5F5F0] dark:bg-gray-800 rounded-3xl flex items-center justify-center p-3 border border-gray-100 dark:border-gray-700">
                  <img src={selectedUni.logo} alt={selectedUni.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] dark:text-white">{selectedUni.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-serif italic">{selectedUni.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F5F5F0] dark:bg-gray-800/50 p-6 rounded-3xl">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-2">Score Gap</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${userScore >= selectedUni.passingGrade ? 'text-green-500' : 'text-red-500'}`}>
                      {userScore - selectedUni.passingGrade > 0 ? '+' : ''}{userScore - selectedUni.passingGrade}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">points from target</p>
                  </div>
                </div>
                <div className="bg-[#F5F5F0] dark:bg-gray-800/50 p-6 rounded-3xl">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-2">Admission Chance</p>
                  <p className={`text-3xl font-bold ${getChance(selectedUni.passingGrade).color}`}>
                    {getChance(selectedUni.passingGrade).label}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Detailed Analysis</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">Score Trend</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Your latest 3 tryout scores are {scoreHistory.join(', ')}. {userScore >= selectedUni.passingGrade ? 'You are consistently above the passing grade.' : 'You need to improve your consistency to reach the target.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <Target size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">Tightness Strategy</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        With a tightness of {selectedUni.tightness}, this university is highly competitive. Focus on minimizing errors in high-weight sections like Penalaran Matematika.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowAnalysis(false)}
                className="mt-10 w-full bg-[#5A5A40] text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-[#5A5A40]/20"
              >
                Close Analysis
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
