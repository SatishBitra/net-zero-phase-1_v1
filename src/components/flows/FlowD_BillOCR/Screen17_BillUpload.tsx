import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Info,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen17_BillUpload: React.FC = () => {
  const { sites, navigateToScreen, showToast, runOcrExtraction, activePeriod, currentRole, currentUser } = useApp();

  const isPeriodLocked = Boolean(activePeriod?.locked);
  const isVerifierReadOnly = currentRole === 'VERIFIER';

  // Site scope filtering for data entry operators
  const allowedSites = useMemo(() => {
    if (currentUser?.siteScope && currentUser.siteScope.length > 0 && currentRole === 'DATA_ENTRY') {
      const filtered = sites.filter((s) => currentUser.siteScope?.includes(s.id));
      return filtered.length > 0 ? filtered : sites;
    }
    return sites;
  }, [sites, currentUser, currentRole]);

  const [siteId, setSiteId] = useState(allowedSites[0]?.id || 'site-chennai-1');
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
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is permanently locked. OCR bill ingestion is disabled.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent auditors have read-only inspection access.', 'error');
      return;
    }
    setSelectedFile({
      name: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
      size: '2.1 MB',
    });
    showToast('Document Selected', 'TANGEDCO_HT_Bill_Jul_2025.pdf ready for AI extraction.');
  };

  const handleExtractWithAI = () => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is permanently locked. OCR bill ingestion is disabled.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent auditors cannot run bill extractions.', 'error');
      return;
    }
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
        siteName: allowedSites.find((s) => s.id === siteId)?.name || 'Chennai Plant 1',
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
    <div id="screen-17-container" className="w-full space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'AI / OCR' },
          { label: 'Upload Electricity Bill' },
        ]}
        title="Upload Electricity Bill"
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
            <strong className="font-semibold">Accounting Period {activePeriod.name} is Locked:</strong> New bill upload and automated OCR extraction are disabled for frozen accounting periods.
          </div>
        </div>
      )}

      {/* Verifier Read-Only Mode Banner */}
      {isVerifierReadOnly && (
        <div className="p-4 bg-[#01153C]/5 border border-[#01153C]/20 rounded-xl flex items-center space-x-3 text-xs text-[#01153C] font-data shadow-2xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-[#01153C]" />
          <div>
            <strong className="font-semibold">Third-Party Assurance Mode:</strong> Independent Auditors ({currentUser.name}) have read-only inspection access and cannot ingest raw utility bills.
          </div>
        </div>
      )}

      {/* Facility / Site Selection Card */}
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
        <h2 className="text-sm font-semibold text-[#17181A]">Target Facility</h2>
        <div className="max-w-md">
          <label className="block text-xs font-semibold text-[#17181A] mb-1">
            Site <span className="text-[#ED2024]">*</span>
          </label>
          <select
            id="ocr-site-select"
            disabled={isPeriodLocked || isVerifierReadOnly}
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#01153C] disabled:bg-[#F4F5F6] disabled:cursor-not-allowed"
          >
            {allowedSites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.location})
              </option>
            ))}
          </select>
          {currentUser?.siteScope && currentUser.siteScope.length > 0 && currentRole === 'DATA_ENTRY' && (
            <span className="text-[10px] text-[#5F6368] mt-1 block font-data">
              Restricted to your assigned facility scope: {allowedSites.map((s) => s.name).join(', ')}
            </span>
          )}
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
            dragActive ? 'border-[#01153C] bg-[#01153C]/5' : 'border-[#E5E7EB] bg-[#FAFAFB] hover:border-[#01153C]'
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
              <div className="w-9 h-9 rounded-xl bg-[#01153C]/10 text-[#01153C] flex items-center justify-center shrink-0 border border-[#01153C]/20">
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
            <Info className="w-4 h-4 text-[#01153C]" />
            <span>Assurance Policy: Human review is mandatory before any extracted utility bill data can be approved or ingested.</span>
          </div>
          <p className="text-[11px] pl-5 text-[#8A8F98] font-data">
            Document extraction extracts consumption, billing windows, and meter identifiers for human verification.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
            className="text-xs text-[#01153C] hover:underline font-semibold"
          >
            Prefer manual entry? Switch to Manual Data Entry
          </button>

          <button
            id="btn-extract-with-ai"
            type="button"
            disabled={isProcessing || isPeriodLocked || isVerifierReadOnly}
            onClick={handleExtractWithAI}
            className="enterprise-btn-primary h-9 px-6 text-xs font-semibold shadow-xs flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
