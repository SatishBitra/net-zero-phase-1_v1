import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen02_MFA: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);

    // Auto-advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('MFA Confirmed', 'Session verified with hardware token.');
      navigateToScreen('03_tenant_selector', 'FLOW_A');
    }, 600);
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <div id="screen-02-mfa" className="max-w-md mx-auto my-12 p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm font-sans">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F3F5]">
        <button
          onClick={() => navigateToScreen('01_login', 'FLOW_A')}
          className="flex items-center space-x-1 text-xs text-[#5F6368] hover:text-[#17181A] font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </button>
        <StatusBadge status="Approved" customLabel="Two-Factor Authentication" size="sm" />
      </div>

      <div className="text-center mb-6">
        <div className="w-11 h-11 bg-[#6254E8]/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-[#6254E8] border border-[#6254E8]/20">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold text-[#17181A]">Verify it's you</h1>
        <p className="text-xs text-[#5F6368] mt-1 font-data">
          Enter the 6-digit verification code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6-digit segmented inputs */}
        <div className="flex justify-center space-x-2.5" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 text-center text-lg font-mono border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#7567F5] focus:ring-1 focus:ring-[#7567F5] bg-[#FAFAFB] text-[#17181A]"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !isComplete}
          className={`enterprise-btn-primary w-full h-10 text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 ${
            !isComplete || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{loading ? 'Verifying…' : 'Verify Code'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
