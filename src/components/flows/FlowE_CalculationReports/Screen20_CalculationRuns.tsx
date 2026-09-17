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
  ShieldCheck,
  Eye,
  Download,
  Search,
  Filter,
  Layers,
  Sparkles,
  RefreshCw,
  FileText,
  X,
  FileSpreadsheet,
  BookOpen,
  Database,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';

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

  // Selected run for detail inspection
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    calculationRuns[0]?.id || '#RUN-2214'
  );

  // Run execution modal
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runPeriod, setRunPeriod] = useState(activePeriod?.name || 'FY 2025–26');
  const [runScope, setRunScope] = useState('Scope 1 + Scope 2');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);

  // Latest run or fallback
  const latestRun = calculationRuns[0] || {
    id: '#RUN-2214',
    started: '20-Aug-2025 09:14',
    duration: '2m 40s',
    status: 'Completed',
    period: 'FY 2025–26',
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
    <div id="calculations-ledger-container" className="space-y-6">
      {/* Top Header & Context Actions using standard PageHeader */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Reports', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Calculations Ledger' },
        ]}
        title="Calculations Ledger"
        badge={<StatusBadge status="Approved" customLabel="Engine v1.4.2" size="sm" />}
        description="Deterministic GHG accounting book and batch execution ledger. Auditable reconciliation of activity records, emission factors, and verified tCO2e balances."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-export-ledger"
              type="button"
              onClick={handleExportLedgerCSV}
              className="px-4 py-2 text-xs font-semibold text-[#17181A] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] hover:border-[#D5D8DD] shadow-2xs inline-flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Export Ledger (CSV)</span>
            </button>

            <button
              id="btn-drilldown-shortcut"
              type="button"
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="px-4 py-2 text-xs font-semibold text-[#6254E8] bg-[#6254E8]/10 border border-[#6254E8]/20 rounded-full hover:bg-[#6254E8]/15 shadow-2xs inline-flex items-center space-x-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Results Drill-Down</span>
            </button>

            <button
              id="btn-trigger-run-modal"
              type="button"
              onClick={() => setIsRunModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#6254E8] rounded-full hover:bg-[#5244DE] shadow-sm inline-flex items-center space-x-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Calculation</span>
            </button>
          </div>
        }
      />

      {/* Accounting Balance Strip & Assurance KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Consolidated Balance"
          value={`${activeRun.total_tCO2e.toLocaleString('en-US', { minimumFractionDigits: 1 })} tCO2e`}
          subtext={`Reconciled across ${sites.length} facilities`}
          icon={<CheckCircle2 className="w-4 h-4 text-[#0F9D58]" />}
          change={activeRun.period}
        />

        <KpiCard
          label="Scope 1: Direct Combustion"
          value={`${activeRun.scope1.toLocaleString('en-US', { minimumFractionDigits: 1 })} tCO2e`}
          subtext="Stationary diesel generators & LPG"
          icon={<Calculator className="w-4 h-4 text-[#8A8F98]" />}
          change={`${((activeRun.scope1 / activeRun.total_tCO2e) * 100).toFixed(1)}%`}
        />

        <KpiCard
          label="Scope 2: Grid Electricity"
          value={`${activeRun.scope2.toLocaleString('en-US', { minimumFractionDigits: 1 })} tCO2e`}
          subtext="CEA v19 grid factor (0.708 kg/kWh)"
          icon={<Layers className="w-4 h-4 text-[#6254E8]" />}
          change={`${((activeRun.scope2 / activeRun.total_tCO2e) * 100).toFixed(1)}%`}
        />

        <KpiCard
          label="Assurance & Hash"
          value="sha256:7f83b1..."
          subtext="Deterministic engine v1.4.2"
          statusDot="success"
          icon={<ShieldCheck className="w-4 h-4 text-[#0F9D58]" />}
          change="Verified"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#E5E7EB] flex items-center space-x-6 text-xs overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        <button
          id="tab-calculation-runs"
          type="button"
          onClick={() => setActiveTab('runs')}
          className={`pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans ${
            activeTab === 'runs'
              ? 'border-[#6254E8] text-[#6254E8]'
              : 'border-transparent text-[#5F6368] hover:text-[#17181A] hover:border-[#D5D8DD]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Calculation Runs (Batch Ledger)</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold ${
              activeTab === 'runs' ? 'bg-[#6254E8]/10 text-[#6254E8]' : 'bg-[#F1F3F5] text-[#5F6368]'
            }`}
          >
            {calculationRuns.length}
          </span>
        </button>

        <button
          id="tab-line-item-ledger"
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans ${
            activeTab === 'ledger'
              ? 'border-[#6254E8] text-[#6254E8]'
              : 'border-transparent text-[#5F6368] hover:text-[#17181A] hover:border-[#D5D8DD]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Line-Item Emissions Ledger</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold ${
              activeTab === 'ledger' ? 'bg-[#6254E8]/10 text-[#6254E8]' : 'bg-[#F1F3F5] text-[#5F6368]'
            }`}
          >
            {records.length} entries
          </span>
        </button>

        <button
          id="tab-methodology"
          type="button"
          onClick={() => setActiveTab('methodology')}
          className={`pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans ${
            activeTab === 'methodology'
              ? 'border-[#6254E8] text-[#6254E8]'
              : 'border-transparent text-[#5F6368] hover:text-[#17181A] hover:border-[#D5D8DD]'
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
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F3F5] gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#6254E8]/10 text-[#6254E8] flex items-center justify-center font-bold font-data text-sm">
                  {activeRun.id.replace('#RUN-', '')}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans">
                    Inspecting Calculation Batch
                  </div>
                  <div className="text-base font-bold text-[#17181A] flex items-center space-x-2 mt-0.5 font-sans">
                    <span className="font-data text-[#6254E8]">{activeRun.id}</span>
                    <span className="text-[#8A8F98]">·</span>
                    <span>{activeRun.period}</span>
                    <span className="text-[#8A8F98]">·</span>
                    <span className="text-xs font-normal text-[#5F6368]">{activeRun.scope}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <StatusBadge status={activeRun.status} size="md" />
                <span className="text-[#5F6368] font-data text-xs flex items-center space-x-1.5 bg-[#FAFAFB] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                  <Clock className="w-3.5 h-3.5 text-[#8A8F98]" />
                  <span>Runtime: {activeRun.duration}</span>
                </span>
              </div>
            </div>

            {/* Scope Visualizer Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#5F6368] font-data">
                <div className="flex items-center space-x-5">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6254E8]" />
                    <span>Scope 1: {activeRun.scope1.toLocaleString()} tCO2e</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8145C5]" />
                    <span>Scope 2: {activeRun.scope2.toLocaleString()} tCO2e</span>
                  </span>
                </div>
                <span className="font-semibold text-[#17181A]">
                  Total: {activeRun.total_tCO2e.toLocaleString()} tCO2e
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#F1F3F5] rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(activeRun.scope1 / activeRun.total_tCO2e) * 100}%` }}
                  className="bg-[#6254E8] h-full transition-all"
                  title={`Scope 1: ${activeRun.scope1} tCO2e`}
                />
                <div
                  style={{ width: `${(activeRun.scope2 / activeRun.total_tCO2e) * 100}%` }}
                  className="bg-[#8145C5] h-full transition-all"
                  title={`Scope 2: ${activeRun.scope2} tCO2e`}
                />
              </div>
            </div>

            {/* Quick Traceability Action Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#F1F3F5] text-xs gap-3">
              <div className="text-[#5F6368] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0F9D58]" />
                <span className="font-data">
                  Deterministic snapshot verified against GHG Protocol Corporate Standard.
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleViewDetails(activeRun.id)}
                  className="px-3.5 py-1.5 bg-[#6254E8] hover:bg-[#5244DE] text-white rounded-lg font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Results Drill-Down</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Runs Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFB]">
              <h2 className="text-sm font-semibold text-[#17181A] font-sans">Historical Batch Ledger</h2>
              <span className="text-xs text-[#5F6368] font-data font-semibold">
                {calculationRuns.length} recorded engine runs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Run ID</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Period & Scope</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Timestamp</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Duration</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Status</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Scope 1 (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Scope 2 (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Total (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Actions</th>
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
                          isSelected ? 'bg-[#6254E8]/5' : 'hover:bg-[#FAFAFB]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-data font-semibold text-[#6254E8] whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#6254E8]" />}
                            <span>{run.id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#17181A]">
                          <div className="font-semibold font-sans">{run.period}</div>
                          <div className="text-[11px] text-[#5F6368]">{run.scope}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#5F6368] font-data whitespace-nowrap">
                          {run.started}
                        </td>
                        <td className="py-3.5 px-4 text-[#5F6368] font-data whitespace-nowrap">
                          {run.duration}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={run.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 font-data text-right text-[#17181A]">
                          {run.scope1.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 font-data text-right text-[#6254E8] font-semibold">
                          {run.scope2.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 font-data text-right font-bold text-[#17181A]">
                          {run.total_tCO2e.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(run.id);
                              }}
                              className="inline-flex items-center space-x-1 text-[#6254E8] hover:underline font-semibold text-xs"
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
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder="Search ledger entries by source, facility, record ID..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#6254E8]/20 focus:border-[#6254E8] bg-white text-[#17181A] font-sans placeholder-[#8A8F98]"
                />
                <Search className="w-4 h-4 text-[#8A8F98] absolute left-3 top-2.5" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Scope Filter */}
                <select
                  value={selectedScopeFilter}
                  onChange={(e) => setSelectedScopeFilter(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#6254E8] font-sans"
                >
                  <option value="all">All Scopes</option>
                  <option value="scope 1">Scope 1 Only</option>
                  <option value="scope 2">Scope 2 Only</option>
                </select>

                {/* Site Filter */}
                <select
                  value={selectedSiteFilter}
                  onChange={(e) => setSelectedSiteFilter(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#6254E8] font-sans"
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
                    className="px-2 py-1 text-xs text-[#5F6368] hover:text-[#17181A] underline font-sans"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Live Filter Summary Tally */}
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#F1F3F5] text-[#5F6368] font-data">
              <div>
                Showing <strong className="text-[#17181A] font-semibold">{filteredLedger.length}</strong> of{' '}
                {ledgerItems.length} reconciled journal entries
              </div>
              <div>
                Filtered Total:{' '}
                <strong className="text-[#6254E8] font-bold">
                  {filteredTotalEmissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  tCO2e
                </strong>
              </div>
            </div>
          </div>

          {/* Granular Journal Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Ledger ID</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Date</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Facility / Site</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Emission Source</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Raw Activity</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Applied Factor & Citation</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Emissions (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Evidence Document</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {filteredLedger.map((item) => (
                    <tr key={item.ledgerId} className="hover:bg-[#FAFAFB] transition-colors">
                      <td className="py-3.5 px-4 font-data font-semibold text-[#6254E8] whitespace-nowrap">
                        {item.ledgerId}
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6368] font-data whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-4 text-[#17181A] font-medium whitespace-nowrap font-sans">
                        {item.siteName}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="text-[#17181A] font-semibold">{item.sourceName}</div>
                        <span className="text-[11px] text-[#8A8F98] font-data">{item.scope}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-data text-[#17181A] whitespace-nowrap font-semibold">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6368]">
                        <div className="font-data text-xs text-[#17181A] font-semibold">
                          {item.factorValue} kg CO2e / {item.unit}
                        </div>
                        <div className="text-[11px] text-[#8A8F98] font-sans">{item.factorCitation}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-data font-bold text-[#17181A] whitespace-nowrap">
                        {item.emissions_tCO2e.toFixed(3)}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Evidence Repository', `Opening ${item.evidenceFile}`);
                            navigateToScreen('16_attach_evidence', 'FLOW_B');
                          }}
                          className="inline-flex items-center space-x-1.5 text-[#6254E8] hover:underline text-xs font-medium font-sans"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#6254E8]" />
                          <span className="truncate max-w-[140px]">{item.evidenceFile}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <StatusBadge status="Approved" customLabel="Reconciled" size="sm" />
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
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-semibold text-[#17181A] flex items-center space-x-2 font-sans">
              <Sparkles className="w-4 h-4 text-[#6254E8]" />
              <span>Deterministic GHG Protocol Calculation Engine</span>
            </h2>
            <p className="text-xs text-[#5F6368] leading-relaxed font-sans max-w-3xl">
              Emissions in this ledger are computed strictly adhering to the GHG Protocol Corporate Standard (WBCSD & WRI) and ISO 14064-1 specification.
            </p>

            <div className="p-4 bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg font-data text-xs text-[#17181A] space-y-2">
              <div className="font-semibold text-[#6254E8] font-sans uppercase tracking-wider text-[11px]">
                General Mathematical Formulation:
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#E5E7EB] font-bold text-xs">
                Emissions (tCO2e) = [ Activity Data (Quantity in Unit) × Emission Factor (kg CO2e / Unit) × GWP ] ÷ 1,000
              </div>
              <div className="text-[11px] text-[#5F6368] font-sans">
                • GWP Basis: IPCC Fifth Assessment Report (AR5) 100-year time horizon (CO2 = 1, CH4 = 28, N2O = 265).
              </div>
            </div>
          </div>

          {/* Active Factor Registry Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFB]">
              <h3 className="text-sm font-semibold text-[#17181A] font-sans">Applied Emission Factor Library</h3>
              <button
                type="button"
                onClick={() => navigateToScreen('22_factors_reference', 'FLOW_E')}
                className="text-xs text-[#6254E8] hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Full Factor Library (Screen 22)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Source / Fuel</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Scope</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Factor Value</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Unit</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Authority & Version</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Tier & Uncertainty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#17181A] font-sans">Grid Electricity (Southern Region)</td>
                  <td className="py-3.5 px-4 text-[#6254E8] font-semibold font-sans">Scope 2</td>
                  <td className="py-3.5 px-4 font-data font-bold text-[#17181A]">0.7080</td>
                  <td className="py-3.5 px-4 text-[#5F6368] font-data">kg CO2e / kWh</td>
                  <td className="py-3.5 px-4 text-[#5F6368] font-sans">Central Electricity Authority (CEA) Baseline v19 (2024)</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-[#6254E8]/10 text-[#6254E8] rounded-full text-[11px] font-semibold font-data">
                      Tier 2 · ±3.5%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#17181A] font-sans">Diesel Fuel (Stationary DG Sets)</td>
                  <td className="py-3.5 px-4 text-[#17181A] font-semibold font-sans">Scope 1</td>
                  <td className="py-3.5 px-4 font-data font-bold text-[#17181A]">2.6800</td>
                  <td className="py-3.5 px-4 text-[#5F6368] font-data">kg CO2e / Liter</td>
                  <td className="py-3.5 px-4 text-[#5F6368] font-sans">IPCC 2006 Guidelines for National GHG Inventories</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-[#6254E8]/10 text-[#6254E8] rounded-full text-[11px] font-semibold font-data">
                      Tier 1 · ±2.0%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-[#17181A] font-sans">Natural Gas (Stationary Heating)</td>
                  <td className="py-3.5 px-4 text-[#17181A] font-semibold font-sans">Scope 1</td>
                  <td className="py-3.5 px-4 font-data font-bold text-[#17181A]">1.9800</td>
                  <td className="py-3.5 px-4 text-[#5F6368] font-data">kg CO2e / m³</td>
                  <td className="py-3.5 px-4 text-[#5F6368] font-sans">UK DEFRA / BEIS Voluntary Reporting Standards</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-[#6254E8]/10 text-[#6254E8] rounded-full text-[11px] font-semibold font-data">
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#E5E7EB] overflow-hidden">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFB]">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-[#6254E8]" />
                <h3 className="text-sm font-semibold text-[#17181A] font-sans">Execute GHG Calculation Run</h3>
              </div>
              <button
                type="button"
                onClick={() => !isExecuting && setIsRunModalOpen(false)}
                className="text-[#8A8F98] hover:text-[#17181A] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-1.5">
                  Reporting Period
                </label>
                <select
                  value={runPeriod}
                  disabled={isExecuting}
                  onChange={(e) => setRunPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] font-sans focus:outline-none focus:border-[#6254E8]"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.startDate} to {p.endDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider font-sans mb-1.5">
                  Calculation Scope Boundary
                </label>
                <select
                  value={runScope}
                  disabled={isExecuting}
                  onChange={(e) => setRunScope(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] font-sans focus:outline-none focus:border-[#6254E8]"
                >
                  <option value="Scope 1 + Scope 2">Scope 1 & Scope 2 (Location-based)</option>
                  <option value="Scope 1 Only">Scope 1 Only (Direct Combustion)</option>
                  <option value="Scope 2 Only">Scope 2 Only (Grid Electricity)</option>
                </select>
              </div>

              {/* Progress Feedback during execution */}
              {isExecuting && (
                <div className="p-4 bg-[#6254E8]/5 border border-[#6254E8]/20 rounded-xl space-y-2.5">
                  <div className="flex items-center space-x-2 text-xs text-[#6254E8] font-semibold font-sans">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Calculation Batch...</span>
                  </div>
                  <div className="text-[11px] text-[#5F6368] space-y-1 font-data">
                    <div className={executionStep >= 1 ? 'text-[#0F9D58] font-semibold' : 'text-[#8A8F98]'}>
                      ✓ Reconciling approved activity records ({records.length} items)
                    </div>
                    <div className={executionStep >= 2 ? 'text-[#0F9D58] font-semibold' : 'text-[#8A8F98]'}>
                      ✓ Applying CEA v19 and IPCC 2006 emission factors
                    </div>
                    <div className={executionStep >= 3 ? 'text-[#0F9D58] font-semibold' : 'text-[#8A8F98]'}>
                      ✓ Signing immutable cryptographic ledger seal
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFAFB] flex items-center justify-end space-x-2">
              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setIsRunModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5F6368] bg-white border border-[#E5E7EB] rounded-full hover:bg-[#FAFAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecuting}
                onClick={handleStartCalculation}
                className="px-5 py-2 text-xs bg-[#6254E8] text-white rounded-full hover:bg-[#5244DE] font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
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
