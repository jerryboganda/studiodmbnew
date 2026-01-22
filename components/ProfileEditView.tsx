import React, { useState } from 'react';
import { 
  User, Briefcase, Heart, Home, Image as ImageIcon, Sparkles, 
  Lock, Eye, EyeOff, Mic, Video, Plus, Check, AlertCircle, History,
  Globe, Ruler, Moon, Coffee, Dumbbell, Shield, Umbrella
} from 'lucide-react';
import { CURRENT_USER } from '../constants';

const ProfileEditView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: 'Basics', icon: <User size={18} /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <Coffee size={18} /> },
    { id: 'career', label: 'Career', icon: <Briefcase size={18} /> },
    { id: 'family', label: 'Family', icon: <Home size={18} /> },
    { id: 'preferences', label: 'Criteria', icon: <Sparkles size={18} /> },
    { id: 'media', label: 'Media', icon: <ImageIcon size={18} /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Header */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
          <p className="text-sm text-slate-500">Manage your persona, privacy controls, and partner preferences.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full border border-orange-100 text-xs font-bold">
                <AlertCircle size={14} />
                <span>Profile Completeness: 65%</span>
            </div>
            <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
                <History size={16} />
                View History
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all">
                Save Changes
            </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto p-8 scrollbar-hide">
            <div className="max-w-5xl mx-auto w-full">
                
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all border
                                ${activeTab === tab.id 
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === 'basics' && <BasicsSection />}
                    {activeTab === 'lifestyle' && <LifestyleSection />}
                    {activeTab === 'career' && <CareerSection />}
                    {activeTab === 'family' && <FamilySection />}
                    {activeTab === 'preferences' && <PreferencesSection />}
                    {activeTab === 'media' && <MediaSection />}
                </div>

            </div>
        </div>

        {/* Quality Sidebar (Right) */}
        <div className="w-80 bg-white border-l border-slate-200 p-6 hidden 2xl:block overflow-y-auto">
            <h3 className="font-bold text-slate-900 mb-4">Quality Score</h3>
            <div className="relative pt-1 mb-6">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                            Good
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">
                            65%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                    <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                </div>
            </div>

            <h4 className="font-bold text-sm text-slate-800 mb-3">Improve your profile</h4>
            <div className="space-y-3">
                <NudgeItem label="Add a Voice Note" points="+5%" />
                <NudgeItem label="Verify Employment" points="+10%" />
                <NudgeItem label="Add 2 more photos" points="+5%" />
                <NudgeItem label="Complete 'Values' section" points="+15%" />
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-2">Duplicate Check</h4>
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <Check size={16} />
                    <span>No duplicates found</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">We check photos and bio text against our database.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub Components for Sections --- */

const BasicsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Personal Basics">
            <div className="space-y-4">
                <InputGroup label="Full Name (Legal)">
                    <input type="text" className="form-input" defaultValue={CURRENT_USER.name} />
                    <VisibilityToggle />
                </InputGroup>
                
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Date of Birth">
                        <input type="date" className="form-input" defaultValue="1994-05-15" />
                    </InputGroup>
                    <InputGroup label="Gender">
                        <select className="form-input">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Non-binary</option>
                        </select>
                    </InputGroup>
                </div>

                <InputGroup label="Height">
                    <div className="flex items-center gap-3">
                        <Ruler size={18} className="text-slate-400" />
                        <input type="range" className="flex-1 accent-primary" min="140" max="220" defaultValue="178" />
                        <span className="text-sm font-bold text-slate-700 w-16">5' 10"</span>
                    </div>
                </InputGroup>
            </div>
        </Card>

        <Card title="Origin & Location">
            <div className="space-y-4">
                <InputGroup label="Languages Spoken">
                    <div className="flex flex-wrap gap-2">
                        <Badge label="English" onRemove={() => {}} />
                        <Badge label="Hindi" onRemove={() => {}} />
                        <button className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors">
                            <Plus size={12} /> Add
                        </button>
                    </div>
                </InputGroup>

                <InputGroup label="Nationality">
                    <div className="flex items-center gap-2 form-input bg-white">
                        <Globe size={16} className="text-slate-400" />
                        <select className="flex-1 bg-transparent outline-none">
                            <option>Indian</option>
                            <option>American</option>
                            <option>British</option>
                        </select>
                    </div>
                </InputGroup>

                <InputGroup label="Immigration Status (Optional)">
                    <select className="form-input">
                        <option>Citizen</option>
                        <option>Permanent Resident</option>
                        <option>Work Visa (H1B/Tier 2)</option>
                        <option>Student Visa</option>
                    </select>
                </InputGroup>

                <InputGroup label="Current Residency">
                    <input type="text" className="form-input" placeholder="City, Country" defaultValue="New Delhi, India" />
                </InputGroup>
            </div>
        </Card>

        <div className="md:col-span-2">
            <Card title="Marriage Intent">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup label="Timeline">
                        <select className="form-input">
                            <option>Immediately (0-6 months)</option>
                            <option>Soon (6-12 months)</option>
                            <option>Looking casually</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Relocation Willingness">
                        <select className="form-input">
                            <option>Willing to relocate internationally</option>
                            <option>Willing to relocate within country</option>
                            <option>Not willing to relocate</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Seriousness">
                        <div className="h-10 flex items-center gap-2 px-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-bold">
                            <Check size={16} />
                            Looking for Marriage
                        </div>
                    </InputGroup>
                 </div>
            </Card>
        </div>
    </div>
);

