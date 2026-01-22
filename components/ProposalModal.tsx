import React, { useState } from 'react';
import { X, FileText, Image, Users, Send, Wand2, Check } from 'lucide-react';
import { ProfileMatch } from '../types';
import { CURRENT_USER } from '../constants';

interface ProposalModalProps {
  profile: ProfileMatch;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ profile, onClose }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState({
    biodata: true,
    familyAlbum: false,
    references: false
  });

  const templates = [
    "I was impressed by your profile and our shared values.",
    "Our families seem to have a lot in common.",
    "Your career path is inspiring, would love to connect."
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Send Proposal</h2>
                <p className="text-xs text-slate-500">To: {profile.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Match Highlights */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Wand2 size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-primary">Proposal Highlights</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {profile.matchReasons?.map((reason, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white border border-primary/20 rounded-md text-xs font-medium text-primary-hover shadow-sm">
                            {reason}
                        </span>
                    ))}
                    <span className="px-2 py-1 bg-white border border-primary/20 rounded-md text-xs font-medium text-primary-hover shadow-sm">
                        {profile.matchPercentage}% Compatibility
                    </span>
                </div>
            </div>

            {/* Message Builder */}
            <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Personal Note</label>
                <div className="relative">
                    <textarea 
                        className="w-full h-32 p-4 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                        placeholder="Write a personal message or select a template below..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                        {message.length}/500
                    </div>
                </div>
                
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                    {templates.map((t, i) => (
                        <button 
                            key={i} 
                            onClick={() => setMessage(t)}
                            className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 font-medium transition-colors"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Attachments */}
            <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Proposal Packet Attachments</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <AttachmentOption 
                        icon={<FileText size={20} />} 
                        label="Standard Biodata" 
                        subLabel="Auto-generated PDF"
                        selected={attachments.biodata}
                        onClick={() => setAttachments({...attachments, biodata: !attachments.biodata})}
                    />
                    <AttachmentOption 
                        icon={<Image size={20} />} 
                        label="Family Album" 
                        subLabel="Access to 5 photos"
                        selected={attachments.familyAlbum}
                        onClick={() => setAttachments({...attachments, familyAlbum: !attachments.familyAlbum})}
                    />
                    <AttachmentOption 
                        icon={<Users size={20} />} 
                        label="Reference Letters" 
                        subLabel="2 Verified References"
                        selected={attachments.references}
                        onClick={() => setAttachments({...attachments, references: !attachments.references})}
                    />
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                 <div className="size-8 rounded-full bg-cover bg-center" style={{backgroundImage: `url('${CURRENT_USER.avatarUrl}')`}}></div>
                 <div className="text-xs">
                    <p className="font-bold text-slate-900">Sending as {CURRENT_USER.name}</p>
                    <p className="text-slate-500">Premium Member</p>
                 </div>
            </div>
            <button 
                onClick={onClose}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
            >
                <Send size={16} />
                Send Proposal
            </button>
        </div>
      </div>
    </div>
  );
};

const AttachmentOption: React.FC<{
    icon: React.ReactNode, 
    label: string, 
    subLabel: string, 
    selected: boolean, 
    onClick: () => void
}> = ({ icon, label, subLabel, selected, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3
            ${selected 
                ? 'border-primary bg-primary/5' 
                : 'border-slate-100 hover:border-slate-300'
            }
        `}
    >
        <div className={`p-2 rounded-lg ${selected ? 'bg-white text-primary' : 'bg-slate-100 text-slate-400'}`}>
            {icon}
        </div>
        <div>
            <div className="flex items-center gap-2">
                <p className={`text-sm font-bold ${selected ? 'text-slate-900' : 'text-slate-500'}`}>{label}</p>
                {selected && <Check size={12} className="text-primary" />}
            </div>
            <p className="text-[10px] text-slate-400">{subLabel}</p>
        </div>
    </div>
);

export default ProposalModal;
