import React, { useState } from 'react';
import { 
    Shield, Smartphone, Mail, Globe, Users, Lock, Eye, EyeOff, PauseCircle, Download, FileText, 
    Check, ChevronRight, UserCog, ShieldCheck, Siren, Ban, UserX, ScanFace, Building2,
    Ghost, Fingerprint, Trash2, Key, History, Umbrella, CreditCard, Receipt, Gift,
    UserPlus, SmartphoneNfc, LogOut, Laptop, Tablet, Bell
} from 'lucide-react';
import VerificationModal from './VerificationModal';
import StepUpVerificationModal from './StepUpVerificationModal';
import TwoFactorSetupModal from './TwoFactorSetupModal';

interface SettingsViewProps {
  onLaunchOnboarding: () => void;
  onOpenBilling?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onLaunchOnboarding, onOpenBilling }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'safety' | 'billing'>('account');
  const [managementMode, setManagementMode] = useState<'self' | 'family' | 'matchmaker' | 'dual'>('self');
  const [snoozeEnabled, setSnoozeEnabled] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [stepUpAction, setStepUpAction] = useState<string | null>(null);
  
  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Device Management State
  const [devices, setDevices] = useState([
      { id: 1, name: 'Chrome on MacBook Pro', location: 'New Delhi, India', lastActive: 'Active Now', type: 'desktop', current: true },
      { id: 2, name: 'iPhone 14 Pro', location: 'New Delhi, India', lastActive: '2 hours ago', type: 'mobile', current: false },
      { id: 3, name: 'iPad Air', location: 'Mumbai, India', lastActive: '3 days ago', type: 'tablet', current: false },
  ]);
  const [loginAlerts, setLoginAlerts] = useState({ email: true, sms: false });

  // Privacy State
  const [incognito, setIncognito] = useState(false);
  const [watermark, setWatermark] = useState(true);

  // Recovery State
  const [trustedContact, setTrustedContact] = useState<{name: string, relation: string} | null>(null);

  const handleStepUpSuccess = () => {
      setStepUpAction(null);
      // In a real app, perform the sensitive action here
      alert("Verification Successful! Action authorized.");
  };

  const handleRevokeDevice = (id: number) => {
      setDevices(devices.filter(d => d.id !== id));
  };

  const handleRevokeAll = () => {
      setDevices(devices.filter(d => d.current));
      alert("Signed out of all other devices.");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <div className="flex gap-6 mt-1">
             <button 
                onClick={() => setActiveTab('account')}
                className={`text-sm font-bold transition-colors border-b-2 pb-0.5 ${activeTab === 'account' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
                Account & Security
            </button>
             <button 
                onClick={() => setActiveTab('billing')}
                className={`text-sm font-bold transition-colors border-b-2 pb-0.5 flex items-center gap-1.5 ${activeTab === 'billing' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
                <CreditCard size={14} /> Billing & Plans
            </button>
             <button 
                onClick={() => setActiveTab('privacy')}
                className={`text-sm font-bold transition-colors border-b-2 pb-0.5 flex items-center gap-1.5 ${activeTab === 'privacy' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
                <EyeOff size={14} /> Privacy
            </button>
             <button 
                onClick={() => setActiveTab('safety')}
                className={`text-sm font-bold transition-colors border-b-2 pb-0.5 flex items-center gap-1.5 ${activeTab === 'safety' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
                <ShieldCheck size={14} /> Safety
            </button>
          </div>
        </div>
        <button 
            onClick={onLaunchOnboarding}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg"
        >
            <UserCog size={18} />
            Run Onboarding Demo
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'account' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Account & Identity Column */}
                <div className="space-y-6">
                    <SectionHeader title="Access Credentials" icon={<Shield size={20} className="text-primary" />} />
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Registration & Login Methods</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                                            <Mail size={18} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Email Address</p>
                                            <p className="text-xs text-slate-500">dr.rajesh@example.com</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        <Check size={12} /> Verified
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                                            <Smartphone size={18} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Phone OTP</p>
                                            <p className="text-xs text-slate-500">+91 98765 XXXXX</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        <Check size={12} /> Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recoverability Section */}
                        <div className="p-6 bg-slate-50/50">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Key size={16} className="text-orange-500" /> Account Recovery
                                </h4>
                                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">Recommended</span>
                            </div>
                            
                            <div className="space-y-3">
                                {!trustedContact ? (
                                    <button 
                                        onClick={() => setTrustedContact({name: 'Amit Kumar', relation: 'Brother'})}
                                        className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary hover:bg-white transition-all"
                                    >
                                        <UserPlus size={18} />
                                        <span className="text-sm font-bold">Add Trusted Contact</span>
                                    </button>
                                ) : (
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{trustedContact.name}</p>
                                                <p className="text-xs text-slate-500">{trustedContact.relation} • Can help recover account</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setTrustedContact(null)} className="text-xs text-red-500 font-bold hover:underline">Remove</button>
                                    </div>
                                )}
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Trusted contacts can verify your identity if you lose access to your phone/email.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Sessions & Devices */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <SmartphoneNfc size={18} className="text-slate-600" /> Device Management
                            </h4>
                            {devices.length > 1 && (
                                <button 
                                    onClick={handleRevokeAll}
                                    className="text-xs font-bold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Sign out other devices
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {devices.map(device => (
                                <div key={device.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-full flex items-center justify-center ${device.current ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {device.type === 'mobile' ? <Smartphone size={20} /> : device.type === 'tablet' ? <Tablet size={20} /> : <Laptop size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-slate-900">{device.name}</p>
                                                {device.current && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider">This Device</span>}
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                {device.location} • <span className={device.current ? 'text-green-600 font-bold' : ''}>{device.lastActive}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {!device.current && (
                                        <button 
                                            onClick={() => handleRevokeDevice(device.id)}
                                            className="text-xs font-bold text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sign Out"
                                        >
                                            <LogOut size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Bell size={16} className="text-orange-500" /> Security Alerts
                            </h5>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Email me when a new device logs in</span>
                                    <input 
                                        type="checkbox" 
                                        checked={loginAlerts.email}
                                        onChange={(e) => setLoginAlerts({...loginAlerts, email: e.target.checked})}
                                        className="accent-primary size-4"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Send SMS alert for unknown locations</span>
                                    <input 
                                        type="checkbox" 
                                        checked={loginAlerts.sms}
                                        onChange={(e) => setLoginAlerts({...loginAlerts, sms: e.target.checked})}
                                        className="accent-primary size-4"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Management Column */}
                <div className="space-y-6">
                    <SectionHeader title="Profile Roles & Ownership" icon={<Users size={20} className="text-primary" />} />

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h4 className="font-bold text-slate-900 mb-4">Who manages this profile?</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <RoleOption 
                                label="Self Managed" 
                                desc="I handle all proposals" 
                                selected={managementMode === 'self'} 
                                onClick={() => setManagementMode('self')}
                            />
                            <RoleOption 
                                label="Family Managed" 
                                desc="Parents manage account" 
                                selected={managementMode === 'family'} 
                                onClick={() => setManagementMode('family')}
                            />
                            <RoleOption 
                                label="Matchmaker (Agent)" 
                                desc="Professional assistance" 
                                selected={managementMode === 'matchmaker'} 
                                onClick={() => setManagementMode('matchmaker')}
                            />
                            <RoleOption 
                                label="Dual Control" 
                                desc="Me + Family approval" 
                                selected={managementMode === 'dual'} 
                                onClick={() => setManagementMode('dual')}
                            />
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="font-bold text-slate-900 mb-3">Ownership Controls</h4>
                            <button 
                                onClick={() => setStepUpAction("transfer ownership")}
                                className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-slate-100 rounded-full flex items-center justify-center">
                                        <Users size={16} className="text-slate-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-800">Transfer Ownership</p>
                                        <p className="text-xs text-slate-500">Pass control to family or back to candidate</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
                            </button>
                        </div>
                    </div>

                    <div className={`rounded-xl shadow-sm border p-6 transition-colors ${!is2FAEnabled ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
                         <div className="flex items-center justify-between mb-2">
                             <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                Two-Factor Authentication
                                {!is2FAEnabled ? (
                                    <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Recommended</span>
                                ) : (
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Check size={10} /> Active</span>
                                )}
                             </h4>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={is2FAEnabled}
                                    onChange={() => {
                                        if (!is2FAEnabled) {
                                            setShow2FAModal(true);
                                        } else {
                                            setIs2FAEnabled(false);
                                        }
                                    }}
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                         </div>
                         <p className="text-xs text-slate-500">
                             Secure your account with an additional layer of protection via Authenticator App, SMS, or Email.
                         </p>
                         {is2FAEnabled && (
                             <div className="mt-4 flex gap-2">
                                 <button onClick={() => setShow2FAModal(true)} className="text-xs font-bold text-primary hover:underline">Reconfigure</button>
                                 <span className="text-slate-300">|</span>
                                 <button className="text-xs font-bold text-slate-500 hover:text-slate-800">View Backup Codes</button>
                             </div>
                         )}
                    </div>
                </div>
              </div>
          )}

          {activeTab === 'billing' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-6">
                      <SectionHeader title="Current Plan" icon={<CreditCard size={20} className="text-orange-500" />} />
                      
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 bg-orange-500 text-white text-xs font-bold rounded-bl-xl">ACTIVE</div>
                          
                          <h3 className="text-2xl font-black mb-1">Free Plan</h3>
                          <p className="text-slate-400 text-sm mb-6">Basic Visibility</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                  <p className="text-xs text-slate-400 uppercase font-bold">Interests Left</p>
                                  <p className="text-lg font-bold">2 / 10</p>
                              </div>
                              <div>
                                  <p className="text-xs text-slate-400 uppercase font-bold">Super Likes</p>
                                  <p className="text-lg font-bold">0</p>
                              </div>
                              <div>
                                  <p className="text-xs text-slate-400 uppercase font-bold">Contact Views</p>
                                  <p className="text-lg font-bold">0</p>
                              </div>
                          </div>

                          <button 
                            onClick={onOpenBilling}
                            className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                          >
                              Upgrade to Premium
                          </button>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-slate-900">Payment Methods</h4>
                              <button className="text-xs font-bold text-primary">Add New</button>
                          </div>
                          
                          <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <div className="size-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                          <CreditCard size={16} />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-900">Visa ending in 4242</p>
                                          <p className="text-xs text-slate-500">Expires 12/25</p>
                                      </div>
                                  </div>
                                  <button className="text-xs text-red-500 font-bold">Remove</button>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <SectionHeader title="Billing History" icon={<Receipt size={20} className="text-slate-600" />} />
                      
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-sm">
                              <thead className="bg-slate-50 border-b border-slate-100">
                                  <tr>
                                      <th className="text-left p-4 font-bold text-slate-600">Date</th>
                                      <th className="text-left p-4 font-bold text-slate-600">Description</th>
                                      <th className="text-right p-4 font-bold text-slate-600">Amount</th>
                                      <th className="text-right p-4 font-bold text-slate-600">Status</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="border-b border-slate-50">
                                      <td className="p-4 text-slate-500">Oct 24, 2023</td>
                                      <td className="p-4 font-medium text-slate-900">Profile Boost (1hr)</td>
                                      <td className="p-4 text-right">₹499.00</td>
                                      <td className="p-4 text-right"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Paid</span></td>
                                  </tr>
                              </tbody>
                          </table>
                          <div className="p-4 text-center">
                              <button className="text-xs font-bold text-slate-500 hover:text-slate-900">View All Transactions</button>
                          </div>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 flex items-center gap-4">
                          <div className="size-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                              <Gift size={24} />
                          </div>
                          <div className="flex-1">
                              <h4 className="font-bold text-purple-900">Refer a Doctor</h4>
                              <p className="text-xs text-purple-700 mb-2">Get 1 month of Gold membership for free when a friend subscribes.</p>
                              <div className="flex gap-2">
                                  <div className="bg-white px-3 py-1.5 rounded border border-purple-200 text-xs font-mono font-bold text-slate-600">
                                      DR-RAJ-2024
                                  </div>
                                  <button className="text-xs font-bold text-purple-600 hover:underline">Copy</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'privacy' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* Left Column: Visibility Controls */}
                  <div className="space-y-8">
                      {/* Granular Visibility */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <SectionHeader title="Granular Visibility" icon={<Eye size={20} className="text-primary" />} />
                          <p className="text-sm text-slate-500 mb-6 mt-2">Control what strangers see before you accept their proposal.</p>
                          
                          <div className="space-y-4">
                              <ToggleRow 
                                label="Hide Last Name" 
                                sub="Display as 'Dr. Rajesh K.'" 
                                defaultChecked={true} 
                              />
                              <ToggleRow 
                                label="Blur Photos Initially" 
                                sub="Photos remain blurred until you accept a request" 
                                defaultChecked={false} 
                              />
                              <ToggleRow 
                                label="Hide Employer / Hospital" 
                                sub="Show only designation (e.g. 'Senior Resident')" 
                                defaultChecked={true} 
                              />
                              <ToggleRow 
                                label="Hide Exact Location" 
                                sub="Show 'New Delhi' instead of 'South Extension'" 
                                defaultChecked={true} 
                              />
                              <ToggleRow 
                                label="Mask Contact Details" 
                                sub="Hide Phone & Email even from accepted matches" 
                                defaultChecked={true} 
                              />
                          </div>
                      </div>

                      {/* Incognito & Discovery */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <SectionHeader title="Incognito & Discovery" icon={<Ghost size={20} className="text-slate-700" />} />
                          
                          <div className="mt-4 space-y-4">
                               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                   <div>
                                       <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                           Incognito Mode
                                           <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Premium</span>
                                       </h4>
                                       <p className="text-xs text-slate-500 mt-1">View profiles without appearing in their "Who Viewed Me" list.</p>
                                   </div>
                                   <div 
                                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${incognito ? 'bg-slate-900' : 'bg-slate-300'}`}
                                        onClick={() => setIncognito(!incognito)}
                                   >
                                        <div className={`absolute top-1 size-5 bg-white rounded-full shadow-sm transition-all ${incognito ? 'left-6' : 'left-1'}`}></div>
                                   </div>
                               </div>

                               <div className="flex items-center justify-between p-3">
                                   <div>
                                       <h4 className="font-bold text-slate-900 text-sm">Selective Display</h4>
                                       <p className="text-xs text-slate-500">Only show my profile to people I have Liked.</p>
                                   </div>
                                   <input type="checkbox" className="size-5 accent-primary" />
                               </div>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Consent, Family, Data */}
                  <div className="space-y-8">
                      
                      {/* Family Permissions */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <SectionHeader title="Family Access Controls" icon={<Users size={20} className="text-blue-600" />} />
                          <p className="text-sm text-slate-500 mb-4 mt-2">What can your family members (Guardians) see or do?</p>
                          
                          <div className="space-y-3">
                              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                  <span className="text-sm font-bold text-slate-700">View Private Messages</span>
                                  <input type="checkbox" className="size-4 accent-blue-600" />
                              </label>
                              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                  <span className="text-sm font-bold text-slate-700">Send Proposals on my behalf</span>
                                  <input type="checkbox" className="size-4 accent-blue-600" defaultChecked />
                              </label>
                              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                  <span className="text-sm font-bold text-slate-700">Edit Profile Details</span>
                                  <input type="checkbox" className="size-4 accent-blue-600" defaultChecked />
                              </label>
                              <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                  <span className="text-sm font-bold text-slate-700">Delete Account</span>
                                  <input type="checkbox" className="size-4 accent-blue-600" disabled title="Only main user can delete" />
                              </label>
                          </div>
                      </div>

                      {/* Consent Revocation */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <SectionHeader title="Consent Management" icon={<Key size={20} className="text-orange-500" />} />
                          <p className="text-sm text-slate-500 mb-4 mt-2">Manage who has access to your private data.</p>

                          <div className="space-y-3">
                              <AccessRow name="Dr. Aditi Sharma" accessType="Photo Vault" time="2 days ago" />
                              <AccessRow name="Matchmaker Seema" accessType="Full Profile" time="1 month ago" />
                              <AccessRow name="Dr. Rohan Gupta" accessType="Phone Number" time="1 week ago" />
                          </div>
                      </div>

                      {/* Screenshot & Data */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <SectionHeader title="Data & Security" icon={<Fingerprint size={20} className="text-red-500" />} />
                          
                          <div className="mt-4 space-y-4">
                              <div className="flex items-center justify-between">
                                   <div>
                                       <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                           <Umbrella size={14} /> Screenshot Deterrence
                                       </h4>
                                       <p className="text-xs text-slate-500">Apply dynamic watermarks to all your photos.</p>
                                   </div>
                                   <div 
                                        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${watermark ? 'bg-primary' : 'bg-slate-300'}`}
                                        onClick={() => setWatermark(!watermark)}
                                   >
                                        <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${watermark ? 'left-5' : 'left-1'}`}></div>
                                   </div>
                              </div>
                              
                              <hr className="border-slate-100" />

                              <button className="w-full flex items-center justify-between p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                                  <div className="flex items-center gap-2">
                                      <Download size={16} />
                                      <span className="text-sm font-bold">Download My Data</span>
                                  </div>
                                  <ChevronRight size={16} />
                              </button>

                              <button 
                                onClick={() => setStepUpAction("delete account")}
                                className="w-full flex items-center justify-between p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                  <div className="flex items-center gap-2">
                                      <Trash2 size={16} />
                                      <span className="text-sm font-bold">Delete Account</span>
                                  </div>
                                  <ChevronRight size={16} />
                              </button>
                          </div>
                      </div>

                  </div>
              </div>
          )}

          {activeTab === 'safety' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                  {/* Trust & Verification Column */}
                  <div className="space-y-6">
                      <SectionHeader title="Verification Status" icon={<ShieldCheck size={20} className="text-green-600" />} />
                      
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <div className="flex justify-between items-center mb-6">
                             <div>
                                <h4 className="font-bold text-slate-900">Identity Trust Score</h4>
                                <p className="text-xs text-slate-500">Higher score improves visibility by 3x</p>
                             </div>
                             <div className="relative size-12 flex items-center justify-center">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#16a34a" strokeWidth="4" strokeDasharray="60, 100" />
                                </svg>
                                <span className="absolute text-xs font-bold text-green-700">60%</span>
                             </div>
                          </div>

                          <div className="space-y-4">
                              <VerificationItem 
                                label="Phone & Email" 
                                status="verified" 
                                desc="Basic contact verification"
                              />
                              <VerificationItem 
                                label="Government ID" 
                                status="pending" 
                                desc="Aadhaar, Passport or Driving License"
                                actionLabel="Verify Now"
                                onAction={() => setShowVerification(true)}
                              />
                              <VerificationItem 
                                label="Selfie Liveness" 
                                status="unverified" 
                                desc="Real-time face scan to prevent bots"
                              />
                              <VerificationItem 
                                label="Education (MD)" 
                                status="unverified" 
                                desc="Degree certificate verification"
                              />
                          </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                          <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                              <ShieldCheck size={18} /> Get the Blue Badge
                          </h4>
                          <p className="text-sm text-purple-800 mb-4">Verified profiles get 5x more responses and access to premium matching pools.</p>
                          <button 
                             onClick={() => setShowVerification(true)}
                             className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-purple-700 w-full"
                          >
                              Start Verification
                          </button>
                      </div>
                  </div>

                  {/* Safety & Privacy Boundaries */}
                  <div className="space-y-6">
                      <SectionHeader title="Safety & Privacy Boundaries" icon={<Ban size={20} className="text-red-500" />} />
                      
                      {/* Do Not Show Me To */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <h4 className="font-bold text-slate-900 mb-2">"Do Not Show Me To" Lists</h4>
                          <p className="text-xs text-slate-500 mb-4">Prevent users from specific organizations or regions from seeing your profile.</p>
                          
                          <div className="space-y-3">
                              <PrivacyListRow icon={<Building2 size={16} />} label="Hospitals / Workplaces" value="0 added" />
                              <PrivacyListRow icon={<Globe size={16} />} label="Cities / Regions" value="0 added" />
                              <PrivacyListRow icon={<Users size={16} />} label="Universities (Alumni)" value="0 added" />
                          </div>
                      </div>

                      {/* Blocked Users */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                              <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                  <UserX size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">Blocked Users</h4>
                                  <p className="text-xs text-slate-500">Manage your block list (3 users)</p>
                              </div>
                          </div>
                          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">Manage</button>
                      </div>

                      {/* Emergency Tools */}
                      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                           <div className="flex items-center gap-2 mb-2 text-red-700">
                               <Siren size={20} />
                               <h4 className="font-bold">Emergency Safety Tools</h4>
                           </div>
                           <p className="text-xs text-red-800 mb-4">Configure triggers for immediate assistance during offline meetings.</p>
                           
                           <div className="flex items-center justify-between bg-white/60 p-3 rounded-lg border border-red-100 mb-2">
                               <span className="text-sm font-bold text-slate-800">Panic Button</span>
                               <div className="w-10 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                           </div>
                           <div className="flex items-center justify-between bg-white/60 p-3 rounded-lg border border-red-100">
                               <span className="text-sm font-bold text-slate-800">Safety Check-in Timer</span>
                               <span className="text-xs text-red-600 font-bold cursor-pointer">Configure</span>
                           </div>
                      </div>
                  </div>
              </div>
          )}

        </div>
      </div>

      {showVerification && <VerificationModal onClose={() => setShowVerification(false)} />}
      {stepUpAction && (
          <StepUpVerificationModal 
            actionLabel={stepUpAction} 
            onCancel={() => setStepUpAction(null)}
            onVerified={handleStepUpSuccess}
          />
      )}
      {show2FAModal && (
          <TwoFactorSetupModal 
            onClose={() => setShow2FAModal(false)}
            onComplete={() => {
                setIs2FAEnabled(true);
                setShow2FAModal(false);
            }}
          />
      )}
    </div>
  );
};

const SectionHeader: React.FC<{title: string, icon: React.ReactNode}> = ({ title, icon }) => (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 mb-2">
        {icon}
        <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">{title}</h3>
    </div>
);

const ToggleRow: React.FC<{label: string, sub: string, defaultChecked: boolean}> = ({ label, sub, defaultChecked }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <h4 className="font-bold text-slate-900 text-sm">{label}</h4>
                <p className="text-xs text-slate-500">{sub}</p>
            </div>
            <div 
                className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-slate-300'}`}
                onClick={() => setChecked(!checked)}
            >
                <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-5' : 'left-1'}`}></div>
            </div>
        </div>
    );
};

const AccessRow: React.FC<{name: string, accessType: string, time: string}> = ({ name, accessType, time }) => (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
        <div>
            <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="bg-green-50 text-green-700 px-1.5 rounded">{accessType}</span>
                <span>• {time}</span>
            </div>
        </div>
        <button className="text-xs font-bold text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors">
            Revoke
        </button>
    </div>
);

const RoleOption: React.FC<{label: string, desc: string, selected: boolean, onClick: () => void}> = ({ label, desc, selected, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            p-3 rounded-lg border cursor-pointer transition-all
            ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'}
        `}
    >
        <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-bold ${selected ? 'text-primary' : 'text-slate-800'}`}>{label}</span>
            {selected && <Check size={14} className="text-primary" />}
        </div>
        <p className="text-xs text-slate-500">{desc}</p>
    </div>
);

const VerificationItem: React.FC<{label: string, status: 'verified' | 'pending' | 'unverified', desc: string, actionLabel?: string, onAction?: () => void}> = ({ label, status, desc, actionLabel, onAction }) => {
    const icons = {
        verified: <Check size={16} className="text-green-600" />,
        pending: <ScanFace size={16} className="text-yellow-600" />,
        unverified: <Shield size={16} className="text-slate-300" />
    };
    const colors = {
        verified: 'bg-green-50 border-green-100',
        pending: 'bg-yellow-50 border-yellow-100',
        unverified: 'bg-slate-50 border-slate-100'
    };

    return (
        <div className={`p-3 rounded-lg border flex items-center justify-between ${colors[status]}`}>
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {icons[status]}
                </div>
                <div>
                    <h5 className="text-sm font-bold text-slate-900">{label}</h5>
                    <p className="text-[10px] text-slate-500">{desc}</p>
                </div>
            </div>
            {status === 'verified' ? (
                <span className="text-xs font-bold text-green-600 px-2">Verified</span>
            ) : actionLabel ? (
                <button onClick={onAction} className="text-xs font-bold bg-white px-3 py-1.5 rounded-md shadow-sm hover:bg-slate-50 text-slate-700">
                    {actionLabel}
                </button>
            ) : (
                <span className="text-xs font-bold text-slate-400 px-2">Pending</span>
            )}
        </div>
    );
}

const PrivacyListRow: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
        <div className="flex items-center gap-3 text-slate-600 group-hover:text-primary">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{value}</span>
            <ChevronRight size={14} className="text-slate-300" />
        </div>
    </div>
);

export default SettingsView;
