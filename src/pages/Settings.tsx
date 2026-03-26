import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Palette } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto transition-colors duration-300">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-[#5A5A40] dark:text-[#8B8B6B]" />
        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white">Settings</h1>
      </div>

      <div className="bg-white dark:bg-[#151619] rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-serif font-bold flex items-center gap-3 mb-6 dark:text-white">
            <User className="w-6 h-6 text-[#5A5A40] dark:text-[#8B8B6B]" /> Account Settings
          </h2>
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Display Name</label>
              <input type="text" className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5A5A40]/20 dark:text-white transition-all" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm opacity-60 cursor-not-allowed dark:text-white" placeholder="your.email@example.com" disabled />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-serif italic">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-serif font-bold flex items-center gap-3 mb-6 dark:text-white">
            <Bell className="w-6 h-6 text-[#5A5A40] dark:text-[#8B8B6B]" /> Notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-[#5A5A40] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email notifications for new tryouts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-[#5A5A40] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study reminders</span>
            </label>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-serif font-bold flex items-center gap-3 mb-6 dark:text-white">
            <Shield className="w-6 h-6 text-[#5A5A40] dark:text-[#8B8B6B]" /> Privacy
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-[#5A5A40] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show my profile on leaderboard</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
