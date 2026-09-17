import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  FileSpreadsheet,
  Download,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen12_ImportUpload: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();
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

  const handleUploadSimulate = () => {
    setSelectedFile({
      name: 'activity-data-q2-fy26.xlsx',
      size: '1.8 MB',
      rows: 1842,
    });
    showToast('File Attached', '1,842 activity rows detected in activity-data-q2-fy26.xlsx');
  };

  const handleContinueToMapping = () => {
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
    <div id="screen-12-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Import' },
        ]}
        title="Import Activity Data"
        description="Bulk upload operational energy, fuel, and activity records via spreadsheet."
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

      {/* 4-Step Import Progress */}
      <div className="flex items-center space-x-2 text-xs font-data bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-[#6254E8]/10 text-[#6254E8] font-bold border border-[#6254E8]/20">
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
              ? 'border-[#6254E8] bg-[#6254E8]/5'
              : 'border-[#E5E7EB] bg-[#FAFAFB] hover:border-[#7567F5]'
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
              <div className="w-10 h-10 rounded-xl bg-[#6254E8]/10 text-[#6254E8] flex items-center justify-center shrink-0 border border-[#6254E8]/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#17181A]">{selectedFile.name}</div>
                <div className="text-[11px] text-[#5F6368] font-data">
                  {selectedFile.size} • <span className="text-[#6254E8] font-medium">{selectedFile.rows.toLocaleString()} rows detected</span>
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
            className="enterprise-btn-secondary h-8 px-3 text-xs font-semibold inline-flex items-center space-x-1.5 text-[#6254E8] shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>download-activity-data-template.xlsx</span>
          </button>
        </div>

        {/* Build Note */}
        <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#6254E8] shrink-0 mt-0.5" />
          <span className="font-data">
            <strong>Build note:</strong> The import flow is built to be forgiving of messy input because spreadsheet uploads are still how most real enterprise activity data arrives.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="btn-continue-to-mapping"
            type="button"
            onClick={handleContinueToMapping}
            className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
