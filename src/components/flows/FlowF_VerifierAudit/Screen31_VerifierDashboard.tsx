import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  FileText,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen31_VerifierDashboard: React.FC = () => {
  const { navigateToScreen, setActiveTraceContext, verifierQueries } = useApp();
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Scoped assigned review per PRD specifications
  const assignedReviews = [
    {
      id: 'rev-01',
      client: 'Zenith Energy Services',
      clientLegal: 'Zenith Energy Services Private Limited',
      report: 'GHG Inventory',
      standard: 'ISO 14064-1:2018 / GHG Protocol Corporate Standard',
      period: 'FY 2025-26',
      periodDates: '01-Apr-2025 – 31-Mar-2026',
      status: 'Ready for review',
      sitesScoped: ['Chennai Plant 1', 'Pune Warehouse'],
      scopesAssigned: ['Scope 1 (Stationary & Mobile)', 'Scope 2 (Grid Electricity)'],
      totalEmissionsRef: '28,270 tCO2e',
      targetPath: '/trace/scope2/grid-electricity',
    },
  ];

  const handleOpenTrace = (review: typeof assignedReviews[0]) => {
    setActiveTraceContext({
      client: review.client,
      report: review.report,
      period: review.period,
      scope: 'Scope 2',
      category: 'Grid electricity',
      site: 'Chennai Plant 1',
      activityRow: 'Activity Data Row #1042',
      date: '12-Aug-2025',
      quantity: '48,200 kWh',
      evidenceRef: 'electricity-bill-aug25.pdf',
      verifier: 'M. Singh',
    });
    navigateToScreen('32_evidence_trace', 'FLOW_F');
  };

  const openQueriesCount = verifierQueries.filter((q) => q.status === 'Open').length;

  return (
    <div id="screen-31-verifier-dashboard" className="max-w-7xl mx-auto space-y-6">
      {/* Verifier Surface Banner / Top Header */}
      <div className="bg-white text-[#17181A] rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xs border border-[#E5E7EB]">
        <div className="flex items-center space-x-4 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#6254E8]/10 border border-[#6254E8]/20 flex items-center justify-center text-[#6254E8] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#6254E8]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#6254E8] bg-[#6254E8]/10 px-2.5 py-0.5 rounded-full border border-[#6254E8]/20">
                Verifier Portal
              </span>
              <span className="text-xs text-[#5F6368] hidden sm:inline font-data">
                Read-only verification surface · ISO 14064-3
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#17181A] mt-1 font-sans tracking-tight truncate">
              Independent Assurance & Verification Docket
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F1F3F5] shrink-0">
          <div className="bg-[#FAFAFB] px-3.5 py-2 rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">Organisation</div>
            <div className="font-semibold text-[#17181A] flex items-center space-x-1.5 mt-0.5 font-sans">
              <Building2 className="w-3.5 h-3.5 text-[#6254E8]" />
              <span>Zenith Energy</span>
            </div>
          </div>

          <div className="bg-[#FAFAFB] px-3.5 py-2 rounded-xl border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] tracking-wider font-semibold font-sans">Lead Verifier</div>
            <div className="font-semibold text-[#17181A] flex items-center space-x-1.5 mt-0.5 font-sans">
              <div className="w-4 h-4 rounded-full bg-[#6254E8] text-white flex items-center justify-center text-[9px] font-bold">
                JR
              </div>
              <span>J. Rao (VVB)</span>
            </div>
          </div>

          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#FAFAFB] text-[#5F6368] hover:text-[#17181A] border border-[#E5E7EB] hover:border-[#D5D8DD] transition-all font-sans font-semibold text-xs shadow-2xs shrink-0"
            title="Demonstrate empty state when no reviews are assigned"
          >
            {showEmptyState ? 'Show Assigned Reviews' : 'Simulate Empty State'}
          </button>
        </div>
      </div>

      {/* Internal Verifier Subnav */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 text-xs overflow-x-auto whitespace-nowrap scrollbar-none font-sans">
        <div className="flex items-center space-x-6">
          <button
            className="font-semibold text-[#6254E8] border-b-2 border-[#6254E8] pb-2 flex items-center space-x-1.5 -mb-[9px]"
          >
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
            className="text-[#5F6368] hover:text-[#17181A] pb-2 transition-colors flex items-center space-x-1.5 font-medium"
          >
            <span>Evidence Trace</span>
          </button>
          <button
            onClick={() => navigateToScreen('33_raise_query', 'FLOW_F')}
            className="text-[#5F6368] hover:text-[#17181A] pb-2 transition-colors flex items-center space-x-1.5 font-medium"
          >
            <span>Queries</span>
            {openQueriesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#FEF3F2] text-[#B42318] text-[10px] font-bold rounded-full">
                {openQueriesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigateToScreen('09_tenant_settings')}
            className="text-[#5F6368] hover:text-[#17181A] pb-2 transition-colors font-medium"
          >
            <span>Settings</span>
          </button>
        </div>

        <div className="text-[11px] route-path text-[#8A8F98] hidden sm:block font-medium">
          Route: <span className="text-[#6254E8]">/dashboard</span>
        </div>
      </div>

      {/* Page Header Component */}
      <PageHeader
        breadcrumbs={[
          { label: 'Verifier Portal' },
          { label: 'Assigned Reviews' },
        ]}
        title="Assigned Reviews"
        description="External verifier entry point strictly scoped to permitted tenant, facility sites, and reporting period."
        badge={
          <StatusBadge status="Approved" customLabel="Scope Verified: Zenith Energy (FY 2025-26)" size="sm" />
        }
      />

      {/* Main Review Section */}
      {showEmptyState ? (
        /* Empty state per PRD Section 7 */
        <div id="verifier-empty-state" className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#F4F5F6] text-[#8A8F98] flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#17181A] font-sans">No reviews assigned</h3>
            <p className="text-xs text-[#5F6368] max-w-md mx-auto font-data">
              There are no reporting periods currently assigned to your account.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowEmptyState(false)}
              className="text-xs text-[#6254E8] hover:underline font-semibold font-sans"
            >
              Reload assigned scopes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table (PRD Section 5 & 9) */}
          <div className="hidden sm:block bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
            <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F4F5F6] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#17181A] uppercase tracking-wider font-sans">
                Assigned Reports Table
              </span>
              <span className="text-[11px] text-[#5F6368] font-data">
                1 reporting period scoped for assurance
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F5F6] border-b border-[#E5E7EB] text-[#5F6368]">
                  <th scope="col" className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Client</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Report</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Period</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                  <th scope="col" className="py-3 px-4 text-right font-semibold text-[11px] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {assignedReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    onClick={() => handleOpenTrace(rev)}
                    className="hover:bg-[#FAFAFB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#17181A] group-hover:text-[#6254E8] transition-colors font-sans">
                        {rev.client}
                      </div>
                      <div className="text-[11px] text-[#8A8F98] mt-0.5 font-data">
                        {rev.sitesScoped.join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#17181A] flex items-center space-x-1.5 font-sans">
                        <FileText className="w-3.5 h-3.5 text-[#5F6368]" />
                        <span>{rev.report}</span>
                      </div>
                      <div className="text-[11px] text-[#8A8F98] mt-0.5 font-data">
                        {rev.standard}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#17181A]">
                      <div className="period-code font-medium">{rev.period}</div>
                      <div className="text-[10px] text-[#8A8F98] period-code">{rev.periodDates}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status="Under Review" customLabel={rev.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTrace(rev);
                        }}
                        className="enterprise-btn-primary h-8 px-4 text-xs inline-flex items-center space-x-1.5 shadow-2xs font-semibold rounded-full"
                      >
                        <span>Open Evidence Trace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Review Cards (PRD Section 9) */}
          <div className="sm:hidden space-y-3">
            {assignedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 shadow-2xs"
              >
                <div>
                  <div className="text-sm font-semibold text-[#17181A] font-sans">{rev.client}</div>
                  <div className="text-xs text-[#5F6368] mt-0.5 font-sans">{rev.report}</div>
                  <div className="text-xs text-[#8A8F98] mt-0.5 period-code">{rev.period}</div>
                </div>

                <div>
                  <StatusBadge status="Under Review" customLabel={rev.status} size="sm" />
                </div>

                <div className="pt-2 border-t border-[#F1F3F5]">
                  <button
                    onClick={() => handleOpenTrace(rev)}
                    className="w-full enterprise-btn-primary h-9 flex items-center justify-between px-3 text-xs font-semibold"
                  >
                    <span>View evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Access Control & Governance Matrix (PRD Section 8) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2 pb-2 border-b border-[#F1F3F5]">
          <Lock className="w-4 h-4 text-[#6254E8]" />
          <h3 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider font-sans">
            Verifier Access Control & Boundary Model (ISO 14064-3 Compliance)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-data">
          {/* What verifier CAN do */}
          <div className="p-3.5 bg-[#ECFDF3]/40 border border-[#027A48]/20 rounded-xl space-y-2">
            <div className="font-semibold text-[#027A48] flex items-center space-x-1.5 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#027A48]" />
              <span>Permitted Actions (Read & Inquire)</span>
            </div>
            <ul className="space-y-1.5 text-[#5F6368] list-disc list-inside text-[11px]">
              <li>Read assigned report & calculation lineage</li>
              <li>Read attached primary source evidence (utility bills, receipts)</li>
              <li>Raise contextual queries against specific activity records</li>
              <li>View query status and audit resolution history</li>
              <li>Access own verifier account settings & session profile</li>
            </ul>
          </div>

          {/* What verifier CANNOT do */}
          <div className="p-3.5 bg-[#FEF3F2]/40 border border-[#FDA29B]/40 rounded-xl space-y-2">
            <div className="font-semibold text-[#B42318] flex items-center space-x-1.5 font-sans">
              <AlertCircle className="w-4 h-4 text-[#B42318]" />
              <span>Prohibited Operations (Strict Boundary Enforced)</span>
            </div>
            <ul className="space-y-1.5 text-[#5F6368] list-disc list-inside text-[11px]">
              <li>Cannot edit or delete activity data rows</li>
              <li>Cannot modify calculation formulas or recalculate</li>
              <li>Cannot approve or reject internal workflow submissions</li>
              <li>Cannot lock or unlock reporting periods</li>
              <li>Cannot change emission factors or manage tenant users</li>
              <li>Cannot modify organisation configuration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
