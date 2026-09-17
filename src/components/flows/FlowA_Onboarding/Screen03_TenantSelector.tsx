import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Tenant } from '../../../types';
import { Building2, Search, ArrowRight, Check } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

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
    navigateToScreen('04_org_profile', 'FLOW_A');
  };

  return (
    <div id="screen-03-tenant-selector" className="max-w-xl mx-auto my-10 p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm font-sans">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F3F5]">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[#6254E8]" />
          <span className="text-xs font-semibold text-[#17181A]">Tenant Directory</span>
        </div>
        <StatusBadge status="Approved" customLabel="Organisation Boundary" size="sm" />
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#17181A] tracking-tight">Select an organisation</h1>
        <p className="text-xs text-[#5F6368] mt-1 font-data">
          Choose the enterprise tenant account you wish to access for carbon reporting and governance.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search organisation name, sector or CIN…"
          className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
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
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                isSelected
                  ? 'border-[#6254E8] bg-[#6254E8]/5 shadow-2xs'
                  : 'border-[#E5E7EB] bg-white hover:border-[#7567F5] hover:bg-[#FAFAFB]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-[#17181A] group-hover:text-[#6254E8] transition-colors">
                    {tenant.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB] font-data">
                    {tenant.userRole.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-[#5F6368]">{tenant.legalEntityName}</p>
                <div className="flex items-center space-x-3 text-[11px] text-[#8A8F98] pt-1 font-data">
                  <span>CIN: {tenant.registrationNo}</span>
                  <span>•</span>
                  <span>{tenant.industrySector}</span>
                  <span>•</span>
                  <span>Approach: {tenant.consolidationApproach}</span>
                </div>
              </div>

              <div className="pl-4 flex items-center space-x-2">
                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-[#6254E8] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-[#E5E7EB] group-hover:border-[#6254E8] group-hover:bg-[#6254E8]/10 flex items-center justify-center text-[#8A8F98] group-hover:text-[#6254E8] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTenants.length === 0 && (
          <div className="text-center py-8 border border-dashed border-[#E5E7EB] rounded-xl text-xs text-[#8A8F98] font-data">
            No organisations found matching "{search}".
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#F1F3F5] flex items-center justify-between text-xs text-[#8A8F98] font-data">
        <span>Need access to another subsidiary?</span>
        <button
          onClick={() => navigateToScreen('04_org_profile', 'FLOW_A')}
          className="text-[#6254E8] hover:underline font-semibold font-sans"
        >
          Request Permission →
        </button>
      </div>
    </div>
  );
};
