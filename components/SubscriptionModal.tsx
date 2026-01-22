import React, { useState } from 'react';
import { X, Check, Star, Zap, Crown, Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSelectPlan: (planId: string, price: number) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [activeTab, setActiveTab] = useState<'plans' | 'addons'>('plans');

  const plans = [
    {
      id: 'gold',
      name: 'DMB Gold',
      icon: <Star size={24} className="text-orange-500 fill-orange-500" />,
      price: billingCycle === 'monthly' ? 1499 : billingCycle === 'quarterly' ? 3999 : 11999,
      features: ['Unlimited Likes', 'See Who Liked You', '5 Super Likes / mo', 'Advanced Filters'],
      color: 'border-orange-200 bg-orange-50',
      btnColor: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'platinum',
      name: 'DMB Platinum',
      icon: <Crown size={24} className="text-slate-900 fill-slate-900" />,
      price: billingCycle === 'monthly' ? 2499 : billingCycle === 'quarterly' ? 6999 : 19999,
      features: ['Priority Listing (Spotlight)', 'Message before Matching', 'View Contact Numbers (30/mo)', 'Profile Intelligence Report'],
      recommended: true,
      color: 'border-slate-900 bg-slate-50',
      btnColor: 'bg-slate-900 hover:bg-slate-800'
    },
    {
      id: 'assisted',
      name: 'Assisted Service',
      icon: <Users size={24} className="text-purple-600" />,
      price: 45000,
      features: ['Dedicated Matchmaker', 'Handpicked Profiles', 'Meeting Coordination', 'Background Verification Checks'],
      fixedPrice: true,
      color: 'border-purple-200 bg-purple-50',
      btnColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const addons = [
    {
        id: 'boost',
        title: 'Profile Boost',
        desc: 'Be the top profile in your area for 60 mins.',
        price: 499,
        icon: <Zap size={24} className="text-yellow-500 fill-yellow-500" />
    },
    {
        id: 'verification',
        title: 'Expert Profile Review',
        desc: 'Our experts optimize your bio and photos.',
        price: 999,
        icon: <ShieldCheck size={24} className="text-green-600" />
    },
    {
        id: 'contacts',
        title: 'Extra Contact Credits',
        desc: 'Unlock 10 additional phone numbers.',
        price: 1499,
        icon: <Users size={24} className="text-blue-600" />
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 relative bg-white shrink-0">
             <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Invest in your Future</h2>
            <p className="text-slate-500">Choose a plan that accelerates your search for the perfect partner.</p>
            
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full mt-6">
                <button 
                    onClick={() => setActiveTab('plans')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Membership Plans
                </button>
                <button 
                    onClick={() => setActiveTab('addons')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'addons' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Zap size={14} className="fill-current" /> Add-ons
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
            
            {activeTab === 'plans' ? (
                <>
                    {/* Billing Cycle Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                            <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setBillingCycle('quarterly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${billingCycle === 'quarterly' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}
                            >
                                Quarterly
                                <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] px-1.5 rounded-full border border-white">Save 20%</span>
                            </button>
                            <button 
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${billingCycle === 'yearly' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
                            >
                                Yearly
                                <span className="absolute -top-3 -right-2 bg-orange-500 text-white text-[10px] px-1.5 rounded-full border border-white">Best Value</span>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div key={plan.id} className={`relative flex flex-col bg-white rounded-2xl p-6 border-2 shadow-lg transition-transform hover:scale-[1.02] ${plan.color} ${plan.recommended ? 'ring-2 ring-offset-2 ring-slate-900' : ''}`}>
                                {plan.recommended && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        {plan.icon}
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">₹{plan.price.toLocaleString()}</span>
                                        {!plan.fixedPrice && <span className="text-sm text-slate-500 font-medium">/ {billingCycle === 'monthly' ? 'mo' : billingCycle === 'quarterly' ? 'qtr' : 'yr'}</span>}
                                    </div>
                                </div>
                                
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" strokeWidth={3} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => onSelectPlan(plan.name, plan.price)}
                                    className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${plan.btnColor}`}
                                >
                                    Select Plan <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-center text-xs text-slate-400 mt-8">
                        Recurring billing. Cancel anytime. Prices inclusive of taxes.
                    </p>
                </>
            ) : (
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-900">À La Carte Power-ups</h3>
                        <p className="text-slate-500">Boost your visibility without a subscription.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addons.map((addon) => (
                             <div key={addon.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                        {addon.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{addon.title}</h4>
                                        <p className="text-xs text-slate-500">{addon.desc}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onSelectPlan(addon.title, addon.price)}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800"
                                >
                                    ₹{addon.price}
                                </button>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;