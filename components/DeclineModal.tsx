import React, { useState } from 'react';
import { X, MessageSquareOff, AlertCircle } from 'lucide-react';

interface DeclineModalProps {
  onClose: () => void;
}

const DeclineModal: React.FC<DeclineModalProps> = ({ onClose }) => {
  const [reason, setReason] = useState<string>('');
  
  const reasons = [
    "Location mismatch",
    "Career path alignment",
    "Age gap preference",
    "Horoscope/Astrology mismatch",
    "Looking for different values",
    "Other (Private)"
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquareOff className="text-slate-400" size={20} />
                Decline Proposal
            </h2>
            <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>

        <div className="p-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 mb-6">
                <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                    Declining is private. We can share a standard polite message, or you can provide a specific reason (visible only to analytics).
                </p>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-3">Select a reason (Optional)</h3>
            <div className="space-y-2">
                {reasons.map(r => (
                    <label key={r} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input 
                            type="radio" 
                            name="declineReason" 
                            className="accent-primary size-4"
                            checked={reason === r}
                            onChange={() => setReason(r)}
                        />
                        <span className="text-sm text-slate-700">{r}</span>
                    </label>
                ))}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Message Preview</h4>
                <p className="text-sm text-slate-600 italic">
                    "Thank you for your interest. While your profile is impressive, I don't feel we are the right match at this time. I wish you the best in your search."
                </p>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800">Cancel</button>
            <button onClick={onClose} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm">
                Send Decline
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;
