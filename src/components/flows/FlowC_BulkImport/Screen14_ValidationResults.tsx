import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Download,
  Info,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const Screen14_ValidationResults: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  const handleImportValidRows = () => {
    showToast(
      'Import Successful',
      '1,798 valid rows imported to Activity Data. 44 flagged rows held in error queue.'
    );
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  const handleDownloadErrorReport = () => {
    showToast('Report Downloaded', 'import_errors_job88.csv downloaded with 44 flagged rows.');
  };

  const errorRows = [
    {
      rowNumber: 'Row 22',
      error: 'Unrecognised unit',
      field: 'Unit',
      value: 'kwh/h',
      actionable: false,
    },
    {
      rowNumber: 'Row 105',
      error: 'Missing required field',
      field: 'Activity date',
      value: '(blank)',
      actionable: false,
    },
    {
      rowNumber: 'Row 340 / #1042',
      error: 'Site not found',
      field: 'Site',
      value: 'Chennai Plant One',
      actionable: true,
      hint: 'Did you mean Chennai Plant 1?',
    },
  ];

  return (
    <div id="screen-14-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Import</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/import/validate</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Validation Results</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Automated pre-flight schema, boundary site, unit, and date range verification checks.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('13_column_mapping', 'FLOW_C')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* 4-Step Progress */}
        <div className="mt-4 flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            1. Upload File
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            2. Map Columns
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
            3. Validate
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            4. Confirm
          </span>
        </div>
      </div>

      {/* Validation Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#5E6672]">Total rows</div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">1,842</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Parsed from upload</div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#0F6B48] flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valid</span>
          </div>
          <div className="text-2xl font-normal text-[#0F6B48] font-mono mt-1">1,798</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">97.6% ready to import</div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#D92D20] flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Errors</span>
          </div>
          <div className="text-2xl font-normal text-[#D92D20] font-mono mt-1">44</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Flagged for review</div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="text-xs text-[#5E6672]">Duplicates</div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">0</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">No overlap found</div>
        </div>
      </div>

      {/* Prominent Warning Message Banner */}
      <div className="p-4 bg-[#FEF0EF] border border-[#D92D20]/30 rounded flex items-start space-x-3 text-xs">
        <AlertCircle className="w-5 h-5 text-[#D92D20] shrink-0 mt-0.5" />
        <div className="text-[#171A1F]">
          <p className="font-medium text-[#D92D20]">
            44 rows will be skipped unless corrected. You can still import the 1,798 valid rows now and fix the rest later.
          </p>
          <p className="text-[#5E6672] mt-1">
            Flagged items are quarantined in the error staging ledger and will not reach the calculation engine until resolved.
          </p>
        </div>
      </div>

      {/* Error Breakdown Table */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden shadow-2xs space-y-0">
        <div className="p-4 border-b border-[#D9DDE3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-medium text-[#171A1F]">Flagged Error Sample (Showing 3 of 44 rows)</h2>
            <p className="text-xs text-[#5E6672]">
              Click any flagged row to open the Activity Data Detail / Edit view.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadErrorReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#174A8B] font-medium rounded transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download error report (import_errors_job88.csv)</span>
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-2.5 px-4 font-medium">Row</th>
              <th className="py-2.5 px-4 font-medium">Error</th>
              <th className="py-2.5 px-4 font-medium">Field</th>
              <th className="py-2.5 px-4 font-medium">Value</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {errorRows.map((err, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FB]">
                <td className="py-3 px-4 font-mono font-medium text-[#171A1F]">
                  {err.rowNumber}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center space-x-1 text-[#D92D20] bg-[#FEF0EF] px-2 py-0.5 rounded text-[11px] font-medium">
                    <XCircle className="w-3 h-3" />
                    <span>{err.error}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-[#5E6672] font-medium">
                  {err.field}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#171A1F]">
                  <code className="bg-[#F1F3F5] px-1.5 py-0.5 rounded text-[#D92D20]">
                    {err.value}
                  </code>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigateToScreen('15_fix_detail_view', 'FLOW_C')}
                    className="inline-flex items-center space-x-1 text-[#174A8B] hover:underline font-medium text-xs"
                  >
                    <span>Fix Row</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigateToScreen('13_column_mapping', 'FLOW_C')}
          className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors"
        >
          Back
        </button>

        <div className="flex items-center space-x-3">
          <button
            id="btn-fix-flagged-rows"
            type="button"
            onClick={() => navigateToScreen('15_fix_detail_view', 'FLOW_C')}
            className="px-4 py-2 bg-white border border-[#174A8B] text-[#174A8B] hover:bg-[#EAF2FB] text-xs font-medium rounded transition-colors flex items-center space-x-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Fix Flagged Rows</span>
          </button>

          <button
            id="btn-import-valid-rows"
            type="button"
            onClick={handleImportValidRows}
            className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Import 1,798 Valid Rows</span>
          </button>
        </div>
      </div>
    </div>
  );
};
