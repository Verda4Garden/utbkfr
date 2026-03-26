import { User } from 'firebase/auth';
import { logout } from '../firebase';
import { LogOut, Bell, User as UserIcon, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: User;
  userData: any;
}

export default function Navbar({ user, userData }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
          <Stethoscope size={20} />
        </div>
        <span className="font-serif font-bold text-xl tracking-tight hidden md:block">MedPrep</span>
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center gap-2 bg-[#F5F5F0] px-4 py-2 rounded-full">
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Level {userData?.level || 1}</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5A5A40] transition-all duration-500" 
              style={{ width: `${(userData?.xp % 1000) / 10}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#5A5A40]">{userData?.xp || 0} XP</span>
        </div>

        <button className="p-2 text-gray-400 hover:text-[#5A5A40] transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <Link to="/profile" className="flex items-center gap-2 group">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-[#5A5A40] transition-colors"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold leading-none">{user.displayName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium">{userData?.targetFK || 'FK Aspirant'}</p>
            </div>
          </Link>
          <button 
            onClick={() => logout()}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
