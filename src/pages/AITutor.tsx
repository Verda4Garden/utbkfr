import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya Tutor AI kamu. Ada materi UTBK atau soal yang ingin kamu tanyakan? Saya siap membantu menjelaskan konsep-konsep sulit.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are an expert UTBK (Ujian Tulis Berbasis Komputer) tutor for Indonesian students. Your goal is to help students understand difficult concepts in subtests like Penalaran Umum, Pengetahuan Kuantitatif, Literasi Bahasa Indonesia, and Literasi Bahasa Inggris. Be encouraging, clear, and provide step-by-step explanations. Use Indonesian as the primary language.",
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Maaf, saya tidak bisa memproses permintaan tersebut.' }]);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi nanti.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Halo! Saya Tutor AI kamu. Ada materi UTBK atau soal yang ingin kamu tanyakan? Saya siap membantu menjelaskan konsep-konsep sulit.' }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white flex items-center gap-3">
            AI Tutor <Sparkles className="text-[#5A5A40] dark:text-[#8B8B6B]" size={24} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-serif italic mt-1">Your personal UTBK expert, available 24/7.</p>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-[#151619] rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-[#5A5A40] text-white' : 'bg-[#F5F5F0] dark:bg-gray-800 text-[#5A5A40] dark:text-[#8B8B6B]'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#5A5A40] text-white rounded-tr-none' 
                    : 'bg-[#F5F5F0] dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F5F0] dark:bg-gray-800 flex items-center justify-center">
                  <Bot size={16} className="text-[#5A5A40] dark:text-[#8B8B6B]" />
                </div>
                <div className="bg-[#F5F5F0] dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan sesuatu tentang UTBK..."
              className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-3 bg-[#5A5A40] text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-3 uppercase tracking-widest font-bold">
            AI Tutor can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
