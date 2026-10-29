import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle,
  ArrowRight,
  Calculator,
  Info,
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Lock,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
  Camera,
  FileSpreadsheet,
  Download,
  RefreshCw,
  Zap,
  Check,
  Eye,
  FileCheck,
  RotateCcw,
  Maximize2,
  ScanLine,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  Building2,
  Calendar,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

interface Screen11Props {
  initialTab?: 'manual' | 'bulk' | 'camera';
}

interface SampleScanDoc {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  vendor: string;
  docNumber: string;
  date: string;
  siteId: string;
  sourceId: string;
  quantity: number;
  unit: string;
  density?: string;
  scope: string;
  confidence: number;
  quality: string;
  notes: string;
  previewUrl: string;
  boundingHighlights: Array<{ label: string; value: string; pos: string }>;
}

const SAMPLE_DOCS: SampleScanDoc[] = [
  {
    id: 'tangedco-ht',
    title: 'Electricity HT Utility Bill',
    subtitle: 'High-Tension Substation Invoice',
    type: 'Utility Power Invoice',
    vendor: 'TANGEDCO (Tamil Nadu Gen & Dist Corp)',
    docNumber: 'HT-SC-88291',
    date: '2025-08-12',
    siteId: 'site-chennai-1',
    sourceId: 'src-elec-1',
    quantity: 48200,
    unit: 'kWh',
    scope: 'Scope 2',
    confidence: 97.4,
    quality: 'High Resolution (300 DPI equivalent)',
    notes: 'Extracted via Smart Camera Vision Scanner #8821. Billing cycle: 01-Jul to 31-Jul-2025.',
    previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80',
    boundingHighlights: [
      { label: 'Units Consumed', value: '48,200 kWh', pos: 'top-[36%] left-[45%]' },
      { label: 'Meter No.', value: 'TN-MET-88291', pos: 'top-[22%] left-[18%]' },
      { label: 'Billing Period', value: '01/07/2025 - 31/07/2025', pos: 'top-[28%] left-[55%]' },
    ],
  },
  {
    id: 'iocl-diesel',
    title: 'Bulk Diesel Fuel Docket',
    subtitle: 'Tanker Delivery Receipt with Meter Slip',
    type: 'Fuel Delivery Docket',
    vendor: 'Indian Oil Corporation Ltd (IOCL)',
    docNumber: 'IOCL-DL-99410',
    date: '2025-08-14',
    siteId: 'site-chennai-1',
    sourceId: 'src-diesel-genset',
    quantity: 1450,
    unit: 'L',
    density: '0.842',
    scope: 'Scope 1',
    confidence: 95.2,
    quality: 'Physical Docket (Edge-corrected)',
    notes: 'Physical delivery docket scanned via camera. Meter stamp reading: 1,450 L at 0.842 kg/L density.',
    previewUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=700&q=80',
    boundingHighlights: [
      { label: 'Delivered Vol.', value: '1,450 Litres', pos: 'top-[42%] left-[40%]' },
      { label: 'Density @15°C', value: '0.842 kg/L', pos: 'top-[52%] left-[20%]' },
      { label: 'Tanker Docket', value: 'IOCL-DL-99410', pos: 'top-[20%] left-[50%]' },
    ],
  },
  {
    id: 'adani-gas',
    title: 'Natural Gas Pipeline Bill',
    subtitle: 'Monthly Metered Gas Consumption',
    type: 'Piped Gas Meter Bill',
    vendor: 'Adani Total Gas Limited',
    docNumber: 'ATGL-PNG-2025-081',
    date: '2025-08-10',
    siteId: 'site-pune-1',
    sourceId: 'src-gas-1',
    quantity: 3200,
    unit: 'SCM',
    scope: 'Scope 1',
    confidence: 98.1,
    quality: 'Scanned Document (Clean Contrast)',
    notes: 'Piped natural gas invoice extracted via camera smart scan. Meter Reading: 3,200 SCM.',
    previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80',
    boundingHighlights: [
      { label: 'Standard Vol.', value: '3,200 SCM', pos: 'top-[38%] left-[48%]' },
      { label: 'Customer ID', value: 'PNG-PUN-0041', pos: 'top-[24%] left-[22%]' },
    ],
  },
];

