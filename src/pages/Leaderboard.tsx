import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, TrendingUp, Search, Filter, Stethoscope, Award, Zap } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Leaderboard() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('National');

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        setRankings(querySnapshot.docs.map((doc, i) => ({ id: doc.id, rank: i + 1, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white">National Rankings</h1>
          <p className="text-gray-500 dark:text-gray-400 font-serif italic mt-1">See how you stack up against other FK aspirants.</p>
        </div>

        <div className="flex bg-white dark:bg-[#151619] p-1 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm self-start">
          {['National', 'By Target FK', 'By School'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f ? 'bg-[#5A5A40] text-white shadow-md' : 'text-gray-400 dark:text-gray-500 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12">
        {rankings.slice(0, 3).map((user, i) => {
          const order = i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3';
          const height = i === 0 ? 'h-64' : i === 1 ? 'h-56' : 'h-48';
          const medalColor = i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-500';
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col items-center ${order}`}
            >
              <div className="relative mb-4">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt={user.displayName} 
                  className={`w-20 h-20 rounded-full border-4 ${i === 0 ? 'border-yellow-400 scale-110' : 'border-white dark:border-gray-800'} shadow-xl`}
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center ${medalColor}`}>
                  <Medal size={16} />
                </div>
              </div>
              <div className={`w-full ${height} bg-white dark:bg-[#151619] rounded-t-[40px] p-6 text-center shadow-xl border-t border-x border-gray-100 dark:border-gray-800 flex flex-col justify-between`}>
                <div>
                  <h3 className="font-bold text-[#1a1a1a] dark:text-white truncate px-2">{user.displayName}</h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mt-1">{user.targetFK}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{user.xp}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">XP Points</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rankings Table */}
      <div className="bg-white dark:bg-[#151619] rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F0]/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-8 py-6 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Rank</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">User</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Target FK</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Level</th>
                <th className="px-8 py-6 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold text-right">XP Points</th>
              </tr>
            </thead>
            <tbody>
              {rankings.slice(3).map((user) => (
                <tr key={user.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 group-hover:text-[#5A5A40] dark:group-hover:text-[#8B8B6B]">#{user.rank}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                        alt="" 
                        className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-800"
                      />
                      <span className="text-sm font-bold text-[#1a1a1a] dark:text-white">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user.targetFK}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Level {user.level}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{user.xp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
