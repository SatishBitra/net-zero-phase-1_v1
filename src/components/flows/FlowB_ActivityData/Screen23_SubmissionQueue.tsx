import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Inbox,
  Building2,
  ArrowRight,
  ArrowLeft,
  History,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';

interface SubmissionBatch {
  id: string;
  submittedDate: string;
  siteName: string;
  rowsCount: number;
  submittedBy: string;
  status: 'Awaiting Review' | 'Returned for Correction' | 'Approved';
}

export const Screen23_SubmissionQueue: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  // Summary metrics from PRD specification (FR-23.01, 23.02, 23.03)
  const metrics = {
    awaitingReview: 34,
    returnedForCorrection: 6,
    approvedThisPeriod: 212,
  };

  // Submissions table from Screen 23 PRD specification
  const submissions: SubmissionBatch[] = [
    {
      id: 'batch-204',
      submittedDate: '20-Aug-2025',
      siteName: 'Chennai Plant 1',
      rowsCount: 18,
      submittedBy: 'A. Kumar',
      status: 'Awaiting Review',
    },
    {
      id: 'batch-201',
      submittedDate: '19-Aug-2025',
      siteName: 'Pune Warehouse',
      rowsCount: 9,
      submittedBy: 'A. Kumar',
      status: 'Awaiting Review',
    },
  ];

  const handleReviewBatch = (batchId: string) => {
    showToast('Opening Review Batch', `Loading batch #${batchId.replace('batch-', '')} for Four-Eye verification.`);
    // Navigates to Screen 24
    navigateToScreen('24_review_approve', 'FLOW_B');
  };

  return (
    <div id="screen-23-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Workflow & Approvals' },
          { label: 'Submission Queue' },
        ]}
        title="Submission Queue"
        description="Reviewers and Tenant Admins verify submitted activity data batches before committing to the carbon inventory."
        badge={
          <StatusBadge status="Pending" customLabel="Four-Eye Workflow" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /workflow/queue
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('22_factors_reference', 'FLOW_E')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Emission Factors</span>
            </button>

            <button
              onClick={() => navigateToScreen('25_approval_history', 'FLOW_B')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <History className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Approval History</span>
            </button>
          </div>
        }
      />

      {/* 3 Summary Metrics Cards (FR-23.01, FR-23.02, FR-23.03) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Awaiting review"
          value={metrics.awaitingReview}
          subtext="Batches pending reviewer action"
          statusDot="warning"
        />

        <KpiCard
          label="Returned for correction"
          value={metrics.returnedForCorrection}
          subtext="Returned with mandatory comments"
          statusDot="neutral"
        />

        <KpiCard
          label="Approved this period"
          value={metrics.approvedThisPeriod}
          subtext="Committed for FY 2025–26 calculation"
          statusDot="success"
        />
      </div>

      {/* Submissions Table (FR-23.04 - FR-23.08) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Inbox className="w-4 h-4 text-[#6254E8]" />
            <h2 className="text-sm font-semibold text-[#17181A] font-sans">Pending Submissions</h2>
          </div>
          <span className="text-xs text-[#5F6368] font-sans font-medium">
            {submissions.length} batches pending
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F4F5F6] border-b border-[#E5E7EB] text-[#5F6368]">
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Submitted</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Site</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Rows</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Submitted By</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {submissions.map((item) => (
              <tr key={item.id} className="hover:bg-[#FAFAFB] transition-colors">
                <td className="py-3.5 px-4 period-code text-[#5F6368]">
                  {item.submittedDate}
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#17181A] flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-[#6254E8]" />
                  <span>{item.siteName}</span>
                </td>
                <td className="py-3.5 px-4 text-right period-code font-medium text-[#17181A]">
                  {item.rowsCount}
                </td>
                <td className="py-3.5 px-4 text-[#5F6368] font-data">
                  {item.submittedBy}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    id={`btn-review-${item.id}`}
                    type="button"
                    onClick={() => handleReviewBatch(item.id)}
                    className="enterprise-btn-primary h-8 px-3 text-xs inline-flex items-center space-x-1 shadow-2xs"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RBAC Notice */}
      <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2.5 shadow-2xs font-data">
        <ShieldCheck className="w-4 h-4 text-[#6254E8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#17181A] font-semibold">Role-Based Access Control (FR-23.09):</strong> The submission queue is accessible exclusively to Reviewers/Approvers and Tenant Admins. Data entry submitters cannot approve their own submissions.
        </div>
      </div>
    </div>
  );
};
