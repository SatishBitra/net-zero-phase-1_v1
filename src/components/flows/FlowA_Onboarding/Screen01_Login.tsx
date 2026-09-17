import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

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
    <div id="screen-01-login" className="max-w-md mx-auto my-12 p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm font-sans">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F3F5]">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6254E8] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            T
          </div>
          <span className="text-xs font-semibold text-[#17181A]">Tula Carbon ZE</span>
        </div>
        <StatusBadge status="Approved" customLabel="Secure Authentication" size="sm" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-[#17181A] tracking-tight">Sign in to Tula Carbon</h1>
        <p className="text-xs text-[#5F6368] mt-1 font-data">
          Enterprise carbon accounting & emissions assurance platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#17181A] mb-1">Work Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[#17181A]">Password</label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#6254E8] hover:underline font-medium">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="enterprise-btn-primary w-full h-10 text-xs font-semibold shadow-xs flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Authenticating…' : 'Sign in'}</span>
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2.5 text-[#8A8F98] text-[11px] font-data">or connect via</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSSO}
        disabled={loading}
        className="enterprise-btn-secondary w-full h-10 text-xs font-semibold flex items-center justify-center space-x-2"
      >
        <Shield className="w-4 h-4 text-[#6254E8]" />
        <span>Continue with Enterprise SAML / Okta SSO</span>
      </button>

      <div className="mt-6 pt-4 border-t border-[#F1F3F5] text-center text-[11px] text-[#8A8F98] font-data">
        Protected by ISO/IEC 27001 & SOC-2 Type II enterprise controls
      </div>
    </div>
  );
};
