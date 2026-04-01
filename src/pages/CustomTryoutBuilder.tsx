import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Settings, Play, Info, CheckSquare } from 'lucide-react';
import { questions, Category, Difficulty, UTBK_TOPICS } from '../data/questions';
import { cn } from '../lib/utils';

export default function CustomTryoutBuilder() {
  const navigate = useNavigate();
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['Pengetahuan Kuantitatif']);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(['Mudah', 'Sedang', 'Susah']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const categories: Category[] = [
    'Penalaran Umum',
    'Pengetahuan Kuantitatif',
    'Pengetahuan dan Pemahaman Umum',
    'Kemampuan Memahami Bacaan dan Menulis',
    'Penalaran Matematika',
    'Literasi dalam Bahasa Indonesia',
    'Literasi dalam Bahasa Inggris'
  ];
  const difficulties: Difficulty[] = ['Mudah', 'Sedang', 'Susah'];

  // Calculate available topics based on selected categories
  const availableTopics = useMemo(() => {
    const topics = new Set<string>();
    questions.forEach(q => {
      if (selectedCategories.includes(q.category)) {
        topics.add(q.topic);
      }
    });
    return Array.from(topics).sort();
  }, [selectedCategories]);

  // Auto-select all available topics when categories change, or keep valid ones
  useEffect(() => {
    setSelectedTopics(availableTopics);
  }, [availableTopics]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleDifficulty = (diff: Difficulty) => {
    setSelectedDifficulties(prev => 
      prev.includes(diff) 
        ? prev.filter(d => d !== diff)
        : [...prev, diff]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => 
      selectedCategories.includes(q.category) && 
      selectedDifficulties.includes(q.difficulty) &&
      selectedTopics.includes(q.topic)
    );
  }, [selectedCategories, selectedDifficulties, selectedTopics]);

  const maxQuestions = filteredQuestions.length;

  // Ensure question count doesn't exceed available questions
  if (questionCount > maxQuestions && maxQuestions > 0) {
    setQuestionCount(maxQuestions);
  }

  const handleStartCustomTryout = () => {
    if (maxQuestions === 0) return;
    
    // Shuffle and slice
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, maxQuestions));
    
    navigate('/tryout-custom', { state: { questions: selectedQuestions } });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-6">
          <Settings size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Custom Tryout Builder</h1>
        <p className="text-lg text-slate-600 dark:text-gray-400">
          Buat sesi latihanmu sendiri. Pilih materi, topik spesifik, tingkat kesulitan, dan jumlah soal sesuai kebutuhan belajarmu hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Categories Selection */}
          <section className="bg-white dark:bg-[#151619] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-500" />
              Pilih Kategori Materi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all",
                    selectedCategories.includes(category)
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-gray-700 text-slate-600 dark:text-gray-400"
                  )}
                >
                  <div className="font-semibold">{category}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Topics Selection */}
          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-[#151619] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CheckSquare className="text-emerald-500" />
                    Pilih Topik Spesifik
                  </h2>
                  <button 
                    onClick={() => setSelectedTopics(selectedTopics.length === availableTopics.length ? [] : availableTopics)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    {selectedTopics.length === availableTopics.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                {availableTopics.length === 0 ? (
                  <p className="text-slate-500 dark:text-gray-400 text-sm">Belum ada topik tersedia untuk kategori yang dipilih.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {availableTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                          selectedTopics.includes(topic)
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                            : "bg-white dark:bg-[#1a1b1e] border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:border-emerald-300"
                        )}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Difficulties Selection */}
          <section className="bg-white dark:bg-[#151619] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Tingkat Kesulitan</h2>
            <div className="flex flex-wrap gap-4">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => toggleDifficulty(diff)}
                  className={cn(
                    "px-6 py-3 rounded-xl border-2 font-semibold transition-all",
                    selectedDifficulties.includes(diff)
                      ? "border-slate-800 bg-slate-800 text-white dark:border-white dark:bg-white dark:text-slate-900"
                      : "border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-700"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Summary & Action Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#151619] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Ringkasan Tryout</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-gray-800">
                <span className="text-slate-500 dark:text-gray-400">Kategori</span>
                <span className="font-semibold text-slate-800 dark:text-white text-right">{selectedCategories.length || 0} dipilih</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-gray-800">
                <span className="text-slate-500 dark:text-gray-400">Topik</span>
                <span className="font-semibold text-slate-800 dark:text-white text-right">{selectedTopics.length || 0} dipilih</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-gray-800">
                <span className="text-slate-500 dark:text-gray-400">Kesulitan</span>
                <span className="font-semibold text-slate-800 dark:text-white text-right">{selectedDifficulties.length || 0} dipilih</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-gray-800">
                <span className="text-slate-500 dark:text-gray-400">Bank Soal Tersedia</span>
                <span className={cn(
                  "font-bold text-lg",
                  maxQuestions > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                )}>
                  {maxQuestions} Soal
                </span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">
                Jumlah Soal yang Dikerjakan: <span className="text-indigo-600 dark:text-indigo-400 text-lg">{questionCount}</span>
              </label>
              <input 
                type="range" 
                min={Math.min(1, maxQuestions)} 
                max={Math.max(1, maxQuestions)} 
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                disabled={maxQuestions === 0}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>1</span>
                <span>{maxQuestions}</span>
              </div>
            </div>

            {maxQuestions === 0 && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-xl mb-6 text-sm">
                <Info className="shrink-0 mt-0.5" size={18} />
                <p>Tidak ada soal yang cocok dengan filtermu. Coba ubah kategori, topik, atau tingkat kesulitan.</p>
              </div>
            )}

            <button
              onClick={handleStartCustomTryout}
              disabled={maxQuestions === 0}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <Play size={20} className="fill-current" />
              Mulai Tryout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
