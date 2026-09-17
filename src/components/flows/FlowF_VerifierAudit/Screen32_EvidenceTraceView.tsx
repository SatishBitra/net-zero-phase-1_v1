import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ChevronRight,
  ShieldCheck,
  FileText,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Lock,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  Eye,
  FileCheck,
  Hash,
  Clock,
  User,
  AlertCircle,
  Activity,
  Maximize2,
} from 'lucide-react';

export const Screen32_EvidenceTraceView: React.FC = () => {
  const {
    navigateToScreen,
    activeTraceContext,
    setActiveTraceContext,
    records,
    showToast,
  } = useApp();

  // Active drilldown state
  const [selectedRowId, setSelectedRowId] = useState<string>('ACT-2025-0812');
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [previewRotation, setPreviewRotation] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'ocr' | 'metadata'>('preview');

  // Trace hierarchy data
  const traceLineage = {
    client: activeTraceContext.client || 'Zenith Energy Services',
    report: activeTraceContext.report || 'GHG Inventory',
    period: activeTraceContext.period || 'FY 2025-26',
    scope: 'Scope 2',
    scopeTotal: '9,850 tCO2e',
    category: 'Grid electricity',
    categoryTotal: '9,850 tCO2e',
    site: 'Chennai Plant 1',
    siteTotal: '6,400 tCO2e',
    activityRowsCount: 12,
  };

  // Sample monthly entries for the selected site & source
  const activityRows = [
    {
      id: 'ACT-2025-0812',
      rowRef: 'Activity Data Row #1042',
      date: '12-Aug-2025',
      billingPeriod: '01-Jul-2025 – 31-Jul-2025',
      meterNumber: 'TN-98124-M',
      quantity: 48200,
      unit: 'kWh',
      factorValue: 0.82,
      factorUnit: 'kg CO2e/kWh',
      factorCitation: 'CEA CO2 Baseline Database v19.0 (India Grid Average)',
      calculatedEmissions: 39.524,
      evidenceFilename: 'electricity-bill-aug25.pdf',
      fileSize: '1.4 MB',
      fileSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'Approved',
      approvedBy: 'S. Iyer',
      approvedAt: '14-Aug-2025 11:30',
    },
    {
      id: 'ACT-2025-0710',
      rowRef: 'Activity Data Row #0981',
      date: '10-Jul-2025',
      billingPeriod: '01-Jun-2025 – 30-Jun-2025',
      meterNumber: 'TN-98124-M',
      quantity: 46150,
      unit: 'kWh',
      factorValue: 0.82,
      factorUnit: 'kg CO2e/kWh',
      factorCitation: 'CEA CO2 Baseline Database v19.0 (India Grid Average)',
      calculatedEmissions: 37.843,
      evidenceFilename: 'electricity-bill-jul25.pdf',
      fileSize: '1.3 MB',
      fileSha256: '9f83c605d4c82b3e925b6c3807cb1124984fc610f12a453e15b18b4aa471a923',
      status: 'Approved',
      approvedBy: 'S. Iyer',
      approvedAt: '12-Jul-2025 15:40',
    },
    {
      id: 'ACT-2025-0611',
      rowRef: 'Activity Data Row #0915',
      date: '11-Jun-2025',
      billingPeriod: '01-May-2025 – 31-May-2025',
      meterNumber: 'TN-98124-M',
      quantity: 51200,
      unit: 'kWh',
      factorValue: 0.82,
      factorUnit: 'kg CO2e/kWh',
      factorCitation: 'CEA CO2 Baseline Database v19.0 (India Grid Average)',
      calculatedEmissions: 41.984,
      evidenceFilename: 'electricity-bill-may25.pdf',
      fileSize: '1.5 MB',
      fileSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      status: 'Approved',
      approvedBy: 'S. Iyer',
      approvedAt: '14-Jun-2025 10:15',
    },
  ];

  const selectedRecord = activityRows.find((r) => r.id === selectedRowId) || activityRows[0];

  const handleRaiseQuery = () => {
    setActiveTraceContext({
      client: traceLineage.client,
      report: traceLineage.report,
      period: traceLineage.period,
      scope: traceLineage.scope,
      category: traceLineage.category,
      site: traceLineage.site,
      activityRow: selectedRecord.rowRef,
      date: selectedRecord.date,
      quantity: `${selectedRecord.quantity.toLocaleString()} ${selectedRecord.unit}`,
      evidenceRef: selectedRecord.evidenceFilename,
      verifier: 'M. Singh',
    });
    navigateToScreen('33_raise_query', 'FLOW_F');
  };

  const handleDownloadEvidence = () => {
    showToast(
      'Evidence Package Downloaded',
      `Exported ${selectedRecord.evidenceFilename} with SHA-256 verification manifest.`,
      'info'
    );
  };

  return (
    <div id="screen-32-evidence-trace-view" className="max-w-7xl mx-auto space-y-6">
      {/* Verifier Read-Only Notice Bar */}
      <div className="bg-[#171A1F] text-white px-4 py-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#2D3339]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#85B7EB]" />
          <span className="font-medium text-white">External Assurance Surface</span>
          <span className="text-[#858C96]">•</span>
          <span className="text-[#D9DDE3]">Read-only trace mode. Every figure links to immutable evidence.</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-[#A2A9B4]">
          <span>Lead Verifier: J. Rao / M. Singh</span>
          <span className="text-[#858C96]">•</span>
          <span className="font-mono text-[#85B7EB]">ISO 14064-3 Verifiable Audit Line</span>
        </div>
      </div>

      {/* Breadcrumb Navigation & Header (PRD Section 4) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DDE3] pb-4">
        <div className="space-y-1">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#5E6672]">
            <button
              onClick={() => navigateToScreen('31_verifier_dashboard', 'FLOW_F')}
              className="hover:text-[#174A8B] transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#858C96]" />
            <span className="text-[#5E6672]">{traceLineage.scope}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#858C96]" />
            <span className="text-[#5E6672]">{traceLineage.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#858C96]" />
            <span className="text-[#171A1F] font-semibold">{traceLineage.site}</span>
          </nav>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-[#171A1F]">
              Evidence Trace: {traceLineage.category} ({traceLineage.site})
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20">
              {traceLineage.period}
            </span>
          </div>
          <p className="text-xs text-[#5E6672]">
            Unbroken lineage trace from aggregate reported inventory down to primary DISCOM utility bill.
          </p>
        </div>

        {/* Action Controls (PRD Section 4.6 & 4.7) */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={handleDownloadEvidence}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-[#D9DDE3] bg-white hover:bg-[#F8F9FB] text-[#171A1F] text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#5E6672]" />
            <span>Download Evidence</span>
          </button>

          <button
            onClick={handleRaiseQuery}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#171A1F] hover:bg-[#2D3339] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#85B7EB]" />
            <span>Raise a query</span>
          </button>
        </div>
      </div>

      {/* Principle Banner: Every number should have a path (PRD Step 1 to 6) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 shadow-xs">
        <div className="text-xs font-medium text-[#5E6672] uppercase tracking-wider mb-3">
          Continuous Audit Lineage (Scope 2 &gt; Category &gt; Site &gt; Activity &gt; Factor &gt; Primary Evidence)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Scope Total */}
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider font-semibold">
              1. Scope Total
            </div>
            <div className="text-xs font-medium text-[#171A1F] mt-1">{traceLineage.scope}</div>
            <div className="text-sm font-semibold font-mono text-[#174A8B] mt-0.5">
              {traceLineage.scopeTotal}
            </div>
          </div>

          {/* 2. Category Total */}
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider font-semibold">
              2. Category Total
            </div>
            <div className="text-xs font-medium text-[#171A1F] mt-1">{traceLineage.category}</div>
            <div className="text-sm font-semibold font-mono text-[#174A8B] mt-0.5">
              {traceLineage.categoryTotal}
            </div>
          </div>

          {/* 3. Site Total */}
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider font-semibold">
              3. Site Allocation
            </div>
            <div className="text-xs font-medium text-[#171A1F] mt-1">{traceLineage.site}</div>
            <div className="text-sm font-semibold font-mono text-[#174A8B] mt-0.5">
              {traceLineage.siteTotal}
            </div>
          </div>

          {/* 4. Activity Row */}
          <div className="p-3 bg-[#EAF2FB]/50 rounded border border-[#85B7EB]/40">
            <div className="text-[10px] uppercase text-[#174A8B] tracking-wider font-semibold">
              4. Active Row
            </div>
            <div className="text-xs font-medium text-[#171A1F] mt-1">{selectedRecord.rowRef}</div>
            <div className="text-sm font-semibold font-mono text-[#171A1F] mt-0.5">
              {selectedRecord.quantity.toLocaleString()} {selectedRecord.unit}
            </div>
          </div>

          {/* 5. Emission Factor */}
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider font-semibold">
              5. Official Factor
            </div>
            <div className="text-xs font-medium text-[#171A1F] mt-1">CEA India v19</div>
            <div className="text-sm font-semibold font-mono text-[#027A48] mt-0.5">
              {selectedRecord.factorValue} kg/kWh
            </div>
          </div>

          {/* 6. Primary Evidence */}
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider font-semibold">
              6. Source Evidence
            </div>
            <div className="text-xs font-medium text-[#171A1F] mt-1 truncate" title={selectedRecord.evidenceFilename}>
              {selectedRecord.evidenceFilename}
            </div>
            <div className="text-xs font-mono text-[#5E6672] mt-0.5">
              {selectedRecord.fileSize} • Verified
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Activity Rows Table + Evidence File Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Activity Records Table (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs space-y-0">
          <div className="px-4 py-3 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#174A8B]" />
              <span className="text-xs font-semibold text-[#171A1F]">Activity Data Rows</span>
            </div>
            <span className="text-[11px] text-[#5E6672]">
              Select row to verify source evidence
            </span>
          </div>

          <div className="divide-y divide-[#F1F3F5] max-h-[640px] overflow-y-auto">
            {activityRows.map((row) => {
              const isSelected = row.id === selectedRowId;
              return (
                <div
                  key={row.id}
                  onClick={() => setSelectedRowId(row.id)}
                  className={`p-3.5 transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-[#EAF2FB]/40 border-l-4 border-l-[#174A8B]'
                      : 'hover:bg-[#F8F9FB] border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#171A1F] font-mono">{row.rowRef}</span>
                    <span className="text-[11px] text-[#858C96] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{row.date}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <span className="text-[#858C96]">Consumption:</span>
                      <span className="font-medium text-[#171A1F] ml-1 font-mono">
                        {row.quantity.toLocaleString()} {row.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#858C96]">Emissions:</span>
                      <span className="font-semibold text-[#174A8B] ml-1 font-mono">
                        {row.calculatedEmissions.toFixed(3)} tCO2e
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#F1F3F5] flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1 text-[#5E6672] truncate max-w-[180px]">
                      <FileCheck className="w-3.5 h-3.5 text-[#027A48]" />
                      <span className="truncate">{row.evidenceFilename}</span>
                    </div>
                    <span className="inline-flex items-center space-x-1 text-[#027A48] font-medium text-[10px] bg-[#ECFDF3] px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{row.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#F8F9FB] border-t border-[#D9DDE3] text-[11px] text-[#5E6672] flex items-center justify-between">
            <span>Read-only: {activityRows.length} entries for Chennai Plant 1</span>
            <span className="font-medium text-[#171A1F]">Total: 145,550 kWh</span>
          </div>
        </div>

        {/* Right: Evidence Viewer & Calculation Lineage (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Calculation Formula Card (PRD Step 5) */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-xs font-semibold text-[#171A1F] uppercase tracking-wider">
                  Verified Calculation Formula
                </h3>
              </div>
              <span className="text-[11px] text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded font-mono font-medium">
                Deterministically Verified
              </span>
            </div>

            <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded font-mono text-xs text-[#171A1F] space-y-1.5">
              <div className="text-[11px] text-[#5E6672] font-sans">
                Emissions (tCO2e) = Activity Data (kWh) × Emission Factor (kg CO2e/kWh) ÷ 1,000
              </div>
              <div className="text-[#174A8B] font-bold text-sm">
                {selectedRecord.quantity.toLocaleString()} × {selectedRecord.factorValue} ÷ 1,000 ={' '}
                <span className="underline decoration-[#174A8B]">{selectedRecord.calculatedEmissions.toFixed(3)} tCO2e</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5E6672]">
              <div>
                <span className="font-medium text-[#171A1F]">Factor Reference:</span>{' '}
                <span className="text-[11px]">{selectedRecord.factorCitation}</span>
              </div>
              <div>
                <span className="font-medium text-[#171A1F]">Approved By:</span>{' '}
                <span className="text-[11px]">{selectedRecord.approvedBy} on {selectedRecord.approvedAt}</span>
              </div>
            </div>
          </div>

          {/* Primary Evidence Document Viewer (PRD Step 6) */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
            {/* Document Viewer Header */}
            <div className="px-4 py-3 bg-[#171A1F] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#85B7EB]" />
                <div>
                  <div className="text-xs font-semibold text-white truncate max-w-[240px]">
                    {selectedRecord.evidenceFilename}
                  </div>
                  <div className="text-[10px] text-[#A2A9B4]">
                    Size: {selectedRecord.fileSize} • Immutable Cloud Archive
                  </div>
                </div>
              </div>

              {/* Viewer Tools */}
              <div className="flex items-center space-x-1.5 text-xs">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(z - 15, 70))}
                  className="p-1.5 text-[#A2A9B4] hover:text-white rounded hover:bg-[#242A33] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-[#A2A9B4] px-1">{previewZoom}%</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(z + 15, 160))}
                  className="p-1.5 text-[#A2A9B4] hover:text-white rounded hover:bg-[#242A33] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewRotation((r) => (r + 90) % 360)}
                  className="p-1.5 text-[#A2A9B4] hover:text-white rounded hover:bg-[#242A33] transition-colors"
                  title="Rotate Document"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex items-center border-b border-[#D9DDE3] bg-[#F8F9FB] px-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'border-[#171A1F] text-[#171A1F]'
                    : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
                }`}
              >
                Document Scan
              </button>
              <button
                onClick={() => setActiveTab('ocr')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'ocr'
                    ? 'border-[#171A1F] text-[#171A1F]'
                    : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
                }`}
              >
                Extracted OCR Data
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'metadata'
                    ? 'border-[#171A1F] text-[#171A1F]'
                    : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
                }`}
              >
                Integrity & Hash
              </button>
            </div>

            {/* Document Content View */}
            <div className="p-4 bg-[#F1F3F5] min-h-[380px] flex items-center justify-center overflow-auto">
              {activeTab === 'preview' && (
                <div
                  style={{
                    transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out',
                  }}
                  className="w-full max-w-[520px] bg-white border border-[#D9DDE3] rounded shadow-md p-6 text-xs text-[#171A1F] space-y-4 font-sans"
                >
                  {/* Simulated High-Voltage Utility Bill */}
                  <div className="border-b-2 border-[#171A1F] pb-3 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm tracking-tight text-[#171A1F]">
                        TAMIL NADU GENERATION & DISTRIBUTION CORP. (TANGEDCO)
                      </div>
                      <div className="text-[10px] text-[#5E6672]">
                        High Tension Electricity Supply Bill — Form HT-1
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <div className="font-bold text-[#174A8B]">HT BILL CARD</div>
                      <div className="text-[10px] text-[#5E6672]">Inv #: TN-2025-08-9812</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC] text-[11px]">
                    <div>
                      <div className="text-[#858C96] text-[10px] uppercase font-semibold">Consumer Details</div>
                      <div className="font-semibold text-[#171A1F]">Zenith Energy Services Pvt Ltd</div>
                      <div className="text-[#5E6672]">Plot 14-B, Ambattur Industrial Estate</div>
                      <div className="text-[#5E6672]">Chennai — 600058</div>
                    </div>
                    <div>
                      <div className="text-[#858C96] text-[10px] uppercase font-semibold">Meter & Connection</div>
                      <div>HT Service No: <span className="font-mono font-medium">09-234-8871-0</span></div>
                      <div>Meter No: <span className="font-mono font-medium">{selectedRecord.meterNumber}</span></div>
                      <div>Tariff: <span className="font-medium">HT-1A Industrial</span></div>
                    </div>
                  </div>

                  {/* Highlighted Meter Consumption */}
                  <div className="border border-[#85B7EB] bg-[#EAF2FB]/60 rounded p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#174A8B]">
                      <span>Billed Consumption (Total kWh)</span>
                      <span className="font-mono text-base font-bold underline">
                        {selectedRecord.quantity.toLocaleString()} kWh
                      </span>
                    </div>
                    <div className="text-[10px] text-[#5E6672] flex justify-between">
                      <span>Billing Period: {selectedRecord.billingPeriod}</span>
                      <span>Verified OCR Multiplier: 1.00</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-[#F1F3F5] pt-2">
                    <div>
                      <span className="text-[#858C96]">Current Reading:</span>
                      <div className="font-mono font-medium">1,482,200</div>
                    </div>
                    <div>
                      <span className="text-[#858C96]">Previous Reading:</span>
                      <div className="font-mono font-medium">1,434,000</div>
                    </div>
                    <div>
                      <span className="text-[#858C96]">Net Difference:</span>
                      <div className="font-mono font-bold text-[#027A48]">{selectedRecord.quantity.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ocr' && (
                <div className="w-full bg-white border border-[#D9DDE3] rounded p-4 text-xs space-y-3 font-mono">
                  <div className="text-xs font-semibold text-[#171A1F] font-sans flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-[#027A48]" />
                    <span>OCR Extraction Output (Model Confidence: 98.4%)</span>
                  </div>
                  <pre className="bg-[#F8F9FB] p-3 rounded text-[11px] text-[#171A1F] overflow-x-auto leading-relaxed border border-[#E4E7EC]">
{JSON.stringify(
  {
    supplier: 'Tamil Nadu Generation & Distribution Corporation',
    serviceNo: '09-234-8871-0',
    meterNumber: selectedRecord.meterNumber,
    billingStart: '2025-07-01',
    billingEnd: '2025-07-31',
    billedUnits_kWh: selectedRecord.quantity,
    amountBilled: '₹ 4,33,800.00',
    tariffCode: 'HT-1A Industrial',
    checksumValid: true,
    discomSealStatus: 'Verified Intact',
  },
  null,
  2
)}
                  </pre>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="w-full bg-white border border-[#D9DDE3] rounded p-4 text-xs space-y-3">
                  <div className="text-xs font-semibold text-[#171A1F] flex items-center space-x-1.5">
                    <Hash className="w-4 h-4 text-[#174A8B]" />
                    <span>Cryptographic Evidence Integrity Audit</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
                      <div className="text-[#858C96] text-[10px] uppercase font-semibold">SHA-256 Checksum</div>
                      <div className="font-mono text-[#171A1F] break-all font-semibold mt-0.5">
                        {selectedRecord.fileSha256}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
                        <div className="text-[#858C96] text-[10px] uppercase font-semibold">Storage Class</div>
                        <div className="font-medium text-[#171A1F]">WORM Immutable Object Store</div>
                      </div>
                      <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
                        <div className="text-[#858C96] text-[10px] uppercase font-semibold">Audit Status</div>
                        <div className="font-medium text-[#027A48]">Unmodified Since Upload</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Footer */}
            <div className="p-3 bg-[#F8F9FB] border-t border-[#D9DDE3] flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <span className="text-[11px] text-[#5E6672]">
                File validated against tenant evidence policy (Resolution: 300 DPI, OCR Validated).
              </span>
              <button
                onClick={handleRaiseQuery}
                className="text-xs text-[#174A8B] hover:underline font-medium flex items-center space-x-1"
              >
                <span>Have a question on this evidence? Raise a query</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
