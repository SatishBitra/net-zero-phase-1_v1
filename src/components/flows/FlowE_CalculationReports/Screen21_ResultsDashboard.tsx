import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  BarChart3,
  PieChart,
  Calendar,
  Building,
  ArrowRight,
  ArrowLeft,
  Download,
  FileCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const Screen21_ResultsDashboard: React.FC = () => {
  const { activePeriod, sites, navigateToScreen } = useApp();

  const [periodFilter, setPeriodFilter] = useState('FY 2025–26');

  // Emission stats from PRD specs
  const scope1 = 2420.0;
  const scope2 = 6840.0;
  const scope3 = 1120.0;
  const totalEmissions = 10380.0;

  const siteBreakdown = [
    { name: 'Chennai Plant 1', tCO2e: 6435.6, percent: 62 },
    { name: 'Pune Warehouse', tCO2e: 2906.4, percent: 28 },
    { name: 'Hyderabad HQ', tCO2e: 1038.0, percent: 10 },
  ];

  const sourceBreakdown = [
    { name: 'Grid Electricity (TANGEDCO / MSEDCL)', scope: 'Scope 2', tCO2e: 6840.0, percent: 65.9 },
    { name: 'Diesel Generators (Stationary combustion)', scope: 'Scope 1', tCO2e: 1920.0, percent: 18.5 },
    { name: 'Company Vehicle Transport (Mobile fuel)', scope: 'Scope 1', tCO2e: 450.0, percent: 4.3 },
    { name: 'Refrigerant Fugitive Top-up (R-410A)', scope: 'Scope 1', tCO2e: 50.0, percent: 0.5 },
    { name: 'Business Travel & Commute', scope: 'Scope 3', tCO2e: 1120.0, percent: 10.8 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <button
            onClick={() => navigateToScreen('20_calculation_runs', 'FLOW_E')}
            className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Calculation Runs</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 21 · Flow E (Step 2 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Emissions Intelligence</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Emissions Results Dashboard</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            GHG Protocol inventory totals across scopes, operational facilities, and emission sources for {periodFilter}.
          </p>
        </div>

        {/* Action to proceed to Report Builder */}
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => navigateToScreen('22_report_builder', 'FLOW_E')}
            className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>Configure Report Export (Screen 22)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scope Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emissions */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg">
          <div className="text-xs text-[#5E6672]">Total Gross Emissions</div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {totalEmissions.toLocaleString()} <span className="text-xs font-sans text-[#858C96]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#174A8B] mt-1 flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-4.2% vs baseline FY 2024–25</span>
          </div>
        </div>

        {/* Scope 1 */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg">
          <div className="text-xs text-[#B42318] flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B42318]" />
            <span>Scope 1 (Direct)</span>
          </div>
          <div className="text-xl font-normal text-[#171A1F] font-mono mt-1">
            {scope1.toLocaleString()} <span className="text-xs font-sans text-[#858C96]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#858C96] mt-1">
            23.3% of total inventory
          </div>
        </div>

        {/* Scope 2 */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg">
          <div className="text-xs text-[#174A8B] flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#174A8B]" />
            <span>Scope 2 (Electricity)</span>
          </div>
          <div className="text-xl font-normal text-[#171A1F] font-mono mt-1">
            {scope2.toLocaleString()} <span className="text-xs font-sans text-[#858C96]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#858C96] mt-1">
            65.9% of total inventory (Location-based)
          </div>
        </div>

        {/* Scope 3 */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg">
          <div className="text-xs text-[#5E6672] flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5E6672]" />
            <span>Scope 3 (Value Chain)</span>
          </div>
          <div className="text-xl font-normal text-[#171A1F] font-mono mt-1">
            {scope3.toLocaleString()} <span className="text-xs font-sans text-[#858C96]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#858C96] mt-1">
            10.8% of total inventory
          </div>
        </div>
      </div>

      {/* Breakdown Section: Site Distribution & Source Categorization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Facility Site */}
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-medium text-[#171A1F]">Emissions by Operational Site</h2>
            <span className="text-xs text-[#858C96]">3 facilities</span>
          </div>

          <div className="space-y-3.5">
            {siteBreakdown.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#171A1F]">{s.name}</span>
                  <span className="font-mono text-[#5E6672]">
                    {s.tCO2e.toLocaleString()} tCO2e ({s.percent}%)
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-2 bg-[#F1F3F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#174A8B] rounded-full transition-all duration-500"
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-xs text-[#5E6672]">
            Chennai Plant 1 represents the largest operational footprint due to heavy continuous manufacturing loads and grid electricity draw.
          </div>
        </div>

        {/* By Emission Source */}
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-medium text-[#171A1F]">Emissions by Source Category</h2>
            <span className="text-xs text-[#858C96]">5 activity types</span>
          </div>

          <div className="space-y-3">
            {sourceBreakdown.map((src, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F1F3F5]">
                <div>
                  <div className="font-medium text-[#171A1F]">{src.name}</div>
                  <span className="text-[10px] text-[#858C96]">{src.scope}</span>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[#171A1F] font-medium">{src.tCO2e.toLocaleString()} tCO2e</div>
                  <span className="text-[11px] text-[#5E6672]">{src.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
