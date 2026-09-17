import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { VerifierQuery } from '../../../types';
import {
  ChevronRight,
  ShieldCheck,
  Send,
  HelpCircle,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  ArrowLeft,
  Filter,
  FileCheck,
  Layers,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const Screen33_VerifierQuery: React.FC = () => {
  const {
    navigateToScreen,
    activeTraceContext,
    verifierQueries,
    raiseVerifierQuery,
    resolveVerifierQuery,
    showToast,
  } = useApp();

  // Form State
  const [queryCategory, setQueryCategory] = useState<VerifierQuery['queryType']>('Meter Anomaly');
  const [queryText, setQueryText] = useState<string>(
    'Can you confirm this meter reading covers the full billing cycle for Chennai Plant 1?'
  );
  const [requiredAction, setRequiredAction] = useState<string>(
    'Cross-verify meter multiplier and billing start/end dates against DISCOM HT consumer card.'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>('VQ-2025-001');

  // Active Context from Screen 32 (or default)
  const context = {
    client: activeTraceContext.client || 'Zenith Energy Services',
    report: activeTraceContext.report || 'GHG Inventory',
    period: activeTraceContext.period || 'FY 2025-26',
    scope: activeTraceContext.scope || 'Scope 2',
    category: activeTraceContext.category || 'Grid electricity',
    site: activeTraceContext.site || 'Chennai Plant 1',
    activityRow: activeTraceContext.activityRow || 'Activity Data Row #1042',
    date: activeTraceContext.date || '12-Aug-2025',
    quantity: activeTraceContext.quantity || '48,200 kWh',
    evidence: activeTraceContext.evidenceRef || 'electricity-bill-aug25.pdf',
    verifier: activeTraceContext.verifier || 'M. Singh',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) {
      setFormError('Query clarification question is required.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    // Contextual record ID
    const recordId = 'ACT-2025-0812';

    raiseVerifierQuery(
      recordId,
      queryCategory,
      queryText.trim(),
      requiredAction.trim(),
      {
        lineItemSummary: `${context.category} — ${context.quantity} at ${context.site}`,
        client: context.client,
        report: context.report,
        period: context.period,
        scope: context.scope,
        sourceName: context.category,
        siteName: context.site,
        evidenceFile: context.evidence,
        quantity: context.quantity,
        activityRow: context.activityRow,
      }
    );

    setSubmitting(false);
    showToast(
      'Query Dispatched',
      'Clarification query raised with link to source evidence and added to audit log.',
      'success'
    );
    // Reset or keep query text clean
    setQueryText('');
  };

  const getStatusBadge = (status: VerifierQuery['status']) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF0EF] text-[#B42318] border border-[#FDA29B]/50">
            Open
          </span>
        );
      case 'Answered':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20">
            Answered
          </span>
        );
      case 'Resolved':
      case 'Closed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF3] text-[#027A48] border border-[#027A48]/20">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F3F5] text-[#5E6672]">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="screen-33-verifier-query" className="max-w-6xl mx-auto space-y-6">
      {/* Verifier Read-Only Assurance Notice */}
      <div className="bg-[#171A1F] text-white px-4 py-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#2D3339]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#85B7EB]" />
          <span className="font-medium text-white">External Assurance Surface</span>
          <span className="text-[#858C96]">•</span>
          <span className="text-[#D9DDE3]">Structured Query & Clarification Dispatch</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-[#A2A9B4]">
          <span>Lead Verifier: M. Singh</span>
          <span className="text-[#858C96]">•</span>
          <span className="font-mono text-[#85B7EB]">ISO 14064-3 Verifier Docket</span>
        </div>
      </div>

      {/* Breadcrumb Navigation & Header */}
      <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-4">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#5E6672] mb-1">
            <button
              onClick={() => navigateToScreen('31_verifier_dashboard', 'FLOW_F')}
              className="hover:text-[#174A8B] transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3 text-[#858C96]" />
            <button
              onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
              className="hover:text-[#174A8B] transition-colors"
            >
              Evidence Trace
            </button>
            <ChevronRight className="w-3 h-3 text-[#858C96]" />
            <span className="text-[#171A1F] font-semibold">Raise Query</span>
          </nav>
          <h1 className="text-xl font-semibold text-[#171A1F]">Structured Query & Clarification</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Raise formal assurance clarification tied directly to a specific activity record and primary evidence.
          </p>
        </div>

        <button
          onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
          className="inline-flex items-center space-x-1.5 text-xs text-[#5E6672] hover:text-[#171A1F] transition-colors px-3 py-1.5 border border-[#D9DDE3] rounded-md bg-white hover:bg-[#F8F9FB]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Evidence Trace</span>
        </button>
      </div>

      {/* Context Panel (PRD Section 4: Read-Only Context Display) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-xs font-semibold text-[#171A1F] uppercase tracking-wider">
              Query Context (Bound Line Item & Source Document)
            </h2>
          </div>
          <span className="text-[11px] text-[#5E6672] font-mono">
            {context.activityRow}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] font-semibold">Client</div>
            <div className="font-medium text-[#171A1F] mt-0.5">{context.client}</div>
          </div>
          <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] font-semibold">Report & Period</div>
            <div className="font-medium text-[#171A1F] mt-0.5">
              {context.report} • {context.period}
            </div>
          </div>
          <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] font-semibold">Scope & Category</div>
            <div className="font-medium text-[#171A1F] mt-0.5">
              {context.scope} › {context.category}
            </div>
          </div>
          <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC]">
            <div className="text-[10px] uppercase text-[#858C96] font-semibold">Facility Site</div>
            <div className="font-medium text-[#171A1F] mt-0.5">{context.site}</div>
          </div>
          <div className="p-2.5 bg-[#EAF2FB]/50 rounded border border-[#85B7EB]/40">
            <div className="text-[10px] uppercase text-[#174A8B] font-semibold">Quantity & Date</div>
            <div className="font-semibold font-mono text-[#171A1F] mt-0.5">
              {context.quantity} ({context.date})
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-[#F8F9FB] rounded border border-[#E4E7EC] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-[#027A48]" />
            <span className="text-[#858C96]">Attached Primary Evidence:</span>
            <span className="font-mono font-medium text-[#171A1F]">{context.evidence}</span>
          </div>
          <span className="text-[11px] text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded font-medium">
            SHA-256 Verified
          </span>
        </div>
      </div>

      {/* Main Grid: Query Creation Form + Engagement Query History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Raise Query Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#D9DDE3] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F1F3F5] pb-3">
            <MessageSquare className="w-4 h-4 text-[#174A8B]" />
            <h3 className="text-sm font-semibold text-[#171A1F]">Raise Verification Clarification</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 bg-[#FEF0EF] border border-[#FDA29B] rounded text-[#B42318] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Query Category */}
            <div>
              <label htmlFor="query-category" className="block text-xs font-medium text-[#171A1F] mb-1">
                Query Category <span className="text-[#B42318]">*</span>
              </label>
              <select
                id="query-category"
                value={queryCategory}
                onChange={(e) => setQueryCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#D9DDE3] rounded-md bg-white text-[#171A1F] text-xs focus:outline-none focus:ring-1 focus:ring-[#174A8B]"
              >
                <option value="Meter Anomaly">Meter Anomaly</option>
                <option value="Missing Evidence">Missing Evidence</option>
                <option value="Calculation Methodology">Calculation Methodology</option>
                <option value="Emission Factor Selection">Emission Factor Selection</option>
                <option value="Boundary Question">Boundary Question</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-[11px] text-[#5E6672] mt-1">
                Categorize the finding to route it directly to the designated facility reviewer.
              </p>
            </div>

            {/* Query Clarification Question */}
            <div>
              <label htmlFor="query-text" className="block text-xs font-medium text-[#171A1F] mb-1">
                Clarification Question <span className="text-[#B42318]">*</span>
              </label>
              <textarea
                id="query-text"
                rows={4}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Can you confirm this meter reading covers the full billing cycle for Chennai Plant 1?"
                className="w-full px-3 py-2 border border-[#D9DDE3] rounded-md bg-white text-[#171A1F] text-xs focus:outline-none focus:ring-1 focus:ring-[#174A8B] placeholder-[#858C96]"
                required
              />
              <p className="text-[11px] text-[#5E6672] mt-1">
                Provide precise inquiry describing any discrepancy, date mismatch, or evidence gap.
              </p>
            </div>

            {/* Required Action */}
            <div>
              <label htmlFor="required-action" className="block text-xs font-medium text-[#171A1F] mb-1">
                Required Action (Recommended)
              </label>
              <input
                type="text"
                id="required-action"
                value={requiredAction}
                onChange={(e) => setRequiredAction(e.target.value)}
                placeholder="Cross-verify meter multiplier and billing start/end dates against DISCOM HT consumer card."
                className="w-full px-3 py-2 border border-[#D9DDE3] rounded-md bg-white text-[#171A1F] text-xs focus:outline-none focus:ring-1 focus:ring-[#174A8B] placeholder-[#858C96]"
              />
              <p className="text-[11px] text-[#5E6672] mt-1">
                Explicit remediation expected from the organisation review team.
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
                className="px-3.5 py-2 border border-[#D9DDE3] text-[#5E6672] hover:text-[#171A1F] rounded-md hover:bg-[#F8F9FB] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#171A1F] hover:bg-[#2D3339] text-white rounded-md font-medium shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Query'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Existing Engagement Queries Thread (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs space-y-0">
          <div className="px-4 py-3 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#174A8B]" />
              <h3 className="text-xs font-semibold text-[#171A1F]">Engagement Queries</h3>
            </div>
            <span className="text-[11px] font-mono text-[#5E6672]">
              {verifierQueries.length} total
            </span>
          </div>

          <div className="divide-y divide-[#F1F3F5] max-h-[580px] overflow-y-auto">
            {verifierQueries.map((query) => {
              const isExpanded = expandedQueryId === query.id;
              return (
                <div key={query.id} className="p-3.5 space-y-2 text-xs hover:bg-[#F8F9FB]/50 transition-colors">
                  <div
                    onClick={() => setExpandedQueryId(isExpanded ? null : query.id)}
                    className="flex items-start justify-between cursor-pointer gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold text-[#171A1F]">{query.id}</span>
                        {getStatusBadge(query.status)}
                      </div>
                      <div className="text-[11px] text-[#5E6672] mt-1 line-clamp-2">
                        {query.description}
                      </div>
                    </div>
                    <button className="text-[#858C96] p-1">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#858C96] pt-1">
                    <span>{query.date || query.raisedAt}</span>
                    <span className="text-[#174A8B] font-medium">{query.queryType}</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#F1F3F5] space-y-2.5 bg-[#F8F9FB] p-2.5 rounded">
                      <div>
                        <span className="text-[#858C96] text-[10px] uppercase font-semibold">
                          Required Remediation
                        </span>
                        <div className="text-[11px] text-[#171A1F] mt-0.5">
                          {query.requiredAction || 'Provide supporting documentation.'}
                        </div>
                      </div>

                      {query.reviewerResponse && (
                        <div className="p-2 bg-[#ECFDF3] border border-[#027A48]/20 rounded text-[11px] space-y-1">
                          <div className="font-semibold text-[#027A48] flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Organisation Response:</span>
                          </div>
                          <div className="text-[#171A1F]">{query.reviewerResponse}</div>
                          {query.resolvedAt && (
                            <div className="text-[10px] text-[#5E6672]">
                              Resolved on: {query.resolvedAt}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#F8F9FB] border-t border-[#D9DDE3] text-[11px] text-[#5E6672] flex items-center justify-between">
            <span>All queries are recorded in the audit trail</span>
            <button
              onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
              className="text-[#174A8B] hover:underline font-medium"
            >
              View Audit Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
