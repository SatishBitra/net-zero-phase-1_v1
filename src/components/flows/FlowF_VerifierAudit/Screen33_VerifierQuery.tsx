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
    resolveVerifierQuery,
    closeVerifierQuery,
    showToast,
    currentRole,
    currentUser,
  } = useApp();

  // Verifier Raise Form State
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

  // Reviewer / Tenant Admin Response State
  const openQueries = verifierQueries.filter((q) => q.status === 'Open');
  const [selectedResponseQueryId, setSelectedResponseQueryId] = useState<string>(
    openQueries.length > 0 ? openQueries[0].id : (verifierQueries[0]?.id || '')
  );
  const [responseText, setResponseText] = useState<string>('');
  const [evidenceDocRef, setEvidenceDocRef] = useState<string>('TANGEDCO_HT_Bill_Jul_2025.pdf');
  const [responseSubmitting, setResponseSubmitting] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string | null>(null);

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

  const handleReviewerResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResponseQueryId) {
      setResponseError('Please select a verifier query to respond to.');
      return;
    }
    if (!responseText.trim()) {
      setResponseError('Response explanation is mandatory.');
      return;
    }

    setResponseSubmitting(true);
    setResponseError(null);

    const fullResponse = evidenceDocRef.trim()
      ? `${responseText.trim()} [Attached Evidence: ${evidenceDocRef.trim()}]`
      : responseText.trim();

    resolveVerifierQuery(selectedResponseQueryId, fullResponse, currentUser.name);

    setResponseSubmitting(false);
    setResponseText('');
    setExpandedQueryId(selectedResponseQueryId);
  };

  return (
    <div id="screen-33-verifier-query" className="max-w-6xl mx-auto space-y-6">
      {/* Verifier Read-Only Assurance Notice */}
      <div className="bg-[#01153C] text-white px-4 py-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#01153C] shadow-2xs font-data">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white font-sans">External Assurance Surface</span>
          <span className="text-white/40">•</span>
          <span className="text-white/90">Structured Query & Clarification Dispatch</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-white/70">
          <span>Lead Verifier: M. Singh</span>
          <span className="text-white/40">•</span>
          <span className="route-path text-emerald-300 font-medium">ISO 14064-3 Verifier Docket</span>
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
            <FileCheck className="w-4 h-4 text-[#01153C]" />
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
          <div className="p-2.5 bg-[#01153C]/5 rounded-lg border border-[#01153C]/30">
            <div className="text-[10px] uppercase text-[#01153C] font-semibold">Quantity & Date</div>
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

      {/* Main Grid: Query Creation Form / Reviewer Response Form + Engagement Query History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Role-Specific Action Panel (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          {currentRole === 'VERIFIER' ? (
            <>
              <div className="flex items-center space-x-2 border-b border-[#F1F3F5] pb-3">
                <MessageSquare className="w-4 h-4 text-[#01153C]" />
                <h3 className="text-sm font-semibold text-[#17181A] font-sans">Raise Verification Clarification</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 bg-[#FEF1F1] border border-[#FED2D3] rounded-lg text-[#ED2024] flex items-center space-x-2 font-data">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Query Category */}
                <div>
                  <label htmlFor="query-category" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                    Query Category <span className="text-[#ED2024]">*</span>
                  </label>
                  <select
                    id="query-category"
                    value={queryCategory}
                    onChange={(e) => setQueryCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#01153C] font-sans"
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
                    Clarification Question <span className="text-[#ED2024]">*</span>
                  </label>
                  <textarea
                    id="query-text"
                    rows={4}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Can you confirm this meter reading covers the full billing cycle for Chennai Plant 1?"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#01153C] placeholder-[#8A8F98] font-sans"
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
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#01153C] placeholder-[#8A8F98] font-sans"
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
            </>
          ) : currentRole === 'REVIEWER' || currentRole === 'TENANT_ADMIN' ? (
            <>
              <div className="flex items-center space-x-2 border-b border-[#F1F3F5] pb-3">
                <FileCheck className="w-4 h-4 text-[#01153C]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#17181A] font-sans">
                    Respond to Verifier Clarification
                  </h3>
                  <p className="text-[11px] text-[#5F6368]">
                    Responding as <strong className="text-[#17181A]">{currentUser.name}</strong> ({currentRole === 'TENANT_ADMIN' ? 'Tenant Admin' : 'Reviewer'})
                  </p>
                </div>
              </div>

              <form onSubmit={handleReviewerResponse} className="space-y-4 text-xs">
                {responseError && (
                  <div className="p-3 bg-[#FEF1F1] border border-[#FED2D3] rounded-lg text-[#ED2024] flex items-center space-x-2 font-data">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{responseError}</span>
                  </div>
                )}

                {/* Select Query */}
                <div>
                  <label htmlFor="select-query-response" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                    Target Verifier Query <span className="text-[#ED2024]">*</span>
                  </label>
                  <select
                    id="select-query-response"
                    value={selectedResponseQueryId}
                    onChange={(e) => setSelectedResponseQueryId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#01153C] font-sans"
                  >
                    {verifierQueries.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.id} — [{q.status}] {q.description.slice(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>

                {/* Response Text */}
                <div>
                  <label htmlFor="reviewer-response-text" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                    Clarification Explanation / Remediation Details <span className="text-[#ED2024]">*</span>
                  </label>
                  <textarea
                    id="reviewer-response-text"
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="e.g. Verified with plant facility engineer that billing cycle covers 01-Jul-2025 through 31-Jul-2025. Attached certified consumer ledger."
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#01153C] placeholder-[#8A8F98] font-sans"
                    required
                  />
                </div>

                {/* Evidence Attachment Reference */}
                <div>
                  <label htmlFor="evidence-doc-ref" className="block text-xs font-semibold text-[#17181A] mb-1 font-sans">
                    Supporting Document Reference
                  </label>
                  <input
                    type="text"
                    id="evidence-doc-ref"
                    value={evidenceDocRef}
                    onChange={(e) => setEvidenceDocRef(e.target.value)}
                    placeholder="TANGEDCO_HT_Bill_Jul_2025.pdf"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] text-xs focus:outline-none focus:border-[#01153C] placeholder-[#8A8F98] font-sans"
                  />
                  <p className="text-[11px] text-[#5F6368] mt-1 font-data">
                    Cross-referenced file in organization evidence repository for third-party audit validation.
                  </p>
                </div>

                {/* Form Actions */}
                <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setResponseText('')}
                    className="enterprise-btn-secondary h-9 px-3.5 text-xs font-semibold"
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    disabled={responseSubmitting}
                    className="enterprise-btn-primary h-9 px-4 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{responseSubmitting ? 'Submitting...' : 'Submit Response to Verifier'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-3 py-4">
              <div className="flex items-center space-x-2 text-[#01153C] font-semibold">
                <ShieldCheck className="w-5 h-5 text-[#01153C]" />
                <h3 className="text-sm">Assurance Query Channel</h3>
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                As a <strong>Data Entry Operator</strong>, verification queries from independent auditors are routed to your appointed Reviewer (S. Iyer) and Tenant Administrator.
              </p>
              <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg text-xs space-y-1">
                <span className="font-semibold text-[#17181A]">Need to provide additional receipts?</span>
                <p className="text-[#5F6368]">
                  You can attach updated bills or meter read certificates via the Activity Data form or OCR intake screen.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Existing Engagement Queries Thread (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs space-y-0">
          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F4F5F6] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#01153C]" />
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
                    <span className="text-[#01153C] font-medium font-sans">{query.queryType}</span>
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

                      {/* Verifier Sign-off Actions */}
                      {currentRole === 'VERIFIER' && query.status === 'Answered' && (
                        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => closeVerifierQuery(query.id, 'Resolved', 'Auditor noted observation and accepted remediation.')}
                            className="px-2.5 py-1 text-[11px] text-[#5F6368] hover:bg-[#E5E7EB] border border-[#E5E7EB] rounded-md font-semibold transition-colors"
                          >
                            Mark Qualified
                          </button>
                          <button
                            type="button"
                            onClick={() => closeVerifierQuery(query.id, 'Closed')}
                            className="px-2.5 py-1 text-[11px] text-white bg-[#027A48] hover:bg-[#05603A] rounded-md font-semibold transition-colors flex items-center space-x-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Accept & Close</span>
                          </button>
                        </div>
                      )}

                      {/* Reviewer / Tenant Admin Quick Action */}
                      {(currentRole === 'REVIEWER' || currentRole === 'TENANT_ADMIN') && query.status === 'Open' && (
                        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedResponseQueryId(query.id);
                              showToast('Query Selected', `Loaded ${query.id} into the response form.`, 'info');
                            }}
                            className="px-2.5 py-1 text-[11px] text-[#01153C] hover:bg-[#01153C]/10 border border-[#01153C]/30 rounded-md font-semibold transition-colors"
                          >
                            Respond to this Query →
                          </button>
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
              className="text-[#01153C] hover:underline font-semibold font-sans"
            >
              View Audit Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
