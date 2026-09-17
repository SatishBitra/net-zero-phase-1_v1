import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  FileSpreadsheet,
  Download,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
} from 'lucide-react';

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
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Import</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/import</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Import Activity Data</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Bulk upload operational energy, fuel, and activity records via spreadsheet.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* 4-Step Import Progress */}
        <div className="mt-4 flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
            1. Upload File
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            2. Map Columns
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            3. Validate
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            4. Confirm
          </span>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 bg-white border border-[#D9DDE3] rounded space-y-4">
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
          className={`p-10 border-2 border-dashed rounded text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-[#174A8B] bg-[#EAF2FB]/40'
              : 'border-[#D9DDE3] bg-[#F8F9FB] hover:border-[#174A8B]'
          }`}
        >
          <Upload className="w-10 h-10 text-[#858C96] mx-auto mb-3" />
          <h3 className="text-sm font-medium text-[#171A1F]">
            Drag & drop .xlsx or .csv file here, or click to browse
          </h3>
          <p className="text-xs text-[#5E6672] mt-1">
            File constraints: <strong className="text-[#171A1F]">Max 10MB</strong> (.xlsx, .xls, .csv)
          </p>

          <div className="mt-4">
            <span className="px-4 py-1.5 bg-white border border-[#D9DDE3] rounded text-xs text-[#174A8B] font-medium shadow-2xs hover:bg-[#F8F9FB]">
              Browse computer
            </span>
          </div>
        </div>

        {/* Selected File Details */}
        {selectedFile && (
          <div className="p-4 bg-[#F8F9FB] border border-[#D9DDE3] rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#171A1F]">{selectedFile.name}</div>
                <div className="text-[11px] text-[#5E6672]">
                  {selectedFile.size} • <span className="font-mono text-[#174A8B] font-medium">{selectedFile.rows.toLocaleString()} rows detected</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] px-2.5 py-1 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Column Mapping</span>
              </span>
            </div>
          </div>
        )}

        {/* Template Download Area */}
        <div className="p-4 bg-[#F1F3F5] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-medium text-[#171A1F]">Need standard format columns?</div>
            <div className="text-[#5E6672] text-[11px]">
              Use our template with pre-built headers for Facility, Reading Date, Units, and Source Type.
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-[#174A8B] font-medium rounded transition-colors text-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>download-activity-data-template.xlsx</span>
          </button>
        </div>

        {/* Build Note */}
        <div className="p-3 bg-[#EAF2FB]/30 border border-[#2166B1]/20 rounded text-xs text-[#5E6672] flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
          <span>
            <strong>Build note:</strong> The import flow is built to be forgiving of messy input because spreadsheet uploads are still how most real enterprise activity data arrives.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="btn-continue-to-mapping"
            type="button"
            onClick={handleContinueToMapping}
            className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
