import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Download,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Reporting' },
          { label: 'Report Preview' },
        ]}
        title="Report Preview — GHG Inventory, FY 2025–26"
        description="Inspect generated disclosure document, accounting methodology, and breakdown tables prior to final snapshot export."
        badge={
          <StatusBadge status="Approved" customLabel="Ready for Export" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /reports/preview/88
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              id="btn-back-to-edit"
              onClick={() => navigateToScreen('27_report_builder', 'FLOW_E')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Edit</span>
            </button>

            <button
              id="btn-export-download"
              onClick={handleExportDownload}
              className="enterprise-btn-primary h-9 px-4 flex items-center space-x-1.5 text-xs shadow-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export / Download</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Report Document Viewer Container (Section 17.1 & FR-28.02) */}
      <div className="bg-[#484C52] p-4 sm:p-8 rounded-xl shadow-inner overflow-x-auto">
        <div className="max-w-[760px] mx-auto bg-white shadow-2xl rounded-xl p-8 sm:p-12 text-[#17181A] space-y-8 font-sans border border-[#E5E7EB]">
          {/* Document Cover Header */}
          <div className="border-b-2 border-[#6254E8] pb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-widest text-[#5F6368] uppercase">
                  Greenhouse Gas Protocol Corporate Standard
                </span>
                <h2 className="text-2xl font-bold text-[#17181A] mt-1 font-sans">
                  Annual GHG Emissions Inventory Report
                </h2>
                <div className="text-sm font-semibold text-[#6254E8] mt-1 font-sans">
                  Tenant: {activeTenant?.name || 'Zenith Energy Services Pvt Ltd'}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#6254E8]/10 text-[#6254E8] text-xs activity-id font-semibold border border-[#6254E8]/20">
                  DOC-GHG-2025-088
                </span>
                <div className="text-xs text-[#5F6368] mt-1 font-sans">Reporting Period: <span className="period-code font-medium">FY 2025–26</span></div>
                <div className="text-[11px] text-[#8A8F98] period-code">Generated: 20-Aug-2025 16:45 IST</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider border-b border-[#F1F3F5] pb-1 font-sans">
              1. Executive Summary & Boundary Scope
            </h3>
            <p className="text-xs text-[#5F6368] leading-relaxed font-data">
              This inventory report consolidates direct (Scope 1) and indirect (Scope 2 Location-based) greenhouse gas emissions for <strong className="text-[#17181A]">Zenith Energy Services Pvt Ltd</strong> across all 3 operational facilities in India under the <strong className="text-[#17181A]">Operational Control</strong> consolidation approach.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-center shadow-2xs">
                <div className="text-[11px] text-[#5F6368] font-sans">Scope 1 (Direct Fuel)</div>
                <div className="text-lg font-bold text-[#17181A] emission-factor mt-0.5">412.3 tCO2e</div>
              </div>
              <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-center shadow-2xs">
                <div className="text-[11px] text-[#5F6368] font-sans">Scope 2 (Grid Electricity)</div>
                <div className="text-lg font-bold text-[#6254E8] emission-factor mt-0.5">833.5 tCO2e</div>
              </div>
              <div className="p-3 bg-[#6254E8]/5 border border-[#6254E8]/30 rounded-xl text-center shadow-2xs">
                <div className="text-[11px] text-[#6254E8] font-semibold font-sans">Total Gross Emissions</div>
                <div className="text-lg font-bold text-[#6254E8] emission-factor mt-0.5">1,245.8 tCO2e</div>
              </div>
            </div>
          </div>

          {/* Section 2: Methodology & Emission Factors */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider border-b border-[#F1F3F5] pb-1 font-sans">
              2. Accounting Methodology & Factors Applied
            </h3>
            <div className="text-xs text-[#5F6368] space-y-1.5 font-data">
              <div>• <strong className="text-[#17181A]">Scope 1:</strong> <span className="emission-factor font-medium text-[#17181A]">2.68 kgCO2e/litre</span> for stationary diesel generator combustion (IPCC / DEFRA standard).</div>
              <div>• <strong className="text-[#17181A]">Scope 2:</strong> <span className="emission-factor font-medium text-[#17181A]">0.708 kgCO2e/kWh</span> for national grid electricity (Central Electricity Authority CEA CO2 Baseline Database v19, FY 2025).</div>
              <div>• <strong className="text-[#17181A]">GWP Metrics:</strong> IPCC Sixth Assessment Report (AR6) 100-year time horizon.</div>
            </div>
          </div>

          {/* Section 3: Facility Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider border-b border-[#F1F3F5] pb-1 font-sans">
              3. Facility Breakdown Table
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-[#E5E7EB] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#F4F5F6] border-b border-[#E5E7EB] text-[#5F6368]">
                  <th className="py-2.5 px-3 border-r border-[#E5E7EB] font-semibold text-[11px] uppercase tracking-wider">Facility / Site</th>
                  <th className="py-2.5 px-3 border-r border-[#E5E7EB] text-right font-semibold text-[11px] uppercase tracking-wider">Scope 1 (tCO2e)</th>
                  <th className="py-2.5 px-3 border-r border-[#E5E7EB] text-right font-semibold text-[11px] uppercase tracking-wider">Scope 2 (tCO2e)</th>
                  <th className="py-2.5 px-3 text-right font-semibold text-[11px] uppercase tracking-wider">Total (tCO2e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr className="hover:bg-[#FAFAFB]">
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-semibold text-[#17181A]">Chennai Plant 1</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-right emission-factor text-[#5F6368]">295.4</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-right emission-factor text-[#5F6368]">413.6</td>
                  <td className="py-2.5 px-3 text-right emission-factor font-semibold text-[#17181A]">709.0</td>
                </tr>
                <tr className="hover:bg-[#FAFAFB]">
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-semibold text-[#17181A]">Pune Warehouse</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-right emission-factor text-[#5F6368]">82.1</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-right emission-factor text-[#5F6368]">103.1</td>
                  <td className="py-2.5 px-3 text-right emission-factor font-semibold text-[#17181A]">185.2</td>
                </tr>
                <tr className="hover:bg-[#FAFAFB]">
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-semibold text-[#17181A]">Hyderabad HQ</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-right emission-factor text-[#5F6368]">34.8</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-right emission-factor text-[#5F6368]">316.8</td>
                  <td className="py-2.5 px-3 text-right emission-factor font-semibold text-[#17181A]">351.6</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Statement Area */}
          <div className="p-4 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl space-y-1 text-xs shadow-2xs font-data">
            <div className="font-semibold text-[#17181A] flex items-center space-x-1.5 font-sans">
              <ShieldCheck className="w-4 h-4 text-[#0F6B48]" />
              <span>Independent Verification Statement Container</span>
            </div>
            <p className="text-[11px] text-[#5F6368]">
              All underlying activity line-items are backed by primary invoices stored in TC-ARC-002. Ready for external VVB assurance via the Verifier Portal (Screen 30).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
