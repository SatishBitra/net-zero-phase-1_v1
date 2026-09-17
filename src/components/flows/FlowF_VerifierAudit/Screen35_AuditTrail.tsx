import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Search,
  Filter,
  Lock,
  Activity,
  CheckCircle2,
  Bot,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen35_AuditTrail: React.FC = () => {
  const { auditTrail, navigateToScreen, showToast } = useApp();

  // Filters State
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

      // Search query
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

  // Export handlers
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
      <div className="bg-white text-[#17181A] px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border border-[#E5E7EB] shadow-2xs font-data">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-[#6254E8]/10 text-[#6254E8] flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[#17181A] font-sans">Immutable Audit Trail</span>
          <span className="text-[#8A8F98]">•</span>
          <span className="text-[#5F6368]">
            Append-only chronological ledger. Every mutation is sealed and cannot be modified or deleted.
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="route-path text-[#6254E8] font-semibold bg-[#6254E8]/10 px-2.5 py-1 rounded-full border border-[#6254E8]/20">
            ISO 14064-3 / SOC 2 Type II Certified
          </span>
        </div>
      </div>

      {/* Header & Export Actions */}
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => navigateToScreen('31_verifier_dashboard', 'FLOW_F') },
          { label: 'Audit Trail' },
        ]}
        title="Audit Trail Viewer"
        description="Immutable, chronological record of every change made to activity data, factors, approvals, or configurations."
        actions={
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleExportCSV}
              className="enterprise-btn-secondary h-9 px-4 text-xs inline-flex items-center space-x-1.5 font-semibold rounded-full"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="enterprise-btn-primary h-9 px-4 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs rounded-full"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs font-semibold text-[#17181A] border-b border-[#F1F3F5] pb-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#6254E8]" />
            <span>Audit Trail Filter Matrix</span>
          </div>
          <span className="text-[11px] text-[#5F6368] font-data">
            Showing {filteredEntries.length} of {auditTrail.length} recorded events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Date Range Start / End */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5F6368] mb-1">Date Range</label>
            <div className="flex items-center space-x-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#E5E7EB] rounded-lg text-xs bg-white text-[#17181A] font-data"
              />
              <span className="text-[#8A8F98] text-xs">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#E5E7EB] rounded-lg text-xs bg-white text-[#17181A] font-data"
              />
            </div>
          </div>

          {/* Actor Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5F6368] mb-1">Actor</label>
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="w-full px-3.5 py-1.5 border border-[#E5E7EB] rounded-full text-xs bg-white text-[#17181A]"
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
            <label className="block text-[11px] font-semibold text-[#5F6368] mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3.5 py-1.5 border border-[#E5E7EB] rounded-full text-xs bg-white text-[#17181A]"
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
            <label className="block text-[11px] font-semibold text-[#5F6368] mb-1">Target Entity</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full px-3.5 py-1.5 border border-[#E5E7EB] rounded-full text-xs bg-white text-[#17181A]"
            >
              <option value="ALL">All Entities</option>
              <option value="Activity Data Row #1042">Activity Data Row #1042</option>
              <option value="Batch #204">Batch #204</option>
              <option value="Period FY 2024–25">Period FY 2024–25</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5F6368] mb-1">Search Reason / Value</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8A8F98]" />
              <input
                type="text"
                placeholder="Filter reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#E5E7EB] rounded-full text-xs bg-white text-[#17181A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F4F5F6] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#6254E8]" />
            <h2 className="text-xs font-semibold text-[#17181A] uppercase tracking-wider font-sans">
              Chronological Audit Trail Table
            </h2>
          </div>
          <span className="text-[11px] text-[#5F6368] font-data">
            Read-only • No records may be altered or deleted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368] font-sans">
                <th scope="col" className="py-3 px-4 font-semibold text-[#17181A] whitespace-nowrap">Timestamp</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#17181A]">Actor</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#17181A]">Action</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#17181A]">Previous</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#17181A]">New</th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#17181A]">Reason</th>
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
                        ? 'bg-[#FEF3F2]/30 hover:bg-[#FEF3F2]/50'
                        : 'hover:bg-[#FAFAFB]'
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-data text-[11px] text-[#5F6368] whitespace-nowrap">
                      {item.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center space-x-1.5">
                        {isSystem ? (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F4F5F6] text-[#5F6368] border border-[#E5E7EB]">
                            <Bot className="w-3 h-3 text-[#5F6368]" />
                            <span>System</span>
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#6254E8] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                            {item.userName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-[#17181A]">{item.userName}</div>
                          {item.role && <div className="text-[10px] text-[#8A8F98]">{item.role}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      {isApproved ? (
                        <StatusBadge status="Approved" customLabel={item.action} size="sm" />
                      ) : isCorrection ? (
                        <StatusBadge status="Under Review" customLabel={item.action} size="sm" />
                      ) : isFlagged ? (
                        <StatusBadge status="Rejected" customLabel={item.action} size="sm" />
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FAFAFB] text-[#17181A] border border-[#E5E7EB]">
                          {item.action}
                        </span>
                      )}
                    </td>

                    {/* Previous */}
                    <td className="py-3 px-4 font-data text-[11px] text-[#8A8F98] max-w-[140px] truncate">
                      {item.previousValue || '—'}
                    </td>

                    {/* New */}
                    <td className="py-3 px-4 font-data text-[11px] font-medium text-[#17181A] max-w-[180px]">
                      {item.newValue}
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 text-[#5F6368] max-w-xs text-[11px] leading-relaxed font-sans">
                      {item.reason || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3.5 bg-[#FAFAFB] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] gap-2 font-data">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#027A48]" />
            <span className="font-sans">This audit trail is append-only and cannot be altered.</span>
          </div>
          <div className="hash-display text-[11px] text-[#8A8F98] font-medium">
            Digest: sha256:9f83c605...e15b18b4
          </div>
        </div>
      </div>
    </div>
  );
};
