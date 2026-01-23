import React, { useState, useEffect } from 'react';
import { 
    Calendar, CheckCircle2, Clock, MapPin, DollarSign, Store, ChevronRight, 
    Video, Phone, Users, HeartHandshake, PartyPopper, ArrowLeft, CalendarDays,
    Plus, Mail, Check, ExternalLink, Calculator, ShoppingBag
} from 'lucide-react';
import { MAIN_PROFILE, SECONDARY_PROFILE } from '../constants';
import api from '../services/api';
import echo from '../services/echo';
import { useAuthStore } from '../store/useAuthStore';

interface Track {
    id: number;
    partner_id: number;
    profile: any;
    stage: string;
    stageLabel: string;
    lastInteraction: string;
    nextAction: string;
    progress: number;
}

const ProgressionView: React.FC = () => {
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTracks();

    if (user?.id) {
        const channelName = `progression.${user.id}`;
        echo.private(channelName)
            .listen('.progression.updated', (e: any) => {
                console.log('Realtime Update:', e);
                fetchTracks();
            });
            
        return () => {
            echo.leave(channelName);
        };
    }
  }, [user?.id]);

  const fetchTracks = async () => {
    try {
        const response = await api.get('/progression/active');
        if (response.data.result) {
            setTracks(response.data.data);
        }
    } catch (error) {
        console.error("Failed to fetch progression tracks", error);
    } finally {
        setLoading(false);
    }
  };

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      {/* Header */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {selectedTrackId && (
              <button 
                onClick={() => setSelectedTrackId(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                  <ArrowLeft size={20} />
              </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
                {selectedTrackId ? 'Relationship Journey' : 'Progression Pipeline'}
            </h2>
            <p className="text-sm text-slate-500">
                {selectedTrackId ? `Managing connection with ${selectedTrack?.profile.name}` : 'Track your active connections and offline meetings.'}
            </p>
          </div>
        </div>
        
        {!selectedTrackId && (
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800">
                <CalendarDays size={16} /> Sync Calendar
            </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
            {selectedTrackId && selectedTrack ? (
                <RelationshipDetail track={selectedTrack} />
            ) : (
                <PipelineDashboard onSelect={(id) => setSelectedTrackId(id)} tracks={tracks} />
            )}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Views --- */

const PipelineDashboard: React.FC<{onSelect: (id: number) => void; tracks: Track[]}> = ({ onSelect, tracks }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">3 Meetings</h4>
                        <p className="text-xs text-slate-500">Scheduled this month</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">2 Families</h4>
                        <p className="text-xs text-slate-500">Met in-person</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <HeartHandshake size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">1 Exclusive</h4>
                        <p className="text-xs text-slate-500">Active courtships</p>
                    </div>
                </div>
            </div>

            {/* Stages Grid */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Active Tracks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tracks.map(track => (
                        <div 
                            key={track.id}
                            onClick={() => onSelect(track.id)}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 relative">
                                <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700">
                                    {track.stageLabel}
                                </div>
                            </div>
                            <div className="px-6 pb-6 relative">
                                <div className="size-20 rounded-full border-4 border-white bg-slate-300 -mt-10 mb-4 bg-cover bg-center shadow-md" style={{backgroundImage: `url(${track.profile.avatarUrl})`}}></div>
                                
                                <h4 className="text-xl font-bold text-slate-900">{track.profile.name}</h4>
                                <p className="text-sm text-slate-500 mb-4">{track.profile.specialty}</p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Stage Progress</span>
                                        <span>{track.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: `${track.progress}%`}}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary transition-colors">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} /> Last: {track.lastInteraction}
                                    </div>
                                    <div className="flex items-center gap-1 font-bold">
                                        Next: {track.nextAction} <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add New */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Plus size={24} />
                        </div>
                        <p className="font-bold text-sm">Discover New Matches</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RelationshipDetail: React.FC<{track: Track}> = ({ track }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'planning'>('overview');

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Top Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                 <div className="size-24 rounded-full bg-cover bg-center shrink-0 border-4 border-slate-50" style={{backgroundImage: `url(${track.profile.avatarUrl})`}}></div>
                 <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-slate-900">{track.profile.name}</h2>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                            {track.stageLabel}
                        </span>
                     </div>
                     <p className="text-slate-500 text-sm mb-4">{track.profile.hospital} • {track.profile.location}</p>
                     
                     {/* Stepper */}
                     <div className="flex items-center justify-between max-w-lg relative">
                         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
                         {['Chatting', 'Meeting', 'Courtship', 'Engaged'].map((s, i) => {
                             const isCompleted = ['Chatting', 'Meeting', 'Courtship'].indexOf(track.stage) >= i;
                             const isCurrent = track.stage.toLowerCase() === s.toLowerCase();
                             return (
                                 <div key={s} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                                     <div className={`size-3 rounded-full border-2 ${isCompleted ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}></div>
                                     <span className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-primary' : 'text-slate-400'}`}>{s}</span>
                                 </div>
                             )
                         })}
                     </div>
                 </div>
                 <div className="flex gap-2 shrink-0">
                     <button className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 hover:text-primary transition-colors"><Video size={20} /></button>
                     <button className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 hover:text-primary transition-colors"><Phone size={20} /></button>
                     <button className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 hover:text-primary transition-colors"><Mail size={20} /></button>
                 </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl w-fit mb-8">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Stage Checklists
                </button>
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Calendar size={16} /> Scheduling
                </button>
                <button 
                    onClick={() => setActiveTab('planning')}
                    disabled={track.stage === 'chatting'}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'planning' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                    <Store size={16} /> Event Planning
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'schedule' && <ScheduleTab />}
            {activeTab === 'planning' && <PlanningTab />}
        </div>
    );
};

const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-green-600" /> Current Stage Tasks
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <TaskItem label="Exchange detailed biodata" completed />
                <TaskItem label="Verify employment details" completed />
                <TaskItem label="First family video call" completed />
                <TaskItem label="In-person family dinner" />
                <TaskItem label="Discuss financial compatibility" />
                <TaskItem label="Align on relocation plans" />
            </div>

             <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                 <div className="mt-1"><Users size={20} className="text-blue-600" /></div>
                 <div>
                     <h4 className="font-bold text-blue-900 text-sm">Family Feedback</h4>
                     <p className="text-xs text-blue-700 mt-1">
                         "Mother liked her polite demeanor. Father wants to double check the hospital reputation."
                     </p>
                     <button className="text-xs font-bold text-blue-600 mt-2 hover:underline">Add Note</button>
                 </div>
             </div>
        </div>

        <div className="space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Clock className="text-orange-500" /> Interaction Log
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-6 relative">
                 <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-slate-100"></div>
                 <div className="space-y-6">
                     <TimelineItem 
                        icon={<Video size={14} />} 
                        title="Video Call (45 mins)" 
                        date="Yesterday" 
                        desc="Discussed research interests and future plans." 
                     />
                     <TimelineItem 
                        icon={<Mail size={14} />} 
                        title="Shared Kundali/Horoscope" 
                        date="3 days ago" 
                        desc="Families are reviewing compatibility." 
                     />
                     <TimelineItem 
                        icon={<HeartHandshake size={14} />} 
                        title="Moved to 'Courtship' Stage" 
                        date="1 week ago" 
                        desc="Both parties agreed to exclusivity." 
                     />
                 </div>
            </div>
        </div>
    </div>
);

const ScheduleTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Propose Meeting Time</h3>
                <div className="flex gap-2">
                     <button className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1">
                         <ExternalLink size={12} /> Sync Google Cal
                     </button>
                </div>
            </div>

            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-xs font-bold text-slate-400 uppercase pb-2">{d}</div>
                ))}
                {Array.from({length: 31}, (_, i) => i + 1).map(d => {
                    const isToday = d === 24;
                    const isSelected = d === 26;
                    return (
                        <div 
                            key={d} 
                            className={`
                                h-12 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors
                                ${isToday ? 'bg-slate-100 text-slate-900' : ''}
                                ${isSelected ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-50'}
                            `}
                        >
                            {d}
                        </div>
                    )
                })}
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-sm text-slate-900 mb-3">Available Slots for Oct 26th</h4>
                <div className="flex flex-wrap gap-3">
                    {['10:00 AM', '02:00 PM', '04:30 PM', '08:00 PM'].map(t => (
                        <button key={t} className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:border-primary hover:text-primary transition-colors">
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                 <h3 className="font-bold text-slate-900 mb-4">Availability Settings</h3>
                 <div className="space-y-3">
                     <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer">
                         <span className="text-sm text-slate-700">Share Calendar Free/Busy</span>
                         <input type="checkbox" className="accent-primary" defaultChecked />
                     </label>
                     <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer">
                         <span className="text-sm text-slate-700">Auto-detect Time Zone</span>
                         <input type="checkbox" className="accent-primary" defaultChecked />
                     </label>
                 </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6">
                <h3 className="font-bold mb-1">Upcoming</h3>
                <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-sm">Coffee Date</p>
                            <p className="text-xs text-slate-300">Blue Tokai, Delhi</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-sm">Oct 28</p>
                            <p className="text-xs text-slate-300">5:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PlanningTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
             <div className="bg-white rounded-xl border border-slate-200 p-6">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-slate-900 flex items-center gap-2">
                         <Store className="text-primary" size={18} /> Venue Shortlist
                     </h3>
                     <button className="text-xs font-bold text-primary">+ Add Venue</button>
                 </div>
                 
                 <div className="space-y-4">
                     <VenueCard 
                        name="Taj Palace, New Delhi" 
                        type="Engagement Venue" 
                        cost="₹₹₹₹" 
                        rating="4.8" 
                        status="Shortlisted"
                     />
                     <VenueCard 
                        name="Habitat Centre" 
                        type="Family Lunch" 
                        cost="₹₹" 
                        rating="4.5" 
                        status="Visited"
                     />
                 </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 p-6">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-slate-900 flex items-center gap-2">
                         <ShoppingBag className="text-purple-600" size={18} /> Vendor Marketplace
                     </h3>
                     <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Beta</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 border border-slate-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                         <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
                             <Video size={16} />
                         </div>
                         <p className="text-xs font-bold text-slate-900">Photographers</p>
                     </div>
                     <div className="p-3 border border-slate-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                         <div className="size-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600">
                             <PartyPopper size={16} />
                         </div>
                         <p className="text-xs font-bold text-slate-900">Decorators</p>
                     </div>
                 </div>
             </div>
        </div>

        <div className="space-y-6">
             <div className="bg-white rounded-xl border border-slate-200 p-6">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                     <Calculator className="text-green-600" size={18} /> Budget Tracker
                 </h3>
                 
                 <div className="bg-slate-50 p-4 rounded-xl mb-6">
                     <div className="flex justify-between text-sm mb-2">
                         <span className="text-slate-500">Total Budget</span>
                         <span className="font-bold text-slate-900">₹ 5,00,000</span>
                     </div>
                     <div className="flex justify-between text-sm mb-2">
                         <span className="text-slate-500">Spent (Est.)</span>
                         <span className="font-bold text-green-600">₹ 50,000</span>
                     </div>
                     <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-3">
                         <div className="h-full bg-green-500 w-[10%]"></div>
                     </div>
                 </div>

                 <div className="space-y-3">
                     <BudgetItem label="Engagement Ring" amount="₹ 45,000" />
                     <BudgetItem label="Venue Advance" amount="₹ 5,000" />
                 </div>
             </div>
        </div>
    </div>
);

/* Helper Components */

const TaskItem: React.FC<{label: string, completed?: boolean}> = ({ label, completed }) => (
    <div className={`p-4 border-b border-slate-100 flex items-center gap-3 ${completed ? 'bg-slate-50' : 'bg-white'}`}>
        <div className={`size-5 rounded-full border flex items-center justify-center ${completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
            {completed && <Check size={12} strokeWidth={3} />}
        </div>
        <span className={`text-sm ${completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{label}</span>
    </div>
);

const TimelineItem: React.FC<{icon: React.ReactNode, title: string, date: string, desc: string}> = ({ icon, title, date, desc }) => (
    <div className="flex gap-4 relative z-10">
        <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
            {icon}
        </div>
        <div>
            <div className="flex items-center gap-2">
                <h5 className="text-sm font-bold text-slate-900">{title}</h5>
                <span className="text-[10px] text-slate-400">{date}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
    </div>
);

const VenueCard: React.FC<{name: string, type: string, cost: string, rating: string, status: string}> = ({ name, type, cost, rating, status }) => (
    <div className="flex items-start gap-4 p-3 border border-slate-200 rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
        <div className="size-16 bg-slate-200 rounded-md shrink-0 bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=100&h=100)'}}></div>
        <div className="flex-1">
            <h5 className="font-bold text-slate-900 text-sm">{name}</h5>
            <p className="text-xs text-slate-500">{type} • {cost}</p>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 rounded flex items-center gap-1">★ {rating}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">{status}</span>
            </div>
        </div>
    </div>
);

const BudgetItem: React.FC<{label: string, amount: string}> = ({ label, amount }) => (
    <div className="flex justify-between items-center p-2 border-b border-slate-50 last:border-0">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-bold text-slate-900">{amount}</span>
    </div>
);

export default ProgressionView;
