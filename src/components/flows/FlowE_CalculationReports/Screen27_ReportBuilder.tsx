import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Calendar,
  Building2,
  FileDown,
  Info,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

export const Screen27_ReportBuilder: React.FC = () => {
  const { sites, navigateToScreen, showToast } = useApp();

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
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Reporting</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Report Builder</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/reports/new</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Report Builder</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Define the reporting period, report standard, facility coverage, and export format before generating preview.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('26_period_lock', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Period Lock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scope Guidance Panel (Section 16.2) */}
      <div className="p-3.5 bg-[#FEF0C7]/40 border border-[#F79009]/30 rounded text-xs text-[#7A271A] flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-[#B54708] shrink-0 mt-0.5" />
        <div>
          <strong>Product Scope Guidance:</strong> PCAF, ISO 14067, CBAM and CCTS report types are Phase 2/3 — <strong>GHG Inventory</strong> is the Phase 1 output.
        </div>
      </div>

      {/* Form Structure (Section 16.1 & FR-27.01 - FR-27.04) */}
      <form onSubmit={handleGeneratePreview} className="space-y-6">
        <div className="p-6 bg-white border border-[#D9DDE3] rounded space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-medium text-[#171A1F]">Report Parameters</h2>
            <span className="text-[11px] font-mono text-[#0F6B48] bg-[#E8F5E9] px-2 py-0.5 rounded">
              Locked Period Data Active
            </span>
          </div>

          {/* Reporting Period */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Reporting period <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <select
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
              >
                <option value="FY 2025–26">FY 2025–26 (Apr 2025 – Mar 2026) — Default</option>
                <option value="FY 2024–25">FY 2024–25 (Historical Snapshot)</option>
              </select>
            </div>
            <p className="text-[11px] text-[#5E6672] mt-1">
              Uses the relevant locked and versioned calculation ledger.
            </p>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Report type <span className="text-[#D92D20]">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
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
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Sites included <span className="text-[#D92D20]">*</span>
            </label>
            <select
              value={sitesIncluded}
              onChange={(e) => setSitesIncluded(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            >
              <option value="All Sites">All Sites (Chennai Plant 1, Pune Warehouse, Hyderabad HQ)</option>
              <option value="Chennai Plant 1">Chennai Plant 1 Only</option>
              <option value="Pune Warehouse">Pune Warehouse Only</option>
              <option value="Hyderabad HQ">Hyderabad HQ Only</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Format <span className="text-[#D92D20]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 border rounded flex items-center space-x-3 cursor-pointer ${
                  format === 'PDF' ? 'border-[#174A8B] bg-[#EAF2FB]/30' : 'border-[#D9DDE3]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="PDF"
                  checked={format === 'PDF'}
                  onChange={() => setFormat('PDF')}
                  className="text-[#174A8B]"
                />
                <div>
                  <div className="text-xs font-medium text-[#171A1F]">PDF Document</div>
                  <div className="text-[11px] text-[#5E6672]">
                    Formal audit-ready disclosure format with cryptographic timestamp
                  </div>
                </div>
              </label>

              <label
                className={`p-3 border rounded flex items-center space-x-3 cursor-pointer ${
                  format === 'Excel' ? 'border-[#174A8B] bg-[#EAF2FB]/30' : 'border-[#D9DDE3]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="Excel"
                  checked={format === 'Excel'}
                  onChange={() => setFormat('Excel')}
                  className="text-[#174A8B]"
                />
                <div>
                  <div className="text-xs font-medium text-[#171A1F]">Excel / CSV Workbook</div>
                  <div className="text-[11px] text-[#5E6672]">
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
            className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-generate-preview"
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50"
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
