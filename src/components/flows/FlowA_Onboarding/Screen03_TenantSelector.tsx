import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Tenant } from '../../../types';
import { Building2, Search, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const Screen03_TenantSelector: React.FC = () => {
  const { tenants, currentTenant, setCurrentTenant, navigateToScreen } = useApp();
  const [search, setSearch] = useState('');

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.legalEntityName.toLowerCase().includes(search.toLowerCase()) ||
      t.industrySector.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    // Proceed to Screen 04 in Flow A
    navigateToScreen('04_org_profile', 'FLOW_A');
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white border border-[#D9DDE3] rounded-lg shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F3F5]">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[#174A8B]" />
          <span className="text-xs font-medium text-[#171A1F]">Tenant Directory</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 bg-[#EAF2FB] text-[#174A8B] rounded">
          Organisation Boundary
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-lg font-normal text-[#171A1F]">Select an organisation</h1>
        <p className="text-xs text-[#5E6672] mt-1">
          Choose the enterprise tenant account you wish to access for carbon reporting and governance.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-[#858C96] absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search organisation name, sector or CIN…"
          className="w-full pl-9 pr-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
        />
      </div>

      {/* Tenants List */}
      <div className="space-y-3">
        {filteredTenants.map((tenant) => {
          const isSelected = tenant.id === currentTenant.id;
          return (
            <div
              key={tenant.id}
              onClick={() => handleSelect(tenant)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                isSelected
                  ? 'border-[#2166B1] bg-[#F8F9FB] shadow-xs'
                  : 'border-[#D9DDE3] bg-white hover:border-[#B8BEC7] hover:bg-[#F8F9FB]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-[#171A1F] group-hover:text-[#174A8B] transition-colors">
                    {tenant.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672] border border-[#D9DDE3]">
                    {tenant.userRole.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-[#5E6672]">{tenant.legalEntityName}</p>
                <div className="flex items-center space-x-3 text-[11px] text-[#858C96] pt-1">
                  <span>CIN: {tenant.registrationNo}</span>
                  <span>•</span>
                  <span>{tenant.industrySector}</span>
                  <span>•</span>
                  <span>Approach: {tenant.consolidationApproach}</span>
                </div>
              </div>

              <div className="pl-4 flex items-center space-x-2">
                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-[#174A8B] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-[#D9DDE3] group-hover:border-[#174A8B] group-hover:bg-[#EAF2FB] flex items-center justify-center text-[#858C96] group-hover:text-[#174A8B] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTenants.length === 0 && (
          <div className="text-center py-8 border border-dashed border-[#D9DDE3] rounded-lg text-xs text-[#858C96]">
            No organisations found matching "{search}".
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#F1F3F5] flex items-center justify-between text-xs text-[#858C96]">
        <span>Need access to another subsidiary?</span>
        <button
          onClick={() => navigateToScreen('04_org_profile', 'FLOW_A')}
          className="text-[#2166B1] hover:underline flex items-center space-x-1"
        >
          <span>Continue with selected ({currentTenant.name})</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
