import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  User, Briefcase, Heart, Home, Image as ImageIcon, Sparkles, 
  Lock, Eye, EyeOff, Mic, Video, Plus, Check, AlertCircle, History,
  Globe, Ruler, Moon, Coffee, X, Save, Loader2, Play, Pause,
  Upload, Trash2, Edit2, ChevronDown
} from 'lucide-react';
import { CURRENT_USER, API_BASE_URL } from '../constants';

// Declare Echo type for pusher
declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

// Types
interface ProfileData {
  basics: {
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    photo: string | null;
    birthday: string | null;
    gender: string | null;
    height: number | null;
    weight: number | null;
    nationality: string | null;
    known_languages: string[];
    known_language_ids: number[];
    immigration_status: string | null;
    current_residency: {
      country: string | null;
      state: string | null;
      city: string | null;
      country_id: number | null;
      state_id: number | null;
      city_id: number | null;
    };
  };
  marriage_intent: {
    timeline: string | null;
    relocation_willingness: string | null;
    seriousness_level: string;
  };
  lifestyle: {
    diet: string | null;
    drink: string | null;
    smoke: string | null;
    living_with: string | null;
    sleep_schedule: string | null;
    personality_tags: string[];
    hobbies: string | null;
    interests: string | null;
    music: string | null;
    books: string | null;
    movies: string | null;
    sports: string | null;
    fitness_activities: string | null;
    affection: string | null;
    humor: string | null;
    political_views: string | null;
  };
  career: {
    education: Array<{
      id: number;
      degree: string;
      institution: string;
      start: number | null;
      end: number | null;
      present: boolean;
      is_highest: boolean;
    }>;
    careers: Array<{
      id: number;
      designation: string;
      company: string;
      start: number | null;
      end: number | null;
      present: boolean;
      work_location_type: string | null;
    }>;
    annual_income_range_id: number | null;
  };
  family: {
    family_type: string | null;
    father: string | null;
    mother: string | null;
    father_occupation: string | null;
    mother_occupation: string | null;
    no_of_brothers: number | null;
    no_of_sisters: number | null;
    about_parents: string | null;
    about_siblings: string | null;
    family_location_city: string | null;
    family_location_country: string | null;
  };
  spiritual: {
    religion_id: number | null;
    religion_name: string | null;
    caste_id: number | null;
    caste_name: string | null;
    sub_caste_id: number | null;
    gothra: string | null;
    ethnicity: string | null;
    personal_value: string | null;
    family_value_id: number | null;
  };
  preferences: {
    min_age: number | null;
    max_age: number | null;
    height: number | null;
    weight: number | null;
    marital_status_id: number | null;
    children_acceptable: string | null;
    religion_id: number | null;
    caste_id: number | null;
    education: string | null;
    profession: string | null;
    smoking_acceptable: string | null;
    drinking_acceptable: string | null;
    diet: string | null;
    body_type: string | null;
    complexion: string | null;
    preferred_country_id: number | null;
    preferred_state_id: number | null;
  };
  media: {
    main_photo: string | null;
    gallery: Array<{
      id: number;
      url: string;
      privacy_level: string;
      is_main: boolean;
      sort_order: number;
    }>;
    voice_intro_path: string | null;
    voice_intro_url: string | null;
    intro_video_path: string | null;
    intro_video_url: string | null;
  };
}

interface QualityScore {
  total: number;
  level: string;
  breakdown: Record<string, number>;
  improvements: Array<{ action: string; points: number }>;
}

interface HistoryEntry {
  date: string;
  formatted_date: string;
  changes: Array<{
    id: number;
    section: string;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    time: string;
  }>;
}

interface VisibilitySettings {
  [key: string]: boolean;
}

interface PreferencePriorities {
  [key: string]: 'dealbreaker' | 'must_have' | 'nice_to_have' | 'flexible';
}

