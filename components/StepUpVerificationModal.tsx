import React, { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, Lock, X, Loader2, AlertTriangle, KeyRound } from 'lucide-react';
import api, { parseApiError } from '../services/api';

interface StepUpVerificationModalProps {
  actionLabel: string;
  onVerified: (token?: string) => void;
  onCancel: () => void;
}

const StepUpVerificationModal: React.FC<StepUpVerificationModalProps> = ({ actionLabel, onVerified, onCancel }) => {
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepUpToken, setStepUpToken] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [purpose, setPurpose] = useState<string>('');

  // Initiate step-up auth on mount
  useEffect(() => {
    const initStepUp = async () => {
      try {
        // Map action labels to purposes
        const purposeMap: Record<string, string> = {
          'transfer ownership': 'ownership_transfer',
          'delete account': 'delete_account',
          'disable 2FA': 'disable_2fa',
        };
        const p = purposeMap[actionLabel] || 'sensitive_action';
        setPurpose(p);
        
        const response = await api.post('/member/account/step-up/initiate', { purpose: p });
        setStepUpToken(response.data.data.step_up_token);
      } catch (err) {
        console.error('Failed to initiate step-up:', err);
        setError(parseApiError(err));
      }
    };
    
    initStepUp();
  }, [actionLabel]);

  const handlePasswordVerify = async () => {
    if (!stepUpToken || password.length < 4) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/member/account/step-up/verify-password', {
        step_up_token: stepUpToken,
        password
      });
      
      if (response.data.data.requires_otp) {
        setStep('otp');
        setOtpSent(true);
      } else if (response.data.data.verified) {
        // Step-up complete without OTP (user doesn't have 2FA)
        onVerified(stepUpToken);
      }
    } catch (err) {
      console.error('Password verification failed:', err);
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!stepUpToken || otp.length < 6) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/member/account/step-up/verify-otp', {
        step_up_token: stepUpToken,
        otp
      });
      
      if (response.data.data.verified) {
        onVerified(stepUpToken);
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100">
            <div className="size-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Security Verification</h2>
            <p className="text-sm text-slate-500 mt-1">
                For your security, please verify your identity to <b>{actionLabel}</b>.
            </p>
        </div>

        <div className="p-6">
            {step === 'password' ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Account Password</label>
                        <input 
                            type="password" 
                            autoFocus
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none ${error ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(null); }}
                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordVerify()}
                        />
                        {error && (
                            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                <AlertTriangle size={12} /> {error}
                            </p>
                        )}
                    </div>
                    
                    <button 
                        onClick={handlePasswordVerify}
                        disabled={loading || password.length < 4 || !stepUpToken}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="text-center mb-4">
                        <div className="size-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <KeyRound size={24} />
                        </div>
                        <p className="text-sm text-slate-600">
                            Enter the 6-digit code from your authenticator app
                        </p>
                    </div>
                    
                    <div>
                        <input 
                            type="text" 
                            autoFocus
                            className={`w-full border rounded-xl px-4 py-3 text-xl font-bold text-center tracking-widest focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none ${error ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleOtpVerify()}
                            maxLength={6}
                        />
                        {error && (
                            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                <AlertTriangle size={12} /> {error}
                            </p>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleOtpVerify}
                        disabled={loading || otp.length < 6}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify & Authorize'
                        )}
                    </button>
                    
                    <button 
                        onClick={() => { setStep('password'); setError(null); }}
                        className="w-full text-sm text-slate-500 hover:text-slate-800"
                    >
                        Go Back
                    </button>
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
