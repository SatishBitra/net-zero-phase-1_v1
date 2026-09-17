import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ScanLine,
  Upload,
  Zap,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const Screen17_BillUpload: React.FC = () => {
  const { sites, navigateToScreen, showToast, runOcrExtraction } = useApp();

  const [siteId, setSiteId] = useState('site-chennai-1');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
  } | null>({
    name: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
    size: '2.1 MB',
  });
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateFile = () => {
    setSelectedFile({
      name: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
      size: '2.1 MB',
    });
    showToast('Document Selected', 'TANGEDCO_HT_Bill_Jul_2025.pdf ready for AI extraction.');
  };

  const handleExtractWithAI = () => {
    if (!selectedFile) {
      showToast('No Document Selected', 'Please upload an electricity bill first.', 'error');
      return;
    }

    setIsProcessing(true);
    showToast(
      'Azure AI Document Intelligence Initialized',
      'Running prebuilt invoice model: extracting units consumed, billing period, and meter number...',
      'info'
    );

    setTimeout(() => {
      setIsProcessing(false);
      // Run OCR extraction in context and navigate to Screen 18
      runOcrExtraction({
        fileName: selectedFile.name,
        siteId,
        siteName: 'Chennai Plant 1',
        billingPeriodStart: '2025-07-01',
        billingPeriodEnd: '2025-07-31',
        consumption_kwh: 48200,
        consumerNumber: 'TN-MET-88291',
        overallConfidence: 92,
      });
      navigateToScreen('18_human_review', 'FLOW_D');
    }, 1200);
  };

  return (
    <div id="screen-17-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span>AI / OCR</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Upload Electricity Bill</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/ocr/upload</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Upload Electricity Bill</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              AI will extract the reading, billing period and units automatically — you confirm before it’s saved
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
      </div>

      {/* Facility / Site Selection Card */}
      <div className="p-5 bg-white border border-[#D9DDE3] rounded space-y-4">
        <h2 className="text-sm font-medium text-[#171A1F]">Target Facility</h2>
        <div className="max-w-md">
          <label className="block text-xs font-medium text-[#5E6672] mb-1">
            Site <span className="text-[#D92D20]">*</span>
          </label>
          <select
            id="ocr-site-select"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Dropzone Box */}
      <div className="p-6 bg-white border border-[#D9DDE3] rounded space-y-4">
        <div
          id="bill-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleSimulateFile();
          }}
          onClick={handleSimulateFile}
          className={`p-10 border-2 border-dashed rounded text-center cursor-pointer transition-colors ${
            dragActive ? 'border-[#174A8B] bg-[#EAF2FB]/40' : 'border-[#D9DDE3] bg-[#F8F9FB] hover:border-[#174A8B]'
          }`}
        >
          <Upload className="w-10 h-10 text-[#858C96] mx-auto mb-3" />
          <h3 className="text-sm font-medium text-[#171A1F]">
            Drag & drop bill (PDF/image), or click to browse
          </h3>
          <p className="text-xs text-[#5E6672] mt-1">
            Upload single high tension (HT) or low tension (LT) DISCOM electricity invoice (PDF, JPG, PNG up to 10MB)
          </p>
          <div className="mt-4">
            <span className="px-4 py-1.5 bg-white border border-[#D9DDE3] rounded text-xs text-[#174A8B] font-medium shadow-2xs hover:bg-[#F8F9FB]">
              Select invoice file
            </span>
          </div>
        </div>

        {/* Selected File Card */}
        {selectedFile && (
          <div className="p-4 bg-[#F8F9FB] border border-[#D9DDE3] rounded flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#171A1F]">{selectedFile.name}</div>
                <div className="text-[11px] text-[#5E6672]">
                  {selectedFile.size} • Ready for Azure AI Document Intelligence pipeline
                </div>
              </div>
            </div>

            <span className="text-[11px] px-2.5 py-1 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
              Ready to Extract
            </span>
          </div>
        )}

        {/* Feature Note Banner */}
        <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] space-y-1">
          <div className="flex items-center space-x-1.5 font-medium text-[#171A1F]">
            <Info className="w-4 h-4 text-[#174A8B]" />
            <span>Optional feature — can be switched off per tenant. Manual entry (Screen 11) is always available.</span>
          </div>
          <p className="text-[11px] pl-5 text-[#858C96]">
            Tenant admins can enable or disable AI Document Intelligence under Tenant Settings.
          </p>
        </div>

        {/* Build Notes */}
        <div className="p-3 bg-[#EAF2FB]/30 border border-[#2166B1]/20 rounded text-xs text-[#5E6672] space-y-1">
          <div className="font-medium text-[#174A8B]">Build Notes:</div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
            <li>Engine: Azure AI Document Intelligence, prebuilt invoice model</li>
            <li>Phase 1 scope covers one document type only: electricity utility bills</li>
            <li>Human-in-the-loop guarantee: nothing reaches calculations without human review in Screen 18</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
            className="text-xs text-[#174A8B] hover:underline"
          >
            Prefer manual entry? Switch to Screen 11
          </button>

          <button
            id="btn-extract-with-ai"
            type="button"
            disabled={isProcessing}
            onClick={handleExtractWithAI}
            className="px-6 py-2.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Extracting with AI...' : 'Extract with AI'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
