import React, { useState } from 'react';
import { X, ShieldAlert, ChevronRight, Upload, Lock } from 'lucide-react';

interface ReportModalProps {
  onClose: () => void;
  userName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, userName }) => {
  const [reason, setReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [blockUser, setBlockUser] = useState(true);

  const reportReasons = [
    { id: 'fake', label: 'Fake Profile or Scammer', desc: 'Using false photos or asking for money.' },
    { id: 'harassment', label: 'Harassment or Abusive Behavior', desc: 'Insults, threats, or inappropriate messages.' },
    { id: 'spam', label: 'Spam or Solicitation', desc: 'Selling products or services.' },
    { id: 'inappropriate', label: 'Inappropriate Content', desc: 'Nudity, violence, or offensive bio.' },
    { id: 'underage', label: 'Underage User', desc: 'User appears to be under 18.' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-200">
        
        <div className="h-16 border-b border-red-100 bg-red-50 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert size={20} />
                <h2 className="text-lg font-bold">Report {userName}</h2>
            </div>
            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-700" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            {!reason ? (
                <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-900 mb-2">Why are you reporting this user?</p>
                    {reportReasons.map((r) => (
                        <button 
                            key={r.id}
                            onClick={() => setReason(r.id)}
                            className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all group"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800 group-hover:text-red-800">{r.label}</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-red-400" />
                            </div>
                            <p className="text-xs text-slate-500">{r.desc}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <button onClick={() => setReason(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800 mb-2">
                        &larr; Back to reasons
                    </button>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Add details (Required)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 p-3 border border-slate-300 rounded-xl text-sm focus:border-red-500 focus:ring-1 focus:ring-red-200 outline-none resize-none"
                            placeholder="Please describe the incident... timestamps or specific messages help us investigate faster."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Attach Evidence (Optional)</label>
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                <Upload size={16} /> Upload Screenshots
                            </button>
                            <span className="text-xs text-slate-400">0 files selected</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={blockUser}
                                onChange={(e) => setBlockUser(e.target.checked)}
                                className="size-4 accent-red-600"
                            />
                            <div>
                                <span className="block text-sm font-bold text-slate-900">Block {userName}</span>
                                <span className="text-xs text-slate-500">They won't be able to see you or message you.</span>
                            </div>
                        </label>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg flex gap-2 text-xs text-yellow-800">
                        <Lock size={14} className="shrink-0 mt-0.5" />
                        <p>This report is anonymous. {userName} will not know who reported them.</p>
                    </div>
                </div>
            )}
        </div>

        {reason && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800">Cancel</button>
                <button 
                    onClick={onClose}
                    disabled={description.length < 10}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full font-bold text-sm shadow-lg shadow-red-200"
                >
                    Submit Report
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
