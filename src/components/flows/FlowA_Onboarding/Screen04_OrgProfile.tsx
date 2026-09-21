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
    <div id="screen-04-org-profile" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Organisation Setup' },
          { label: 'Profile' },
        ]}
        title="Organisation Profile"
        description="Capture legal entity details and the organizational boundary approach used for GHG calculations."
        badge={<StatusBadge status="Approved" customLabel="Entity Baseline" size="sm" />}
      />

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        {/* Section 1: Legal Entity Details */}
        <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
          <h2 className="text-sm font-semibold text-[#17181A] mb-1">Legal entity details</h2>
          <p className="text-xs text-[#5F6368] mb-4 font-data">
            Official company registration details per corporate regulatory filings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Legal Entity Name <span className="text-[#ED2024]">*</span>
              </label>
              <input
                type="text"
                required
                value={legalEntityName}
                onChange={(e) => setLegalEntityName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#01153C] focus:ring-1 focus:ring-[#01153C]/20 bg-white text-[#17181A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Registration / Corporate ID (CIN) <span className="text-[#ED2024]">*</span>
              </label>
              <input
                type="text"
                required
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#01153C] focus:ring-1 focus:ring-[#01153C]/20 bg-white text-[#17181A] activity-id font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Primary Country <span className="text-[#ED2024]">*</span>
              </label>
              <select
                value={primaryCountry}
                onChange={(e) => setPrimaryCountry(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#01153C] bg-white text-[#17181A]"
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
                Reporting Currency <span className="text-[#ED2024]">*</span>
              </label>
              <select
                value={reportingCurrency}
                onChange={(e) => setReportingCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#01153C] bg-white text-[#17181A]"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Fiscal Year Start Month <span className="text-[#ED2024]">*</span>
              </label>
              <select
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#01153C] bg-white text-[#17181A]"
              >
                <option value="April">April (e.g. Apr 1 – Mar 31 standard Indian FY)</option>
                <option value="January">January (e.g. Jan 1 – Dec 31 Calendar Year)</option>
                <option value="July">July (e.g. Jul 1 – Jun 30)</option>
                <option value="October">October (e.g. Oct 1 – Sep 30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Industry Sector <span className="text-[#ED2024]">*</span>
              </label>
              <select
                value={industrySector}
                onChange={(e) => setIndustrySector(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#01153C] bg-white text-[#17181A]"
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
          <h2 className="text-sm font-semibold text-[#17181A] mb-1">Organisational boundary</h2>
          <p className="text-xs text-[#5F6368] mb-4 font-data">
            Under GHG Protocol standards, choose how emissions from subsidiary facilities, leases, and joint ventures are accounted.
          </p>

          <div className="space-y-3">
            {[
              {
                id: 'Operational control',
                title: 'Operational Control (Recommended)',
                description:
                  'Your organisation accounts for 100% of emissions from facilities and operations over which it has full operational authority to introduce operating policies.',
              },
              {
                id: 'Financial control',
                title: 'Financial Control',
                description:
                  'Your organisation accounts for 100% of emissions from operations over which it has the ability to direct financial and operating policies to gain economic benefits.',
              },
              {
                id: 'Equity share',
                title: 'Equity Share',
                description:
                  'Your organisation accounts for GHG emissions according to its economic equity percentage interest in joint-venture or shared facility assets.',
              },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-start p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  consolidationApproach === option.id
                    ? 'border-[#01153C] bg-[#EDF2FA]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#01153C]/40'
                }`}
              >
                <input
                  type="radio"
                  name="consolidationApproach"
                  checked={consolidationApproach === option.id}
                  onChange={() => setConsolidationApproach(option.id as any)}
                  className="mt-0.5 mr-3 text-[#01153C] focus:ring-[#01153C]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#17181A]">{option.title}</div>
                  <div className="text-[#5F6368] mt-0.5 leading-relaxed font-data">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 p-3.5 bg-[#FAFAFB] rounded-2xl border border-[#E5E7EB] flex items-start space-x-2 text-xs text-[#5F6368]">
            <Info className="w-4 h-4 text-[#01153C] shrink-0 mt-0.5" />
            <span className="font-data">
              This setting establishes the boundary baseline for all downstream activity ingestion, site additions, and BRSR / GHG Protocol verification filings.
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('03_tenant_selector', 'FLOW_A')}
            className="px-5 py-2.5 text-xs font-semibold text-[#01153C] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] shadow-2xs transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#01153C] rounded-full hover:bg-[#02215c] shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <span>{isSaving ? 'Saving profile…' : 'Save & Continue to Sites'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
