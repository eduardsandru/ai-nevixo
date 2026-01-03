"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AINevixo() {
  const [input, setInput] = useState('');
  const [activeModel, setActiveModel] = useState('GPT-5');
  const [isThinking, setIsThinking] = useState(false);

  const modelColors = {
    'GPT-5': 'from-cyan-500 to-blue-600',
    'Claude 4': 'from-orange-400 to-red-500',
    'Gemini 3': 'from-blue-400 to-purple-600',
    'Sora 3': 'from-pink-500 to-rose-600'
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden">
      <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md fixed w-full z-50">
        <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">AI NEVIXO</h1>
        <div className="flex gap-4 text-sm text-gray-400"><span>Models: 2026 Active</span><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1.5" /></div>
      </nav>

      <main className="max-w-4xl mx-auto pt-40 px-6 flex flex-col items-center">
        <motion.div 
          animate={{ scale: isThinking ? [1, 1.2, 1] : [1, 1.05, 1], rotate: isThinking ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`w-40 h-40 rounded-full bg-gradient-to-tr ${modelColors[activeModel]} blur-2xl opacity-70 shadow-[0_0_80px_rgba(6,182,212,0.4)]`}
        />
        
        <h2 className="mt-12 text-5xl font-extralight text-center tracking-tight">Cu ce te pot ajuta astăzi?</h2>

        <div className="w-full mt-16 relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Introduceți un prompt pentru text, imagine sau video..."
            className="w-full bg-[#18181B]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-40 focus:outline-none focus:border-cyan-500/50 transition-all shadow-2xl text-xl"
          />
          
          <div className="absolute bottom-6 left-6 flex gap-3">
            {Object.keys(modelColors).map((model) => (
              <button
                key={model}
                onClick={() => setActiveModel(model)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeModel === model ? 'bg-white text-black scale-110' : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                {model}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsThinking(!isThinking)}
            className="absolute bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            TRIMITE
          </button>
        </div>
      </main>
    </div>
  );
}
