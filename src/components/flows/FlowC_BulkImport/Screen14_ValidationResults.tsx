import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Wrench,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';

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
    <div id="screen-14-container" className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Import' },
          { label: 'Validation Results' },
        ]}
        title="Validation Results"
        description="Automated pre-flight schema, boundary site, unit, and date range verification checks."
        actions={
          <button
            onClick={() => navigateToScreen('13_column_mapping', 'FLOW_C')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        }
      />

      {/* 4-Step Progress */}
      <div className="flex items-center space-x-2 text-xs font-data bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          1. Upload File
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          2. Map Columns
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#6254E8]/10 text-[#6254E8] font-bold border border-[#6254E8]/20">
          3. Validate
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          4. Confirm
        </span>
      </div>

      {/* Validation Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          title="Total rows"
          value="1,842"
          subtitle="Parsed from upload"
          trend="neutral"
        />

        <KpiCard
          title="Valid"
          value="1,798"
          subtitle="97.6% ready to import"
          trend="up"
          change="+97.6%"
        />

        <KpiCard
          title="Errors"
          value="44"
          subtitle="Flagged for review"
          trend="down"
          change="-2.4%"
        />

        <KpiCard
          title="Duplicates"
          value="0"
          subtitle="No overlap found"
          trend="neutral"
        />
      </div>

      {/* Prominent Warning Message Banner */}
      <div className="p-4 bg-[#B42318]/5 border border-[#B42318]/20 rounded-xl flex items-start space-x-3 text-xs">
        <AlertCircle className="w-5 h-5 text-[#B42318] shrink-0 mt-0.5" />
        <div className="text-[#17181A]">
          <p className="font-semibold text-[#B42318]">
            44 rows will be skipped unless corrected. You can still import the 1,798 valid rows now and fix the rest later.
          </p>
          <p className="text-[#5F6368] mt-1 font-data">
            Flagged items are quarantined in the error staging ledger and will not reach the calculation engine until resolved.
          </p>
        </div>
      </div>

      {/* Error Breakdown Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs space-y-0">
        <div className="p-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#17181A]">Flagged Error Sample (Showing 3 of 44 rows)</h2>
            <p className="text-xs text-[#5F6368] font-data">
              Click any flagged row to open the Activity Data Detail / Edit view.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadErrorReport}
            className="enterprise-btn-secondary h-8 px-3 text-xs font-semibold inline-flex items-center space-x-1.5 text-[#6254E8] shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download error report (import_errors_job88.csv)</span>
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Row</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Error</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Field</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Value</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {errorRows.map((err, idx) => (
              <tr key={idx} className="hover:bg-[#FAFAFB]">
                <td className="py-3 px-4 font-data font-medium text-[#17181A]">
                  {err.rowNumber}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status="Rejected" customLabel={err.error} size="sm" />
                </td>
                <td className="py-3 px-4 text-[#5F6368] font-medium">
                  {err.field}
                </td>
                <td className="py-3 px-4 font-data text-[11px] text-[#17181A]">
                  <code className="bg-[#FAFAFB] border border-[#E5E7EB] px-2 py-0.5 rounded text-[#B42318] font-data">
                    {err.value}
                  </code>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigateToScreen('15_fix_detail_view', 'FLOW_C')}
                    className="inline-flex items-center space-x-1 text-[#6254E8] hover:underline font-semibold text-xs"
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
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <button
          type="button"
          onClick={() => navigateToScreen('13_column_mapping', 'FLOW_C')}
          className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
        >
          Back
        </button>

        <div className="flex items-center space-x-3">
          <button
            id="btn-fix-flagged-rows"
            type="button"
            onClick={() => navigateToScreen('15_fix_detail_view', 'FLOW_C')}
            className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold inline-flex items-center space-x-1.5 text-[#6254E8]"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Fix Flagged Rows</span>
          </button>

          <button
            id="btn-import-valid-rows"
            type="button"
            onClick={handleImportValidRows}
            className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Import 1,798 Valid Rows</span>
          </button>
        </div>
      </div>
    </div>
  );
};
