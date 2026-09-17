import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  Filter,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

interface EmissionFactorRow {
  factor: string;
  value: number | string;
  unit: string;
  publishingBody: string;
  effectiveFrom: string;
  gwpMethodology?: string;
}

export const Screen22_EmissionFactors: React.FC = () => {
  const { navigateToScreen } = useApp();

  const [publishingBodyFilter, setPublishingBodyFilter] = useState('All');
  const [financialYearFilter, setFinancialYearFilter] = useState('FY 2025–26');

  // Exact factor table data from Screen 22 PRD specification
  const factors: EmissionFactorRow[] = [
    {
      factor: 'Grid electricity (India, national avg)',
      value: '0.708',
      unit: 'kgCO2e/kWh',
      publishingBody: 'CEA',
      effectiveFrom: '01-Apr-2025',
    },
    {
      factor: 'Diesel (stationary combustion)',
      value: '2.68',
      unit: 'kgCO2e/litre',
      publishingBody: 'IPCC / DEFRA',
      effectiveFrom: '01-Apr-2025',
    },
    {
      factor: 'R-410A refrigerant',
      value: '2,088',
      unit: 'kgCO2e/kg (GWP)',
      publishingBody: 'IPCC AR6',
      effectiveFrom: '01-Apr-2025',
      gwpMethodology: '100-year GWP time horizon',
    },
  ];

  const filteredFactors = factors.filter((item) => {
    if (publishingBodyFilter === 'All') return true;
    return item.publishingBody.toLowerCase().includes(publishingBodyFilter.toLowerCase());
  });

  return (
    <div id="screen-22-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Results', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Emission Factors Reference' },
        ]}
        title="Emission Factors Reference"
        description="Transparent, versioned reference library for the emission factors used in Tula Carbon ZE calculations."
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
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Drill-Down (Screen 21)</span>
            </button>

            <button
              onClick={() => navigateToScreen('23_submission_queue', 'FLOW_B')}
              className="enterprise-btn-primary h-9 px-3.5 flex items-center space-x-1.5 text-xs shadow-xs"
            >
              <span>Submission Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Core Business Rule Banner */}
      <div className="p-3.5 bg-[#F0EEFF] border border-[#D8D3FF] rounded-xl text-xs text-[#5144C9] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#6254E8]" />
          <span>
            <strong className="font-semibold text-[#17181A]">Core Business Rule:</strong> Emission factors are read-only, versioned by financial year, and never overwritten. <em>A 2026 result stays reproducible in 2029.</em>
          </span>
        </div>
        <span className="text-[11px] font-sans font-semibold text-[#5144C9] bg-white px-2.5 py-0.5 rounded-full border border-[#D8D3FF]">
          Zero silent modifications
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#5F6368]" />
            <label className="text-xs font-semibold text-[#5F6368] font-sans">Publishing body:</label>
            <select
              value={publishingBodyFilter}
              onChange={(e) => setPublishingBodyFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5] font-sans"
            >
              <option value="All">All</option>
              <option value="CEA">CEA (Central Electricity Authority)</option>
              <option value="IPCC / DEFRA">IPCC / DEFRA</option>
              <option value="IPCC AR6">IPCC AR6</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#5F6368]" />
            <label className="text-xs font-semibold text-[#5F6368] font-sans">Financial year:</label>
            <select
              value={financialYearFilter}
              onChange={(e) => setFinancialYearFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5] font-sans"
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
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F4F5F6] border-b border-[#E5E7EB] text-[#5F6368]">
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Factor</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Value</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Unit</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Publishing Body</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Effective From</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {filteredFactors.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#FAFAFB] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#17181A]">
                  <div>{row.factor}</div>
                  {row.gwpMethodology && (
                    <div className="text-[11px] text-[#8A8F98] font-data">{row.gwpMethodology}</div>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right emission-factor font-medium text-[#17181A]">
                  {row.value}
                </td>
                <td className="py-3.5 px-4 emission-factor text-[#5F6368]">
                  {row.unit}
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#5144C9]">
                  <span className="px-2 py-0.5 rounded-full bg-[#F0EEFF] border border-[#D8D3FF] text-xs">
                    {row.publishingBody}
                  </span>
                </td>
                <td className="py-3.5 px-4 period-code text-[#5F6368]">
                  {row.effectiveFrom}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status="Approved" customLabel="Published" size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance & Functional Notes */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] space-y-1.5 shadow-2xs font-data">
        <div className="font-semibold text-[#17181A] flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#6254E8]" />
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
