import { useState } from 'react';
import { User } from 'firebase/auth';
import { logout } from '../firebase';
import { LogOut, Bell, User as UserIcon, Stethoscope, Sun, Moon, Menu, X, LayoutDashboard, GraduationCap, BookOpen, Trophy, Sparkles, Bookmark, Settings, HelpCircle, Target, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: User;
  userData: any;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

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

export default function Navbar({ user, userData, isDarkMode, setIsDarkMode }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-[#5A5A40] md:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#5A5A40]/20">
              <Stethoscope size={20} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight hidden sm:block dark:text-white">MedPrep</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-400 hover:text-[#5A5A40] dark:hover:text-yellow-400 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="hidden md:flex items-center gap-2 bg-[#F5F5F0] dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-bold text-[#5A5A40] dark:text-[#8B8B6B] uppercase tracking-wider">Level {userData?.level || 1}</span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5A5A40] transition-all duration-500" 
                style={{ width: `${(userData?.xp % 1000) / 10}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#5A5A40] dark:text-[#8B8B6B]">{userData?.xp || 0} XP</span>
          </div>

          <button className="p-2 text-gray-400 hover:text-[#5A5A40] dark:hover:text-white transition-colors relative rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-100 dark:border-gray-800">
            <Link to="/profile" className="flex items-center gap-2 group">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 group-hover:border-[#5A5A40] transition-colors"
              />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold leading-none dark:text-white">{user.displayName}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium dark:text-gray-500">{userData?.targetFK || 'FK Aspirant'}</p>
              </div>
            </Link>
            <button 
              onClick={() => logout()}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#0a0a0a] z-[70] md:hidden flex flex-col shadow-2xl border-r border-gray-100 dark:border-gray-800"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
                    <Stethoscope size={16} />
                  </div>
                  <span className="font-serif font-bold text-lg dark:text-white">MedPrep</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-4 px-4">Menu</p>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                        isActive 
                          ? 'bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B]'
                      }`}
                    >
                      <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-4 px-4">Support</p>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B] transition-all"
                  >
                    <Settings size={20} />
                    <span className="font-medium text-sm">Settings</span>
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5A5A40] dark:hover:text-[#8B8B6B] transition-all"
                  >
                    <HelpCircle size={20} />
                    <span className="font-medium text-sm">Help Center</span>
                  </Link>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
