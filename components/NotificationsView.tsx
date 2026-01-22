import React, { useState } from 'react';
import { 
    Bell, Mail, MessageCircle, Smartphone, Moon, Sun, Clock, Check, X, 
    AlertTriangle, Shield, Heart, Search, FileText, ChevronRight, Zap, 
    Calendar, PauseCircle, PlayCircle, Filter
} from 'lucide-react';
import { MAIN_PROFILE } from '../constants';

const NOTIFICATIONS = [
  { 
      id: 1, 
      type: 'match', 
      category: 'growth',
      title: 'New High Compatibility Match', 
      desc: 'Dr. Aarav (Ortho, AIIMS) matches 98% of your preferences.', 
      time: '10 mins ago', 
      read: false,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
      id: 2, 
      type: 'expiry', 
      category: 'alert',
      title: 'Interest Expiring Soon', 
      desc: 'Your proposal to Dr. Rohan expires in 4 hours.', 
      time: '1 hour ago', 
      read: false, 
      action: 'Extend Time' 
  },
  { 
      id: 3, 
      type: 'search', 
      category: 'growth',
      title: 'Saved Search Alert', 
      desc: '3 new profiles match your "Surgeon in South Delhi" filter.', 
      time: '4 hours ago', 
      read: true,
      action: 'View Profiles'
  },
  { 
      id: 4, 
      type: 'safety', 
      category: 'system',
      title: 'Verification Reminder', 
      desc: 'Upload your ID to get the Blue Badge and 3x more views.', 
      time: '1 day ago', 
      read: true, 
      action: 'Verify Now' 
  },
  { 
      id: 5, 
      type: 'view', 
      category: 'growth',
      title: 'Profile View', 
      desc: 'Dr. Priya and 4 others viewed your profile.', 
      time: 'Yesterday', 
      read: true 
  },
  { 
      id: 6, 
      type: 'system', 
      category: 'system',
      title: 'Weekly Digest Ready', 
      desc: 'Your curated list of top profiles for the week is here.', 
      time: '2 days ago', 
      read: true,
      isDigest: true
  },
];

const NotificationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system'>('all');
  const [snoozed, setSnoozed] = useState(false);

  const displayedNotifications = NOTIFICATIONS.filter(n => {
      if (activeTab === 'unread') return !n.read;
      if (activeTab === 'system') return n.category === 'system' || n.category === 'alert';
      return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      {/* Header */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h2>
          <p className="text-sm text-slate-500">Stay updated on matches, activity, and account status.</p>
        </div>
        <div className="flex gap-2">
             <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900">Mark all as read</button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: Feed */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="max-w-2xl mx-auto space-y-6">
                  
                  {/* "While you were away" Recap Card */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
                      <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-2 opacity-90">
                              <Moon size={18} />
                              <span className="text-xs font-bold uppercase tracking-wide">While you were away</span>
                          </div>
                          <h3 className="text-2xl font-bold mb-4">You missed a few things...</h3>
                          <div className="flex gap-6">
                              <div>
                                  <p className="text-3xl font-black">3</p>
                                  <p className="text-xs opacity-80">New Likes</p>
                              </div>
                              <div>
                                  <p className="text-3xl font-black">1</p>
                                  <p className="text-xs opacity-80">Message</p>
                              </div>
                              <div>
                                  <p className="text-3xl font-black">5</p>
                                  <p className="text-xs opacity-80">Profile Views</p>
                              </div>
                          </div>
                      </div>
                      <div className="absolute right-0 bottom-0 opacity-10">
                          <Bell size={140} />
                      </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <TabButton label="All Activity" active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={6} />
                      <TabButton label="Unread" active={activeTab === 'unread'} onClick={() => setActiveTab('unread')} count={2} />
                      <TabButton label="System & Safety" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
                  </div>

                  {/* Notification List */}
                  <div className="space-y-4">
                      {displayedNotifications.map((note) => (
                          <div 
                            key={note.id} 
                            className={`
                                bg-white p-4 rounded-xl border transition-all hover:shadow-md
                                ${note.read ? 'border-slate-100' : 'border-l-4 border-l-primary border-y-slate-100 border-r-slate-100 bg-primary/5'}
                            `}
                          >
                              <div className="flex gap-4">
                                  {/* Icon/Avatar */}
                                  <div className="shrink-0">
                                      {note.avatar ? (
                                          <div className="size-12 rounded-full bg-cover bg-center border border-slate-200" style={{backgroundImage: `url(${note.avatar})`}}></div>
                                      ) : (
                                          <div className={`size-12 rounded-full flex items-center justify-center ${
                                              note.type === 'safety' ? 'bg-red-100 text-red-600' :
                                              note.type === 'expiry' ? 'bg-orange-100 text-orange-600' :
                                              note.type === 'search' ? 'bg-blue-100 text-blue-600' :
                                              'bg-slate-100 text-slate-500'
                                          }`}>
                                              {note.type === 'safety' && <Shield size={20} />}
                                              {note.type === 'expiry' && <Clock size={20} />}
                                              {note.type === 'search' && <Search size={20} />}
                                              {note.type === 'system' && <Zap size={20} />}
                                              {note.type === 'view' && <Heart size={20} />}
                                          </div>
                                      )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                          <h4 className={`text-sm ${note.read ? 'font-bold text-slate-900' : 'font-black text-slate-900'}`}>{note.title}</h4>
                                          <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{note.time}</span>
                                      </div>
                                      <p className="text-sm text-slate-600 mt-1">{note.desc}</p>
                                      
                                      {/* Actions */}
                                      {note.action && (
                                          <button className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors inline-flex items-center gap-1 ${
                                              note.type === 'expiry' ? 'border-orange-200 text-orange-700 hover:bg-orange-50' :
                                              note.type === 'safety' ? 'border-red-200 text-red-700 hover:bg-red-50' :
                                              'border-slate-200 text-slate-700 hover:bg-slate-50'
                                          }`}>
                                              {note.action} <ChevronRight size={12} />
                                          </button>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* RIGHT: Settings & Tools */}
          <div className="w-full md:w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">
              
              {/* Channels */}
              <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                      <ChannelToggle icon={<Mail size={16} />} label="Email Digest" desc="Daily summary" defaultChecked />
                      <ChannelToggle icon={<MessageCircle size={16} />} label="WhatsApp" desc="Instant match alerts" defaultChecked />
                      <ChannelToggle icon={<Smartphone size={16} />} label="Push Notifications" desc="Real-time activity" defaultChecked />
                      <ChannelToggle icon={<FileText size={16} />} label="SMS" desc="Only for security" defaultChecked={false} />
                  </div>
              </div>

              {/* Digests */}
              <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Curated Digests</h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                          <div className="size-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                              <Zap size={16} />
                          </div>
                          <div>
                              <p className="font-bold text-sm text-slate-900">Weekly Top 5</p>
                              <p className="text-xs text-slate-500">Every Sunday</p>
                          </div>
                          <div className="ml-auto">
                              <input type="checkbox" className="accent-purple-600 size-4" defaultChecked />
                          </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 border-t border-slate-200 pt-2">
                          Get a hand-picked list of the most compatible profiles delivered to your inbox.
                      </p>
                  </div>
              </div>

              {/* Snooze / Re-engagement */}
              <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Profile Status</h3>
                  
                  <div className={`rounded-xl p-4 border transition-colors ${snoozed ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-bold ${snoozed ? 'text-yellow-800' : 'text-slate-900'}`}>
                              {snoozed ? 'Profile Snoozed' : 'Profile Active'}
                          </span>
                          <button 
                            onClick={() => setSnoozed(!snoozed)}
                            className={`text-xs font-bold px-2 py-1 rounded transition-colors ${snoozed ? 'bg-white text-yellow-700 shadow-sm' : 'bg-slate-100 text-slate-600'}`}
                          >
                              {snoozed ? 'Wake Up' : 'Snooze'}
                          </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                          {snoozed 
                            ? 'You are hidden from new searches. Existing connections remain active.' 
                            : 'You are visible to all matches. Taking a break? Snooze to pause requests.'}
                      </p>
                      
                      {snoozed && (
                          <div className="flex items-center gap-2 text-xs font-bold text-yellow-700 bg-yellow-100/50 p-2 rounded-lg">
                              <Clock size={12} />
                              Auto-wake in 7 days
                          </div>
                      )}
                  </div>
              </div>

              {/* Win-back (Simulated) */}
              {snoozed && (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white text-center">
                      <p className="font-bold text-sm mb-1">Missed a connection?</p>
                      <p className="text-xs text-slate-300 mb-3">3 profiles matched with you while you were snoozed.</p>
                      <button 
                        onClick={() => setSnoozed(false)}
                        className="w-full py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100"
                      >
                          Reactivate Now
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{label: string, active: boolean, onClick: () => void, count?: number}> = ({ label, active, onClick, count }) => (
    <button 
        onClick={onClick}
        className={`
            px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2
            ${active ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
        `}
    >
        {label}
        {count && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-600'}`}>
                {count}
            </span>
        )}
    </button>
);

const ChannelToggle: React.FC<{icon: React.ReactNode, label: string, desc: string, defaultChecked: boolean}> = ({ icon, label, desc, defaultChecked }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-400 mt-1">{icon}</div>
        <div className="flex-1">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
    </div>
);

export default NotificationsView;