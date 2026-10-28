import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { PageHeader } from '../../common/PageHeader';
import {
  SlidersHorizontal,
  RotateCcw,
  Download,
  Target,
  Save,
  Zap,
  Building2,
  Flame,
  TrendingDown,
  Sparkles,
  BarChart2,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

interface ScenarioPreset {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  summary: string;
  reShare: number;
  solarCapacity: number;
  chennaiEfficiency: number;
  puneEfficiency: number;
  ahmedabadEfficiency: number;
  kaizenEfficiency: number;
  dieselReduction: number;
  boilerElectrification: number;
  fleetEv: number;
  productionGrowth: number;
  targetYear: string;
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'sbti-2030',
    name: 'SBTi 1.5°C Pathway',
    tag: '-42% Target',
    tagColor: 'bg-[#E8F8EE] text-[#0F6B48]',
    summary: '70% RE PPA · 4.5 MWp Solar · 22% Site Efficiency',
    reShare: 70,
    solarCapacity: 4.5,
    chennaiEfficiency: 22,
    puneEfficiency: 26,
    ahmedabadEfficiency: 18,
    kaizenEfficiency: 4,
    dieselReduction: 45,
    boilerElectrification: 35,
    fleetEv: 50,
    productionGrowth: 15,
    targetYear: '2030',
  },
  {
    id: 're100-fast',
    name: '100% RE Transition',
    tag: 'RE100',
    tagColor: 'bg-[#F2F0FF] text-[#5141FF]',
    summary: '100% Green Power · 7.0 MWp Solar · Fleet EV',
    reShare: 100,
    solarCapacity: 7.0,
    chennaiEfficiency: 12,
    puneEfficiency: 15,
    ahmedabadEfficiency: 10,
    kaizenEfficiency: 2,
    dieselReduction: 20,
    boilerElectrification: 15,
    fleetEv: 25,
    productionGrowth: 10,
    targetYear: '2028',
  },
  {
    id: 'low-capex',
    name: 'Efficiency First',
    tag: 'Low CapEx',
    tagColor: 'bg-[#FEF6EE] text-[#D97706]',
    summary: '30% Site Retrofits · 35% Green Tariff · Fast Payback',
    reShare: 35,
    solarCapacity: 1.5,
    chennaiEfficiency: 30,
    puneEfficiency: 35,
    ahmedabadEfficiency: 25,
    kaizenEfficiency: 6,
    dieselReduction: 25,
    boilerElectrification: 20,
    fleetEv: 20,
    productionGrowth: 8,
    targetYear: '2027',
  },
  {
    id: 'net-zero-2040',
    name: 'Deep Decarbonization',
    tag: 'Net-Zero',
    tagColor: 'bg-[#F4EBFF] text-[#6927DA]',
    summary: '95% RE · 40% Efficiency · Full Thermal Electrification',
    reShare: 95,
    solarCapacity: 9.0,
    chennaiEfficiency: 38,
    puneEfficiency: 40,
    ahmedabadEfficiency: 35,
    kaizenEfficiency: 8,
    dieselReduction: 85,
    boilerElectrification: 80,
    fleetEv: 90,
    productionGrowth: 25,
    targetYear: '2040',
  },
];

