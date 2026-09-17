import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  FileText,
  Calendar,
  ArrowRight,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Sliders,
  ChevronRight,
  Inbox,
  Filter,
} from 'lucide-react';

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
      <div className="bg-[#171A1F] text-white rounded-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-[#2D3339]">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-[#242A33] border border-[#3E4550] flex items-center justify-center text-[#EAF2FB]">
            <ShieldCheck className="w-5 h-5 text-[#85B7EB]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#85B7EB] bg-[#174A8B]/30 px-2 py-0.5 rounded border border-[#174A8B]/50">
                Verifier Portal
              </span>
              <span className="text-[11px] text-[#A2A9B4] hidden sm:inline">
                Read-only verification surface
              </span>
            </div>
            <h1 className="text-lg font-semibold text-white mt-0.5">
              Independent Assurance & Verification Docket
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-[#D9DDE3] border-t md:border-t-0 pt-3 md:pt-0 border-[#2D3339]">
          <div>
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider">Organisation</div>
            <div className="font-medium text-white flex items-center space-x-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[#85B7EB]" />
              <span>Zenith Energy</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#2D3339]" />

          <div>
            <div className="text-[10px] uppercase text-[#858C96] tracking-wider">Lead Verifier</div>
            <div className="font-medium text-white flex items-center space-x-1.5 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#174A8B] text-white flex items-center justify-center text-[10px] font-semibold">
                JR
              </div>
              <span>J. Rao</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#2D3339]" />

          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#242A33] text-[#A2A9B4] hover:text-white border border-[#3E4550] transition-colors"
            title="Demonstrate empty state when no reviews are assigned"
          >
            {showEmptyState ? 'Show Assigned Reviews' : 'Simulate Empty State'}
          </button>
        </div>
      </div>

      {/* Internal Verifier Subnav */}
      <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-2 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center space-x-6">
          <button
            className="font-medium text-[#171A1F] border-b-2 border-[#171A1F] pb-2 flex items-center space-x-1.5 -mb-[9px]"
          >
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
            className="text-[#5E6672] hover:text-[#171A1F] pb-2 transition-colors flex items-center space-x-1.5"
          >
            <span>Evidence Trace</span>
          </button>
          <button
            onClick={() => navigateToScreen('33_raise_query', 'FLOW_F')}
            className="text-[#5E6672] hover:text-[#171A1F] pb-2 transition-colors flex items-center space-x-1.5"
          >
            <span>Queries</span>
            {openQueriesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#FEF0EF] text-[#B42318] text-[10px] font-medium rounded-full">
                {openQueriesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigateToScreen('09_tenant_settings')}
            className="text-[#5E6672] hover:text-[#171A1F] pb-2 transition-colors"
          >
            <span>Settings</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#5E6672] hidden sm:block">
          Route: <span className="text-[#174A8B]">/dashboard</span>
        </div>
      </div>

      {/* Page Context / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#5E6672] mb-1">
            <span>Verifier Portal</span>
            <ChevronRight className="w-3 h-3 text-[#858C96]" />
            <span className="text-[#171A1F] font-medium">Assigned Reviews</span>
          </div>
          <h2 className="text-xl font-semibold text-[#171A1F]">Assigned Reviews</h2>
          <p className="text-xs text-[#5E6672] mt-0.5">
            External verifier entry point strictly scoped to permitted tenant, facility sites, and reporting period.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 text-[11px] text-[#027A48] bg-[#ECFDF3] border border-[#027A48]/20 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Scope Verified: Zenith Energy (FY 2025-26)</span>
          </span>
        </div>
      </div>

      {/* Main Review Section */}
      {showEmptyState ? (
        /* Empty state per PRD Section 7 */
        <div id="verifier-empty-state" className="bg-white border border-[#D9DDE3] rounded-lg p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F1F3F5] text-[#858C96] flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#171A1F]">No reviews assigned</h3>
            <p className="text-xs text-[#5E6672] max-w-md mx-auto">
              There are no reporting periods currently assigned to your account.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowEmptyState(false)}
              className="text-xs text-[#174A8B] hover:underline font-medium"
            >
              Reload assigned scopes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table (PRD Section 5 & 9) */}
          <div className="hidden sm:block bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between">
              <span className="text-xs font-medium text-[#171A1F] uppercase tracking-wider">
                Assigned Reports Table
              </span>
              <span className="text-[11px] text-[#5E6672]">
                1 reporting period scoped for assurance
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                  <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Client</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Report</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Period</th>
                  <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Status</th>
                  <th scope="col" className="py-3 px-4 text-right font-semibold text-[#171A1F]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {assignedReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    onClick={() => handleOpenTrace(rev)}
                    className="hover:bg-[#F8F9FB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#171A1F] group-hover:text-[#174A8B] transition-colors">
                        {rev.client}
                      </div>
                      <div className="text-[11px] text-[#858C96] mt-0.5">
                        {rev.sitesScoped.join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#171A1F] flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#5E6672]" />
                        <span>{rev.report}</span>
                      </div>
                      <div className="text-[11px] text-[#858C96] mt-0.5">
                        {rev.standard}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#171A1F]">
                      <div className="font-medium">{rev.period}</div>
                      <div className="text-[10px] text-[#858C96]">{rev.periodDates}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Compact semantic badge per PRD Section 5 */}
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#174A8B]" />
                        <span>{rev.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTrace(rev);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#171A1F] hover:bg-[#2D3339] text-white text-xs font-medium rounded-md transition-colors shadow-xs"
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
                className="bg-white border border-[#D9DDE3] rounded-lg p-4 space-y-3 shadow-xs"
              >
                <div>
                  <div className="text-sm font-semibold text-[#171A1F]">{rev.client}</div>
                  <div className="text-xs text-[#5E6672] mt-0.5">{rev.report}</div>
                  <div className="text-xs font-mono text-[#858C96] mt-0.5">{rev.period}</div>
                </div>

                <div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174A8B]" />
                    <span>{rev.status}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-[#F1F3F5]">
                  <button
                    onClick={() => handleOpenTrace(rev)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#171A1F] text-white text-xs font-medium rounded-md"
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
      <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 md:p-5 space-y-4 shadow-xs">
        <div className="flex items-center space-x-2 pb-2 border-b border-[#F1F3F5]">
          <Lock className="w-4 h-4 text-[#174A8B]" />
          <h3 className="text-xs font-semibold text-[#171A1F] uppercase tracking-wider">
            Verifier Access Control & Boundary Model (ISO 14064-3 Compliance)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* What verifier CAN do */}
          <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded space-y-2">
            <div className="font-semibold text-[#027A48] flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#027A48]" />
              <span>Permitted Actions (Read & Inquire)</span>
            </div>
            <ul className="space-y-1.5 text-[#5E6672] list-disc list-inside text-[11px]">
              <li>Read assigned report & calculation lineage</li>
              <li>Read attached primary source evidence (utility bills, receipts)</li>
              <li>Raise contextual queries against specific activity records</li>
              <li>View query status and audit resolution history</li>
              <li>Access own verifier account settings & session profile</li>
            </ul>
          </div>

          {/* What verifier CANNOT do */}
          <div className="p-3.5 bg-[#FEF0EF]/30 border border-[#FDA29B]/40 rounded space-y-2">
            <div className="font-semibold text-[#B42318] flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-[#B42318]" />
              <span>Prohibited Operations (Strict Boundary Enforced)</span>
            </div>
            <ul className="space-y-1.5 text-[#5E6672] list-disc list-inside text-[11px]">
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
