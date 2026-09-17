import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  Filter,
  CheckCircle2,
  Lock,
} from 'lucide-react';

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
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Calculations & Results</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Emission Factors Reference</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/calculations/factors</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-normal text-[#171A1F]">Emission Factors Reference</h1>
              <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672] text-xs font-mono border border-[#D9DDE3] flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Read-only platform library</span>
              </span>
            </div>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Transparent, versioned reference library for the emission factors used in Tula Carbon ZE calculations.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Drill-Down (Screen 21)</span>
            </button>

            <button
              onClick={() => navigateToScreen('23_submission_queue', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] transition-colors font-medium shadow-sm"
            >
              <span>Submission Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Business Rule Banner */}
      <div className="p-3.5 bg-[#EAF2FB]/60 border border-[#2166B1]/20 rounded text-xs text-[#174A8B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#174A8B]" />
          <span>
            <strong>Core Business Rule:</strong> Emission factors are read-only, versioned by financial year, and never overwritten. <em>A 2026 result stays reproducible in 2029.</em>
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#5E6672] bg-white px-2 py-0.5 rounded border border-[#D9DDE3]">
          Zero silent modifications
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#5E6672]" />
            <label className="text-xs font-medium text-[#5E6672]">Publishing body:</label>
            <select
              value={publishingBodyFilter}
              onChange={(e) => setPublishingBodyFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            >
              <option value="All">All</option>
              <option value="CEA">CEA (Central Electricity Authority)</option>
              <option value="IPCC / DEFRA">IPCC / DEFRA</option>
              <option value="IPCC AR6">IPCC AR6</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#5E6672]" />
            <label className="text-xs font-medium text-[#5E6672]">Financial year:</label>
            <select
              value={financialYearFilter}
              onChange={(e) => setFinancialYearFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            >
              <option value="FY 2025–26">FY 2025–26 (Active)</option>
              <option value="FY 2024–25">FY 2024–25 (Historical Snapshot)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#5E6672] font-mono">
          Showing {filteredFactors.length} verified factors
        </div>
      </div>

      {/* Factor Table */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-3 px-4 font-medium">Factor</th>
              <th className="py-3 px-4 font-medium text-right">Value</th>
              <th className="py-3 px-4 font-medium">Unit</th>
              <th className="py-3 px-4 font-medium">Publishing Body</th>
              <th className="py-3 px-4 font-medium">Effective From</th>
              <th className="py-3 px-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {filteredFactors.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FB]">
                <td className="py-3.5 px-4 font-medium text-[#171A1F]">
                  <div>{row.factor}</div>
                  {row.gwpMethodology && (
                    <div className="text-[11px] text-[#858C96]">{row.gwpMethodology}</div>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-[#171A1F]">
                  {row.value}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#5E6672]">
                  {row.unit}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#174A8B]">
                  <span className="px-2 py-0.5 rounded bg-[#EAF2FB] border border-[#2166B1]/20">
                    {row.publishingBody}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#5E6672]">
                  {row.effectiveFrom}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center space-x-1 text-[#0F6B48] bg-[#E8F5E9] px-2 py-0.5 rounded text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Published</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance & Functional Notes */}
      <div className="p-4 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] space-y-1.5">
        <div className="font-medium text-[#171A1F] flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#174A8B]" />
          <span>Functional Requirements (FR-22.01 – FR-22.05):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
          <li><strong>FR-22.01:</strong> Every calculation retains the emission-factor version used at calculation time.</li>
          <li><strong>FR-22.02:</strong> Updating the platform factor library will never mutate or retroactively adjust historical calculations.</li>
          <li><strong>FR-22.03:</strong> Users cannot directly edit published factors; adjustments require new version releases with an effective date.</li>
        </ul>
      </div>
    </div>
  );
};
