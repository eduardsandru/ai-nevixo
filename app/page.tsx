"use client";
import "./globals.css";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModelType = 'GPT-5' | 'Claude 4' | 'Gemini 3' | 'Sora 3';

export default function AINevixo() {
  const [input, setInput] = useState('');
  const [activeModel, setActiveModel] = useState<ModelType>('GPT-5');
  const [isThinking, setIsThinking] = useState(false);
  
  // Memoria Infinită: Stocăm istoricul conversației
  const [history, setHistory] = useState<{role: string, content: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll la ultimul mesaj
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isThinking]);

  const modelColors: Record<ModelType, string> = {
    'GPT-5': 'from-cyan-500 to-blue-600',
    'Claude 4': 'from-orange-400 to-red-500',
    'Gemini 3': 'from-blue-400 to-purple-600',
    'Sora 3': 'from-pink-500 to-rose-600'
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = input;
    setInput("");
    setIsThinking(true);

    // Actualizăm istoricul local cu mesajul utilizatorului
    const newHistory = [...history, { role: "user", content: userMessage }];
    setHistory(newHistory);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessage, 
          model: activeModel,
          history: newHistory // Trimitem memoria către API
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.text || "Eroare server");

      // Adăugăm răspunsul AI în memorie
      setHistory([...newHistory, { role: "assistant", content: data.text }]);
    } catch (error: any) {
      setHistory([...newHistory, { role: "assistant", content: "Eroare: " + error.message }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md fixed w-full z-50">
        <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent italic">AI NEVIXO</h1>
        <div className="flex gap-4 text-sm text-gray-400 items-center">
          <span className="hidden md:inline">Quantum Engine 2026</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-32 pb-40 px-6 flex flex-col items-center">
        {/* Nucleul Pulsant */}
        <motion.div 
          animate={{ 
            scale: isThinking ? [1, 1.15, 1] : [1, 1.02, 1],
            rotate: isThinking ? 360 : 0,
            opacity: isThinking ? 1 : 0.7
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr ${(modelColors as any)[activeModel]} blur-2xl shadow-[0_0_100px_rgba(6,182,212,0.3)] mb-10`}
        />

        {/* Zona Mesajelor (Chat History) */}
        <div className="w-full space-y-8 mb-10">
          {history.length === 0 && !isThinking && (
            <h2 className="text-4xl md:text-5xl font-extralight text-center tracking-tight opacity-50 pt-10">
              Sunt pregătit. Ce explorăm?
            </h2>
          )}
          
          <AnimatePresence>
            {history.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-6 rounded-3xl backdrop-blur-sm ${
                  msg.role === 'user' 
                  ? 'bg-white/10 border border-white/10 rounded-tr-none' 
                  : 'bg-blue-500/5 border border-blue-500/20 rounded-tl-none text-blue-50'
                }`}>
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 p-6 rounded-3xl animate-pulse">Analizez datele...</div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Fixat Jos */}
        <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B] to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder="Întreabă despre YouTube, fișiere sau cod..."
              className="w-full bg-[#18181B]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 pr-32 h-20 md:h-28 focus:outline-none focus:border-cyan-500/50 transition-all shadow-2xl text-lg resize-none"
            />
            
            <div className="absolute bottom-4 left-6 flex gap-2 overflow-x-auto max-w-[60%] no-scrollbar">
              {(Object.keys(modelColors) as ModelType[]).map((model) => (
                <button 
                  key={model} 
                  onClick={() => setActiveModel(model)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all whitespace-nowrap ${
                    activeModel === model ? 'bg-white text-black' : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSend}
              disabled={isThinking}
              className="absolute top-1/2 -translate-y-1/2 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-2xl font-bold hover:scale-105 disabled:opacity-50 transition-all shadow-lg text-sm"
            >
              {isThinking ? "..." : "TRIMITE"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
