import React, { useState } from 'react';
import { X, Lock, CreditCard, Wallet, Building, CheckCircle2, ShieldCheck, Ticket } from 'lucide-react';

interface PaymentModalProps {
  planName: string;
  amount: number;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ planName, amount, onClose }) => {
  const [step, setStep] = useState<'summary' | 'processing' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const tax = Math.round(amount * 0.18); // 18% GST
  const total = amount + tax - discount;

  const handleApplyCoupon = () => {
      if (coupon.toLowerCase() === 'doc10') {
          setDiscount(Math.round(amount * 0.10));
      }
  };

  const handlePay = () => {
      setStep('processing');
      setTimeout(() => setStep('success'), 2000);
  };

  if (step === 'success') {
      return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95">
                <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                <p className="text-slate-500 mb-8">You have successfully subscribed to <b>{planName}</b>. Your invoice has been sent to your email.</p>
                <button onClick={onClose} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800">
                    Continue to Dashboard
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Left: Summary */}
        <div className="w-full md:w-5/12 bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
             <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                 <ShieldCheck className="text-green-600" size={20} /> Order Summary
             </h3>
             
             <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-start">
                     <div>
                         <p className="font-bold text-slate-800">{planName}</p>
                         <p className="text-xs text-slate-500">Billing Interval: Quarterly</p>
                     </div>
                     <p className="font-bold text-slate-900">₹{amount.toLocaleString()}</p>
                 </div>
                 
                 {discount > 0 && (
                     <div className="flex justify-between items-center text-green-600">
                         <p className="text-sm font-medium">Discount (DOC10)</p>
                         <p className="font-bold">-₹{discount.toLocaleString()}</p>
                     </div>
                 )}

                 <div className="flex justify-between items-center text-slate-500">
                     <p className="text-sm">GST (18%)</p>
                     <p className="font-medium">₹{tax.toLocaleString()}</p>
                 </div>
                 
                 <hr className="border-slate-200" />
                 
                 <div className="flex justify-between items-center">
                     <p className="font-bold text-lg text-slate-900">Total</p>
                     <p className="font-black text-2xl text-primary">₹{total.toLocaleString()}</p>
                 </div>
             </div>

             <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Promo Code</label>
                 <div className="flex gap-2">
                     <div className="relative flex-1">
                        <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Enter code" 
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                     </div>
                     <button 
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                     >
                         Apply
                     </button>
                 </div>
             </div>
        </div>

        {/* Right: Payment */}
        <div className="w-full md:w-7/12 p-8 flex flex-col relative">
             <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X size={20} /></button>
             
             <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Method</h2>
             
             <div className="space-y-3 mb-8">
                 <PaymentOption 
                    id="card" 
                    icon={<CreditCard size={20} />} 
                    label="Credit / Debit Card" 
                    selected={paymentMethod === 'card'} 
                    onSelect={() => setPaymentMethod('card')}
                 />
                 <PaymentOption 
                    id="upi" 
                    icon={<Wallet size={20} />} 
                    label="UPI / Wallets (GPay, PhonePe)" 
                    selected={paymentMethod === 'upi'} 
                    onSelect={() => setPaymentMethod('upi')}
                 />
                 <PaymentOption 
                    id="netbanking" 
                    icon={<Building size={20} />} 
                    label="Netbanking" 
                    selected={paymentMethod === 'netbanking'} 
                    onSelect={() => setPaymentMethod('netbanking')}
                 />
             </div>

             {paymentMethod === 'card' && (
                 <div className="space-y-4 mb-8 animate-in fade-in">
                     <input type="text" placeholder="Card Number" className="w-full p-3 border border-slate-300 rounded-xl text-sm" />
                     <div className="flex gap-4">
                         <input type="text" placeholder="MM/YY" className="flex-1 p-3 border border-slate-300 rounded-xl text-sm" />
                         <input type="text" placeholder="CVV" className="w-24 p-3 border border-slate-300 rounded-xl text-sm" />
                     </div>
                 </div>
             )}

             <div className="mt-auto">
                 <button 
                    onClick={handlePay}
                    disabled={step === 'processing'}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-hover flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                 >
                     {step === 'processing' ? 'Processing...' : (
                         <>
                            <Lock size={20} /> Pay ₹{total.toLocaleString()}
                         </>
                     )}
                 </button>
                 <div className="flex justify-center items-center gap-4 mt-4 text-xs text-slate-400 grayscale opacity-70">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
                     <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
                     <span className="flex items-center gap-1"><ShieldCheck size={12} /> 256-bit SSL Secure</span>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

const PaymentOption: React.FC<{id: string, icon: React.ReactNode, label: string, selected: boolean, onSelect: () => void}> = ({ id, icon, label, selected, onSelect }) => (
    <div 
        onClick={onSelect}
        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'}`}
    >
        <div className={`p-2 rounded-full ${selected ? 'bg-white text-primary shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
            {icon}
        </div>
        <span className={`font-bold ${selected ? 'text-primary' : 'text-slate-700'}`}>{label}</span>
        {selected && <div className="ml-auto size-4 bg-primary rounded-full border-2 border-white shadow-sm ring-1 ring-primary"></div>}
    </div>
);

export default PaymentModal;