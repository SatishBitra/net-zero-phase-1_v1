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
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Results', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Grid Electricity (Scope 2)' },
          { label: 'Drill-Down' },
        ]}
        title="Drill-Down — Grid Electricity, Scope 2"
        description="Allowing users to move from aggregated carbon results into underlying site and activity-level entries."
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /calculations/results/scope2/grid-electricity
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Runs (Screen 20)</span>
            </button>

            <button
              onClick={() => navigateToScreen('22_factors_reference', 'FLOW_E')}
              className="enterprise-btn-primary h-9 px-3.5 flex items-center space-x-1.5 text-xs shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Emission Factors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Core Product Principle Banner */}
      <div className="p-3.5 bg-[#F0EEFF] border border-[#D8D3FF] rounded-xl text-xs text-[#5144C9] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#6254E8]" />
          <span>
            <strong className="font-semibold text-[#17181A]">Primary Product Principle:</strong> Every number should have a path.
            Trace from result → site → activity rows → individual record → source evidence.
          </span>
        </div>
        <span className="period-code text-[11px] text-[#5F6368] font-medium hidden sm:inline-block">
          FY 2025–26 · Location-based
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Contributing Scope 2 Total"
          value={`${totalEmissions.toFixed(1)} tCO2e`}
          subtext="Sum of all site contributions"
        />

        <KpiCard
          label="Total Grid Electricity"
          value={`${totalKwh.toLocaleString()} kWh`}
          subtext="2 contributing facilities"
        />

        <KpiCard
          label="Total Activity Rows"
          value={`${totalRows} rows`}
          subtext="100% verified with primary evidence"
        />
      </div>

      {/* Site Breakdown Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#17181A] font-sans">Contributing Sites Breakdown</h2>
            <p className="text-xs text-[#5F6368] font-data">
              Click a row to trace to individual activity data entries and their source documents.
            </p>
          </div>
          <span className="text-xs font-medium text-[#5F6368]">
            {drillDownData.length} sites contributing
          </span>
        </div>

        {drillDownData.length === 0 ? (
          <div className="p-8 text-center space-y-1">
            <div className="text-sm font-semibold text-[#17181A]">No activity data found</div>
            <div className="text-xs text-[#5F6368] font-data">There are no activity entries contributing to this result.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F5F6] border-b border-[#E5E7EB] text-[#5F6368]">
                  <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Site</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Activity Rows</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Total kWh</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Emission Factor</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">tCO2e</th>
                  <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-center">Trace Path</th>
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
                          isExpanded ? 'bg-[#F0EEFF]/40' : 'hover:bg-[#FAFAFB]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-[#17181A] flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-[#6254E8] shrink-0" />
                          <span>{row.siteName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right period-code text-[#5F6368]">
                          {row.activityRows}
                        </td>
                        <td className="py-3.5 px-4 text-right period-code font-medium text-[#17181A]">
                          {row.totalKwh.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 emission-factor text-xs text-[#5F6368]">
                          {row.emissionFactor}
                        </td>
                        <td className="py-3.5 px-4 text-right emission-factor font-medium text-[#6254E8]">
                          {row.tCO2e.toFixed(1)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-xs text-[#6254E8] hover:underline font-semibold inline-flex items-center space-x-1">
                            <span>{isExpanded ? 'Hide trail' : 'Trace lineage'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Activity Data Lineage Trail */}
                      {isExpanded && (
                        <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB]">
                          <td colSpan={6} className="p-4 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#17181A]">
                                Line-Item Sample Trail for {row.siteName} (Showing latest activity records)
                              </span>
                              <span className="text-[11px] text-[#5F6368] period-code">
                                Total entries: {row.activityRows}
                              </span>
                            </div>

                            <div className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-2xs">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-[#F4F5F6] text-[#5F6368] border-b border-[#E5E7EB]">
                                    <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider">Record ID</th>
                                    <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider">Activity Date</th>
                                    <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider text-right">Quantity (kWh)</th>
                                    <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider">Primary Evidence</th>
                                    <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider text-right">Emissions (tCO2e)</th>
                                    <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F3F5]">
                                  {row.contributingRecords.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-[#FAFAFB]">
                                      <td className="py-2 px-3 activity-id font-medium text-[#6254E8]">
                                        {rec.id}
                                      </td>
                                      <td className="py-2 px-3 period-code text-[#5F6368]">
                                        {rec.date}
                                      </td>
                                      <td className="py-2 px-3 text-right period-code">
                                        {rec.quantity.toLocaleString()}
                                      </td>
                                      <td className="py-2 px-3 file-hash text-xs text-[#5144C9] flex items-center space-x-1">
                                        <FileText className="w-3.5 h-3.5 shrink-0 text-[#8A8F98]" />
                                        <button
                                          type="button"
                                          onClick={() => handleInspectEvidence(rec.evidence)}
                                          className="hover:underline text-left"
                                        >
                                          {rec.evidence}
                                        </button>
                                      </td>
                                      <td className="py-2 px-3 text-right emission-factor font-medium text-[#17181A]">
                                        {rec.tCO2e.toFixed(2)}
                                      </td>
                                      <td className="py-2 px-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => handleInspectRecord(rec.id)}
                                          className="text-xs text-[#6254E8] hover:underline inline-flex items-center space-x-0.5 font-semibold"
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
      <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2.5 shadow-2xs font-data">
        <Info className="w-4 h-4 text-[#6254E8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#17181A] font-semibold">Functional Traceability:</strong> Results drill-down is read-only. Clicking any site row reveals the contributing activity data rows with direct links to primary PDF utility invoices stored in TC-ARC-002, allowing third-party verifiers to validate data lineage without interruption.
        </div>
      </div>
    </div>
  );
};
