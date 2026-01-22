import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock, X } from 'lucide-react';

interface StepUpVerificationModalProps {
  actionLabel: string;
  onVerified: () => void;
  onCancel: () => void;
}

const StepUpVerificationModal: React.FC<StepUpVerificationModalProps> = ({ actionLabel, onVerified, onCancel }) => {
  const [method, setMethod] = useState<'biometric' | 'password'>('biometric');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        onVerified();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100">
            <div className="size-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Lock size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Security Verification</h2>
            <p className="text-sm text-slate-500 mt-1">
                For your security, please verify your identity to <b>{actionLabel}</b>.
            </p>
        </div>

        <div className="p-6">
            {method === 'biometric' ? (
                <div className="text-center space-y-6">
                    <button 
                        onClick={handleVerify}
                        className="size-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 hover:text-primary hover:bg-primary/10 hover:border-2 hover:border-primary transition-all cursor-pointer"
                    >
                        <Fingerprint size={48} strokeWidth={1.5} />
                    </button>
                    <p className="text-xs font-bold text-slate-500">Touch ID / Face ID</p>
                    
                    <button onClick={() => setMethod('password')} className="text-sm text-primary font-bold hover:underline">
                        Use Password Instead
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Account Password</label>
                        <input 
                            type="password" 
                            autoFocus
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={handleVerify}
                        disabled={loading || password.length < 4}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Verifying...' : 'Confirm'}
                    </button>
                    
                    <div className="text-center">
                         <button onClick={() => setMethod('biometric')} className="text-sm text-slate-500 hover:text-slate-800">
                             Use Biometrics
                         </button>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <button onClick={onCancel} className="text-sm font-bold text-slate-500 hover:text-slate-700">
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepUpVerificationModal;
