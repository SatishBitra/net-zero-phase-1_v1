import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  Edit3,
  XCircle,
  Eye,
} from 'lucide-react';

export const Screen18_OCRReview: React.FC = () => {
  const {
    ocrState,
    navigateToScreen,
    showToast,
    addAuditLog,
    setOcrPrefillData,
  } = useApp();

  const [billingPeriod, setBillingPeriod] = useState('01 Jul – 31 Jul 2025');
  const [unitsConsumed, setUnitsConsumed] = useState('48200');
  const [meterNumber, setMeterNumber] = useState('TN-MET-88291');
  const [isEditing, setIsEditing] = useState(false);

  // Field confidence scores
  const unitsConfidence = 92;
  const meterConfidence = 78; // Low/moderate confidence - highlighted
  const periodConfidence = 95;

  const handleConfirmAndSave = () => {
    // Record AI origin in append-only audit trail
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Reviewer',
      action: 'Confirmed AI OCR Extraction #8821',
      previousValue: 'Raw PDF Invoice: TANGEDCO_HT_Bill_Jul_2025.pdf',
      newValue: `Confirmed: 48,200 kWh (Confidence: 92%), Meter: TN-MET-88291 (Confidence: 78%), Period: ${billingPeriod}`,
      source: 'Azure AI Document Intelligence (Prebuilt Model)',
      reason: 'Human verification completed before ingestion into GHG boundary',
      status: 'Human Confirmed',
      lineItemId: 'OCR-8821',
    });

    // Populate prefill data for Screen 11 (Activity Data Entry Form)
    setOcrPrefillData({
      siteId: 'site-chennai-1',
      sourceId: 'src-elec-1',
      date: '2025-08-12',
      quantity: parseFloat(unitsConsumed) || 48200,
      unit: 'kWh',
      entryMethod: 'AI Extracted',
      notes: `Extracted via Azure Document Intelligence OCR #8821. Billing: ${billingPeriod}. Meter: ${meterNumber}. Human-confirmed.`,
      evidenceFile: {
        name: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
        size: '2.1 MB',
        uploadDate: '12-Aug-2025',
      },
    });

    showToast(
      'OCR Confirmed',
      'Data passed to Screen 11 Activity Data Entry Form with attached evidence bill.'
    );

    // Link: Screen 11 — Entry Form, pre-filled on confirm
    navigateToScreen('11_entry_form', 'FLOW_B');
  };

  const handleRejectAndDiscard = () => {
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Reviewer',
      action: 'Rejected OCR Extraction #8821',
      previousValue: 'Extracted 48,200 kWh from TANGEDCO_HT_Bill_Jul_2025.pdf',
      newValue: 'Status: Discarded by Human Reviewer',
      source: 'Azure AI Document Intelligence',
      reason: 'Unsatisfactory confidence or incorrect bill upload',
      status: 'Discarded',
      lineItemId: 'OCR-8821',
    });

    showToast('OCR Extraction Discarded', 'No data was committed to the calculation engine.');
    navigateToScreen('17_bill_upload', 'FLOW_D');
  };

  return (
    <div id="screen-18-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Confirm Extracted Data</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/ocr/review/8821</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-normal text-[#171A1F]">Confirm Extracted Data</h1>
              <span className="px-2.5 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] text-xs font-medium border border-[#2166B1]/20 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI-suggested</span>
              </span>
            </div>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Review machine-extracted values against original source document before committing to activity records.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Policy Banner */}
      <div className="p-3 bg-[#EAF2FB]/50 border border-[#2166B1]/20 rounded text-xs text-[#174A8B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            <strong>Critical Policy:</strong> Nothing from AI reaches the calculation engine without explicit human confirmation.
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-xs text-[#174A8B] hover:underline flex items-center space-x-1 shrink-0 font-medium"
        >
          <span>Screen 35 — Audit Trail</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 2-Column Split: Left Bill Preview | Right Extracted Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Uploaded Bill Preview (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#D9DDE3] rounded p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#174A8B]" />
              <h2 className="text-sm font-medium text-[#171A1F]">Uploaded bill preview</h2>
            </div>
            <span className="text-[11px] font-mono text-[#5E6672]">
              TANGEDCO_HT_Bill_Jul_2025.pdf
            </span>
          </div>

          {/* Document Display Simulation */}
          <div className="border border-[#D9DDE3] bg-[#F8F9FB] rounded p-4 font-mono text-xs space-y-3 relative overflow-hidden">
            {/* Watermark / Header */}
            <div className="flex justify-between items-start border-b border-[#D9DDE3] pb-2">
              <div>
                <div className="font-bold text-[#171A1F]">TAMIL NADU GENERATION AND DISTRIBUTION CORP (TANGEDCO)</div>
                <div className="text-[10px] text-[#5E6672]">High Tension (HT) Electricity Bill & Receipt</div>
              </div>
              <span className="text-[10px] bg-[#E8F5E9] text-[#0F6B48] px-1.5 py-0.5 rounded font-bold">PAID</span>
            </div>

            {/* Consumer & Meter Box with Highlight */}
            <div className="p-2.5 rounded bg-white border border-[#F79009] ring-2 ring-[#F79009]/30 relative">
              <span className="absolute top-1 right-2 text-[9px] font-sans font-medium text-[#B54708] bg-[#FEF0C7] px-1.5 rounded">
                78% Conf
              </span>
              <div className="text-[10px] text-[#5E6672]">Consumer No: <span className="font-bold text-[#171A1F]">04-921-084-220</span></div>
              <div className="text-[10px] text-[#5E6672]">Meter / Account No: <span className="font-bold text-[#171A1F]">{meterNumber}</span></div>
              <div className="text-[10px] text-[#5E6672]">Site: Chennai Plant 1 (Substation A)</div>
            </div>

            {/* Billing Period Box */}
            <div className="p-2.5 rounded bg-white border border-[#2166B1] ring-2 ring-[#2166B1]/20 relative">
              <span className="absolute top-1 right-2 text-[9px] font-sans font-medium text-[#174A8B] bg-[#EAF2FB] px-1.5 rounded">
                95% Conf
              </span>
              <div className="text-[10px] text-[#5E6672]">Billing Cycle: <span className="font-bold text-[#171A1F]">{billingPeriod}</span></div>
              <div className="text-[10px] text-[#5E6672]">Bill Date: 02-Aug-2025</div>
            </div>

            {/* Units Consumed Box with High Visibility Highlight */}
            <div className="p-3 rounded bg-[#EAF2FB] border-2 border-[#174A8B] relative">
              <span className="absolute top-1.5 right-2 text-[9px] font-sans font-medium text-[#174A8B] bg-white px-1.5 rounded border border-[#2166B1]/20">
                92% Conf
              </span>
              <div className="text-[10px] uppercase font-bold text-[#174A8B]">Active Energy Consumed (Units)</div>
              <div className="text-xl font-bold text-[#171A1F] mt-1 font-mono">
                {parseFloat(unitsConsumed).toLocaleString()} <span className="text-xs font-normal">kWh</span>
              </div>
              <div className="text-[10px] text-[#5E6672] mt-1">Previous: 412,800 | Current: 461,000 | Net: 48,200 kWh</div>
            </div>

            <div className="text-[10px] text-[#858C96] text-center pt-2">
              Azure AI Document Intelligence bounding box overlay active
            </div>
          </div>
        </div>

        {/* Right: Extracted Values Table & Review Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#D9DDE3] rounded p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <div>
              <h2 className="text-sm font-medium text-[#171A1F]">Extracted values — please review</h2>
              <p className="text-xs text-[#5E6672]">
                Check each field carefully against the document preview.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-[#174A8B] hover:underline flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Manually'}</span>
            </button>
          </div>

          {/* Extracted Values Table */}
          <div className="border border-[#D9DDE3] rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                  <th className="py-2.5 px-3 font-medium">Field</th>
                  <th className="py-2.5 px-3 font-medium">Extracted value</th>
                  <th className="py-2.5 px-3 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {/* Row 1: Billing Period */}
                <tr className="hover:bg-[#F8F9FB]">
                  <td className="py-3 px-3 font-medium text-[#171A1F]">Billing period</td>
                  <td className="py-3 px-3 font-mono">
                    {isEditing ? (
                      <input
                        type="text"
                        value={billingPeriod}
                        onChange={(e) => setBillingPeriod(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#D9DDE3] rounded w-full font-mono"
                      />
                    ) : (
                      <span className="text-[#171A1F] font-medium">{billingPeriod}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[#E8F5E9] text-[#0F6B48] px-2 py-0.5 rounded text-[11px] font-medium">
                      {periodConfidence}% High
                    </span>
                  </td>
                </tr>

                {/* Row 2: Units consumed (kWh) */}
                <tr className="bg-[#EAF2FB]/30 hover:bg-[#EAF2FB]/50">
                  <td className="py-3 px-3 font-medium text-[#174A8B]">Units consumed (kWh)</td>
                  <td className="py-3 px-3 font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={unitsConsumed}
                        onChange={(e) => setUnitsConsumed(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#2166B1] rounded w-full font-mono font-bold"
                      />
                    ) : (
                      <span className="text-base font-bold text-[#171A1F]">
                        {parseFloat(unitsConsumed).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[#E8F5E9] text-[#0F6B48] px-2 py-0.5 rounded text-[11px] font-medium">
                      {unitsConfidence}% High
                    </span>
                  </td>
                </tr>

                {/* Row 3: Account / meter number (Low confidence - highlighted) */}
                <tr className="bg-[#FEF0C7]/20 hover:bg-[#FEF0C7]/40">
                  <td className="py-3 px-3 font-medium text-[#B54708]">Account / meter number</td>
                  <td className="py-3 px-3 font-mono">
                    {isEditing ? (
                      <input
                        type="text"
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#F79009] rounded w-full font-mono font-bold"
                      />
                    ) : (
                      <span className="text-[#171A1F] font-bold">{meterNumber}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[#FEF0C7] text-[#B54708] border border-[#F79009]/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 w-max">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{meterConfidence}% Moderate</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explicit Confidence Explanation Notice */}
          <div className="p-3 bg-[#FEF0C7]/30 border border-[#F79009]/30 rounded text-xs text-[#7A271A] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#B54708] shrink-0 mt-0.5" />
            <div>
              <strong>Confidence: 92% on units consumed, 78% on meter number</strong> — low-confidence fields are highlighted for extra attention.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#F1F3F5] flex flex-wrap items-center justify-between gap-3">
            <button
              id="btn-reject-discard-ocr"
              type="button"
              onClick={handleRejectAndDiscard}
              className="px-3.5 py-2 bg-white border border-[#D92D20] text-[#D92D20] hover:bg-[#FEF0EF] text-xs font-medium rounded transition-colors flex items-center space-x-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject & Discard</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3.5 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors"
              >
                {isEditing ? 'Done Editing' : 'Edit Manually'}
              </button>

              <button
                id="btn-confirm-save-ocr"
                type="button"
                onClick={handleConfirmAndSave}
                className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Save</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
