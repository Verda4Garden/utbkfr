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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="w-8 h-8 text-[#5A5A40]" />
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Help Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e5e5] text-center">
          <Book className="w-8 h-8 text-[#5A5A40] mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Documentation</h3>
          <p className="text-sm text-gray-600">Read our detailed guides on how to use the platform.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e5e5] text-center">
          <MessageCircle className="w-8 h-8 text-[#5A5A40] mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Contact Support</h3>
          <p className="text-sm text-gray-600">Need help? Reach out to our support team.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e5e5] text-center">
          <FileQuestion className="w-8 h-8 text-[#5A5A40] mx-auto mb-3" />
          <h3 className="font-semibold mb-2">FAQ</h3>
          <p className="text-sm text-gray-600">Find answers to commonly asked questions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
