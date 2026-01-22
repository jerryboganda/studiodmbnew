import React from 'react';
import { HeartPulse, Users, Heart, MessageSquare, BarChart2, Settings, LogOut, ShieldCheck, UserCircle, Compass, UserCheck, Crown, Globe, Route, Bell } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onUpgrade?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onUpgrade }) => {
  return (
    <aside className="w-[280px] h-full flex flex-col bg-white border-r border-slate-200 shrink-0 z-20">
      {/* Branding */}
      <div className="h-20 flex items-center px-6 gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <HeartPulse size={24} weight="fill" className="text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          DMB<span className="text-primary">.</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-4 gap-2 py-4 overflow-y-auto">
        {/* Current User Profile Summary */}
        <div className="mb-6 p-4 bg-background-light rounded-xl flex items-center gap-3">
          <div className="relative">
            <div 
              className="size-12 rounded-full bg-cover bg-center" 
              style={{ backgroundImage: `url('${CURRENT_USER.avatarUrl}')` }}
            ></div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-sm font-bold truncate">{CURRENT_USER.name}</h2>
            <p className="text-xs text-slate-500 truncate">{CURRENT_USER.specialty}</p>
          </div>
        </div>

        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
        
        <NavItem 
          icon={<Compass size={20} />} 
          label="Discovery" 
          active={currentView === 'discovery'} 
          onClick={() => onNavigate('discovery')}
        />
        <NavItem 
          icon={<UserCheck size={20} />} 
          label="Matchmaker" 
          active={currentView === 'matchmaker'} 
          onClick={() => onNavigate('discovery')}
          badge="2"
        />
        <NavItem 
          icon={<Heart size={20} />} 
          label="Proposals" 
          active={currentView === 'dashboard'} 
          badge="3"
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Messages" 
            active={currentView === 'messages'}
            onClick={() => onNavigate('messages')}
            badge="1"
        />
        <NavItem 
            icon={<Route size={20} />} 
            label="Journey & Events" 
            active={currentView === 'progression'}
            onClick={() => onNavigate('progression')}
        />
        <NavItem 
            icon={<Users size={20} />} 
            label="Family Portal" 
            active={currentView === 'family'}
            onClick={() => onNavigate('family')}
            badge="New"
        />
        <NavItem 
            icon={<Globe size={20} />} 
            label="Communities" 
            active={currentView === 'communities'}
            onClick={() => onNavigate('communities')}
        />

        <div className="mt-8">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Settings</p>
          <NavItem 
            icon={<Bell size={20} />} 
            label="Notifications" 
            active={currentView === 'notifications'}
            onClick={() => onNavigate('notifications')}
            badge="6"
          />
          <NavItem 
            icon={<UserCircle size={20} />} 
            label="My Profile" 
            active={currentView === 'profile'}
            onClick={() => onNavigate('profile')}
            badge="65%"
          />
          <NavItem 
            icon={<ShieldCheck size={20} />} 
            label="Account & Identity" 
            active={currentView === 'settings'}
            onClick={() => onNavigate('settings')}
          />
          <NavItem icon={<Settings size={20} />} label="Preferences" />
        </div>
      </nav>

      {/* Upgrade Banner */}
      <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={onUpgrade}>
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Crown size={64} />
              </div>
              <div className="flex items-center gap-2 mb-2 text-yellow-400">
                  <Crown size={18} fill="currentColor" />
                  <span className="text-xs font-bold uppercase tracking-wide">Premium</span>
              </div>
              <h4 className="font-bold text-sm mb-1">Upgrade Plan</h4>
              <p className="text-xs text-slate-300 mb-3">Get unlimited likes & see who viewed you.</p>
              <button className="w-full py-1.5 bg-white text-slate-900 text-xs font-bold rounded shadow-sm hover:bg-slate-100 transition-colors">
                  View Plans
              </button>
          </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100">
        <button 
          onClick={() => onNavigate('signout')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign Out (Demo Auth)</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, badge, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors group text-left
        ${active 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-slate-100 text-slate-600 hover:text-primary'
        }
      `}
    >
      <span className={active ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}>
        {icon}
      </span>
      <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
      {badge && (
        <span className={`ml-auto text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === 'New' ? 'bg-blue-500' : 'bg-primary'}`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default Sidebar;
