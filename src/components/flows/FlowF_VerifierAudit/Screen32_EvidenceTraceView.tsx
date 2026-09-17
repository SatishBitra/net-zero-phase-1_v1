import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck,
  FileText,
  ArrowRight,
  Download,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileCheck,
  Hash,
  Clock,
  Activity,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen32_EvidenceTraceView: React.FC = () => {
  const {
    navigateToScreen,
    activeTraceContext,
    setActiveTraceContext,
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
      <div className="bg-[#17181A] text-white px-4 py-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#2D3339] shadow-2xs font-data">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#9E77ED]" />
          <span className="font-semibold text-white font-sans">External Assurance Surface</span>
          <span className="text-[#8A8F98]">•</span>
          <span className="text-[#D9DDE3]">Read-only trace mode. Every figure links to immutable evidence.</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-[#A2A9B4]">
          <span>Lead Verifier: J. Rao / M. Singh</span>
          <span className="text-[#8A8F98]">•</span>
          <span className="route-path text-[#9E77ED] font-medium">ISO 14064-3 Verifiable Audit Line</span>
        </div>
      </div>

      {/* Breadcrumb Navigation & Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => navigateToScreen('31_verifier_dashboard', 'FLOW_F') },
          { label: traceLineage.scope },
          { label: traceLineage.category },
          { label: traceLineage.site },
        ]}
        title={`Evidence Trace: ${traceLineage.category} (${traceLineage.site})`}
        description="Unbroken lineage trace from aggregate reported inventory down to primary DISCOM utility bill."
        badge={
          <span className="period-code font-medium text-xs px-2.5 py-1 bg-[#6254E8]/10 text-[#6254E8] rounded-md border border-[#6254E8]/20">
            {traceLineage.period}
          </span>
        }
        actions={
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleDownloadEvidence}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <Download className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Download Evidence</span>
            </button>

            <button
              onClick={handleRaiseQuery}
              className="enterprise-btn-primary h-9 px-3.5 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Raise a query</span>
            </button>
          </div>
        }
      />

      {/* Principle Banner: Continuous Audit Lineage */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs">
        <div className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-3 font-sans">
          Continuous Audit Lineage (Scope 2 &gt; Category &gt; Site &gt; Activity &gt; Factor &gt; Primary Evidence)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Scope Total */}
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">
              1. Scope Total
            </div>
            <div className="text-xs font-semibold text-[#17181A] mt-1 font-sans">{traceLineage.scope}</div>
            <div className="text-sm emission-factor text-[#6254E8] mt-0.5 font-medium">
              {traceLineage.scopeTotal}
            </div>
          </div>

          {/* 2. Category Total */}
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">
              2. Category Total
            </div>
            <div className="text-xs font-semibold text-[#17181A] mt-1 font-sans">{traceLineage.category}</div>
            <div className="text-sm emission-factor text-[#6254E8] mt-0.5 font-medium">
              {traceLineage.categoryTotal}
            </div>
          </div>

          {/* 3. Site Total */}
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">
              3. Site Allocation
            </div>
            <div className="text-xs font-semibold text-[#17181A] mt-1 font-sans">{traceLineage.site}</div>
            <div className="text-sm emission-factor text-[#6254E8] mt-0.5 font-medium">
              {traceLineage.siteTotal}
            </div>
          </div>

          {/* 4. Activity Row */}
          <div className="p-3 bg-[#6254E8]/5 rounded-xl border border-[#6254E8]/30">
            <div className="text-[10px] uppercase text-[#6254E8] tracking-wider font-semibold font-sans">
              4. Active Row
            </div>
            <div className="text-xs activity-id font-medium text-[#17181A] mt-1">{selectedRecord.rowRef}</div>
            <div className="text-sm font-medium text-[#17181A] mt-0.5 font-sans">
              {selectedRecord.quantity.toLocaleString()} {selectedRecord.unit}
            </div>
          </div>

          {/* 5. Emission Factor */}
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">
              5. Official Factor
            </div>
            <div className="text-xs font-semibold text-[#17181A] mt-1 font-sans">CEA India v19</div>
            <div className="text-sm emission-factor font-medium text-[#027A48] mt-0.5">
              {selectedRecord.factorValue} kg/kWh
            </div>
          </div>

          {/* 6. Primary Evidence */}
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">
              6. Source Evidence
            </div>
            <div className="text-xs font-semibold text-[#17181A] mt-1 truncate font-sans" title={selectedRecord.evidenceFilename}>
              {selectedRecord.evidenceFilename}
            </div>
            <div className="text-xs text-[#5F6368] mt-0.5 font-data">
              {selectedRecord.fileSize} • Verified
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Activity Rows Table + Evidence File Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Activity Records Table (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs space-y-0">
          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F4F5F6] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#6254E8]" />
              <span className="text-xs font-semibold text-[#17181A] font-sans">Activity Data Rows</span>
            </div>
            <span className="text-[11px] text-[#5F6368] font-data">
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
                      ? 'bg-[#6254E8]/5 border-l-4 border-l-[#6254E8]'
                      : 'hover:bg-[#FAFAFB] border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#17181A] activity-id">{row.rowRef}</span>
                    <span className="text-[11px] text-[#8A8F98] flex items-center space-x-1 font-data">
                      <Clock className="w-3 h-3" />
                      <span>{row.date}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <span className="text-[#8A8F98]">Consumption:</span>
                      <span className="font-semibold text-[#17181A] ml-1 font-sans">
                        {row.quantity.toLocaleString()} {row.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8A8F98]">Emissions:</span>
                      <span className="font-medium text-[#6254E8] ml-1 emission-factor">
                        {row.calculatedEmissions.toFixed(3)} tCO2e
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#F1F3F5] flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1 text-[#5F6368] truncate max-w-[180px] font-sans">
                      <FileCheck className="w-3.5 h-3.5 text-[#027A48]" />
                      <span className="truncate">{row.evidenceFilename}</span>
                    </div>
                    <StatusBadge status="Approved" customLabel={row.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#FAFAFB] border-t border-[#E5E7EB] text-[11px] text-[#5F6368] flex items-center justify-between font-data">
            <span>Read-only: {activityRows.length} entries for Chennai Plant 1</span>
            <span className="font-semibold text-[#17181A] font-sans">Total: 145,550 kWh</span>
          </div>
        </div>

        {/* Right: Evidence Viewer & Calculation Lineage (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Calculation Formula Card (PRD Step 5) */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#6254E8]" />
                <h3 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider font-sans">
                  Verified Calculation Formula
                </h3>
              </div>
              <StatusBadge status="Verified" customLabel="Deterministically Verified" size="sm" />
            </div>

            <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl formula-metric text-xs text-[#17181A] space-y-1.5">
              <div className="text-[11px] text-[#5F6368] font-sans">
                Emissions (tCO2e) = Activity Data (kWh) × Emission Factor (kg CO2e/kWh) ÷ 1,000
              </div>
              <div className="text-[#6254E8] font-medium text-sm">
                {selectedRecord.quantity.toLocaleString()} × {selectedRecord.factorValue} ÷ 1,000 ={' '}
                <span className="underline decoration-[#6254E8] font-medium">{selectedRecord.calculatedEmissions.toFixed(3)} tCO2e</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5F6368]">
              <div>
                <span className="font-semibold text-[#17181A] font-sans">Factor Reference:</span>{' '}
                <span className="text-[11px] font-data">{selectedRecord.factorCitation}</span>
              </div>
              <div>
                <span className="font-semibold text-[#17181A] font-sans">Approved By:</span>{' '}
                <span className="text-[11px] font-data">{selectedRecord.approvedBy} on {selectedRecord.approvedAt}</span>
              </div>
            </div>
          </div>

          {/* Primary Evidence Document Viewer (PRD Step 6) */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
            {/* Document Viewer Header */}
            <div className="px-4 py-3 bg-[#17181A] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#9E77ED]" />
                <div>
                  <div className="text-xs font-semibold text-white truncate max-w-[240px] font-sans">
                    {selectedRecord.evidenceFilename}
                  </div>
                  <div className="text-[10px] text-[#A2A9B4] font-data">
                    Size: {selectedRecord.fileSize} • Immutable Cloud Archive
                  </div>
                </div>
              </div>

              {/* Viewer Tools */}
              <div className="flex items-center space-x-1.5 text-xs">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(z - 15, 70))}
                  className="p-1.5 text-[#A2A9B4] hover:text-white rounded-md hover:bg-[#242A33] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-data text-[#A2A9B4] px-1">{previewZoom}%</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(z + 15, 160))}
                  className="p-1.5 text-[#A2A9B4] hover:text-white rounded-md hover:bg-[#242A33] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewRotation((r) => (r + 90) % 360)}
                  className="p-1.5 text-[#A2A9B4] hover:text-white rounded-md hover:bg-[#242A33] transition-colors"
                  title="Rotate Document"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex items-center border-b border-[#E5E7EB] bg-[#FAFAFB] px-4 text-xs font-semibold font-sans">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'border-[#6254E8] text-[#6254E8]'
                    : 'border-transparent text-[#5F6368] hover:text-[#17181A]'
                }`}
              >
                Document Scan
              </button>
              <button
                onClick={() => setActiveTab('ocr')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'ocr'
                    ? 'border-[#6254E8] text-[#6254E8]'
                    : 'border-transparent text-[#5F6368] hover:text-[#17181A]'
                }`}
              >
                Extracted OCR Data
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'metadata'
                    ? 'border-[#6254E8] text-[#6254E8]'
                    : 'border-transparent text-[#5F6368] hover:text-[#17181A]'
                }`}
              >
                Integrity & Hash
              </button>
            </div>

            {/* Document Content View */}
            <div className="p-4 bg-[#F4F5F6] min-h-[380px] flex items-center justify-center overflow-auto">
              {activeTab === 'preview' && (
                <div
                  style={{
                    transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out',
                  }}
                  className="w-full max-w-[520px] bg-white border border-[#E5E7EB] rounded-xl shadow-md p-6 text-xs text-[#17181A] space-y-4 font-sans"
                >
                  {/* Simulated High-Voltage Utility Bill */}
                  <div className="border-b-2 border-[#17181A] pb-3 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm tracking-tight text-[#17181A]">
                        TAMIL NADU GENERATION & DISTRIBUTION CORP. (TANGEDCO)
                      </div>
                      <div className="text-[10px] text-[#5F6368]">
                        High Tension Electricity Supply Bill — Form HT-1
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <div className="font-bold text-[#6254E8] font-sans">HT BILL CARD</div>
                      <div className="text-[10px] text-[#5F6368] activity-id">Inv #: TN-2025-08-9812</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB] text-[11px]">
                    <div>
                      <div className="text-[#8A8F98] text-[10px] uppercase font-semibold">Consumer Details</div>
                      <div className="font-semibold text-[#17181A]">Zenith Energy Services Pvt Ltd</div>
                      <div className="text-[#5F6368]">Plot 14-B, Ambattur Industrial Estate</div>
                      <div className="text-[#5F6368]">Chennai — 600058</div>
                    </div>
                    <div>
                      <div className="text-[#8A8F98] text-[10px] uppercase font-semibold">Meter & Connection</div>
                      <div>HT Service No: <span className="activity-id font-medium">09-234-8871-0</span></div>
                      <div>Meter No: <span className="activity-id font-medium">{selectedRecord.meterNumber}</span></div>
                      <div>Tariff: <span className="font-medium">HT-1A Industrial</span></div>
                    </div>
                  </div>

                  {/* Highlighted Meter Consumption */}
                  <div className="border border-[#6254E8]/40 bg-[#6254E8]/5 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#6254E8]">
                      <span>Billed Consumption (Total kWh)</span>
                      <span className="text-base font-semibold underline">
                        {selectedRecord.quantity.toLocaleString()} kWh
                      </span>
                    </div>
                    <div className="text-[10px] text-[#5F6368] flex justify-between font-data">
                      <span>Billing Period: {selectedRecord.billingPeriod}</span>
                      <span>Verified OCR Multiplier: 1.00</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-[#F1F3F5] pt-2">
                    <div>
                      <span className="text-[#8A8F98]">Current Reading:</span>
                      <div className="font-semibold font-data">1,482,200</div>
                    </div>
                    <div>
                      <span className="text-[#8A8F98]">Previous Reading:</span>
                      <div className="font-semibold font-data">1,434,000</div>
                    </div>
                    <div>
                      <span className="text-[#8A8F98]">Net Difference:</span>
                      <div className="font-semibold text-[#027A48] font-data">{selectedRecord.quantity.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ocr' && (
                <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 text-xs space-y-3">
                  <div className="text-xs font-semibold text-[#17181A] font-sans flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-[#027A48]" />
                    <span>OCR Extraction Output (Model Confidence: 98.4%)</span>
                  </div>
                  <pre className="bg-[#FAFAFB] p-3 rounded-lg text-[11px] text-[#17181A] overflow-x-auto leading-relaxed border border-[#E5E7EB] font-mono">
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
                <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 text-xs space-y-3">
                  <div className="text-xs font-semibold text-[#17181A] font-sans flex items-center space-x-1.5">
                    <Hash className="w-4 h-4 text-[#6254E8]" />
                    <span>Cryptographic Evidence Integrity Audit</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
                      <div className="text-[#8A8F98] text-[10px] uppercase font-semibold font-sans">SHA-256 Checksum</div>
                      <div className="hash-display text-[#17181A] break-all font-medium mt-0.5">
                        {selectedRecord.fileSha256}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
                        <div className="text-[#8A8F98] text-[10px] uppercase font-semibold font-sans">Storage Class</div>
                        <div className="font-semibold text-[#17181A] font-sans">WORM Immutable Object Store</div>
                      </div>
                      <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
                        <div className="text-[#8A8F98] text-[10px] uppercase font-semibold font-sans">Audit Status</div>
                        <div className="font-semibold text-[#027A48] font-sans">Unmodified Since Upload</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Footer */}
            <div className="p-3 bg-[#FAFAFB] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <span className="text-[11px] text-[#5F6368] font-data">
                File validated against tenant evidence policy (Resolution: 300 DPI, OCR Validated).
              </span>
              <button
                onClick={handleRaiseQuery}
                className="text-xs text-[#6254E8] hover:underline font-semibold flex items-center space-x-1 font-sans"
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
