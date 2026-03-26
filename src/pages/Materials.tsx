import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Play, ChevronRight, Search, Filter, Stethoscope, Zap, X, Send, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { getTutorResponse } from '../services/geminiService';

export default function Materials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTutor, setShowTutor] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        let q;
        if (filter === 'all') {
          q = collection(db, 'materials');
        } else {
          q = query(collection(db, 'materials'), where('section', '==', filter));
        }
        
        const querySnapshot = await getDocs(q);
        let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        
        // Client-side search filtering
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          results = results.filter(m => 
            m.title.toLowerCase().includes(query) || 
            m.topic.toLowerCase().includes(query) ||
            m.content.toLowerCase().includes(query)
          );
        }
        
        setMaterials(results);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [filter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">Learning Center</h1>
          <p className="text-gray-500 font-serif italic mt-1">Master the concepts, ace the UTBK.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A5A40] transition-colors" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-100 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] transition-all w-full md:w-64"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            {['all', 'TPS', 'SAINTEK'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-[#5A5A40] text-white shadow-md' : 'text-gray-400 hover:text-[#5A5A40]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((material, i) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedMaterial(material)}
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#5A5A40]/5 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-[#F5F5F0] rounded-2xl flex items-center justify-center text-[#5A5A40] group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{material.section}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-2 group-hover:text-[#5A5A40] transition-colors">{material.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-serif italic">{material.content}</p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-widest">{material.topic}</span>
                <div className="flex items-center gap-2 text-[#5A5A40] font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Start Learning
                  <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Material Detail Modal */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#F5F5F0] w-full max-w-5xl h-full max-h-[90vh] rounded-[48px] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-xl">{selectedMaterial.title}</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{selectedMaterial.section} • {selectedMaterial.topic}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMaterial(null)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                {/* Video Section */}
                {selectedMaterial.videoUrl && (
                  <div className="aspect-video w-full bg-black rounded-[40px] overflow-hidden shadow-2xl relative group">
                    <iframe 
                      src={selectedMaterial.videoUrl.replace('watch?v=', 'embed/')} 
                      className="w-full h-full border-none"
                      allowFullScreen
                      title="Video Lesson"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="prose prose-lg prose-slate max-w-none">
                  <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
                    <ReactMarkdown>{selectedMaterial.content}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="bg-white px-8 py-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-orange-500" />
                  <span className="text-sm font-bold text-gray-500">Need help? Ask our AI Tutor about this topic.</span>
                </div>
                <button 
                  onClick={() => setShowTutor(true)}
                  className="bg-[#5A5A40] text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#5A5A40]/20"
                >
                  Open AI Tutor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Tutor Button */}
      {!showTutor && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowTutor(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#5A5A40] text-white rounded-full shadow-2xl shadow-[#5A5A40]/40 flex items-center justify-center z-[100] group"
        >
          <Zap size={28} className="group-hover:animate-pulse" />
        </motion.button>
      )}

      {/* AI Tutor Drawer */}
      <AnimatePresence>
        {showTutor && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-white shadow-2xl z-[200] flex flex-col border-l border-gray-100"
          >
            <div className="p-6 bg-[#5A5A40] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">AI Tutor</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1 font-bold">FK Specialist</p>
                </div>
              </div>
              <button onClick={() => setShowTutor(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <AITutorChat context={selectedMaterial?.title} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AITutorChat({ context }: { context?: string }) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', text: `Hi! I'm your MedPrep AI Tutor. ${context ? `I see you're studying **${context}**. ` : ''}How can I help you with your UTBK preparation today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getTutorResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F0]/30">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
              msg.role === 'user' 
                ? 'bg-[#5A5A40] text-white rounded-tr-none' 
                : 'bg-white text-[#1a1a1a] shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#5A5A40]" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-[#F5F5F0] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-[#5A5A40] text-white p-4 rounded-2xl hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#5A5A40]/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
