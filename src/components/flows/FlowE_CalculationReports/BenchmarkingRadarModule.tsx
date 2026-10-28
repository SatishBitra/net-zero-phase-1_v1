import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Target,
  Award,
  Factory,
  BarChart2,
  Download,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';

interface MetricDimension {
  id: string;
  axis: string;
  shortName: string;
  yourScore: number;
  industryAverage: number;
  topDecileLeader: number;
  yourRawValue: string;
  peerAverageRaw: string;
  leaderRaw: string;
  unit: string;
  quartile: 'Top 10%' | 'Top 25%' | 'Above Avg' | 'Lagging';
  gapToLeader: string;
  recommendation: string;
  category: 'Intensity' | 'Clean Energy' | 'Assurance' | 'Governance';
}

interface SectorBenchmarkProfile {
  sectorId: string;
  sectorName: string;
  shortName: string;
  peerCount: number;
  cohortRank: number;
  percentileOverall: number;
  dataSource: string;
  dimensions: MetricDimension[];
}

const SECTOR_BENCHMARKS: Record<string, SectorBenchmarkProfile> = {
  manufacturing: {
    sectorId: 'manufacturing',
    sectorName: 'Manufacturing & Heavy Industrial',
    shortName: 'Manufacturing',
    peerCount: 54,
    cohortRank: 12,
    percentileOverall: 74,
    dataSource: 'CDP 2024 & BRSR Top-1000 Manufacturing Cohort',
    dimensions: [
      {
        id: 'scope1-intensity',
        axis: 'Scope 1 Intensity',
        shortName: 'Scope 1 Intensity',
        yourScore: 68,
        industryAverage: 52,
        topDecileLeader: 88,
        yourRawValue: '45.8',
        peerAverageRaw: '58.2',
        leaderRaw: '24.1',
        unit: 'tCO2e / $M',
        quartile: 'Top 25%',
        gapToLeader: '-21.7 t/$M to Top Decile',
        recommendation: 'Electrify furnace heat and install waste heat recovery.',
        category: 'Intensity',
      },
      {
        id: 're-share',
        axis: 'Renewable Power %',
        shortName: 'Renewable Power %',
        yourScore: 42,
        industryAverage: 38,
        topDecileLeader: 92,
        yourRawValue: '22.4%',
        peerAverageRaw: '19.8%',
        leaderRaw: '86.0%',
        unit: '% of total kWh',
        quartile: 'Above Avg',
        gapToLeader: '-63.6% renewable gap to sector leader',
        recommendation: 'Sign off-site Solar PPA for Chennai and Pune plants.',
        category: 'Clean Energy',
      },
      {
        id: 'energy-eff',
        axis: 'Energy Efficiency',
        shortName: 'Energy Efficiency',
        yourScore: 78,
        industryAverage: 60,
        topDecileLeader: 90,
        yourRawValue: '0.42',
        peerAverageRaw: '0.58',
        leaderRaw: '0.31',
        unit: 'MWh / Tonne',
        quartile: 'Top 25%',
        gapToLeader: '-0.11 MWh/t to reach Top Decile',
        recommendation: 'Deploy smart VFDs on heavy motor drives.',
        category: 'Intensity',
      },
      {
        id: 'data-assurance',
        axis: 'Audit Assurance',
        shortName: 'Audit Assurance',
        yourScore: 94,
        industryAverage: 64,
        topDecileLeader: 96,
        yourRawValue: '94.2%',
        peerAverageRaw: '64.0%',
        leaderRaw: '96.5%',
        unit: '% with Primary Evidence',
        quartile: 'Top 10%',
        gapToLeader: '-2.3% to highest industry benchmark',
        recommendation: 'Automate OCR ingestion to preserve audit-readiness edge.',
        category: 'Assurance',
      },
      {
        id: 'abatement-rate',
        axis: 'Abatement Speed',
        shortName: 'Abatement Velocity',
        yourScore: 71,
        industryAverage: 45,
        topDecileLeader: 89,
        yourRawValue: '-5.8%',
        peerAverageRaw: '-2.1%',
        leaderRaw: '-9.4%',
        unit: '% annual reduction',
        quartile: 'Top 25%',
        gapToLeader: '-3.6% annual decarbonization acceleration needed',
        recommendation: 'Fast-track planned rooftop solar installations.',
        category: 'Intensity',
      },
      {
        id: 'scope3-coverage',
        axis: 'Scope 3 Coverage',
        shortName: 'Scope 3 Coverage',
        yourScore: 62,
        industryAverage: 48,
        topDecileLeader: 85,
        yourRawValue: '68.0%',
        peerAverageRaw: '45.0%',
        leaderRaw: '92.0%',
        unit: '% upstream spend audited',
        quartile: 'Above Avg',
        gapToLeader: '-24.0% supplier disclosure gap',
        recommendation: 'Request tier-1 suppliers report Scope 1 and 2 factors.',
        category: 'Governance',
      },
    ],
  },
  technology: {
    sectorId: 'technology',
    sectorName: 'Technology, Software & Data Centers',
    shortName: 'Technology & Cloud',
    peerCount: 38,
    cohortRank: 6,
    percentileOverall: 84,
    dataSource: 'RE100 & GHG Corporate Protocol Tech Index 2024',
    dimensions: [
      {
        id: 'scope1-intensity',
        axis: 'Scope 1 Intensity',
        shortName: 'Scope 1 Intensity',
        yourScore: 88,
        industryAverage: 76,
        topDecileLeader: 95,
        yourRawValue: '4.2',
        peerAverageRaw: '8.5',
        leaderRaw: '1.8',
        unit: 'tCO2e / $M',
        quartile: 'Top 10%',
        gapToLeader: '-2.4 t/$M to Top Decile',
        recommendation: 'Replace diesel backup gen-sets with BESS batteries.',
        category: 'Intensity',
      },
      {
        id: 're-share',
        axis: 'Renewable Power %',
        shortName: 'Renewable Power %',
        yourScore: 65,
        industryAverage: 62,
        topDecileLeader: 100,
        yourRawValue: '65.0%',
        peerAverageRaw: '62.0%',
        leaderRaw: '100.0%',
        unit: '% clean electricity',
        quartile: 'Above Avg',
        gapToLeader: '-35.0% clean power deficit vs 100% Leaders',
        recommendation: 'Procure 24/7 hourly matched bundled solar/wind PPAs.',
        category: 'Clean Energy',
      },
      {
        id: 'energy-eff',
        axis: 'Energy Efficiency',
        shortName: 'PUE Efficiency',
        yourScore: 82,
        industryAverage: 72,
        topDecileLeader: 94,
        yourRawValue: '1.24',
        peerAverageRaw: '1.45',
        leaderRaw: '1.12',
        unit: 'PUE Ratio',
        quartile: 'Top 25%',
        gapToLeader: '-0.12 PUE gap to hyperscale efficiency',
        recommendation: 'Implement liquid immersion cooling on dense server racks.',
        category: 'Intensity',
      },
      {
        id: 'data-assurance',
        axis: 'Audit Assurance',
        shortName: 'Audit Assurance',
        yourScore: 92,
        industryAverage: 70,
        topDecileLeader: 98,
        yourRawValue: '96.5%',
        peerAverageRaw: '72.0%',
        leaderRaw: '99.0%',
        unit: '% verified records',
        quartile: 'Top 10%',
        gapToLeader: '-2.5% to top verification rating',
        recommendation: 'Maintain continuous cryptographic hash evidence trails.',
        category: 'Assurance',
      },
      {
        id: 'abatement-rate',
        axis: 'Abatement Speed',
        shortName: 'Abatement Velocity',
        yourScore: 78,
        industryAverage: 58,
        topDecileLeader: 92,
        yourRawValue: '-12.4%',
        peerAverageRaw: '-7.2%',
        leaderRaw: '-18.0%',
        unit: '% annual cut',
        quartile: 'Top 25%',
        gapToLeader: '-5.6% annual pace to sector leader',
        recommendation: 'Accelerate thermal heat recapture from server halls.',
        category: 'Intensity',
      },
      {
        id: 'scope3-coverage',
        axis: 'Scope 3 Coverage',
        shortName: 'Scope 3 Coverage',
        yourScore: 75,
        industryAverage: 62,
        topDecileLeader: 90,
        yourRawValue: '82.0%',
        peerAverageRaw: '68.0%',
        leaderRaw: '96.0%',
        unit: '% supply chain',
        quartile: 'Top 25%',
        gapToLeader: '-14.0% supplier coverage gap',
        recommendation: 'Engage fab chip suppliers on low-carbon silicon wafers.',
        category: 'Governance',
      },
    ],
  },
  retail: {
    sectorId: 'retail',
    sectorName: 'Consumer Goods, Food & Retail',
    shortName: 'Retail & Consumer',
    peerCount: 42,
    cohortRank: 9,
    percentileOverall: 79,
    dataSource: 'SBTi Consumer Goods Sector Benchmarks 2024',
    dimensions: [
      {
        id: 'scope1-intensity',
        axis: 'Scope 1 Intensity',
        shortName: 'Scope 1 Intensity',
        yourScore: 72,
        industryAverage: 58,
        topDecileLeader: 90,
        yourRawValue: '18.4',
        peerAverageRaw: '26.8',
        leaderRaw: '8.2',
        unit: 'tCO2e / $M',
        quartile: 'Top 25%',
        gapToLeader: '-10.2 t/$M to Top Decile',
        recommendation: 'Transition delivery fleet vans to electric powertrains.',
        category: 'Intensity',
      },
      {
        id: 're-share',
        axis: 'Renewable Power %',
        shortName: 'Renewable Power %',
        yourScore: 50,
        industryAverage: 42,
        topDecileLeader: 95,
        yourRawValue: '31.0%',
        peerAverageRaw: '24.5%',
        leaderRaw: '92.0%',
        unit: '% clean power',
        quartile: 'Above Avg',
        gapToLeader: '-61.0% gap to leading retail networks',
        recommendation: 'Install solar canopies over distribution hub parking.',
        category: 'Clean Energy',
      },
      {
        id: 'energy-eff',
        axis: 'Energy Efficiency',
        shortName: 'Warehouse Efficiency',
        yourScore: 76,
        industryAverage: 58,
        topDecileLeader: 92,
        yourRawValue: '48.2',
        peerAverageRaw: '68.5',
        leaderRaw: '32.0',
        unit: 'kWh / sq.ft',
        quartile: 'Top 25%',
        gapToLeader: '-16.2 kWh/sq.ft to Top Decile',
        recommendation: 'Upgrade cold storage insulation and LED sensor fixtures.',
        category: 'Intensity',
      },
      {
        id: 'data-assurance',
        axis: 'Audit Assurance',
        shortName: 'Audit Assurance',
        yourScore: 88,
        industryAverage: 60,
        topDecileLeader: 95,
        yourRawValue: '91.0%',
        peerAverageRaw: '62.0%',
        leaderRaw: '97.0%',
        unit: '% verified data',
        quartile: 'Top 25%',
        gapToLeader: '-6.0% gap to highest assured audit trail',
        recommendation: 'Mandate supplier utility invoice uploads directly in portal.',
        category: 'Assurance',
      },
      {
        id: 'abatement-rate',
        axis: 'Abatement Speed',
        shortName: 'Abatement Velocity',
        yourScore: 68,
        industryAverage: 48,
        topDecileLeader: 88,
        yourRawValue: '-4.6%',
        peerAverageRaw: '-2.8%',
        leaderRaw: '-8.5%',
        unit: '% annual cut',
        quartile: 'Above Avg',
        gapToLeader: '-3.9% annual decarbonization acceleration',
        recommendation: 'Optimize last-mile route algorithms to cut fuel burn.',
        category: 'Intensity',
      },
      {
        id: 'scope3-coverage',
        axis: 'Scope 3 Coverage',
        shortName: 'Scope 3 Coverage',
        yourScore: 82,
        industryAverage: 65,
        topDecileLeader: 94,
        yourRawValue: '78.5%',
        peerAverageRaw: '60.0%',
        leaderRaw: '93.0%',
        unit: '% packaging spend',
        quartile: 'Top 25%',
        gapToLeader: '-14.5% supply chain audit gap',
        recommendation: 'Adopt post-consumer recycled corrugated cartons.',
        category: 'Governance',
      },
    ],
  },
};

