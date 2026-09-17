import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  Building2,
  Calendar,
  Eye,
  AlertCircle,
} from 'lucide-react';

export const Screen30_VerifierLogin: React.FC = () => {
  const { setCurrentUser, navigateToScreen, showToast, addAuditLog } = useApp();

  const [email, setEmail] = useState('audit@sgs-vvb.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  // Scoped authorization profile
  const verifierScope = {
    vvbFirm: 'SGS India Pvt Ltd (Accredited VVB)',
    tenant: 'Zenith Energy Services Pvt Ltd',
    sites: ['Chennai Plant 1', 'Pune Warehouse'],
    period: 'FY 2025–26',
    permissions: 'Read-only verification & query raising',
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    showToast('Authenticating Verifier', 'Verifying scoped credentials for SGS India...');

    setTimeout(() => {
      // Switch user session to VERIFIER role with scoped access
      setCurrentUser({
        id: 'usr-vvb-01',
        name: 'Dr. V. Raman',
        email: email,
        role: 'VERIFIER',
        siteScope: ['site-chennai-1', 'site-pune-2'],
        status: 'Active',
        avatarInitials: 'VR',
      });

      addAuditLog({
        userName: 'Dr. V. Raman',
        role: 'VERIFIER',
        action: 'Verifier Portal Authenticated',
        previousValue: 'Session: None',
        newValue: `Scoped Access Granted: ${verifierScope.tenant} (${verifierScope.period})`,
        source: 'https://verify.tulacarbon.io/login',
        reason: 'External ISO 14064-3 GHG Inventory Independent Assurance',
        status: 'Active Session',
        lineItemId: 'AUTH-VVB-901',
      });

      setIsLoading(false);
      showToast('Verifier Access Granted', 'Logged in to Scoped Verifier Portal.');
      // Navigates to Screen 31 — Verifier Dashboard
      navigateToScreen('31_verifier_dashboard', 'FLOW_F');
    }, 650);
  };

  return (
    <div id="screen-30-container" className="min-h-[80vh] flex flex-col justify-center max-w-lg mx-auto py-8 px-4 space-y-6">
      {/* Verifier Surface Branding (Separate from Main App Shell) */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAF2FB] border border-[#2166B1]/30 text-[#174A8B] mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono text-[#5E6672]">
          https://verify.tulacarbon.io/login
        </div>
        <h1 className="text-2xl font-normal text-[#171A1F]">
          Verifier Portal — read-only access
        </h1>
        <p className="text-xs text-[#5E6672]">
          Dedicated assurance portal for accredited Validation & Verification Bodies (VVBs)
        </p>
      </div>

      {/* Scoped Authorization Notice Box */}
      <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs space-y-2">
        <div className="font-semibold text-[#171A1F] flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-[#174A8B]" />
          <span>Assigned Verification Scope (FR-30.03 – FR-30.05)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5E6672] font-mono">
          <div>Tenant: <strong className="text-[#171A1F]">{verifierScope.tenant}</strong></div>
          <div>Period: <strong className="text-[#171A1F]">{verifierScope.period}</strong></div>
          <div className="col-span-2">Sites: <strong className="text-[#171A1F]">Chennai Plant 1, Pune Warehouse</strong></div>
        </div>
      </div>

      {/* Login Form (Section 21.1) */}
      <form onSubmit={handleSignIn} className="p-6 bg-white border border-[#D9DDE3] rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#5E6672] mb-1">
            Email address
          </label>
          <input
            id="verifier-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@vvb-firm.com"
            className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded focus:border-[#174A8B] focus:outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5E6672] mb-1">
            Password
          </label>
          <input
            id="verifier-password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded focus:border-[#174A8B] focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            id="btn-verifier-signin"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Authenticating Scope…' : 'Sign In to Verifier Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Read-Only Access Model Governance Guarantees (Section 22.1) */}
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] space-y-1">
        <div className="font-semibold text-[#171A1F]">Verifier Access Constraints:</div>
        <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
          <li><strong>FR-30.06 – FR-30.10:</strong> Verifier access is strictly read-only.</li>
          <li>Verifiers cannot modify activity records, emission factors, calculations, or workflow decisions.</li>
          <li>Verifiers can inspect source document lineage and raise queries directly against specific line items.</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => navigateToScreen('29_export_download', 'FLOW_E')}
          className="text-xs text-[#5E6672] hover:text-[#171A1F] hover:underline"
        >
          ← Return to Tenant Application (Zenith Energy)
        </button>
      </div>
    </div>
  );
};
