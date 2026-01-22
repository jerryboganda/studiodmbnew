import React, { useState } from 'react';
import { 
  Search, Sliders, MapPin, Heart, X, ChevronDown, Eye, EyeOff, Map as MapIcon, 
  Grid, Zap, Star, Plane, Filter, ArrowUpDown, Bookmark, Crown, UserCheck, Send, FileText, Lock
} from 'lucide-react';
import MatchIntelligenceModal from './MatchIntelligenceModal';
import MatchTunerModal from './MatchTunerModal';
import { ProfileMatch } from '../types';

// Mock Profiles (Extended with flags)
const MOCK_PROFILES: ProfileMatch[] = [
  {
    id: '1',
    name: "Dr. Ananya Singh",
    age: 28,
    specialty: "Dermatologist",
    location: "South Delhi",
    hospital: "Max Healthcare",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    matchPercentage: 95,
    matchReasons: ["Vegetarian", "Delhi based", "MD Gold Medalist"],
    isOnline: true,
    isVerified: true,
    isAgentPick: true,
    intelligence: {
        totalScore: 95,
        categories: [{name: 'Values', score: 98, weight: 'High'}, {name: 'Lifestyle', score: 92, weight: 'Medium'}],
        mutualFit: { youMeetThem: 100, theyMeetYou: 90 },
        topReasons: ['Vegetarian', 'Delhi Based'],
        frictionPoints: ['None detected'],
        agentNotes: 'Top recommendation for this week.',
        generatedAt: 'Today'
    }
  },
  {
    id: '2',
    name: "Dr. Arjun Mehta",
    age: 31,
    specialty: "Neurosurgeon",
    location: "Mumbai",
    hospital: "Lilavati Hospital",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    matchPercentage: 88,
    matchReasons: ["High Income Match", "Music Lover"],
    isOnline: false,
    isVerified: true,
    isHighIntent: true
  },
  {
    id: '3',
    name: "Dr. Priya Kapoor",
    age: 27,
    specialty: "Pediatrician",
    location: "Bangalore",
    hospital: "Manipal Hospital",
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    matchPercentage: 92,
    matchReasons: ["Shared Hobbies", "Age Preference"],
    isOnline: true,
    isVerified: true,
    isAgentPick: true
  },
  {
    id: '4',
    name: "Dr. Kabir Malhotra",
    age: 30,
    specialty: "Orthopedic",
    location: "Chandigarh",
    hospital: "PGIMER",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    matchPercentage: 82,
    matchReasons: ["Community Match"],
    isOnline: false,
    isVerified: false
  },
  {
    id: '5',
    name: "Dr. Sara Khan",
    age: 29,
    specialty: "Radiologist",
    location: "Hyderabad",
    hospital: "Apollo",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    matchPercentage: 78,
    matchReasons: ["Language Match"],
    isOnline: true,
    isVerified: true,
    isHighIntent: true
  },
  {
    id: '6',
    name: "Dr. Vihaan Reddy",
    age: 32,
    specialty: "Cardiologist",
    location: "Chennai",
    hospital: "Fortis",
    avatarUrl: "https://images.unsplash.com/photo-1612531386530-97286d74c2ea?auto=format&fit=crop&q=80&w=300&h=300",
    matchPercentage: 75,
    matchReasons: ["Education Match"],
    isOnline: false,
    isVerified: true
  }
];

