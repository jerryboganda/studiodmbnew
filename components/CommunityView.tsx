import React, { useState } from 'react';
import { 
    Users, Search, Lock, Globe, Shield, UserCheck, MessageSquare, 
    ArrowRight, MapPin, Building2, GraduationCap
} from 'lucide-react';

const CommunityView: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const communities = [
    {
      id: 1,
      name: "Doctors of Delhi NCR",
      type: "Region",
      members: "1.2k",
      icon: <MapPin className="text-blue-500" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Exclusive network for medical professionals practicing in Delhi NCR.",
      isPrivate: false,
      isJoined: true
    },
    {
      id: 2,
      name: "AIIMS Alumni Network",
      type: "Alumni",
      members: "850",
      icon: <GraduationCap className="text-purple-500" />,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      description: "Verified alumni of AIIMS Delhi, Jodhpur, and Bhopal.",
      isPrivate: true,
      isJoined: false
    },
    {
      id: 3,
      name: "Tamil Brahmin Doctors",
      type: "Culture",
      members: "2.4k",
      icon: <Users className="text-orange-500" />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
      description: "Connecting Iyer and Iyengar medical families globally.",
      isPrivate: true,
      isJoined: false
    },
    {
      id: 4,
      name: "Cardiology Society",
      type: "Specialty",
      members: "500+",
      icon: <HeartIcon className="text-red-500" />,
      color: "bg-red-50 text-red-700 border-red-200",
      description: "For Cardiologists and Cardiac Surgeons seeking partners.",
      isPrivate: false,
      isJoined: false
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-8 pb-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Community Networks</h2>
                    <p className="text-slate-500">Join verified micro-communities to find partners with shared background.</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800">
                    Create Community
                </button>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200">
                <TabItem label="Discover" active={filter === 'all'} onClick={() => setFilter('all')} />
                <TabItem label="My Communities" active={filter === 'joined'} onClick={() => setFilter('joined')} count={1} />
                <TabItem label="Pending Requests" active={filter === 'pending'} onClick={() => setFilter('pending')} />
            </div>
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-6xl mx-auto">
              
              {/* Search */}
              <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search for alumni groups, castes, or regions..." 
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 text-slate-900"
                  />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communities.filter(c => filter === 'joined' ? c.isJoined : true).map((community) => (
                      <div key={community.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                          {community.isJoined && (
                              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">JOINED</div>
                          )}
                          
                          <div className="flex items-start justify-between mb-4">
                              <div className={`size-12 rounded-xl flex items-center justify-center border ${community.color}`}>
                                  {community.icon}
                              </div>
                              {community.isPrivate && <Lock size={16} className="text-slate-400" title="Private Group" />}
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-1">{community.name}</h3>
                          <div className="flex items-center gap-2 mb-4">
                              <span className="text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md uppercase">{community.type}</span>
                              <span className="text-xs text-slate-400">• {community.members} Members</span>
                          </div>

                          <p className="text-sm text-slate-600 mb-6 line-clamp-2 h-10">
                              {community.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                               <div className="flex -space-x-2">
                                   {[1,2,3].map(i => (
                                       <div key={i} className="size-6 rounded-full border-2 border-white bg-slate-200"></div>
                                   ))}
                                   <div className="size-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">+40</div>
                               </div>
                               
                               {community.isJoined ? (
                                   <button className="text-sm font-bold text-slate-900 hover:text-primary flex items-center gap-1">
                                       Open <ArrowRight size={16} />
                                   </button>
                               ) : (
                                   <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${community.isPrivate ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                                       {community.isPrivate ? 'Request to Join' : 'Join Network'}
                                   </button>
                               )}
                          </div>
                      </div>
                  ))}

                  {/* Promo Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col justify-center text-center">
                      <div className="size-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400">
                          <Shield size={24} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Community Admin?</h3>
                      <p className="text-sm text-slate-300 mb-6">Create and moderate your own private network for your hospital or society.</p>
                      <button className="bg-white text-slate-900 py-2 rounded-lg font-bold text-sm hover:bg-slate-100">Apply for Admin</button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const TabItem: React.FC<{label: string, active: boolean, onClick: () => void, count?: number}> = ({ label, active, onClick, count }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
    >
        {label}
        {count && <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>}
    </button>
);

const HeartIcon = ({className}: {className?: string}) => <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;

export default CommunityView;