const LifestyleSection = () => (
    <div className="space-y-6">
        <Card title="Habits & Lifestyle">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <InputGroup label="Dietary Preferences">
                    <select className="form-input">
                        <option>Vegetarian</option>
                        <option>Non-Vegetarian</option>
                        <option>Vegan</option>
                        <option>Eggetarian</option>
                    </select>
                </InputGroup>
                <InputGroup label="Drinking">
                    <select className="form-input">
                        <option>Socially</option>
                        <option>Never</option>
                        <option>Regularly</option>
                    </select>
                </InputGroup>
                 <InputGroup label="Smoking">
                    <select className="form-input">
                        <option>Never</option>
                        <option>Occasionally</option>
                        <option>Regularly</option>
                    </select>
                </InputGroup>
                <InputGroup label="Sleep Schedule">
                    <div className="flex items-center gap-2 form-input">
                        <Moon size={16} className="text-slate-400" />
                        <select className="flex-1 bg-transparent outline-none">
                            <option>Early Bird</option>
                            <option>Night Owl</option>
                            <option>Irregular (Shift Work)</option>
                        </select>
                    </div>
                </InputGroup>
            </div>
        </Card>

        <Card title="Personality & Interests">
             <div className="space-y-6">
                <InputGroup label="Hobbies & Interests">
                    <div className="flex flex-wrap gap-2 mb-2">
                         <Badge label="Hiking" color="pink" onRemove={() => {}} />
                         <Badge label="Classical Music" color="purple" onRemove={() => {}} />
                         <Badge label="Reading" color="blue" onRemove={() => {}} />
                         <Badge label="Cooking" color="orange" onRemove={() => {}} />
                         <input type="text" placeholder="+ Add tag" className="text-sm border-none bg-transparent focus:ring-0 placeholder-slate-400" />
                    </div>
                    <p className="text-xs text-slate-400">Type and press enter to add new hobbies.</p>
                </InputGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Personality Tags (Self-Assessed)</label>
                        <div className="flex flex-wrap gap-2">
                            {['Introverted', 'Ambitious', 'Family-oriented', 'Creative', 'Rational'].map(tag => (
                                <button key={tag} className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-xs hover:border-primary hover:text-primary transition-colors">
                                    {tag}
                                </button>
                            ))}
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Religious / Cultural Values</label>
                        <div className="grid grid-cols-2 gap-4">
                            <select className="form-input text-sm">
                                <option>Moderately Religious</option>
                                <option>Very Religious</option>
                                <option>Spiritual</option>
                                <option>Atheist</option>
                            </select>
                            <select className="form-input text-sm">
                                <option>Traditional Values</option>
                                <option>Modern Values</option>
                                <option>Mix of both</option>
                            </select>
                        </div>
                     </div>
                </div>
             </div>
        </Card>
    </div>
);

