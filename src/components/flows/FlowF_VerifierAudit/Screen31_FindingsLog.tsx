import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Filter,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface Finding {
  id: string;
  type: 'Observation' | 'Clarification Request' | 'Non-Conformity';
  severity: 'Low' | 'Medium' | 'High';
  target: string;
  description: string;
  status: 'Open' | 'Resolved';
  loggedBy: string;
  loggedAt: string;
}

export const Screen31_FindingsLog: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  const [findings, setFindings] = useState<Finding[]>([
    {
      id: 'FND-2025-01',
      type: 'Observation',
      severity: 'Low',
      target: 'Chennai Plant 1 · Grid Electricity',
      description:
        'Recommended transitioning from manual monthly PDF uploads to DISCOM smart meter automated telemetry API for FY 2026–27.',
      status: 'Open',
      loggedBy: 'M. Singh (Lead Verifier)',
      loggedAt: '2026-09-15 14:20',
    },
    {
      id: 'FND-2025-02',
      type: 'Clarification Request',
      severity: 'Medium',
      target: 'Pune Warehouse · Diesel Generator',
      description:
        'Requested fuel vendor calibration certificate for on-site diesel storage tank meter #4.',
      status: 'Resolved',
      loggedBy: 'M. Singh (Lead Verifier)',
      loggedAt: '2026-09-14 11:05',
    },
    {
      id: 'FND-2025-03',
      type: 'Observation',
      severity: 'Low',
      target: 'Hyderabad HQ · Fugitive Refrigerants',
      description:
        'HVAC servicing logs verified against refrigerant top-up invoices. Quantities match zero-loss threshold.',
      status: 'Resolved',
      loggedBy: 'P. Verma (VVB Assessor)',
      loggedAt: '2026-09-12 16:40',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<'Observation' | 'Clarification Request' | 'Non-Conformity'>('Observation');
  const [newSeverity, setNewSeverity] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [newTarget, setNewTarget] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim() || !newDesc.trim()) return;

    const newFnd: Finding = {
      id: `FND-2025-0${findings.length + 1}`,
      type: newType,
      severity: newSeverity,
      target: newTarget,
      description: newDesc,
      status: 'Open',
      loggedBy: 'M. Singh (Lead Verifier)',
      loggedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setFindings([newFnd, ...findings]);
    setShowAddModal(false);
    setNewTarget('');
    setNewDesc('');
    showToast('Finding Recorded', `${newFnd.id} logged in assurance docket.`);
  };

  const handleToggleResolve = (id: string) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'Open' ? 'Resolved' : 'Open' }
          : f
      )
    );
    showToast('Status Updated', 'Finding status transitioned successfully.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <button
            onClick={() => navigateToScreen('30_data_lineage', 'FLOW_F')}
            className="flex items-center space-x-1 text-xs text-[#5E6672] hover:text-[#171A1F] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Lineage Map</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-0.5">
            <span>Screen 31 · Flow F (Step 3 of 4)</span>
            <span>•</span>
            <span className="text-[#174A8B] font-sans font-medium">Independent VVB Assurance</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Verifier Findings & Observations Log</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Track clarifications, non-conformities, and continuous improvement recommendations logged by the assurance body.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Assurance Finding</span>
          </button>

          <button
            onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
            className="px-3.5 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#171A1F] rounded-md transition-colors flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5E6672]" />
            <span>Audit Trail (Screen 35)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between">
          <h2 className="text-xs font-medium text-[#171A1F] uppercase tracking-wider">
            Assurance Findings Docket ({findings.length})
          </h2>
          <span className="text-[11px] text-[#5E6672]">
            {findings.filter((f) => f.status === 'Open').length} Open ·{' '}
            {findings.filter((f) => f.status === 'Resolved').length} Resolved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Finding ID</th>
                <th className="py-2.5 px-4 font-medium">Type</th>
                <th className="py-2.5 px-4 font-medium">Severity</th>
                <th className="py-2.5 px-4 font-medium">Target Activity</th>
                <th className="py-2.5 px-4 font-medium">Description & Recommendation</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#174A8B]">{f.id}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#F1F3F5] text-[#171A1F] font-medium">
                      {f.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        f.severity === 'High'
                          ? 'bg-[#FEF0EF] text-[#B42318]'
                          : f.severity === 'Medium'
                          ? 'bg-[#FEF7EC] text-[#B54708]'
                          : 'bg-[#F1F3F5] text-[#5E6672]'
                      }`}
                    >
                      {f.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#171A1F]">{f.target}</td>
                  <td className="py-3 px-4 text-[#5E6672] max-w-sm leading-relaxed">
                    {f.description}
                    <div className="text-[10px] text-[#858C96] mt-0.5">
                      Logged by {f.loggedBy} on {f.loggedAt}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {f.status === 'Resolved' ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-[#174A8B] font-medium bg-[#EAF2FB] px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-[#B54708] font-medium bg-[#FEF7EC] px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3" />
                        <span>Open</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleResolve(f.id)}
                      className="text-[11px] text-[#2166B1] hover:underline font-medium"
                    >
                      {f.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Finding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 space-y-4 border border-[#D9DDE3] shadow-xl">
            <h3 className="text-sm font-medium text-[#171A1F]">Log New Assurance Finding</h3>

            <form onSubmit={handleCreateFinding} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5E6672] mb-1">Classification Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded bg-white"
                >
                  <option value="Observation">Observation</option>
                  <option value="Clarification Request">Clarification Request</option>
                  <option value="Non-Conformity">Non-Conformity</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5E6672] mb-1">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded bg-white"
                >
                  <option value="Low">Low (Informational recommendation)</option>
                  <option value="Medium">Medium (Documentation clarification)</option>
                  <option value="High">High (Material discrepancy)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5E6672] mb-1">Target Facility / Activity</label>
                <input
                  type="text"
                  placeholder="e.g. Chennai Plant 1 · Grid Electricity Substation 2"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5E6672] mb-1">Observation & Corrective Recommendation</label>
                <textarea
                  rows={3}
                  placeholder="Describe finding and recommended remediation..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-[#5E6672]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded shadow-sm"
                >
                  Record Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
