import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { KeyRound, ArrowRight, RotateCw, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-[#D9DDE3] rounded-lg shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F3F5]">
        <button
          onClick={() => navigateToScreen('01_login', 'FLOW_A')}
          className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </button>
        <span className="text-[11px] px-2 py-0.5 bg-[#EAF2FB] text-[#174A8B] rounded font-medium">Two-Factor Authentication</span>
      </div>

      <div className="text-center mb-6">
        <div className="w-10 h-10 bg-[#EAF2FB] rounded-full flex items-center justify-center mx-auto mb-3 text-[#174A8B]">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-normal text-[#171A1F]">Verify it's you</h1>
        <p className="text-xs text-[#5E6672] mt-1">
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
              className="w-11 h-12 text-center text-lg font-mono border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] focus:ring-1 focus:ring-[#174A8B] bg-[#F8F9FB]"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !isComplete}
          className={`w-full py-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center space-x-1.5 ${
            isComplete && !loading
              ? 'bg-[#174A8B] hover:bg-[#2166B1] text-white'
              : 'bg-[#E9ECEF] text-[#A6ABB3] cursor-not-allowed'
          }`}
        >
          <span>{loading ? 'Verifying…' : 'Verify Code'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => showToast('New code sent to verified device', undefined, 'info')}
          className="text-xs text-[#2166B1] hover:underline inline-flex items-center space-x-1"
        >
          <RotateCw className="w-3 h-3" />
          <span>Resend verification code</span>
        </button>
      </div>

      {/* Quick Test Autofill helper */}
      <div className="mt-6 p-2.5 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-center">
        <button
          type="button"
          onClick={() => {
            setDigits(['4', '8', '2', '9', '0', '1']);
          }}
          className="text-[11px] text-[#5E6672] hover:text-[#174A8B] hover:underline"
        >
          Simulate Authenticator input (Auto-fill 482901)
        </button>
      </div>
    </div>
  );
};