const CareerSection = () => (
    <div className="space-y-6">
        <Card title="Education & Professional Background">
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
                        <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                            <Briefcase size={18} className="text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900">MD General Medicine</h4>
                                    <p className="text-sm text-slate-600">AIIMS, New Delhi</p>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">2016 - 2019</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Gold Medalist. Specialization in Internal Medicine.</p>
                        </div>
                        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary p-1">
                            Edit
                        </button>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
                        <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                            <Briefcase size={18} className="text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900">MBBS</h4>
                                    <p className="text-sm text-slate-600">Maulana Azad Medical College</p>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">2010 - 2015</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="flex items-center gap-2 text-primary font-bold text-sm w-fit hover:underline">
                        <Plus size={16} /> Add Education
                    </button>
                </div>
            </div>
        </Card>

        <Card title="Current Employment">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Profession / Designation">
                     <input type="text" className="form-input" defaultValue="Senior Resident Doctor" />
                </InputGroup>
                
                <InputGroup label="Employer / Hospital">
                     <div className="flex gap-2">
                        <input type="text" className="form-input flex-1" defaultValue="City Heart Institute" />
                        <div className="flex items-center justify-center px-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500" title="Masked from public view">
                            <EyeOff size={18} />
                        </div>
                     </div>
                </InputGroup>

                <InputGroup label="Annual Income (Optional)">
                     <div className="flex gap-2">
                        <select className="form-input flex-1">
                            <option>₹ 25L - 40L per annum</option>
                            <option>₹ 40L - 60L per annum</option>
                            <option>₹ 60L+ per annum</option>
                        </select>
                         <div className="flex items-center justify-center px-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500" title="Visible only to mutual matches">
                            <Lock size={18} />
                        </div>
                     </div>
                </InputGroup>

                <InputGroup label="Work Location">
                     <select className="form-input">
                        <option>On-site (Hospital/Clinic)</option>
                        <option>Remote (Telemedicine)</option>
                        <option>Hybrid</option>
                    </select>
                </InputGroup>
             </div>
        </Card>
    </div>
);

const FamilySection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Family Structure">
            <div className="space-y-4">
                <InputGroup label="Family Type">
                    <select className="form-input">
                        <option>Nuclear Family</option>
                        <option>Joint Family</option>
                    </select>
                </InputGroup>
                <div className="grid grid-cols-2 gap-4">
                     <InputGroup label="Brothers">
                        <select className="form-input">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Sisters">
                        <select className="form-input">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </InputGroup>
                </div>
            </div>
        </Card>

        <Card title="Parental Details">
            <div className="space-y-4">
                 <InputGroup label="Father's Occupation">
                     <input type="text" className="form-input" placeholder="e.g. Civil Servant, Doctor, Business" />
                </InputGroup>
                <InputGroup label="Mother's Occupation">
                     <input type="text" className="form-input" placeholder="e.g. Homemaker, Professor" />
                </InputGroup>
                <InputGroup label="Family Location">
                     <input type="text" className="form-input" placeholder="City, State" />
                </InputGroup>
            </div>
        </Card>

        <div className="md:col-span-2">
            <Card title="Community & Culture">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup label="Religion">
                         <input type="text" className="form-input" defaultValue="Hindu" />
                    </InputGroup>
                    <InputGroup label="Community / Caste (Optional)">
                         <input type="text" className="form-input" defaultValue="Brahmin" />
                    </InputGroup>
                    <InputGroup label="Gothra / Clan (Optional)">
                         <input type="text" className="form-input" />
                    </InputGroup>
                 </div>
            </Card>
        </div>
    </div>
);

const PreferencesSection = () => (
    <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
             <InfoIcon className="text-blue-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-blue-900 text-sm">Smart Matching</h4>
                <p className="text-xs text-blue-700 mt-1">
                    Marking criteria as "Dealbreaker" filters out non-matching profiles completely. "Nice to have" affects the match percentage score.
                </p>
             </div>
        </div>

        <div className="space-y-4">
            <PreferenceItem label="Age Range" value="26 - 32 Years" type="Dealbreaker" />
            <PreferenceItem label="Height" value="5'4&quot; and above" type="Nice to have" />
            <PreferenceItem label="Marital Status" value="Never Married" type="Dealbreaker" />
            <PreferenceItem label="Profession" value="Doctor / Medical Professional" type="Must have" />
            <PreferenceItem label="Diet" value="Vegetarian" type="Nice to have" />
            <PreferenceItem label="Location" value="Delhi NCR / Mumbai" type="Nice to have" />
            
            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /> Add Preference Criteria
            </button>
        </div>
    </div>
);

