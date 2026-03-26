import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Clock, Award, ChevronRight, Zap, BookOpen, Stethoscope, Sparkles, Bookmark } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import SeedData from '../components/SeedData';

const data = [
  { name: 'TO 1', score: 450 },
  { name: 'TO 2', score: 520 },
  { name: 'TO 3', score: 490 },
  { name: 'TO 4', score: 610 },
  { name: 'TO 5', score: 580 },
  { name: 'TO 6', score: 680 },
  { name: 'TO 7', score: 720 },
];

interface DashboardProps {
  userData: any;
}

export default function Dashboard({ userData }: DashboardProps) {
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [weakTopics, setWeakTopics] = useState<{label: string, value: number, color: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!userData?.uid) return;
      try {
        const q = query(
          collection(db, 'results'),
          where('userId', '==', userData.uid),
          orderBy('completedAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc, index) => {
          const d = doc.data();
          return { 
            id: doc.id, 
            ...d,
            name: `TO ${index + 1}`, // Use index instead of results.length
            date: d.completedAt?.toDate?.()?.toLocaleDateString() || 'Recent'
          };
        }).reverse(); // Reverse to show chronological order in chart
        
        // Map results for chart
        const chartData = results.map((r: any, i: number) => ({
          name: `TO ${i + 1}`,
          score: r.score || 0,
          fullDate: r.date
        }));
        
        setRecentResults(chartData);

        // Calculate weak topics
        if (results.length > 0) {
          const questionsSnapshot = await getDocs(collection(db, 'questions'));
          const questionsMap = new Map();
          questionsSnapshot.docs.forEach(doc => {
            questionsMap.set(doc.id, doc.data());
          });

          const topicStats: Record<string, { total: number, correct: number }> = {};
          
          results.forEach((result: any) => {
            if (result.answers) {
              Object.entries(result.answers).forEach(([qId, answer]) => {
                const q = questionsMap.get(qId);
                if (q && q.topic) {
                  if (!topicStats[q.topic]) {
                    topicStats[q.topic] = { total: 0, correct: 0 };
                  }
                  topicStats[q.topic].total++;
                  if (answer === q.correctAnswer) {
                    topicStats[q.topic].correct++;
                  }
                }
              });
            }
          });

          const calculatedWeakTopics = Object.entries(topicStats)
            .map(([topic, stats]) => {
              const accuracy = Math.round((stats.correct / stats.total) * 100);
              return {
                label: topic,
                value: accuracy,
                color: accuracy < 50 ? 'bg-red-500' : accuracy < 75 ? 'bg-orange-500' : 'bg-yellow-500'
              };
            })
            .sort((a, b) => a.value - b.value)
            .slice(0, 3);

          if (calculatedWeakTopics.length > 0) {
            setWeakTopics(calculatedWeakTopics);
          } else {
            // Fallback if no topic data
            setWeakTopics([
              { label: 'Penalaran Numerik', value: 45, color: 'bg-red-500' },
              { label: 'Genetika & Evolusi', value: 58, color: 'bg-orange-500' },
              { label: 'Termodinamika', value: 62, color: 'bg-yellow-500' },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [userData]);

  const targetScore = 750; // Average FK UI passing grade
  
  // Calculate moving average of last 5 tryouts for a more stable probability
  const recentTryouts = recentResults.slice(-5);
  const averageScore = recentTryouts.length > 0 
    ? Math.round(recentTryouts.reduce((acc, curr) => acc + curr.score, 0) / recentTryouts.length)
    : 0;
  
  const currentScore = recentResults.length > 0 ? recentResults[recentResults.length - 1].score : 0;
    
  // Logic: Success probability should consider both score and consistency (number of tryouts)
  // We use a confidence factor based on the number of tryouts completed
  const confidenceFactor = Math.min(1, recentResults.length / 5); 
  const rawProgress = (averageScore / targetScore) * 100;
  const progress = Math.min(100, Math.round(rawProgress * confidenceFactor));
  const accuracy = recentTryouts.length > 0 
    ? Math.round((recentTryouts.reduce((acc, curr) => acc + (curr.score / 10), 0) / recentTryouts.length))
    : 0;
  
  // Determine trend
  let trend = 'stable';
  if (recentTryouts.length >= 2) {
    const last = recentTryouts[recentTryouts.length - 1].score;
    const prev = recentTryouts[recentTryouts.length - 2].score;
    if (last > prev) trend = 'improving';
    else if (last < prev) trend = 'declining';
  }
  
  let probabilityText = 'Take a TO';
  if (recentResults.length > 0) {
    if (progress >= 90) probabilityText = 'Excellent Chance';
    else if (progress >= 70) {
      probabilityText = trend === 'improving' ? 'Very High Chance' : 'High Chance';
    }
    else if (progress >= 50) {
      probabilityText = trend === 'improving' ? 'Promising Chance' : 'Moderate Chance';
    }
    else probabilityText = 'Needs Improvement';
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-[#151619] rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 dark:bg-[#5A5A40]/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-2">Welcome back, {userData?.displayName?.split(' ')[0]}!</h2>
            <p className="text-gray-500 dark:text-gray-400 font-serif italic mb-8 max-w-md">
              {recentResults.length === 0 
                ? "Ready to start your journey to FK? Take your first tryout today!"
                : "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt"}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Current Score</p>
                <p className="text-2xl font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{currentScore || '---'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Target FK</p>
                <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{userData?.targetFK || 'FK UI'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Accuracy</p>
                <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{accuracy}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Streak</p>
                <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white flex items-center gap-1">
                  <Zap size={20} className="text-orange-500 fill-orange-500" />
                  {userData?.streak || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#5A5A40] rounded-[40px] p-8 text-white shadow-xl shadow-[#5A5A40]/20 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">FK Success Probability</p>
              <Target size={20} className="opacity-70" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold leading-none">{recentResults.length > 0 ? `${progress}%` : '0%'}</span>
              <span className="text-sm opacity-70 font-serif italic mb-1">{probabilityText}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: recentResults.length > 0 ? `${progress}%` : '0%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-white"
              />
            </div>
          </div>
          <Link to="/tryouts" className="mt-8 w-full bg-white text-[#5A5A40] font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group">
            {recentResults.length === 0 ? 'Start First Tryout' : 'Boost Your Score'}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Analytics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-[#151619] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a] dark:text-white">Score Progression</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {recentResults.length > 0 
                  ? `Based on your last ${recentResults.length} tryouts`
                  : "No tryout data available yet"}
              </p>
            </div>
            {recentResults.length > 1 && (
              <div className="flex items-center gap-2 bg-[#F5F5F0] dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-xs font-bold text-green-500">+12% vs last month</span>
              </div>
            )}
          </div>
          
          <div className="h-[300px] w-full flex items-center justify-center min-w-0">
            {recentResults.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={recentResults}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#5A5A40" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-600">
                  <TrendingUp size={32} />
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-serif italic">Complete a tryout to see your progress chart</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#151619] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-6">Weak Topics</h3>
            <div className="space-y-4">
              {recentResults.length > 0 && weakTopics.length > 0 ? (
                weakTopics.map((topic) => (
                  <div key={topic.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500 dark:text-gray-400">{topic.label}</span>
                      <span className="text-[#1a1a1a] dark:text-white">{topic.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${topic.color}`} style={{ width: `${topic.value}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-serif italic">Complete tryouts to identify your weak spots</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowInsights(true)}
              className="mt-8 w-full text-xs font-bold text-[#5A5A40] dark:text-[#8B8B6B] uppercase tracking-widest hover:underline"
            >
              View All Insights
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-[#151619] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold dark:text-white">Daily Challenge</h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">5 Questions left</p>
              </div>
            </div>
            <button className="w-full bg-[#F5F5F0] dark:bg-gray-800 text-[#1a1a1a] dark:text-white font-bold py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm">
              Start Challenge
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SeedData />
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Sparkles, label: 'AI Tutor', desc: 'Ask anything', color: 'bg-orange-50 text-orange-500', path: '/ai-tutor' },
          { icon: Bookmark, label: 'Saved Items', desc: 'Review bookmarks', color: 'bg-blue-50 text-blue-500', path: '/saved' },
          { icon: Stethoscope, label: 'FK Booster', desc: 'Saintek materials', color: 'bg-purple-50 text-purple-500', path: '/materials' },
          { icon: Target, label: 'FK Predictor', desc: 'Admission chances', color: 'bg-green-50 text-green-500', path: '/predictor' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white dark:bg-[#151619] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <Link to={item.path} className="block">
              <div className={`w-12 h-12 ${item.color} dark:bg-opacity-10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <h4 className="font-bold text-[#1a1a1a] dark:text-white mb-1">{item.label}</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </section>
      {/* Insights Modal */}
      {showInsights && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#151619] w-full max-w-2xl rounded-[40px] p-8 shadow-2xl relative border border-gray-100 dark:border-gray-800"
          >
            <button 
              onClick={() => setShowInsights(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronRight size={24} className="rotate-180 dark:text-white" />
            </button>
            
            <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-6">Detailed Performance Insights</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F5F0] dark:bg-gray-800 p-6 rounded-3xl">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Strongest Section</p>
                  <p className="text-xl font-bold text-[#5A5A40] dark:text-[#8B8B6B]">Literasi B. Inggris</p>
                </div>
                <div className="bg-[#F5F5F0] dark:bg-gray-800 p-6 rounded-3xl">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Time Efficiency</p>
                  <p className="text-xl font-bold text-[#5A5A40] dark:text-[#8B8B6B]">85% (Fast)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Section Breakdown</h4>
                {[
                  { label: 'Penalaran Umum', value: 78 },
                  { label: 'PPU', value: 82 },
                  { label: 'PBM', value: 65 },
                  { label: 'Pengetahuan Kuantitatif', value: 45 },
                  { label: 'Literasi B. Indonesia', value: 88 },
                  { label: 'Literasi B. Inggris', value: 92 },
                  { label: 'Penalaran Matematika', value: 55 },
                ].map((section) => (
                  <div key={section.label} className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-32">{section.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${section.value > 70 ? 'bg-green-500' : section.value > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${section.value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold w-8 text-right dark:text-white">{section.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setShowInsights(false)}
              className="mt-8 w-full bg-[#5A5A40] text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all"
            >
              Close Insights
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
