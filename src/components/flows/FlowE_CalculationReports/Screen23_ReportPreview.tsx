import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const Screen23_ReportPreview: React.FC = () => {
  const { currentTenant, activePeriod, navigateToScreen, showToast } = useApp();

  const handleDownloadPdf = () => {
    showToast('Download Started', 'BRSR_Principle6_Assurance_Report_FY2025_26.pdf generated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <button
            onClick={() => navigateToScreen('22_report_builder', 'FLOW_E')}
            className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Builder</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 23 · Flow E (Step 4 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Assurance Package Preview</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Report Preview & Sign-off</h1>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#171A1F] rounded-md transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5E6672]" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => navigateToScreen('28_verifier_evidence_trace', 'FLOW_F')}
            className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>Proceed to Verifier Evidence Trace (Flow F)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Report Document Sheet */}
      <div className="p-8 sm:p-12 bg-white border border-[#D9DDE3] rounded-lg shadow-sm font-sans space-y-8 text-[#171A1F]">
        {/* Document Header */}
        <div className="border-b border-[#D9DDE3] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-[#174A8B] uppercase tracking-wider mb-1">
              Statutory ESG Disclosure · SEBI BRSR Principle 6
            </div>
            <h2 className="text-2xl font-normal tracking-tight text-[#171A1F]">
              Greenhouse Gas Emissions Inventory Statement
            </h2>
            <div className="text-xs text-[#5E6672] mt-1">
              Reporting Window: <span className="font-semibold text-[#171A1F]">01-Apr-2025 to 31-Mar-2026 (FY 2025–26)</span>
            </div>
          </div>

          <div className="text-right text-xs text-[#5E6672] font-mono">
            <div className="font-bold text-sm text-[#174A8B]">TULA CARBON ASSURANCE</div>
            <div>Doc ID: TULA-BRSR-2025-09-16</div>
            <div>Generated: 2026-09-16 21:45 UTC</div>
          </div>
        </div>

        {/* Entity & Boundary Information */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F9FB] rounded-lg border border-[#D9DDE3] text-xs">
          <div>
            <span className="text-[#858C96] block text-[10px]">Reporting Entity</span>
            <span className="font-semibold text-[#171A1F]">{currentTenant.legalEntityName}</span>
          </div>
          <div>
            <span className="text-[#858C96] block text-[10px]">CIN / Registration</span>
            <span className="font-mono text-[#171A1F]">{currentTenant.registrationNo}</span>
          </div>
          <div>
            <span className="text-[#858C96] block text-[10px]">Consolidation Boundary</span>
            <span className="text-[#171A1F]">{currentTenant.consolidationApproach}</span>
          </div>
          <div>
            <span className="text-[#858C96] block text-[10px]">Operational Facilities</span>
            <span className="text-[#171A1F]">3 Covered Sites</span>
          </div>
        </div>

        {/* Executive Summary Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#171A1F] uppercase tracking-wider">
            1. Total Greenhouse Gas Emissions (Metric Tonnes CO2 Equivalent)
          </h3>

          <div className="border border-[#D9DDE3] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                  <th className="py-2.5 px-4 font-medium">Emission Scope & Source</th>
                  <th className="py-2.5 px-4 font-medium">Accounting Methodology</th>
                  <th className="py-2.5 px-4 font-medium text-right">FY 2024–25 (Baseline)</th>
                  <th className="py-2.5 px-4 font-medium text-right font-bold text-[#171A1F]">
                    FY 2025–26 (Current)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                <tr>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">
                    Scope 1: Direct emissions (DG fuel, vehicles, refrigerants)
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">DEFRA / IPCC Fuel Combustion</td>
                  <td className="py-3 px-4 text-right font-mono text-[#5E6672]">2,540.0 tCO2e</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[#171A1F]">
                    2,420.0 tCO2e
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">
                    Scope 2: Indirect electricity emissions (Location-based)
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">CEA Baseline Database v19 (0.82 kg/kWh)</td>
                  <td className="py-3 px-4 text-right font-mono text-[#5E6672]">7,180.0 tCO2e</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[#171A1F]">
                    6,840.0 tCO2e
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">
                    Scope 3: Selected upstream activities (Business travel)
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">ICAO Flight Carbon Methodology</td>
                  <td className="py-3 px-4 text-right font-mono text-[#5E6672]">1,115.0 tCO2e</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[#171A1F]">
                    1,120.0 tCO2e
                  </td>
                </tr>
                <tr className="bg-[#F8F9FB] font-semibold">
                  <td className="py-3 px-4 text-[#174A8B]">Total Gross Emissions (Scope 1 + 2 + 3)</td>
                  <td className="py-3 px-4 text-[#5E6672]">Deterministic Aggregation</td>
                  <td className="py-3 px-4 text-right font-mono text-[#5E6672]">10,835.0 tCO2e</td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-[#174A8B]">
                    10,380.0 tCO2e
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Facility Disclosures */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#171A1F] uppercase tracking-wider">
            2. Operational Site Attribution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 border border-[#D9DDE3] rounded-lg">
              <div className="font-semibold text-[#171A1F]">Chennai Plant 1</div>
              <div className="text-[11px] text-[#5E6672] mt-0.5">Manufacturing & Assembly</div>
              <div className="text-base font-mono font-semibold text-[#174A8B] mt-2">
                6,435.6 tCO2e
              </div>
              <div className="text-[10px] text-[#858C96] mt-0.5">62.0% of total footprint</div>
            </div>

            <div className="p-3.5 border border-[#D9DDE3] rounded-lg">
              <div className="font-semibold text-[#171A1F]">Pune Warehouse</div>
              <div className="text-[11px] text-[#5E6672] mt-0.5">Storage & Logistics Hub</div>
              <div className="text-base font-mono font-semibold text-[#174A8B] mt-2">
                2,906.4 tCO2e
              </div>
              <div className="text-[10px] text-[#858C96] mt-0.5">28.0% of total footprint</div>
            </div>

            <div className="p-3.5 border border-[#D9DDE3] rounded-lg">
              <div className="font-semibold text-[#171A1F]">Hyderabad HQ</div>
              <div className="text-[11px] text-[#5E6672] mt-0.5">Corporate Office</div>
              <div className="text-base font-mono font-semibold text-[#174A8B] mt-2">
                1,038.0 tCO2e
              </div>
              <div className="text-[10px] text-[#858C96] mt-0.5">10.0% of total footprint</div>
            </div>
          </div>
        </div>

        {/* Sign-off & Audit Trail Signature Block */}
        <div className="border-t border-[#D9DDE3] pt-6 space-y-4">
          <h3 className="text-xs font-semibold text-[#5E6672] uppercase tracking-wider">
            3. Governance & Verification Attestations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded space-y-2">
              <div className="text-[10px] text-[#858C96] uppercase">Prepared By:</div>
              <div className="font-semibold text-[#171A1F]">J. Rao</div>
              <div className="text-[11px] text-[#5E6672]">Tenant Admin · ESG Operations</div>
              <div className="text-[10px] text-[#174A8B] font-mono">Digitally signed · 2026-09-16</div>
            </div>

            <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded space-y-2">
              <div className="text-[10px] text-[#858C96] uppercase">Internal Approver:</div>
              <div className="font-semibold text-[#171A1F]">S. Iyer</div>
              <div className="text-[11px] text-[#5E6672]">VP Sustainability · Reviewer</div>
              <div className="text-[10px] text-[#174A8B] font-mono">Approved · 2026-09-16</div>
            </div>

            <div className="p-3 bg-[#EAF2FB]/40 border border-[#2166B1]/20 rounded space-y-2">
              <div className="text-[10px] text-[#174A8B] uppercase font-semibold">Independent VVB Verifier:</div>
              <div className="font-semibold text-[#171A1F]">M. Singh (Lead Verifier)</div>
              <div className="text-[11px] text-[#5E6672]">Partner VVB Services India</div>
              <div className="text-[10px] text-[#2166B1] font-mono">Assurance in progress →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
