import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  ArrowRight,
  ArrowLeft,
  History,
  ShieldCheck,
  Eye,
} from 'lucide-react';

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
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Workflow & Approvals</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Submission Queue</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/workflow/queue</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-normal text-[#171A1F]">Submission Queue</h1>
              <span className="px-2 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] text-xs font-medium border border-[#2166B1]/20">
                Four-Eye Workflow
              </span>
            </div>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Reviewers and Tenant Admins verify submitted activity data batches before committing to the carbon inventory.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('22_factors_reference', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Emission Factors</span>
            </button>

            <button
              onClick={() => navigateToScreen('25_approval_history', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-[#171A1F] rounded transition-colors font-medium"
            >
              <History className="w-3.5 h-3.5 text-[#5E6672]" />
              <span>Approval History</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Summary Metrics Cards (FR-23.01, FR-23.02, FR-23.03) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Awaiting Review */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5E6672] font-medium">Awaiting review</span>
            <Clock className="w-4 h-4 text-[#174A8B]" />
          </div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {metrics.awaitingReview}
          </div>
          <div className="text-[11px] text-[#5E6672] mt-0.5">
            Batches pending reviewer action
          </div>
        </div>

        {/* Returned for Correction */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B54708] font-medium">Returned for correction</span>
            <AlertCircle className="w-4 h-4 text-[#B54708]" />
          </div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {metrics.returnedForCorrection}
          </div>
          <div className="text-[11px] text-[#5E6672] mt-0.5">
            Returned to submitter with mandatory comments
          </div>
        </div>

        {/* Approved this period */}
        <div className="p-4 bg-white border border-[#D9DDE3] rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#0F6B48] font-medium">Approved this period</span>
            <CheckCircle2 className="w-4 h-4 text-[#0F6B48]" />
          </div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {metrics.approvedThisPeriod}
          </div>
          <div className="text-[11px] text-[#5E6672] mt-0.5">
            Committed to calculation engine for FY 2025–26
          </div>
        </div>
      </div>

      {/* Submissions Table (FR-23.04 - FR-23.08) */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden">
        <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Inbox className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-sm font-medium text-[#171A1F]">Pending Submissions</h2>
          </div>
          <span className="text-xs text-[#5E6672] font-mono">
            {submissions.length} batches pending
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-2.5 px-4 font-medium">Submitted</th>
              <th className="py-2.5 px-4 font-medium">Site</th>
              <th className="py-2.5 px-4 font-medium text-right">Rows</th>
              <th className="py-2.5 px-4 font-medium">Submitted By</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {submissions.map((item) => (
              <tr key={item.id} className="hover:bg-[#F8F9FB]">
                <td className="py-3.5 px-4 font-mono text-[#5E6672]">
                  {item.submittedDate}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#171A1F] flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-[#174A8B]" />
                  <span>{item.siteName}</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-medium text-[#171A1F]">
                  {item.rowsCount}
                </td>
                <td className="py-3.5 px-4 text-[#5E6672]">
                  {item.submittedBy}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    id={`btn-review-${item.id}`}
                    type="button"
                    onClick={() => handleReviewBatch(item.id)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors shadow-2xs"
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
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
        <div>
          <strong>Role-Based Access Control (FR-23.09):</strong> The submission queue is accessible exclusively to Reviewers/Approvers and Tenant Admins. Data entry submitters cannot approve their own submissions.
        </div>
      </div>
    </div>
  );
};
