import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  Info,
  Edit3,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen18_OCRReview: React.FC = () => {
  const {
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
    <div id="screen-18-container" className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'AI OCR Review' },
        ]}
        title="Confirm Extracted Data"
        description="Review machine-extracted values against original source document before committing to activity records."
        actions={
          <div className="flex items-center space-x-2">
            <StatusBadge status="In Review" customLabel="AI-suggested" size="md" />
            <button
              onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Upload</span>
            </button>
          </div>
        }
      />

      {/* Critical Policy Banner */}
      <div className="p-3 bg-[#6254E8]/5 border border-[#6254E8]/20 rounded-xl text-xs text-[#6254E8] flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2 font-data">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            <strong>Critical Policy:</strong> Nothing from AI reaches the calculation engine without explicit human confirmation.
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-xs text-[#6254E8] hover:underline flex items-center space-x-1 shrink-0 font-semibold"
        >
          <span>Screen 35 — Audit Trail</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 2-Column Split: Left Bill Preview | Right Extracted Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Uploaded Bill Preview (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#6254E8]" />
              <h2 className="text-sm font-semibold text-[#17181A]">Uploaded bill preview</h2>
            </div>
            <span className="text-[11px] font-data font-medium text-[#5F6368]">
              TANGEDCO_HT_Bill_Jul_2025.pdf
            </span>
          </div>

          {/* Document Display Simulation */}
          <div className="border border-[#E5E7EB] bg-[#FAFAFB] rounded-xl p-4 font-data text-xs space-y-3 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-2">
              <div>
                <div className="font-bold text-[#17181A]">TAMIL NADU GENERATION AND DISTRIBUTION CORP (TANGEDCO)</div>
                <div className="text-[10px] text-[#5F6368]">High Tension (HT) Electricity Bill & Receipt</div>
              </div>
              <span className="text-[10px] bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20 px-1.5 py-0.5 rounded font-bold">PAID</span>
            </div>

            {/* Consumer & Meter Box with Highlight */}
            <div className="p-2.5 rounded-lg bg-white border border-[#F59E0B] ring-2 ring-[#F59E0B]/20 relative">
              <span className="absolute top-1 right-2 text-[9px] font-sans font-semibold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5 rounded">
                78% Conf
              </span>
              <div className="text-[10px] text-[#5F6368]">Consumer No: <span className="font-bold text-[#17181A]">04-921-084-220</span></div>
              <div className="text-[10px] text-[#5F6368]">Meter / Account No: <span className="font-bold text-[#17181A]">{meterNumber}</span></div>
              <div className="text-[10px] text-[#5F6368]">Site: Chennai Plant 1 (Substation A)</div>
            </div>

            {/* Billing Period Box */}
            <div className="p-2.5 rounded-lg bg-white border border-[#6254E8] ring-2 ring-[#6254E8]/20 relative">
              <span className="absolute top-1 right-2 text-[9px] font-sans font-semibold text-[#6254E8] bg-[#6254E8]/10 px-1.5 py-0.5 rounded">
                95% Conf
              </span>
              <div className="text-[10px] text-[#5F6368]">Billing Cycle: <span className="font-bold text-[#17181A]">{billingPeriod}</span></div>
              <div className="text-[10px] text-[#5F6368]">Bill Date: 02-Aug-2025</div>
            </div>

            {/* Units Consumed Box with High Visibility Highlight */}
            <div className="p-3 rounded-lg bg-[#6254E8]/5 border-2 border-[#6254E8] relative">
              <span className="absolute top-1.5 right-2 text-[9px] font-sans font-semibold text-[#6254E8] bg-white px-1.5 py-0.5 rounded border border-[#6254E8]/20">
                92% Conf
              </span>
              <div className="text-[10px] uppercase font-bold text-[#6254E8]">Active Energy Consumed (Units)</div>
              <div className="text-xl font-bold text-[#17181A] mt-1 font-data">
                {parseFloat(unitsConsumed).toLocaleString()} <span className="text-xs font-normal">kWh</span>
              </div>
              <div className="text-[10px] text-[#5F6368] mt-1">Previous: 412,800 | Current: 461,000 | Net: 48,200 kWh</div>
            </div>

            <div className="text-[10px] text-[#8A8F98] text-center pt-2 font-sans">
              Azure AI Document Intelligence bounding box overlay active
            </div>
          </div>
        </div>

        {/* Right: Extracted Values Table & Review Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <div>
              <h2 className="text-sm font-semibold text-[#17181A]">Extracted values — please review</h2>
              <p className="text-xs text-[#5F6368]">
                Check each field carefully against the document preview.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-[#6254E8] hover:underline flex items-center space-x-1 font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Manually'}</span>
            </button>
          </div>

          {/* Extracted Values Table */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                  <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A]">Field</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A]">Extracted value</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-[#17181A]">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {/* Row 1: Billing Period */}
                <tr className="hover:bg-[#FAFAFB]">
                  <td className="py-3 px-3 font-semibold text-[#17181A]">Billing period</td>
                  <td className="py-3 px-3 font-data">
                    {isEditing ? (
                      <input
                        type="text"
                        value={billingPeriod}
                        onChange={(e) => setBillingPeriod(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-md w-full font-data focus:border-[#7567F5]"
                      />
                    ) : (
                      <span className="text-[#17181A] font-semibold">{billingPeriod}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status="Approved" customLabel={`${periodConfidence}% High`} size="sm" />
                  </td>
                </tr>

                {/* Row 2: Units consumed (kWh) */}
                <tr className="bg-[#6254E8]/5 hover:bg-[#6254E8]/10">
                  <td className="py-3 px-3 font-semibold text-[#6254E8]">Units consumed (kWh)</td>
                  <td className="py-3 px-3 font-data">
                    {isEditing ? (
                      <input
                        type="number"
                        value={unitsConsumed}
                        onChange={(e) => setUnitsConsumed(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#6254E8] rounded-md w-full font-data font-bold focus:outline-none"
                      />
                    ) : (
                      <span className="text-base font-bold text-[#17181A]">
                        {parseFloat(unitsConsumed).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status="Approved" customLabel={`${unitsConfidence}% High`} size="sm" />
                  </td>
                </tr>

                {/* Row 3: Account / meter number (Low confidence - highlighted) */}
                <tr className="bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10">
                  <td className="py-3 px-3 font-semibold text-[#B45309]">Account / meter number</td>
                  <td className="py-3 px-3 font-data">
                    {isEditing ? (
                      <input
                        type="text"
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#F59E0B] rounded-md w-full font-data font-bold focus:outline-none"
                      />
                    ) : (
                      <span className="text-[#17181A] font-bold">{meterNumber}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 w-max">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{meterConfidence}% Moderate</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explicit Confidence Explanation Notice */}
          <div className="p-3 bg-[#FEF3C7]/40 border border-[#F59E0B]/30 rounded-xl text-xs text-[#B45309] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div className="font-data">
              <strong>Confidence: 92% on units consumed, 78% on meter number</strong> — low-confidence fields are highlighted for extra attention.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#F1F3F5] flex flex-wrap items-center justify-between gap-3">
            <button
              id="btn-reject-discard-ocr"
              type="button"
              onClick={handleRejectAndDiscard}
              className="h-9 px-3.5 bg-white border border-[#B42318]/30 text-[#B42318] hover:bg-[#B42318]/5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject & Discard</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="enterprise-btn-secondary h-9 px-3.5 text-xs font-semibold"
              >
                {isEditing ? 'Done Editing' : 'Edit Manually'}
              </button>

              <button
                id="btn-confirm-save-ocr"
                type="button"
                onClick={handleConfirmAndSave}
                className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
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
