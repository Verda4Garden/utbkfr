import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Target, Award, Zap, Clock, ChevronRight, Stethoscope, Edit2, ShieldCheck } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, updateDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

interface ProfileProps {
  userData: any;
}

export default function Profile({ userData }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [targetFK, setTargetFK] = useState(userData?.targetFK || 'FK UI');
  const [isSaving, setIsSaving] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!userData?.uid) return;
      try {
        const q = query(
          collection(db, 'results'),
          where('userId', '==', userData.uid),
          orderBy('completedAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            action: `Completed Tryout`,
            time: data.completedAt?.toDate?.()?.toLocaleDateString() || 'Recent',
            score: `Score: ${data.score}`,
            icon: Clock
          };
        });
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchActivity();
  }, [userData?.uid]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', userData.uid), { targetFK });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const badges = [
    { id: 1, icon: Zap, label: 'Fast Learner', desc: 'Completed 5 tryouts in a week', color: 'text-orange-500 bg-orange-50' },
    { id: 2, icon: Stethoscope, label: 'Bio Expert', desc: 'Scored 90+ in Biology booster', color: 'text-purple-500 bg-purple-50' },
    { id: 3, icon: Award, label: 'Top 10%', desc: 'Reached top 10% national ranking', color: 'text-yellow-500 bg-yellow-50' },
    { id: 4, icon: Clock, label: 'Early Bird', desc: 'Completed a tryout before 7 AM', color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative">
          <img 
            src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.uid}`} 
            alt={userData?.displayName} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] border-4 border-white shadow-2xl relative z-10"
          />
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#5A5A40] text-white rounded-2xl flex items-center justify-center shadow-lg z-20 border-4 border-white">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">{userData?.displayName}</h1>
            <span className="bg-[#F5F5F0] text-[#5A5A40] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest self-center md:self-auto">
              Level {userData?.level || 1}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-gray-500">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm">{userData?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <Target size={18} className="text-gray-400" />
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={targetFK} 
                    onChange={(e) => setTargetFK(e.target.value)}
                    className="bg-[#F5F5F0] border-none rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#5A5A40]/20"
                  />
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="text-xs font-bold text-[#5A5A40] uppercase tracking-widest hover:underline"
                  >
                    {isSaving ? '...' : 'Save'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1a1a1a]">{userData?.targetFK || 'FK UI'}</span>
                  <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-[#5A5A40] text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-[#5A5A40]/20">
              <Zap size={20} />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total XP</p>
                <p className="text-lg font-bold leading-none">{userData?.xp || 0}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
              <Award size={20} className="text-yellow-500" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Badges</p>
                <p className="text-lg font-bold leading-none text-[#1a1a1a]">{userData?.badges?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#1a1a1a]">Achievements</h2>
          <button className="text-xs font-bold text-[#5A5A40] uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center group"
            >
              <div className={`w-16 h-16 ${badge.color} rounded-[24px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <badge.icon size={32} />
              </div>
              <h3 className="font-bold text-[#1a1a1a] mb-1">{badge.label}</h3>
              <p className="text-[10px] text-gray-400 px-4">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Activity Log */}
      <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-8">Recent Activity</h2>
        <div className="space-y-6">
          {loadingActivity ? (
            <div className="text-center text-gray-500 py-4">Loading activity...</div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5F5F0] rounded-xl flex items-center justify-center text-[#5A5A40] group-hover:scale-110 transition-transform">
                    <activity.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-500">{activity.score}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No recent activity found. Start a tryout!</div>
          )}
        </div>
        <button className="mt-8 w-full bg-[#F5F5F0] text-[#1a1a1a] font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all text-sm flex items-center justify-center gap-2">
          View Full History
          <ChevronRight size={16} />
        </button>
      </section>
    </div>
  );
}
