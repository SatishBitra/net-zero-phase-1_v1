import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Check,
  History,
  Info,
  ExternalLink,
} from 'lucide-react';

export const Screen15_FixDetailView: React.FC = () => {
  const {
    sites,
    addActivityRecord,
    activePeriod,
    navigateToScreen,
    showToast,
    addAuditLog,
  } = useApp();

  // State for Row #1042
  const [site, setSite] = useState('Chennai Plant One');
  const [source, setSource] = useState('Grid electricity');
  const [date, setDate] = useState('2025-08-12');
  const [quantity, setQuantity] = useState('48200');
  const [unit, setUnit] = useState('kWh');
  const [isFixed, setIsFixed] = useState(false);

  const [historyItems, setHistoryItems] = useState([
    {
      when: '12-Aug 14:02',
      who: 'Import job #88',
      change: 'Row created by bulk import',
    },
    {
      when: '12-Aug 14:05',
      who: 'System',
      change: 'Flagged: site not found',
    },
  ]);

  const hasSiteError = site === 'Chennai Plant One';

  const applySuggestedSite = () => {
    setSite('Chennai Plant 1');
    setIsFixed(true);
    showToast('Correction applied', "Site corrected to 'Chennai Plant 1'. Click Save Correction to commit.");
  };

  const handleSaveCorrection = () => {
    if (hasSiteError) {
      showToast('Validation Error', "Please correct the site before saving.", 'error');
      return;
    }

    // Append to audit trail as specified: every edit creates a new audit trail entry
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Data Entry',
      action: 'Corrected Activity Data Row #1042',
      previousValue: 'Site: Chennai Plant One',
      newValue: 'Site: Chennai Plant 1 (Grid electricity: 48,200 kWh)',
      source: 'Activity Data Detail / Edit (/activity-data/1042)',
      reason: 'Resolved bulk import site matching error',
      status: 'Corrected',
      lineItemId: 'Row #1042',
    });

    addActivityRecord({
      periodId: activePeriod.id,
      siteId: 'site-chennai-1',
      siteName: 'Chennai Plant 1',
      sourceId: 'src-elec-1',
      sourceName: 'Grid electricity (TANGEDCO)',
      scope: 'Scope 2',
      date,
      quantity: parseFloat(quantity),
      unit,
      emissionFactor: 0.82,
      factorUnit: 'kg CO2e / kWh',
      factorSource: 'CEA CO2 Baseline Database v19 (India)',
      emissions_tCO2e: (parseFloat(quantity) * 0.82) / 1000,
      status: 'Approved',
      notes: 'Import job #88 Row #1042 corrected from Chennai Plant One to Chennai Plant 1',
    });

    showToast('Correction Saved', 'Row #1042 successfully corrected and committed to Activity Data.');
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  const handleDiscardRow = () => {
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Data Entry',
      action: 'Discarded Flagged Row #1042',
      previousValue: 'Site: Chennai Plant One, 48,200 kWh',
      newValue: 'Status: Discarded',
      source: 'Activity Data Detail / Edit',
      reason: 'Rejected by operator during validation correction',
      status: 'Discarded',
      lineItemId: 'Row #1042',
    });

    showToast('Row Discarded', 'Row #1042 was permanently discarded from import batch.');
    navigateToScreen('14_validation_results', 'FLOW_C');
  };

  return (
    <div id="screen-15-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Row #1042</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/1042</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-normal text-[#171A1F]">Activity Data — Row #1042</h1>
              {hasSiteError ? (
                <span className="px-2.5 py-0.5 rounded bg-[#FEF0EF] text-[#D92D20] text-xs font-medium border border-[#D92D20]/20 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Error</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded bg-[#E8F5E9] text-[#0F6B48] text-xs font-medium border border-[#0F6B48]/20 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Resolved</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Edit flagged row to resolve validation errors. Every edit creates an append-only audit trail entry.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('14_validation_results', 'FLOW_C')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Validation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form & Validation Error Box */}
      <div className="p-5 bg-white border border-[#D9DDE3] rounded space-y-4">
        <h2 className="text-sm font-medium text-[#171A1F] pb-2 border-b border-[#F1F3F5]">
          Entry Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Site Field with Inline Validation Error */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Site <span className="text-[#D92D20]">*</span>
            </label>
            <div className="flex gap-2">
              <select
                id="edit-site-select"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className={`flex-1 px-3 py-2 text-xs border rounded bg-white text-[#171A1F] focus:outline-none ${
                  hasSiteError ? 'border-[#D92D20] bg-[#FEF0EF]/30' : 'border-[#D9DDE3] focus:border-[#174A8B]'
                }`}
              >
                <option value="Chennai Plant One">Chennai Plant One (Flagged Unrecognized)</option>
                <option value="Chennai Plant 1">Chennai Plant 1 (Tamil Nadu)</option>
                <option value="Pune Warehouse">Pune Warehouse (Maharashtra)</option>
                <option value="Hyderabad HQ">Hyderabad HQ (Telangana)</option>
              </select>

              {hasSiteError && (
                <button
                  type="button"
                  onClick={applySuggestedSite}
                  className="px-3 py-2 bg-[#EAF2FB] hover:bg-[#D4E5F9] text-[#174A8B] text-xs font-medium rounded border border-[#2166B1]/30 transition-colors shrink-0"
                >
                  Apply "Chennai Plant 1"
                </button>
              )}
            </div>

            {/* Inline validation error beneath site field as requested */}
            {hasSiteError && (
              <div className="mt-1.5 p-2 bg-[#FEF0EF] border border-[#D92D20]/20 rounded text-xs text-[#D92D20] flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>Validation error:</strong> 'Chennai Plant One' does not match any configured site. Did you mean 'Chennai Plant 1'?
                </span>
              </div>
            )}
          </div>

          {/* Emission source */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Emission source <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            />
          </div>

          {/* Activity date */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Activity date <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Quantity <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded font-mono text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-medium text-[#5E6672] mb-1">
              Unit <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded font-mono bg-[#F8F9FB] text-[#171A1F] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Change History Table */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-sm font-medium text-[#171A1F]">Change History</h2>
          </div>
          <button
            type="button"
            onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
            className="text-xs text-[#174A8B] hover:underline flex items-center space-x-1"
          >
            <span>View Screen 35 — Audit Trail</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-2.5 px-4 font-medium">When</th>
              <th className="py-2.5 px-4 font-medium">Who</th>
              <th className="py-2.5 px-4 font-medium">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {historyItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FB]">
                <td className="py-2.5 px-4 font-mono text-[#5E6672] text-[11px] whitespace-nowrap">
                  {item.when}
                </td>
                <td className="py-2.5 px-4 text-[#171A1F] font-medium">
                  {item.who}
                </td>
                <td className="py-2.5 px-4 text-[#5E6672]">
                  {item.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Build Note */}
      <div className="p-3 bg-[#EAF2FB]/30 border border-[#2166B1]/20 rounded text-xs text-[#5E6672] flex items-start space-x-2">
        <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
        <span>
          <strong>Build note:</strong> Every edit creates a new audit-trail entry. Never overwrites in place. This establishes an append-only change-history model for activity data.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          id="btn-discard-row-1042"
          type="button"
          onClick={handleDiscardRow}
          className="px-4 py-2 bg-white border border-[#D92D20] text-[#D92D20] hover:bg-[#FEF0EF] text-xs font-medium rounded transition-colors flex items-center space-x-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Discard Row</span>
        </button>

        <button
          id="btn-save-correction-1042"
          type="button"
          onClick={handleSaveCorrection}
          className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Correction</span>
        </button>
      </div>
    </div>
  );
};