export const BenchmarkingRadarModule: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();
  const [selectedSectorKey, setSelectedSectorKey] = useState<string>('manufacturing');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('scope1-intensity');

  const activeSector = SECTOR_BENCHMARKS[selectedSectorKey] || SECTOR_BENCHMARKS.manufacturing;
  const activeDimension =
    activeSector.dimensions.find((d) => d.id === selectedDimensionId) || activeSector.dimensions[0];

  const radarChartData = useMemo(() => {
    return activeSector.dimensions.map((dim) => ({
      subject: dim.axis,
      'Your Org': dim.yourScore,
      'Industry Avg': dim.industryAverage,
      'Sector Leader': dim.topDecileLeader,
    }));
  }, [activeSector]);

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Axis,Your Score,Industry Avg,Leader,Your Value,Peer Median,Leader Value,Quartile,Gap\n' +
      activeSector.dimensions
        .map(
          (d) =>
            `"${d.axis}",${d.yourScore},${d.industryAverage},${d.topDecileLeader},"${d.yourRawValue} ${d.unit}","${d.peerAverageRaw} ${d.unit}","${d.leaderRaw} ${d.unit}","${d.quartile}","${d.gapToLeader}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Benchmark_${selectedSectorKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Benchmark scorecard downloaded as CSV.');
  };

  return (
    <div id="benchmarking-module-container" className="w-full space-y-5 pb-10">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Industry Decarbonization Benchmarking' },
        ]}
        title="Industry Decarbonization Radar"
        contextInfo={
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <span className="font-semibold text-[#01153C]">{activeSector.sectorName}</span>
            <span>·</span>
            <span>{activeSector.peerCount} Peers</span>
            <span>·</span>
            <span className="font-semibold text-[#0F6B48]">Rank #{activeSector.cohortRank}</span>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportReport}
              className="h-9 px-3.5 text-xs font-semibold text-[#4B5563] hover:text-[#01153C] bg-white border border-[#E5E7EB] rounded-lg transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
              aria-label="Export benchmark scorecard to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => navigateToScreen('36_scenario_builder', 'FLOW_E')}
              className="h-9 px-4 text-xs font-semibold text-white bg-[#01153C] hover:bg-[#022365] rounded-lg transition-all flex items-center gap-1.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01153C]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>What-If Simulator</span>
            </button>
          </div>
        }
      />

      {/* Cohort Selector Bar */}
      <section aria-labelledby="cohort-heading" className="bg-white border border-[#E5E7EB] rounded-xl p-3 md:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Factory className="w-4 h-4 text-[#01153C] shrink-0" />
          <span id="cohort-heading" className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
            Sector Cohort:
          </span>
          <div className="flex flex-wrap gap-1">
            {Object.values(SECTOR_BENCHMARKS).map((sec) => (
              <button
                key={sec.sectorId}
                onClick={() => setSelectedSectorKey(sec.sectorId)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#01153C] ${
                  selectedSectorKey === sec.sectorId
                    ? 'bg-[#01153C] text-white shadow-2xs'
                    : 'bg-[#F8F9FB] text-[#4B5563] hover:text-[#01153C] hover:bg-[#F1F3F5] border border-[#E5E7EB]'
                }`}
              >
                {sec.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-[#4B5563]">
          Source: {activeSector.dataSource}
        </div>
      </section>

      {/* KPI Cards */}
      <section aria-label="Cohort standing metrics" className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Decarbonization Percentile</div>
          <div className="text-xl font-bold text-[#01153C] mt-1 font-mono flex items-center gap-1">
            <Award className="w-4 h-4 text-[#D97706]" />
            {activeSector.percentileOverall}th
          </div>
          <div className="text-[10px] font-bold text-[#0F6B48]">Top Quartile (Q1)</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Cohort Standing</div>
          <div className="text-xl font-bold text-[#01153C] mt-1 font-mono">
            #{activeSector.cohortRank} <span className="text-xs font-normal text-[#4B5563]">/ {activeSector.peerCount}</span>
          </div>
          <div className="text-[10px] text-[#4B5563]">In {activeSector.shortName} cohort</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Strongest Dimension</div>
          <div className="text-sm font-bold text-[#0F6B48] mt-1 truncate">
            Audit Assurance
          </div>
          <div className="text-[10px] text-[#4B5563]">94.2% (Top Decile)</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <div className="text-[11px] text-[#4B5563] font-medium">Primary Opportunity Gap</div>
          <div className="text-sm font-bold text-[#D97706] mt-1 truncate">
            Renewable Power %
          </div>
          <div className="text-[10px] font-bold text-[#D97706]">63.6% gap to Leader</div>
        </div>
      </section>

      {/* Main 2-Column Responsive Layout: Tablet and Desktop Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
        {/* Left Column: Recharts Radar (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#01153C]" />
              Comparative Radar (Scores 0–100)
            </div>
          </div>

          <div className="h-64 sm:h-72 md:h-80 lg:h-96 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData} margin={{ top: 15, right: 25, bottom: 15, left: 25 }}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#171A1F', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" fontSize={9} />
                <RechartsTooltip
                  formatter={(val: any, name: any) => [`${val} / 100`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Radar
                  name="Your Org"
                  dataKey="Your Org"
                  stroke="#01153C"
                  fill="#01153C"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Radar
                  name="Industry Avg"
                  dataKey="Industry Avg"
                  stroke="#D97706"
                  fill="#D97706"
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <Radar
                  name="Sector Leader"
                  dataKey="Sector Leader"
                  stroke="#0F6B48"
                  fill="#0F6B48"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Selector Buttons */}
          <div className="pt-2 border-t border-[#F1F3F5]">
            <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Select Axis to Inspect:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeSector.dimensions.map((dim) => {
                const isSelected = selectedDimensionId === dim.id;
                return (
                  <button
                    key={dim.id}
                    onClick={() => setSelectedDimensionId(dim.id)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#01153C] ${
                      isSelected
                        ? 'bg-[#01153C] text-white font-semibold shadow-2xs'
                        : 'bg-[#F8F9FB] text-[#171A1F] hover:bg-[#F1F3F5] border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{dim.shortName}</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                      }`}
                    >
                      {dim.yourScore}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Concise Dimension Detail (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2.5">
              <span className="text-[10px] font-bold text-[#01153C] uppercase tracking-wider bg-[#EDF2FA] px-2 py-0.5 rounded">
                {activeDimension.category}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  activeDimension.quartile === 'Top 10%'
                    ? 'bg-[#E8F8EE] text-[#0F6B48]'
                    : activeDimension.quartile === 'Top 25%'
                    ? 'bg-[#EDF2FA] text-[#01153C]'
                    : 'bg-[#FEF6EE] text-[#D97706]'
                }`}
              >
                {activeDimension.quartile}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#171A1F]">
                {activeDimension.shortName}
              </h3>
            </div>

            {/* 3 Metrics Strip */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-[#EDF2FA] rounded-lg">
                <div className="text-[10px] font-bold text-[#01153C]">Your Org</div>
                <div className="text-base font-bold text-[#01153C] mt-0.5 font-mono">
                  {activeDimension.yourRawValue}
                </div>
                <div className="text-[10px] text-[#4B5563]">{activeDimension.unit}</div>
              </div>

              <div className="p-2.5 bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg">
                <div className="text-[10px] font-bold text-[#4B5563]">Peer Avg</div>
                <div className="text-base font-bold text-[#171A1F] mt-0.5 font-mono">
                  {activeDimension.peerAverageRaw}
                </div>
                <div className="text-[10px] text-[#4B5563]">{activeDimension.unit}</div>
              </div>

              <div className="p-2.5 bg-[#E8F8EE] rounded-lg">
                <div className="text-[10px] font-bold text-[#0F6B48]">Leader</div>
                <div className="text-base font-bold text-[#0F6B48] mt-0.5 font-mono">
                  {activeDimension.leaderRaw}
                </div>
                <div className="text-[10px] text-[#0F6B48]">{activeDimension.unit}</div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#01153C] font-semibold">Your Org</span>
                  <span className="font-mono font-bold text-[#01153C]">{activeDimension.yourScore}</span>
                </div>
                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#01153C] h-full rounded-full transition-all"
                    style={{ width: `${activeDimension.yourScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#D97706] font-semibold">Peer Avg</span>
                  <span className="font-mono font-bold text-[#D97706]">{activeDimension.industryAverage}</span>
                </div>
                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D97706] h-full rounded-full transition-all"
                    style={{ width: `${activeDimension.industryAverage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#0F6B48] font-semibold">Leader</span>
                  <span className="font-mono font-bold text-[#0F6B48]">{activeDimension.topDecileLeader}</span>
                </div>
                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0F6B48] h-full rounded-full transition-all"
                    style={{ width: `${activeDimension.topDecileLeader}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Direct Action Card */}
            <div className="p-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg space-y-1 text-xs">
              <div className="font-semibold text-[#01153C]">{activeDimension.gapToLeader}</div>
              <div className="text-[#4B5563]">{activeDimension.recommendation}</div>
            </div>

            <button
              onClick={() => navigateToScreen('36_scenario_builder', 'FLOW_E')}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#01153C] hover:bg-[#022365] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#01153C]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Simulate Closing Gap in What-If Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Concise Scorecard Table */}
      <section aria-labelledby="scorecard-heading" className="bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#171A1F] uppercase tracking-wider">
            <BarChart2 className="w-3.5 h-3.5 text-[#01153C]" />
            <h2 id="scorecard-heading" className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Complete Benchmark Scorecard
            </h2>
          </div>
          <button
            onClick={handleExportReport}
            className="text-xs font-semibold text-[#01153C] hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#01153C]"
          >
            <Download className="w-3 h-3" />
            <span>Download CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F9FB] text-[#4B5563] font-semibold uppercase tracking-wider border-y border-[#E5E7EB]">
              <tr>
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Your Value</th>
                <th className="py-2.5 px-3">Peer Avg</th>
                <th className="py-2.5 px-3">Sector Leader</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {activeSector.dimensions.map((dim) => {
                const isSelected = selectedDimensionId === dim.id;
                return (
                  <tr
                    key={dim.id}
                    onClick={() => setSelectedDimensionId(dim.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#EDF2FA]/60 font-medium' : 'hover:bg-[#FAFAFB]'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-[#171A1F]">{dim.shortName}</td>
                    <td className="py-2.5 px-3 text-[#4B5563]">{dim.category}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#01153C]">
                      {dim.yourRawValue} {dim.unit}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#4B5563]">
                      {dim.peerAverageRaw} {dim.unit}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0F6B48]">
                      {dim.leaderRaw} {dim.unit}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#01153C]">
                      {dim.yourScore} / 100
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          dim.quartile === 'Top 10%'
                            ? 'bg-[#E8F8EE] text-[#0F6B48]'
                            : dim.quartile === 'Top 25%'
                            ? 'bg-[#EDF2FA] text-[#01153C]'
                            : 'bg-[#FEF6EE] text-[#D97706]'
                        }`}
                      >
                        {dim.quartile}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
