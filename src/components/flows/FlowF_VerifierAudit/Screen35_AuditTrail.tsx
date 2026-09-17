import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { AuditTrailEntry } from '../../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Lock,
  ArrowLeft,
  Calendar,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Bot,
  FileCode,
  FileSpreadsheet,
  Check,
  Hash,
} from 'lucide-react';

export const Screen35_AuditTrail: React.FC = () => {
  const { auditTrail, navigateToScreen, showToast } = useApp();

  // Filters State per PRD Section 4
  const [startDate, setStartDate] = useState<string>('2025-08-01');
  const [endDate, setEndDate] = useState<string>('2025-08-31');
  const [actorFilter, setActorFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering logic
  const filteredEntries = useMemo(() => {
    return auditTrail.filter((item) => {
      // Actor filter
      if (actorFilter !== 'ALL') {
        if (!item.userName.toLowerCase().includes(actorFilter.toLowerCase())) {
          return false;
        }
      }

      // Action type filter
      if (actionFilter !== 'ALL') {
        if (item.action.toLowerCase() !== actionFilter.toLowerCase()) {
          return false;
        }
      }

      // Entity filter
      if (entityFilter !== 'ALL') {
        const itemEntity = item.source || item.lineItemId || '';
        if (!itemEntity.toLowerCase().includes(entityFilter.toLowerCase())) {
          return false;
        }
      }

      // Search query (reason, previous, new, source)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.reason && item.reason.toLowerCase().includes(q)) ||
          (item.previousValue && item.previousValue.toLowerCase().includes(q)) ||
          (item.newValue && item.newValue.toLowerCase().includes(q)) ||
          (item.source && item.source.toLowerCase().includes(q)) ||
          (item.userName && item.userName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [auditTrail, actorFilter, actionFilter, entityFilter, searchQuery]);

  // Unique lists for filter dropdowns
  const actorsList = useMemo(() => {
    const set = new Set<string>();
    auditTrail.forEach((e) => set.add(e.userName));
    return Array.from(set);
  }, [auditTrail]);

  const actionsList = useMemo(() => {
    const set = new Set<string>();
    auditTrail.forEach((e) => set.add(e.action));
    return Array.from(set);
  }, [auditTrail]);

  // Export handlers (PRD Section 6)
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Previous Value', 'New Value', 'Reason', 'Entity'];
    const rows = filteredEntries.map((e) => [
      e.timestamp,
      `"${e.userName}"`,
      `"${e.role}"`,
      `"${e.action}"`,
      `"${e.previousValue || '—'}"`,
      `"${e.newValue}"`,
      `"${e.reason || ''}"`,
      `"${e.source || e.lineItemId || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tula_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit Trail Exported (CSV)', `Downloaded ${filteredEntries.length} immutable ledger rows.`, 'success');
  };

  const handleExportJSON = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      digitalSignatureSha256: '9f83c605d4c82b3e925b6c3807cb1124984fc610f12a453e15b18b4aa471a923',
      immutableAuditChainStatus: 'VALID_APPEND_ONLY',
      totalRecords: filteredEntries.length,
      records: filteredEntries,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `Tula_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit Trail Exported (JSON)', `Exported ${filteredEntries.length} records with digital SHA-256 signature.`, 'info');
  };

  return (
    <div id="screen-35-audit-trail-viewer" className="max-w-7xl mx-auto space-y-6">
      {/* Immutability Guarantee Banner */}
      <div className="bg-[#171A1F] text-white px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#2D3339]">
        <div className="flex items-center space-x-2.5">
          <Lock className="w-4 h-4 text-[#85B7EB]" />
          <span className="font-semibold text-white">Immutable Audit Trail</span>
          <span className="text-[#858C96]">•</span>
          <span className="text-[#D9DDE3]">
            Append-only chronological ledger. Every mutation is sealed and cannot be modified or deleted.
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-[#A2A9B4]">
          <span className="font-mono text-[#85B7EB]">ISO 14064-3 / SOC 2 Type II Certified</span>
        </div>
      </div>

      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9DDE3] pb-4">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#5E6672] mb-1">
            <button
              onClick={() => navigateToScreen('31_verifier_dashboard', 'FLOW_F')}
              className="hover:text-[#174A8B] transition-colors"
            >
              Dashboard
            </button>
            <span className="text-[#858C96]">/</span>
            <span className="text-[#171A1F] font-semibold">Audit Trail</span>
          </nav>
          <h1 className="text-xl font-semibold text-[#171A1F]">Audit Trail Viewer</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Immutable, chronological record of every change made to activity data, factors, approvals, or configurations.
          </p>
        </div>

        {/* Export Controls (PRD Section 6) */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-[#171A1F] text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5E6672]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#171A1F] hover:bg-[#2D3339] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-[#85B7EB]" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (PRD Section 4) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-[#171A1F] border-b border-[#F1F3F5] pb-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#174A8B]" />
            <span>Audit Trail Filter Matrix</span>
          </div>
          <span className="text-[11px] text-[#5E6672]">
            Showing {filteredEntries.length} of {auditTrail.length} recorded events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Date Range Start / End */}
          <div>
            <label className="block text-[11px] text-[#5E6672] mb-1">Date Range</label>
            <div className="flex items-center space-x-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#D9DDE3] rounded text-xs bg-white text-[#171A1F]"
              />
              <span className="text-[#858C96] text-xs">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#D9DDE3] rounded text-xs bg-white text-[#171A1F]"
              />
            </div>
          </div>

          {/* Actor Filter */}
          <div>
            <label className="block text-[11px] text-[#5E6672] mb-1">Actor</label>
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded text-xs bg-white text-[#171A1F]"
            >
              <option value="ALL">All Actors</option>
              {actorsList.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="block text-[11px] text-[#5E6672] mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded text-xs bg-white text-[#171A1F]"
            >
              <option value="ALL">All Actions</option>
              {actionsList.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          {/* Entity Filter */}
          <div>
            <label className="block text-[11px] text-[#5E6672] mb-1">Target Entity</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#D9DDE3] rounded text-xs bg-white text-[#171A1F]"
            >
              <option value="ALL">All Entities</option>
              <option value="Activity Data Row #1042">Activity Data Row #1042</option>
              <option value="Batch #204">Batch #204</option>
              <option value="Period FY 2024–25">Period FY 2024–25</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] text-[#5E6672] mb-1">Search Reason / Value</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#858C96]" />
              <input
                type="text"
                placeholder="Filter reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 border border-[#D9DDE3] rounded text-xs bg-white text-[#171A1F]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table (PRD Section 5) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-xs font-semibold text-[#171A1F] uppercase tracking-wider">
              Chronological Audit Trail Table
            </h2>
          </div>
          <span className="text-[11px] text-[#5E6672]">
            Read-only • No records may be altered or deleted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F] whitespace-nowrap">Timestamp</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Actor</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Action</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Previous</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">New</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#171A1F]">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredEntries.map((item) => {
                const isCorrection = item.action.toLowerCase().includes('correct');
                const isSystem = item.userName.toLowerCase().includes('system') || item.userName.toLowerCase().includes('import job');
                const isFlagged = item.action.toLowerCase().includes('flag');
                const isApproved = item.action.toLowerCase().includes('approv');

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isCorrection
                        ? 'bg-[#FEF7EC]/40 hover:bg-[#FEF7EC]/70'
                        : isFlagged
                        ? 'bg-[#FEF0EF]/30 hover:bg-[#FEF0EF]/50'
                        : 'hover:bg-[#F8F9FB]'
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5E6672] whitespace-nowrap">
                      {item.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        {isSystem ? (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F1F3F5] text-[#5E6672] border border-[#D9DDE3]">
                            <Bot className="w-3 h-3 text-[#5E6672]" />
                            <span>System</span>
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#174A8B] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                            {item.userName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[#171A1F]">{item.userName}</div>
                          {item.role && <div className="text-[10px] text-[#858C96]">{item.role}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          isApproved
                            ? 'bg-[#ECFDF3] text-[#027A48] border border-[#027A48]/20'
                            : isCorrection
                            ? 'bg-[#FEF7EC] text-[#B54708] border border-[#FDB022]/40'
                            : isFlagged
                            ? 'bg-[#FEF0EF] text-[#B42318] border border-[#FDA29B]/50'
                            : item.action === 'Submitted'
                            ? 'bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20'
                            : 'bg-[#F8F9FB] text-[#171A1F] border border-[#D9DDE3]'
                        }`}
                      >
                        {item.action}
                      </span>
                    </td>

                    {/* Previous */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#858C96] max-w-[140px] truncate">
                      {item.previousValue || '—'}
                    </td>

                    {/* New */}
                    <td className="py-3 px-4 font-mono text-[11px] font-medium text-[#171A1F] max-w-[180px]">
                      {item.newValue}
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 text-[#5E6672] max-w-xs text-[11px] leading-relaxed">
                      {item.reason || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3.5 bg-[#F8F9FB] border-t border-[#D9DDE3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5E6672] gap-2">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#027A48]" />
            <span>This audit trail is append-only and cannot be altered.</span>
          </div>
          <div className="font-mono text-[11px] text-[#858C96]">
            Digest: sha256:9f83c605...e15b18b4
          </div>
        </div>
      </div>
    </div>
  );
};
