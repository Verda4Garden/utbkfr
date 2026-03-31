import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, BrainCircuit } from 'lucide-react';
import { questions } from '../data/questions';
import { cn } from '../lib/utils';
import 'katex/dist/katex.min.css';

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question?.correctAnswerIndex;

  const handleSelectAnswer = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);
    if (selectedAnswer === question.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsFinished(true);
    // Add a small delay for smooth animation
    setTimeout(() => setIsFinished(false), 100);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    if (percentage === 100) message = 'Sempurna! Kamu sangat siap untuk UTBK SNBT!';
    else if (percentage >= 70) message = 'Bagus sekali! Sedikit lagi latihan pasti bisa maksimal.';
    else if (percentage >= 40) message = 'Lumayan, tapi masih perlu banyak latihan ya.';
    else message = 'Jangan menyerah! Terus belajar dan pahami konsep dasarnya.';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8 bg-white dark:bg-[#151619] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center"
      >
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <BrainCircuit size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Tryout Selesai!</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-8">Berikut adalah hasil pengerjaanmu.</p>
        
        <div className="bg-slate-50 dark:bg-gray-800/50 rounded-2xl p-8 mb-8">
          <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-4">{score} <span className="text-2xl text-slate-400 dark:text-gray-500 font-medium">/ {questions.length}</span></div>
          <p className="text-lg font-medium text-slate-700 dark:text-gray-300">{message}</p>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors active:scale-95"
        >
          <RotateCcw size={20} />
          Ulangi Tryout
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            Soal {currentQuestionIndex + 1} dari {questions.length}
          </span>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Skor: {score}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#151619] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Question Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold">
                {question.category}
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold",
                question.difficulty === 'Mudah' && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
                question.difficulty === 'Sedang' && "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                question.difficulty === 'Susah' && "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
              )}>
                {question.difficulty}
              </span>
            </div>
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {question.text}
              </ReactMarkdown>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-[#1a1b1e]">
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === question.correctAnswerIndex;
                
                let optionStateClass = "bg-white dark:bg-[#151619] border-slate-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-gray-300";
                
                if (isAnswerChecked) {
                  if (isCorrectOption) {
                    optionStateClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500 dark:ring-emerald-500/50";
                  } else if (isSelected && !isCorrectOption) {
                    optionStateClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-500/50 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500 dark:ring-rose-500/50";
                  } else {
                    optionStateClass = "bg-white dark:bg-[#151619] border-slate-200 dark:border-gray-800 opacity-50";
                  }
                } else if (isSelected) {
                  optionStateClass = "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-500/50 text-indigo-800 dark:text-indigo-300 ring-1 ring-indigo-500 dark:ring-indigo-500/50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswerChecked}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                      optionStateClass
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                        isSelected && !isAnswerChecked ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400",
                        isAnswerChecked && isCorrectOption && "bg-emerald-500 text-white",
                        isAnswerChecked && isSelected && !isCorrectOption && "bg-rose-500 text-white"
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {option}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    {isAnswerChecked && isCorrectOption && <CheckCircle2 className="text-emerald-500" />}
                    {isAnswerChecked && isSelected && !isCorrectOption && <XCircle className="text-rose-500" />}
                  </button>
                );
              })}
            </div>

            {/* Actions & Explanation */}
            <div className="mt-8">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                >
                  Cek Jawaban
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className={cn(
                    "p-6 rounded-2xl border",
                    isCorrect ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50" : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50"
                  )}>
                    <h3 className={cn(
                      "text-lg font-bold mb-3 flex items-center gap-2",
                      isCorrect ? "text-emerald-800 dark:text-emerald-400" : "text-rose-800 dark:text-rose-400"
                    )}>
                      {isCorrect ? (
                        <><CheckCircle2 /> Jawabanmu Benar!</>
                      ) : (
                        <><XCircle /> Jawabanmu Kurang Tepat</>
                      )}
                    </h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed">
                      <div className="font-semibold text-slate-800 dark:text-gray-200 mb-2">Pembahasan:</div>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {question.explanation}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-gray-100 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Akhir'}
                    <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
