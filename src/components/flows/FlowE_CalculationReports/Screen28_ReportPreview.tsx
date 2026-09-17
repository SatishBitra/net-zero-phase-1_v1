import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Download,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Printer,
  CheckCircle2,
} from 'lucide-react';

export const Screen28_ReportPreview: React.FC = () => {
  const { navigateToScreen, showToast, activeTenant } = useApp();

  const handleExportDownload = () => {
    showToast('Proceeding to Export', 'Report preview approved. Generating immutable download snapshot.');
    // Navigates to Screen 29
    navigateToScreen('29_export_download', 'FLOW_E');
  };

  return (
    <div id="screen-28-container" className="max-w-5xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Reporting</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Report Preview</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/reports/preview/88</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">
              Report Preview — GHG Inventory, FY 2025–26
            </h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Inspect generated disclosure document, accounting methodology, and breakdown tables prior to final snapshot export.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              id="btn-back-to-edit"
              onClick={() => navigateToScreen('27_report_builder', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Edit</span>
            </button>

            <button
              id="btn-export-download"
              onClick={handleExportDownload}
              className="flex items-center space-x-1.5 px-4 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] transition-colors font-medium shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export / Download</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Report Document Viewer Container (Section 17.1 & FR-28.02) */}
      <div className="bg-[#525659] p-4 sm:p-8 rounded-lg shadow-inner overflow-x-auto">
        <div className="max-w-[760px] mx-auto bg-white shadow-2xl rounded p-8 sm:p-12 text-[#171A1F] space-y-8 font-sans border border-[#D9DDE3]">
          {/* Document Cover Header */}
          <div className="border-b-2 border-[#174A8B] pb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#5E6672] uppercase">
                  Greenhouse Gas Protocol Corporate Standard
                </span>
                <h2 className="text-2xl font-bold text-[#171A1F] mt-1">
                  Annual GHG Emissions Inventory Report
                </h2>
                <div className="text-sm font-medium text-[#174A8B] mt-1">
                  Tenant: {activeTenant?.name || 'Zenith Energy Services Pvt Ltd'}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-[#EAF2FB] text-[#174A8B] text-xs font-mono font-bold border border-[#2166B1]/20">
                  DOC-GHG-2025-088
                </span>
                <div className="text-xs text-[#5E6672] mt-1">Reporting Period: FY 2025–26</div>
                <div className="text-[11px] text-[#858C96]">Generated: 20-Aug-2025 16:45 IST</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider border-b border-[#F1F3F5] pb-1">
              1. Executive Summary & Boundary Scope
            </h3>
            <p className="text-xs text-[#5E6672] leading-relaxed">
              This inventory report consolidates direct (Scope 1) and indirect (Scope 2 Location-based) greenhouse gas emissions for <strong>Zenith Energy Services Pvt Ltd</strong> across all 3 operational facilities in India under the <strong>Operational Control</strong> consolidation approach.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-center">
                <div className="text-[11px] text-[#5E6672]">Scope 1 (Direct Fuel)</div>
                <div className="text-lg font-bold text-[#171A1F] font-mono mt-0.5">412.3 tCO2e</div>
              </div>
              <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-center">
                <div className="text-[11px] text-[#5E6672]">Scope 2 (Grid Electricity)</div>
                <div className="text-lg font-bold text-[#174A8B] font-mono mt-0.5">833.5 tCO2e</div>
              </div>
              <div className="p-3 bg-[#EAF2FB]/50 border border-[#2166B1]/30 rounded text-center">
                <div className="text-[11px] text-[#174A8B] font-bold">Total Gross Emissions</div>
                <div className="text-lg font-bold text-[#174A8B] font-mono mt-0.5">1,245.8 tCO2e</div>
              </div>
            </div>
          </div>

          {/* Section 2: Methodology & Emission Factors */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider border-b border-[#F1F3F5] pb-1">
              2. Accounting Methodology & Factors Applied
            </h3>
            <div className="text-xs text-[#5E6672] space-y-1">
              <div>• <strong>Scope 1:</strong> 2.68 kgCO2e/litre for stationary diesel generator combustion (IPCC / DEFRA standard).</div>
              <div>• <strong>Scope 2:</strong> 0.708 kgCO2e/kWh for national grid electricity (Central Electricity Authority CEA CO2 Baseline Database v19, FY 2025).</div>
              <div>• <strong>GWP Metrics:</strong> IPCC Sixth Assessment Report (AR6) 100-year time horizon.</div>
            </div>
          </div>

          {/* Section 3: Facility Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider border-b border-[#F1F3F5] pb-1">
              3. Facility Breakdown Table
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-[#D9DDE3]">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                  <th className="py-2 px-3 border-r border-[#D9DDE3]">Facility / Site</th>
                  <th className="py-2 px-3 border-r border-[#D9DDE3] text-right">Scope 1 (tCO2e)</th>
                  <th className="py-2 px-3 border-r border-[#D9DDE3] text-right">Scope 2 (tCO2e)</th>
                  <th className="py-2 px-3 text-right font-bold">Total (tCO2e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DDE3]">
                <tr>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] font-medium">Chennai Plant 1</td>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] text-right font-mono">295.4</td>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] text-right font-mono">413.6</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">709.0</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] font-medium">Pune Warehouse</td>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] text-right font-mono">82.1</td>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] text-right font-mono">103.1</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">185.2</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] font-medium">Hyderabad HQ</td>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] text-right font-mono">34.8</td>
                  <td className="py-2 px-3 border-r border-[#D9DDE3] text-right font-mono">316.8</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">351.6</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Statement Area */}
          <div className="p-4 bg-[#F8F9FB] border border-[#D9DDE3] rounded space-y-1 text-xs">
            <div className="font-bold text-[#171A1F] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0F6B48]" />
              <span>Independent Verification Statement Container</span>
            </div>
            <p className="text-[11px] text-[#5E6672]">
              All underlying activity line-items are backed by primary invoices stored in TC-ARC-002. Ready for external VVB assurance via the Verifier Portal (Screen 30).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