interface DiscoveryViewProps {
    onSendProposal: (profile: ProfileMatch) => void;
}

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onSendProposal }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isTravelMode, setIsTravelMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedProfile, setSelectedProfile] = useState<ProfileMatch | null>(null);
  const [showTuner, setShowTuner] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'agent' | 'intent'>('all');

  const displayedProfiles = MOCK_PROFILES.filter(p => {
    if (activeTab === 'agent') return p.isAgentPick;
    if (activeTab === 'intent') return p.isHighIntent;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Top Search & Controls Bar */}
      <div className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 py-3 shrink-0 z-30 shadow-sm gap-4">
         {/* Search Input */}
         <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by specialty, name, ID or keyword..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
         </div>

         {/* Actions */}
         <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowTuner(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md"
             >
                <Sliders size={14} /> Match Tuner
             </button>

             {/* Travel Mode */}
             <button 
                onClick={() => setIsTravelMode(!isTravelMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all border ${isTravelMode ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
             >
                <Plane size={16} />
                <span className="hidden xl:inline">Travel Mode</span>
             </button>

             {/* Anonymous Toggle */}
             <button 
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all border ${isAnonymous ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                title="Browse without revealing your identity"
             >
                {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="hidden xl:inline">{isAnonymous ? 'Anonymous' : 'Visible'}</span>
             </button>

             <div className="h-6 w-px bg-slate-200 mx-1"></div>

             {/* Saved Searches */}
             <button className="p-2 text-slate-500 hover:text-primary transition-colors relative">
                <Bookmark size={20} />
                <div className="absolute top-1 right-1 size-2 bg-primary rounded-full border border-white"></div>
             </button>
         </div>
      </div>

      {/* Toolbar / Subheader */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors ${showFilters ? 'bg-primary/5 border-primary text-primary' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}
            >
                <Filter size={16} />
                Filters
                {showFilters ? <ChevronDown size={16} className="rotate-180 transition-transform" /> : <ChevronDown size={16} className="transition-transform" />}
            </button>
            
            {/* Discovery Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <TabButton label="All Profiles" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <TabButton label="Matchmaker Picks" active={activeTab === 'agent'} onClick={() => setActiveTab('agent')} icon={<UserCheck size={14} />} />
                <TabButton label="High Intent" active={activeTab === 'intent'} onClick={() => setActiveTab('intent')} icon={<Crown size={14} />} />
            </div>
         </div>

         <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900">
                <ArrowUpDown size={14} />
                <span>Sort: <b>Relevance</b></span>
             </div>
             
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Grid size={16} />
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <MapIcon size={16} />
                </button>
             </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Filters Panel (Slide Over) */}
        <div className={`absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-10 transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className="h-full flex flex-col p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Advanced Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>
                
                <div className="space-y-6">
                    <FilterGroup label="Special Filter">
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100 cursor-pointer">
                            <input type="checkbox" className="accent-purple-600" />
                            <span className="text-sm font-bold text-purple-900">Family Approved Only</span>
                        </label>
                    </FilterGroup>

                    <FilterGroup label="Age Range">
                        <div className="h-2 bg-slate-200 rounded-full relative mt-3">
                            <div className="absolute left-1/4 right-1/4 h-full bg-primary rounded-full"></div>
                            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 size-4 bg-white border-2 border-primary rounded-full shadow cursor-grab"></div>
                            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 size-4 bg-white border-2 border-primary rounded-full shadow cursor-grab"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-bold text-slate-600">
                            <span>24</span>
                            <span>35</span>
                        </div>
                    </FilterGroup>

                    <FilterGroup label="Location Radius">
                        <div className="flex items-center gap-2 mb-2">
                            <input type="checkbox" className="accent-primary" />
                            <span className="text-sm text-slate-700">Near me (50km)</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <input type="checkbox" className="accent-primary" defaultChecked />
                            <span className="text-sm text-slate-700">Anywhere in India</span>
                        </div>
                    </FilterGroup>

                    <FilterGroup label="Community & Religion">
                         <input type="text" placeholder="Select communities..." className="w-full text-sm p-2 border border-slate-200 rounded-md focus:outline-none focus:border-primary" />
                    </FilterGroup>

                    <FilterGroup label="Profession">
                         <div className="flex flex-wrap gap-2">
                            {['Doctor', 'Surgeon', 'Dentist', 'Medical Student'].map(p => (
                                <span key={p} className="px-2 py-1 bg-slate-100 text-xs rounded border border-slate-200">{p}</span>
                            ))}
                         </div>
                    </FilterGroup>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <button className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20">
                        Apply Filters
                    </button>
                    <button className="w-full text-slate-500 py-2.5 text-xs font-bold mt-2 hover:text-slate-700">
                        Reset All
                    </button>
                </div>
             </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${showFilters ? 'ml-72' : ''} scrollbar-hide`}>
            
            {/* Top Picks / Header */}
            {activeTab === 'all' && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Star size={18} className="text-yellow-500 fill-yellow-500" /> 
                        Top Picks for You
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {MOCK_PROFILES.slice(0, 3).map(profile => (
                            <div 
                                key={profile.id} 
                                onClick={() => setSelectedProfile(profile)}
                                className="min-w-[280px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center"
                            >
                                <div className="size-16 rounded-full bg-cover bg-center shrink-0" style={{backgroundImage: `url(${profile.avatarUrl})`}}></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{profile.name}</h4>
                                    <p className="text-xs text-slate-500">{profile.specialty}</p>
                                    <span className="text-xs font-bold text-primary mt-1 block">{profile.matchPercentage}% Match</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {activeTab === 'agent' ? "Matchmaker Recommendations" : activeTab === 'intent' ? "High Intent Profiles" : "Explore Profiles"}
                 </h3>
                 {viewMode === 'grid' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedProfiles.map(profile => (
                            <ProfileGridCard 
                                key={profile.id} 
                                profile={profile} 
                                onClick={() => setSelectedProfile(profile)}
                                onProposal={() => onSendProposal(profile)}
                            />
                        ))}
                     </div>
                 ) : (
                     <div className="h-96 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 border border-slate-300">
                        <div className="text-center">
                            <MapIcon size={48} className="mx-auto mb-2 opacity-50" />
                            <p className="font-bold">Map View Placeholder</p>
                            <p className="text-xs">Location based discovery enabled</p>
                        </div>
                     </div>
                 )}
            </div>

            {/* Similar Profiles Strip (Bottom) */}
             <div className="mt-12 pt-8 border-t border-slate-200">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">People also viewed</h3>
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide opacity-70 hover:opacity-100 transition-opacity">
                      {[1,2,3,4,5].map(i => (
                          <div key={i} className="size-12 rounded-full bg-slate-300 shrink-0"></div>
                      ))}
                 </div>
             </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProfile && (
          <MatchIntelligenceModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
      {showTuner && (
          <MatchTunerModal onClose={() => setShowTuner(false)} />
      )}
    </div>
  );
};

const FilterGroup: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">{label}</h4>
        {children}
    </div>
);

const TabButton: React.FC<{label: string, active: boolean, onClick: () => void, icon?: React.ReactNode}> = ({ label, active, onClick, icon }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${active ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
    >
        {icon} {label}
    </button>
);

const ProfileGridCard: React.FC<{profile: ProfileMatch, onClick: () => void, onProposal: () => void}> = ({ profile, onClick, onProposal }) => {
    return (
        <div 
            className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative cursor-pointer"
        >
            {/* Compatibility Overlay (Hover) */}
            <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-md rounded-full px-2 py-1 text-xs font-bold text-primary shadow-sm flex items-center gap-1">
                    <Zap size={12} fill="currentColor" />
                    {profile.matchPercentage}%
                 </div>
                 {profile.isAgentPick && (
                     <div className="bg-purple-600/90 text-white backdrop-blur-md rounded-full px-2 py-1 text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <UserCheck size={10} /> Pick
                     </div>
                 )}
            </div>

            <div className="aspect-[4/5] bg-slate-200 relative" onClick={onClick}>
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-0 left-0 p-4 w-full text-white">
                    <h3 className="font-bold text-lg leading-tight">{profile.name}</h3>
                    <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                        <span className="bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">{profile.age}</span>
                        <span>•</span>
                        <span>{profile.specialty}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-3 flex justify-between items-center bg-white">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin size={12} />
                    {profile.location}
                </div>
                {/* Interactions Row */}
                <div className="flex gap-1.5">
                     <button className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors" title="Request Photo Access">
                        <Lock size={16} />
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); onProposal(); }}
                        className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Send Proposal"
                    >
                        <FileText size={16} />
                     </button>
                     <button className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors" title="Super Like">
                        <Star size={16} />
                     </button>
                     <button className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Like">
                        <Heart size={16} />
                     </button>
                </div>
            </div>
        </div>
    );
}

export default DiscoveryView;