export const Screen11_EntryForm: React.FC<Screen11Props> = ({ initialTab = 'manual' }) => {
  const {
    sites,
    emissionSources,
    activePeriod,
    addActivityRecord,
    navigateToScreen,
    setSelectedRecordId,
    showToast,
    ocrPrefillData,
    setOcrPrefillData,
    currentRole,
    currentUser,
    openFactorHelper,
    selectedHelperFactor,
    setSelectedHelperFactor,
  } = useApp();

  // Active top-level ingestion mode
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk' | 'camera'>(initialTab);

  const isPeriodLocked = Boolean(activePeriod?.locked);
  const isVerifierReadOnly = currentRole === 'VERIFIER';

  // Allowed sites based on user siteScope
  const allowedSites = useMemo(() => {
    if (currentUser?.siteScope && currentUser.siteScope.length > 0 && currentRole === 'DATA_ENTRY') {
      const filtered = sites.filter((s) => currentUser.siteScope?.includes(s.id));
      return filtered.length > 0 ? filtered : sites;
    }
    return sites;
  }, [sites, currentUser, currentRole]);

  const defaultSite = allowedSites.find((s) => s.name.includes('Chennai')) || allowedSites[0] || sites[0];
  const [siteId, setSiteId] = useState(ocrPrefillData?.siteId || defaultSite?.id || 'site-chennai-1');

  const availableSources = emissionSources.filter((s) => s.siteId === siteId);
  const defaultSource =
    availableSources.find((s) => s.name.toLowerCase().includes('grid') || s.name.toLowerCase().includes('electricity')) ||
    availableSources[0];

  const [sourceId, setSourceId] = useState(ocrPrefillData?.sourceId || defaultSource?.id || '');
  const [date, setDate] = useState(ocrPrefillData?.date || '2025-08-12');
  const [quantity, setQuantity] = useState<string>(ocrPrefillData?.quantity ? String(ocrPrefillData.quantity) : '48200');
  const [unit, setUnit] = useState<string>(ocrPrefillData?.unit || 'kWh');
  const [entryMethod, setEntryMethod] = useState<string>(ocrPrefillData?.entryMethod || 'Manual');
  const [notes, setNotes] = useState(ocrPrefillData?.notes || '');
  const [testedDensity, setTestedDensity] = useState<string>('0.84');

  // Attached evidence files
  const [attachedFiles, setAttachedFiles] = useState<
    Array<{ name: string; size: string; uploadDate: string; isCameraCaptured?: boolean }>
  >(ocrPrefillData?.evidenceFile ? [ocrPrefillData.evidenceFile] : []);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync if prefill arrives
  useEffect(() => {
    if (ocrPrefillData) {
      if (ocrPrefillData.siteId) setSiteId(ocrPrefillData.siteId);
      if (ocrPrefillData.sourceId) setSourceId(ocrPrefillData.sourceId);
      if (ocrPrefillData.date) setDate(ocrPrefillData.date);
      if (ocrPrefillData.quantity) setQuantity(String(ocrPrefillData.quantity));
      if (ocrPrefillData.unit) setUnit(ocrPrefillData.unit);
      if (ocrPrefillData.entryMethod) setEntryMethod(ocrPrefillData.entryMethod);
      if (ocrPrefillData.notes) setNotes(ocrPrefillData.notes);
      if (ocrPrefillData.evidenceFile) {
        setAttachedFiles([ocrPrefillData.evidenceFile]);
      }
      setActiveTab('manual');
    }
  }, [ocrPrefillData]);

  // Selected source object
  const currentSource = availableSources.find((s) => s.id === sourceId) || availableSources[0] || defaultSource;
  const selectedSite = sites.find((s) => s.id === siteId) || defaultSite;

  const isLiquidFuel = useMemo(() => {
    const srcName = (currentSource?.name || '').toLowerCase();
    return srcName.includes('diesel') || srcName.includes('oil') || srcName.includes('petrol') || srcName.includes('hfo');
  }, [currentSource]);

  const isVolumeUnit = useMemo(() => {
    const u = (unit || '').toLowerCase();
    return u === 'l' || u === 'litre' || u === 'litres' || u === 'kl' || u === 'kilolitre' || u === 'm3';
  }, [unit]);

  const formulaApplied = useMemo(() => {
    const srcName = (currentSource?.name || '').toLowerCase();
    if (srcName.includes('electricity') || currentSource?.category === 'Scope 2') return 'C-06 (Scope 2 Grid)';
    if (srcName.includes('vehicle') || srcName.includes('fleet') || srcName.includes('truck')) return 'C-03 (Mobile Combustion)';
    if (srcName.includes('refrigerant') || srcName.includes('chiller') || srcName.includes('hfc')) return 'C-05 (Fugitive Refrigerants)';
    if (srcName.includes('biomass') || srcName.includes('husk')) return 'C-02 (Biomass Segregated)';
    return 'C-01 (Stationary Combustion)';
  }, [currentSource]);

  // Calculation computation with TC-DOM-002a density handling
  const numQuantity = parseFloat(quantity) || 0;
  const numDensity = parseFloat(testedDensity) || 0;
  const factor = selectedHelperFactor
    ? selectedHelperFactor.value
    : currentSource
    ? currentSource.emissionFactor
    : 0.82;
  const factorUnit = selectedHelperFactor
    ? selectedHelperFactor.unit
    : currentSource?.factorUnit || 'kg CO2e / kWh';
  const factorSource = selectedHelperFactor
    ? selectedHelperFactor.citation
    : currentSource?.factorSource || 'CEA CO2 Baseline Database v19 (India)';

  const isDensityMissing = isLiquidFuel && isVolumeUnit && numDensity <= 0;
  const emissions_tCO2e = isDensityMissing ? 0 : (numQuantity * factor) / 1000;

  const handleSiteChange = (newSiteId: string) => {
    setSiteId(newSiteId);
    const newSources = emissionSources.filter((s) => s.siteId === newSiteId);
    if (newSources.length > 0) {
      setSourceId(newSources[0].id);
      setUnit(newSources[0].unit || 'kWh');
    }
  };

  const handleSimulatedFileUpload = () => {
    const newDoc = {
      name: 'electricity-bill-aug25.pdf',
      size: '1.2 MB',
      uploadDate: '12-Aug-2025',
    };
    setAttachedFiles((prev) => [...prev, newDoc]);
    showToast('Evidence attached', 'electricity-bill-aug25.pdf uploaded successfully.');
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (targetStatus: 'Draft' | 'Submitted') => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is sealed and read-only. Entries cannot be created.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent verifiers cannot submit activity records.', 'error');
      return;
    }
    if (!currentSource || numQuantity <= 0) {
      showToast('Validation Error', 'Please enter a valid positive quantity.', 'error');
      return;
    }

    const newRecord = addActivityRecord({
      periodId: activePeriod.id,
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      sourceId: currentSource.id,
      sourceName: currentSource.name,
      scope: currentSource.category || 'Scope 2',
      date,
      quantity: numQuantity,
      unit: unit || currentSource.unit,
      emissionFactor: factor,
      factorUnit,
      factorSource,
      emissions_tCO2e,
      status: targetStatus,
      notes: notes || (entryMethod.includes('Camera') || entryMethod === 'AI Extracted' ? 'Extracted via Camera Vision OCR. Human-confirmed.' : 'Manual entry'),
      evidenceFiles: attachedFiles.map((f, i) => ({
        id: `ev-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        uploadDate: f.uploadDate,
        uploadedBy: `${currentUser.name} (${currentRole === 'DATA_ENTRY' ? 'Data Entry' : currentRole})`,
        url: '#',
      })),
    });

    setSelectedRecordId(newRecord.id);
    if (ocrPrefillData) {
      setOcrPrefillData(null);
    }

    showToast(
      targetStatus === 'Draft' ? 'Draft Saved' : 'Submitted for Review',
      `Record ${newRecord.id} has been ${targetStatus === 'Draft' ? 'saved to draft' : 'submitted to reviewer queue'}.`
    );

    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  // -------------------------------------------------------------
  // TAB 2: BULK IMPORT STATE & LOGIC
  // -------------------------------------------------------------
  const [bulkDragActive, setBulkDragActive] = useState(false);
  const [selectedBulkFile, setSelectedBulkFile] = useState<{
    name: string;
    size: string;
    rows: number;
  } | null>({
    name: 'activity-data-q2-fy26.xlsx',
    size: '1.8 MB',
    rows: 1842,
  });

  const handleBulkUploadSimulate = () => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is permanently locked. Bulk import is disabled.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent auditors have read-only inspection access.', 'error');
      return;
    }
    setSelectedBulkFile({
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
    if (!selectedBulkFile) {
      showToast('No File Selected', 'Please upload a .xlsx or .csv file to proceed.', 'error');
      return;
    }
    navigateToScreen('13_column_mapping', 'FLOW_C');
  };

  const handleDownloadTemplate = () => {
    showToast('Template Downloaded', 'download-activity-data-template.xlsx saved.');
  };

  // -------------------------------------------------------------
  // TAB 3: CAMERA & DOCUMENT SCANNER STATE & LOGIC
  // -------------------------------------------------------------
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedDocPreset, setSelectedDocPreset] = useState<string>('tangedco-ht');
  const [isCameraLive, setIsCameraLive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFlashActive, setIsFlashActive] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<SampleScanDoc | null>(null);
  const [capturedImageSnapshot, setCapturedImageSnapshot] = useState<string | null>(null);

  const activeDocData = useMemo(() => {
    return SAMPLE_DOCS.find((d) => d.id === selectedDocPreset) || SAMPLE_DOCS[0];
  }, [selectedDocPreset]);

  // Request & Start Live Camera feed
  const startCameraFeed = async () => {
    setCameraPermissionError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermissionError('Hardware camera API not available in this environment. Using optical smart scan preview.');
      setIsCameraLive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraLive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraPermissionError('Physical camera unattached or permission restricted. Intelligent document simulator active.');
      setIsCameraLive(false);
    }
  };

  // Stop camera stream tracks
  const stopCameraFeed = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraLive(false);
  };

  // Cleanup camera stream on unmount or tab switch
  useEffect(() => {
    if (activeTab === 'camera') {
      startCameraFeed();
    } else {
      stopCameraFeed();
    }
    return () => {
      stopCameraFeed();
    };
  }, [activeTab, facingMode]);

  // Trigger Document Snap & AI OCR Scan
  const handleCaptureAndScan = (customFile?: File) => {
    setIsAnalyzing(true);
    setAnalyzedResult(null);

    // If live video active, capture frame
    if (isCameraLive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImageSnapshot(canvas.toDataURL('image/jpeg'));
      }
    } else {
      setCapturedImageSnapshot(activeDocData.previewUrl);
    }

    showToast(
      'Document Captured · OCR Running',
      'AI Document Intelligence analyzing boundaries, meter dials & text lineage...',
      'info'
    );

    // Realistic scanning duration
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedResult(activeDocData);
      showToast(
        'Scan Complete (97% Confidence)',
        `${activeDocData.title}: Extracted ${activeDocData.quantity.toLocaleString()} ${activeDocData.unit} ready for entry.`
      );
    }, 1200);
  };

  // Apply extracted camera data into Manual Entry Form
  const handleApplyExtractedToForm = () => {
    if (!analyzedResult) return;

    setSiteId(analyzedResult.siteId);
    setDate(analyzedResult.date);
    setQuantity(String(analyzedResult.quantity));
    setUnit(analyzedResult.unit);
    if (analyzedResult.density) {
      setTestedDensity(analyzedResult.density);
    }
    setEntryMethod('Smart Camera Scan');
    setNotes(analyzedResult.notes);

    // Also attach captured document to evidence docket
    const evidenceSnap = {
      name: `scan_${analyzedResult.docNumber || 'doc'}.jpg`,
      size: '2.4 MB',
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isCameraCaptured: true,
    };
    setAttachedFiles([evidenceSnap]);

    // Switch to manual entry tab
    setActiveTab('manual');
    showToast(
      'Data Applied to Form',
      `Transferred ${analyzedResult.quantity.toLocaleString()} ${analyzedResult.unit} and attached camera evidence docket.`
    );
  };

  // Reset Scanner
  const handleResetScanner = () => {
    setAnalyzedResult(null);
    setCapturedImageSnapshot(null);
    if (!isCameraLive) {
      startCameraFeed();
    }
  };

  return (
    <div id="unified-ingestion-hub-container" className="w-full space-y-6 font-sans">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data', href: '#' },
          { label: 'Activity Data Ingestion' },
        ]}
        title="Activity Data Ingestion"
        actions={
          <div className="flex items-center space-x-2">
            <button
              id="btn-entry-factor-helper"
              type="button"
              onClick={() => openFactorHelper(currentSource?.name || '')}
              className="px-3.5 py-2 text-xs font-semibold text-[#5141FF] bg-[#F2F0FF] border border-[#E5E0FF] rounded-lg hover:bg-[#E5E0FF] shadow-2xs inline-flex items-center space-x-1.5 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5141FF]" />
              <span>Factor Helper (IPCC / IEA)</span>
            </button>

            <button
              id="back-to-activity-dashboard"
              onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        }
      />

      {/* Governance & Verifier Banners */}
      {isPeriodLocked && (
        <div className="p-3 bg-[#FFF0F3] border border-[#FFDCE4] rounded-xl flex items-center space-x-2.5 text-xs text-[#FB3256] font-medium">
          <Lock className="w-4 h-4 shrink-0 text-[#FB3256]" />
          <span>Accounting Period {activePeriod.name} is locked. Data ingestion is disabled.</span>
        </div>
      )}

      {isVerifierReadOnly && (
        <div className="p-3 bg-[#5141FF]/5 border border-[#5141FF]/20 rounded-xl flex items-center space-x-2.5 text-xs text-[#5141FF] font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#5141FF]" />
          <span>Verifier Assurance Mode: Read-only access enabled. Ingestion controls are restricted.</span>
        </div>
      )}

      {/* UNIFIED SEGMENTED MODE SWITCHER */}
      <div className="bg-white p-1.5 rounded-2xl border border-[#E2E5EF] shadow-[0_2px_12px_rgba(28,31,58,0.04)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          {/* Tab 1: Manual Data Entry */}
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center justify-start p-3 sm:p-3.5 rounded-xl transition-all text-left ${
              activeTab === 'manual'
                ? 'bg-[#F2F0FF] border border-[#5141FF]/30 shadow-xs'
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-tr from-[#6C5CE7] to-[#5141FF] text-white shadow-md shadow-indigo-500/25'
                  : 'bg-[#F0F2F7] text-[#62697C]'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-[#181B27]">Manual Entry</span>
              <p className="text-xs text-[#858CA0] font-normal truncate mt-0.5">
                Single record entry & live calculation
              </p>
            </div>
          </button>

          {/* Tab 2: Bulk File Import */}
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center justify-start p-3 sm:p-3.5 rounded-xl transition-all text-left ${
              activeTab === 'bulk'
                ? 'bg-[#F2F0FF] border border-[#5141FF]/30 shadow-xs'
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors ${
                activeTab === 'bulk'
                  ? 'bg-gradient-to-tr from-[#6C5CE7] to-[#5141FF] text-white shadow-md shadow-indigo-500/25'
                  : 'bg-[#F0F2F7] text-[#62697C]'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-[#181B27]">Bulk File Import</span>
              <p className="text-xs text-[#858CA0] font-normal truncate mt-0.5">
                XLSX / CSV spreadsheet upload
              </p>
            </div>
          </button>

          {/* Tab 3: Camera & Smart Scan */}
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex items-center justify-start p-3 sm:p-3.5 rounded-xl transition-all text-left relative overflow-hidden ${
              activeTab === 'camera'
                ? 'bg-[#F2F0FF] border border-[#5141FF]/30 shadow-xs'
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors ${
                activeTab === 'camera'
                  ? 'bg-gradient-to-tr from-[#FF5C7A] to-[#FB3256] text-white shadow-md shadow-rose-500/25'
                  : 'bg-[#F0F2F7] text-[#62697C]'
              }`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-[#181B27]">Camera & Smart Scan</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#FB3256]/10 text-[#FB3256] rounded-md shrink-0">
                  AI OCR
                </span>
              </div>
              <p className="text-xs text-[#858CA0] font-normal truncate mt-0.5">
                Scan paper bills, meters & PDF files
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: MANUAL DATA ENTRY */}
      {/* ========================================================= */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Quick Camera Ingestion Helper Box (Bridge for users stuck on unextractable bills) */}
          {entryMethod !== 'Smart Camera Scan' && (
            <div className="p-4 bg-gradient-to-r from-[#F7F8FC] via-white to-[#F2F0FF] border border-[#E2E5EF] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#5141FF] text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#181B27]">
                    Have a physical paper bill, meter slip or unreadable scanned PDF?
                  </div>
                  <div className="text-[11px] text-[#62697C]">
                    Use the Camera Scanner to capture the document directly. AI Vision extracts the consumption numbers and attaches the photo as audit evidence.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className="h-8 px-3.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5141FF] to-[#6C5CE7] hover:from-[#4333EE] hover:to-[#5B4BD8] rounded-lg shadow-sm flex items-center space-x-1.5 shrink-0 transition-all self-start sm:self-center"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Launch Camera Scanner</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Fields (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-white border border-[#E2E5EF] rounded-2xl shadow-[0_2px_12px_rgba(28,31,58,0.03)] space-y-5">
                <h3 className="text-sm font-bold text-[#181B27] flex items-center space-x-2 border-b border-[#F0F2F6] pb-3">
                  <Building2 className="w-4 h-4 text-[#5141FF]" />
                  <span>Facility & Emission Source</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Facility Select */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                      Facility / Operating Site <span className="text-[#FB3256]">*</span>
                    </label>
                    <select
                      value={siteId}
                      onChange={(e) => handleSiteChange(e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors"
                    >
                      {allowedSites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Emission Source */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                      Emission Source <span className="text-[#FB3256]">*</span>
                    </label>
                    <select
                      value={sourceId}
                      onChange={(e) => {
                        setSourceId(e.target.value);
                        const match = availableSources.find((s) => s.id === e.target.value);
                        if (match) setUnit(match.unit || 'kWh');
                      }}
                      className="w-full h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors"
                    >
                      {availableSources.map((s) => (
                        <option key={s.id} value={s.id}>
                          [{s.category}] {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reading Date */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                      Activity Reading Date <span className="text-[#FB3256]">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors"
                    />
                  </div>

                  {/* Entry Method */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                      Ingestion Lineage / Method
                    </label>
                    <input
                      type="text"
                      disabled
                      value={entryMethod}
                      className="w-full h-9 px-3 text-xs border border-[#E2E5EF] rounded-lg bg-slate-50 text-[#62697C] font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Quantity & Unit */}
                <div className="pt-2 border-t border-[#F0F2F6]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                        Activity Quantity <span className="text-[#FB3256]">*</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 48200"
                        className="w-full h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                        Measurement Unit
                      </label>
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Tested Density for Liquid Fuels */}
                  {isLiquidFuel && isVolumeUnit && (
                    <div className="mt-4 p-3.5 bg-[#FFF8EB] border border-[#FFE8B8] rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#D97706] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>TC-DOM-002a: Fuel Density Conversion Required</span>
                        </span>
                        <span className="text-[11px] font-mono text-[#D97706]">kg/L</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          step="0.001"
                          value={testedDensity}
                          onChange={(e) => setTestedDensity(e.target.value)}
                          placeholder="e.g. 0.84"
                          className="w-36 h-8 px-2.5 text-xs border border-[#FFE8B8] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#D97706] font-mono"
                        />
                        <span className="text-[11px] text-[#62697C]">
                          Standard Diesel density: 0.82–0.86 kg/L.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Evidence Attachment Box */}
                <div className="pt-2 border-t border-[#F0F2F6] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#181B27]">
                      Audit Evidence & Source Documents
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('camera')}
                      className="text-xs font-semibold text-[#5141FF] hover:underline flex items-center space-x-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Scan paper with Camera</span>
                    </button>
                  </div>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleSimulatedFileUpload(); }}
                    onClick={handleSimulatedFileUpload}
                    className={`p-5 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                      isDragOver
                        ? 'border-[#5141FF] bg-[#5141FF]/5'
                        : 'border-[#E2E5EF] hover:border-[#5141FF] bg-slate-50/50'
                    }`}
                  >
                    <Upload className="w-6 h-6 text-[#858CA0] mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-[#181B27]">
                      Drag & drop invoice or click to browse files
                    </p>
                    <p className="text-[11px] text-[#858CA0] mt-0.5">
                      Supports PDF, PNG, JPG, JPEG (Max 15MB)
                    </p>
                  </div>

                  {/* Attached file list */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-50 border border-[#E2E5EF] rounded-xl text-xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#5141FF]/10 text-[#5141FF] flex items-center justify-center shrink-0">
                              {file.isCameraCaptured ? <Camera className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-[#181B27] flex items-center gap-1.5">
                                <span>{file.name}</span>
                                {file.isCameraCaptured && (
                                  <span className="text-[10px] bg-[#E8F7EF] text-[#16845B] font-bold px-1.5 py-0.2 rounded">
                                    Camera Captured
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#858CA0]">
                                {file.size} · Attached on {file.uploadDate}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 text-[#858CA0] hover:text-[#FB3256] transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auditor Notes */}
                <div className="pt-2 border-t border-[#F0F2F6]">
                  <label className="block text-xs font-semibold text-[#181B27] mb-1.5">
                    Internal Auditor Notes / Docket Reference
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter verification notes, meter reference, or delivery vehicle registration number..."
                    className="w-full p-2.5 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#F0F2F6]">
                  <button
                    type="button"
                    disabled={isPeriodLocked || isVerifierReadOnly}
                    onClick={() => handleSave('Draft')}
                    className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    disabled={isPeriodLocked || isVerifierReadOnly}
                    onClick={() => handleSave('Submitted')}
                    className="enterprise-btn-primary h-9 px-6 text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Submit for Review</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Real-Time Calculation Card (1 Col) */}
            <div className="space-y-4">
              <div className="p-5 bg-white border border-[#E2E5EF] rounded-2xl shadow-[0_2px_12px_rgba(28,31,58,0.03)] space-y-4 sticky top-6">
                <div className="flex items-center space-x-2 text-[#181B27] border-b border-[#F0F2F6] pb-3">
                  <Calculator className="w-4 h-4 text-[#5141FF]" />
                  <h3 className="text-sm font-bold text-[#181B27]">Emissions Preview</h3>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-xl border border-[#EEF0F6] space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#62697C]">
                    <span>Quantity:</span>
                    <span className="text-[#181B27] font-bold font-mono">
                      {numQuantity.toLocaleString()} {unit}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#62697C]">
                    <span>Emission Factor:</span>
                    <span className="text-[#181B27] font-semibold font-mono">
                      {factor} {currentSource?.factorUnit || 'kg CO2e / unit'}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#62697C]">
                    <span>Calculation Formula:</span>
                    <span className="font-mono font-semibold text-[#5141FF]">
                      {formulaApplied}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#62697C]">
                    <span>Data Tier:</span>
                    <span className="font-semibold text-[#16845B]">
                      {factorSource.includes('CEA')
                        ? 'Tier 2 (CEA Baseline v19)'
                        : 'Tier 1 (IPCC Default)'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#E2E5EF] flex justify-between items-baseline">
                    <span className="text-xs text-[#62697C] font-medium">Computed Total:</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-[#181B27] font-sans">
                        {emissions_tCO2e.toFixed(3)}
                      </span>
                      <span className="text-xs font-bold text-[#858CA0] uppercase ml-1">
                        tCO₂e
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#62697C] space-y-1">
                  <div className="font-bold text-[#181B27]">Emission Factor Lineage:</div>
                  <div className="text-[10px] text-[#858CA0] font-mono">{factorSource}</div>
                </div>

                <button
                  type="button"
                  onClick={() => openFactorHelper(currentSource?.name || '')}
                  className="w-full py-2 px-3 bg-[#F2F0FF] text-[#5141FF] rounded-xl text-xs font-semibold hover:bg-[#E5E0FF] transition-colors flex items-center justify-center space-x-1.5 border border-[#5141FF]/20"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Look up Alternate IPCC / IEA Factors</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: BULK SPREADSHEET IMPORT */}
      {/* ========================================================= */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* 4-Step Import Progress */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-white p-3 rounded-2xl border border-[#E2E5EF] shadow-[0_2px_8px_rgba(28,31,58,0.03)]">
            <span className="px-3 py-1 rounded-lg bg-[#5141FF] text-white font-bold shadow-xs">
              1. Upload File
            </span>
            <span className="text-[#858CA0]">→</span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[#62697C] font-medium">
              2. Map Columns
            </span>
            <span className="text-[#858CA0]">→</span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[#62697C] font-medium">
              3. Validate & Fix
            </span>
            <span className="text-[#858CA0]">→</span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[#62697C] font-medium">
              4. Ingest Records
            </span>
          </div>

          {/* Upload Dropzone Container */}
          <div className="p-6 bg-white border border-[#E2E5EF] rounded-2xl shadow-[0_2px_12px_rgba(28,31,58,0.03)] space-y-5">
            <div
              id="upload-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setBulkDragActive(true);
              }}
              onDragLeave={() => setBulkDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setBulkDragActive(false);
                handleBulkUploadSimulate();
              }}
              onClick={handleBulkUploadSimulate}
              className={`p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                bulkDragActive
                  ? 'border-[#5141FF] bg-[#5141FF]/5'
                  : 'border-[#E2E5EF] bg-slate-50/50 hover:border-[#5141FF]'
              }`}
            >
              <FileSpreadsheet className="w-10 h-10 text-[#5141FF] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[#181B27]">
                Drag & drop .xlsx or .csv spreadsheet here, or click to browse
              </h3>
              <p className="text-xs text-[#858CA0] mt-1 font-normal">
                Supported formats: <strong className="text-[#181B27]">.xlsx, .xls, .csv</strong> (Max 25MB · up to 50,000 rows)
              </p>

              <div className="mt-4">
                <span className="enterprise-btn-secondary h-8 px-4 text-xs font-semibold inline-flex items-center">
                  Select file from computer
                </span>
              </div>
            </div>

            {/* Selected File Details */}
            {selectedBulkFile && (
              <div className="p-4 bg-slate-50 border border-[#E2E5EF] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#5141FF] text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#181B27]">{selectedBulkFile.name}</div>
                    <div className="text-[11px] text-[#62697C] font-mono">
                      {selectedBulkFile.size} • <span className="text-[#16845B] font-semibold">{selectedBulkFile.rows.toLocaleString()} activity rows detected</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <StatusBadge status="Approved" customLabel="Ready for Column Mapping" size="sm" />
                </div>
              </div>
            )}

            {/* Template Download Area */}
            <div className="p-4 bg-slate-50 border border-[#E2E5EF] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-[#181B27]">Need standard column structure?</div>
                <div className="text-[#62697C] text-[11px]">
                  Download our formatted CSV/Excel template with pre-built headers for Facility ID, Date, Source, and Quantity.
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="enterprise-btn-secondary h-8 px-3 text-xs font-semibold inline-flex items-center space-x-1.5 text-[#181B27] shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#5141FF]" />
                <span>Download Activity Template .xlsx</span>
              </button>
            </div>

            {/* Bridge Notice to Camera Scanner */}
            <div className="p-4 bg-[#F2F0FF]/60 border border-[#5141FF]/20 rounded-xl flex items-start space-x-3 text-xs">
              <Camera className="w-4 h-4 text-[#5141FF] shrink-0 mt-0.5" />
              <div className="text-[#181B27]">
                <strong className="text-[#5141FF]">Dealing with non-extractable PDFs or paper meter tickets?</strong>{' '}
                If your invoices are scanned images or physical utility slips that cannot be exported into spreadsheet rows, switch to the{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className="font-bold underline text-[#5141FF] hover:text-[#3B28CC]"
                >
                  Camera & Smart Scan tab
                </button>{' '}
                to capture them directly via camera.
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={isPeriodLocked || isVerifierReadOnly}
                onClick={handleContinueToMapping}
                className="enterprise-btn-primary h-9 px-6 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
              >
                <span>Continue to Column Mapping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 3: CAMERA & SMART SCANNER (THE CORE NEW CAPABILITY) */}
      {/* ========================================================= */}
      {activeTab === 'camera' && (
        <div className="space-y-6">
          {/* MAIN CAMERA SCANNER WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Viewfinder Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl relative">
                {/* Top Viewfinder HUD */}
                <div className="absolute top-0 inset-x-0 p-3.5 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold tracking-wider">
                      {isCameraLive ? 'LIVE CAMERA ACTIVE' : 'DOCUMENT OPTICAL VIEW'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Torch Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsFlashActive(!isFlashActive)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isFlashActive
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/20'
                      }`}
                      title="Toggle Flash / Torch"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>

                    {/* Camera Flip */}
                    <button
                      type="button"
                      onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')}
                      className="p-1.5 rounded-lg bg-white/10 text-white/70 border border-white/10 hover:bg-white/20 text-xs transition-colors"
                      title="Flip Camera (Front/Rear)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Viewfinder Close Button */}
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraFeed();
                        setActiveTab('manual');
                      }}
                      className="p-1.5 rounded-lg bg-white/15 hover:bg-[#FB3256] text-white border border-white/20 hover:border-[#FB3256] text-xs transition-colors ml-1"
                      title="Close Camera & Return to Manual Entry"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Viewfinder Video Stream / Document Feed */}
                <div className="relative aspect-[4/3] bg-slate-900 flex items-center justify-center overflow-hidden">
                  {/* Real Video Element if live */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isCameraLive ? 'block' : 'hidden'}`}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Fallback / High-Fidelity Simulated Document Feed */}
                  {!isCameraLive && (
                    <div className="relative w-full h-full flex items-center justify-center p-6 bg-slate-900">
                      <img
                        src={activeDocData.previewUrl}
                        alt="Scanned Document"
                        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl opacity-90 transition-opacity"
                      />

                      {/* Simulated Bounding Highlights */}
                      {activeDocData.boundingHighlights.map((bh, idx) => (
                        <div
                          key={idx}
                          className={`absolute ${bh.pos} px-2 py-0.5 rounded bg-[#5141FF]/80 backdrop-blur-xs border border-white/40 text-[10px] font-mono font-bold text-white shadow-lg pointer-events-none animate-pulse`}
                        >
                          {bh.label}: {bh.value}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Animated Laser Scanning Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#5141FF] to-transparent shadow-[0_0_15px_#5141FF] animate-bounce pointer-events-none z-10 opacity-80" />

                  {/* 4 Corner Targeting Reticle HUD */}
                  <div className="absolute inset-6 border border-white/15 rounded-xl pointer-events-none z-10">
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                  </div>

                  {/* In-Flight Scanning Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                      <div className="w-12 h-12 rounded-full border-3 border-[#5141FF] border-t-transparent animate-spin" />
                      <div className="space-y-1">
                        <div className="font-bold text-sm">Processing Document with AI Vision...</div>
                        <div className="text-xs text-slate-300 font-mono">
                          Deskewing · OCR Extraction · Lineage Matching
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Viewfinder Control Bar */}
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {activeDocData.title} · {activeDocData.vendor}
                  </div>

                  {/* Big Center Shutter Snap Button */}
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={() => handleCaptureAndScan()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5141FF] to-[#6C5CE7] hover:from-[#4333EE] hover:to-[#5B4BD8] text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap & Extract</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Alternative Scanned File Upload Input */}
              <div className="p-3.5 bg-white border border-[#E2E5EF] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[#62697C]">
                  <Upload className="w-4 h-4 text-[#5141FF]" />
                  <span>Already have an unextractable scanned PDF / Photo on your drive?</span>
                </div>
                <label className="enterprise-btn-secondary h-8 px-3 text-xs font-semibold cursor-pointer inline-flex items-center">
                  <span>Browse Scanned File</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCaptureAndScan(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Results Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {analyzedResult ? (
                /* Extracted Card when scan completes */
                <div className="bg-white rounded-2xl border border-[#E2E5EF] shadow-[0_2px_12px_rgba(28,31,58,0.04)] overflow-hidden space-y-4">
                  {/* Card Header */}
                  <div className="p-4 bg-[#F2F0FF]/80 border-b border-[#E2E5EF] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#181B27] flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#16845B]" />
                        <span>AI Extraction Succeeded</span>
                      </div>
                      <div className="text-[11px] text-[#62697C] font-mono">
                        Confidence: <strong className="text-[#16845B]">{analyzedResult.confidence}%</strong> (ISO 14064-3 Tier 1)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetScanner}
                      className="text-xs text-[#858CA0] hover:text-[#181B27] font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Rescan</span>
                    </button>
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="p-5 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
                      <span className="text-[#858CA0] font-medium">Document Type:</span>
                      <span className="font-bold text-[#181B27]">{analyzedResult.type}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
                      <span className="text-[#858CA0] font-medium">Supplier / Issuer:</span>
                      <span className="font-semibold text-[#181B27] text-right max-w-[200px] truncate">
                        {analyzedResult.vendor}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
                      <span className="text-[#858CA0] font-medium">Docket / Bill #:</span>
                      <span className="font-mono font-bold text-[#5141FF]">{analyzedResult.docNumber}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
                      <span className="text-[#858CA0] font-medium">Reading Date:</span>
                      <span className="font-mono text-[#181B27]">{analyzedResult.date}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
                      <span className="text-[#858CA0] font-medium">Assigned Facility:</span>
                      <span className="font-semibold text-[#181B27]">
                        {sites.find((s) => s.id === analyzedResult.siteId)?.name || 'Chennai Plant 1'}
                      </span>
                    </div>

                    {/* Extracted Quantity Highlight */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E2E5EF] flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#858CA0] font-medium">Extracted Quantity</div>
                        <div className="text-lg font-bold text-[#181B27] font-mono">
                          {analyzedResult.quantity.toLocaleString()}{' '}
                          <span className="text-xs text-[#858CA0] font-semibold">{analyzedResult.unit}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-[#E8F7EF] text-[#16845B] rounded-full">
                        {analyzedResult.scope} Verified
                      </span>
                    </div>

                    {/* Quality Assurance Note */}
                    <div className="p-3 bg-[#F7F8FC] rounded-xl text-[11px] text-[#62697C] flex items-start space-x-2">
                      <FileCheck className="w-4 h-4 text-[#5141FF] shrink-0 mt-0.5" />
                      <div>
                        <strong>Audit Docket Ready:</strong> The captured image snapshot will be attached as verifiable evidence in the ledger.
                      </div>
                    </div>

                    {/* Primary Apply Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleApplyExtractedToForm}
                        className="w-full h-10 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#5141FF] to-[#6C5CE7] hover:from-[#4333EE] hover:to-[#5B4BD8] rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>Apply Extracted Data to Form →</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state / instructions before scanning */
                <div className="bg-white rounded-2xl border border-[#E2E5EF] shadow-[0_2px_12px_rgba(28,31,58,0.03)] p-6 space-y-4 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#5141FF]/10 text-[#5141FF] flex items-center justify-center">
                    <ScanLine className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#181B27]">How Camera Smart Scan Works</h4>
                    <p className="text-[#62697C] mt-1 leading-relaxed">
                      Designed for physical bills, fuel dockets, and non-extractable PDFs that cannot be uploaded via spreadsheet.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-[#F2F0FF] text-[#5141FF] font-bold flex items-center justify-center shrink-0">1</span>
                      <div>
                        <strong className="text-[#181B27]">Align Document:</strong> Place invoice or fuel docket flat within the corner reticle brackets.
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-[#F2F0FF] text-[#5141FF] font-bold flex items-center justify-center shrink-0">2</span>
                      <div>
                        <strong className="text-[#181B27]">Snap Photo:</strong> Click <em>Snap & Extract</em> or upload an unreadable PDF file.
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-[#F2F0FF] text-[#5141FF] font-bold flex items-center justify-center shrink-0">3</span>
                      <div>
                        <strong className="text-[#181B27]">One-Click Apply:</strong> Review extracted consumption metrics and transfer directly into the calculation engine.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E5EF] text-[11px] text-[#62697C]">
                    <strong>Tip:</strong> You can test immediately using the presets above (Electricity Bill, Diesel Docket, Gas Bill) without holding a physical paper bill up to the camera.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
