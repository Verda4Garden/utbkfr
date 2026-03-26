import React from 'react';
import { HelpCircle, Book, MessageCircle, FileQuestion } from 'lucide-react';

export default function HelpCenter() {
  const faqs = [
    {
      q: "How do I take a tryout?",
      a: "Navigate to the Tryouts tab on the sidebar, select an available tryout, and click 'Start'."
    },
    {
      q: "How does the AI Tutor work?",
      a: "In the Materials section, you can ask the AI Tutor any question related to UTBK/SNBT. It uses advanced AI to provide step-by-step explanations."
    },
    {
      q: "How is my score calculated?",
      a: "Scores are calculated based on the IRT (Item Response Theory) system, similar to the real UTBK, where harder questions give more points."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto transition-colors duration-300">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="w-8 h-8 text-[#5A5A40] dark:text-[#8B8B6B]" />
        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white">Help Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-[#151619] p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 text-center group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#5A5A40] dark:text-[#8B8B6B] mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Book size={32} />
          </div>
          <h3 className="font-serif font-bold text-lg mb-2 dark:text-white">Documentation</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-serif italic leading-relaxed">Read our detailed guides on how to use the platform.</p>
        </div>
        <div className="bg-white dark:bg-[#151619] p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 text-center group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#5A5A40] dark:text-[#8B8B6B] mx-auto mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle size={32} />
          </div>
          <h3 className="font-serif font-bold text-lg mb-2 dark:text-white">Contact Support</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-serif italic leading-relaxed">Need help? Reach out to our support team.</p>
        </div>
        <div className="bg-white dark:bg-[#151619] p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 text-center group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#5A5A40] dark:text-[#8B8B6B] mx-auto mb-6 group-hover:scale-110 transition-transform">
            <FileQuestion size={32} />
          </div>
          <h3 className="font-serif font-bold text-lg mb-2 dark:text-white">FAQ</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-serif italic leading-relaxed">Find answers to commonly asked questions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151619] rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
        <h2 className="text-2xl font-serif font-bold mb-8 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-50 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-serif font-bold text-[#1a1a1a] dark:text-white mb-3">{faq.q}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
