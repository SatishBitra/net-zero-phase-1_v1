import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { KeyRound, ArrowRight, ArrowLeft, RefreshCw, Zap } from 'lucide-react';

export const Screen02_MFA: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

  const handleQuickFill = () => {
    setDigits(['8', '4', '9', '2', '0', '1']);
    showToast('Demo Code Populated', 'Filled 849201 for rapid verification.');
  };

  const handleResend = () => {
    setCountdown(60);
    showToast('Code Resent', 'New verification code dispatched to authenticator app.');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Authentication Confirmed', 'Session verified with hardware security key.');
      navigateToScreen('03_tenant_selector', 'FLOW_A');
    }, 450);
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <div id="screen-02-mfa" className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm font-sans">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F1F3F5]">
        <button
          onClick={() => navigateToScreen('01_login', 'FLOW_A')}
          className="flex items-center space-x-1.5 text-xs text-[#5F6368] hover:text-[#17181A] font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-[11px] font-semibold text-[#5F6368]">Step 2 of 2</span>
      </div>

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#5141FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#181B27]">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#181B27]">Two-Factor Verification</h1>
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
              aria-label={`Digit ${idx + 1}`}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 text-center text-lg font-bold font-mono border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF] bg-[#FAFAFB] text-[#17181A]"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !isComplete}
          className={`enterprise-btn-primary w-full h-10 text-xs font-semibold flex items-center justify-center space-x-2 rounded-xl ${
            !isComplete || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{loading ? 'Verifying…' : 'Verify and Continue'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Resend and DX Quick Fill Controls */}
      <div className="mt-6 pt-5 border-t border-[#F1F3F5] flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleQuickFill}
          className="text-[#181B27] hover:text-[#02215c] font-semibold flex items-center space-x-1"
        >
          <Zap className="w-3.5 h-3.5 text-[#181B27]" />
          <span>Autofill Demo Code</span>
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0}
          className={`flex items-center space-x-1 font-semibold ${
            countdown > 0 ? 'text-[#8A8F98] cursor-not-allowed' : 'text-[#5141FF] hover:underline'
          }`}
        >
          <RefreshCw className="w-3 h-3" />
          <span>{countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}</span>
        </button>
      </div>
    </div>
  );
};
