import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  GitCommit,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  ScanLine,
  CheckCircle2,
  Lock,
  FileCheck,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const Screen30_DataLineage: React.FC = () => {
  const { navigateToScreen } = useApp();

  const [activeStage, setActiveStage] = useState<number>(3);

  const stages = [
    {
      id: 1,
      title: '1. Raw Activity Intake',
      subtitle: 'Sources: OCR bills, manual logs, CSV imports',
      records: '1,842 items',
      governance: 'Source file SHA-256 hash generated at ingestion.',
      detail:
        'Every incoming data point is stamped with original format metadata, ingest timestamp, and original document upload credentials.',
    },
    {
      id: 2,
      title: '2. Boundary & Unit Normalization',
      subtitle: 'Site binding, unit conversions, schema verification',
      records: '100% compliant',
      governance: 'Blocking checks for negative volumes and unmapped sites.',
      detail:
        'Ensures activity data falls strictly within the consolidation boundary (Operational Control) and matches recognized physical units (kWh, Litres, kg).',
    },
    {
      id: 3,
      title: '3. Four-Eye Approval Gate',
      subtitle: 'Maker-checker validation & evidence inspection',
      records: '1,838 approved',
      governance: 'Mandatory dual-authorization (ISO 14064-3 requirement).',
      detail:
        'Reviewers inspect primary evidence documents side-by-side with ledger entries. Send-back logs enforce correction accountability.',
    },
    {
      id: 4,
      title: '4. Deterministic Calculation Engine',
      subtitle: 'Factor binding: CEA v19, DEFRA 2024, IPCC AR5',
      records: '10,380.0 tCO2e',
      governance: 'Deterministic arithmetic with version-locked emission factors.',
      detail:
        'Calculates Scope 1, Scope 2 (Location & Market), and Scope 3 totals using certified national and international emission coefficients.',
    },
    {
      id: 5,
      title: '5. Period Closure & Sealing',
      subtitle: 'Cryptographic lock preventing post-facto alterations',
      records: 'FY 2025–26',
      governance: 'Write-protection with auditable reopening justification.',
      detail:
        'Sealing freezes all record edits across all participating facilities to guarantee data integrity for statutory reporting.',
    },
    {
      id: 6,
      title: '6. Regulatory Disclosures',
      subtitle: 'SEBI BRSR Core & GHG Protocol assurance dossiers',
      records: 'Statutory Reports',
      governance: 'Third-party VVB sign-off and verification opinions.',
      detail:
        'Automated generation of compliance packages with digital signatures, executive summaries, and full evidence citation indexes.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <button
            onClick={() => navigateToScreen('28_verifier_evidence_trace', 'FLOW_F')}
            className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Evidence Trace</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 30 · Flow F (Step 2 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Assurance Architecture</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">End-to-End Data Lineage Map</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Auditable provenance pipeline linking physical operational consumption to final SEBI BRSR disclosures.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => navigateToScreen('31_findings_observations', 'FLOW_F')}
            className="px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>Verifier Findings Log (Screen 31)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Pipeline Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-[#2166B1] bg-[#F8F9FB] shadow-xs'
                  : 'border-[#D9DDE3] bg-white hover:border-[#B8BEC7]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-[#174A8B] font-bold">
                    STEP {stage.id}
                  </span>
                  {stage.id <= 4 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#174A8B]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#858C96]" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-[#171A1F] leading-snug">
                  {stage.title}
                </h3>
                <p className="text-[11px] text-[#5E6672] mt-1 line-clamp-2">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#D9DDE3] text-[10px] font-mono text-[#174A8B] font-medium">
                {stage.records}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Stage Inspector */}
      {(() => {
        const current = stages.find((s) => s.id === activeStage) || stages[0];
        return (
          <div className="p-6 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center space-x-2">
                <GitCommit className="w-5 h-5 text-[#174A8B]" />
                <h2 className="text-sm font-medium text-[#171A1F]">
                  Stage Details: {current.title}
                </h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#EAF2FB] text-[#174A8B]">
                {current.records}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-[#171A1F] block">Functional Description:</span>
                <p className="text-[#5E6672] leading-relaxed">{current.detail}</p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-[#171A1F] block">Assurance & Internal Controls:</span>
                <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-[#171A1F]">
                  {current.governance}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