const MediaSection = () => (
    <div className="space-y-8">
        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-slate-900">Public Gallery</h3>
                <span className="text-xs text-slate-500">Visible to accepted matches</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing Photo */}
                <div className="aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden relative group">
                    <img src={CURRENT_USER.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                    <button className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <Eye size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Main</div>
                    {/* Watermark Overlay Example */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center -rotate-45">
                        <span className="text-white font-black text-2xl tracking-widest">DMB SECURE</span>
                    </div>
                </div>
                {/* Placeholder 1 */}
                <div className="aspect-[3/4] rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors">
                    <ImageIcon size={24} />
                    <span className="text-xs font-bold mt-2">Add Photo</span>
                </div>
                {/* Intro Video Placeholder */}
                <div className="aspect-[3/4] rounded-xl bg-slate-900 overflow-hidden relative group flex items-center justify-center">
                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <Video size={20} />
                    </div>
                    <span className="absolute bottom-3 left-0 w-full text-center text-xs font-bold text-white/80">Intro Video</span>
                </div>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Lock size={18} className="text-primary" />
                        <h3 className="font-bold text-slate-900">Private Vault</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Media here requires specific request approval to view. Watermarked automatically.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Vault Active</span>
                    <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 size-3 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-75">
                 <div className="aspect-[3/4] rounded-xl bg-slate-800 overflow-hidden relative flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover opacity-50 blur-sm" alt="Private" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Lock size={24} className="text-white/80" />
                    </div>
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center rotate-45">
                         <span className="text-white/10 text-2xl font-black uppercase tracking-widest">DMB PREVIEW</span>
                    </div>
                </div>
                 <div className="aspect-[3/4] rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 cursor-pointer">
                    <Plus size={24} />
                    <span className="text-xs font-bold mt-2">Add to Vault</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <Umbrella size={20} className="text-slate-400" />
            <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Screenshot Deterrence</h4>
                <p className="text-xs text-slate-500">Watermarks are active on all your photos.</p>
            </div>
            <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                 <div className="absolute right-0.5 top-0.5 size-3 bg-white rounded-full"></div>
            </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <Mic size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">Voice Intro</h4>
                    <p className="text-xs text-slate-500">Record a 30s greeting for matches.</p>
                </div>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-purple-600 shadow-sm hover:bg-slate-50">
                Record
            </button>
        </div>
    </div>
);

/* --- Helper Components --- */

const Card: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">{title}</h3>
        {children}
    </div>
);

const InputGroup: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{label}</label>
        {children}
    </div>
);

const Badge: React.FC<{label: string, color?: string, onRemove: () => void}> = ({ label, color = 'slate', onRemove }) => {
    const colors: Record<string, string> = {
        slate: 'bg-slate-100 text-slate-700',
        pink: 'bg-pink-50 text-pink-700',
        purple: 'bg-purple-50 text-purple-700',
        blue: 'bg-blue-50 text-blue-700',
        orange: 'bg-orange-50 text-orange-700',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}>
            {label}
            <button onClick={onRemove} className="hover:opacity-75"><User size={0} className="hidden" />×</button>
        </span>
    );
};

const VisibilityToggle = () => (
    <div className="flex items-center gap-2 mt-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded cursor-pointer border border-green-100">
            <Eye size={10} /> Visible
        </div>
    </div>
);

const PreferenceItem: React.FC<{label: string, value: string, type: 'Must have' | 'Nice to have' | 'Dealbreaker'}> = ({ label, value, type }) => {
    const typeColors = {
        'Must have': 'bg-blue-100 text-blue-700',
        'Nice to have': 'bg-green-100 text-green-700',
        'Dealbreaker': 'bg-red-100 text-red-700',
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
                <p className="font-bold text-slate-900">{value}</p>
            </div>
            <div className="flex items-center gap-3">
                 <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${typeColors[type]}`}>
                    {type}
                 </span>
                 <button className="text-slate-300 hover:text-slate-600">
                    <UserCogIcon /> 
                 </button>
            </div>
        </div>
    );
}

const NudgeItem: React.FC<{label: string, points: string}> = ({ label, points }) => (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
        <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-orange-400"></div>
            <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{label}</span>
        </div>
        <span className="text-xs font-bold text-green-600">{points}</span>
    </div>
);

// Icon Wrappers for simple usage in maps
const InfoIcon = ({className}: {className?: string}) => <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserCogIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

/* Styles for Inputs */
const styles = `
    .form-input {
        @apply w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white;
    }
`;

export default ProfileEditView;
