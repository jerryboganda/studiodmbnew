import React, { useState } from 'react';
import { 
    X, ShieldCheck, Smartphone, Mail, QrCode, Copy, Download, 
    CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Lock, Loader2
} from 'lucide-react';

interface TwoFactorSetupModalProps {
  qrCodeSvg?: string;  // SVG string from API
  secret?: string;      // TOTP secret for manual entry
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
}

const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({ qrCodeSvg, secret, onClose, onVerify }) => {
  const [step, setStep] = useState<'config' | 'verify'>('config');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
      if (secret) {
          navigator.clipboard.writeText(secret);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  // Format secret for display (group of 4)
  const formatSecret = (s: string) => {
      return s.match(/.{1,4}/g)?.join(' ') || s;
  };

  const handleVerify = async () => {
      if (verificationCode.length < 6) {
          setError('Please enter a 6-digit code');
          return;
      }
      
      setVerifying(true);
      setError(null);
      
      try {
          await onVerify(verificationCode);
          // onVerify will close the modal on success
      } catch (err: any) {
          setError(err.message || 'Invalid verification code');
      } finally {
          setVerifying(false);
      }
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
                  <button 
                      onClick={onClose} 
                      className="absolute right-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                      <X size={20} />
                  </button>
                  <div className="flex items-center gap-3">
                      <div className="size-12 bg-white/10 rounded-full flex items-center justify-center">
                          <Lock size={24} />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold">Two-Factor Authentication</h2>
                          <p className="text-slate-300 text-sm">Scan QR code with your authenticator app</p>
                      </div>
                  </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
                          {qrCodeSvg ? (
                              <div 
                                  className="size-48"
                                  dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                              />
                          ) : (
                              <div className="size-48 bg-slate-100 animate-pulse rounded flex items-center justify-center">
                                  <Loader2 className="animate-spin text-slate-400" size={32} />
                              </div>
                          )}
                      </div>
                      
                      <p className="text-xs text-slate-500 text-center">
                          Use <strong>Google Authenticator</strong>, <strong>Authy</strong>, or any TOTP-compatible app
                      </p>
                  </div>
                  
                  {/* Manual Entry Secret */}
                  {secret && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-center">
                              <div>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Manual Entry Key</p>
                                  <p className="text-sm font-mono font-bold text-slate-800 tracking-wider">
                                      {formatSecret(secret)}
                                  </p>
                              </div>
                              <button 
                                  onClick={handleCopy} 
                                  className="p-2 hover:bg-slate-200 rounded text-slate-500 flex items-center gap-1"
                              >
                                  <Copy size={16} />
                                  <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                              </button>
                          </div>
                      </div>
                  )}

                  {/* Verification Code Input */}
                  <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                          Enter 6-Digit Code from App
                      </label>
                      <input 
                          type="text" 
                          value={verificationCode}
                          onChange={(e) => {
                              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                              setError(null);
                          }}
                          placeholder="000000" 
                          className={`w-full p-3 border rounded-xl text-center text-2xl font-bold tracking-widest focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none ${error ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                          autoFocus
                          maxLength={6}
                      />
                      {error && (
                          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                              <AlertTriangle size={12} /> {error}
                          </p>
                      )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                      <button 
                          onClick={onClose}
                          className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleVerify}
                          disabled={verificationCode.length < 6 || verifying}
                          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                          {verifying && <Loader2 size={16} className="animate-spin" />}
                          Verify & Enable
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default TwoFactorSetupModal;
