import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import zeLogo from '../../../assets/ze.png';
import { UserRole } from '../../../types';

export const Screen01_Login: React.FC = () => {
  const { navigateToScreen, showToast, setCurrentRole, setCurrentUser } = useApp();
  const [email, setEmail] = useState('j.rao@zenith.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Authentication Verified', 'Proceed to verification challenge.');
      navigateToScreen('02_mfa', 'FLOW_A');
    }, 450);
  };

  const handleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Enterprise SSO Authenticated', 'Proceed to verification challenge.');
      navigateToScreen('02_mfa', 'FLOW_A');
    }, 400);
  };

  const handleQuickLoginAs = (role: UserRole, userEmail: string, userName: string) => {
    setCurrentRole(role);
    setCurrentUser({
      id: `usr-${role.toLowerCase()}`,
      name: userName,
      email: userEmail,
      role: role,
      siteScope: ['site-chennai-1', 'site-pune-2'],
      status: 'Active',
      avatarInitials: userName.split(' ').map(n => n[0]).join('').slice(0, 2),
    });
    setEmail(userEmail);
    if (role === 'VERIFIER') {
      navigateToScreen('30_verifier_login', 'FLOW_F');
    } else {
      navigateToScreen('03_tenant_selector', 'FLOW_A');
    }
  };

  return (
    <div id="screen-01-login" className="max-w-md mx-auto my-10 p-6 sm:p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#F1F3F5]">
        <div className="flex items-center space-x-3">
          <img
            src={zeLogo}
            alt="Zenith Energy Logo"
            className="w-9 h-9 object-contain rounded-lg"
          />
          <div>
            <div className="text-base font-bold text-[#01153C] leading-none">Tula Carbon</div>
            <div className="text-[11px] text-[#5F6368] font-medium mt-1">Enterprise Emission Accounting</div>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#027A48] flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
          <span>Online</span>
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#01153C] tracking-tight">Sign In</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-[#17181A] mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#01153C] focus:ring-1 focus:ring-[#01153C] bg-white text-[#17181A]"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-[#17181A]">
              Password
            </label>
            <button
              type="button"
              onClick={() => showToast('Password Reset', 'Reset link dispatched to registered email.')}
              className="text-[11px] text-[#01153C] hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#01153C] focus:ring-1 focus:ring-[#01153C] bg-white text-[#17181A]"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="enterprise-btn-primary w-full h-10 text-xs font-semibold flex items-center justify-center space-x-2 rounded-xl"
        >
          <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#8A8F98] text-[11px] font-medium">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSSO}
        disabled={loading}
        className="enterprise-btn-secondary w-full h-10 text-xs font-semibold flex items-center justify-center space-x-2 rounded-xl"
      >
        <Shield className="w-4 h-4 text-[#01153C]" />
        <span>Continue with Enterprise SSO (Okta / SAML)</span>
      </button>

      {/* Quick Role Select for UX / DX / AX Testing */}
      <div className="mt-6 pt-5 border-t border-[#F1F3F5]">
        <div className="text-[11px] font-semibold text-[#5F6368] mb-2 flex items-center space-x-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#01153C]" />
          <span>Quick Sign In by Role</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLoginAs('TENANT_ADMIN', 'j.rao@zenith.in', 'Jayant Rao')}
            className="p-2 border border-[#E5E7EB] hover:border-[#01153C] rounded-lg text-left hover:bg-[#FAFAFB] transition-colors"
          >
            <div className="font-semibold text-[#17181A]">Jayant Rao</div>
            <div className="text-[10px] text-[#5F6368]">Admin / Director</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoginAs('VERIFIER', 'audit@sgs-vvb.com', 'Dr. V. Raman')}
            className="p-2 border border-[#E5E7EB] hover:border-[#01153C] rounded-lg text-left hover:bg-[#FAFAFB] transition-colors"
          >
            <div className="font-semibold text-[#17181A]">Dr. V. Raman</div>
            <div className="text-[10px] text-[#5F6368]">External Verifier (VVB)</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoginAs('DATA_ENTRY', 'p.nair@zenith.in', 'P. Nair')}
            className="p-2 border border-[#E5E7EB] hover:border-[#01153C] rounded-lg text-left hover:bg-[#FAFAFB] transition-colors"
          >
            <div className="font-semibold text-[#17181A]">P. Nair</div>
            <div className="text-[10px] text-[#5F6368]">Site Operator / Data Entry</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoginAs('REVIEWER', 's.iyer@zenith.in', 'S. Iyer')}
            className="p-2 border border-[#E5E7EB] hover:border-[#01153C] rounded-lg text-left hover:bg-[#FAFAFB] transition-colors"
          >
            <div className="font-semibold text-[#17181A]">S. Iyer</div>
            <div className="text-[10px] text-[#5F6368]">Internal Reviewer</div>
          </button>
        </div>
      </div>
    </div>
  );
};
