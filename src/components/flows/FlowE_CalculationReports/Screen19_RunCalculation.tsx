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
  ShieldCheck,
  AlertTriangle,
  Scale,
  Hash,
  Flame,
  Truck,
  Zap,
  Leaf,
  FileCheck,
  Lock,
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
    currentRole,
    currentUser,
  } = useApp();

  const [period, setPeriod] = useState(activePeriod?.name || 'FY 2025–26');
  const [boundary, setBoundary] = useState('All configured sites (3)');
  const [gwpStandard, setGwpStandard] = useState<'AR5' | 'AR6'>('AR5');

  // Selected calculation formulas/modules
  const [selectedCalculations, setSelectedCalculations] = useState<Record<string, boolean>>({
    'C-01': true, // Stationary combustion
    'C-03': true, // Mobile combustion
    'C-04': false, // Process emissions
    'C-05': true, // Refrigerants
    'C-06': true, // Scope 2 location-based
    'C-07': false, // Scope 2 market-based
    'C-02': false, // Biogenic emissions
    'C-08': false, // Removals
    'C-11': false, // Product carbon footprint
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const toggleCalculation = (id: string) => {
    setSelectedCalculations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const calculationWorkflowSteps = [
    { title: '1. Ingest Activity Data', desc: 'Validating operational fuel, power, and refrigerant records' },
    { title: '2. Normalization & Physical Gate', desc: 'Executing unit conversions and liquid density compliance checks' },
    { title: '3. Emission Factor Selection', desc: 'Evaluating Tier 3 (Lab) -> Tier 2 (CEA v19) -> Tier 1 (IPCC)' },
    { title: '4. Formula Execution', desc: 'Running versioned formulas C-01 to C-12 with multi-gas disaggregation' },
    { title: '5. Aggregation & Reconciliation', desc: 'Rolling up Activity -> Site -> Organization without double counting' },
    { title: '6. Immutable Result Snapshot', desc: 'Generating verifiable SHA-256 hash lineage seal' },
  ];

  const handleRunCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setActiveStepIndex(1);

    showToast(
      'Deterministic Calculation Engine Queued',
      `Asynchronous run queued under TC-DOM-002a specification. Reporting Period: ${period}.`,
      'info'
    );

    // Step-by-step progress simulation
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          finishRun();
          return 6;
        }
        return prev + 1;
      });
    }, 350);

    const finishRun = () => {
      const activeIds = Object.keys(selectedCalculations).filter((k) => selectedCalculations[k]).join(', ');
      triggerCalculationRun(period, boundary);

      addAuditLog({
        userName: currentUser?.name || 'A. Kumar',
        role: currentRole,
        action: 'Executed TC-DOM-002a Calculation Engine Run',
        previousValue: 'Previous ledger snapshot #RUN-2214 (28,270 tCO2e)',
        newValue: `Job completed across ${boundary}. Formulas applied: [${activeIds}]. GWP Standard: ${gwpStandard}`,
        source: 'TC-DOM-002a Engine v1.4.2 (Asynchronous Worker)',
        reason: 'Periodic emissions consolidation with frozen CEA factor vintage',
        status: 'Complete',
        lineItemId: `#RUN-${Math.floor(2220 + Math.random() * 80)}`,
      });

      setIsCalculating(false);
      showToast(
        'Calculation Run Sealed',
        'Consolidated results calculated and verified with sha256 cryptographic snapshot.'
      );
      navigateToScreen('20_results_summary', 'FLOW_E');
    };
  };

  return (
    <div id="screen-19-container" className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Reports', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Calculations Ledger', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Run Calculation Engine' },
        ]}
        title="Execute GHG Protocol Calculation Run"
        badge={<StatusBadge status="Ready" customLabel="TC-DOM-002a Engine v1.4.2" size="sm" />}
        description="Run the versioned deterministic calculation engine across approved activity records to generate an immutable carbon snapshot."
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

      {/* 6-Step Engine Workflow Stepper Visualizer */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2.5">
          <span className="text-xs font-bold text-[#171A1F] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#01153C]" />
            TC-DOM-002a 6-Step Calculation Workflow Chain
          </span>
          <span className="text-[11px] font-mono text-[#01153C] bg-[#EDF2FA] px-2 py-0.5 rounded font-semibold">
            Deterministic &middot; Auditable Lineage
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-1 text-xs">
          {calculationWorkflowSteps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = isCalculating ? activeStepIndex > stepNum : true;
            const isCurrent = isCalculating && activeStepIndex === stepNum;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-[#01153C] text-white border-[#01153C] ring-2 ring-[#01153C]/20'
                    : isCompleted
                    ? 'bg-[#F8F9FB] text-[#171A1F] border-[#E5E7EB]'
                    : 'bg-white text-[#8A8F98] border-[#E5E7EB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#FFD166]' : 'text-[#01153C]'}`}>
                    Step {stepNum}
                  </span>
                  {isCurrent ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-[#0F6B48]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
                  )}
                </div>
                <div className="font-semibold text-[11px] truncate">{step.title.split('. ')[1]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Execution Setup Form */}
      <form onSubmit={handleRunCalculation} className="space-y-6">
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-semibold text-[#17181A] font-sans">Calculation Configuration & Boundaries</h2>
            <span className="text-[11px] font-data font-semibold text-[#01153C] bg-[#01153C]/10 px-2.5 py-1 rounded-full">
              Consolidation: Operational Control
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Frozen factor vintage: CEA Baseline v19
              </p>
            </div>

            {/* Boundary Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-1.5">
                Organizational Boundary <span className="text-[#B42318]">*</span>
              </label>
              <select
                value={boundary}
                disabled={isCalculating}
                onChange={(e) => setBoundary(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] font-sans focus:outline-none focus:border-[#01153C]"
              >
                <option value="All configured sites (3)">
                  All configured sites (3) — Chennai, Pune, Hyderabad
                </option>
                <option value="Chennai Plant 1 Only">Chennai Plant 1 (Manufacturing)</option>
                <option value="Pune Warehouse Only">Pune Warehouse (Logistics)</option>
                <option value="Hyderabad HQ Only">Hyderabad HQ (Commercial)</option>
              </select>
              <p className="text-[11px] text-[#5F6368] font-data mt-1.5">
                Consolidates 100% operational control
              </p>
            </div>

            {/* GWP Standard */}
            <div>
              <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-1.5">
                GWP 100-Year Standard <span className="text-[#B42318]">*</span>
              </label>
              <select
                value={gwpStandard}
                disabled={isCalculating}
                onChange={(e) => setGwpStandard(e.target.value as 'AR5' | 'AR6')}
                className="w-full px-3.5 py-2.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] font-sans focus:outline-none focus:border-[#01153C]"
              >
                <option value="AR5">IPCC AR5 (CH4: 28, N2O: 265) — Corporate Default</option>
                <option value="AR6">IPCC AR6 (CH4: 27.9, N2O: 273) — Latest Refinement</option>
              </select>
              <p className="text-[11px] text-[#5F6368] font-data mt-1.5">
                Gas-to-CO2e conversion standard
              </p>
            </div>
          </div>

          {/* Core Calculation Formulas Selection (C-01 to C-12) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans">
                Emissions Modules & Formulas to Execute (TC-DOM-002a Sheet 06)
              </label>
              <span className="text-[11px] text-[#5F6368]">
                {Object.values(selectedCalculations).filter(Boolean).length} modules active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* C-01 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-01'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-01']}
                  onChange={() => toggleCalculation('C-01')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ED2024]" />
                    <span>C-01: Stationary Fossil</span>
                  </div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Coal, furnace oil, diesel generators, boilers. Multi-gas CO2, CH4, N2O.
                  </div>
                </div>
              </label>

              {/* C-06 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-06'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-06']}
                  onChange={() => toggleCalculation('C-06')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#01153C]" />
                    <span>C-06: Scope 2 Grid (Location)</span>
                  </div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Purchased electricity mapped to regional CEA Baseline v19 (0.708 kg/kWh).
                  </div>
                </div>
              </label>

              {/* C-05 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-05'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-05']}
                  onChange={() => toggleCalculation('C-05')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5144C9]" />
                    <span>C-05: Refrigerants & F-Gas</span>
                  </div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Chiller top-ups, HVAC leakage (HFC-134a, R-410A) with GWP conversion.
                  </div>
                </div>
              </label>

              {/* C-03 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-03'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-03']}
                  onChange={() => toggleCalculation('C-03')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>C-03: Mobile Combustion</span>
                  </div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Logistics trucks, corporate fleet diesel with density normalization.
                  </div>
                </div>
              </label>

              {/* C-07 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-07'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-07']}
                  onChange={() => toggleCalculation('C-07')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F]">C-07: Scope 2 (Market-Based)</div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Contractual renewable PPA accounting + residual mix factor.
                  </div>
                </div>
              </label>

              {/* C-02 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-02'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-02']}
                  onChange={() => toggleCalculation('C-02')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#0F6B48]" />
                    <span>C-02: Biomass Combustion</span>
                  </div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Rice husk / bagasse biogenic CO2 segregated per GHG Protocol.
                  </div>
                </div>
              </label>

              {/* C-04 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-04'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-04']}
                  onChange={() => toggleCalculation('C-04')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F]">C-04: Process Mineral</div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Limestone calcination stoichiometric assay yield (CaCO3).
                  </div>
                </div>
              </label>

              {/* C-08 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-08'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-08']}
                  onChange={() => toggleCalculation('C-08')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F]">C-08: Removals & CCUS</div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Metered geological storage permanence deduction balance.
                  </div>
                </div>
              </label>

              {/* C-11 */}
              <label
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${
                  selectedCalculations['C-11'] ? 'bg-[#EDF2FA] border-[#01153C]/30' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCalculations['C-11']}
                  onChange={() => toggleCalculation('C-11')}
                  className="mt-0.5 rounded text-[#01153C] focus:ring-[#01153C]"
                />
                <div>
                  <div className="font-bold text-[#171A1F]">C-11: Product Footprint (A1–A3)</div>
                  <div className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">
                    Cradle-to-gate intensity per declared unit for CBAM & EPD.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Pre-Flight Validation Verification Banner */}
          <div className="p-4 bg-[#EDF2FA] border border-[#DCE5F5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5 text-[#01153C]">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#0F6B48]" />
              <div>
                <strong className="font-semibold">Pre-Flight Validation Check: Passed (0 Blockers)</strong>
                <p className="text-[11px] text-[#5F6368] mt-0.5">
                  All active units normalized &middot; Liquid fuel densities confirmed &middot; Factor vintages frozen for {period}.
                </p>
              </div>
            </div>
            <StatusBadge status="Approved" customLabel="Ready to Seal" size="sm" />
          </div>
        </div>

        {/* Action Buttons */}
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
            className="px-6 py-2.5 bg-[#01153C] hover:bg-[#02215c] text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Stage {activeStepIndex} of 6...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Calculation Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
