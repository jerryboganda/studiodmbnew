import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import ProfileCard from './components/ProfileCard';
import ProfileTeaser from './components/ProfileTeaser';
import SettingsView from './components/SettingsView';
import OnboardingModal from './components/OnboardingModal';
import ProfileEditView from './components/ProfileEditView';
import DiscoveryView from './components/DiscoveryView';
import ProposalModal from './components/ProposalModal';
import DeclineModal from './components/DeclineModal';
import MessagesView from './components/MessagesView';
import SubscriptionModal from './components/SubscriptionModal';
import PaymentModal from './components/PaymentModal';
import FamilyPortalView from './components/FamilyPortalView';
import CommunityView from './components/CommunityView';
import ProgressionView from './components/ProgressionView';
import NotificationsView from './components/NotificationsView';
import AuthModal from './components/AuthModal';
import WelcomeScreen from './components/WelcomeScreen';
import { Bell } from 'lucide-react';
import { ProfileMatch } from './types';

const App: React.FC = () => {
  // Auth State: Starts false to show Welcome Screen
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [proposalTarget, setProposalTarget] = useState<ProfileMatch | null>(null);
  
  // Auth Modal State (for re-auth inside app)
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Billing & Subscription State
  const [showSubscription, setShowSubscription] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{name: string, amount: number} | null>(null);

  const handleSelectPlan = (name: string, amount: number) => {
      setShowSubscription(false);
      setCheckoutItem({ name, amount });
  };

  const handleSignOut = () => {
      setIsAuthenticated(false);
      setCurrentView('dashboard'); // Reset view on sign out
  }

  // Render Welcome Screen if not authenticated
  if (!isAuthenticated) {
      return <WelcomeScreen onComplete={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen w-full bg-background-light">
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => {
            if (view === 'signout') {
                handleSignOut();
            } else {
                setCurrentView(view);
            }
        }} 
        onUpgrade={() => setShowSubscription(true)}
      />
      
      {/* Center Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {currentView === 'dashboard' ? (
            <>
                {/* Header/Tabs */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-background-light/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex gap-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                    <button className="px-6 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        All Proposals
                    </button>
                    <button className="px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md">
                        High Compatibility
                    </button>
                    <button className="px-6 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        Recent
                    </button>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setCurrentView('notifications')}
                        className={`size-10 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-100 relative ${currentView === 'notifications' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:text-primary'}`}
                    >
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2 scrollbar-hide">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                    <ProfileCard onDecline={() => setShowDeclineModal(true)} />
                    <ProfileTeaser />
                </div>
                </div>
            </>
        ) : currentView === 'settings' ? (
            <SettingsView 
                onLaunchOnboarding={() => setShowOnboarding(true)} 
                onOpenBilling={() => setShowSubscription(true)}
            />
        ) : currentView === 'profile' ? (
            <ProfileEditView />
        ) : currentView === 'family' ? (
            <FamilyPortalView />
        ) : currentView === 'communities' ? (
            <CommunityView />
        ) : currentView === 'progression' ? (
            <ProgressionView />
        ) : currentView === 'notifications' ? (
            <NotificationsView />
        ) : currentView === 'messages' ? (
            <MessagesView />
        ) : (
            <DiscoveryView onSendProposal={(p) => setProposalTarget(p)} />
        )}
      </main>

      {currentView === 'dashboard' && <RightSidebar />}
      
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      
      {showDeclineModal && (
          <DeclineModal onClose={() => setShowDeclineModal(false)} />
      )}

      {proposalTarget && (
          <ProposalModal profile={proposalTarget} onClose={() => setProposalTarget(null)} />
      )}
      
      {showSubscription && (
          <SubscriptionModal 
            onClose={() => setShowSubscription(false)} 
            onSelectPlan={handleSelectPlan}
          />
      )}

      {checkoutItem && (
          <PaymentModal 
            planName={checkoutItem.name}
            amount={checkoutItem.amount}
            onClose={() => setCheckoutItem(null)}
          />
      )}

      {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onLogin={() => setShowAuthModal(false)}
          />
      )}
      
      <style>{`
        .form-input {
            width: 100%;
            padding: 0.625rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid #cbd5e1;
            color: #0f172a;
            font-size: 0.875rem;
            background-color: white;
            transition: all 0.2s;
        }
        .form-input:focus {
            border-color: #d41173;
            outline: none;
            box-shadow: 0 0 0 1px rgba(212, 17, 115, 0.1);
        }
      `}</style>
    </div>
  );
};

export default App;
