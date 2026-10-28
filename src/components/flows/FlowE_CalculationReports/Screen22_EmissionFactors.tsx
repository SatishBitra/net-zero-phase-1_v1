import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  Filter,
  Search,
  BookOpen,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { AUTHORITATIVE_EMISSION_FACTORS, EmissionFactor } from '../../../data/emissionFactorsData';

export const Screen22_EmissionFactors: React.FC = () => {
  const { navigateToScreen, openFactorHelper } = useApp();

  const [publishingBodyFilter, setPublishingBodyFilter] = useState('All');
  const [financialYearFilter, setFinancialYearFilter] = useState('FY 2025–26');
  const [tableSearch, setTableSearch] = useState('');

  const filteredFactors = useMemo(() => {
    return AUTHORITATIVE_EMISSION_FACTORS.filter((item) => {
      const matchBody =
        publishingBodyFilter === 'All' ||
        item.publishingBody.toLowerCase().includes(publishingBodyFilter.toLowerCase());

      const matchSearch =
        !tableSearch.trim() ||
        item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.region.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.citation.toLowerCase().includes(tableSearch.toLowerCase());

      return matchBody && matchSearch;
    });
  }, [publishingBodyFilter, tableSearch]);

  return (
    <div id="screen-22-container" className="w-full space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Results', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Emission Factors Reference' },
        ]}
        title="Emission Factors Reference"
        badge={
          <StatusBadge status="Locked" customLabel="Read-only platform library" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /calculations/factors
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              id="btn-launch-factor-helper"
              type="button"
              onClick={() => openFactorHelper()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#01153C] rounded-full hover:bg-[#02215c] shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />
              <span>Launch Factor Helper</span>
            </button>

            <button
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="px-4 py-2 text-xs font-semibold text-[#01153C] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] shadow-2xs flex items-center space-x-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Drill-Down</span>
            </button>
          </div>
        }
      />

      {/* Core Business Rule Banner */}
      <div className="p-4 bg-[#EDF2FA] border border-[#DCE5F5] rounded-2xl text-xs text-[#01153C] flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#01153C]" />
          <span>
            <strong className="font-semibold text-[#01153C]">Core Business Rule:</strong> Emission factors are read-only, versioned by financial year, and never overwritten. <em>A 2026 result stays reproducible in 2029.</em>
          </span>
        </div>
        <span className="text-[11px] font-sans font-semibold text-[#01153C] bg-white px-3 py-1 rounded-full border border-[#DCE5F5]">
          Zero silent modifications
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Filter factors..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAFAFB] border border-[#E5E7EB] rounded-full text-[#17181A] placeholder-[#8A8F98] focus:outline-none focus:border-[#01153C]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#5F6368]" />
            <label className="text-xs font-semibold text-[#5F6368] font-sans">Publishing body:</label>
            <select
              value={publishingBodyFilter}
              onChange={(e) => setPublishingBodyFilter(e.target.value)}
              className="px-3.5 py-1.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#01153C] font-sans"
            >
              <option value="All">All Bodies</option>
              <option value="IPCC">IPCC (AR6 / 2006)</option>
              <option value="IEA">IEA (2024)</option>
              <option value="CEA">CEA (India)</option>
              <option value="DEFRA">DEFRA / DESNZ</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#5F6368]" />
            <label className="text-xs font-semibold text-[#5F6368] font-sans">Financial year:</label>
            <select
              value={financialYearFilter}
              onChange={(e) => setFinancialYearFilter(e.target.value)}
              className="px-3.5 py-1.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#01153C] font-sans"
            >
              <option value="FY 2025–26">FY 2025–26 (Active)</option>
              <option value="FY 2024–25">FY 2024–25 (Historical Snapshot)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#5F6368] font-sans font-medium">
          Showing {filteredFactors.length} verified factors
        </div>
      </div>

      {/* Factor Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Factor / Activity</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Scope & Region</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Value</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Unit</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Publishing Body</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredFactors.map((row) => (
              <tr key={row.id} className="hover:bg-[#FAFAFB] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#17181A]">
                  <div>{row.name}</div>
                  <div className="text-[11px] text-[#8A8F98] font-data line-clamp-1 mt-0.5">{row.citation}</div>
                </td>
                <td className="py-3.5 px-4 text-[#5F6368]">
                  <span className="font-semibold text-[#17181A]">{row.scope}</span>
                  <div className="text-[10px] text-[#8A8F98]">{row.region}</div>
                </td>
                <td className="py-3.5 px-4 text-right emission-factor font-bold text-[#01153C] font-mono text-sm">
                  {row.value}
                </td>
                <td className="py-3.5 px-4 emission-factor text-[#5F6368] font-data">
                  {row.unit}
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#01153C]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EDF2FA] border border-[#DCE5F5] text-xs">
                    {row.publishingBody}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => openFactorHelper(row.name)}
                    className="px-3 py-1.5 rounded-full bg-[#EDF2FA] hover:bg-[#01153C] text-[#01153C] hover:text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    Calculate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance & Functional Notes */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl text-xs text-[#5F6368] space-y-1.5 shadow-2xs font-data">
        <div className="font-semibold text-[#17181A] flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#01153C]" />
          <span>Functional Requirements (FR-22.01 – FR-22.05):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-[#5F6368]">
          <li><strong>FR-22.01:</strong> Every calculation retains the emission-factor version used at calculation time.</li>
          <li><strong>FR-22.02:</strong> Updating the platform factor library will never mutate or retroactively adjust historical calculations.</li>
          <li><strong>FR-22.03:</strong> Users cannot directly edit published factors; adjustments require new version releases with an effective date.</li>
        </ul>
      </div>
    </div>
  );
};
