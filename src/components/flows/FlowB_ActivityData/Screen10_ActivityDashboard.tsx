import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord, UserRole } from '../../../types';
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
  BookOpen,
  SlidersHorizontal,
  Target,
  ArrowRight,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { QuickActionsMenu } from '../../common/QuickActionsMenu';

interface DecisionItem {
  id: string;
  role: UserRole;
  roleTitle: string;
  question: string;
  metric: string;
  status: 'Attention' | 'Action' | 'Ready';
  actionLabel: string;
  actionScreen: string;
  actionFlow: string;
  filterStatus?: string;
}

const DECISION_MAP: DecisionItem[] = [
  {
    id: 'd1',
    role: 'DATA_ENTRY',
    roleTitle: 'Data Entry',
    question: 'Missing utility invoices before monthly cut-off',
    metric: 'Pune Warehouse: 1 bill unlogged',
    status: 'Action',
    actionLabel: 'Upload Invoice OCR',
    actionScreen: '17_bill_upload',
    actionFlow: 'FLOW_D',
  },
  {
    id: 'd2',
    role: 'DATA_ENTRY',
    roleTitle: 'Data Entry',
    question: 'Entries returned or blocked on fuel density checks',
    metric: '3 diesel entries require density cert',
    status: 'Attention',
    actionLabel: 'Fix 3 Blockers',
    actionScreen: '15_fix_detail_view',
    actionFlow: 'FLOW_C',
    filterStatus: 'Error',
  },
  {
    id: 'd3',
    role: 'REVIEWER',
    roleTitle: 'ESG Reviewer',
    question: 'Submissions awaiting reviewer sign-off',
    metric: '12 batches pending review',
    status: 'Action',
    actionLabel: 'Review Queue',
    actionScreen: '24_review_approve',
    actionFlow: 'FLOW_B',
    filterStatus: 'Submitted',
  },
  {
    id: 'd4',
    role: 'REVIEWER',
    roleTitle: 'ESG Reviewer',
    question: 'Factor lineage verification for reporting period',
    metric: '100% CEA v19 & IPCC factors frozen',
    status: 'Ready',
    actionLabel: 'Factor Library',
    actionScreen: '22_factors_reference',
    actionFlow: 'FLOW_E',
  },
  {
    id: 'd5',
    role: 'TENANT_ADMIN',
    roleTitle: 'Sustainability Lead',
    question: 'Period boundary completeness for calculation freeze',
    metric: '96.4% reconciled · 0 blocking issues',
    status: 'Action',
    actionLabel: 'Run Engine',
    actionScreen: '19_run_calculation',
    actionFlow: 'FLOW_E',
  },
  {
    id: 'd6',
    role: 'TENANT_ADMIN',
    roleTitle: 'Sustainability Lead',
    question: 'CapEx allocation across Solar, PPA, and thermal heat pumps',
    metric: 'SBTi -42% 2030 trajectory gap',
    status: 'Action',
    actionLabel: 'What-If Simulator',
    actionScreen: '36_scenario_builder',
    actionFlow: 'FLOW_E',
  },
  {
    id: 'd7',
    role: 'VERIFIER',
    roleTitle: 'VVB Auditor',
    question: 'Primary invoice backing for clean ISO 14064 opinion',
    metric: '94.2% primary evidence coverage',
    status: 'Action',
    actionLabel: 'Evidence Trace',
    actionScreen: '32_evidence_trace',
    actionFlow: 'FLOW_F',
  },
];

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

  const [isDecisionMapOpen, setIsDecisionMapOpen] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  const pendingReviewCount = records.filter((r) => r.status === 'Submitted').length + 11;
  const flaggedCount = records.filter((r) => r.status === 'Error' || r.status === 'Sent Back').length + 2;

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

  const filteredDecisions = DECISION_MAP.filter(
    (d) => selectedRoleFilter === 'ALL' || d.role === selectedRoleFilter
  );

  return (
    <div id="screen-10-activity-dashboard" className="w-full space-y-5 pb-8">
      {/* Self-Evident Header: No wordy taglines */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Ingestion' },
          { label: 'Overview' },
        ]}
        title="Activity Ingestion"
        contextInfo={
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <span className="font-semibold text-[#01153C]">{activePeriod.name}</span>
            <span>·</span>
            <span>3 Facilities</span>
            <span>·</span>
            <span>ISO 14064 Audit Active</span>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsDecisionMapOpen(!isDecisionMapOpen)}
              className={`h-9 px-3.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C] ${
                isDecisionMapOpen
                  ? 'bg-[#01153C] text-white border-[#01153C]'
                  : 'bg-white text-[#01153C] border-[#D0D5DD] hover:bg-[#F9FAFB]'
              }`}
              aria-expanded={isDecisionMapOpen}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Decision Map</span>
              {isDecisionMapOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {currentRole === 'VERIFIER' ? (
              <button
                onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
                className="h-9 px-4 text-xs font-semibold text-white bg-[#01153C] rounded-lg hover:bg-[#02215c] shadow-2xs inline-flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
              >
                <Files className="w-3.5 h-3.5" />
                <span>Trace Evidence</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
                  className="h-9 px-4 text-xs font-semibold text-white bg-[#01153C] rounded-lg hover:bg-[#02215c] shadow-2xs inline-flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Entry</span>
                </button>

                <button
                  onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
                  className="h-9 px-3.5 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] border border-[#DCE5F5] rounded-lg hover:bg-[#E2EAF7] shadow-2xs inline-flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Upload Bill</span>
                </button>

                <button
                  onClick={() => openFactorHelper()}
                  className="h-9 px-3.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F9FAFB] shadow-2xs inline-flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#01153C]" />
                  <span>Factor Helper</span>
                </button>
              </>
            )}

            <QuickActionsMenu variant="page" />
          </div>
        }
      />

      {/* Decision Map Drawer (When toggled) */}
      {isDecisionMapOpen && (
        <section aria-label="Decision map matrix" className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F3F5] pb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#01153C]" />
              <h2 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Decision Map
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-[#F8F9FB] p-0.5 rounded-lg border border-[#E5E7EB] flex-wrap">
              <button
                onClick={() => setSelectedRoleFilter('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedRoleFilter === 'ALL'
                    ? 'bg-[#01153C] text-white'
                    : 'text-[#4B5563] hover:text-[#01153C]'
                }`}
              >
                All ({DECISION_MAP.length})
              </button>
              <button
                onClick={() => setSelectedRoleFilter('DATA_ENTRY')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedRoleFilter === 'DATA_ENTRY'
                    ? 'bg-[#01153C] text-white'
                    : 'text-[#4B5563] hover:text-[#01153C]'
                }`}
              >
                Data Entry
              </button>
              <button
                onClick={() => setSelectedRoleFilter('REVIEWER')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedRoleFilter === 'REVIEWER'
                    ? 'bg-[#01153C] text-white'
                    : 'text-[#4B5563] hover:text-[#01153C]'
                }`}
              >
                Reviewer
              </button>
              <button
                onClick={() => setSelectedRoleFilter('TENANT_ADMIN')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedRoleFilter === 'TENANT_ADMIN'
                    ? 'bg-[#01153C] text-white'
                    : 'text-[#4B5563] hover:text-[#01153C]'
                }`}
              >
                Lead
              </button>
              <button
                onClick={() => setSelectedRoleFilter('VERIFIER')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedRoleFilter === 'VERIFIER'
                    ? 'bg-[#01153C] text-white'
                    : 'text-[#4B5563] hover:text-[#01153C]'
                }`}
              >
                Auditor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredDecisions.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#01153C]">{item.roleTitle}</span>
                    <span
                      className={`font-semibold ${
                        item.status === 'Attention'
                          ? 'text-[#ED2024]'
                          : item.status === 'Action'
                          ? 'text-[#D97706]'
                          : 'text-[#0F6B48]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#171A1F]">{item.question}</div>
                  <div className="text-xs font-mono text-[#4B5563]">{item.metric}</div>
                </div>

                <button
                  onClick={() => {
                    if (item.filterStatus) {
                      setActiveFilterStatus(item.filterStatus);
                    }
                    navigateToScreen(item.actionScreen as any, item.actionFlow as any);
                  }}
                  className="w-full py-1.5 px-2.5 text-xs font-semibold text-white bg-[#01153C] hover:bg-[#02215c] rounded-md transition-colors flex items-center justify-center gap-1"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4 Decision-Driven KPI Cards: High visual density, aligned across wide screen */}
      <section aria-label="Key metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#4B5563]">
              <span className="font-medium">Boundary Completeness</span>
              <Database className="w-4 h-4 text-[#01153C]" />
            </div>
            <div className="text-2xl font-bold text-[#01153C] font-mono mt-1.5">96.4%</div>
            <div className="text-xs text-[#D97706] font-medium mt-0.5">Pune: 1 bill unlogged</div>
          </div>
          <button
            onClick={() => navigateToScreen('17_bill_upload', 'FLOW_D')}
            className="w-full h-8 px-3 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] hover:bg-[#E2EAF7] rounded-lg transition-colors flex items-center justify-between"
          >
            <span>Upload Invoice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#4B5563]">
              <span className="font-medium">Calculation Blockers</span>
              <AlertCircle className="w-4 h-4 text-[#ED2024]" />
            </div>
            <div className="text-2xl font-bold text-[#ED2024] font-mono mt-1.5">{flaggedCount} Blockers</div>
            <div className="text-xs text-[#ED2024] font-medium mt-0.5">Diesel density required</div>
          </div>
          <button
            onClick={() => {
              setActiveFilterStatus('Error');
              navigateToScreen('15_fix_detail_view', 'FLOW_C');
            }}
            className="w-full h-8 px-3 text-xs font-semibold text-[#ED2024] bg-[#FEF1F1] hover:bg-[#FEE2E2] rounded-lg transition-colors flex items-center justify-between"
          >
            <span>Resolve Errors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#4B5563]">
              <span className="font-medium">Review Queue</span>
              <Clock className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl font-bold text-[#D97706] font-mono mt-1.5">{pendingReviewCount} Pending</div>
            <div className="text-xs text-[#4B5563] font-medium mt-0.5">Awaiting site reviewer</div>
          </div>
          <button
            onClick={() => {
              setActiveFilterStatus('Submitted');
              if (currentRole === 'DATA_ENTRY') {
                navigateToScreen('23_submission_queue', 'FLOW_B');
              } else {
                navigateToScreen('24_review_approve', 'FLOW_B');
              }
            }}
            className="w-full h-8 px-3 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] hover:bg-[#E2EAF7] rounded-lg transition-colors flex items-center justify-between"
          >
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#4B5563]">
              <span className="font-medium">Audit Evidence</span>
              <CheckCircle2 className="w-4 h-4 text-[#0F6B48]" />
            </div>
            <div className="text-2xl font-bold text-[#0F6B48] font-mono mt-1.5">94.2%</div>
            <div className="text-xs text-[#0F6B48] font-medium mt-0.5">Target: ≥95% (ISO 14064)</div>
          </div>
          <button
            onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
            className="w-full h-8 px-3 text-xs font-semibold text-[#0F6B48] bg-[#E8F8EE] hover:bg-[#D4F3E0] rounded-lg transition-colors flex items-center justify-between"
          >
            <span>Trace Docket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Strategic Shortcuts: Clean cards with direct actions */}
      <section aria-label="Decarbonization modules" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#EDF2FA] text-[#01153C] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#01153C]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#171A1F]">What-If Decarbonization Simulator</div>
              <div className="text-xs text-[#4B5563] mt-0.5">Model 2030 PPA, Solar, and Efficiency Levers</div>
            </div>
          </div>
          <button
            onClick={() => navigateToScreen('36_scenario_builder', 'FLOW_E')}
            className="h-9 px-4 text-xs font-semibold text-white bg-[#01153C] hover:bg-[#022365] rounded-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
          >
            <span>Simulate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#EDF2FA] text-[#01153C] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-[#01153C]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#171A1F]">Industry Carbon Benchmark Radar</div>
              <div className="text-xs text-[#4B5563] mt-0.5">Multi-Axis Peer Cohort Decarbonization Standing</div>
            </div>
          </div>
          <button
            onClick={() => navigateToScreen('37_benchmarking', 'FLOW_E')}
            className="h-9 px-4 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] hover:bg-[#E2EAF7] border border-[#01153C]/20 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
          >
            <span>Benchmark</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Operational Filter Bar */}
      <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, site, or ID…"
              className="w-full h-9 pl-9 pr-3 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01153C] bg-white text-[#17181A]"
            />
          </div>

          <select
            value={activeFilterSite}
            onChange={(e) => setActiveFilterSite(e.target.value)}
            className="h-9 px-3 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:ring-2 focus:ring-[#01153C]"
          >
            <option value="all">All Sites (3 Facilities)</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={activeFilterStatus}
            onChange={(e) => setActiveFilterStatus(e.target.value)}
            className="h-9 px-3 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:ring-2 focus:ring-[#01153C]"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Submitted">Submitted (Pending Review)</option>
            <option value="Draft">Draft</option>
            <option value="Error">Flagged Error</option>
            <option value="Sent Back">Sent Back</option>
          </select>
        </div>

        <div className="text-xs text-[#4B5563] font-medium">
          {filteredRecords.length} records in {activePeriod.name}
        </div>
      </div>

      {/* Activity Data Table: Clean, self-evident columns */}
      <section aria-label="Activity records ledger" className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#4B5563]">
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F]">ID</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F]">Date</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F]">Facility</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F]">Emission Source</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F] text-right">Quantity</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F]">Unit</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F] text-right">tCO2e</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F] text-center">Evidence</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F]">Status</th>
                <th scope="col" className="py-2.5 px-3.5 font-semibold text-[#171A1F] text-right">Action</th>
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
                    <td className="py-2.5 px-3.5 font-mono font-semibold text-[#01153C]">
                      {record.id}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#4B5563] font-mono">{record.date}</td>
                    <td className="py-2.5 px-3.5 text-[#171A1F] font-semibold">{record.siteName}</td>
                    <td className="py-2.5 px-3.5">
                      <div className="text-[#171A1F] font-medium">{record.sourceName}</div>
                      <span className="text-[10px] text-[#4B5563]">{record.scope}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-[#171A1F] font-semibold">
                      {record.quantity.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#4B5563]">{record.unit}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-[#171A1F] font-medium">
                      {record.emissions_tCO2e.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      {hasEvidence ? (
                        <span className="text-xs text-[#01153C] font-semibold inline-flex items-center gap-1">
                          <FileText className="w-3 h-3 text-[#01153C]" />
                          <span>{record.evidenceFiles.length}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#ED2024] font-medium">Missing</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5">
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
                    <td className="py-2.5 px-3.5 text-right">
                      <span className="text-xs text-[#01153C] group-hover:underline font-semibold">
                        Open →
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
  );
};
