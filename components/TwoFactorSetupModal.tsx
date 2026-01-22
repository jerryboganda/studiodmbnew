import React, { useState } from 'react';
import { 
    X, ShieldCheck, Smartphone, Mail, QrCode, Copy, Download, 
    CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Lock
} from 'lucide-react';

interface TwoFactorSetupModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<'method' | 'config' | 'verify' | 'backup' | 'success'>('method');
  const [method, setMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [verificationCode, setVerificationCode] = useState('');
  const [codesSaved, setCodesSaved] = useState(false);

  const handleCopy = (text: string) => {
      // Mock copy
      alert(`Copied: ${text}`);
  };

  const handleVerify = () => {
      if (verificationCode.length >= 4) {
          setStep('backup');
      }
  };

  const renderMethodSelection = () => (
      <div className="space-y-4 animate-in slide-in-from-right">
          <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Choose Authentication Method</h3>
              <p className="text-slate-500 text-sm">Select how you want to receive security codes.</p>
          </div>

          <div 
              onClick={() => { setMethod('app'); setStep('config'); }}
              className="flex items-start gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all relative group"
          >
              <div className="size-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <QrCode size={24} />
              </div>
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900">Authenticator App</h4>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</span>
                  </div>
                  <p className="text-xs text-slate-500">Google Authenticator, Authy, or similar. Most secure option.</p>
              </div>
          </div>

          <div 
              onClick={() => { setMethod('sms'); setStep('config'); }}
              className="flex items-start gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
              <div className="size-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  <Smartphone size={24} />
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-1">SMS Message</h4>
                  <p className="text-xs text-slate-500">Receive codes via text message to +91 ••••• ••12.</p>
              </div>
          </div>

          <div 
              onClick={() => { setMethod('email'); setStep('config'); }}
              className="flex items-start gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
              <div className="size-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  <Mail size={24} />
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-1">Email Address</h4>
                  <p className="text-xs text-slate-500">Send codes to verified email address.</p>
              </div>
          </div>
      </div>
  );

  const renderConfig = () => (
      <div className="space-y-6 animate-in slide-in-from-right">
          <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">
                  {method === 'app' ? 'Set up Authenticator' : 'Verify Contact'}
              </h3>
              <p className="text-slate-500 text-sm">
                  {method === 'app' ? 'Scan the QR code with your authenticator app.' : `We sent a code to your ${method === 'sms' ? 'phone' : 'email'}.`}
              </p>
          </div>

          {method === 'app' ? (
              <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
                      <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/DMB:Dr.Rajesh?secret=JBSWY3DPEHPK3PXP&issuer=DMB" 
                          alt="QR Code" 
                          className="size-40"
                      />
                  </div>
                  
                  <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Setup Key</p>
                          <p className="text-sm font-mono font-bold text-slate-800 tracking-wider">JBSW Y3DP EHPK 3PXP</p>
                      </div>
                      <button onClick={() => handleCopy('JBSWY3DPEHPK3PXP')} className="p-2 hover:bg-slate-200 rounded text-slate-500">
                          <Copy size={16} />
                      </button>
                  </div>
              </div>
          ) : (
              <div className="flex justify-center py-8">
                  <div className="size-24 bg-slate-100 rounded-full flex items-center justify-center animate-pulse text-slate-400">
                      {method === 'sms' ? <Smartphone size={40} /> : <Mail size={40} />}
                  </div>
              </div>
          )}

          <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Enter Verification Code</label>
              <input 
                  type="text" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123 456" 
                  className="w-full p-3 border border-slate-300 rounded-xl text-center text-xl font-bold tracking-widest focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                  autoFocus
              />
          </div>

          <button 
              onClick={handleVerify}
              disabled={verificationCode.length < 4}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Verify & Continue
          </button>
      </div>
  );

  const renderBackup = () => (
      <div className="space-y-6 animate-in slide-in-from-right">
          <div className="text-center">
              <div className="size-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Save Backup Codes</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  If you lose your device, these codes are the only way to recover your account. Keep them safe.
              </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4 font-mono text-sm font-bold text-slate-700 text-center">
                  <span>8392 1029</span>
                  <span>4829 1938</span>
                  <span>1029 3847</span>
                  <span>5738 2910</span>
                  <span>1928 3746</span>
                  <span>9283 7465</span>
              </div>
          </div>

          <div className="flex gap-3">
              <button onClick={() => handleCopy("8392 1029\n4829 1938\n1029 3847\n5738 2910\n1928 3746\n9283 7465")} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Copy size={16} /> Copy
              </button>
              <button className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Download size={16} /> Download
              </button>
          </div>

          <label className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl cursor-pointer">
              <input 
                  type="checkbox" 
                  checked={codesSaved}
                  onChange={(e) => setCodesSaved(e.target.checked)}
                  className="mt-1 size-4 accent-orange-600"
              />
              <span className="text-sm text-orange-900 font-medium">I have saved these codes in a secure place.</span>
          </label>

          <button 
              onClick={() => setStep('success')}
              disabled={!codesSaved}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Complete Setup
          </button>
      </div>
  );

  const renderSuccess = () => (
      <div className="text-center py-8 animate-in zoom-in-95">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Two-Factor Enabled!</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
              Your account is now more secure. You will be asked for a code during sign-in.
          </p>
          <button 
              onClick={onComplete}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg"
          >
              Done
          </button>
      </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50">
            <div className="flex items-center gap-2">
                {step !== 'method' && step !== 'success' && (
                    <button onClick={() => setStep(step === 'backup' ? 'config' : 'method')} className="mr-2 text-slate-400 hover:text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <Lock className="text-primary" size={20} />
                <h2 className="text-lg font-bold text-slate-900">Setup 2FA</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {step === 'method' && renderMethodSelection()}
            {step === 'config' && renderConfig()}
            {step === 'backup' && renderBackup()}
            {step === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetupModal;
