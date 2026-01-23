import React, { useState, useEffect, useRef } from 'react';
import api, { parseApiError } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { 
    Smartphone, Mail, ArrowRight, ShieldCheck, Heart, User, Users, 
    CheckCircle2, Lock, HelpCircle, ChevronLeft, Globe, AlertCircle, Clock, ShieldAlert, Monitor,
    Key, Sparkles, Eye, EyeOff, RefreshCw, Check, X, KeyRound, Info, Shield, Loader2, FileKey, LogOut,
    MessageCircle, Signal
} from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'landing' | 'input' | 'otp' | 'magic-link' | 'password' | 'create-password' | 'mfa' | 'social-consent' | 'recovery-start' | 'recovery-verify' | 'recovery-backup' | 'reset-password' | 'recovery-success'>('landing');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  
  // Default fallback data for "On Behalf"
  const defaultOnBehalf = [
    { id: 1, name: 'Myself' },
    { id: 2, name: 'My Son' },
    { id: 3, name: 'My Daughter' },
    { id: 4, name: 'My Brother' },
    { id: 5, name: 'My Sister' },
    { id: 6, name: 'My Friend' },
    { id: 7, name: 'My Client' }
  ];

  const [profileFor, setProfileFor] = useState('1'); 
  const [onBehalfList, setOnBehalfList] = useState<{id: number, name: string}[]>(defaultOnBehalf);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | ''>('');
    const [dateOfBirth, setDateOfBirth] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [signOutAll, setSignOutAll] = useState(true);
  const [recoveryContact, setRecoveryContact] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [socialProfile, setSocialProfile] = useState<{name: string, email: string, avatar: string} | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  
  // Security & Validation
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [showOtpHelp, setShowOtpHelp] = useState(false);
  
  // Refs for OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const response = await api.get('/on-behalf');
        if (response.data && response.data.data) {
          setOnBehalfList(response.data.data);
          if (response.data.data.length > 0) {
            setProfileFor(response.data.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Failed to fetch on-behalf list', err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    let interval: number;
    if (rateLimitTimer > 0) {
      interval = setInterval(() => {
        setRateLimitTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitTimer]);

  // Password Logic
  const calculateStrength = (pwd: string) => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score; // Max 4
  };

  const isBreached = (pwd: string) => {
      const common = ['password', '123456', '12345678', 'qwerty', 'admin123', 'iloveyou', 'password123'];
      return common.includes(pwd.toLowerCase());
  };

  const strengthScore = calculateStrength(newPassword);
  const isPasswordBreached = isBreached(newPassword);

  const handleIdentifierSubmit = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (method === 'phone') {
            if (identifier.length < 10) {
                setError('Please enter a valid mobile number');
                setIsLoading(false);
                return;
            }
            
            // For now, let's keep the country code hardcoded as per Laravel's default fallback logic (+92/India as per UI)
            const phone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
            setPhone(phone);
            setEmail('');
            
            await api.post('/send-phone-verification', { phone });
            
            setFailedAttempts(0);
            setIsLocked(false);
            setOtp(['', '', '', '', '', '']);
            setRateLimitTimer(30);
            setShowOtpHelp(false);
            setStep('otp');
        } else {
            // Email Flow
            if (!identifier.includes('@')) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }
            setEmail(identifier);
            
            await api.post('/send-email-verification', { email: identifier });
            
            setFailedAttempts(0);
            setIsLocked(false);
            setOtp(['', '', '', '', '', '']);
            setRateLimitTimer(30);
            setShowOtpHelp(false);
            setStep('otp');
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
  };

  const handleOtpVerify = async (codeOverride?: string) => {
      setIsLoading(true);
      setError('');
      let code = (codeOverride ?? otp.join('')).replace(/\D/g, '');
      if (code.length < 6) {
          const refCode = otpRefs.current.map((el) => el?.value ?? '').join('').replace(/\D/g, '');
          if (refCode.length >= 6) {
              code = refCode;
          }
      }
      if (code.length < 6) {
          setError('Please enter the complete 6-digit code');
          setIsLoading(false);
          return;
      }

      try {
          if (method === 'phone') {
              const phone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
              const response = await api.post('/verify-phone-code', { phone, code });
              
              if (response.data.result) {
                  if (response.data.user) {
                      setAuth(response.data.user, response.data.access_token);
                      onComplete();
                  } else {
                      // New user, verified phone, go to profile creation/account setup
                      setPhone(phone);
                      setEmail('');
                      setStep('create-password');
                  }
              } else {
                  setError(response.data.message || 'Invalid verification code');
              }
          } else {
              // Email verification
              const response = await api.post('/verify-email-code', { email: identifier, code });
              if (response.data.result) {
                  if (response.data.user) {
                      setAuth(response.data.user, response.data.access_token);
                      onComplete();
                  } else {
                      // New user
                      setEmail(identifier);
                      setStep('create-password');
                  }
              } else {
                  setError(response.data.message || 'Invalid verification code');
              }
          }
      } catch (err) {
          setError(parseApiError(err));
          setFailedAttempts(prev => prev + 1);
          if (failedAttempts >= 4) setIsLocked(true);
      } finally {
          setIsLoading(false);
      }
  };

  const handleSocialLogin = () => {
      setIsSocialLoading(true);
      // Simulate OAuth delay
      setTimeout(() => {
          setIsSocialLoading(false);
          setSocialProfile({
              name: 'Dr. Rajesh Kumar',
              email: 'rajesh.kumar@example.com',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzaeWWENYBM2epJ60q01dnFi4yz9YiDXwYV1EcDpGsU1Z-chVQmIqfs1U7m1enVrZEgaqiAL48Wvmleo4yRa9cBGga6j-LEf-P3Ho0KsEw9xfZSyQG3wNMsUkO8ogL8vk2iDwFJm5NtbsXMNvmPodIL3nQnT0M5IGF8jTeSkGjKhPNKnO9QwlZhliJ15ahx-2B289fTui5atTjNPc5CzfxkbA2dzyZDiVpuHek_5h9OrbVpmGA-mfOhwW7KtWkAG1b2ulDY4C42bM'
          });
          setStep('social-consent');
      }, 1500);
  };

  const handleVerify = () => {
      if (isLocked) return;

      const code = otp.join('');
      if (code.length !== 6) {
          setError('Please enter the 6-digit code sent to you.');
          return;
      }

      // Simulate specific wrong code for lockout demo
      if (code === '000000') {
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          if (newAttempts >= 3) {
              setIsLocked(true);
              setError("Security Lockout: Too many failed attempts. Try again in 15 minutes.");
          } else {
              setError(`Incorrect code. ${3 - newAttempts} attempts remaining.`);
              setOtp(['', '', '', '', '', '']);
              otpRefs.current[0]?.focus();
          }
          return;
      }

      if (step === 'recovery-verify') {
          setStep('reset-password');
          return;
      }

      onComplete();
  };

  const handlePasswordLogin = () => {
      if (!password) {
          setError('Please enter your password');
          return;
      }
      
      // Simulated Risk-Based MFA Trigger
      if (password.toLowerCase() === 'risk') {
          setStep('mfa');
          setError('');
          setOtp(['', '', '', '', '', '']);
          setRateLimitTimer(30);
          setShowOtpHelp(false);
          return;
      }

      // Simulate login
      onComplete();
  };

  const handleCreateAccount = () => {
      if (!firstName || !lastName) {
          setError('Please enter your first and last name.');
          return;
      }
      if (!email || !email.includes('@')) {
          setError('Please enter a valid email address.');
          return;
      }
      if (!phone || phone.replace(/\D/g, '').length < 10) {
          setError('Please enter a valid phone number.');
          return;
      }
      if (!gender) {
          setError('Please select your gender.');
          return;
      }
      if (!dateOfBirth) {
          setError('Please select your date of birth.');
          return;
      }
      if (newPassword !== confirmPassword) {
          setError('Passwords do not match.');
          return;
      }
      if (strengthScore < 3) {
          setError('Password is too weak. Please meet the requirements.');
          return;
      }
      if (isPasswordBreached) {
          setError('This password has been exposed in data breaches. Please choose a different one.');
          return;
      }

      setIsLoading(true);
      setError('');

      const payload = {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`,
          gender,
          on_behalf: parseInt(profileFor, 10),
          date_of_birth: dateOfBirth,
          password: newPassword,
          password_confirmation: confirmPassword,
      };

      api.post('/signup', payload)
          .then((res) => {
              if (res.data?.result && res.data?.access_token) {
                  setAuth(res.data.user, res.data.access_token);
                  onComplete();
              } else {
                  setError(res.data?.message || 'Unable to create account.');
              }
          })
          .catch((err) => {
              const message = parseApiError(err);
              setError(Array.isArray(message) ? message.join(', ') : message);
          })
          .finally(() => setIsLoading(false));
  }

  const handleRecoveryStart = () => {
      if (!identifier) {
          setError('Please enter your email or phone number first.');
          return;
      }
      setError('');
      setRateLimitTimer(30);
      setOtp(['', '', '', '', '', '']);
      setShowOtpHelp(false);
      setStep('recovery-verify');
  };

  const handleBackupVerify = () => {
      if (backupCode.length !== 8) {
          setError('Please enter a valid 8-digit backup code.');
          return;
      }
      setStep('reset-password');
  };

  const handleResetPassword = () => {
      if (newPassword !== confirmPassword) {
          setError('Passwords do not match.');
          return;
      }
      if (strengthScore < 3) {
          setError('Password is too weak.');
          return;
      }
      // Success logic here
      setStep('recovery-success');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const val = e.target.value;
      if (!/^\d*$/.test(val)) return;

      const newOtp = [...otp];
      newOtp[idx] = val.substring(val.length - 1);
      setOtp(newOtp);
      setError('');

      if (val && idx < 5) {
          otpRefs.current[idx + 1]?.focus();
      } else if (val && idx === 5) {
          // Trigger verification automatically when last digit is filled
          const code = newOtp.join('');
          setTimeout(() => handleOtpVerify(code), 100);
      }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
          otpRefs.current[idx - 1]?.focus();
      }
  };

  const getMaskedIdentifier = () => {
      if (method === 'email') {
          const [name, domain] = identifier.split('@');
          if (!domain) return identifier;
          return `${name.slice(0, 2)}••••••@${domain}`;
      }
      // Phone format: +91 ••••• ••12
      return `+91 ••••• ••${identifier.slice(-2)}`;
  };

  const creatorOptions = [
      "Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Client"
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
        {/* Left Panel: Brand & Visuals (Hidden on mobile) */}
        <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 text-white overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] size-[500px] rounded-full bg-primary blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] size-[500px] rounded-full bg-blue-600 blur-[100px]"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                        <Heart size={20} className="text-primary fill-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">DMB<span className="text-primary">.</span></span>
                </div>
                
                <h1 className="text-5xl font-black leading-tight mb-6">
                    Trusted Matrimony for <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">Medical Professionals</span>
                </h1>
                
                <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                    Join the exclusive network where doctors find partners who understand their world. Verified, secure, and private.
                </p>
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="size-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold">100% Verified Profiles</h3>
                        <p className="text-sm text-slate-400">Government ID & Medical Registration checks.</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="size-10 rounded-full border-2 border-slate-900 bg-slate-800 bg-cover bg-center" style={{backgroundImage: `url(https://source.unsplash.com/random/100x100?face&sig=${i})`}}></div>
                    ))}
                    <div className="h-10 px-3 flex items-center bg-white text-slate-900 rounded-full text-xs font-bold">
                        10k+ Success Stories
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel: Entry Flow */}
        <div className="flex-1 flex flex-col relative bg-white">
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-500">
                    
                    {/* Step 1: Landing / Method Selection */}
                    {step === 'landing' && (
                        <>
                            <div className="text-center">
                                <div className="lg:hidden flex justify-center mb-6">
                                    <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Heart size={24} className="text-primary fill-primary" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to DMB</h2>
                                <p className="text-slate-500">Let's start your journey.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 ml-1">I am creating a profile for</label>
                                    <div className="relative">
                                        <select 
                                            value={profileFor}
                                            onChange={(e) => setProfileFor(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl appearance-none font-medium text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer hover:bg-slate-100"
                                        >
                                            {onBehalfList.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <User size={20} />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => { setMethod('phone'); setStep('input'); }}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 group"
                                >
                                    <Smartphone size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                    Continue with Phone
                                </button>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-4 text-xs text-slate-400 font-bold uppercase">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => { setMethod('email'); setStep('input'); }}
                                        className="py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Mail size={18} /> Email
                                    </button>
                                    <button 
                                        onClick={handleSocialLogin}
                                        disabled={isSocialLoading}
                                        className="py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSocialLoading ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Globe size={18} />} 
                                        Google
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mt-6">
                                <Lock size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    <span className="font-bold">We protect your privacy.</span> You control who sees your details. We never post to social media.
                                </p>
                            </div>
                        </>
                    )}

                    {/* Step: Social Consent (Missing Data / Verification) */}
                    {step === 'social-consent' && socialProfile && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            {/* Header with Avatar */}
                            <div className="text-center">
                                <div className="size-20 rounded-full bg-cover bg-center mx-auto mb-4 border-4 border-white shadow-lg relative" style={{backgroundImage: `url(${socialProfile.avatar})`}}>
                                    <div className="absolute bottom-0 right-0 size-6 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                                        <Globe size={12} className="text-blue-500" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Welcome, {socialProfile.name.split(' ')[0]}</h2>
                                <p className="text-slate-500 text-sm">You've successfully authenticated with Google.</p>
                            </div>

                            {/* Confirmation Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={socialProfile.name} 
                                        onChange={(e) => setSocialProfile({...socialProfile, name: e.target.value})}
                                        className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 font-medium focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Email Address</label>
                                    <div className="flex items-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed">
                                        <Mail size={16} />
                                        <span className="flex-1">{socialProfile.email}</span>
                                        <CheckCircle2 size={16} className="text-green-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Safety Context - Phone Requirement */}
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
                                <ShieldCheck size={20} className="text-yellow-700 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-yellow-900 text-sm">Phone Verification Required</h4>
                                    <p className="text-xs text-yellow-800 mt-1 leading-relaxed">
                                        To maintain a verified community of doctors and prevent spam, we require a valid mobile number for all accounts.
                                    </p>
                                </div>
                            </div>

                            {/* Action */}
                            <button 
                                onClick={() => {
                                    setMethod('phone');
                                    setStep('input');
                                    setError('Please verify your phone number to complete setup.');
                                }}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Continue to Verification <ArrowRight size={18} />
                            </button>
                            
                            <div className="text-center">
                                <button onClick={() => setStep('landing')} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                                    Cancel and go back
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Input (Phone & Email) */}
                    {step === 'input' && (
                        <>
                            <button onClick={() => setStep('landing')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">
                                <ChevronLeft size={16} /> Back
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {method === 'phone' ? 'Enter Mobile Number' : 'Enter Email Address'}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    {method === 'phone' 
                                        ? "If this number is registered, we’ll send a code." 
                                        : "We'll send a verification link to this email."}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className={`relative flex items-center border rounded-xl transition-all ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}`}>
                                        {method === 'phone' && (
                                            <div className="pl-4 pr-3 flex items-center gap-2 border-r border-slate-200 h-14">
                                                <span className="text-lg">🇮🇳</span>
                                                <span className="font-bold text-slate-600">+91</span>
                                            </div>
                                        )}
                                        <input 
                                            type={method === 'phone' ? 'tel' : 'email'}
                                            inputMode={method === 'phone' ? 'numeric' : 'email'}
                                            autoFocus
                                            value={identifier}
                                            onChange={(e) => {
                                                setIdentifier(e.target.value);
                                                setError('');
                                            }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && identifier && rateLimitTimer === 0) handleIdentifierSubmit(); }}
                                            className={`w-full h-14 bg-transparent outline-none font-medium text-lg ${method === 'phone' ? 'pl-4' : 'px-4'}`}
                                            placeholder={method === 'phone' ? '98765 XXXXX' : 'doctor@example.com'}
                                            aria-label={method === 'phone' ? 'Mobile Number' : 'Email Address'}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5 px-1">
                                        <Lock size={10} />
                                        You decide who can contact you; your details stay private by default.
                                    </p>
                                    
                                    {error && (
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-2 flex gap-3 items-start animate-in slide-in-from-top-1">
                                            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-red-700">{error}</p>
                                                {failedAttempts >= 1 && (
                                                    <button onClick={() => {
                                                        setMethod(method === 'phone' ? 'email' : 'phone');
                                                        setIdentifier('');
                                                        setError('');
                                                    }} className="text-xs font-bold text-red-600 hover:text-red-800 mt-1 underline">
                                                        Change Method
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleIdentifierSubmit}
                                    disabled={!identifier || rateLimitTimer > 0}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {rateLimitTimer > 0 ? (
                                        <span className="flex items-center gap-2">
                                            <Clock size={18} /> Try again in {rateLimitTimer}s
                                        </span>
                                    ) : (
                                        <>{method === 'phone' ? 'Send Code' : 'Continue'} <ArrowRight size={20} /></>
                                    )}
                                </button>

                                <button 
                                    onClick={() => {
                                        setMethod(method === 'phone' ? 'email' : 'phone');
                                        setIdentifier('');
                                        setError('');
                                    }} 
                                    className="w-full text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    Use {method === 'phone' ? 'email' : 'phone number'} instead
                                </button>

                                {method === 'email' && (
                                    <div className="text-center pt-2">
                                        <button 
                                            onClick={() => {
                                                if (!identifier.includes('@')) {
                                                    setError('Please enter a valid email address first');
                                                    return;
                                                }
                                                setStep('create-password');
                                            }}
                                            className="text-xs font-bold text-primary hover:underline"
                                        >
                                            New user? Create password
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 3: Magic Link Sent (Email Preference) */}
                    {step === 'magic-link' && (
                        <div className="text-center space-y-8 animate-in slide-in-from-right">
                             <button onClick={() => setStep('input')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 absolute top-0 left-0">
                                <ChevronLeft size={16} /> Edit Email
                            </button>

                            <div className="size-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={40} />
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h2>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                    We sent a magic link to <b className="text-slate-900">{identifier}</b>. Click the link to sign in instantly.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg">
                                    Open Email App
                                </button>

                                <button 
                                    onClick={() => setStep('password')}
                                    className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Key size={18} /> Use Password instead
                                </button>
                            </div>

                            <div className="pt-4">
                                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto">
                                    <RefreshCw size={14} /> Resend Link
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Password Entry (Sign In) */}
                    {step === 'password' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                             <button onClick={() => setStep('magic-link')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">
                                <ChevronLeft size={16} /> Back
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                                <p className="text-slate-500 text-sm mt-1 flex items-center justify-center gap-1">
                                    Signing in as <span className="font-bold text-slate-900">{getMaskedIdentifier()}</span>
                                </p>
                            </div>

                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    autoFocus
                                    className={`w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    onKeyDown={(e) => { if(e.key === 'Enter') handlePasswordLogin(); }}
                                />
                                <button 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            
                            {error && (
                                <p className="text-red-500 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertCircle size={12} /> {error}
                                </p>
                            )}

                            <div className="flex justify-between items-center text-xs font-bold">
                                <button onClick={() => setStep('recovery-start')} className="text-slate-500 hover:text-slate-800">
                                    Forgot Password?
                                </button>
                                <button 
                                    onClick={() => { setStep('otp'); setRateLimitTimer(30); setOtp(['', '', '', '', '', '']); setShowOtpHelp(false); }}
                                    className="text-primary hover:underline"
                                >
                                    Use code instead
                                </button>
                            </div>

                            <button 
                                onClick={handlePasswordLogin}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 4b: Create Password (New User) */}
                    {step === 'create-password' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <button onClick={() => setStep('input')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">
                                <ChevronLeft size={16} /> Back
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Create Your Password</h2>
                                <p className="text-slate-500 text-sm mt-1">Set a strong password to finish setup.</p>
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertCircle size={12} /> {error}
                                </p>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="First name"
                                            className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Last name"
                                            className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Email address"
                                        className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Phone number"
                                        className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <select
                                            value={gender}
                                            onChange={(e) => {
                                                setGender(e.target.value as 'male' | 'female' | '');
                                                setError('');
                                            }}
                                            className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => {
                                                setDateOfBirth(e.target.value);
                                                setError('');
                                            }}
                                            className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="New password"
                                        className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Confirm password"
                                        className="w-full h-14 px-4 bg-white border border-slate-300 rounded-xl font-medium text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className={`inline-block size-2 rounded-full ${strengthScore >= 3 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    <span>Password strength: {strengthScore >= 4 ? 'Strong' : strengthScore >= 3 ? 'Good' : 'Weak'}</span>
                                </div>
                                {isPasswordBreached && (
                                    <p className="text-xs text-red-600 font-bold">This password appears in breach lists. Choose another.</p>
                                )}
                            </div>

                            <button
                                onClick={handleCreateAccount}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
                            >
                                Create Account
                            </button>
                        </div>
                    )}

                    {/* Step 5: Phone OTP, MFA & Recovery Verification */}
                    {(step === 'otp' || step === 'mfa' || step === 'recovery-verify') && (
                        <>
                            <button onClick={() => setStep(step === 'mfa' ? 'password' : (step === 'recovery-verify' ? 'recovery-start' : 'input'))} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">
                                <ChevronLeft size={16} /> {step === 'mfa' ? 'Back' : step === 'recovery-verify' ? 'Change Email/Phone' : (method === 'phone' ? 'Change Number' : 'Change Email')}
                            </button>

                            <div className="text-center mb-8">
                                {step === 'mfa' ? (
                                    <>
                                        <div className="size-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Shield size={28} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Security Check</h2>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Unusual activity detected. Please enter the verification code sent to your device.
                                        </p>
                                    </>
                                ) : step === 'recovery-verify' ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-900">Verify Identity</h2>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Enter the code sent to your registered contact.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-900">Verify it's you</h2>
                                        <p className="text-slate-500 text-sm mt-1 flex items-center justify-center gap-2">
                                            Code sent to <span className="font-bold text-slate-900 font-mono tracking-wide">{getMaskedIdentifier()}</span>
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="space-y-8">
                                {isLocked ? (
                                    <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center animate-in zoom-in-95">
                                        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
                                        <h3 className="font-bold text-red-900 text-lg">Account Locked</h3>
                                        <p className="text-sm text-red-700 mt-1">We've detected unusual activity. Please try again later or contact support.</p>
                                        <button className="mt-4 text-sm font-bold text-slate-600 underline">Contact Support</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex gap-2 justify-center">
                                            {otp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    ref={el => otpRefs.current[idx] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    autoFocus={idx === 0}
                                                    aria-label={`Digit ${idx + 1}`}
                                                    onChange={(e) => handleOtpChange(e, idx)}
                                                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                                    disabled={isLocked}
                                                    className={`size-12 md:size-14 border rounded-xl text-center text-2xl font-bold outline-none transition-all disabled:opacity-50 disabled:bg-slate-100 ${step === 'mfa' ? 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20' : 'border-slate-300 focus:border-primary focus:ring-primary/20'}`}
                                                />
                                            ))}
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-2 flex gap-3 items-start animate-in slide-in-from-top-1">
                                                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-red-700">{error}</p>
                                                    {failedAttempts >= 2 && (
                                                        <button onClick={() => setStep('landing')} className="text-xs font-bold text-red-600 hover:text-red-800 mt-1 underline">
                                                            Change Method
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {step === 'otp' && (
                                            <label className="flex items-center justify-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    checked={trustDevice}
                                                    onChange={(e) => setTrustDevice(e.target.checked)}
                                                    className="rounded text-primary focus:ring-primary border-slate-300"
                                                />
                                                <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 flex items-center gap-1">
                                                    Trust this device <Monitor size={14} className="text-slate-400" />
                                                </span>
                                            </label>
                                        )}

                                        <button 
                                            onClick={handleOtpVerify}
                                            disabled={isLoading}
                                            className={`w-full text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${step === 'mfa' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-primary hover:bg-primary-hover shadow-primary/30'}`}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (step === 'mfa' ? 'Verify & Continue' : (step === 'recovery-verify' ? 'Verify Code' : 'Verify & Continue'))}
                                        </button>

                                        <div className="flex flex-col items-center gap-3">
                                            <button 
                                                disabled={rateLimitTimer > 0}
                                                onClick={() => {
                                                    setRateLimitTimer(30);
                                                    setOtp(['', '', '', '', '', '']);
                                                    setShowOtpHelp(true);
                                                }}
                                                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {rateLimitTimer > 0 ? `Resend code in 00:${rateLimitTimer.toString().padStart(2, '0')}` : "Resend Code"}
                                            </button>

                                            {(showOtpHelp || rateLimitTimer > 0) && (
                                                <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-4 rounded-lg w-full max-w-xs text-left border border-slate-100 animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <HelpCircle size={14} className="text-slate-400" />
                                                        <p className="font-bold text-slate-700">Didn't receive code?</p>
                                                    </div>
                                                    <ul className="space-y-2 pl-1">
                                                        <li className="flex gap-2">
                                                            <Signal size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                                            <span>Check your signal strength</span>
                                                        </li>
                                                        {method === 'email' && (
                                                            <li className="flex gap-2">
                                                                <MessageCircle size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                                                <span>Check your spam folder</span>
                                                            </li>
                                                        )}
                                                        <li className="flex gap-2">
                                                            <Clock size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                                            <span>Wait 30 seconds before resending</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}

                                            {step === 'recovery-verify' && (
                                                <button onClick={() => setStep('recovery-backup')} className="text-xs text-primary font-bold hover:underline mt-4">
                                                    Lost access to phone? Use Backup Code
                                                </button>
                                            )}

                                            {step === 'otp' && (
                                                <button onClick={() => setStep('landing')} className="text-xs text-primary font-bold hover:underline mt-2">
                                                    Try another method
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-600 hover:underline">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600 hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600 hover:underline">Cookie Policy</a>
                </div>
                <div className="flex items-center gap-2 hover:text-slate-600 cursor-pointer">
                    <HelpCircle size={14} />
                    <span>Help & Support</span>
                </div>
            </div>
        </div>
    </div>
  );
};

const RequirementItem: React.FC<{label: string, met: boolean}> = ({ label, met }) => (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-600' : 'text-slate-400'}`}>
        {met ? <Check size={12} strokeWidth={3} /> : <div className="size-3 rounded-full border border-slate-300"></div>}
        <span className={met ? 'font-bold' : ''}>{label}</span>
    </div>
);

export default WelcomeScreen;
