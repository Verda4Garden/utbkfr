import { LayoutDashboard, BookOpen, Trophy, User as UserIcon, Settings, HelpCircle, GraduationCap, Bookmark, Sparkles, Target, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: GraduationCap, label: 'Tryouts', path: '/tryouts' },
  { icon: BookOpen, label: 'Materials', path: '/materials' },
  { icon: Brain, label: 'Flashcards', path: '/flashcards' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Sparkles, label: 'AI Tutor', path: '/ai-tutor' },
  { icon: Target, label: 'FK Predictor', path: '/predictor' },
  { icon: Bookmark, label: 'Saved Questions', path: '/saved' },
  { icon: UserIcon, label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-80px)] sticky top-20 bg-white/50 dark:bg-[#0a0a0a]/50 border-r border-gray-100 dark:border-gray-800 p-6 overflow-y-auto">
      <div className="space-y-2">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-4 px-4">Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B]'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-4 px-4">Support</p>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B] transition-all"
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <Link
          to="/help"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B] transition-all"
        >
          <HelpCircle size={20} />
          <span className="font-medium text-sm">Help Center</span>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-[#5A5A40]/5 dark:bg-[#5A5A40]/10 rounded-3xl border border-[#5A5A40]/10 dark:border-[#5A5A40]/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-bold text-[#5A5A40] dark:text-[#8B8B6B] uppercase tracking-wider">Live Support</p>
        </div>
        <p className="text-xs text-[#5A5A40]/70 dark:text-[#8B8B6B]/70 font-serif italic">Need help with a question? Ask our AI Tutor anytime.</p>
      </div>
    </aside>
  );
}
