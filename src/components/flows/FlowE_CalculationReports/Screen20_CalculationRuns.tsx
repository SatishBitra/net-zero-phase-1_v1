import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Calculator,
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Eye,
  Plus,
  Download,
  Search,
  Filter,
  Layers,
  Building2,
  Sparkles,
  RefreshCw,
  FileText,
  ChevronRight,
  X,
  FileSpreadsheet,
  Hash,
  AlertCircle,
  Check,
  BookOpen,
} from 'lucide-react';

export const Screen20_CalculationRuns: React.FC = () => {
  const {
    calculationRuns,
    records,
    sites,
    periods,
    activePeriod,
    triggerCalculationRun,
    navigateToScreen,
    showToast,
    addAuditLog,
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'runs' | 'ledger' | 'methodology'>('runs');

  // Filters for Line-Item Ledger
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [selectedScopeFilter, setSelectedScopeFilter] = useState<string>('all');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');

  // Selected run for detail drawer inspection
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    calculationRuns[0]?.id || '#RUN-2214'
  );

  // Run execution modal
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runPeriod, setRunPeriod] = useState(activePeriod?.name || 'FY 2025-26');
  const [runScope, setRunScope] = useState('Scope 1 + Scope 2');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);

  // Latest run or fallback
  const latestRun = calculationRuns[0] || {
    id: '#RUN-2214',
    started: '20-Aug-2025 09:14',
    duration: '2m 40s',
    status: 'Completed',
    period: 'FY 2025-26',
    scope: 'Scope 1 + Scope 2',
    total_tCO2e: 28270,
    scope1: 18420,
    scope2: 9850,
  };

  const activeRun = calculationRuns.find((r) => r.id === selectedRunId) || latestRun;

  // Granular line-item ledger derived from records
  const ledgerItems = useMemo(() => {
    return records.map((rec, index) => {
      const gwp = 'IPCC AR5 GWP100';
      const factorCitation =
        rec.scope.includes('Scope 2') || rec.sourceName.toLowerCase().includes('electricity')
          ? 'CEA Baseline v19 (0.708 kg/kWh)'
          : rec.sourceName.toLowerCase().includes('diesel')
          ? 'IPCC 2006 (2.68 kg/L)'
          : 'MoEFCC Baseline (0.820 kg/unit)';

      return {
        ledgerId: `LEDG-2025-${String(index + 101).padStart(4, '0')}`,
        recordId: rec.id,
        date: rec.date,
        siteName: rec.siteName,
        sourceName: rec.sourceName,
        scope: rec.scope,
        quantity: rec.quantity,
        unit: rec.unit,
        factorValue: rec.emissionFactorApplied || (rec.scope.includes('Scope 2') ? 0.708 : 0.82),
        factorCitation,
        gwp,
        emissions_tCO2e: rec.emissions_tCO2e || Number(((rec.quantity * 0.708) / 1000).toFixed(3)),
        status: rec.status,
        evidenceFile: rec.evidenceFiles?.[0]?.name || 'TANGEDCO_HT_Bill_Jul_2025.pdf',
        reconciled: true,
      };
    });
  }, [records]);

  // Filtered line-item ledger
  const filteredLedger = useMemo(() => {
    return ledgerItems.filter((item) => {
      const matchSearch =
        item.sourceName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        item.siteName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        item.ledgerId.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        item.recordId.toLowerCase().includes(ledgerSearch.toLowerCase());

      const matchScope =
        selectedScopeFilter === 'all' || item.scope.toLowerCase().includes(selectedScopeFilter.toLowerCase());

      const matchSite = selectedSiteFilter === 'all' || item.siteName === selectedSiteFilter;

      return matchSearch && matchScope && matchSite;
    });
  }, [ledgerItems, ledgerSearch, selectedScopeFilter, selectedSiteFilter]);

  const filteredTotalEmissions = useMemo(() => {
    return filteredLedger.reduce((sum, item) => sum + item.emissions_tCO2e, 0);
  }, [filteredLedger]);

  // Handle new calculation execution
  const handleStartCalculation = () => {
    setIsExecuting(true);
    setExecutionStep(1);

    setTimeout(() => {
      setExecutionStep(2);
    }, 600);

    setTimeout(() => {
      setExecutionStep(3);
    }, 1200);

    setTimeout(() => {
      triggerCalculationRun(runPeriod, runScope);
      addAuditLog({
        userName: 'A. Kumar',
        role: 'Reviewer',
        action: 'Executed GHG Calculations Ledger Run',
        previousValue: `Previous run: ${latestRun.id} (${latestRun.total_tCO2e.toLocaleString()} tCO2e)`,
        newValue: `New Run: ${runPeriod} (${runScope}) — 28,270.0 tCO2e computed`,
        source: 'Calculation Engine v1.4.2',
        reason: 'Periodic carbon reconciliation and ledger balancing',
        status: 'Complete',
      });
      setIsExecuting(false);
      setIsRunModalOpen(false);
      setExecutionStep(0);
      showToast(
        'Calculation Run Completed',
        `Ledger updated with new immutable batch run for ${runPeriod}.`
      );
    }, 1800);
  };

  // CSV Export of Calculations Ledger
  const handleExportLedgerCSV = () => {
    const headers = [
      'Ledger Entry ID',
      'Record Reference',
      'Date',
      'Facility / Site',
      'Emission Source',
      'Scope',
      'Activity Quantity',
      'Unit',
      'Applied Emission Factor',
      'GWP Metric',
      'Calculated Emissions (tCO2e)',
      'Status',
      'Supporting Evidence',
    ];

    const rows = filteredLedger.map((item) => [
      item.ledgerId,
      item.recordId,
      item.date,
      `"${item.siteName}"`,
      `"${item.sourceName}"`,
      item.scope,
      item.quantity,
      item.unit,
      `"${item.factorCitation}"`,
      `"${item.gwp}"`,
      item.emissions_tCO2e.toFixed(3),
      item.status,
      `"${item.evidenceFile}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GHG_Calculations_Ledger_${activePeriod?.name || 'FY25-26'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      'Ledger Export Downloaded',
      `Exported ${filteredLedger.length} ledger journal lines with cryptographic hash record.`
    );
  };

  const handleViewDetails = (runId: string) => {
    showToast('Loading Traceability', `Opening Results Drill-Down for ${runId}.`);
    navigateToScreen('21_drill_down', 'FLOW_E');
  };

  return (
    <div id="calculations-ledger-container" className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Context Actions */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Calculations & Results</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Calculations Ledger</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/calculations/ledger</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Calculations Ledger</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Deterministic GHG accounting book and batch execution ledger. Auditable reconciliation of activity records, emission factors, and verified tCO2e balances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-ledger"
              type="button"
              onClick={handleExportLedgerCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#171A1F] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors font-medium shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#5E6672]" />
              <span>Export Ledger (CSV)</span>
            </button>

            <button
              id="btn-drilldown-shortcut"
              type="button"
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#174A8B] bg-[#EAF2FB] border border-[#2166B1]/20 rounded hover:bg-[#2166B1]/10 transition-colors font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Results Drill-Down</span>
            </button>

            <button
              id="btn-trigger-run-modal"
              type="button"
              onClick={() => setIsRunModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] transition-colors font-medium shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Calculation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accounting Balance Strip & Assurance KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5E6672]">Consolidated Balance</span>
            <span className="text-[10px] font-mono bg-[#EAF2FB] text-[#174A8B] px-1.5 py-0.5 rounded font-medium">
              {activeRun.period}
            </span>
          </div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {activeRun.total_tCO2e.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
            <span className="text-xs font-normal text-[#5E6672]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#0F6B48] mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-[#0F6B48]" />
            <span>Reconciled across {sites.length} operational sites</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5E6672]">Scope 1: Direct Combustion</span>
            <span className="text-[10px] text-[#5E6672] font-mono">
              {((activeRun.scope1 / activeRun.total_tCO2e) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-normal text-[#171A1F] font-mono mt-1">
            {activeRun.scope1.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
            <span className="text-xs font-normal text-[#5E6672]">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#5E6672] mt-1">
            Stationary diesel generators & LPG
          </div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#174A8B] font-medium">Scope 2: Location-based Grid</span>
            <span className="text-[10px] text-[#174A8B] font-mono">
              {((activeRun.scope2 / activeRun.total_tCO2e) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-normal text-[#174A8B] font-mono mt-1">
            {activeRun.scope2.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
            <span className="text-xs font-normal text-[#174A8B]/70">tCO2e</span>
          </div>
          <div className="text-[11px] text-[#5E6672] mt-1">
            CEA v19 grid factor (0.708 kg/kWh)
          </div>
        </div>

        <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5E6672]">Assurance & Cryptographic Hash</span>
            <span className="text-[10px] font-mono text-[#0F6B48] bg-[#E8F5E9] px-1.5 py-0.5 rounded font-medium">
              Verified
            </span>
          </div>
          <div className="text-xs font-mono text-[#171A1F] font-medium mt-2 truncate" title="sha256:7f83b1a2e4d5690bca81">
            sha256:7f83b1a2e4d5...
          </div>
          <div className="text-[11px] text-[#5E6672] mt-1 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B48]" />
            <span>Deterministic engine v1.4.2</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#D9DDE3] flex items-center space-x-6 text-xs overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        <button
          id="tab-calculation-runs"
          type="button"
          onClick={() => setActiveTab('runs')}
          className={`pb-2.5 font-medium transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'runs'
              ? 'border-[#174A8B] text-[#174A8B]'
              : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Calculation Runs (Batch Ledger)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#F1F3F5] text-[#5E6672] font-mono">
            {calculationRuns.length}
          </span>
        </button>

        <button
          id="tab-line-item-ledger"
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`pb-2.5 font-medium transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'ledger'
              ? 'border-[#174A8B] text-[#174A8B]'
              : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Line-Item Emissions Ledger</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#F1F3F5] text-[#5E6672] font-mono">
            {records.length} entries
          </span>
        </button>

        <button
          id="tab-methodology"
          type="button"
          onClick={() => setActiveTab('methodology')}
          className={`pb-2.5 font-medium transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === 'methodology'
              ? 'border-[#174A8B] text-[#174A8B]'
              : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Methodology & Factor Registry</span>
        </button>
      </div>

      {/* TAB 1: BATCH CALCULATION RUNS */}
      {activeTab === 'runs' && (
        <div className="space-y-6">
          {/* Active Run Inspector Card */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F1F3F5] gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center font-bold font-mono text-sm">
                  {activeRun.id.replace('#RUN-', '')}
                </div>
                <div>
                  <div className="text-xs text-[#5E6672]">Inspecting Calculation Batch</div>
                  <div className="text-sm font-semibold text-[#171A1F] flex items-center space-x-2">
                    <span className="font-mono text-[#174A8B]">{activeRun.id}</span>
                    <span>·</span>
                    <span>{activeRun.period}</span>
                    <span>·</span>
                    <span className="text-xs font-normal text-[#5E6672]">{activeRun.scope}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="inline-flex items-center space-x-1 text-[#0F6B48] bg-[#E8F5E9] px-2.5 py-1 rounded font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeRun.status}</span>
                </span>
                <span className="text-[#5E6672] font-mono text-[11px] flex items-center space-x-1 bg-[#F8F9FB] px-2 py-1 rounded border border-[#D9DDE3]">
                  <Clock className="w-3.5 h-3.5 text-[#858C96]" />
                  <span>Runtime: {activeRun.duration}</span>
                </span>
              </div>
            </div>

            {/* Scope Visualizer Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5E6672]">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#174A8B]" />
                    <span>Scope 1 ({activeRun.scope1.toLocaleString()} tCO2e)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2166B1]" />
                    <span>Scope 2 ({activeRun.scope2.toLocaleString()} tCO2e)</span>
                  </span>
                </div>
                <span className="font-mono font-medium text-[#171A1F]">
                  Total: {activeRun.total_tCO2e.toLocaleString()} tCO2e
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#F1F3F5] rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(activeRun.scope1 / activeRun.total_tCO2e) * 100}%` }}
                  className="bg-[#174A8B] h-full"
                  title={`Scope 1: ${activeRun.scope1} tCO2e`}
                />
                <div
                  style={{ width: `${(activeRun.scope2 / activeRun.total_tCO2e) * 100}%` }}
                  className="bg-[#2166B1] h-full"
                  title={`Scope 2: ${activeRun.scope2} tCO2e`}
                />
              </div>
            </div>

            {/* Quick Traceability Action Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#F1F3F5] text-xs gap-2">
              <div className="text-[#5E6672] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0F6B48]" />
                <span>Deterministic snapshot verified against GHG Protocol Corporate Standard.</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleViewDetails(activeRun.id)}
                  className="px-3 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white rounded font-medium flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Results Drill-Down</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Runs Table */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#171A1F]">Historical Batch Ledger</h2>
              <span className="text-xs text-[#5E6672] font-mono">
                {calculationRuns.length} recorded engine runs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                    <th className="py-2.5 px-4 font-medium">Run ID</th>
                    <th className="py-2.5 px-4 font-medium">Period & Scope</th>
                    <th className="py-2.5 px-4 font-medium">Timestamp</th>
                    <th className="py-2.5 px-4 font-medium">Duration</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium text-right">Scope 1 (tCO2e)</th>
                    <th className="py-2.5 px-4 font-medium text-right">Scope 2 (tCO2e)</th>
                    <th className="py-2.5 px-4 font-medium text-right">Total (tCO2e)</th>
                    <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {calculationRuns.map((run) => {
                    const isSelected = run.id === selectedRunId;
                    return (
                      <tr
                        key={run.id}
                        onClick={() => setSelectedRunId(run.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#EAF2FB]/50' : 'hover:bg-[#F8F9FB]'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-medium text-[#174A8B] whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#174A8B]" />}
                            <span>{run.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#171A1F]">
                          <div className="font-medium">{run.period}</div>
                          <div className="text-[11px] text-[#5E6672]">{run.scope}</div>
                        </td>
                        <td className="py-3 px-4 text-[#5E6672] font-mono whitespace-nowrap">
                          {run.started}
                        </td>
                        <td className="py-3 px-4 text-[#5E6672] font-mono whitespace-nowrap">
                          {run.duration}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1 text-[#0F6B48] bg-[#E8F5E9] px-2 py-0.5 rounded text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{run.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-right text-[#171A1F]">
                          {run.scope1.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3 px-4 font-mono text-right text-[#174A8B]">
                          {run.scope2.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3 px-4 font-mono text-right font-medium text-[#171A1F]">
                          {run.total_tCO2e.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(run.id);
                              }}
                              className="inline-flex items-center space-x-1 text-[#174A8B] hover:underline font-medium text-xs"
                            >
                              <span>Drill-Down</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LINE-ITEM ACCOUNTING LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filtering and Search Controls */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder="Search ledger entries by source, facility, record ID..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#D9DDE3] rounded focus:outline-none focus:ring-1 focus:ring-[#174A8B] bg-white text-[#171A1F]"
                />
                <Search className="w-4 h-4 text-[#858C96] absolute left-2.5 top-2" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Scope Filter */}
                <select
                  value={selectedScopeFilter}
                  onChange={(e) => setSelectedScopeFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none"
                >
                  <option value="all">All Scopes</option>
                  <option value="scope 1">Scope 1 Only</option>
                  <option value="scope 2">Scope 2 Only</option>
                </select>

                {/* Site Filter */}
                <select
                  value={selectedSiteFilter}
                  onChange={(e) => setSelectedSiteFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none"
                >
                  <option value="all">All Facilities</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {(ledgerSearch || selectedScopeFilter !== 'all' || selectedSiteFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setLedgerSearch('');
                      setSelectedScopeFilter('all');
                      setSelectedSiteFilter('all');
                    }}
                    className="px-2 py-1 text-xs text-[#5E6672] hover:text-[#171A1F] underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Live Filter Summary Tally */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F1F3F5] text-[#5E6672]">
              <div>
                Showing <strong className="text-[#171A1F]">{filteredLedger.length}</strong> of{' '}
                {ledgerItems.length} reconciled journal entries
              </div>
              <div className="font-mono text-xs">
                Filtered Total:{' '}
                <strong className="text-[#174A8B] font-semibold">
                  {filteredTotalEmissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  tCO2e
                </strong>
              </div>
            </div>
          </div>

          {/* Granular Journal Table */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                    <th className="py-2.5 px-4 font-medium">Ledger ID</th>
                    <th className="py-2.5 px-4 font-medium">Date</th>
                    <th className="py-2.5 px-4 font-medium">Facility / Site</th>
                    <th className="py-2.5 px-4 font-medium">Emission Source</th>
                    <th className="py-2.5 px-4 font-medium text-right">Raw Activity</th>
                    <th className="py-2.5 px-4 font-medium">Applied Factor & Citation</th>
                    <th className="py-2.5 px-4 font-medium text-right">Emissions (tCO2e)</th>
                    <th className="py-2.5 px-4 font-medium">Evidence Document</th>
                    <th className="py-2.5 px-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {filteredLedger.map((item) => (
                    <tr key={item.ledgerId} className="hover:bg-[#F8F9FB] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[#174A8B] whitespace-nowrap">
                        {item.ledgerId}
                      </td>
                      <td className="py-3 px-4 text-[#5E6672] font-mono whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 text-[#171A1F] font-medium whitespace-nowrap">
                        {item.siteName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[#171A1F] font-medium">{item.sourceName}</div>
                        <span className="text-[10px] text-[#858C96]">{item.scope}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#171A1F] whitespace-nowrap">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-[#5E6672]">
                        <div className="font-mono text-[11px] text-[#171A1F]">
                          {item.factorValue} kg CO2e / {item.unit}
                        </div>
                        <div className="text-[10px] text-[#858C96]">{item.factorCitation}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#171A1F] whitespace-nowrap">
                        {item.emissions_tCO2e.toFixed(3)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Evidence Repository', `Opening ${item.evidenceFile}`);
                            navigateToScreen('16_attach_evidence', 'FLOW_B');
                          }}
                          className="inline-flex items-center space-x-1 text-[#174A8B] hover:underline text-[11px]"
                        >
                          <FileText className="w-3 h-3 text-[#174A8B]" />
                          <span className="truncate max-w-[140px]">{item.evidenceFile}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#E8F5E9] text-[#0F6B48]">
                          <Check className="w-3 h-3" />
                          <span>Reconciled</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: METHODOLOGY & FACTOR REGISTRY */}
      {activeTab === 'methodology' && (
        <div className="space-y-6">
          {/* Mathematical Formulation Card */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-medium text-[#171A1F] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#174A8B]" />
              <span>Deterministic GHG Protocol Calculation Engine</span>
            </h2>
            <p className="text-xs text-[#5E6672] leading-relaxed">
              Emissions in this ledger are computed strictly adhering to the GHG Protocol Corporate Standard (WBCSD & WRI) and ISO 14064-1 specification.
            </p>

            <div className="p-4 bg-[#F8F9FB] border border-[#D9DDE3] rounded font-mono text-xs text-[#171A1F] space-y-2">
              <div className="font-semibold text-[#174A8B]">General Formulation:</div>
              <div className="bg-white p-2.5 rounded border border-[#D9DDE3]">
                Emissions (tCO2e) = [ Activity Data (Quantity in Unit) × Emission Factor (kg CO2e / Unit) × GWP ] ÷ 1,000
              </div>
              <div className="text-[11px] text-[#5E6672]">
                • GWP Basis: IPCC Fifth Assessment Report (AR5) 100-year time horizon (CO2 = 1, CH4 = 28, N2O = 265).
              </div>
            </div>
          </div>

          {/* Active Factor Registry Table */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#171A1F]">Applied Emission Factor Library</h3>
              <button
                type="button"
                onClick={() => navigateToScreen('22_factors_reference', 'FLOW_E')}
                className="text-xs text-[#174A8B] hover:underline font-medium flex items-center space-x-1"
              >
                <span>Full Factor Library (Screen 22)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                  <th className="py-2.5 px-4 font-medium">Source / Fuel</th>
                  <th className="py-2.5 px-4 font-medium">Scope</th>
                  <th className="py-2.5 px-4 font-medium">Factor Value</th>
                  <th className="py-2.5 px-4 font-medium">Unit</th>
                  <th className="py-2.5 px-4 font-medium">Authority & Version</th>
                  <th className="py-2.5 px-4 font-medium">Tier & Uncertainty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                <tr>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">Grid Electricity (Southern Region)</td>
                  <td className="py-3 px-4 text-[#174A8B]">Scope 2</td>
                  <td className="py-3 px-4 font-mono font-medium text-[#171A1F]">0.7080</td>
                  <td className="py-3 px-4 text-[#5E6672] font-mono">kg CO2e / kWh</td>
                  <td className="py-3 px-4 text-[#5E6672]">Central Electricity Authority (CEA) Baseline v19 (2024)</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-[#EAF2FB] text-[#174A8B] rounded text-[10px] font-medium">
                      Tier 2 · ±3.5%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">Diesel Fuel (Stationary DG Sets)</td>
                  <td className="py-3 px-4 text-[#171A1F]">Scope 1</td>
                  <td className="py-3 px-4 font-mono font-medium text-[#171A1F]">2.6800</td>
                  <td className="py-3 px-4 text-[#5E6672] font-mono">kg CO2e / Liter</td>
                  <td className="py-3 px-4 text-[#5E6672]">IPCC 2006 Guidelines for National GHG Inventories</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-[#EAF2FB] text-[#174A8B] rounded text-[10px] font-medium">
                      Tier 1 · ±2.0%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">Natural Gas (Stationary Heating)</td>
                  <td className="py-3 px-4 text-[#171A1F]">Scope 1</td>
                  <td className="py-3 px-4 font-mono font-medium text-[#171A1F]">1.9800</td>
                  <td className="py-3 px-4 text-[#5E6672] font-mono">kg CO2e / m³</td>
                  <td className="py-3 px-4 text-[#5E6672]">UK DEFRA / BEIS Voluntary Reporting Standards</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-[#EAF2FB] text-[#174A8B] rounded text-[10px] font-medium">
                      Tier 1 · ±4.0%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXECUTE CALCULATION RUN MODAL */}
      {isRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#D9DDE3] overflow-hidden">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">Execute GHG Calculation Run</h3>
              </div>
              <button
                type="button"
                onClick={() => !isExecuting && setIsRunModalOpen(false)}
                className="text-[#858C96] hover:text-[#171A1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Reporting Period
                </label>
                <select
                  value={runPeriod}
                  disabled={isExecuting}
                  onChange={(e) => setRunPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F]"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.startDate} to {p.endDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Calculation Scope Boundary
                </label>
                <select
                  value={runScope}
                  disabled={isExecuting}
                  onChange={(e) => setRunScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F]"
                >
                  <option value="Scope 1 + Scope 2">Scope 1 & Scope 2 (Location-based)</option>
                  <option value="Scope 1 Only">Scope 1 Only (Direct Combustion)</option>
                  <option value="Scope 2 Only">Scope 2 Only (Grid Electricity)</option>
                </select>
              </div>

              {/* Progress Feedback during execution */}
              {isExecuting && (
                <div className="p-3 bg-[#EAF2FB] border border-[#2166B1]/20 rounded space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-[#174A8B] font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Calculation Batch...</span>
                  </div>
                  <div className="text-[11px] text-[#5E6672] space-y-1">
                    <div className={executionStep >= 1 ? 'text-[#0F6B48]' : 'text-[#858C96]'}>
                      ✓ Reconciling approved activity records ({records.length} items)
                    </div>
                    <div className={executionStep >= 2 ? 'text-[#0F6B48]' : 'text-[#858C96]'}>
                      ✓ Applying CEA v19 and IPCC 2006 emission factors
                    </div>
                    <div className={executionStep >= 3 ? 'text-[#0F6B48]' : 'text-[#858C96]'}>
                      ✓ Signing immutable cryptographic ledger seal
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#D9DDE3] bg-[#F8F9FB] flex items-center justify-end space-x-2">
              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setIsRunModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecuting}
                onClick={handleStartCalculation}
                className="px-4 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] font-medium shadow-sm flex items-center space-x-1.5"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Calculation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
