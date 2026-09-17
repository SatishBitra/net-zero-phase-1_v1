import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen27_ReportBuilder: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  const [reportingPeriod, setReportingPeriod] = useState('FY 2025–26');
  const [reportType, setReportType] = useState('GHG Inventory (Scope 1+2)');
  const [sitesIncluded, setSitesIncluded] = useState('All Sites');
  const [format, setFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    showToast('Validating Scope', 'Compiling versioned calculation data for GHG Inventory report...');

    setTimeout(() => {
      setIsGenerating(false);
      showToast('Preview Ready', 'Navigating to Screen 28 Report Preview.');
      // Navigates to Screen 28
      navigateToScreen('28_report_preview', 'FLOW_E');
    }, 700);
  };

  return (
    <div id="screen-27-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Reporting' },
          { label: 'Report Builder' },
        ]}
        title="Report Builder"
        description="Define the reporting period, report standard, facility coverage, and export format before generating preview."
        badge={
          <StatusBadge status="Active" customLabel="Phase 1 Ready" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /reports/new
          </span>
        }
        actions={
          <button
            onClick={() => navigateToScreen('26_period_lock', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Period Lock</span>
          </button>
        }
      />

      {/* Scope Guidance Panel (Section 16.2) */}
      <div className="p-3.5 bg-[#FEF0C7]/40 border border-[#F79009]/30 rounded-xl text-xs text-[#7A271A] flex items-start space-x-2.5 shadow-2xs font-data">
        <Info className="w-4 h-4 text-[#B54708] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[#17181A]">Product Scope Guidance:</strong> PCAF, ISO 14067, CBAM and CCTS report types are Phase 2/3 — <strong>GHG Inventory</strong> is the Phase 1 output.
        </div>
      </div>

      {/* Form Structure (Section 16.1 & FR-27.01 - FR-27.04) */}
      <form onSubmit={handleGeneratePreview} className="space-y-6">
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-semibold text-[#17181A] font-sans">Report Parameters</h2>
            <StatusBadge status="Approved" customLabel="Locked Period Data Active" size="sm" />
          </div>

          {/* Reporting Period */}
          <div>
            <label className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
              Reporting period <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <select
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5] font-sans"
              >
                <option value="FY 2025–26">FY 2025–26 (Apr 2025 – Mar 2026) — Default</option>
                <option value="FY 2024–25">FY 2024–25 (Historical Snapshot)</option>
              </select>
            </div>
            <p className="text-[11px] text-[#5F6368] mt-1 font-data">
              Uses the relevant locked and versioned calculation ledger.
            </p>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
              Report type <span className="text-[#D92D20]">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5] font-sans"
            >
              <option value="GHG Inventory (Scope 1+2)">
                GHG Inventory (Scope 1+2) — Phase 1 Standard
              </option>
              <option value="SEBI BRSR Core Principal" disabled>
                SEBI BRSR Core Principles (Phase 2)
              </option>
              <option value="CBAM" disabled>
                EU CBAM Declaration (Phase 2)
              </option>
              <option value="ISO 14067" disabled>
                ISO 14067 Carbon Footprint (Phase 3)
              </option>
            </select>
          </div>

          {/* Sites Included */}
          <div>
            <label className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
              Sites included <span className="text-[#D92D20]">*</span>
            </label>
            <select
              value={sitesIncluded}
              onChange={(e) => setSitesIncluded(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5] font-sans"
            >
              <option value="All Sites">All Sites (Chennai Plant 1, Pune Warehouse, Hyderabad HQ)</option>
              <option value="Chennai Plant 1">Chennai Plant 1 Only</option>
              <option value="Pune Warehouse">Pune Warehouse Only</option>
              <option value="Hyderabad HQ">Hyderabad HQ Only</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
              Format <span className="text-[#D92D20]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 border rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                  format === 'PDF' ? 'border-[#6254E8] bg-[#6254E8]/5 shadow-2xs' : 'border-[#E5E7EB] hover:bg-[#FAFAFB]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="PDF"
                  checked={format === 'PDF'}
                  onChange={() => setFormat('PDF')}
                  className="text-[#6254E8] accent-[#6254E8]"
                />
                <div>
                  <div className="text-xs font-semibold text-[#17181A] font-sans">PDF Document</div>
                  <div className="text-[11px] text-[#5F6368] font-data">
                    Formal audit-ready disclosure format with cryptographic timestamp
                  </div>
                </div>
              </label>

              <label
                className={`p-3 border rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                  format === 'Excel' ? 'border-[#6254E8] bg-[#6254E8]/5 shadow-2xs' : 'border-[#E5E7EB] hover:bg-[#FAFAFB]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="Excel"
                  checked={format === 'Excel'}
                  onChange={() => setFormat('Excel')}
                  className="text-[#6254E8] accent-[#6254E8]"
                />
                <div>
                  <div className="text-xs font-semibold text-[#17181A] font-sans">Excel / CSV Workbook</div>
                  <div className="text-[11px] text-[#5F6368] font-data">
                    Tabular activity records with emission factors applied
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Primary Action (Section 16.3 & FR-27.05) */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
            className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            id="btn-generate-preview"
            type="submit"
            disabled={isGenerating}
            className="enterprise-btn-primary h-9 px-6 text-xs inline-flex items-center space-x-2 shadow-xs font-semibold disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Validating & Compiling…' : 'Generate Preview'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
