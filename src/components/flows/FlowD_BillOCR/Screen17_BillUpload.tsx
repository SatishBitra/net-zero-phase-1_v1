import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

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
    <div id="screen-17-container" className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'AI / OCR' },
          { label: 'Upload Electricity Bill' },
        ]}
        title="Upload Electricity Bill"
        description="AI will extract the reading, billing period and units automatically — you confirm before it’s saved"
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

      {/* Facility / Site Selection Card */}
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
        <h2 className="text-sm font-semibold text-[#17181A]">Target Facility</h2>
        <div className="max-w-md">
          <label className="block text-xs font-semibold text-[#17181A] mb-1">
            Site <span className="text-[#D92D20]">*</span>
          </label>
          <select
            id="ocr-site-select"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5]"
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
      <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
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
          className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            dragActive ? 'border-[#6254E8] bg-[#6254E8]/5' : 'border-[#E5E7EB] bg-[#FAFAFB] hover:border-[#7567F5]'
          }`}
        >
          <Upload className="w-10 h-10 text-[#8A8F98] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#17181A]">
            Drag & drop bill (PDF/image), or click to browse
          </h3>
          <p className="text-xs text-[#5F6368] mt-1 font-data">
            Upload single high tension (HT) or low tension (LT) DISCOM electricity invoice (PDF, JPG, PNG up to 10MB)
          </p>
          <div className="mt-4">
            <span className="enterprise-btn-secondary h-8 px-4 text-xs font-semibold inline-flex items-center">
              Select invoice file
            </span>
          </div>
        </div>

        {/* Selected File Card */}
        {selectedFile && (
          <div className="p-4 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#6254E8]/10 text-[#6254E8] flex items-center justify-center shrink-0 border border-[#6254E8]/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#17181A]">{selectedFile.name}</div>
                <div className="text-[11px] text-[#5F6368] font-data">
                  {selectedFile.size} • Ready for Azure AI Document Intelligence pipeline
                </div>
              </div>
            </div>

            <StatusBadge status="Approved" customLabel="Ready to Extract" size="sm" />
          </div>
        )}

        {/* Feature Note Banner */}
        <div className="p-3.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-[#17181A]">
            <Info className="w-4 h-4 text-[#6254E8]" />
            <span>Optional feature — can be switched off per tenant. Manual entry (Screen 11) is always available.</span>
          </div>
          <p className="text-[11px] pl-5 text-[#8A8F98] font-data">
            Tenant admins can enable or disable AI Document Intelligence under Tenant Settings.
          </p>
        </div>

        {/* Build Notes */}
        <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] space-y-1 shadow-2xs font-sans">
          <div className="font-semibold text-[#6254E8]">Build Notes:</div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1 font-data">
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
            className="text-xs text-[#6254E8] hover:underline font-semibold"
          >
            Prefer manual entry? Switch to Screen 11
          </button>

          <button
            id="btn-extract-with-ai"
            type="button"
            disabled={isProcessing}
            onClick={handleExtractWithAI}
            className="enterprise-btn-primary h-9 px-6 text-xs font-semibold shadow-xs flex items-center space-x-2 disabled:opacity-50"
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
