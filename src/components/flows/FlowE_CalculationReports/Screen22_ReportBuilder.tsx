import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const Screen22_ReportBuilder: React.FC = () => {
  const { activePeriod, sites, navigateToScreen } = useApp();

  const [framework, setFramework] = useState('SEBI BRSR Principle 6');
  const [period, setPeriod] = useState(activePeriod.name);
  const [format, setFormat] = useState('PDF Assurance Dossier');
  const [includeEvidenceIndex, setIncludeEvidenceIndex] = useState(true);
  const [includeFactors, setIncludeFactors] = useState(true);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    // Flow E Step 4: Screen 23 Report Preview
    navigateToScreen('23_report_preview', 'FLOW_E');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <button
            onClick={() => navigateToScreen('21_results_dashboard', 'FLOW_E')}
            className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 22 · Flow E (Step 3 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Compliance Package Builder</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Configure Emissions Report Export</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Format inventory calculation results into standardized regulatory compliance packages.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-1.5 text-xs text-[#858C96]">
          <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672]">1. Calculate</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672]">2. Dashboard</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
            3. Build Report
          </span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672]">4. Export</span>
        </div>
      </div>

      <form onSubmit={handleGenerateReport} className="space-y-6">
        {/* Framework Selection */}
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-3">
          <h2 className="text-sm font-medium text-[#171A1F]">Reporting Framework Standard</h2>
          <p className="text-xs text-[#5E6672]">
            Select the statutory or voluntary disclosure format for this reporting run.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {[
              {
                id: 'SEBI BRSR Principle 6',
                title: 'SEBI BRSR Core',
                desc: 'Indian Business Responsibility and Sustainability Report (Essential Indicators 1-6 for Energy & GHG).',
              },
              {
                id: 'GHG Protocol Corporate Standard',
                title: 'GHG Protocol Standard',
                desc: 'Global corporate accounting standard with Scope 1, 2 (Location & Market) and operational boundary disclosures.',
              },
              {
                id: 'ISO 14064-1 Carbon Footprint',
                title: 'ISO 14064-1 Dossier',
                desc: 'Specification with guidance for quantification and reporting of greenhouse gas emissions for third-party verification.',
              },
            ].map((fw) => (
              <label
                key={fw.id}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  framework === fw.id
                    ? 'border-[#2166B1] bg-[#F8F9FB]'
                    : 'border-[#D9DDE3] bg-white hover:border-[#B8BEC7]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#171A1F]">{fw.title}</span>
                    <input
                      type="radio"
                      name="framework"
                      checked={framework === fw.id}
                      onChange={() => setFramework(fw.id)}
                      className="text-[#174A8B] focus:ring-[#174A8B]"
                    />
                  </div>
                  <p className="text-[11px] text-[#5E6672] leading-relaxed">{fw.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Configuration Parameters */}
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
          <h2 className="text-sm font-medium text-[#171A1F]">Report Parameters & Inclusions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">Target Reporting Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md bg-white focus:outline-none focus:border-[#174A8B]"
              >
                <option value="FY 2025–26">FY 2025–26 (01 Apr 2025 – 31 Mar 2026)</option>
                <option value="FY 2024–25">FY 2024–25 (Locked baseline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">Export Document Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md bg-white focus:outline-none focus:border-[#174A8B]"
              >
                <option value="PDF Assurance Dossier">PDF Assurance Dossier (Print-ready with cover & sign-off)</option>
                <option value="Excel Workbook">Excel Workbook (.xlsx with raw calculation formulas)</option>
                <option value="CSV Flat Table">CSV Flat Table (Raw line items)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F1F3F5]">
            <label className="flex items-center space-x-2 text-xs text-[#171A1F] cursor-pointer">
              <input
                type="checkbox"
                checked={includeEvidenceIndex}
                onChange={(e) => setIncludeEvidenceIndex(e.target.checked)}
                className="rounded border-[#D9DDE3] text-[#174A8B] focus:ring-[#174A8B]"
              />
              <span>Include VVB Verifier Evidence Index (table of all linked bills, delivery slips & hashes)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-[#171A1F] cursor-pointer">
              <input
                type="checkbox"
                checked={includeFactors}
                onChange={(e) => setIncludeFactors(e.target.checked)}
                className="rounded border-[#D9DDE3] text-[#174A8B] focus:ring-[#174A8B]"
              />
              <span>Include National Emission Factor Citation Annexure (CEA v19, DEFRA, IPCC AR5)</span>
            </label>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('21_results_dashboard', 'FLOW_E')}
            className="px-4 py-2 text-xs text-[#5E6672]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>Generate Document Preview (Screen 23)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
