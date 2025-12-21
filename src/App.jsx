import React, { useState } from 'react';
import { RotateCcw, Check, BookOpen, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { ZIKR_SEQUENCE } from './data/zikrData';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);

  const currentZikr = ZIKR_SEQUENCE[currentStep];
  const totalSteps = ZIKR_SEQUENCE.length;

  const triggerHaptic = (style = 'light') => {
    if (navigator.vibrate) {
      if (style === 'heavy') navigator.vibrate(20);
      else navigator.vibrate(5);
    }
  };

  const handleTap = () => {
    if (isCompleted || animating) return;
    triggerHaptic('light');

    if (count + 1 >= currentZikr.target) {
      setCount(currentZikr.target);
      setAnimating(true);
      triggerHaptic('heavy');
      setTimeout(() => {
        if (currentStep + 1 < totalSteps) handleNext();
        else { setIsCompleted(true); setAnimating(false); }
      }, 350);
    } else {
      setCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setAnimating(false); setCount(0); setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setAnimating(false); setCount(0); setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    if (window.confirm("Restart session?")) {
      setCurrentStep(0); setCount(0); setIsCompleted(false);
    }
  };

  const getColors = () => {
    const map = {
      blue: { ring: '#3B82F6', text: 'text-blue-600' },
      teal: { ring: '#0D9488', text: 'text-teal-600' },
      gold: { ring: '#F59E0B', text: 'text-amber-600' }
    };
    return map[currentZikr?.color] || map.teal;
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = count / (currentZikr?.target || 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 font-sans flex flex-col relative overflow-hidden selection:bg-teal-100">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10 h-full">
        
        {/* HEADER */}
        <div className="px-6 pt-6 pb-2 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Al-Wird Al-Yawmi</span>
            <span className={`text-sm font-medium ${getColors().text} transition-colors duration-300`}>
              {!isCompleted ? `Step ${currentStep + 1} of ${totalSteps}` : 'Completed'}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowTransliteration(!showTransliteration)} className={`p-2 rounded-full transition-all ${showTransliteration ? 'bg-gray-200 text-gray-800' : 'bg-white/50 text-gray-400'}`}>
              <Globe size={18} />
            </button>
            <button onClick={handleReset} className="p-2 bg-white/50 hover:bg-white rounded-full transition-all shadow-sm border border-gray-100">
              <RotateCcw size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          {!isCompleted ? (
            <div className="w-full flex flex-col items-center h-full">
              <div className="flex-1 flex items-center justify-center w-full max-h-[45vh]">
                <div className="relative cursor-pointer group select-none touch-manipulation transform active:scale-95 transition-transform" onClick={handleTap} style={{ WebkitTapHighlightColor: 'transparent' }}>
                  <svg className="transform -rotate-90 w-64 h-64 md:w-72 md:h-72 drop-shadow-xl">
                    <circle cx="50%" cy="50%" r={radius} stroke="#E5E7EB" strokeWidth="10" fill="white" />
                    <circle cx="50%" cy="50%" r={radius} stroke={getColors().ring} strokeWidth="10" fill="transparent" strokeLinecap="round" style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, transition: "stroke-dashoffset 0.2s ease-out, stroke 0.5s ease" }} />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-6xl font-light text-gray-800 tabular-nums tracking-tighter">{count}</span>
                    <div className="h-px w-8 bg-gray-200 my-1"></div>
                    <span className="text-gray-400 font-medium text-lg">{currentZikr.target}</span>
                  </div>
                </div>
              </div>

              <div className={`w-full px-6 pb-2 flex flex-col items-center justify-start flex-1 min-h-0 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                {currentZikr.note && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded-full mb-2 shrink-0"><BookOpen size={10} /> {currentZikr.note}</span>}
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 shrink-0">{currentZikr.label}</h2>
                <div className="overflow-y-auto scrollbar-hide text-center w-full max-w-sm">
                  <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-serif dir-rtl" style={{ lineHeight: '1.6' }}>{currentZikr.arabic}</p>
                  {showTransliteration && currentZikr.transliteration && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                      <p className="text-sm md:text-base text-gray-500 font-medium italic leading-relaxed">{currentZikr.transliteration}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in-up p-8 text-center h-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50"><Check size={40} className="text-green-600" /></div>
              <h1 className="text-3xl font-light text-gray-800">Alhamdulillah</h1>
              <p className="text-gray-500">You have completed your daily wird.</p>
              <button onClick={handleReset} className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium shadow-lg active:scale-95 transition-all">Start Again</button>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        {!isCompleted && (
          <div className="px-6 py-4 shrink-0 grid grid-cols-2 gap-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <button onClick={handlePrev} disabled={currentStep === 0} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium disabled:opacity-30 active:bg-gray-200 transition-colors"><ChevronLeft size={18} /> Prev</button>
            <button onClick={handleNext} disabled={currentStep === totalSteps - 1} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-30 active:bg-gray-800 transition-colors">Next <ChevronRight size={18} /></button>
          </div>
        )}
      </div>
    </div>
  );
}


                        
