import React from 'react';
import { SECONDARY_PROFILE } from '../constants';

const ProfileTeaser: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
      <div 
        className="size-16 rounded-full bg-cover bg-center shrink-0 grayscale group-hover:grayscale-0 transition-all" 
        style={{ backgroundImage: `url('${SECONDARY_PROFILE.avatarUrl}')` }}
      ></div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900">{SECONDARY_PROFILE.name}</h3>
        <p className="text-sm text-slate-500">{SECONDARY_PROFILE.specialty}</p>
      </div>
      <div className="text-right">
        <span className="block text-primary font-bold">{SECONDARY_PROFILE.matchPercentage}% Match</span>
        <span className="text-xs text-slate-400">2 hrs ago</span>
      </div>
    </div>
  );
};

export default ProfileTeaser;
