import React, { useState } from 'react';
import { X, User, Users, FileText, ArrowRight, Upload, MessageSquare, Check, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<string | null>(null);
  const [importMethod, setImportMethod] = useState<string | null>(null);

  const totalSteps = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white">
            <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-900">Profile Setup</h3>
                {/* Stepper with Context */}
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-1">
                        <div className="h-1.5 w-6 rounded-full bg-green-500" title="Auth Complete"></div>
                        <span className="text-[10px] font-bold text-green-600 hidden sm:inline">Auth</span>
                    </div>
                    <span className="text-slate-300 text-[10px]">•</span>
                    {/* Active Steps */}
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-slate-100'}`}></div>
                    ))}
                    <span className="text-slate-300 text-[10px]">•</span>
                    <div className="h-1.5 w-6 rounded-full bg-slate-100 border border-dashed border-slate-300"></div>
                    <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">Verification</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-y-auto">
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome to DMB.</h2>
                        <p className="text-slate-500">Let's set up your profile. First, tell us who you are.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectionCard 
                            icon={<User size={32} />} 
                            title="Candidate" 
                            desc="I'm a doctor looking for a partner." 
                            selected={persona === 'candidate'}
                            onClick={() => setPersona('candidate')}
                        />
                        <SelectionCard 
                            icon={<Users size={32} />} 
                            title="Family Member" 
                            desc="I'm a parent/sibling managing this." 
                            selected={persona === 'family'}
                            onClick={() => setPersona('family')}
                        />
                        <SelectionCard 
                            icon={<FileText size={32} />} 
                            title="Matchmaker" 
                            desc="I'm a professional agent." 
                            selected={persona === 'agent'}
                            onClick={() => setPersona('agent')}
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Import Profile Data</h2>
                        <p className="text-slate-500">Save time by importing details from an existing source.</p>
                    </div>

                    <div className="space-y-4">
                        <div 
                            onClick={() => setImportMethod('whatsapp')}
                            className={`p-4 border rounded-xl cursor-pointer flex items-start gap-4 hover:border-primary transition-all ${importMethod === 'whatsapp' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200'}`}
                        >
                            <div className="size-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">Paste WhatsApp Biodata</h4>
                                <p className="text-sm text-slate-500 mb-2">Copy the text from your family WhatsApp group and paste it here.</p>
                                {importMethod === 'whatsapp' && (
                                    <textarea 
                                        className="w-full h-24 p-2 text-sm border border-slate-300 rounded-md focus:border-primary focus:ring-0" 
                                        placeholder="Paste text here... e.g., 'Name: Dr. Raj, DOB: 1995, Height: 5ft 10...'"
                                    ></textarea>
                                )}
                            </div>
                        </div>

                        <div 
                            onClick={() => setImportMethod('pdf')}
                            className={`p-4 border rounded-xl cursor-pointer flex items-center gap-4 hover:border-primary transition-all ${importMethod === 'pdf' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200'}`}
                        >
                            <div className="size-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Upload Biodata PDF</h4>
                                <p className="text-sm text-slate-500">We'll extract the details automatically.</p>
                            </div>
                        </div>

                        <div 
                            onClick={() => setImportMethod('manual')}
                            className={`p-4 border rounded-xl cursor-pointer flex items-center gap-4 hover:border-primary transition-all ${importMethod === 'manual' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200'}`}
                        >
                            <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Start from Scratch</h4>
                                <p className="text-sm text-slate-500">Fill in the details manually step-by-step.</p>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">The Essentials</h2>
                        <p className="text-slate-500">We use "Progressive Profiling". Just these few fields for now!</p>
                    </div>

                    <form className="space-y-4 max-w-md mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none" defaultValue="Rajesh" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none" defaultValue="Kumar" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
                            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none">
                                <option>MD General Medicine</option>
                                <option>MS Orthopedics</option>
                                <option>Cardiology</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                            <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none" />
                        </div>
                    </form>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                     <div className="text-center mb-6">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Final Declarations</h2>
                        <p className="text-slate-500">Please review and accept the following.</p>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary" defaultChecked />
                            <span className="text-sm text-slate-700">I agree to the <b className="text-slate-900">Terms of Service</b> and <b className="text-slate-900">Privacy Policy</b>.</span>
                        </label>
                        <hr className="border-slate-200" />
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary" defaultChecked />
                            <span className="text-sm text-slate-700">I consent to the use of my photos and data for matchmaking purposes within the DMB network.</span>
                        </label>
                        <hr className="border-slate-200" />
                         <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary" />
                            <span className="text-sm text-slate-700">I confirm that all information provided is accurate and truthful.</span>
                        </label>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <button 
                onClick={step === 1 ? onClose : prevStep}
                className="text-slate-500 font-bold text-sm px-4 hover:text-slate-800"
            >
                {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button 
                onClick={step === totalSteps ? onClose : nextStep}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
            >
                {step === totalSteps ? 'Complete & Continue' : 'Continue'}
                {step !== totalSteps && <ArrowRight size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

const SelectionCard: React.FC<{icon: React.ReactNode, title: string, desc: string, selected: boolean, onClick: () => void}> = ({ icon, title, desc, selected, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3
            ${selected 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-slate-100 hover:border-primary/30 text-slate-400 hover:text-slate-600'
            }
        `}
    >
        <div className={selected ? 'text-primary' : 'text-slate-300'}>{icon}</div>
        <div>
            <h3 className={`font-bold ${selected ? 'text-primary' : 'text-slate-900'}`}>{title}</h3>
            <p className="text-xs mt-1 leading-relaxed opacity-80">{desc}</p>
        </div>
    </div>
);

export default OnboardingModal;
