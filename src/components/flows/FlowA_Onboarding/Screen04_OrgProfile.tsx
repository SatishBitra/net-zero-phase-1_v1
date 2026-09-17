import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Building, Info, ArrowRight, Check } from 'lucide-react';

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
      // Flow A step: proceed to Screen 05 Sites & Facilities
      navigateToScreen('05_sites', 'FLOW_A');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Flow Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#5E6672] mb-1">
            <span>Administration</span>
            <span>•</span>
            <span className="text-[#174A8B] font-medium">Organisation Setup</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Organisation Profile</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Capture legal entity details and the organizational boundary approach used for GHG calculations.
          </p>
        </div>

        {/* Step sequence indicator */}
        <div className="mt-3 sm:mt-0 flex items-center space-x-1.5 text-xs text-[#858C96]">
          <span className="px-2 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
            Entity Profile
          </span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672]">Step 3: Sites</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Legal Entity Details */}
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg">
          <h2 className="text-sm font-medium text-[#171A1F] mb-1">Legal entity details</h2>
          <p className="text-xs text-[#5E6672] mb-4">
            Official company registration details per corporate regulatory filings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Legal Entity Name <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="text"
                required
                value={legalEntityName}
                onChange={(e) => setLegalEntityName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Registration / Corporate ID (CIN) <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="text"
                required
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Primary Country <span className="text-[#D92D20]">*</span>
              </label>
              <select
                value={primaryCountry}
                onChange={(e) => setPrimaryCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Reporting Currency <span className="text-[#D92D20]">*</span>
              </label>
              <select
                value={reportingCurrency}
                onChange={(e) => setReportingCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Fiscal Year Start Month <span className="text-[#D92D20]">*</span>
              </label>
              <select
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
              >
                <option value="April">April (e.g. Apr 1 – Mar 31 standard Indian FY)</option>
                <option value="January">January (e.g. Jan 1 – Dec 31 Calendar Year)</option>
                <option value="July">July (e.g. Jul 1 – Jun 30)</option>
                <option value="October">October (e.g. Oct 1 – Sep 30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Industry Sector <span className="text-[#D92D20]">*</span>
              </label>
              <select
                value={industrySector}
                onChange={(e) => setIndustrySector(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
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
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg">
          <h2 className="text-sm font-medium text-[#171A1F] mb-1">Organisational boundary</h2>
          <p className="text-xs text-[#5E6672] mb-4">
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
                className={`flex items-start p-3.5 rounded-lg border cursor-pointer transition-all ${
                  consolidationApproach === option.id
                    ? 'border-[#2166B1] bg-[#F8F9FB]'
                    : 'border-[#D9DDE3] bg-white hover:border-[#B8BEC7]'
                }`}
              >
                <input
                  type="radio"
                  name="consolidationApproach"
                  checked={consolidationApproach === option.id}
                  onChange={() => setConsolidationApproach(option.id as any)}
                  className="mt-0.5 mr-3 text-[#174A8B] focus:ring-[#174A8B]"
                />
                <div className="text-xs">
                  <div className="font-medium text-[#171A1F]">{option.title}</div>
                  <div className="text-[#5E6672] mt-0.5 leading-relaxed">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] flex items-start space-x-2 text-xs text-[#5E6672]">
            <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
            <span>
              This setting establishes the boundary baseline for all downstream activity ingestion, site additions, and BRSR / GHG Protocol verification filings.
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('03_tenant_selector', 'FLOW_A')}
            className="px-4 py-2 text-xs text-[#5E6672] hover:text-[#171A1F] hover:bg-[#F1F3F5] rounded-md transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>{isSaving ? 'Saving profile…' : 'Save & Continue to Sites'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
