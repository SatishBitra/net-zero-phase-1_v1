import React from 'react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord } from '../../../types';
import {
  Plus,
  ScanLine,
  Search,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  ShieldCheck,
  Files,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';
import { QuickActionsMenu } from '../../common/QuickActionsMenu';

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
    currentRole,
    openFactorHelper,
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

  const handleRowClick = (rec: ActivityRecord) => {
    setSelectedRecordId(rec.id);
    if (currentRole === 'VERIFIER') {
      navigateToScreen('32_evidence_trace', 'FLOW_F');
    } else if (rec.status === 'Submitted') {
      navigateToScreen('24_review_approve', 'FLOW_B');
    } else if (rec.status === 'Error' || rec.status === 'Sent Back') {
      navigateToScreen('15_fix_detail_view', 'FLOW_C');
    } else {
      navigateToScreen('16_attach_evidence', 'FLOW_B');
    }
  };

  return (
    <div id="screen-10-activity-dashboard" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Ingestion' },
          { label: 'Dashboard' },
        ]}
        title="Activity Data Dashboard"
        description="Operational workspace for manual data entry, bulk CSV imports, utility bill OCR, and submission status."
        actions={
          currentRole === 'VERIFIER' ? (
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] rounded-full border border-[#01153C]/20 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#01153C]" />
                <span>Auditor Inspection Mode (Read-Only)</span>
              </span>
              <button
                onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#01153C] rounded-full hover:bg-[#02215c] shadow-sm inline-flex items-center space-x-1.5 transition-all"
              >
                <Files className="w-3.5 h-3.5" />
                <span>Trace Evidence</span>
              </button>
              <QuickActionsMenu variant="page" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#01153C] rounded-full hover:bg-[#02215c] shadow-sm inline-flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Entry</span>
              </button>

              <button
                onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
                className="px-4 py-2 text-xs font-semibold text-[#01153C] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] shadow-2xs inline-flex items-center space-x-1.5 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#5F6368]" />
                <span>Import CSV</span>
              </button>

              <button
                onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
                className="px-4 py-2 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] border border-[#DCE5F5] rounded-full hover:bg-[#DCE5F5] shadow-2xs inline-flex items-center space-x-1.5 transition-all"
              >
                <ScanLine className="w-3.5 h-3.5 text-[#01153C]" />
                <span>Upload Bill OCR</span>
              </button>

              <button
                id="btn-factor-helper"
                type="button"
                onClick={() => openFactorHelper()}
                className="px-4 py-2 text-xs font-semibold text-[#01153C] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] shadow-2xs inline-flex items-center space-x-1.5 transition-all"
                title="Search and verify IPCC and IEA emission factors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#01153C]" />
                <span>Factor Helper</span>
                <span className="text-[10px] bg-[#EDF2FA] text-[#01153C] px-1.5 py-0.2 rounded font-bold">
                  IPCC/IEA
                </span>
              </button>

              <QuickActionsMenu variant="page" />
            </div>
          )
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <KpiCard
          label="Total Records"
          value={totalDisplayRows.toLocaleString()}
          subtext={`Reporting period: ${activePeriod.name}`}
          icon={<Database className="w-4 h-4 text-[#8A8F98]" />}
          change="1,842 total"
        />

        <KpiCard
          label="Data Quality / Validated"
          value={`${validatedPercent}%`}
          subtext="Passes bounds & factor checks"
          icon={<CheckCircle2 className="w-4 h-4 text-[#0F9D58]" />}
          change="+1.4%"
        />

        <KpiCard
          label="Pending Review"
          value={pendingReviewCount.toString()}
          subtext={currentRole === 'DATA_ENTRY' ? 'Submitted awaiting review' : 'Awaiting Reviewer approval'}
          statusDot="warning"
          icon={<Clock className="w-4 h-4 text-[#F59E0B]" />}
          change={currentRole === 'DATA_ENTRY' ? 'My submissions →' : 'Review queue →'}
          onClick={() => {
            setActiveFilterStatus('Submitted');
            if (currentRole === 'DATA_ENTRY') {
              navigateToScreen('23_submission_queue', 'FLOW_B');
            } else {
              navigateToScreen('24_review_approve', 'FLOW_B');
            }
          }}
        />

        <KpiCard
          label="Flagged / Attention"
          value={flaggedCount.toString()}
          subtext="Validation discrepancies"
          statusDot="error"
          icon={<AlertCircle className="w-4 h-4 text-[#ED2024]" />}
          change="Fix errors →"
          onClick={() => {
            setActiveFilterStatus('Error');
            navigateToScreen('15_fix_detail_view', 'FLOW_C');
          }}
        />
      </div>

      {/* Persistent Filters Bar */}
      <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, site, or ID…"
              className="w-full pl-8 pr-4 py-1.5 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#01153C]/20 focus:border-[#01153C] bg-white text-[#17181A]"
            />
          </div>

          {/* Site Filter */}
          <select
            value={activeFilterSite}
            onChange={(e) => setActiveFilterSite(e.target.value)}
            className="px-3.5 py-1.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#01153C]"
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
            className="px-3.5 py-1.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#01153C]"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Submitted">Submitted (Pending Review)</option>
            <option value="Draft">Draft</option>
            <option value="Error">Flagged / Error</option>
            <option value="Sent Back">Sent Back to Data Entry</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#5F6368] font-data">
          <span>Displaying {filteredRecords.length} active records</span>
        </div>
      </div>

      {/* Activity Data Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Record ID</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Date</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Site</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Emission Source</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Quantity</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Unit</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Calculated tCO2e</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-center">Evidence</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Status</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredRecords.map((record) => {
                const hasEvidence = record.evidenceFiles && record.evidenceFiles.length > 0;
                return (
                  <tr
                    key={record.id}
                    onClick={() => handleRowClick(record)}
                    className="hover:bg-[#FAFAFB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 activity-id font-medium text-[#01153C]">
                      {record.id}
                    </td>
                    <td className="py-3 px-4 text-[#5F6368] font-data">{record.date}</td>
                    <td className="py-3 px-4 text-[#17181A] font-semibold">{record.siteName}</td>
                    <td className="py-3 px-4">
                      <div className="text-[#17181A] font-medium">{record.sourceName}</div>
                      <span className="text-[10px] text-[#8A8F98] font-data">{record.scope}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-data text-[#17181A] font-semibold">
                      {record.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#5F6368] font-data">{record.unit}</td>
                    <td className="py-3 px-4 text-right font-data text-[#17181A] font-medium">
                      {record.emissions_tCO2e.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {hasEvidence ? (
                        <span
                          className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#EDF2FA] text-[#01153C] text-[10px] font-semibold border border-[#DCE5F5]"
                          title={record.evidenceFiles[0].name}
                        >
                          <FileText className="w-3 h-3" />
                          <span>{record.evidenceFiles.length} file</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8A8F98] italic font-data">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={
                          record.status === 'Approved'
                            ? 'Approved'
                            : record.status === 'Submitted'
                            ? 'Submitted'
                            : record.status === 'Under Review'
                            ? 'Under Review'
                            : record.status === 'Draft'
                            ? 'Draft'
                            : record.status === 'Error' || record.status === 'Sent Back'
                            ? 'Rejected'
                            : 'Approved'
                        }
                        customLabel={record.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-[#01153C] group-hover:underline font-semibold">
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
