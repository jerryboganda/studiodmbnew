import React, { useState } from 'react';
import { 
    Users, ShieldCheck, FileText, Share2, Download, Plus, CheckCircle2, 
    Clock, XCircle, ChevronRight, QrCode, Mail, Lock, Heart, Eye
} from 'lucide-react';
import { CURRENT_USER } from '../constants';

const FamilyPortalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'guardians' | 'approvals' | 'biodata'>('profile');
  const [showQr, setShowQr] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      {/* Header */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Family Portal</h2>
          <p className="text-sm text-slate-500">Manage your family profile, guardians, and matchmaking workflows.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <TabButton label="Family Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <TabButton label="Guardians" active={activeTab === 'guardians'} onClick={() => setActiveTab('guardians')} />
            <TabButton label="Approvals" active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} badge="2" />
            <TabButton label="Biodata" active={activeTab === 'biodata'} onClick={() => setActiveTab('biodata')} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
            
            {activeTab === 'profile' && <FamilyProfileSection />}
            {activeTab === 'guardians' && <GuardiansSection />}
            {activeTab === 'approvals' && <ApprovalsSection />}
            {activeTab === 'biodata' && <BiodataSection onShowQr={() => setShowQr(true)} />}

        </div>
      </div>

      {showQr && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full animate-in zoom-in-95">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Share Biodata</h3>
                  <p className="text-sm text-slate-500 mb-6">Scan to view {CURRENT_USER.name}'s profile.</p>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-900 inline-block mb-6">
                      <QrCode size={160} className="text-slate-900" />
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setShowQr(false)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Close</button>
                      <button className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover">Copy Link</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

/* --- Sections --- */

const FamilyProfileSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">About Our Family</h3>
                <textarea 
                    className="w-full h-32 p-4 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                    defaultValue="We are a close-knit family based in South Delhi. Education and humility are our core values. My father served in the Civil Services and my mother is a retired professor. We enjoy classical music and travel."
                ></textarea>
                <div className="flex justify-end mt-2">
                    <span className="text-xs text-slate-400">Visible to accepted matches</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Family Values & Expectations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Tradition Level</label>
                        <select className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white">
                            <option>Modern with Traditional Roots</option>
                            <option>Liberal</option>
                            <option>Conservative</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Affluence / Status</label>
                        <select className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white">
                            <option>Upper Middle Class</option>
                            <option>High Net Worth (HNI)</option>
                            <option>Middle Class</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                     <label className="text-xs font-bold text-slate-700 uppercase mb-2 block">Common Family Interests</label>
                     <div className="flex flex-wrap gap-2">
                         {['Politics', 'Traveling', 'Philanthropy', 'Cricket'].map(t => (
                             <span key={t} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200">{t}</span>
                         ))}
                         <button className="px-3 py-1 border border-dashed border-slate-300 rounded-full text-xs text-slate-400 hover:text-primary hover:border-primary">+ Add</button>
                     </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Family Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
                        <Plus size={24} />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden relative group">
                            <img src={`https://source.unsplash.com/random/200x200?family&sig=${i}`} className="w-full h-full object-cover" />
                            <button className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <XCircle size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">Upload 3-5 photos of parents/siblings. Helps build trust.</p>
            </div>
        </div>
    </div>
);

const GuardiansSection = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Guardians & Permissions</h3>
                <p className="text-sm text-slate-500">Control who can manage this profile.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">
                <Plus size={16} /> Invite Member
            </button>
        </div>

        <div className="space-y-4">
            <GuardianCard 
                name="Dr. Rajesh Kumar" 
                role="Candidate (Owner)" 
                email="rajesh@example.com" 
                status="Verified" 
                isOwner
            />
            <GuardianCard 
                name="Mrs. Sunita Kumar" 
                role="Mother (Admin)" 
                email="sunita.k@example.com" 
                status="Verified"
                permissions={['Edit Profile', 'Chat with Families', 'Approve Matches']}
            />
            <GuardianCard 
                name="Mr. Ashok Kumar" 
                role="Father (Editor)" 
                email="ashok.ias@example.com" 
                status="Pending"
                permissions={['View Matches', 'Approve Matches']}
            />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <ShieldCheck size={18} /> Verification Status
            </h4>
            <p className="text-sm text-blue-800 mb-4">
                Verified guardians increase profile trust score by 40%. We verify via LinkedIn or Government ID.
            </p>
        </div>
    </div>
);

