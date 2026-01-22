import React, { useState } from 'react';
import { BadgeCheck, MapPin, Cake, GraduationCap, Briefcase, Check, X, Lock, MoreVertical, ShieldAlert, Flag } from 'lucide-react';
import { MAIN_PROFILE } from '../constants';
import ReportModal from './ReportModal';

interface ProfileCardProps {
    onDecline?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onDecline }) => {
  const [accepted, setAccepted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden border border-white relative">
      {/* Cover Image area */}
      <div className={`h-40 ${MAIN_PROFILE.coverGradient} relative`}>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-primary text-xs font-bold shadow-sm">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          {MAIN_PROFILE.matchPercentage}% Match
        </div>

        {/* Safety Menu Trigger */}
        <div className="absolute top-4 left-4">
             <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full text-slate-900 transition-colors"
             >
                 <MoreVertical size={20} />
             </button>
             {showMenu && (
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                     <button 
                        onClick={() => { setShowReportModal(true); setShowMenu(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                     >
                         <Flag size={16} /> Report Profile
                     </button>
                     <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                         <ShieldAlert size={16} /> Block User
                     </button>
                 </div>
             )}
        </div>
      </div>

      <div className="px-8 pb-8 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-8 p-1.5 bg-white rounded-full">
          <div 
            className="size-32 rounded-full bg-cover bg-center shadow-md border border-slate-100" 
            style={{ backgroundImage: `url('${MAIN_PROFILE.avatarUrl}')` }}
            aria-label={`Portrait of ${MAIN_PROFILE.name}`}
          ></div>
        </div>

        {/* Header Info */}
        <div className="pt-20 flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{MAIN_PROFILE.name}</h2>
              {MAIN_PROFILE.isVerified && (
                 <div className="relative group cursor-pointer">
                    <BadgeCheck size={20} className="text-blue-500 fill-blue-50" />
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        ID & Photo Verified
                    </div>
                 </div>
              )}
            </div>
            <p className="text-primary font-medium text-base mt-1">{MAIN_PROFILE.specialty}</p>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                {MAIN_PROFILE.hospital}, {MAIN_PROFILE.location}
              </div>
              <div className="flex items-center gap-1">
                <Cake size={16} />
                {MAIN_PROFILE.age} Yrs
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {!accepted ? (
                <>
                    <button 
                        onClick={onDecline}
                        className="bg-background-light text-slate-900 hover:bg-slate-200 px-6 h-12 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                    <X size={18} />
                    Decline
                    </button>
                    <button 
                        onClick={() => setAccepted(true)}
                        className="bg-primary hover:bg-primary-hover text-white px-8 h-12 rounded-full font-bold text-sm shadow-lg shadow-primary/30 transition-all flex items-center gap-2 justify-center"
                    >
                    <Check size={20} strokeWidth={3} />
                    Accept Proposal
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-full border border-green-200 animate-in fade-in">
                    <Check size={20} />
                    <span className="font-bold text-sm">Chat Unlocked!</span>
                </div>
            )}
          </div>
        </div>

        <hr className="my-6 border-slate-100" />

        {/* Bio & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">About</h3>
            <p className="text-slate-600 leading-relaxed">
              {MAIN_PROFILE.bio}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {MAIN_PROFILE.tags?.map((tag) => {
                  let colors = "bg-slate-50 text-slate-700";
                  if (tag === 'Hiking') colors = "bg-pink-50 text-pink-700";
                  if (tag === 'Classical Music') colors = "bg-purple-50 text-purple-700";
                  if (tag === 'Vegetarian') colors = "bg-blue-50 text-blue-700";

                  return (
                    <span key={tag} className={`px-3 py-1 rounded-full text-xs font-semibold ${colors}`}>
                        {tag}
                    </span>
                  );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Education & Career</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="mt-1 size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{MAIN_PROFILE.education?.degree}</p>
                  <p className="text-xs text-slate-500">{MAIN_PROFILE.education?.institution}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{MAIN_PROFILE.career?.position}</p>
                  <p className="text-xs text-slate-500">{MAIN_PROFILE.career?.institution} ({MAIN_PROFILE.career?.duration})</p>
                </div>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                <Lock size={16} className="text-slate-400" />
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">Family Details Hidden</p>
                    <p className="text-[10px] text-slate-500">Unlock full profile by accepting request.</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {showReportModal && <ReportModal userName={MAIN_PROFILE.name} onClose={() => setShowReportModal(false)} />}
    </div>
  );
};

export default ProfileCard;
