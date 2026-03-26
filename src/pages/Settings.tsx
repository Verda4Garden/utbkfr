import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Palette } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-[#5A5A40]" />
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Settings</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] overflow-hidden">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#5A5A40]" /> Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="your.email@example.com" disabled />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[#5A5A40]" /> Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-[#5A5A40]" defaultChecked />
              <span>Email notifications for new tryouts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-[#5A5A40]" defaultChecked />
              <span>Study reminders</span>
            </label>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#5A5A40]" /> Privacy
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-[#5A5A40]" defaultChecked />
              <span>Show my profile on leaderboard</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
