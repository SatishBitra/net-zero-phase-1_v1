import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileCheck,
  CheckCircle2,
  FileText,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
} from 'lucide-react';

export const Screen19_ConfirmEntry: React.FC = () => {
  const {
    ocrState,
    activePeriod,
    addActivityRecord,
    navigateToScreen,
    showToast,
  } = useApp();

  const [notes, setNotes] = useState(
    `Extracted from ${ocrState.fileName} (HT SC # ${ocrState.consumerNumber}). Verified against utility meter ledger.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scope 2 Grid electricity calculation
  const factor = 0.82; // kg CO2e / kWh
  const emissions_tCO2e = (ocrState.consumption_kwh * factor) / 1000;

  const handleCommitRecord = (targetStatus: 'Draft' | 'Submitted') => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newRec = addActivityRecord({
        periodId: activePeriod.id,
        siteId: 'site-chennai-1',
        siteName: 'Chennai Plant 1',
        sourceId: 'src-elec-1',
        sourceName: 'Grid electricity (TANGEDCO)',
        scope: 'Scope 2',
        date: ocrState.billingPeriodEnd,
        quantity: ocrState.consumption_kwh,
        unit: 'kWh',
        emissionFactor: factor,
        factorUnit: 'kg CO2e / kWh',
        factorSource: 'CEA CO2 Baseline Database v19 (India)',
        emissions_tCO2e,
        status: targetStatus,
        notes,
        evidenceFiles: [
          {
            id: `ev-bill-${Date.now()}`,
            name: ocrState.fileName,
            size: '2.1 MB',
            uploadDate: new Date().toISOString().split('T')[0],
            uploadedBy: 'OCR Extraction Pipeline (A. Kumar verified)',
            url: '#',
          },
        ],
      });

      setIsSubmitting(false);

      if (targetStatus === 'Submitted') {
        showToast(
          'Committed & Submitted for Approval',
          `Record ${newRec.id} (${emissions_tCO2e.toFixed(2)} tCO2e) sent to Reviewer queue.`
        );
        navigateToScreen('24_review_approve', 'FLOW_B');
      } else {
        showToast(
          'Saved to Activity Dashboard',
          `Record ${newRec.id} saved as Draft.`
        );
        navigateToScreen('10_activity_dashboard', 'FLOW_B');
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <button
            onClick={() => navigateToScreen('18_ocr_results_review', 'FLOW_D')}
            className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to OCR Review</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 19 · Flow D (Step 4 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Activity Data Ingestion Finalization</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Confirm Activity Data Entry</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Review the synthesized emissions ledger entry with auto-attached bill PDF before final submission.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-1.5 text-xs text-[#858C96]">
          <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672]">1. Upload</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672]">2. Review</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
            3. Confirm Entry
          </span>
        </div>
      </div>

      {/* Confirmation Card */}
      <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-sm font-medium text-[#171A1F]">Synthesized Activity Entry</h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B]">
            Scope 2 · Location-based Electricity
          </span>
        </div>

        {/* Ledger Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] space-y-1">
            <span className="text-[#5E6672] block">Facility Site:</span>
            <span className="font-medium text-[#171A1F] text-sm block">Chennai Plant 1</span>
            <span className="text-[10px] text-[#858C96]">Tamil Nadu, India</span>
          </div>

          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] space-y-1">
            <span className="text-[#5E6672] block">Emission Source:</span>
            <span className="font-medium text-[#171A1F] text-sm block">Grid electricity (TANGEDCO)</span>
            <span className="text-[10px] text-[#858C96]">Tariff: {ocrState.tariffCategory}</span>
          </div>

          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] space-y-1">
            <span className="text-[#5E6672] block">Accounting Activity Date:</span>
            <span className="font-mono font-medium text-[#171A1F] text-sm block">
              {ocrState.billingPeriodEnd}
            </span>
            <span className="text-[10px] text-[#858C96]">
              Cycle: {ocrState.billingPeriodStart} to {ocrState.billingPeriodEnd}
            </span>
          </div>

          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] space-y-1">
            <span className="text-[#5E6672] block">Extracted Consumption Volume:</span>
            <span className="font-mono font-bold text-[#174A8B] text-base block">
              {ocrState.consumption_kwh.toLocaleString()} kWh
            </span>
            <span className="text-[10px] text-[#858C96]">Consumer No: {ocrState.consumerNumber}</span>
          </div>
        </div>

        {/* Live Calculation Strip */}
        <div className="p-4 bg-[#EAF2FB]/40 border border-[#2166B1]/20 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <Calculator className="w-5 h-5 text-[#174A8B] shrink-0" />
            <div>
              <div className="font-medium text-[#171A1F]">Automated Emission Calculation</div>
              <div className="text-[11px] text-[#5E6672]">
                {ocrState.consumption_kwh.toLocaleString()} kWh × {factor} kg CO2e/kWh ÷ 1,000
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-mono font-normal text-[#174A8B]">
              {emissions_tCO2e.toFixed(3)} tCO2e
            </div>
            <div className="text-[10px] text-[#858C96]">Factor: CEA Baseline Database v19</div>
          </div>
        </div>

        {/* Auto-attached Evidence Document */}
        <div>
          <label className="block text-xs font-medium text-[#5E6672] mb-1.5">
            Auto-attached Primary Evidence (for Verifier Auditability)
          </label>
          <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded-md flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-[#174A8B]" />
              <div className="text-xs font-medium text-[#171A1F]">{ocrState.fileName}</div>
              <span className="text-[10px] text-[#858C96]">• Scanned Utility Invoice</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
              Source PDF Attached
            </span>
          </div>
        </div>

        {/* Ledger Notes */}
        <div>
          <label className="block text-xs font-medium text-[#5E6672] mb-1">
            Audit Ledger Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
          />
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleCommitRecord('Draft')}
          disabled={isSubmitting}
          className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#5E6672] rounded-md transition-colors"
        >
          Save as Draft in Dashboard
        </button>

        <button
          type="button"
          onClick={() => handleCommitRecord('Submitted')}
          disabled={isSubmitting}
          className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Submitting…' : 'Submit for Review & Approval (Screen 24)'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
