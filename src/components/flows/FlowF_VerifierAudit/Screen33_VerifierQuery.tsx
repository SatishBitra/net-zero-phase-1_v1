import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { VerifierQuery } from '../../../types';
import {
  ShieldCheck,
  Send,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen33_VerifierQuery: React.FC = () => {
  const {
    navigateToScreen,
    activeTraceContext,
    verifierQueries,
    raiseVerifierQuery,
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

  return (
    <div id="screen-33-verifier-query" className="max-w-6xl mx-auto space-y-6">
      {/* Verifier Read-Only Assurance Notice */}
      <div className="bg-[#17181A] text-white px-4 py-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#2D3339] shadow-2xs font-data">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#9E77ED]" />
          <span className="font-semibold text-white font-sans">External Assurance Surface</span>
          <span className="text-[#8A8F98]">•</span>
          <span className="text-[#D9DDE3]">Structured Query & Clarification Dispatch</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-[#A2A9B4]">
          <span>Lead Verifier: M. Singh</span>
          <span className="text-[#8A8F98]">•</span>
          <span className="route-path text-[#9E77ED] font-medium">ISO 14064-3 Verifier Docket</span>
        </div>
      </div>

      {/* Breadcrumb Navigation & Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => navigateToScreen('31_verifier_dashboard', 'FLOW_F') },
          { label: 'Evidence Trace', onClick: () => navigateToScreen('32_evidence_trace', 'FLOW_F') },
          { label: 'Raise Query' },
        ]}
        title="Structured Query & Clarification"
        description="Raise formal assurance clarification tied directly to a specific activity record and primary evidence."
        actions={
          <button
            onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
            className="enterprise-btn-secondary h-9 px-3.5 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5F6368]" />
            <span>Return to Evidence Trace</span>
          </button>
        }
      />

      {/* Context Panel: Read-Only Context Display */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-[#6254E8]" />
            <h2 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider font-sans">
              Query Context (Bound Line Item & Source Document)
            </h2>
          </div>
          <span className="text-[11px] activity-id text-[#5F6368] font-medium">
            {context.activityRow}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-sans">
          <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] font-semibold">Client</div>
            <div className="font-semibold text-[#17181A] mt-0.5">{context.client}</div>
          </div>
          <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] font-semibold">Report & Period</div>
            <div className="font-medium text-[#17181A] mt-0.5">
              <span>{context.report}</span> • <span className="period-code font-medium">{context.period}</span>
            </div>
          </div>
          <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] font-semibold">Scope & Category</div>
            <div className="font-medium text-[#17181A] mt-0.5">
              {context.scope} › {context.category}
            </div>
          </div>
          <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB]">
            <div className="text-[10px] uppercase text-[#8A8F98] font-semibold">Facility Site</div>
            <div className="font-semibold text-[#17181A] mt-0.5">{context.site}</div>
          </div>
          <div className="p-2.5 bg-[#6254E8]/5 rounded-lg border border-[#6254E8]/30">
            <div className="text-[10px] uppercase text-[#6254E8] font-semibold">Quantity & Date</div>
            <div className="font-medium text-[#17181A] mt-0.5">
              {context.quantity} ({context.date})
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-[#027A48]" />
            <span className="text-[#8A8F98]">Attached Primary Evidence:</span>
            <span className="font-semibold text-[#17181A] font-sans">{context.evidence}</span>
          </div>
          <StatusBadge status="Approved" customLabel="SHA-256 Verified" size="sm" />
        </div>
      </div>

      {/* Main Grid: Query Creation Form + Engagement Query History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Raise Query Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F1F3F5] pb-3">
            <MessageSquare className="w-4 h-4 text-[#6254E8]" />
            <h3 className="text-sm font-semibold text-[#17181A] font-sans">Raise Verification Clarification</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 bg-[#FEF3F2] border border-[#FDA29B] rounded-lg text-[#B42318] flex items-center space-x-2 font-data">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Query Category */}
            <div>
              <label htmlFor="query-category" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                Query Category <span className="text-[#B42318]">*</span>
              </label>
              <select
                id="query-category"
                value={queryCategory}
                onChange={(e) => setQueryCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#7567F5] font-sans"
              >
                <option value="Meter Anomaly">Meter Anomaly</option>
                <option value="Missing Evidence">Missing Evidence</option>
                <option value="Calculation Methodology">Calculation Methodology</option>
                <option value="Emission Factor Selection">Emission Factor Selection</option>
                <option value="Boundary Question">Boundary Question</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-[11px] text-[#5F6368] mt-1 font-data">
                Categorize the finding to route it directly to the designated facility reviewer.
              </p>
            </div>

            {/* Query Clarification Question */}
            <div>
              <label htmlFor="query-text" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                Clarification Question <span className="text-[#B42318]">*</span>
              </label>
              <textarea
                id="query-text"
                rows={4}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Can you confirm this meter reading covers the full billing cycle for Chennai Plant 1?"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#7567F5] placeholder-[#8A8F98] font-sans"
                required
              />
              <p className="text-[11px] text-[#5F6368] mt-1 font-data">
                Provide precise inquiry describing any discrepancy, date mismatch, or evidence gap.
              </p>
            </div>

            {/* Required Action */}
            <div>
              <label htmlFor="required-action" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                Required Action (Recommended)
              </label>
              <input
                type="text"
                id="required-action"
                value={requiredAction}
                onChange={(e) => setRequiredAction(e.target.value)}
                placeholder="Cross-verify meter multiplier and billing start/end dates against DISCOM HT consumer card."
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#7567F5] placeholder-[#8A8F98] font-sans"
              />
              <p className="text-[11px] text-[#5F6368] mt-1 font-data">
                Explicit remediation expected from the organisation review team.
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
                className="enterprise-btn-secondary h-9 px-3.5 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="enterprise-btn-primary h-9 px-4 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Query'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Existing Engagement Queries Thread (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs space-y-0">
          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F4F5F6] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#6254E8]" />
              <h3 className="text-xs font-semibold text-[#17181A] font-sans">Engagement Queries</h3>
            </div>
            <span className="text-[11px] text-[#5F6368] font-data">
              {verifierQueries.length} total
            </span>
          </div>

          <div className="divide-y divide-[#F1F3F5] max-h-[580px] overflow-y-auto">
            {verifierQueries.map((query) => {
              const isExpanded = expandedQueryId === query.id;
              return (
                <div key={query.id} className="p-3.5 space-y-2 text-xs hover:bg-[#FAFAFB] transition-colors">
                  <div
                    onClick={() => setExpandedQueryId(isExpanded ? null : query.id)}
                    className="flex items-start justify-between cursor-pointer gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#17181A] activity-id font-medium">{query.id}</span>
                        <StatusBadge
                          status={query.status === 'Open' ? 'Rejected' : query.status === 'Answered' ? 'Under Review' : 'Approved'}
                          customLabel={query.status}
                          size="sm"
                        />
                      </div>
                      <div className="text-[11px] text-[#5F6368] mt-1 line-clamp-2 font-sans">
                        {query.description}
                      </div>
                    </div>
                    <button className="text-[#8A8F98] p-1">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8A8F98] pt-1">
                    <span className="font-data">{query.date || query.raisedAt}</span>
                    <span className="text-[#6254E8] font-medium font-sans">{query.queryType}</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#F1F3F5] space-y-2.5 bg-[#FAFAFB] p-2.5 rounded-lg">
                      <div>
                        <span className="text-[#8A8F98] text-[10px] uppercase font-semibold font-sans">
                          Required Remediation
                        </span>
                        <div className="text-[11px] text-[#17181A] mt-0.5 font-sans">
                          {query.requiredAction || 'Provide supporting documentation.'}
                        </div>
                      </div>

                      {query.reviewerResponse && (
                        <div className="p-2 bg-[#ECFDF3] border border-[#027A48]/20 rounded-lg text-[11px] space-y-1">
                          <div className="font-semibold text-[#027A48] flex items-center space-x-1 font-sans">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Organisation Response:</span>
                          </div>
                          <div className="text-[#17181A] font-sans">{query.reviewerResponse}</div>
                          {query.resolvedAt && (
                            <div className="text-[10px] text-[#5F6368] font-data">
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

          <div className="p-3 bg-[#FAFAFB] border-t border-[#E5E7EB] text-[11px] text-[#5F6368] flex items-center justify-between font-data">
            <span>All queries are recorded in the audit trail</span>
            <button
              onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
              className="text-[#6254E8] hover:underline font-semibold font-sans"
            >
              View Audit Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
