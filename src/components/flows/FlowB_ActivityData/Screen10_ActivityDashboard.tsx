import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord, ActivityRecordStatus } from '../../../types';
import {
  Plus,
  Upload,
  ScanLine,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  ArrowRight,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

export const Screen10_ActivityDashboard: React.FC = () => {
  const {
    records,
    sites,
    activePeriod,
    navigateToScreen,
    setSelectedRecordId,
    activeFilterSite,
    setActiveFilterSite,
    activeFilterStatus,
    setActiveFilterStatus,
    searchQuery,
    setSearchQuery,
  } = useApp();

  // Metrics specified in PRD Screen 10:
  // 1,842 rows this period, 96% validated, 12 pending review, 3 flagged
  const totalDisplayRows = 1842;
  const validatedPercent = 96;
  const pendingReviewCount = records.filter((r) => r.status === 'Submitted').length + 11;
  const flaggedCount = records.filter((r) => r.status === 'Error' || r.status === 'Sent Back').length + 2;

  // Filter local record list
  const filteredRecords = records.filter((rec) => {
    const matchesSite = activeFilterSite === 'all' || rec.siteId === activeFilterSite;
    const matchesStatus = activeFilterStatus === 'all' || rec.status === activeFilterStatus;
    const matchesSearch =
      rec.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.date.includes(searchQuery);

    return matchesSite && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ActivityRecordStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20">
            ✓ Approved
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F3F5] text-[#174A8B] border border-[#D9DDE3]">
            ● Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF2FB] text-[#2166B1]">
            ⟳ Under Review
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F8F9FB] text-[#5E6672] border border-[#D9DDE3]">
            ○ Draft
          </span>
        );
      case 'Error':
      case 'Sent Back':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF0EF] text-[#B42318] border border-[#D92D20]/20">
            ! {status === 'Error' ? 'Flagged / Error' : 'Sent Back'}
          </span>
        );
      case 'Locked':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F3F5] text-[#858C96]">
            🔒 Locked
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const handleRowClick = (rec: ActivityRecord) => {
    setSelectedRecordId(rec.id);
    if (rec.status === 'Submitted') {
      navigateToScreen('24_review_approve', 'FLOW_B');
    } else if (rec.status === 'Error' || rec.status === 'Sent Back') {
      navigateToScreen('15_fix_detail_view', 'FLOW_C');
    } else {
      navigateToScreen('16_attach_evidence', 'FLOW_B');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <h1 className="text-xl font-normal text-[#171A1F]">Activity Data Dashboard</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Operational workspace for manual data entry, bulk CSV imports, utility bill OCR, and submission status.
          </p>
        </div>

        {/* 3 Primary Data Ingestion CTAs */}
        <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-2">
          {/* Path 1: Manual Entry */}
          <button
            onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
            className="px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>

          {/* Path 2: Bulk CSV Import */}
          <button
            onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
            className="px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#171A1F] rounded-md transition-colors flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5E6672]" />
            <span>Import CSV</span>
          </button>

          {/* Path 3: Electricity Bill OCR */}
          <button
            onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
            className="px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#171A1F] rounded-md transition-colors flex items-center space-x-1.5"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#2166B1]" />
            <span>Upload Bill OCR</span>
          </button>
        </div>
      </div>

      {/* Recommended Dashboard Structure Metrics (Screen 10 PRD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg">
          <div className="text-xs text-[#5E6672]">Total Records</div>
          <div className="text-xl font-normal text-[#171A1F] mt-1 font-mono">{totalDisplayRows.toLocaleString()}</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Reporting period: {activePeriod.name}</div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg">
          <div className="text-xs text-[#5E6672]">Data Quality / Validated</div>
          <div className="text-xl font-normal text-[#174A8B] mt-1 font-mono">{validatedPercent}%</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Passes bounds & factor checks</div>
        </div>

        <div
          onClick={() => {
            setActiveFilterStatus('Submitted');
            navigateToScreen('24_review_approve', 'FLOW_B');
          }}
          className="p-4 bg-white border border-[#D9DDE3] rounded-lg hover:border-[#2166B1] cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5E6672]">Pending Review</span>
            <span className="text-[10px] text-[#2166B1] group-hover:underline">Review Queue →</span>
          </div>
          <div className="text-xl font-normal text-[#171A1F] mt-1 font-mono">{pendingReviewCount}</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Awaiting Reviewer approval</div>
        </div>

        <div
          onClick={() => {
            setActiveFilterStatus('Error');
            navigateToScreen('15_fix_detail_view', 'FLOW_C');
          }}
          className="p-4 bg-white border border-[#D9DDE3] rounded-lg hover:border-[#D92D20] cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B42318]">Flagged / Attention</span>
            <span className="text-[10px] text-[#D92D20] group-hover:underline">Fix Errors →</span>
          </div>
          <div className="text-xl font-normal text-[#B42318] mt-1 font-mono">{flaggedCount}</div>
          <div className="text-[11px] text-[#858C96] mt-0.5">Validation discrepancies</div>
        </div>
      </div>

      {/* Persistent Filters Bar */}
      <div className="p-3.5 bg-white border border-[#D9DDE3] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#858C96] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, site, or ID…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
            />
          </div>

          {/* Site Filter */}
          <select
            value={activeFilterSite}
            onChange={(e) => setActiveFilterSite(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-white text-[#5E6672]"
          >
            <option value="all">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={activeFilterStatus}
            onChange={(e) => setActiveFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-white text-[#5E6672]"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Submitted">Submitted (Pending Review)</option>
            <option value="Draft">Draft</option>
            <option value="Error">Flagged / Error</option>
            <option value="Sent Back">Sent Back to Data Entry</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#858C96]">
          <span>Displaying {filteredRecords.length} active records</span>
        </div>
      </div>

      {/* Activity Data Table (PRD Screen 10 specification) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Record ID</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Site</th>
                <th className="py-2.5 px-4 font-medium">Emission Source</th>
                <th className="py-2.5 px-4 font-medium text-right">Quantity</th>
                <th className="py-2.5 px-4 font-medium">Unit</th>
                <th className="py-2.5 px-4 font-medium text-right">Calculated tCO2e</th>
                <th className="py-2.5 px-4 font-medium text-center">Evidence</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredRecords.map((record) => {
                const hasEvidence = record.evidenceFiles && record.evidenceFiles.length > 0;
                return (
                  <tr
                    key={record.id}
                    onClick={() => handleRowClick(record)}
                    className="hover:bg-[#F8F9FB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-[#174A8B]">
                      {record.id}
                    </td>
                    <td className="py-3 px-4 text-[#5E6672] font-mono">{record.date}</td>
                    <td className="py-3 px-4 text-[#171A1F] font-medium">{record.siteName}</td>
                    <td className="py-3 px-4">
                      <div className="text-[#171A1F]">{record.sourceName}</div>
                      <span className="text-[10px] text-[#858C96]">{record.scope}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#171A1F] font-medium">
                      {record.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#5E6672] font-mono">{record.unit}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#171A1F]">
                      {record.emissions_tCO2e.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {hasEvidence ? (
                        <span
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B] text-[10px] font-medium"
                          title={record.evidenceFiles[0].name}
                        >
                          <FileText className="w-3 h-3" />
                          <span>{record.evidenceFiles.length} file</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#858C96] italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-[#2166B1] group-hover:underline">
                        Open →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
