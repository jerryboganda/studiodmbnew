import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Camera, CreditCard, Check, AlertCircle, ScanFace, Upload } from 'lucide-react';

interface VerificationModalProps {
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock camera start
  useEffect(() => {
    if (step === 3 && videoRef.current) {
      setIsCapturing(true);
      // In a real app, we would request navigator.mediaDevices.getUserMedia here
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50">
            <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={24} />
                <h2 className="text-lg font-bold text-slate-900">Identity Verification</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
            {/* Progress Stepper */}
            <div className="flex justify-between max-w-md mx-auto mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`flex flex-col items-center gap-2 bg-white px-2`}>
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step >= s ? 'bg-primary border-primary text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {step > s ? <Check size={14} /> : s}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                            {s === 1 ? 'Select ID' : s === 2 ? 'Upload' : s === 3 ? 'Liveness' : 'Review'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step 1: Select ID */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Select Government ID</h3>
                        <p className="text-slate-500 text-sm">We verify this against government databases securely.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Aadhaar Card', 'Passport', 'Driving License', 'Voter ID'].map((idType) => (
                            <button 
                                key={idType}
                                onClick={() => setStep(2)}
                                className="p-4 border-2 border-slate-100 rounded-xl hover:border-primary hover:bg-primary/5 flex items-center gap-4 transition-all group text-left"
                            >
                                <div className="size-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900">{idType}</span>
                                    <span className="text-xs text-slate-500">Recommended</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start text-sm text-blue-800">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>Your ID is used strictly for identity verification. It is never shared with other users or third parties.</p>
                    </div>
                </div>
            )}

            {/* Step 2: Upload ID */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Upload Aadhaar Card</h3>
                        <p className="text-slate-500 text-sm">Ensure the details are clearly visible.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Front Side</span>
                            <div className="aspect-[1.58/1] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group">
                                <div className="size-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm mb-2">
                                    <Upload size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Click to Upload</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Back Side</span>
                            <div className="aspect-[1.58/1] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group">
                                <div className="size-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm mb-2">
                                    <Upload size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Click to Upload</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setStep(3)} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20">
                        Confirm & Continue
                    </button>
                </div>
            )}

            {/* Step 3: Liveness Check */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300 text-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Selfie Liveness Check</h3>
                        <p className="text-slate-500 text-sm">We need to make sure you're a real person.</p>
                    </div>

                    <div className="relative size-64 mx-auto bg-black rounded-full overflow-hidden border-4 border-slate-200">
                        {isCapturing ? (
                            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                                {/* Mock Camera Feed */}
                                <ScanFace size={64} className="text-white/50" />
                                <div className="absolute inset-0 border-[6px] border-green-500/50 rounded-full"></div>
                                <div className="absolute bottom-8 left-0 right-0 text-center">
                                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                                        Turn head slowly to the right
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                <Camera size={48} />
                            </div>
                        )}
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 inline-block">
                        Please remove glasses and masks. Ensure good lighting.
                    </div>

                    <button onClick={() => setStep(4)} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20">
                        Start Scan
                    </button>
                </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300 text-center py-8">
                     <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                         <ShieldCheck size={40} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900">Verification Submitted</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            Thank you! Your documents are being processed securely. You will receive a "Verified Badge" within 24 hours.
                        </p>
                     </div>
                     <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800">
                         Back to Profile
                     </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
