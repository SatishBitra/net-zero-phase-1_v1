import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Lock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen26_PeriodLockReview: React.FC = () => {
  const {
    lockCurrentPeriod,
    navigateToScreen,
    showToast,
    addAuditLog,
    currentRole,
    currentUser,
  } = useApp();

  const [confirmationInput, setConfirmationInput] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const canLock = currentRole === 'TENANT_ADMIN';

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
    if (!canLock) {
      showToast('Access Denied', 'Only Tenant Administrators can execute period lock governance.', 'error');
      return;
    }
    setAttemptedSubmit(true);

    if (!isMatch) {
      showToast('Validation Error', 'Enter “FY 2025-26” to confirm the lock.', 'error');
      return;
    }

    setIsLocking(true);

    // Audit event requirement (FR-26.11)
    addAuditLog({
      userName: currentUser.name,
      role: 'Tenant Admin',
      action: 'Locked Reporting Period FY 2025–26',
      previousValue: 'Period Status: Open (Active Ingestion)',
      newValue: 'Period Status: Permanently Locked (Read-Only)',
      source: 'Period Lock Governance',
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
    <div id="screen-26-container" className="w-full space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Workflow & Approvals' },
          { label: 'Period Lock' },
        ]}
        title="Lock Reporting Period — FY 2025–26"
        badge={
          <StatusBadge status="Locked" customLabel="Admin Governance" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /workflow/lock/fy2025-26
          </span>
        }
        actions={
          <button
            onClick={() => navigateToScreen('25_approval_history', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Approval History</span>
          </button>
        }
      />

      {/* High-Risk Lock Warning Banner (Section 13) */}
      {!canLock ? (
        <div className="p-4 bg-[#FEF1F1] border border-[#FED2D3] rounded-xl space-y-2 shadow-2xs">
          <div className="flex items-center space-x-2 text-[#ED2024] font-semibold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Unauthorized Governance Action: Tenant Admin Required</span>
          </div>
          <p className="text-xs text-[#7A271A] leading-relaxed font-data">
            You are currently logged in as <strong className="underline">{currentUser.name} ({currentRole})</strong>.
            Under enterprise segregation of duties, only designated <strong>Tenant Administrators</strong> have authority to permanently lock or seal reporting periods.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-[#FEF0EF] border border-[#ED2024]/40 rounded-xl space-y-2 shadow-2xs">
          <div className="flex items-center space-x-2 text-[#ED2024] font-semibold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Irreversible Governance Action Warning</span>
          </div>
          <p className="text-xs text-[#7A271A] leading-relaxed font-data">
            Locking this period makes all approved activity data, calculation results and reports permanently read-only. This cannot be undone. Any further changes require a new adjustment entry in the next open period.
          </p>
        </div>
      )}

      {/* Summary Information Cards (Section 13.1) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4 shadow-2xs">
        <h2 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider font-sans">
          Final Verification Checkpoint
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Approved rows"
            value={summaryInfo.approvedRows}
            subtext="All items approved"
            statusDot="success"
          />

          <KpiCard
            label="Pending review"
            value={summaryInfo.pendingReview}
            subtext="Zero pending items"
            statusDot="neutral"
          />

          <KpiCard
            label="tCO2e locked total"
            value={summaryInfo.tCO2eLockedTotal}
            subtext="Permanent baseline snapshot"
            statusDot="brand"
          />
        </div>
      </div>

      {/* Confirmation Form (Section 14 & Section 31) */}
      <form onSubmit={handleLockPeriod} className="p-6 bg-white border border-[#E5E7EB] rounded-xl space-y-5 shadow-2xs">
        <div>
          <label className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
            Confirm by typing the period name
          </label>
          <p className="text-xs text-[#5F6368] mb-2 font-data">
            Type exactly <strong className="period-code font-semibold text-[#17181A]">FY 2025-26</strong> below to unlock the period lock action:
          </p>
          <input
            id="input-confirm-period-lock"
            type="text"
            disabled={!canLock}
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={canLock ? "FY 2025-26" : "Action restricted to Tenant Admin"}
            className={`w-full max-w-md px-3.5 py-2 text-xs border rounded-lg period-code ${
              !canLock
                ? 'bg-[#F4F5F6] text-[#8A8F98] border-[#E5E7EB] cursor-not-allowed'
                : attemptedSubmit && !isMatch
                ? 'border-[#ED2024] bg-[#FEF0EF]/40 focus:border-[#ED2024]'
                : isMatch
                ? 'border-[#0F6B48] bg-[#E8F5E9]/30 text-[#17181A]'
                : 'border-[#E5E7EB] focus:border-[#01153C]'
            }`}
          />

          {/* Explicit error validation message from PRD Section 31 */}
          {attemptedSubmit && !isMatch && canLock && (
            <p className="text-xs text-[#ED2024] mt-1.5 flex items-center space-x-1 font-data">
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
            className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            id="btn-lock-period-confirm"
            type="submit"
            disabled={!canLock || !isMatch || isLocking}
            className={`h-9 px-5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-xs ${
              canLock && isMatch
                ? 'bg-[#ED2024] hover:bg-[#ED2024] text-white cursor-pointer'
                : 'bg-[#F1F3F5] text-[#8A8F98] border border-[#E5E7EB] cursor-not-allowed'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLocking ? 'Locking Period…' : 'Lock Period'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* RBAC & Governance Note */}
      <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2.5 shadow-2xs font-data">
        <Info className="w-4 h-4 text-[#01153C] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#17181A] font-semibold">FR-26.01:</strong> Only authorised Tenant Admin users can initiate period lock. Once locked, calculations become immutable snapshots and reports become read-only.
        </div>
      </div>
    </div>
  );
};
