import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord } from '../../../types';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Calculator,
  ShieldCheck,
  Eye,
  ArrowRight,
  ArrowLeft,
  Hash,
  ExternalLink,
  GitCommit,
  Check,
} from 'lucide-react';

export const Screen28_VerifierEvidenceTrace: React.FC = () => {
  const {
    records,
    activePeriod,
    selectedRecordForDetail,
    setSelectedRecordForDetail,
    navigateToScreen,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(
    records[0] || null
  );

  const filtered = records.filter((r) => {
    const matchScope = scopeFilter === 'ALL' || r.scope === scopeFilter;
    const matchQuery =
      r.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchScope && matchQuery;
  });

  const handleInspect = (record: ActivityRecord) => {
    setSelectedRecord(record);
    setSelectedRecordForDetail(record);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 28 · Flow F (Step 1 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Independent VVB Assurance</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Verifier Evidence Trace & Lineage</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Full provenance chain: <span className="font-mono text-[#174A8B]">Source → Activity Data → Calculation → Result → Evidence → Sign-off</span>
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => navigateToScreen('30_data_lineage', 'FLOW_F')}
            className="px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#174A8B] font-medium rounded-md transition-colors flex items-center space-x-1.5"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Visual Lineage Graph (Screen 30)</span>
          </button>

          <button
            onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
            className="px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Immutable Audit Trail (Screen 35)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Traceable Activity Record Inventory (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#858C96]" />
              <input
                type="text"
                placeholder="Search record ID, facility, or emission source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-white text-[#171A1F]"
              >
                <option value="ALL">All Scopes</option>
                <option value="Scope 1">Scope 1</option>
                <option value="Scope 2">Scope 2</option>
              </select>
            </div>
          </div>

          {/* Record List */}
          <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between text-xs">
              <span className="font-medium text-[#171A1F]">Assurance Sample Records</span>
              <span className="text-[11px] text-[#5E6672] font-mono">
                Showing {filtered.length} entries
              </span>
            </div>

            <div className="divide-y divide-[#F1F3F5] max-h-[580px] overflow-y-auto">
              {filtered.map((r) => {
                const isSelected = selectedRecord?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleInspect(r)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EAF2FB]/50 border-l-4 border-[#174A8B]'
                        : 'hover:bg-[#F8F9FB]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium text-[#174A8B]">{r.id}</span>
                        <span className="text-[#858C96]">•</span>
                        <span className="font-medium text-[#171A1F]">{r.siteName}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#5E6672]">{r.date}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="text-[#5E6672] text-[11px] truncate max-w-[280px]">
                        {r.sourceName} ({r.quantity.toLocaleString()} {r.unit})
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-semibold text-[#171A1F]">
                          {r.emissions_tCO2e.toFixed(2)} tCO2e
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F1F3F5] text-[10px]">
                      <span className="text-[#174A8B] flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{r.evidenceFiles?.length || 1} Evidence Document(s)</span>
                      </span>
                      <span className="text-[#5E6672] font-mono">
                        Factor: {r.emissionFactor} {r.factorUnit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Complete Provenance Trace Deep-Dive (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedRecord ? (
            <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
                <div>
                  <div className="text-[10px] font-mono text-[#858C96]">EVIDENCE TRACE LINEAGE</div>
                  <h3 className="text-sm font-semibold text-[#171A1F] font-mono">
                    {selectedRecord.id}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
                  {selectedRecord.status}
                </span>
              </div>

              {/* Provenance Stepper */}
              <div className="space-y-4">
                {/* Step 1: Physical Activity Source */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#171A1F]">Physical Source Activity</div>
                    <div className="text-[#5E6672] mt-0.5">
                      {selectedRecord.sourceName} at {selectedRecord.siteName}
                    </div>
                    <div className="font-mono text-[#174A8B] mt-0.5">
                      {selectedRecord.quantity.toLocaleString()} {selectedRecord.unit} on {selectedRecord.date}
                    </div>
                  </div>
                </div>

                {/* Step 2: Emission Factor Binding */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#171A1F]">Emission Factor Citation</div>
                    <div className="text-[#5E6672] mt-0.5">
                      {selectedRecord.factorSource}
                    </div>
                    <div className="font-mono text-[#171A1F] mt-0.5">
                      Value: {selectedRecord.emissionFactor} {selectedRecord.factorUnit}
                    </div>
                  </div>
                </div>

                {/* Step 3: Deterministic Calculation Result */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#171A1F]">Calculation Equation & Result</div>
                    <div className="text-[#5E6672] mt-0.5">
                      {selectedRecord.quantity} × {selectedRecord.emissionFactor} ÷ 1,000
                    </div>
                    <div className="font-mono font-bold text-sm text-[#174A8B] mt-0.5">
                      = {selectedRecord.emissions_tCO2e.toFixed(3)} tCO2e
                    </div>
                  </div>
                </div>

                {/* Step 4: Primary Evidence Document */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#171A1F]">Attached Primary Evidence</div>
                    <div className="mt-1 p-2.5 bg-[#F8F9FB] rounded border border-[#D9DDE3] flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-[#174A8B] shrink-0" />
                        <span className="font-mono text-[11px] truncate">
                          {selectedRecord.evidenceFiles?.[0]?.name || 'TANGEDCO_HT_Bill_Jul_2025.pdf'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          showToast('Evidence Inspected', 'Cryptographic SHA-256 hash verified.');
                        }}
                        className="text-[11px] text-[#2166B1] hover:underline shrink-0"
                      >
                        Inspect
                      </button>
                    </div>
                    <div className="text-[10px] text-[#858C96] font-mono mt-1">
                      SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                    </div>
                  </div>
                </div>

                {/* Step 5: Four-Eye Sign-off Signatures */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#EAF2FB] text-[#174A8B] flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#171A1F]">Four-Eye Governance Sign-off</div>
                    <div className="text-[#5E6672] mt-0.5">
                      Submitted: A. Kumar (Facility Manager)
                    </div>
                    <div className="text-[#174A8B] mt-0.5">
                      Approved: S. Iyer (Sustainability Director)
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifier Attestation Checkpoint */}
              <div className="pt-3 border-t border-[#F1F3F5] space-y-2">
                <button
                  onClick={() => {
                    showToast('VVB Sample Verified', `Record ${selectedRecord.id} marked as assured in sampling log.`);
                  }}
                  className="w-full py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Attest Sample in VVB Assurance Log</span>
                </button>

                <button
                  onClick={() => navigateToScreen('31_findings_observations', 'FLOW_F')}
                  className="w-full py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#5E6672] rounded-md transition-colors"
                >
                  Log Observation / Finding (Screen 31)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-[#D9DDE3] rounded-lg text-center text-xs text-[#858C96]">
              Select a record from the list to trace its complete provenance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