const ProfileEditView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basics');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  // Data state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null);
  const [visibility, setVisibility] = useState<VisibilitySettings>({});
  const [priorities, setPriorities] = useState<PreferencePriorities>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  // Pending changes for batch save
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const echoRef = useRef<any>(null);

  const tabs = [
    { id: 'basics', label: 'Basics', icon: <User size={18} /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <Coffee size={18} /> },
    { id: 'career', label: 'Career', icon: <Briefcase size={18} /> },
    { id: 'family', label: 'Family', icon: <Home size={18} /> },
    { id: 'preferences', label: 'Criteria', icon: <Sparkles size={18} /> },
    { id: 'media', label: 'Media', icon: <ImageIcon size={18} /> },
  ];

  // Get auth token
  const getAuthToken = () => localStorage.getItem('auth_token') || '';

  // Fetch full profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/member/profile/full`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      if (data.success) {
        setProfile(data.data.profile);
        setQualityScore(data.data.quality_score);
        setVisibility(data.data.visibility_settings || {});
        setPriorities(data.data.preference_priorities || {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/member/profile/history?days=30`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      if (data.success) {
        setHistory(data.data.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, []);

  // Save section changes
  const saveSection = async (section: string, sectionData: any) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/member/profile/section/${section}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) throw new Error('Failed to save changes');
      
      const data = await response.json();
      if (data.success) {
        setQualityScore(data.quality_score);
        // Clear pending changes for this section
        setPendingChanges(prev => {
          const newPending = { ...prev };
          delete newPending[section];
          return newPending;
        });
        setHasUnsavedChanges(Object.keys(pendingChanges).length > 1);
      }
      return data;
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Save all pending changes
  const saveAllChanges = async () => {
    try {
      setSaving(true);
      for (const [section, data] of Object.entries(pendingChanges)) {
        await saveSection(section, data);
      }
      setPendingChanges({});
      setHasUnsavedChanges(false);
      await fetchProfile(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (fieldName: string) => {
    const newValue = !visibility[fieldName];
    setVisibility(prev => ({ ...prev, [fieldName]: newValue }));

    try {
      await fetch(`${API_BASE_URL}/member/profile/visibility`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field_name: fieldName, is_visible: newValue }),
      });
    } catch (err) {
      // Revert on error
      setVisibility(prev => ({ ...prev, [fieldName]: !newValue }));
    }
  };

  // Update local profile state
  const updateProfileField = (section: string, field: string, value: any) => {
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section as keyof ProfileData] as any),
          [field]: value,
        },
      };
    });
    
    // Track pending changes
    setPendingChanges(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Upload voice intro
  const uploadVoiceIntro = async (file: File) => {
    const formData = new FormData();
    formData.append('voice_file', file);

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/member/profile/media/voice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload voice intro');
      
      const data = await response.json();
      if (data.success && profile) {
        setProfile({
          ...profile,
          media: {
            ...profile.media,
            voice_intro_path: data.data.voice_intro_path,
            voice_intro_url: data.data.voice_intro_url,
          },
        });
        setQualityScore(data.quality_score);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  // Upload intro video
  const uploadIntroVideo = async (file: File) => {
    const formData = new FormData();
    formData.append('video_file', file);

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/member/profile/media/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload video');
      
      const data = await response.json();
      if (data.success && profile) {
        setProfile({
          ...profile,
          media: {
            ...profile.media,
            intro_video_path: data.data.intro_video_path,
            intro_video_url: data.data.intro_video_url,
          },
        });
        setQualityScore(data.quality_score);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  // Initialize realtime connection
  useEffect(() => {
    fetchProfile();

    // Setup Echo for realtime updates - dynamically import
    const setupRealtime = async () => {
      if (typeof window !== 'undefined') {
        try {
          const Pusher = (await import('pusher-js')).default;
          const { default: Echo } = await import('laravel-echo');
          
          window.Pusher = Pusher;
          
          const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME || 'https';
          const pusherPort = Number(import.meta.env.VITE_PUSHER_PORT || (pusherScheme === 'https' ? '443' : '6001'));

          echoRef.current = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY || 'your-pusher-key',
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
            forceTLS: pusherScheme === 'https',
            wsHost: import.meta.env.VITE_PUSHER_HOST,
            wsPort: pusherPort,
            wssPort: pusherPort,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
            auth: {
              headers: {
                Authorization: `Bearer ${getAuthToken()}`,
              },
            },
          });

          // Listen for profile updates
          echoRef.current.private(`profile.${CURRENT_USER.id}`)
            .listen('.profile.updated', (event: any) => {
              console.log('Profile updated:', event);
              
              // Update local state based on broadcast
              if (event.section && event.data) {
                setProfile(prev => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    [event.section]: {
                      ...(prev[event.section as keyof ProfileData] as any),
                      ...event.data,
                    },
                  };
                });
              }
              
              // Update quality score if provided
              if (event.quality_score) {
                setQualityScore(event.quality_score);
              }
            });
        } catch (err) {
          console.warn('Realtime features not available:', err);
        }
      }
    };

    setupRealtime();

    return () => {
      if (echoRef.current) {
        echoRef.current.leave(`profile.${CURRENT_USER.id}`);
      }
    };
  }, [fetchProfile]);

  // Height conversion helper
  const cmToFeetInches = (cm: number): string => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Header */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
          <p className="text-sm text-slate-500">Manage your persona, privacy controls, and partner preferences.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${
            (qualityScore?.total || 0) >= 80 
              ? 'bg-green-50 text-green-700 border-green-100'
              : (qualityScore?.total || 0) >= 60
              ? 'bg-orange-50 text-orange-700 border-orange-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            <AlertCircle size={14} />
            <span>Profile Completeness: {qualityScore?.total || 0}%</span>
          </div>
          <button 
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchHistory(); }}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium"
          >
            <History size={16} />
            View History
          </button>
          <button 
            onClick={saveAllChanges}
            disabled={!hasUnsavedChanges || saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all ${
              hasUnsavedChanges 
                ? 'bg-primary hover:bg-primary-hover text-white' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Error Toast */}
      {error && (
        <div className="absolute top-24 right-8 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content Area */}
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
              {activeTab === 'basics' && profile && (
                <BasicsSection 
                  profile={profile} 
                  visibility={visibility}
                  onUpdate={updateProfileField}
                  onToggleVisibility={toggleVisibility}
                  onSave={(data) => saveSection('basics', data)}
                />
              )}
              {activeTab === 'lifestyle' && profile && (
                <LifestyleSection 
                  profile={profile} 
                  onUpdate={updateProfileField}
                  onSave={(data) => saveSection('lifestyle', data)}
                />
              )}
              {activeTab === 'career' && profile && (
                <CareerSection 
                  profile={profile} 
                  visibility={visibility}
                  onUpdate={updateProfileField}
                  onToggleVisibility={toggleVisibility}
                  onSave={(data) => saveSection('career', data)}
                />
              )}
              {activeTab === 'family' && profile && (
                <FamilySection 
                  profile={profile} 
                  onUpdate={updateProfileField}
                  onSave={(data) => saveSection('family', data)}
                />
              )}
              {activeTab === 'preferences' && profile && (
                <PreferencesSection 
                  profile={profile} 
                  priorities={priorities}
                  onUpdate={updateProfileField}
                  onUpdatePriority={(field, priority) => {
                    setPriorities(prev => ({ ...prev, [field]: priority as any }));
                    setPendingChanges(prev => ({
                      ...prev,
                      preferences: {
                        ...(prev.preferences || {}),
                        priorities: { ...priorities, [field]: priority },
                      },
                    }));
                    setHasUnsavedChanges(true);
                  }}
                  onSave={(data) => saveSection('preferences', data)}
                />
              )}
              {activeTab === 'media' && profile && (
                <MediaSection 
                  profile={profile} 
                  onUploadVoice={uploadVoiceIntro}
                  onUploadVideo={uploadIntroVideo}
                  onUpdate={updateProfileField}
                  saving={saving}
                />
              )}
            </div>
          </div>
        </div>

        {/* Quality Sidebar (Right) */}
        <div className="w-80 bg-white border-l border-slate-200 p-6 hidden 2xl:block overflow-y-auto">
          <h3 className="font-bold text-slate-900 mb-4">Quality Score</h3>
          <div className="relative pt-1 mb-6">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                  qualityScore?.level === 'EXCELLENT' ? 'text-green-700 bg-green-100' :
                  qualityScore?.level === 'GOOD' ? 'text-primary bg-primary/10' :
                  qualityScore?.level === 'FAIR' ? 'text-orange-700 bg-orange-100' :
                  'text-red-700 bg-red-100'
                }`}>
                  {qualityScore?.level || 'UNKNOWN'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-primary">
                  {qualityScore?.total || 0}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
              <div 
                style={{ width: `${qualityScore?.total || 0}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                  (qualityScore?.total || 0) >= 80 ? 'bg-green-500' :
                  (qualityScore?.total || 0) >= 60 ? 'bg-primary' :
                  (qualityScore?.total || 0) >= 40 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
              />
            </div>
          </div>

          <h4 className="font-bold text-sm text-slate-800 mb-3">Improve your profile</h4>
          <div className="space-y-3">
            {qualityScore?.improvements?.map((item, i) => (
              <NudgeItem key={i} label={item.action} points={`+${item.points}%`} />
            ))}
            {(!qualityScore?.improvements || qualityScore.improvements.length === 0) && (
              <p className="text-sm text-green-600 flex items-center gap-2">
                <Check size={16} />
                Your profile is complete!
              </p>
            )}
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-2">Duplicate Check</h4>
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Check size={16} />
              <span>No duplicates found</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">We check photos and bio text against our database.</p>
          </div>

          {/* Section Breakdown */}
          {qualityScore?.breakdown && (
            <div className="mt-6">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-3">Section Scores</h4>
              <div className="space-y-2">
                {Object.entries(qualityScore.breakdown).map(([section, score]) => (
                  <div key={section} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 capitalize">{section}</span>
                    <span className="font-bold text-slate-900">{Math.round(score as number)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="w-96 bg-white border-l border-slate-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Edit History</h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            {history.length === 0 ? (
              <p className="text-sm text-slate-500">No recent changes found.</p>
            ) : (
              <div className="space-y-6">
                {history.map((day) => (
                  <div key={day.date}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                      {day.formatted_date}
                    </h4>
                    <div className="space-y-2">
                      {day.changes.map((change) => (
                        <div key={change.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-slate-900 capitalize">{change.field_name.replace(/_/g, ' ')}</span>
                            <span className="text-xs text-slate-400">{change.time}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            <span className="text-red-500 line-through">{change.old_value || 'empty'}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600">{change.new_value || 'empty'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Section Components --- */

interface SectionProps {
  profile: ProfileData;
  visibility?: VisibilitySettings;
  priorities?: PreferencePriorities;
  onUpdate: (section: string, field: string, value: any) => void;
  onToggleVisibility?: (field: string) => void;
  onUpdatePriority?: (field: string, priority: string) => void;
  onSave: (data: any) => Promise<any>;
  saving?: boolean;
}

const BasicsSection: React.FC<SectionProps> = ({ profile, visibility, onUpdate, onToggleVisibility }) => {
  const [height, setHeight] = useState(profile.basics.height || 170);

  const cmToFeetInches = (cm: number): string => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Personal Basics">
        <div className="space-y-4">
          <InputGroup label="Full Name (Legal)">
            <div className="flex gap-2">
              <input 
                type="text" 
                className="form-input flex-1" 
                value={profile.basics.first_name || ''}
                onChange={(e) => onUpdate('basics', 'first_name', e.target.value)}
                placeholder="First Name"
              />
              <input 
                type="text" 
                className="form-input flex-1" 
                value={profile.basics.last_name || ''}
                onChange={(e) => onUpdate('basics', 'last_name', e.target.value)}
                placeholder="Last Name"
              />
            </div>
            <VisibilityToggle 
              isVisible={visibility?.full_name !== false} 
              onToggle={() => onToggleVisibility?.('full_name')} 
            />
          </InputGroup>
          
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Date of Birth">
              <input 
                type="date" 
                className="form-input" 
                value={profile.basics.birthday?.split('T')[0] || ''}
                onChange={(e) => onUpdate('basics', 'birthday', e.target.value)}
              />
            </InputGroup>
            <InputGroup label="Gender">
              <select 
                className="form-input"
                value={profile.basics.gender || ''}
                onChange={(e) => onUpdate('basics', 'gender', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </InputGroup>
          </div>

          <InputGroup label="Height">
            <div className="flex items-center gap-3">
              <Ruler size={18} className="text-slate-400" />
              <input 
                type="range" 
                className="flex-1 accent-primary" 
                min="140" 
                max="220" 
                value={height}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setHeight(val);
                  onUpdate('basics', 'height', val);
                }}
              />
              <span className="text-sm font-bold text-slate-700 w-16">{cmToFeetInches(height)}</span>
            </div>
          </InputGroup>
        </div>
      </Card>

      <Card title="Origin & Location">
        <div className="space-y-4">
          <InputGroup label="Languages Spoken">
            <div className="flex flex-wrap gap-2">
              {profile.basics.known_languages?.map((lang, i) => (
                <Badge key={i} label={lang} onRemove={() => {
                  const newLangs = profile.basics.known_languages.filter((_, idx) => idx !== i);
                  onUpdate('basics', 'known_languages', newLangs);
                }} />
              ))}
              <button className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors">
                <Plus size={12} /> Add
              </button>
            </div>
          </InputGroup>

          <InputGroup label="Nationality">
            <div className="flex items-center gap-2 form-input bg-white">
              <Globe size={16} className="text-slate-400" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none"
                value={profile.basics.nationality || ''}
                onChange={(e) => onUpdate('basics', 'nationality', e.target.value)}
                placeholder="e.g. Indian, American"
              />
            </div>
          </InputGroup>

          <InputGroup label="Immigration Status (Optional)">
            <select 
              className="form-input"
              value={profile.basics.immigration_status || ''}
              onChange={(e) => onUpdate('basics', 'immigration_status', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Citizen">Citizen</option>
              <option value="Permanent Resident">Permanent Resident</option>
              <option value="Work Visa">Work Visa (H1B/Tier 2)</option>
              <option value="Student Visa">Student Visa</option>
            </select>
          </InputGroup>

          <InputGroup label="Current Residency">
            <input 
              type="text" 
              className="form-input" 
              placeholder="City, Country" 
              value={[profile.basics.current_residency?.city, profile.basics.current_residency?.country].filter(Boolean).join(', ') || ''}
              readOnly
            />
          </InputGroup>
        </div>
      </Card>

      <div className="md:col-span-2">
        <Card title="Marriage Intent">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Timeline">
              <select 
                className="form-input"
                value={profile.marriage_intent?.timeline || ''}
                onChange={(e) => onUpdate('marriage_intent', 'timeline', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="immediate">Immediately (0-6 months)</option>
                <option value="6_months">Soon (6-12 months)</option>
                <option value="1_year">Within a year</option>
                <option value="2_years">Within 2 years</option>
                <option value="casual">Looking casually</option>
              </select>
            </InputGroup>
            <InputGroup label="Relocation Willingness">
              <select 
                className="form-input"
                value={profile.marriage_intent?.relocation_willingness || ''}
                onChange={(e) => onUpdate('marriage_intent', 'relocation_willingness', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="international">Willing to relocate internationally</option>
                <option value="within_country">Willing to relocate within country</option>
                <option value="within_state">Willing to relocate within state</option>
                <option value="not_willing">Not willing to relocate</option>
              </select>
            </InputGroup>
            <InputGroup label="Seriousness">
              <div className={`h-10 flex items-center gap-2 px-3 rounded-lg border text-sm font-bold ${
                profile.marriage_intent?.seriousness_level === 'marriage' 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                <Check size={16} />
                {profile.marriage_intent?.seriousness_level === 'marriage' ? 'Looking for Marriage' : 'Exploring'}
              </div>
            </InputGroup>
          </div>
        </Card>
      </div>
    </div>
  );
};

const LifestyleSection: React.FC<SectionProps> = ({ profile, onUpdate }) => {
  const [personalityTags, setPersonalityTags] = useState<string[]>(profile.lifestyle.personality_tags || []);
  const availableTags = ['Introverted', 'Extroverted', 'Ambitious', 'Family-oriented', 'Creative', 'Rational', 'Adventurous', 'Calm'];

  const toggleTag = (tag: string) => {
    const newTags = personalityTags.includes(tag) 
      ? personalityTags.filter(t => t !== tag)
      : [...personalityTags, tag];
    setPersonalityTags(newTags);
    onUpdate('lifestyle', 'personality_tags', newTags);
  };

  return (
    <div className="space-y-6">
      <Card title="Habits & Lifestyle">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputGroup label="Dietary Preferences">
            <select 
              className="form-input"
              value={profile.lifestyle.diet || ''}
              onChange={(e) => onUpdate('lifestyle', 'diet', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Eggetarian">Eggetarian</option>
            </select>
          </InputGroup>
          <InputGroup label="Drinking">
            <select 
              className="form-input"
              value={profile.lifestyle.drink || ''}
              onChange={(e) => onUpdate('lifestyle', 'drink', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Never">Never</option>
              <option value="Socially">Socially</option>
              <option value="Regularly">Regularly</option>
            </select>
          </InputGroup>
          <InputGroup label="Smoking">
            <select 
              className="form-input"
              value={profile.lifestyle.smoke || ''}
              onChange={(e) => onUpdate('lifestyle', 'smoke', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Never">Never</option>
              <option value="Occasionally">Occasionally</option>
              <option value="Regularly">Regularly</option>
            </select>
          </InputGroup>
          <InputGroup label="Sleep Schedule">
            <div className="flex items-center gap-2 form-input">
              <Moon size={16} className="text-slate-400" />
              <select 
                className="flex-1 bg-transparent outline-none"
                value={profile.lifestyle.sleep_schedule || ''}
                onChange={(e) => onUpdate('lifestyle', 'sleep_schedule', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="early_bird">Early Bird</option>
                <option value="night_owl">Night Owl</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </InputGroup>
        </div>
      </Card>

      <Card title="Personality & Interests">
        <div className="space-y-6">
          <InputGroup label="Hobbies & Interests">
            <textarea
              className="form-input min-h-[80px]"
              value={profile.lifestyle.hobbies || ''}
              onChange={(e) => onUpdate('lifestyle', 'hobbies', e.target.value)}
              placeholder="e.g. Reading, Hiking, Classical Music, Cooking..."
            />
          </InputGroup>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">Personality Tags (Self-Assessed)</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                    personalityTags.includes(tag)
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const CareerSection: React.FC<SectionProps> = ({ profile, visibility, onUpdate, onToggleVisibility }) => {
  return (
    <div className="space-y-6">
      <Card title="Education History">
        <div className="space-y-4">
          {profile.career.education?.map((edu) => (
            <div key={edu.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
              <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                <Briefcase size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-sm text-slate-600">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {edu.start} - {edu.present ? 'Present' : edu.end}
                  </span>
                </div>
              </div>
              <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary p-1">
                <Edit2 size={14} />
              </button>
            </div>
          ))}
          <button className="flex items-center gap-2 text-primary font-bold text-sm w-fit hover:underline">
            <Plus size={16} /> Add Education
          </button>
        </div>
      </Card>

      <Card title="Current Employment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.career.careers?.[0] && (
            <>
              <InputGroup label="Profession / Designation">
                <input 
                  type="text" 
                  className="form-input" 
                  value={profile.career.careers[0].designation || ''}
                  onChange={(e) => {
                    const careers = [...profile.career.careers];
                    careers[0] = { ...careers[0], designation: e.target.value };
                    onUpdate('career', 'careers', careers);
                  }}
                />
              </InputGroup>
              
              <InputGroup label="Employer / Company">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="form-input flex-1" 
                    value={profile.career.careers[0].company || ''}
                    onChange={(e) => {
                      const careers = [...profile.career.careers];
                      careers[0] = { ...careers[0], company: e.target.value };
                      onUpdate('career', 'careers', careers);
                    }}
                  />
                  <button 
                    onClick={() => onToggleVisibility?.('company')}
                    className={`flex items-center justify-center px-3 border rounded-lg transition-colors ${
                      visibility?.company !== false 
                        ? 'border-green-200 bg-green-50 text-green-600' 
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                    title={visibility?.company !== false ? 'Visible' : 'Hidden'}
                  >
                    {visibility?.company !== false ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </InputGroup>

              <InputGroup label="Work Location">
                <select 
                  className="form-input"
                  value={profile.career.careers[0].work_location_type || ''}
                  onChange={(e) => {
                    const careers = [...profile.career.careers];
                    careers[0] = { ...careers[0], work_location_type: e.target.value };
                    onUpdate('career', 'careers', careers);
                  }}
                >
                  <option value="">Select...</option>
                  <option value="on_site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </InputGroup>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

const FamilySection: React.FC<SectionProps> = ({ profile, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Family Structure">
        <div className="space-y-4">
          <InputGroup label="Family Type">
            <select 
              className="form-input"
              value={profile.family.family_type || ''}
              onChange={(e) => onUpdate('family', 'family_type', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="nuclear">Nuclear Family</option>
              <option value="joint">Joint Family</option>
              <option value="extended">Extended Family</option>
            </select>
          </InputGroup>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Brothers">
              <select 
                className="form-input"
                value={profile.family.no_of_brothers ?? ''}
                onChange={(e) => onUpdate('family', 'no_of_brothers', parseInt(e.target.value) || 0)}
              >
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </InputGroup>
            <InputGroup label="Sisters">
              <select 
                className="form-input"
                value={profile.family.no_of_sisters ?? ''}
                onChange={(e) => onUpdate('family', 'no_of_sisters', parseInt(e.target.value) || 0)}
              >
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </InputGroup>
          </div>
        </div>
      </Card>

      <Card title="Parental Details">
        <div className="space-y-4">
          <InputGroup label="Father's Occupation">
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Civil Servant, Doctor, Business"
              value={profile.family.father_occupation || ''}
              onChange={(e) => onUpdate('family', 'father_occupation', e.target.value)}
            />
          </InputGroup>
          <InputGroup label="Mother's Occupation">
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Homemaker, Professor"
              value={profile.family.mother_occupation || ''}
              onChange={(e) => onUpdate('family', 'mother_occupation', e.target.value)}
            />
          </InputGroup>
          <InputGroup label="Family Location">
            <input 
              type="text" 
              className="form-input" 
              placeholder="City, Country"
              value={[profile.family.family_location_city, profile.family.family_location_country].filter(Boolean).join(', ') || ''}
              onChange={(e) => {
                const parts = e.target.value.split(',').map(s => s.trim());
                onUpdate('family', 'family_location_city', parts[0] || '');
                onUpdate('family', 'family_location_country', parts[1] || '');
              }}
            />
          </InputGroup>
        </div>
      </Card>

      <div className="md:col-span-2">
        <Card title="Community & Culture">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Religion">
              <input 
                type="text" 
                className="form-input" 
                value={profile.spiritual.religion_name || ''}
                placeholder="e.g. Hindu, Muslim, Christian"
                readOnly
              />
            </InputGroup>
            <InputGroup label="Community / Caste (Optional)">
              <input 
                type="text" 
                className="form-input" 
                value={profile.spiritual.caste_name || ''}
                placeholder="e.g. Brahmin, Kshatriya"
                readOnly
              />
            </InputGroup>
            <InputGroup label="Gothra / Clan (Optional)">
              <input 
                type="text" 
                className="form-input"
                value={profile.spiritual.gothra || ''}
                onChange={(e) => onUpdate('spiritual', 'gothra', e.target.value)}
                placeholder="Enter gothra"
              />
            </InputGroup>
          </div>
        </Card>
      </div>
    </div>
  );
};

interface PreferencesSectionProps extends SectionProps {
  onUpdatePriority: (field: string, priority: string) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ 
  profile, 
  priorities = {},
  onUpdatePriority 
}) => {
  const preferenceFields = [
    { key: 'age', label: 'Age Range', value: profile.preferences.min_age && profile.preferences.max_age 
      ? `${profile.preferences.min_age} - ${profile.preferences.max_age} Years` 
      : 'Not set' },
    { key: 'height', label: 'Height', value: profile.preferences.height ? `${profile.preferences.height} cm and above` : 'Not set' },
    { key: 'marital_status', label: 'Marital Status', value: 'Never Married' },
    { key: 'profession', label: 'Profession', value: profile.preferences.profession || 'Not set' },
    { key: 'diet', label: 'Diet', value: profile.preferences.diet || 'Not set' },
    { key: 'location', label: 'Location', value: 'Not set' },
  ];

  return (
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
        {preferenceFields.map(pref => (
          <PreferenceItem 
            key={pref.key}
            label={pref.label} 
            value={pref.value} 
            priority={priorities[pref.key] || 'flexible'}
            onChangePriority={(p) => onUpdatePriority(pref.key, p)}
          />
        ))}
        
        <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
          <Plus size={18} /> Add Preference Criteria
        </button>
      </div>
    </div>
  );
};

interface MediaSectionProps extends Omit<SectionProps, 'onSave'> {
  onUploadVoice: (file: File) => Promise<void>;
  onUploadVideo: (file: File) => Promise<void>;
}

const MediaSection: React.FC<MediaSectionProps> = ({ profile, onUploadVoice, onUploadVideo, saving }) => {
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-slate-900">Public Gallery</h3>
          <span className="text-xs text-slate-500">Visible to accepted matches</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Main Photo */}
          {profile.media.main_photo && (
            <div className="aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden relative group">
              <img src={profile.media.main_photo} className="w-full h-full object-cover" alt="Profile" />
              <div className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Main</div>
            </div>
          )}
          
          {/* Gallery Images */}
          {profile.media.gallery?.filter(g => !g.is_main).slice(0, 2).map((img) => (
            <div key={img.id} className="aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden relative group">
              <img src={img.url} className="w-full h-full object-cover" alt="Gallery" />
              <button className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={14} />
              </button>
            </div>
          ))}
          
          {/* Add Photo Placeholder */}
          <div className="aspect-[3/4] rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors">
            <ImageIcon size={24} />
            <span className="text-xs font-bold mt-2">Add Photo</span>
          </div>

          {/* Intro Video */}
          <div className="aspect-[3/4] rounded-xl bg-slate-900 overflow-hidden relative group flex items-center justify-center cursor-pointer"
            onClick={() => videoInputRef.current?.click()}
          >
            {profile.media.intro_video_url ? (
              <video src={profile.media.intro_video_url} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <Video size={20} />
                </div>
                <span className="absolute bottom-3 left-0 w-full text-center text-xs font-bold text-white/80">
                  {saving ? 'Uploading...' : 'Add Intro Video'}
                </span>
              </>
            )}
          </div>
          <input 
            type="file" 
            ref={videoInputRef} 
            className="hidden" 
            accept="video/mp4,video/mov,video/webm"
            onChange={(e) => e.target.files?.[0] && onUploadVideo(e.target.files[0])}
          />
        </div>
      </div>

      {/* Voice Intro */}
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <Mic size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Voice Intro</h4>
            <p className="text-xs text-slate-500">
              {profile.media.voice_intro_url ? 'Voice intro uploaded' : 'Record a 30s greeting for matches.'}
            </p>
          </div>
        </div>
        {profile.media.voice_intro_url ? (
          <audio controls src={profile.media.voice_intro_url} className="h-8" />
        ) : (
          <button 
            onClick={() => voiceInputRef.current?.click()}
            disabled={saving}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-purple-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? 'Uploading...' : 'Upload'}
          </button>
        )}
        <input 
          type="file" 
          ref={voiceInputRef} 
          className="hidden" 
          accept="audio/mp3,audio/wav,audio/m4a,audio/webm,audio/ogg"
          onChange={(e) => e.target.files?.[0] && onUploadVoice(e.target.files[0])}
        />
      </div>
    </div>
  );
};

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
      <button onClick={onRemove} className="hover:opacity-75 ml-1">×</button>
    </span>
  );
};

const VisibilityToggle: React.FC<{isVisible: boolean, onToggle: () => void}> = ({ isVisible, onToggle }) => (
  <div className="flex items-center gap-2 mt-1">
    <button 
      onClick={onToggle}
      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border transition-colors ${
        isVisible 
          ? 'text-green-600 bg-green-50 border-green-100' 
          : 'text-slate-500 bg-slate-50 border-slate-200'
      }`}
    >
      {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
      {isVisible ? 'Visible' : 'Hidden'}
    </button>
  </div>
);

const PreferenceItem: React.FC<{
  label: string; 
  value: string; 
  priority: string;
  onChangePriority: (priority: string) => void;
}> = ({ label, value, priority, onChangePriority }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const priorityConfig: Record<string, { label: string; color: string }> = {
    'dealbreaker': { label: 'Dealbreaker', color: 'bg-red-100 text-red-700' },
    'must_have': { label: 'Must have', color: 'bg-blue-100 text-blue-700' },
    'nice_to_have': { label: 'Nice to have', color: 'bg-green-100 text-green-700' },
    'flexible': { label: 'Flexible', color: 'bg-slate-100 text-slate-700' },
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
        <p className="font-bold text-slate-900">{value}</p>
      </div>
      <div className="flex items-center gap-3 relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className={`text-[10px] font-black uppercase px-2 py-1 rounded flex items-center gap-1 ${priorityConfig[priority]?.color || priorityConfig.flexible.color}`}
        >
          {priorityConfig[priority]?.label || 'Flexible'}
          <ChevronDown size={12} />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
            {Object.entries(priorityConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => { onChangePriority(key); setShowDropdown(false); }}
                className={`block w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 ${priority === key ? 'bg-slate-50' : ''}`}
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NudgeItem: React.FC<{label: string, points: string}> = ({ label, points }) => (
  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
    <div className="flex items-center gap-2">
      <div className="size-1.5 rounded-full bg-orange-400"></div>
      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{label}</span>
    </div>
    <span className="text-xs font-bold text-green-600">{points}</span>
  </div>
);

const InfoIcon = ({className}: {className?: string}) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default ProfileEditView;
