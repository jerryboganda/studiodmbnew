import React, { useState } from 'react';
import { X, Sliders, Check, ChevronRight } from 'lucide-react';

interface MatchTunerModalProps {
  onClose: () => void;
}

const MatchTunerModal: React.FC<MatchTunerModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Match Tuner</h2>
                <p className="text-sm text-slate-500">Quickly refine your recommendations.</p>
            </div>
            <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <h3 className="font-bold text-slate-900">What's your biggest dealbreaker?</h3>
                    <div className="space-y-2">
                        {['Smoking', 'Dietary Restrictions', 'Relocation', 'Career Ambition', 'None'].map(opt => (
                            <button key={opt} onClick={() => setStep(2)} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 font-medium text-slate-700 transition-all flex justify-between group">
                                {opt}
                                <ChevronRight className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" size={18} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
             {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <h3 className="font-bold text-slate-900">Ideal partner career level?</h3>
                    <div className="space-y-2">
                        {['Established Specialist', 'Resident / In-training', 'Medical Student', 'Non-medical accepted'].map(opt => (
                            <button key={opt} onClick={() => setStep(3)} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 font-medium text-slate-700 transition-all flex justify-between group">
                                {opt}
                                <ChevronRight className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" size={18} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
             {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <h3 className="font-bold text-slate-900">Family involvement level?</h3>
                    <div className="space-y-2">
                        {['High - Joint Family', 'Moderate - Frequent visits', 'Low - Independent living'].map(opt => (
                            <button key={opt} onClick={onClose} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 font-medium text-slate-700 transition-all flex justify-between group">
                                {opt}
                                <Check className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" size={18} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
        
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
            Step {step} of 3
        </div>
      </div>
    </div>
  );
};

export default MatchTunerModal;
