import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Building2,
  FileText,
  Layers,
  Search,
  BookOpen,
} from 'lucide-react';

interface SiteDrillDownRow {
  siteId: string;
  siteName: string;
  activityRows: number;
  totalKwh: number;
  emissionFactor: string;
  factorValue: number;
  tCO2e: number;
  contributingRecords: Array<{
    id: string;
    date: string;
    quantity: number;
    evidence: string;
    tCO2e: number;
  }>;
}

export const Screen21_ResultsDrillDown: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  // Selected site for detailed activity record breakdown
  const [expandedSite, setExpandedSite] = useState<string | null>('Chennai Plant 1');

  // Exact data from Screen 21 PRD specification
  const drillDownData: SiteDrillDownRow[] = [
    {
      siteId: 'site-chennai-1',
      siteName: 'Chennai Plant 1',
      activityRows: 312,
      totalKwh: 584200,
      emissionFactor: '0.708 kg/kWh (CEA, FY25)',
      factorValue: 0.708,
      tCO2e: 413.6,
      contributingRecords: [
        { id: 'ACT-2025-0812', date: '12-Aug-2025', quantity: 48200, evidence: 'TANGEDCO_HT_Bill_Jul_2025.pdf', tCO2e: 34.13 },
        { id: 'ACT-2025-0715', date: '15-Jul-2025', quantity: 49100, evidence: 'TANGEDCO_HT_Bill_Jun_2025.pdf', tCO2e: 34.76 },
        { id: 'ACT-2025-0610', date: '10-Jun-2025', quantity: 47900, evidence: 'TANGEDCO_HT_Bill_May_2025.pdf', tCO2e: 33.91 },
      ],
    },
    {
      siteId: 'site-pune-2',
      siteName: 'Pune Warehouse',
      activityRows: 98,
      totalKwh: 145600,
      emissionFactor: '0.708 kg/kWh (CEA, FY25)',
      factorValue: 0.708,
      tCO2e: 103.1,
      contributingRecords: [
        { id: 'ACT-2025-0814', date: '14-Aug-2025', quantity: 12400, evidence: 'MSEDCL_Invoice_Jul_2025.pdf', tCO2e: 8.78 },
        { id: 'ACT-2025-0712', date: '12-Jul-2025', quantity: 11800, evidence: 'MSEDCL_Invoice_Jun_2025.pdf', tCO2e: 8.35 },
      ],
    },
  ];

  const totalEmissions = drillDownData.reduce((acc, row) => acc + row.tCO2e, 0);
  const totalKwh = drillDownData.reduce((acc, row) => acc + row.totalKwh, 0);
  const totalRows = drillDownData.reduce((acc, row) => acc + row.activityRows, 0);

  const handleRowClick = (siteName: string) => {
    setExpandedSite(expandedSite === siteName ? null : siteName);
  };

  const handleInspectRecord = (recordId: string) => {
    showToast('Inspecting Activity Record', `Opening detailed audit trail for record ${recordId}.`);
    navigateToScreen('15_fix_detail_view', 'FLOW_C');
  };

  const handleInspectEvidence = (evidenceName: string) => {
    showToast('Evidence Repository', `Retrieving original document: ${evidenceName}`);
    navigateToScreen('16_attach_evidence', 'FLOW_B');
  };

  return (
    <div id="screen-21-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Calculations & Results</span>
              <span>›</span>
              <span>Grid Electricity (Scope 2)</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Drill-Down</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/calculations/results/scope2/grid-electricity</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">
              Drill-Down — Grid Electricity, Scope 2
            </h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Allowing users to move from aggregated carbon results into underlying site and activity-level entries.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Runs (Screen 20)</span>
            </button>

            <button
              onClick={() => navigateToScreen('22_factors_reference', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] transition-colors font-medium shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Emission Factors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Product Principle Banner */}
      <div className="p-3.5 bg-[#EAF2FB]/60 border border-[#2166B1]/20 rounded text-xs text-[#174A8B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#174A8B]" />
          <span>
            <strong>Primary Product Principle:</strong> Every number should have a path.
            Trace from result → site → activity rows → individual record → source evidence.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#5E6672] hidden sm:inline-block">
          FY 2025–26 · Location-based
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#5E6672]">Contributing Scope 2 Total</div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {totalEmissions.toFixed(1)} <span className="text-sm font-normal text-[#5E6672]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Sum of all site contributions</div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#5E6672]">Total Grid Electricity</div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {totalKwh.toLocaleString()} <span className="text-sm font-normal text-[#5E6672]">kWh</span>
          </div>
          <div className="text-[11px] text-[#858C96] mt-0.5">2 contributing facilities</div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#5E6672]">Total Contributing Activity Rows</div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {totalRows} <span className="text-sm font-normal text-[#5E6672]">rows</span>
          </div>
          <div className="text-[11px] text-[#858C96] mt-0.5">100% verified with attached primary evidence</div>
        </div>
      </div>

      {/* Site Breakdown Table */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden">
        <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-[#171A1F]">Contributing Sites Breakdown</h2>
            <p className="text-xs text-[#5E6672]">
              Click a row to trace to individual activity data entries and their source documents.
            </p>
          </div>
          <span className="text-xs font-mono text-[#5E6672]">
            {drillDownData.length} sites contributing
          </span>
        </div>

        {drillDownData.length === 0 ? (
          <div className="p-8 text-center space-y-1">
            <div className="text-sm font-medium text-[#171A1F]">No activity data found</div>
            <div className="text-xs text-[#5E6672]">There are no activity entries contributing to this result.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                  <th className="py-2.5 px-4 font-medium">Site</th>
                  <th className="py-2.5 px-4 font-medium text-right">Activity Rows</th>
                  <th className="py-2.5 px-4 font-medium text-right">Total kWh</th>
                  <th className="py-2.5 px-4 font-medium">Emission Factor</th>
                  <th className="py-2.5 px-4 font-medium text-right">tCO2e</th>
                  <th className="py-2.5 px-4 font-medium text-center">Trace Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {drillDownData.map((row) => {
                  const isExpanded = expandedSite === row.siteName;
                  return (
                    <React.Fragment key={row.siteId}>
                      <tr
                        onClick={() => handleRowClick(row.siteName)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? 'bg-[#EAF2FB]/30' : 'hover:bg-[#F8F9FB]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-[#171A1F] flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-[#174A8B] shrink-0" />
                          <span>{row.siteName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[#5E6672]">
                          {row.activityRows}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-[#171A1F]">
                          {row.totalKwh.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#5E6672]">
                          {row.emissionFactor}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#174A8B]">
                          {row.tCO2e.toFixed(1)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-xs text-[#174A8B] hover:underline font-medium inline-flex items-center space-x-1">
                            <span>{isExpanded ? 'Hide trail' : 'Trace lineage'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Activity Data Lineage Trail */}
                      {isExpanded && (
                        <tr className="bg-[#F8F9FB]/80 border-b border-[#D9DDE3]">
                          <td colSpan={6} className="p-4 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-[#171A1F]">
                                Line-Item Sample Trail for {row.siteName} (Showing latest activity records)
                              </span>
                              <span className="text-[11px] text-[#5E6672] font-mono">
                                Total entries: {row.activityRows}
                              </span>
                            </div>

                            <div className="border border-[#D9DDE3] rounded bg-white overflow-hidden">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-[#F1F3F5] text-[#5E6672] border-b border-[#D9DDE3]">
                                    <th className="py-2 px-3 font-medium">Record ID</th>
                                    <th className="py-2 px-3 font-medium">Activity Date</th>
                                    <th className="py-2 px-3 font-medium text-right">Quantity (kWh)</th>
                                    <th className="py-2 px-3 font-medium">Primary Evidence</th>
                                    <th className="py-2 px-3 font-medium text-right">Emissions (tCO2e)</th>
                                    <th className="py-2 px-3 font-medium text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F3F5]">
                                  {row.contributingRecords.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-[#F8F9FB]">
                                      <td className="py-2 px-3 font-mono font-medium text-[#174A8B]">
                                        {rec.id}
                                      </td>
                                      <td className="py-2 px-3 font-mono text-[#5E6672]">
                                        {rec.date}
                                      </td>
                                      <td className="py-2 px-3 text-right font-mono">
                                        {rec.quantity.toLocaleString()}
                                      </td>
                                      <td className="py-2 px-3 font-mono text-xs text-[#174A8B] flex items-center space-x-1">
                                        <FileText className="w-3.5 h-3.5 shrink-0 text-[#858C96]" />
                                        <button
                                          type="button"
                                          onClick={() => handleInspectEvidence(rec.evidence)}
                                          className="hover:underline text-left"
                                        >
                                          {rec.evidence}
                                        </button>
                                      </td>
                                      <td className="py-2 px-3 text-right font-mono font-medium text-[#171A1F]">
                                        {rec.tCO2e.toFixed(2)}
                                      </td>
                                      <td className="py-2 px-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => handleInspectRecord(rec.id)}
                                          className="text-xs text-[#174A8B] hover:underline inline-flex items-center space-x-0.5"
                                        >
                                          <span>Inspect Row</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Traceability Guarantee Footnote */}
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] flex items-start space-x-2">
        <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
        <div>
          <strong>Functional Traceability:</strong> Results drill-down is read-only. Clicking any site row reveals the contributing activity data rows with direct links to primary PDF utility invoices stored in TC-ARC-002, allowing third-party verifiers to validate data lineage without interruption.
        </div>
      </div>
    </div>
  );
};
