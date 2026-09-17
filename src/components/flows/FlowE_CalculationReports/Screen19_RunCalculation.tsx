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
} from 'lucide-react';

export const Screen19_RunCalculation: React.FC = () => {
  const {
    sites,
    activePeriod,
    triggerCalculationRun,
    navigateToScreen,
    showToast,
    addAuditLog,
  } = useApp();

  const [period, setPeriod] = useState('FY 2025–26');
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
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Calculations</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Run Calculation</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/calculations/new</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Run GHG Calculation</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Configure parameters to execute the deterministic calculation engine against approved activity records.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Runs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Run Configuration Form */}
      <form onSubmit={handleRunCalculation} className="space-y-6">
        <div className="p-6 bg-white border border-[#D9DDE3] rounded space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-medium text-[#171A1F]">Calculation Parameters</h2>
            <span className="text-[11px] font-mono text-[#5E6672] bg-[#F1F3F5] px-2 py-0.5 rounded">
              Engine Version: TC-CALC-v1.4.2
            </span>
          </div>

          {/* Reporting Period Field */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Reporting period <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value="FY 2025–26 (Apr 2025 – Mar 2026)"
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-[#F8F9FB] text-[#171A1F] font-medium"
              />
              <Calendar className="w-4 h-4 text-[#858C96] absolute right-3 top-2.5" />
            </div>
            <p className="text-[11px] text-[#5E6672] mt-1">
              Active reporting period defined in Screen 06.
            </p>
          </div>

          {/* Boundary Selection */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Boundary <span className="text-[#D92D20]">*</span>
            </label>
            <select
              value={boundary}
              onChange={(e) => setBoundary(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
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
            <label className="block text-xs font-medium text-[#5E6672] mb-1.5">
              Emission scopes <span className="text-[#D92D20]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-0.5 text-[#174A8B] rounded border-[#D9DDE3]"
                />
                <div>
                  <div className="font-medium text-[#171A1F]">Scope 1: Stationary combustion</div>
                  <div className="text-[11px] text-[#5E6672]">
                    Diesel generators, boilers, and on-site fuel combustion.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-0.5 text-[#174A8B] rounded border-[#D9DDE3]"
                />
                <div>
                  <div className="font-medium text-[#171A1F]">Scope 2: Location-based grid electricity</div>
                  <div className="text-[11px] text-[#5E6672]">
                    Purchased grid electricity mapped to regional baseline emission factors (CEA v19).
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#858C96] mt-1.5">
              Scope 3 is not included in Phase 1 scope.
            </p>
          </div>

          {/* Source Count Summary Box */}
          <div className="p-3.5 bg-[#EAF2FB]/50 border border-[#2166B1]/20 rounded flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[#174A8B]">
              <Layers className="w-4 h-4 shrink-0" />
              <span>
                <strong>Source count:</strong> 3 active sources with approved data ready for aggregation.
              </span>
            </div>
            <span className="font-mono text-[#0F6B48] bg-[#E8F5E9] px-2 py-0.5 rounded text-[11px] font-medium">
              100% Approved Records
            </span>
          </div>
        </div>

        {/* Build Notes Banner */}
        <div className="p-3.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] space-y-1">
          <div className="font-medium text-[#171A1F]">Build Notes:</div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
            <li>Calculation jobs are asynchronous background tasks managed by the worker queue.</li>
            <li>Phase 1 scope covers: Scope 1 (Stationary combustion) + Scope 2 (Location-based grid electricity). Scope 3 is not in Phase 1.</li>
            <li>Produces an immutable calculation snapshot for complete verifier audit trail traceability.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
            className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-trigger-run-calculation"
            type="submit"
            disabled={isCalculating}
            className="px-6 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? 'Executing Calculation...' : 'Run Calculation'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
