import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export const Screen01_Login: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();
  const [email, setEmail] = useState('j.rao@zenith.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Authentication Verified', 'Proceed to Multi-Factor Authentication challenge.');
      navigateToScreen('02_mfa', 'FLOW_A');
    }, 600);
  };

  const handleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Enterprise SSO Authenticated', 'Proceed to Multi-Factor Authentication challenge.');
      navigateToScreen('02_mfa', 'FLOW_A');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-[#D9DDE3] rounded-lg shadow-sm">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F3F5]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#174A8B] text-white flex items-center justify-center font-medium text-xs">
            T
          </div>
          <span className="text-xs font-medium text-[#171A1F]">Tula Carbon Enterprise</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 bg-[#EAF2FB] text-[#174A8B] rounded font-medium">
          Secure Authentication
        </span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-normal text-[#171A1F] tracking-tight">Sign in to Tula Carbon</h1>
        <p className="text-xs text-[#5E6672] mt-1">
          Enterprise carbon accounting & emissions assurance platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#5E6672] mb-1">Work Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#858C96] absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[#5E6672]">Password</label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#2166B1] hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#858C96] absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center space-x-1.5"
        >
          <span>{loading ? 'Authenticating…' : 'Sign in'}</span>
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#D9DDE3]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-[#858C96] text-[11px]">or connect via</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSSO}
        disabled={loading}
        className="w-full py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#171A1F] rounded-md transition-colors flex items-center justify-center space-x-2"
      >
        <Shield className="w-3.5 h-3.5 text-[#5E6672]" />
        <span>Continue with Enterprise SAML / Okta SSO</span>
      </button>

      <div className="mt-6 pt-4 border-t border-[#F1F3F5] text-center text-[11px] text-[#858C96]">
        Protected by ISO/IEC 27001 & SOC-2 Type II enterprise controls
      </div>
    </div>
  );
};
