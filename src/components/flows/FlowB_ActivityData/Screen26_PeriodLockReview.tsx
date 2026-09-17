import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const Screen26_PeriodLockReview: React.FC = () => {
  const {
    lockCurrentPeriod,
    navigateToScreen,
    showToast,
    addAuditLog,
  } = useApp();

  const [confirmationInput, setConfirmationInput] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Exact period string required by PRD Section 14
  const expectedText = 'FY 2025-26';
  const isMatch = confirmationInput.trim() === expectedText;

  // Exact summary info metrics from PRD Section 13.1
  const summaryInfo = {
    approvedRows: '2,046',
    pendingReview: '0',
    tCO2eLockedTotal: '28,270',
  };

  const handleLockPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!isMatch) {
      showToast('Validation Error', 'Enter “FY 2025-26” to confirm the lock.', 'error');
      return;
    }

    setIsLocking(true);

    // Audit event requirement (FR-26.11)
    addAuditLog({
      userName: 'Tenant Admin',
      role: 'TENANT_ADMIN',
      action: 'Locked Reporting Period FY 2025–26',
      previousValue: 'Period Status: Open (Active Ingestion)',
      newValue: 'Period Status: Permanently Locked (Read-Only)',
      source: 'Period Lock Workflow (Screen 26)',
      reason: 'All reviews resolved. Locked-in inventory total: 28,270 tCO2e across 2,046 rows',
      status: 'Locked',
      lineItemId: 'FY 2025–26',
    });

    lockCurrentPeriod();

    setTimeout(() => {
      setIsLocking(false);
      showToast(
        'Period Permanently Locked',
        'FY 2025–26 is now read-only. All calculations, activity data, and reports are frozen.'
      );
      // Navigates to Screen 27 — Report Builder
      navigateToScreen('27_report_builder', 'FLOW_E');
    }, 600);
  };

  return (
    <div id="screen-26-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Workflow & Approvals</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Period Lock</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/workflow/lock/fy2025-26</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">
              Lock Reporting Period — FY 2025–26
            </h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              High-risk destructive workflow requiring explicit typed confirmation from Tenant Admin.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('25_approval_history', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Approval History</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Risk Lock Warning Banner (Section 13) */}
      <div className="p-4 bg-[#FEF0EF] border-2 border-[#D92D20] rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-[#D92D20] font-medium text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>Irreversible Governance Action Warning</span>
        </div>
        <p className="text-xs text-[#7A271A] leading-relaxed">
          Locking this period makes all approved activity data, calculation results and reports permanently read-only. This cannot be undone. Any further changes require a new adjustment entry in the next open period.
        </p>
      </div>

      {/* Summary Information Cards (Section 13.1) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-semibold text-[#171A1F] uppercase tracking-wider">
          Final Verification Checkpoint
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded">
            <div className="text-xs text-[#5E6672]">Approved rows</div>
            <div className="text-xl font-normal text-[#171A1F] font-mono mt-1">
              {summaryInfo.approvedRows}
            </div>
            <div className="text-[11px] text-[#0F6B48] mt-0.5 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>All items approved</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded">
            <div className="text-xs text-[#5E6672]">Pending review</div>
            <div className="text-xl font-normal text-[#171A1F] font-mono mt-1">
              {summaryInfo.pendingReview}
            </div>
            <div className="text-[11px] text-[#5E6672] mt-0.5">
              Zero pending items
            </div>
          </div>

          <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded">
            <div className="text-xs text-[#174A8B] font-medium">tCO2e locked-in total</div>
            <div className="text-xl font-normal text-[#174A8B] font-mono mt-1">
              {summaryInfo.tCO2eLockedTotal}
            </div>
            <div className="text-[11px] text-[#858C96] mt-0.5">
              Permanent baseline snapshot
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Form (Section 14 & Section 31) */}
      <form onSubmit={handleLockPeriod} className="p-6 bg-white border border-[#D9DDE3] rounded-lg space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#171A1F] mb-1">
            Confirm by typing the period name
          </label>
          <p className="text-xs text-[#5E6672] mb-2">
            Type exactly <strong className="font-mono text-[#171A1F]">FY 2025-26</strong> below to unlock the period lock action:
          </p>
          <input
            id="input-confirm-period-lock"
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="FY 2025-26"
            className={`w-full max-w-md px-3.5 py-2 text-xs border rounded font-mono ${
              attemptedSubmit && !isMatch
                ? 'border-[#D92D20] bg-[#FEF0EF]/40 focus:border-[#D92D20]'
                : isMatch
                ? 'border-[#0F6B48] bg-[#E8F5E9]/30 text-[#171A1F]'
                : 'border-[#D9DDE3] focus:border-[#174A8B]'
            }`}
          />

          {/* Explicit error validation message from PRD Section 31 */}
          {attemptedSubmit && !isMatch && (
            <p className="text-xs text-[#D92D20] mt-1.5 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Enter “FY 2025-26” to confirm the lock.</span>
            </p>
          )}
        </div>

        {/* Actions (Section 14.1) */}
        <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateToScreen('25_approval_history', 'FLOW_B')}
            className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-lock-period-confirm"
            type="submit"
            disabled={!isMatch || isLocking}
            className={`px-5 py-2 text-xs font-medium rounded transition-colors flex items-center space-x-2 shadow-sm ${
              isMatch
                ? 'bg-[#D92D20] hover:bg-[#B42318] text-white cursor-pointer'
                : 'bg-[#F1F3F5] text-[#858C96] border border-[#D9DDE3] cursor-not-allowed'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLocking ? 'Locking Period…' : 'Lock Period'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* RBAC & Governance Note */}
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] flex items-start space-x-2">
        <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
        <div>
          <strong>FR-26.01:</strong> Only authorised Tenant Admin users can initiate period lock. Once locked, calculations become immutable snapshots and reports become read-only.
        </div>
      </div>
    </div>
  );
};
