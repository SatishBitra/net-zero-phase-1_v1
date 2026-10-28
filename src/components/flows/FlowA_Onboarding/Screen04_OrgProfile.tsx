import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Info, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen04_OrgProfile: React.FC = () => {
  const { currentTenant, updateTenantProfile, navigateToScreen } = useApp();

  const [legalEntityName, setLegalEntityName] = useState(currentTenant.legalEntityName);
  const [registrationNo, setRegistrationNo] = useState(currentTenant.registrationNo);
  const [primaryCountry, setPrimaryCountry] = useState(currentTenant.primaryCountry);
  const [reportingCurrency, setReportingCurrency] = useState(currentTenant.reportingCurrency);
  const [fiscalYearStart, setFiscalYearStart] = useState(currentTenant.fiscalYearStart);
  const [industrySector, setIndustrySector] = useState(currentTenant.industrySector);
  const [consolidationApproach, setConsolidationApproach] = useState(currentTenant.consolidationApproach);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateTenantProfile({
        legalEntityName,
        registrationNo,
        primaryCountry,
        reportingCurrency,
        fiscalYearStart,
        industrySector,
        consolidationApproach,
      });
      setIsSaving(false);
      navigateToScreen('05_sites', 'FLOW_A');
    }, 400);
  };

  return (
    <div id="screen-04-org-profile" className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Organisation Setup' },
          { label: 'Profile' },
        ]}
        title="Organisation Profile"
        badge={<StatusBadge status="Approved" customLabel="Entity Baseline" size="sm" />}
      />

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        {/* Section 1: Legal Entity Details */}
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
          <h2 className="text-sm font-semibold text-[#17181A] mb-3">Legal entity details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Legal Entity Name <span className="text-[#FB3256]">*</span>
              </label>
              <input
                type="text"
                required
                value={legalEntityName}
                onChange={(e) => setLegalEntityName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 bg-white text-[#17181A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Registration / Corporate ID (CIN) <span className="text-[#FB3256]">*</span>
              </label>
              <input
                type="text"
                required
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 bg-white text-[#17181A] activity-id font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Primary Country <span className="text-[#FB3256]">*</span>
              </label>
              <select
                value={primaryCountry}
                onChange={(e) => setPrimaryCountry(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Reporting Currency <span className="text-[#FB3256]">*</span>
              </label>
              <select
                value={reportingCurrency}
                onChange={(e) => setReportingCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Fiscal Year Start Month <span className="text-[#FB3256]">*</span>
              </label>
              <select
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
              >
                <option value="April">April (e.g. Apr 1 – Mar 31 standard Indian FY)</option>
                <option value="January">January (e.g. Jan 1 – Dec 31 Calendar Year)</option>
                <option value="July">July (e.g. Jul 1 – Jun 30)</option>
                <option value="October">October (e.g. Oct 1 – Sep 30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Industry Sector <span className="text-[#FB3256]">*</span>
              </label>
              <select
                value={industrySector}
                onChange={(e) => setIndustrySector(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#5141FF] bg-white text-[#17181A]"
              >
                <option value="Power Generation & Renewable Energy">Power Generation & Renewable Energy</option>
                <option value="Automotive & Industrial Components">Automotive & Industrial Components</option>
                <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                <option value="Commercial Real Estate & IT Parks">Commercial Real Estate & IT Parks</option>
                <option value="Cement & Heavy Building Materials">Cement & Heavy Building Materials</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Organisational Boundary & Consolidation Approach */}
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
          <h2 className="text-sm font-semibold text-[#17181A] mb-3">Organisational boundary</h2>

          <div className="space-y-3">
            {[
              {
                id: 'Operational control',
                title: 'Operational Control (Recommended)',
                description:
                  '100% of emissions from facilities and operations with full operational control.',
              },
              {
                id: 'Financial control',
                title: 'Financial Control',
                description:
                  '100% of emissions from operations with financial and operating authority.',
              },
              {
                id: 'Equity share',
                title: 'Equity Share',
                description:
                  'Emissions accounted according to economic equity interest in assets.',
              },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                  consolidationApproach === option.id
                    ? 'border-[#5141FF] bg-[#F2F0FF]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#5141FF]/40'
                }`}
              >
                <input
                  type="radio"
                  name="consolidationApproach"
                  checked={consolidationApproach === option.id}
                  onChange={() => setConsolidationApproach(option.id as any)}
                  className="mt-0.5 mr-3 text-[#181B27] focus:ring-[#5141FF]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#17181A]">{option.title}</div>
                  <div className="text-[#5F6368] mt-0.5 font-data">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('03_tenant_selector', 'FLOW_A')}
            className="px-5 py-2.5 text-xs font-semibold text-[#181B27] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] shadow-2xs transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#5141FF] rounded-full hover:bg-[#4232E8] shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <span>{isSaving ? 'Saving profile…' : 'Save & Continue to Sites'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