export const WhatIfScenarioBuilder: React.FC = () => {
  const { navigateToScreen, showToast, activePeriod, addAuditLog, currentUser } = useApp();

  const baseline = {
    period: activePeriod?.name || 'FY 2025–26',
    scope1: 18420,
    scope2: 9850,
    scope3: 4120,
    total: 32390,
    revenueUSD_M: 42.5,
    baselineIntensity: 762.1,
  };

  const [activePresetId, setActivePresetId] = useState<string>('sbti-2030');
  const [scenarioName, setScenarioName] = useState('SBTi 1.5°C Pathway');
  const [targetYear, setTargetYear] = useState('2030');

  // Levers
  const [reShare, setReShare] = useState<number>(70);
  const [solarCapacity, setSolarCapacity] = useState<number>(4.5);
  const [chennaiEfficiency, setChennaiEfficiency] = useState<number>(22);
  const [puneEfficiency, setPuneEfficiency] = useState<number>(26);
  const [ahmedabadEfficiency, setAhmedabadEfficiency] = useState<number>(18);
  const [kaizenEfficiency, setKaizenEfficiency] = useState<number>(4);
  const [dieselReduction, setDieselReduction] = useState<number>(45);
  const [boilerElectrification, setBoilerElectrification] = useState<number>(35);
  const [fleetEv, setFleetEv] = useState<number>(50);
  const [productionGrowth, setProductionGrowth] = useState<number>(15);

  const [activeTab, setActiveTab] = useState<'projections' | 'sites' | 'financials'>('projections');

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setActivePresetId(preset.id);
    setScenarioName(preset.name);
    setTargetYear(preset.targetYear);
    setReShare(preset.reShare);
    setSolarCapacity(preset.solarCapacity);
    setChennaiEfficiency(preset.chennaiEfficiency);
    setPuneEfficiency(preset.puneEfficiency);
    setAhmedabadEfficiency(preset.ahmedabadEfficiency);
    setKaizenEfficiency(preset.kaizenEfficiency);
    setDieselReduction(preset.dieselReduction);
    setBoilerElectrification(preset.boilerElectrification);
    setFleetEv(preset.fleetEv);
    setProductionGrowth(preset.productionGrowth);
  };

  const handleResetToBaseline = () => {
    setActivePresetId('custom');
    setScenarioName('Baseline Actuals');
    setReShare(0);
    setSolarCapacity(0);
    setChennaiEfficiency(0);
    setPuneEfficiency(0);
    setAhmedabadEfficiency(0);
    setKaizenEfficiency(0);
    setDieselReduction(0);
    setBoilerElectrification(0);
    setFleetEv(0);
    setProductionGrowth(0);
  };

  const projections = useMemo(() => {
    const growthMultiplier = 1 + productionGrowth / 100;
    const bauTotal = Math.round(baseline.total * growthMultiplier);

    const solarAnnualMWh = solarCapacity * 1450;
    const solarAvoided_tCO2e = Math.round((solarAnnualMWh * 0.716) / 1000 * 1000);

    const avgSiteEfficiency = (chennaiEfficiency * 0.54 + puneEfficiency * 0.28 + ahmedabadEfficiency * 0.18) + kaizenEfficiency;
    const efficiencyFactor = Math.max(0, 1 - avgSiteEfficiency / 100);

    const postEfficiencyScope2 = baseline.scope2 * growthMultiplier * efficiencyFactor;
    const ppaAvoided_tCO2e = postEfficiencyScope2 * (reShare / 100);
    const finalScope2 = Math.max(0, Math.round(postEfficiencyScope2 - ppaAvoided_tCO2e - solarAvoided_tCO2e * 0.5));

    const scope1AvoidanceRatio = (dieselReduction * 0.35 + boilerElectrification * 0.45 + fleetEv * 0.20) / 100;
    const postEfficiencyScope1 = baseline.scope1 * growthMultiplier * efficiencyFactor;
    const finalScope1 = Math.max(0, Math.round(postEfficiencyScope1 * (1 - scope1AvoidanceRatio)));

    const scope3Efficiency = (reShare * 0.2 + avgSiteEfficiency * 0.3) / 100;
    const finalScope3 = Math.max(0, Math.round(baseline.scope3 * growthMultiplier * (1 - scope3Efficiency)));

    const projectedTotal = finalScope1 + finalScope2 + finalScope3;
    const absoluteAvoidance = Math.max(0, baseline.total - projectedTotal);
    const percentageReduction = Number(((absoluteAvoidance / baseline.total) * 100).toFixed(1));

    const projectedRevenue = baseline.revenueUSD_M * (1 + productionGrowth / 100);
    const projectedIntensity = Number((projectedTotal / projectedRevenue).toFixed(1));

    const solarCapexUSD = solarCapacity * 680000;
    const efficiencyCapexUSD = avgSiteEfficiency * 45000;
    const heatPumpCapexUSD = (boilerElectrification / 100) * 320000;
    const totalEstCapexUSD = Math.round(solarCapexUSD + efficiencyCapexUSD + heatPumpCapexUSD);

    const solarOpExSavings = solarAnnualMWh * 42;
    const efficiencyOpExSavings = (baseline.total - projectedTotal) * 35;
    const totalAnnualSavingsUSD = Math.round(solarOpExSavings + efficiencyOpExSavings);

    const simplePaybackYears = totalAnnualSavingsUSD > 0
      ? Number((totalEstCapexUSD / totalAnnualSavingsUSD).toFixed(1))
      : 0;

    return {
      bauTotal,
      projectedTotal,
      projectedScope1: finalScope1,
      projectedScope2: finalScope2,
      projectedScope3: finalScope3,
      absoluteAvoidance,
      percentageReduction,
      projectedIntensity,
      totalEstCapexUSD,
      totalAnnualSavingsUSD,
      simplePaybackYears,
      avgSiteEfficiency: Number(avgSiteEfficiency.toFixed(1)),
    };
  }, [
    baseline,
    reShare,
    solarCapacity,
    chennaiEfficiency,
    puneEfficiency,
    ahmedabadEfficiency,
    kaizenEfficiency,
    dieselReduction,
    boilerElectrification,
    fleetEv,
    productionGrowth,
  ]);

  const trajectoryData = useMemo(() => {
    const years = [2025, 2026, 2027, 2028, 2029, 2030, 2035, 2040];
    const targetYrNum = parseInt(targetYear, 10);
    const totalDelta = baseline.total - projections.projectedTotal;

    return years.map((yr) => {
      const annualGrowth = Math.pow(1 + productionGrowth / 100, (yr - 2025) / 5);
      const bauVal = Math.round(baseline.total * annualGrowth);

      let scenarioVal = baseline.total;
      if (yr <= 2025) {
        scenarioVal = baseline.total;
      } else if (yr <= targetYrNum) {
        const progressFraction = (yr - 2025) / (targetYrNum - 2025);
        scenarioVal = Math.round(baseline.total - totalDelta * progressFraction);
      } else {
        const extraYears = yr - targetYrNum;
        scenarioVal = Math.max(800, Math.round(projections.projectedTotal * Math.pow(0.96, extraYears)));
      }

      const sbtiTarget = Math.round(baseline.total * (1 - 0.042 * (yr - 2025)));

      return {
        year: yr.toString(),
        BAU: bauVal,
        Scenario: scenarioVal,
        'SBTi 1.5°C': sbtiTarget,
      };
    });
  }, [baseline.total, projections.projectedTotal, targetYear, productionGrowth]);

  const scopeComparisonData = useMemo(() => {
    return [
      { name: 'Scope 1', Base: baseline.scope1, Projected: projections.projectedScope1 },
      { name: 'Scope 2', Base: baseline.scope2, Projected: projections.projectedScope2 },
      { name: 'Scope 3', Base: baseline.scope3, Projected: projections.projectedScope3 },
    ];
  }, [baseline, projections]);

  const siteImpacts = useMemo(() => {
    return [
      {
        name: 'Chennai Plant 1',
        base: Math.round(baseline.total * 0.54),
        eff: chennaiEfficiency,
        projected: Math.round(baseline.total * 0.54 * (1 - chennaiEfficiency / 100) * (1 - reShare * 0.005)),
      },
      {
        name: 'Pune Warehouse',
        base: Math.round(baseline.total * 0.28),
        eff: puneEfficiency,
        projected: Math.round(baseline.total * 0.28 * (1 - puneEfficiency / 100) * (1 - reShare * 0.007)),
      },
      {
        name: 'Ahmedabad Unit',
        base: Math.round(baseline.total * 0.18),
        eff: ahmedabadEfficiency,
        projected: Math.round(baseline.total * 0.18 * (1 - ahmedabadEfficiency / 100) * (1 - reShare * 0.006)),
      },
    ];
  }, [baseline.total, chennaiEfficiency, puneEfficiency, ahmedabadEfficiency, reShare]);

  const handleSaveScenario = () => {
    addAuditLog({
      action: `Saved Decarbonization Scenario: ${scenarioName}`,
      user: currentUser?.name || 'Energy & Climate Lead',
      source: 'Scenario Simulator',
      notes: `Target: ${targetYear}, Avoidance: -${projections.percentageReduction}%, CapEx: $${(projections.totalEstCapexUSD / 1000).toFixed(0)}k`,
    });
    showToast('Scenario Saved', `${scenarioName} saved with -${projections.percentageReduction}% reduction projection.`);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Year,BAU_tCO2e,Scenario_tCO2e,SBTi_Target_tCO2e\n' +
      trajectoryData.map((d) => `${d.year},${d.BAU},${d.Scenario},${d['SBTi 1.5°C']}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Scenario_${scenarioName.replace(/\s+/g, '_')}_${targetYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Scenario projection downloaded as CSV.');
  };

  return (
    <div id="scenario-builder-container" className="w-full space-y-5 pb-10">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'What-If Decarbonization Simulator' },
        ]}
        title="What-If Decarbonization Simulator"
        contextInfo={
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <span className="font-semibold text-[#181B27]">{baseline.period} Baseline</span>
            <span>·</span>
            <span>{baseline.total.toLocaleString()} tCO2e</span>
            <span>·</span>
            <span className="font-semibold text-[#0F6B48]">Target {targetYear}</span>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleResetToBaseline}
              className="h-9 px-3.5 text-xs font-semibold text-[#4B5563] hover:text-[#5141FF] bg-white border border-[#E5E7EB] rounded-lg transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5141FF]"
              aria-label="Reset scenario levers to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="h-9 px-3.5 text-xs font-semibold text-[#4B5563] hover:text-[#5141FF] bg-white border border-[#E5E7EB] rounded-lg transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5141FF]"
              aria-label="Export scenario data to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => navigateToScreen('37_benchmarking', 'FLOW_E')}
              className="h-9 px-3.5 text-xs font-semibold text-[#5141FF] bg-[#F2F0FF] hover:bg-[#E2EAF7] border border-[#5141FF]/20 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5141FF]"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Benchmark Radar</span>
            </button>
            <button
              onClick={handleSaveScenario}
              className="h-9 px-4 text-xs font-semibold text-white bg-[#5141FF] hover:bg-[#4232E8] rounded-lg transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5141FF]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scenario</span>
            </button>
          </div>
        }
      />

      {/* Preset Pathway Cards */}
      <section aria-labelledby="preset-heading" className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 md:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F3F5] pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#181B27]" />
            <h2 id="preset-heading" className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Select Preset Pathway
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="target-year-select" className="text-[#4B5563] font-medium">
              Target Year:
            </label>
            <select
              id="target-year-select"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold text-[#181B27] bg-[#F8F9FB] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5141FF]"
            >
              <option value="2026">2026</option>
              <option value="2028">2028</option>
              <option value="2030">2030 (SBTi)</option>
              <option value="2035">2035</option>
              <option value="2040">2040 (Net-Zero)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all focus-visible:ring-2 focus-visible:ring-[#5141FF] outline-none ${
                  isSelected
                    ? 'border-[#5141FF] bg-[#F2F0FF]/60 ring-1 ring-[#01153C]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-[#FAFAFB]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-[#171A1F] truncate">{preset.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${preset.tagColor}`}>
                    {preset.tag}
                  </span>
                </div>
                <div className="text-[11px] text-[#4B5563] line-clamp-1">{preset.summary}</div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-[#5141FF] font-semibold">
                  <span>{preset.reShare}% RE</span>
                  <span>·</span>
                  <span>{preset.solarCapacity}MW Solar</span>
                  <span>·</span>
                  <span>{preset.chennaiEfficiency}% Eff</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* KPI Summary Cards */}
      <section aria-label="Key scenario projection metrics" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Projected Total</div>
          <div className="text-lg md:text-xl font-bold text-[#181B27] mt-1 font-mono">
            {projections.projectedTotal.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#4B5563]">tCO2e in {targetYear}</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Avoided Carbon</div>
          <div className="text-lg md:text-xl font-bold text-[#0F6B48] mt-1 font-mono flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 shrink-0" />
            {projections.absoluteAvoidance.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-[#0F6B48]">
            -{projections.percentageReduction}% vs Base
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Scope 1 Projected</div>
          <div className="text-lg md:text-xl font-bold text-[#171A1F] mt-1 font-mono">
            {projections.projectedScope1.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#4B5563]">Base: {baseline.scope1.toLocaleString()} t</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Scope 2 Projected</div>
          <div className="text-lg md:text-xl font-bold text-[#171A1F] mt-1 font-mono">
            {projections.projectedScope2.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#4B5563]">Base: {baseline.scope2.toLocaleString()} t</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Carbon Intensity</div>
          <div className="text-lg md:text-xl font-bold text-[#181B27] mt-1 font-mono">
            {projections.projectedIntensity}
          </div>
          <div className="text-[10px] text-[#4B5563]">tCO2e / $M Rev</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Est. Annual Savings</div>
          <div className="text-lg md:text-xl font-bold text-[#0F6B48] mt-1 font-mono">
            ${(projections.totalAnnualSavingsUSD / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-[#4B5563]">Payback: {projections.simplePaybackYears}y</div>
        </div>
      </section>

      {/* Main 2-Column Responsive Layout: Tablet and Desktop Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
        {/* Left Column: Interactive Levers (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#181B27]" />
                Transition Levers
              </div>
              <span className="text-[10px] font-mono font-bold text-[#0F6B48] bg-[#E8F8EE] px-2 py-0.5 rounded">
                Live Simulation
              </span>
            </div>

            {/* Lever Group 1: Renewable Power */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#181B27]">
                <Zap className="w-3.5 h-3.5 text-[#D97706]" />
                Renewable Power (Scope 2)
              </div>

              {/* Slider: Grid RE */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="lever-re-share" className="font-medium text-[#171A1F]">Grid RE PPA Share</label>
                  <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                    {reShare}%
                  </span>
                </div>
                <input
                  id="lever-re-share"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={reShare}
                  aria-label="Grid Renewable Electricity PPA Share Percentage"
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setReShare(Number(e.target.value));
                  }}
                  className="w-full accent-[#01153C] cursor-pointer"
                />
              </div>

              {/* Slider: Rooftop Solar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="lever-solar-cap" className="font-medium text-[#171A1F]">On-Site Solar Rooftop</label>
                  <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                    {solarCapacity} MWp
                  </span>
                </div>
                <input
                  id="lever-solar-cap"
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={solarCapacity}
                  aria-label="On-site Solar Rooftop Capacity in Megawatts peak"
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setSolarCapacity(Number(e.target.value));
                  }}
                  className="w-full accent-[#01153C] cursor-pointer"
                />
              </div>
            </div>

            {/* Lever Group 2: Site Efficiency */}
            <div className="space-y-3 pt-3 border-t border-[#F1F3F5]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#181B27]">
                  <Building2 className="w-3.5 h-3.5 text-[#0F6B48]" />
                  Site Efficiency Improvements
                </div>
                <span className="text-[10px] text-[#4B5563] font-mono">Avg: {projections.avgSiteEfficiency}%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                {/* Chennai */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="lever-chennai" className="font-medium text-[#171A1F]">Chennai Plant 1</label>
                    <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                      {chennaiEfficiency}%
                    </span>
                  </div>
                  <input
                    id="lever-chennai"
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={chennaiEfficiency}
                    aria-label="Chennai Plant efficiency improvement percentage"
                    onChange={(e) => {
                      setActivePresetId('custom');
                      setChennaiEfficiency(Number(e.target.value));
                    }}
                    className="w-full accent-[#01153C] cursor-pointer"
                  />
                </div>

                {/* Pune */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="lever-pune" className="font-medium text-[#171A1F]">Pune Warehouse</label>
                    <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                      {puneEfficiency}%
                    </span>
                  </div>
                  <input
                    id="lever-pune"
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={puneEfficiency}
                    aria-label="Pune Warehouse efficiency improvement percentage"
                    onChange={(e) => {
                      setActivePresetId('custom');
                      setPuneEfficiency(Number(e.target.value));
                    }}
                    className="w-full accent-[#01153C] cursor-pointer"
                  />
                </div>

                {/* Ahmedabad */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="lever-ahmedabad" className="font-medium text-[#171A1F]">Ahmedabad Unit</label>
                    <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                      {ahmedabadEfficiency}%
                    </span>
                  </div>
                  <input
                    id="lever-ahmedabad"
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={ahmedabadEfficiency}
                    aria-label="Ahmedabad Unit efficiency improvement percentage"
                    onChange={(e) => {
                      setActivePresetId('custom');
                      setAhmedabadEfficiency(Number(e.target.value));
                    }}
                    className="w-full accent-[#01153C] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Lever Group 3: Scope 1 Electrification */}
            <div className="space-y-3 pt-3 border-t border-[#F1F3F5]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#181B27]">
                <Flame className="w-3.5 h-3.5 text-[#FB3256]" />
                Thermal & Fleet Electrification (Scope 1)
              </div>

              {/* Diesel GenSet */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="lever-diesel" className="font-medium text-[#171A1F]">Diesel GenSet Battery (BESS)</label>
                  <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                    {dieselReduction}%
                  </span>
                </div>
                <input
                  id="lever-diesel"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={dieselReduction}
                  aria-label="Diesel GenSet battery backup reduction percentage"
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setDieselReduction(Number(e.target.value));
                  }}
                  className="w-full accent-[#01153C] cursor-pointer"
                />
              </div>

              {/* Boiler Heat Pumps */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="lever-boiler" className="font-medium text-[#171A1F]">Boiler Heat Pumps</label>
                  <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                    {boilerElectrification}%
                  </span>
                </div>
                <input
                  id="lever-boiler"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={boilerElectrification}
                  aria-label="Boiler electrification heat pump percentage"
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setBoilerElectrification(Number(e.target.value));
                  }}
                  className="w-full accent-[#01153C] cursor-pointer"
                />
              </div>

              {/* Fleet EV */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="lever-fleet" className="font-medium text-[#171A1F]">Commercial Fleet EV</label>
                  <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                    {fleetEv}%
                  </span>
                </div>
                <input
                  id="lever-fleet"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={fleetEv}
                  aria-label="Commercial vehicle fleet electric switch percentage"
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setFleetEv(Number(e.target.value));
                  }}
                  className="w-full accent-[#01153C] cursor-pointer"
                />
              </div>
            </div>

            {/* Production Growth */}
            <div className="space-y-2 pt-3 border-t border-[#F1F3F5]">
              <div className="flex justify-between text-xs">
                <label htmlFor="lever-growth" className="font-medium text-[#171A1F]">Production Growth Target</label>
                <span className="font-mono font-bold text-[#5141FF] bg-[#F2F0FF] px-1.5 py-0.5 rounded text-[11px]">
                  {productionGrowth > 0 ? `+${productionGrowth}%` : `${productionGrowth}%`}
                </span>
              </div>
              <input
                id="lever-growth"
                type="range"
                min="-10"
                max="50"
                step="5"
                value={productionGrowth}
                aria-label="Anticipated business production growth rate"
                onChange={(e) => {
                  setActivePresetId('custom');
                  setProductionGrowth(Number(e.target.value));
                }}
                className="w-full accent-[#01153C] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Charts & Analytical Tabs (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 shadow-2xs space-y-4">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2.5">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('projections')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#5141FF] ${
                    activeTab === 'projections'
                      ? 'bg-[#5141FF] text-white'
                      : 'text-[#4B5563] hover:text-[#5141FF] hover:bg-[#F8F9FB]'
                  }`}
                >
                  Emissions Trajectory
                </button>
                <button
                  onClick={() => setActiveTab('sites')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#5141FF] ${
                    activeTab === 'sites'
                      ? 'bg-[#5141FF] text-white'
                      : 'text-[#4B5563] hover:text-[#5141FF] hover:bg-[#F8F9FB]'
                  }`}
                >
                  Site Impact
                </button>
                <button
                  onClick={() => setActiveTab('financials')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#5141FF] ${
                    activeTab === 'financials'
                      ? 'bg-[#5141FF] text-white'
                      : 'text-[#4B5563] hover:text-[#5141FF] hover:bg-[#F8F9FB]'
                  }`}
                >
                  Financial ROI
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#4B5563]">
                <span className="w-2 h-2 rounded-full bg-[#0F6B48]"></span>
                <span className="font-semibold text-[#171A1F]">SBTi Target:</span>
                <span>-42% by 2030</span>
              </div>
            </div>

            {/* TAB 1: Trajectory */}
            {activeTab === 'projections' && (
              <div className="space-y-4">
                <div className="h-64 sm:h-72 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F6B48" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0F6B48" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                      <XAxis dataKey="year" stroke="#4B5563" fontSize={11} tickLine={false} />
                      <YAxis stroke="#4B5563" fontSize={11} domain={[0, 38000]} tickLine={false} />
                      <RechartsTooltip
                        formatter={(val: any) => [`${Number(val).toLocaleString()} tCO2e`]}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E5E7EB',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                      <Area
                        type="monotone"
                        dataKey="BAU"
                        stroke="#ED2024"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        fill="transparent"
                      />
                      <Area
                        type="monotone"
                        dataKey="Scenario"
                        stroke="#0F6B48"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorScenario)"
                      />
                      <Area
                        type="monotone"
                        dataKey="SBTi 1.5°C"
                        stroke="#01153C"
                        strokeWidth={1.5}
                        fill="transparent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Scope Comparison Bar */}
                <div className="pt-3 border-t border-[#F1F3F5]">
                  <div className="text-[11px] font-bold text-[#171A1F] uppercase tracking-wider mb-2">
                    Scope 1 · 2 · 3 Comparison (tCO2e)
                  </div>
                  <div className="h-36 sm:h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scopeComparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                        <XAxis dataKey="name" stroke="#4B5563" fontSize={11} tickLine={false} />
                        <YAxis stroke="#4B5563" fontSize={11} tickLine={false} />
                        <RechartsTooltip
                          formatter={(val: any) => [`${Number(val).toLocaleString()} tCO2e`]}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E5E7EB',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="Base" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Projected" fill="#01153C" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Facility Breakdown */}
            {activeTab === 'sites' && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8F9FB] text-[#4B5563] font-semibold uppercase tracking-wider border-y border-[#E5E7EB]">
                      <tr>
                        <th className="py-2.5 px-3">Facility</th>
                        <th className="py-2.5 px-3">Base</th>
                        <th className="py-2.5 px-3">Eff. Lever</th>
                        <th className="py-2.5 px-3">Projected</th>
                        <th className="py-2.5 px-3 text-right">Avoided</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {siteImpacts.map((s) => {
                        const avoided = s.base - s.projected;
                        const pct = Math.round((avoided / s.base) * 100);
                        return (
                          <tr key={s.name} className="hover:bg-[#FAFAFB]">
                            <td className="py-2.5 px-3 font-semibold text-[#171A1F]">{s.name}</td>
                            <td className="py-2.5 px-3 font-mono text-[#4B5563]">{s.base.toLocaleString()} t</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-[#181B27]">{s.eff}%</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-[#181B27]">
                              {s.projected.toLocaleString()} t
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0F6B48]">
                              -{avoided.toLocaleString()} t ({pct}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Financial ROI */}
            {activeTab === 'financials' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl">
                    <div className="text-[11px] text-[#4B5563] font-medium">Est. CapEx Deployment</div>
                    <div className="text-lg font-bold text-[#181B27] mt-0.5 font-mono">
                      ${(projections.totalEstCapexUSD / 1000).toFixed(0)}k
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl">
                    <div className="text-[11px] text-[#4B5563] font-medium">Annual OpEx Savings</div>
                    <div className="text-lg font-bold text-[#0F6B48] mt-0.5 font-mono">
                      ${(projections.totalAnnualSavingsUSD / 1000).toFixed(0)}k
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl">
                    <div className="text-[11px] text-[#4B5563] font-medium">Simple Payback</div>
                    <div className="text-lg font-bold text-[#181B27] mt-0.5 font-mono">
                      {projections.simplePaybackYears} Years
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#171A1F]">Investment Allocation</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#4B5563]">
                      <span>Solar PV Generation:</span>
                      <span className="font-mono font-semibold text-[#171A1F]">${((solarCapacity * 680000) / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between items-center text-[#4B5563]">
                      <span>Efficiency Audits & Motor Retrofits:</span>
                      <span className="font-mono font-semibold text-[#171A1F]">${((projections.avgSiteEfficiency * 45000) / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between items-center text-[#4B5563]">
                      <span>Thermal Electrification & Heat Pumps:</span>
                      <span className="font-mono font-semibold text-[#171A1F]">${(((boilerElectrification / 100) * 320000) / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
