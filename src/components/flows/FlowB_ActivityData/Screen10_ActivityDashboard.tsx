import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord } from '../../../types';
import {
  Plus,
  ScanLine,
  Search,
  FileText,
  Clock,
  AlertCircle,
  Database,
  ShieldCheck,
  Files,
  ArrowRight,
  CheckCircle2,
  Layers,
  Flame,
  Zap,
  Building2,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
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
    currentRole,
  } = useApp();

  const [scopeFilter, setScopeFilter] = useState<'all' | 'Scope 1' | 'Scope 2' | 'Scope 3'>('all');

  const filteredRecords = records.filter((rec) => {
    const matchesSite = activeFilterSite === 'all' || rec.siteId === activeFilterSite;
    const matchesStatus = activeFilterStatus === 'all' || rec.status === activeFilterStatus;
    const matchesScope = scopeFilter === 'all' || rec.scope === scopeFilter;
    const matchesSearch =
      rec.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.date.includes(searchQuery);

    return matchesSite && matchesStatus && matchesScope && matchesSearch;
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
    <div id="screen-10-activity-dashboard" className="w-full space-y-6 pb-12">
      {/* Clean, Redesigned Page Header (Left Content Div Fixed & Streamlined) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#181B27] font-sans leading-tight">
              Carbon Accounting Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F7EF] text-[#16845B] border border-[#16845B]/20 shrink-0">
              ISO 14064 Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#858CA0] mt-1.5">
            <span className="font-semibold text-[#5141FF] bg-[#F2F0FF] px-2 py-0.5 rounded-md border border-[#E5E0FF] text-[11px]">
              {activePeriod.name}
            </span>
            <span>·</span>
            <span className="font-medium text-[#181B27]">3 Operational Facilities</span>
            <span>·</span>
            <span>IPCC AR6 / CEA v19 Lineage</span>
          </div>
        </div>

        {/* Clean, Focused Action Buttons on the Right */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentRole === 'VERIFIER' ? (
            <button
              onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
              className="enterprise-btn-primary shadow-xs"
            >
              <Files className="w-3.5 h-3.5" />
              <span>Trace Docket</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
                className="enterprise-btn-primary shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ingest Activity Data</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Core KPI Summary Cards: Balanced 4-Column Grid, Clean Hierarchy, Squircle Fill BG & Glow */}
      <section aria-label="Key operational metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* Card 1: Boundary Completeness */}
        <div
          onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
          className="group bg-white rounded-2xl border border-[#EEF0F6] hover:border-[#5141FF]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(28,31,58,0.04)] hover:shadow-[0_10px_24px_rgba(81,65,255,0.12)] hover:-translate-y-0.5"
        >
          {/* Top Chamber: Title + Subtitle on Left, Compact Glowing Squircle Icon on Right */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#181B27] tracking-tight truncate group-hover:text-[#5141FF] transition-colors">
                Boundary Completeness
              </h3>
              <p className="text-xs font-normal text-[#D97706] mt-1 truncate">
                Pune: 1 bill unlogged
              </p>
            </div>

            {/* Glowing Royal Purple Squircle Icon */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] via-[#5141FF] to-[#3B28CC] shadow-[0_8px_18px_-3px_rgba(81,65,255,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-xl pointer-events-none" />
              <Database className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white relative z-10 drop-shadow-xs" />
            </div>
          </div>

          {/* Full-width Divider Line */}
          <div className="border-t border-[#F0F2F6]" />

          {/* Bottom Chamber: Number on Left, Action on Right with generous space */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 bg-white">
            <span className="text-[18px] sm:text-[19px] font-bold font-sans text-[#181B27] tracking-tight truncate">
              96.4%
            </span>

            <span className="text-xs font-medium text-[#8C93A4] group-hover:text-[#5141FF] transition-colors shrink-0 whitespace-nowrap pl-1 flex items-center gap-1">
              <span>Upload Invoice</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Card 2: Calculation Blockers */}
        <div
          onClick={() => setActiveFilterStatus('Error')}
          className="group bg-white rounded-2xl border border-[#EEF0F6] hover:border-[#FB3256]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(28,31,58,0.04)] hover:shadow-[0_10px_24px_rgba(251,50,86,0.12)] hover:-translate-y-0.5"
        >
          {/* Top Chamber */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#181B27] tracking-tight truncate group-hover:text-[#FB3256] transition-colors">
                Calculation Blockers
              </h3>
              <p className="text-xs font-normal text-[#EF4444] mt-1 truncate">
                Diesel density required
              </p>
            </div>

            {/* Glowing Coral Red Squircle Icon */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FF5C7A] via-[#FB3256] to-[#E51F45] shadow-[0_8px_18px_-3px_rgba(251,50,86,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-xl pointer-events-none" />
              <AlertCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white relative z-10 drop-shadow-xs" />
            </div>
          </div>

          {/* Full-width Divider Line */}
          <div className="border-t border-[#F0F2F6]" />

          {/* Bottom Chamber */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 bg-white">
            <div className="flex items-baseline space-x-1.5 min-w-0 truncate">
              <span className="text-[18px] sm:text-[19px] font-bold font-sans text-[#DC2626] tracking-tight truncate">
                3
              </span>
              <span className="text-xs font-semibold text-[#DC2626] uppercase font-mono shrink-0">
                Blockers
              </span>
            </div>

            <span className="text-xs font-medium text-[#8C93A4] group-hover:text-[#FB3256] transition-colors shrink-0 whitespace-nowrap pl-1 flex items-center gap-1">
              <span>Resolve Errors</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Card 3: Review Queue */}
        <div
          onClick={() => navigateToScreen('24_review_approve', 'FLOW_B')}
          className="group bg-white rounded-2xl border border-[#EEF0F6] hover:border-[#F59E0B]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(28,31,58,0.04)] hover:shadow-[0_10px_24px_rgba(245,158,11,0.12)] hover:-translate-y-0.5"
        >
          {/* Top Chamber */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#181B27] tracking-tight truncate group-hover:text-[#F59E0B] transition-colors">
                Review Queue
              </h3>
              <p className="text-xs font-normal text-[#64748B] mt-1 truncate">
                Awaiting site reviewer
              </p>
            </div>

            {/* Glowing Amber Orange Squircle Icon */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FBBF24] via-[#F59E0B] to-[#D97706] shadow-[0_8px_18px_-3px_rgba(245,158,11,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-xl pointer-events-none" />
              <Clock className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white relative z-10 drop-shadow-xs" />
            </div>
          </div>

          {/* Full-width Divider Line */}
          <div className="border-t border-[#F0F2F6]" />

          {/* Bottom Chamber */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 bg-white">
            <div className="flex items-baseline space-x-1.5 min-w-0 truncate">
              <span className="text-[18px] sm:text-[19px] font-bold font-sans text-[#D97706] tracking-tight truncate">
                12
              </span>
              <span className="text-xs font-semibold text-[#D97706] uppercase font-mono shrink-0">
                Pending
              </span>
            </div>

            <span className="text-xs font-medium text-[#8C93A4] group-hover:text-[#F59E0B] transition-colors shrink-0 whitespace-nowrap pl-1 flex items-center gap-1">
              <span>Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Card 4: Audit Evidence */}
        <div
          onClick={() => navigateToScreen('22_trace_docket', 'FLOW_E')}
          className="group bg-white rounded-2xl border border-[#EEF0F6] hover:border-[#10B981]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(28,31,58,0.04)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.12)] hover:-translate-y-0.5"
        >
          {/* Top Chamber */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#181B27] tracking-tight truncate group-hover:text-[#10B981] transition-colors">
                Audit Evidence
              </h3>
              <p className="text-xs font-normal text-[#16845B] mt-1 truncate">
                Target: ≥95% (ISO 14064)
              </p>
            </div>

            {/* Glowing Emerald Green Squircle Icon */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#34D399] via-[#10B981] to-[#059669] shadow-[0_8px_18px_-3px_rgba(16,185,129,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-xl pointer-events-none" />
              <CheckCircle2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white relative z-10 drop-shadow-xs" />
            </div>
          </div>

          {/* Full-width Divider Line */}
          <div className="border-t border-[#F0F2F6]" />

          {/* Bottom Chamber */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 bg-white">
            <span className="text-[18px] sm:text-[19px] font-bold font-sans text-[#16845B] tracking-tight truncate">
              94.2%
            </span>

            <span className="text-xs font-medium text-[#8C93A4] group-hover:text-[#10B981] transition-colors shrink-0 whitespace-nowrap pl-1 flex items-center gap-1">
              <span>Trace Docket</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

      </section>

      {/* Activity Ingestion Ledger View (Operational Table + Filters) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#181B27]">Activity Data Ingestion Ledger</h2>
          <span className="text-xs font-mono font-semibold text-[#62697C] bg-white px-2.5 py-1 rounded-xl border border-[#E2E5EF]">
            {filteredRecords.length} records in {activePeriod.name}
          </span>
        </div>

        {/* Operational Filter Bar: Search on left, 3 Dropdowns on right with space-between */}
        <div className="p-3 bg-white border border-[#E2E5EF] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(28,31,58,0.03)]">
          {/* Left Side: Search Bar with reduced stroke & subtle border-radius */}
          <div className="relative w-full md:w-80 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#858CA0] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, site, invoice or ID…"
              className="w-full h-9 pl-9 pr-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 bg-white text-[#181B27] placeholder:text-[#858CA0] transition-colors"
            />
          </div>

          {/* Right Side: Three Dropdowns with matching subtle rounded-lg and clean 1px border stroke */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={activeFilterSite}
              onChange={(e) => setActiveFilterSite(e.target.value)}
              className="h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors cursor-pointer"
            >
              <option value="all">All Facilities (3 Sites)</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as any)}
              className="h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors cursor-pointer"
            >
              <option value="all">All Scopes</option>
              <option value="Scope 1">Scope 1 (Direct)</option>
              <option value="Scope 2">Scope 2 (Electricity)</option>
              <option value="Scope 3">Scope 3 (Value Chain)</option>
            </select>

            <select
              value={activeFilterStatus}
              onChange={(e) => setActiveFilterStatus(e.target.value)}
              className="h-9 px-3 text-xs border border-[#E2E5EF] hover:border-[#9AA5BE] rounded-lg bg-white text-[#181B27] focus:outline-none focus:border-[#5141FF] focus:ring-1 focus:ring-[#5141FF]/20 transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Submitted">Submitted (Pending Review)</option>
              <option value="Draft">Draft</option>
              <option value="Error">Flagged Error</option>
              <option value="Sent Back">Sent Back</option>
            </select>
          </div>
        </div>

        {/* Activity Data Table */}
        <section aria-label="Activity records ledger" className="glass-card-strong overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F8FC]/80 border-b border-[#E2E5EF] text-[#62697C] normal-case">
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] normal-case">Record ID</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] normal-case">Date</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] normal-case">Facility</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] normal-case">Emission Source</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] text-left normal-case">Quantity</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] normal-case">Unit</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] text-left normal-case">Calculated tCO₂e</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] text-center normal-case">Evidence</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] normal-case">Audit Status</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#181B27] text-left normal-case">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EF]/60">
                {filteredRecords.map((record) => {
                  const hasEvidence = record.evidenceFiles && record.evidenceFiles.length > 0;
                  return (
                    <tr
                      key={record.id}
                      onClick={() => handleRowClick(record)}
                      className="hover:bg-[#F2F0FF]/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-[#5141FF]">
                        {record.id}
                      </td>
                      <td className="py-3 px-4 text-[#62697C] font-mono">{record.date}</td>
                      <td className="py-3 px-4 text-[#181B27] font-semibold">{record.siteName}</td>
                      <td className="py-3 px-4">
                        <div className="text-[#181B27] font-medium">{record.sourceName}</div>
                        <span className="text-[10px] text-[#62697C] font-mono">{record.scope}</span>
                      </td>
                      <td className="py-3 px-4 text-left font-mono text-[#181B27] font-semibold">
                        {record.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[#62697C] font-mono">{record.unit}</td>
                      <td className="py-3 px-4 text-left font-mono text-[#181B27] font-bold">
                        {record.emissions_tCO2e.toFixed(3)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasEvidence ? (
                          <span className="text-xs text-[#5141FF] font-semibold inline-flex items-center gap-1 bg-[#F2F0FF] px-2 py-0.5 rounded-full">
                            <FileText className="w-3 h-3 text-[#5141FF]" />
                            <span>{record.evidenceFiles.length} docs</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#C52238] font-medium bg-[#FFF0F1] px-2 py-0.5 rounded-full">
                            Missing
                          </span>
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
                      <td className="py-3 px-4 text-left">
                        <span className="text-xs text-[#5141FF] group-hover:underline font-semibold inline-flex items-center gap-1">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
