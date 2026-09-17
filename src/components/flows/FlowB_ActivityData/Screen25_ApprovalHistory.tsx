import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  History,
  CheckCircle2,
  AlertCircle,
  Filter,
  Calendar,
  Building2,
  ArrowRight,
  ArrowLeft,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface ApprovalHistoryRow {
  batchId: string;
  siteName: string;
  reviewedBy: string;
  date: string;
  outcome: 'Approved' | 'Returned' | 'Rejected';
  comment: string;
}

export const Screen25_ApprovalHistory: React.FC = () => {
  const { navigateToScreen } = useApp();

  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [periodFilter, setPeriodFilter] = useState('FY 2025–26');

  // Exact data from Screen 25 PRD specification
  const historyData: ApprovalHistoryRow[] = [
    {
      batchId: '#204',
      siteName: 'Chennai Plant 1',
      reviewedBy: 'S. Iyer',
      date: '20-Aug-2025',
      outcome: 'Approved',
      comment: 'Verified against primary meter bill and fuel delivery receipts',
    },
    {
      batchId: '#203',
      siteName: 'Chennai Plant 1',
      reviewedBy: 'S. Iyer',
      date: '18-Aug-2025',
      outcome: 'Approved',
      comment: '—',
    },
    {
      batchId: '#198',
      siteName: 'Pune Warehouse',
      reviewedBy: 'S. Iyer',
      date: '15-Aug-2025',
      outcome: 'Returned',
      comment: 'Missing evidence for 2 rows',
    },
  ];

  const filteredHistory = historyData.filter((item) => {
    if (siteFilter !== 'All Sites' && item.siteName !== siteFilter) return false;
    return true;
  });

  return (
    <div id="screen-25-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Workflow & Approvals</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Approval History</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/workflow/history</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-normal text-[#171A1F]">Approval History</h1>
              <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#5E6672] text-xs font-mono border border-[#D9DDE3]">
                Read-only historical ledger
              </span>
            </div>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Immutable ledger of review decisions, timestamps, reviewer identities, and feedback comments.
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

            <button
              onClick={() => navigateToScreen('26_period_lock', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] transition-colors font-medium shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Period Lock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (FR-25.07, FR-25.08) */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-3.5 h-3.5 text-[#5E6672]" />
            <label className="text-xs font-medium text-[#5E6672]">Site:</label>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            >
              <option value="All Sites">All Sites</option>
              <option value="Chennai Plant 1">Chennai Plant 1</option>
              <option value="Pune Warehouse">Pune Warehouse</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#5E6672]" />
            <label className="text-xs font-medium text-[#5E6672]">Period:</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            >
              <option value="FY 2025–26">FY 2025–26</option>
              <option value="FY 2024–25">FY 2024–25</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-xs text-[#174A8B] hover:underline flex items-center space-x-1 font-medium"
        >
          <span>View Comprehensive Audit Trail (Screen 35)</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* History Table (FR-25.01 - FR-25.06) */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-3 px-4 font-medium">Batch</th>
              <th className="py-3 px-4 font-medium">Site</th>
              <th className="py-3 px-4 font-medium">Reviewed By</th>
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Outcome</th>
              <th className="py-3 px-4 font-medium">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {filteredHistory.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FB]">
                <td className="py-3.5 px-4 font-mono font-medium text-[#174A8B]">
                  {item.batchId}
                </td>
                <td className="py-3.5 px-4 text-[#171A1F] font-medium">
                  {item.siteName}
                </td>
                <td className="py-3.5 px-4 text-[#5E6672]">
                  {item.reviewedBy}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#5E6672]">
                  {item.date}
                </td>
                <td className="py-3.5 px-4">
                  {item.outcome === 'Approved' ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-medium border border-[#0F6B48] text-[#0F6B48] bg-white">
                      <CheckCircle2 className="w-3 h-3 text-[#0F6B48]" />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-medium border border-[#F79009] text-[#B54708] bg-white">
                      <AlertCircle className="w-3 h-3 text-[#B54708]" />
                      <span>Returned</span>
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-[#5E6672] max-w-xs truncate">
                  {item.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-[#858C96] text-center pt-2">
        Approval history records are immutable and permanently available to verification auditors.
      </div>
    </div>
  );
};
