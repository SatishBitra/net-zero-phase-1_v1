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
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';

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
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
              className="enterprise-btn-primary h-9 px-3.5 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>

            <button
              onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold text-[#6254E8]"
            >
              <ScanLine className="w-3.5 h-3.5 text-[#6254E8]" />
              <span>Upload Bill OCR</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div
          onClick={() => {
            setActiveFilterStatus('Submitted');
            navigateToScreen('24_review_approve', 'FLOW_B');
          }}
          className="h-full"
        >
          <KpiCard
            label="Pending Review"
            value={pendingReviewCount.toString()}
            subtext="Awaiting Reviewer approval"
            statusDot="warning"
            icon={<Clock className="w-4 h-4 text-[#F59E0B]" />}
            change="Review queue →"
            className="cursor-pointer"
          />
        </div>

        <div
          onClick={() => {
            setActiveFilterStatus('Error');
            navigateToScreen('15_fix_detail_view', 'FLOW_C');
          }}
          className="h-full"
        >
          <KpiCard
            label="Flagged / Attention"
            value={flaggedCount.toString()}
            subtext="Validation discrepancies"
            statusDot="error"
            icon={<AlertCircle className="w-4 h-4 text-[#B42318]" />}
            change="Fix errors →"
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Persistent Filters Bar */}
      <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, site, or ID…"
              className="w-full pl-8 pr-4 py-1.5 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
            />
          </div>

          {/* Site Filter */}
          <select
            value={activeFilterSite}
            onChange={(e) => setActiveFilterSite(e.target.value)}
            className="px-3.5 py-1.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A]"
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
            className="px-3.5 py-1.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A]"
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
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs font-sans">
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
                    <td className="py-3 px-4 activity-id font-medium text-[#6254E8]">
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
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-[#6254E8]/10 text-[#6254E8] text-[10px] font-semibold border border-[#6254E8]/20"
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
                      <span className="text-[11px] text-[#6254E8] group-hover:underline font-semibold">
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