const GuardianCard: React.FC<{name: string, role: string, email: string, status: string, isOwner?: boolean, permissions?: string[]}> = ({ name, role, email, status, isOwner, permissions }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex items-start gap-4 flex-1">
            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                {name[0]}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    {name}
                    {isOwner && <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded uppercase">You</span>}
                </h4>
                <p className="text-sm text-slate-600">{role}</p>
                <p className="text-xs text-slate-400 mt-1">{email}</p>
            </div>
        </div>

        <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Permissions</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {status}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {isOwner ? (
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">Full Access</span>
                ) : (
                    permissions?.map(p => (
                        <span key={p} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-medium">{p}</span>
                    ))
                )}
            </div>
            {!isOwner && (
                <button className="mt-3 text-xs font-bold text-primary hover:underline">Edit Access</button>
            )}
        </div>
    </div>
);

const ApprovalsSection = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4">
         <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Match Approval Workflow</h3>
                <p className="text-sm text-slate-500">Profiles shortlisted by you or the matchmaker, pending family review.</p>
            </div>
        </div>

        <div className="space-y-4">
            <ApprovalCard 
                name="Dr. Ananya Singh" 
                desc="Dermatologist • South Delhi" 
                status="Pending Dad's Review" 
                img="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200"
                time="2 days ago"
            />
            <ApprovalCard 
                name="Dr. Priya Kapoor" 
                desc="Pediatrician • Bangalore" 
                status="Approved by Mom" 
                img="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200"
                time="5 hours ago"
                approved
            />
        </div>
    </div>
);

const ApprovalCard: React.FC<{name: string, desc: string, status: string, img: string, time: string, approved?: boolean}> = ({ name, desc, status, img, time, approved }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
        <div className="flex items-center gap-4">
            <img src={img} className="size-12 rounded-full object-cover" />
            <div>
                <h4 className="font-bold text-slate-900">{name}</h4>
                <p className="text-xs text-slate-500">{desc}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`size-2 rounded-full ${approved ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                    <span className="text-xs font-medium text-slate-600">{status}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 mr-2">{time}</span>
            <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-red-600 transition-colors">
                <XCircle size={20} />
            </button>
            <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                {approved ? 'Proceed to Chat' : 'Approve'}
            </button>
        </div>
    </div>
);

const BiodataSection: React.FC<{onShowQr: () => void}> = ({ onShowQr }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Biodata Builder</h3>
            <p className="text-sm text-slate-500 mb-6">Auto-generate professional biodata PDFs to share externally.</p>

            <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer relative">
                    <div className="absolute top-3 right-3 text-primary"><CheckCircle2 size={20} /></div>
                    <h4 className="font-bold text-slate-900">Modern Professional</h4>
                    <p className="text-xs text-slate-500">Clean layout, focus on career and education.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 cursor-pointer opacity-70">
                    <h4 className="font-bold text-slate-900">Traditional Detailed</h4>
                    <p className="text-xs text-slate-500">Includes horoscope, extensive family details.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 cursor-pointer opacity-70">
                    <h4 className="font-bold text-slate-900">Minimalist</h4>
                    <p className="text-xs text-slate-500">One-pager summary.</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 flex items-center justify-center gap-2">
                    <Download size={16} /> Download PDF
                </button>
                <button 
                    onClick={onShowQr}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                    <QrCode size={16} /> Share Link
                </button>
            </div>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-200 rounded-xl p-8 flex items-center justify-center border border-slate-300">
             <div className="bg-white w-[300px] h-[420px] shadow-2xl rounded-sm p-4 text-[8px] text-slate-400 overflow-hidden relative">
                 <div className="absolute top-0 right-0 size-16 bg-primary/10 rounded-bl-full"></div>
                 <div className="flex gap-3 mb-4">
                     <div className="size-16 bg-slate-200 rounded-lg"></div>
                     <div className="flex-1 pt-1">
                         <div className="h-2 w-3/4 bg-slate-800 rounded mb-1"></div>
                         <div className="h-1.5 w-1/2 bg-primary rounded"></div>
                     </div>
                 </div>
                 <div className="space-y-2">
                     <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                     <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                     <div className="h-1.5 w-2/3 bg-slate-100 rounded"></div>
                 </div>
                 <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="h-10 bg-slate-50 rounded border border-slate-100"></div>
                      <div className="h-10 bg-slate-50 rounded border border-slate-100"></div>
                 </div>
                 <div className="mt-4 h-20 bg-slate-50 rounded border border-slate-100"></div>
                 <div className="absolute bottom-4 right-4 text-[6px] font-bold text-slate-300">GENERATED BY DMB</div>
             </div>
        </div>
    </div>
);

const TabButton: React.FC<{label: string, active: boolean, onClick: () => void, badge?: string}> = ({ label, active, onClick, badge }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${active ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
    >
        {label}
        {badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
    </button>
);

export default FamilyPortalView;
