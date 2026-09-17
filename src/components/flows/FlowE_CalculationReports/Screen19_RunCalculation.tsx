import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Calculator,
  Play,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen19_RunCalculation: React.FC = () => {
  const {
    sites,
    activePeriod,
    triggerCalculationRun,
    navigateToScreen,
    showToast,
    addAuditLog,
  } = useApp();

  const [period, setPeriod] = useState(activePeriod?.name || 'FY 2025–26');
  const [boundary, setBoundary] = useState('All configured sites (3)');
  const [scopes, setScopes] = useState(['Scope 1', 'Scope 2 (Location-based)']);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleRunCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    showToast(
      'Asynchronous Job Dispatched',
      'GHG Calculation job CALC-2025-08-02 queued. Processing stationary combustion & location-based grid factors...',
      'info'
    );

    setTimeout(() => {
      // Create new immutable run in context
      triggerCalculationRun(period, boundary);

      addAuditLog({
        userName: 'A. Kumar',
        role: 'Reviewer',
        action: 'Executed GHG Protocol Calculation Run',
        previousValue: 'Previous run: CALC-2025-08-01 (1,245.8 tCO2e)',
        newValue: `Job completed: 1,245.8 tCO2e across ${boundary}, Scopes: Scope 1, Scope 2 (Location-based)`,
        source: 'Calculation Engine v1.4.2 (Asynchronous Worker)',
        reason: 'Periodic emissions consolidation for approved activity data',
        status: 'Complete',
        lineItemId: 'CALC-2025-08-02',
      });

      setIsCalculating(false);
      showToast('Calculation Complete', 'Emissions compiled: 1,245.8 tCO2e. Results ready in Screen 20.');
      navigateToScreen('20_results_summary', 'FLOW_E');
    }, 1100);
  };

  return (
    <div id="screen-19-container" className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Reports', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Calculations Ledger', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Run Calculation' },
        ]}
        title="Run GHG Calculation"
        badge={<StatusBadge status="Ready" customLabel="Engine v1.4.2" size="sm" />}
        description="Configure parameters to execute the deterministic calculation engine against approved activity records."
        actions={
          <button
            type="button"
            onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
            className="px-3.5 py-2 text-xs font-semibold text-[#17181A] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#FAFAFB] hover:border-[#D5D8DD] shadow-2xs inline-flex items-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5F6368]" />
            <span>Back to Ledger</span>
          </button>
        }
      />

      {/* Run Configuration Form */}
      <form onSubmit={handleRunCalculation} className="space-y-6">
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-semibold text-[#17181A] font-sans">Calculation Parameters</h2>
            <span className="text-[11px] font-data font-semibold text-[#6254E8] bg-[#6254E8]/10 px-2.5 py-1 rounded-full">
              Engine Version: TC-CALC-v1.4.2
            </span>
          </div>

          {/* Reporting Period Field */}
          <div>
            <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-1.5">
              Reporting period <span className="text-[#B42318]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={`${period} (Apr 2025 – Mar 2026)`}
                className="w-full px-3.5 py-2.5 text-xs border border-[#E5E7EB] rounded-lg bg-[#FAFAFB] text-[#17181A] font-medium font-sans cursor-not-allowed"
              />
              <Calendar className="w-4 h-4 text-[#8A8F98] absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-[#5F6368] font-data mt-1.5">
              Active reporting period defined in Organization Settings.
            </p>
          </div>

          {/* Boundary Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-1.5">
              Boundary <span className="text-[#B42318]">*</span>
            </label>
            <select
              value={boundary}
              onChange={(e) => setBoundary(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] font-sans focus:outline-none focus:border-[#6254E8] focus:ring-2 focus:ring-[#6254E8]/20"
            >
              <option value="All configured sites (3)">
                All configured sites (3) — Chennai Plant 1, Pune Warehouse, Hyderabad HQ
              </option>
              <option value="Chennai Plant 1 Only">Chennai Plant 1 Only</option>
              <option value="Pune Warehouse Only">Pune Warehouse Only</option>
              <option value="Hyderabad HQ Only">Hyderabad HQ Only</option>
            </select>
          </div>

          {/* Emission Scopes Checklist */}
          <div>
            <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-2">
              Emission scopes <span className="text-[#B42318]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-0.5 text-[#6254E8] rounded border-[#E5E7EB] focus:ring-[#6254E8]"
                />
                <div>
                  <div className="font-semibold text-[#17181A] font-sans">Scope 1: Stationary combustion</div>
                  <div className="text-[11px] text-[#5F6368] font-data mt-0.5">
                    Diesel generators, boilers, and on-site fuel combustion.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-0.5 text-[#6254E8] rounded border-[#E5E7EB] focus:ring-[#6254E8]"
                />
                <div>
                  <div className="font-semibold text-[#17181A] font-sans">Scope 2: Location-based grid electricity</div>
                  <div className="text-[11px] text-[#5F6368] font-data mt-0.5">
                    Purchased grid electricity mapped to regional baseline emission factors (CEA v19).
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#8A8F98] font-data mt-2">
              Scope 3 is not included in Phase 1 scope.
            </p>
          </div>

          {/* Source Count Summary Box */}
          <div className="p-4 bg-[#6254E8]/5 border border-[#6254E8]/20 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 text-[#6254E8]">
              <Layers className="w-4 h-4 shrink-0" />
              <span className="font-sans">
                <strong>Source count:</strong> 3 active sources with approved data ready for aggregation.
              </span>
            </div>
            <StatusBadge status="Approved" customLabel="100% Approved Records" size="sm" />
          </div>
        </div>

        {/* Build Notes Banner */}
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs text-xs text-[#5F6368] space-y-1.5 font-sans">
          <div className="font-semibold text-[#17181A] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6254E8]" />
            <span>Engine Execution Guidelines</span>
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-1 pl-1 font-data text-[#5F6368]">
            <li>Calculation jobs are asynchronous background tasks managed by the deterministic worker queue.</li>
            <li>Phase 1 scope covers: Scope 1 (Stationary combustion) + Scope 2 (Location-based grid electricity). Scope 3 is not in Phase 1.</li>
            <li>Produces an immutable calculation snapshot for complete verifier audit trail traceability.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
            className="px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#FAFAFB] text-xs font-semibold text-[#17181A] rounded-lg transition-colors shadow-2xs"
          >
            Cancel
          </button>

          <button
            id="btn-trigger-run-calculation"
            type="submit"
            disabled={isCalculating}
            className="px-6 py-2.5 bg-[#6254E8] hover:bg-[#5244DE] text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Calculation...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Calculation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
