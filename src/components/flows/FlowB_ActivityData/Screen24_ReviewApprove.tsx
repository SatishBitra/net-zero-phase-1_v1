import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface BatchItem {
  id: string;
  date: string;
  source: string;
  quantity: number;
  unit: string;
  evidenceCount: number;
  evidenceName: string;
}

export const Screen24_ReviewApprove: React.FC = () => {
  const { navigateToScreen, showToast, addAuditLog } = useApp();

  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<string | null>(null);

  // Exact data from Screen 24 PRD specification
  const batchDetails = {
    id: '204',
    siteName: 'Chennai Plant 1',
    submittedBy: 'A. Kumar',
    submittedDate: '20-Aug-2025',
    items: [
      {
        id: 'ROW-204-01',
        date: '12-Aug-2025',
        source: 'Grid electricity',
        quantity: 48200,
        unit: 'kWh',
        evidenceCount: 1,
        evidenceName: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
      },
      {
        id: 'ROW-204-02',
        date: '15-Aug-2025',
        source: 'Diesel generator',
        quantity: 320,
        unit: 'Litres',
        evidenceCount: 1,
        evidenceName: 'Fuel_Delivery_Challan_DG3.pdf',
      },
    ] as BatchItem[],
  };

  const handleApprove = () => {
    setErrorMessage(null);

    // Audit event requirement: Who, When, What, Why
    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer',
      action: 'Approved Batch #204',
      previousValue: 'Batch #204: Awaiting Review (2 activity records)',
      newValue: 'Batch #204: Approved and Committed to GHG Inventory',
      source: 'Workflow & Approvals (Screen 24)',
      reason: comment || 'Verified against attached meter invoice and fuel delivery challan',
      status: 'Approved',
      lineItemId: 'Batch #204',
    });

    showToast('Batch #204 Approved', 'Activity data approved and committed to inventory.');
    // Navigates to Screen 25 — Approval History
    navigateToScreen('25_approval_history', 'FLOW_B');
  };

  const handleReturnForCorrection = () => {
    if (!comment.trim()) {
      setErrorMessage('Comment required before returning this submission.');
      return;
    }
    setErrorMessage(null);

    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer',
      action: 'Returned Batch #204 for correction',
      previousValue: 'Batch #204: Awaiting Review',
      newValue: 'Batch #204: Returned for correction to A. Kumar',
      source: 'Workflow & Approvals (Screen 24)',
      reason: comment,
      status: 'Returned',
      lineItemId: 'Batch #204',
    });

    showToast('Batch Returned', 'Returned to submitter for correction with feedback.');
    navigateToScreen('25_approval_history', 'FLOW_B');
  };

  const handleReject = () => {
    if (!comment.trim()) {
      setErrorMessage('Comment required before rejecting this submission.');
      return;
    }
    setErrorMessage(null);

    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer',
      action: 'Rejected Batch #204',
      previousValue: 'Batch #204: Awaiting Review',
      newValue: 'Batch #204: Rejected',
      source: 'Workflow & Approvals (Screen 24)',
      reason: comment,
      status: 'Rejected',
      lineItemId: 'Batch #204',
    });

    showToast('Batch Rejected', 'Batch #204 rejected. Logged to append-only audit trail.');
    navigateToScreen('25_approval_history', 'FLOW_B');
  };

  return (
    <div id="screen-24-container" className="max-w-5xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Workflow & Approvals</span>
              <span>›</span>
              <span 
                onClick={() => navigateToScreen('23_submission_queue', 'FLOW_B')} 
                className="cursor-pointer hover:underline"
              >
                Submission Queue
              </span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Batch #204</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/workflow/queue/204</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-normal text-[#171A1F]">
                Review Batch #204 — Chennai Plant 1
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#FEF0C7] text-[#B54708] border border-[#F79009]/30 text-xs font-medium">
                Awaiting Review
              </span>
            </div>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Inspect submitted activity rows and supporting evidence before making an approval decision.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('23_submission_queue', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Table (FR Section 9.1) */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden">
        <div className="p-4 border-b border-[#D9DDE3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-sm font-medium text-[#171A1F]">Submitted Activity Rows</h2>
          </div>
          <span className="text-xs text-[#5E6672] font-mono">
            Submitted by {batchDetails.submittedBy} on {batchDetails.submittedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium text-right">Quantity</th>
                <th className="py-3 px-4 font-medium">Unit</th>
                <th className="py-3 px-4 font-medium">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {batchDetails.items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8F9FB]">
                  <td className="py-3.5 px-4 font-mono text-[#5E6672]">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#171A1F]">
                    {item.source}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#171A1F]">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#5E6672]">
                    {item.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setActiveEvidenceModal(item.evidenceName)}
                      className="inline-flex items-center space-x-1.5 text-xs text-[#174A8B] hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#5E6672]" />
                      <span>{item.evidenceCount} file attached</span>
                      <span className="text-[11px] text-[#858C96]">({item.evidenceName})</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviewer Comment Area (Section 10) */}
      <div className="p-5 bg-white border border-[#D9DDE3] rounded space-y-3">
        <div>
          <label className="block text-xs font-semibold text-[#171A1F] uppercase tracking-wider mb-1">
            Reviewer comment
          </label>
          <p className="text-[11px] text-[#5E6672] mb-2">
            Field label: Comment · Mandatory on non-approval actions (Return for Correction or Reject).
          </p>
          <textarea
            id="reviewer-comment-input"
            rows={3}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Add a note (required if returning for correction)"
            className={`w-full px-3 py-2 text-xs border rounded text-[#171A1F] focus:outline-none ${
              errorMessage
                ? 'border-[#D92D20] bg-[#FEF0EF]/30 focus:border-[#D92D20]'
                : 'border-[#D9DDE3] focus:border-[#174A8B]'
            }`}
          />
        </div>

        {/* Validation error message */}
        {errorMessage && (
          <div className="p-2.5 bg-[#FEF0EF] border border-[#D92D20]/30 rounded text-xs text-[#D92D20] flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions (Section 10.1 & 10.2) */}
        <div className="pt-3 border-t border-[#F1F3F5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Reject (Destructive) */}
            <button
              id="btn-reject-batch"
              type="button"
              onClick={handleReject}
              className="px-4 py-2.5 sm:py-2 bg-white border border-[#D92D20] text-[#D92D20] hover:bg-[#FEF0EF] text-xs font-medium rounded transition-colors text-center"
            >
              Reject
            </button>

            {/* Return for Correction (Secondary) */}
            <button
              id="btn-return-correction"
              type="button"
              onClick={handleReturnForCorrection}
              className="px-4 py-2.5 sm:py-2 bg-white border border-[#F79009] text-[#B54708] hover:bg-[#FEF0C7] text-xs font-medium rounded transition-colors text-center"
            >
              Return for Correction
            </button>
          </div>

          {/* Approve (Primary) */}
          <button
            id="btn-approve-batch"
            type="button"
            onClick={handleApprove}
            className="px-6 py-2.5 sm:py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Audit Requirement Note (Section 10.3) */}
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
        <div>
          <strong>Audit Requirement:</strong> Every workflow action writes to an append-only audit trail recording: <em>Who (S. Iyer), When, What, and Why</em>. Recorded events are permanently preserved for verifier inspection.
        </div>
      </div>

      {/* Evidence Viewer Dialog Simulation */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#D9DDE3] max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">{activeEvidenceModal}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveEvidenceModal(null)}
                className="text-xs text-[#858C96] hover:text-[#171A1F]"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 bg-[#F8F9FB] border border-[#D9DDE3] rounded font-mono text-xs text-[#5E6672] text-center space-y-2">
              <div className="font-bold text-[#171A1F]">Primary Utility Evidence Document</div>
              <div>Source File: {activeEvidenceModal}</div>
              <div className="text-[11px] text-[#0F6B48]">Verified & attached from TC-ARC-002 repository</div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveEvidenceModal(null)}
                className="px-4 py-1.5 text-xs bg-[#174A8B] text-white rounded font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
