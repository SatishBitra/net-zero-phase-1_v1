import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ReportingPeriod } from '../../../types';
import {
  Calendar,
  Plus,
  Lock,
  Unlock,
  AlertTriangle,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const Screen06_ReportingPeriods: React.FC = () => {
  const { periods, addPeriod, lockPeriod, activePeriod, setActivePeriodId, navigateToScreen, showToast } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [periodName, setPeriodName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Confirmation Modal
  const [lockingPeriod, setLockingPeriod] = useState<ReportingPeriod | null>(null);

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodName || !startDate || !endDate) return;

    addPeriod({
      name: periodName,
      startDate,
      endDate,
      status: 'In Progress',
    });

    setIsDrawerOpen(false);
    setPeriodName('');
    setStartDate('');
    setEndDate('');
  };

  const handleConfirmLock = () => {
    if (!lockingPeriod) return;
    lockPeriod(lockingPeriod.id);
    setLockingPeriod(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Flow Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#5E6672] mb-1">
            <span>Governance</span>
            <span>•</span>
            <span className="text-[#174A8B] font-medium">Reporting Periods</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Reporting Periods</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Configure fiscal accounting windows for greenhouse gas inventories and compliance lock governance.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="mt-3 sm:mt-0 px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reporting Period</span>
        </button>
      </div>

      {/* Periods Table */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Period Name</th>
                <th className="py-2.5 px-4 font-medium">Start Date</th>
                <th className="py-2.5 px-4 font-medium">End Date</th>
                <th className="py-2.5 px-4 font-medium">Accounting Status</th>
                <th className="py-2.5 px-4 font-medium">Governance Lock</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {periods.map((period) => {
                const isActive = period.id === activePeriod.id;
                return (
                  <tr
                    key={period.id}
                    className={`hover:bg-[#F8F9FB] transition-colors ${
                      isActive ? 'bg-[#EAF2FB]/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#5E6672]" />
                        <span className="font-medium text-[#171A1F]">{period.name}</span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#EAF2FB] text-[#174A8B] rounded font-medium border border-[#2166B1]/20">
                            Active Window
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#5E6672]">{period.startDate}</td>
                    <td className="py-3 px-4 font-mono text-[#5E6672]">{period.endDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          period.status === 'In Progress'
                            ? 'bg-[#EAF2FB] text-[#174A8B]'
                            : 'bg-[#F1F3F5] text-[#5E6672]'
                        }`}
                      >
                        {period.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {period.locked ? (
                        <div className="flex items-center space-x-1.5 text-[#5E6672]">
                          <Lock className="w-3.5 h-3.5 text-[#858C96]" />
                          <span className="text-[11px]">Locked (Immutable)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-[#174A8B]">
                          <Unlock className="w-3.5 h-3.5 text-[#2166B1]" />
                          <span className="text-[11px]">Open for Data Entry</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {!isActive && (
                        <button
                          onClick={() => {
                            setActivePeriodId(period.id);
                            showToast(`Active period set to ${period.name}`);
                          }}
                          className="px-2 py-1 text-[11px] text-[#2166B1] hover:underline"
                        >
                          Select
                        </button>
                      )}

                      {!period.locked ? (
                        <button
                          onClick={() => setLockingPeriod(period)}
                          className="px-2.5 py-1 text-[11px] text-[#B42318] hover:bg-[#FEF0EF] border border-[#D9DDE3] rounded transition-colors"
                        >
                          Lock Period
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#858C96] italic">Sealed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lock Guidance Panel */}
      <div className="p-4 bg-[#F8F9FB] rounded-lg border border-[#D9DDE3] text-xs text-[#5E6672] flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-[#171A1F]">Period Lock Governance</span>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            When a reporting period is locked, all activity data records, OCR extractions, and calculated emissions become read-only and immutable. This enforces strict audit compliance for VVB verifiers and ESG regulators.
          </p>
        </div>
      </div>

      {/* Next Step in Flow A */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg flex items-center justify-between text-xs">
        <div className="text-[#5E6672]">
          Proceed to configure emission sources across operational facilities.
        </div>
        <button
          onClick={() => navigateToScreen('07_emission_sources', 'FLOW_A')}
          className="px-4 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <span>Continue to Emission Sources</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New Period Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#D9DDE3] animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between bg-[#F8F9FB]">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">New Reporting Period</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#858C96] hover:text-[#171A1F] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Period Name <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={periodName}
                  onChange={(e) => setPeriodName(e.target.value)}
                  placeholder="e.g. FY 2026–27"
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">
                    Start Date <span className="text-[#D92D20]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">
                    End Date <span className="text-[#D92D20]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-[11px] text-[#5E6672]">
                The system automatically checks for overlapping calendar dates across previously configured reporting windows.
              </div>

              <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#5E6672]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
                >
                  Create Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lock Confirmation Modal */}
      {lockingPeriod && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-[#D9DDE3] p-5">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#FEF0EF] text-[#D92D20] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#171A1F]">
                  Lock {lockingPeriod.name}?
                </h3>
                <p className="text-xs text-[#5E6672] mt-1 leading-relaxed">
                  Once locked, activity data and associated records cannot be edited or deleted. The dataset will become permanently sealed for external assurance.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-[11px] text-[#5E6672] mb-4">
              <span className="font-medium text-[#171A1F]">Impact:</span> All 1,842 records in {lockingPeriod.name} will transition from "Approved" to "Locked".
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F1F3F5]">
              <button
                onClick={() => setLockingPeriod(null)}
                className="px-3.5 py-1.5 text-xs text-[#5E6672] hover:text-[#171A1F]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLock}
                className="px-4 py-1.5 bg-[#B42318] hover:bg-[#D92D20] text-white text-xs font-medium rounded-md shadow-sm flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Period</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
