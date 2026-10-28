import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  FileSpreadsheet,
  Download,
  ArrowRight,
  ArrowLeft,
  Info,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen12_ImportUpload: React.FC = () => {
  const { navigateToScreen, showToast, activePeriod, currentRole, currentUser } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    rows: number;
  } | null>({
    name: 'activity-data-q2-fy26.xlsx',
    size: '1.8 MB',
    rows: 1842,
  });

  const isPeriodLocked = Boolean(activePeriod?.locked);
  const isVerifierReadOnly = currentRole === 'VERIFIER';

  const handleUploadSimulate = () => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is permanently locked. Bulk import is disabled.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent auditors have read-only inspection access.', 'error');
      return;
    }
    setSelectedFile({
      name: 'activity-data-q2-fy26.xlsx',
      size: '1.8 MB',
      rows: 1842,
    });
    showToast('File Attached', '1,842 activity rows detected in activity-data-q2-fy26.xlsx');
  };

  const handleContinueToMapping = () => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is permanently locked. Bulk import is disabled.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent auditors cannot run bulk imports.', 'error');
      return;
    }
    if (!selectedFile) {
      showToast('No File Selected', 'Please upload a .xlsx or .csv file to proceed.', 'error');
      return;
    }
    navigateToScreen('13_column_mapping', 'FLOW_C');
  };

  const handleDownloadTemplate = () => {
    showToast('Template Downloaded', 'download-activity-data-template.xlsx saved.');
  };

  return (
    <div id="screen-12-container" className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Import' },
        ]}
        title="Import Activity Data"
        actions={
          <button
            onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        }
      />

      {/* Period Locked Governance Banner */}
      {isPeriodLocked && (
        <div className="p-4 bg-[#FEF1F1] border border-[#FED2D3] rounded-xl flex items-center space-x-3 text-xs text-[#ED2024] font-data shadow-2xs">
          <Lock className="w-5 h-5 shrink-0 text-[#ED2024]" />
          <div>
            <strong className="font-semibold">Reporting Period {activePeriod.name} is Permanently Locked:</strong> Bulk spreadsheet ingestion and data mapping are disabled for sealed accounting windows.
          </div>
        </div>
      )}

      {/* Verifier Read-Only Mode Banner */}
      {isVerifierReadOnly && (
        <div className="p-4 bg-[#01153C]/5 border border-[#01153C]/20 rounded-xl flex items-center space-x-3 text-xs text-[#01153C] font-data shadow-2xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-[#01153C]" />
          <div>
            <strong className="font-semibold">Third-Party Assurance Mode:</strong> Independent Verifiers have read-only inspection access and cannot ingest raw operational datasets.
          </div>
        </div>
      )}

      {/* 4-Step Import Progress */}
      <div className="flex items-center space-x-2 text-xs font-data bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-[#01153C]/10 text-[#01153C] font-bold border border-[#01153C]/20">
          1. Upload File
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          2. Map Columns
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          3. Validate
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          4. Confirm
        </span>
      </div>

      {/* Upload Box */}
      <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4 font-sans">
        <div
          id="upload-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleUploadSimulate();
          }}
          onClick={handleUploadSimulate}
          className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-[#01153C] bg-[#01153C]/5'
              : 'border-[#E5E7EB] bg-[#FAFAFB] hover:border-[#01153C]'
          }`}
        >
          <Upload className="w-10 h-10 text-[#8A8F98] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#17181A]">
            Drag & drop .xlsx or .csv file here, or click to browse
          </h3>
          <p className="text-xs text-[#5F6368] mt-1 font-data">
            File constraints: <strong className="text-[#17181A]">Max 10MB</strong> (.xlsx, .xls, .csv)
          </p>

          <div className="mt-4">
            <span className="enterprise-btn-secondary h-8 px-4 text-xs font-semibold inline-flex items-center">
              Browse computer
            </span>
          </div>
        </div>

        {/* Selected File Details */}
        {selectedFile && (
          <div className="p-4 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#01153C]/10 text-[#01153C] flex items-center justify-center shrink-0 border border-[#01153C]/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#17181A]">{selectedFile.name}</div>
                <div className="text-[11px] text-[#5F6368] font-data">
                  {selectedFile.size} • <span className="text-[#01153C] font-medium">{selectedFile.rows.toLocaleString()} rows detected</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <StatusBadge status="Approved" customLabel="Ready for Column Mapping" size="sm" />
            </div>
          </div>
        )}

        {/* Template Download Area */}
        <div className="p-4 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-semibold text-[#17181A]">Need standard format columns?</div>
            <div className="text-[#5F6368] text-[11px] font-data">
              Use our template with pre-built headers for Facility, Reading Date, Units, and Source Type.
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="enterprise-btn-secondary h-8 px-3 text-xs font-semibold inline-flex items-center space-x-1.5 text-[#01153C] shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>download-activity-data-template.xlsx</span>
          </button>
        </div>

        {/* Build Note */}
        <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#01153C] shrink-0 mt-0.5" />
          <span className="font-data">
            <strong>Build note:</strong> The import flow is built to be forgiving of messy input because spreadsheet uploads are still how most real enterprise activity data arrives.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="btn-continue-to-mapping"
            type="button"
            disabled={isPeriodLocked || isVerifierReadOnly}
            onClick={handleContinueToMapping}
            className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
