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
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

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
    <div id="screen-06-reporting-periods" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Governance' },
          { label: 'Reporting Periods' },
        ]}
        title="Reporting Periods"
        description="Configure fiscal accounting windows for greenhouse gas inventories and compliance lock governance."
        actions={
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="enterprise-btn-primary h-9 px-3.5 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reporting Period</span>
          </button>
        }
      />

      {/* Periods Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Period Name</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Start Date</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">End Date</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Accounting Status</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Governance Lock</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {periods.map((period) => {
                const isActive = period.id === activePeriod.id;
                return (
                  <tr
                    key={period.id}
                    className={`hover:bg-[#FAFAFB] transition-colors ${
                      isActive ? 'bg-[#6254E8]/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#6254E8]" />
                        <span className="font-semibold text-[#17181A] period-code font-medium">{period.name}</span>
                        {isActive && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#6254E8]/10 text-[#6254E8] rounded-md font-semibold border border-[#6254E8]/20">
                            Active Window
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-data text-[#5F6368]">{period.startDate}</td>
                    <td className="py-3 px-4 font-data text-[#5F6368]">{period.endDate}</td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={period.status === 'In Progress' ? 'Under Review' : 'Approved'}
                        customLabel={period.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      {period.locked ? (
                        <div className="flex items-center space-x-1.5 text-[#5F6368]">
                          <Lock className="w-3.5 h-3.5 text-[#8A8F98]" />
                          <span className="text-[11px] font-medium">Locked (Immutable)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-[#6254E8]">
                          <Unlock className="w-3.5 h-3.5 text-[#6254E8]" />
                          <span className="text-[11px] font-medium">Open for Data Entry</span>
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
                          className="px-2 py-1 text-[11px] text-[#6254E8] hover:underline font-semibold"
                        >
                          Select
                        </button>
                      )}

                      {!period.locked ? (
                        <button
                          onClick={() => setLockingPeriod(period)}
                          className="px-2.5 py-1 text-[11px] text-[#B42318] hover:bg-[#FEF3F2] border border-[#FDA29B] rounded-md transition-colors font-medium"
                        >
                          Lock Period
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#8A8F98] italic font-data">Sealed</span>
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
      <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] text-xs text-[#5F6368] flex items-start space-x-3 shadow-2xs font-sans">
        <ShieldCheck className="w-5 h-5 text-[#6254E8] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#17181A]">Period Lock Governance</span>
          <p className="mt-0.5 text-[11px] leading-relaxed font-data">
            When a reporting period is locked, all activity data records, OCR extractions, and calculated emissions become read-only and immutable. This enforces strict audit compliance for VVB verifiers and ESG regulators.
          </p>
        </div>
      </div>

      {/* Next Step in Flow A */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between text-xs shadow-2xs font-sans">
        <div className="text-[#5F6368] font-data">
          Proceed to configure emission sources across operational facilities.
        </div>
        <button
          onClick={() => navigateToScreen('07_emission_sources', 'FLOW_A')}
          className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
        >
          <span>Continue to Emission Sources</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New Period Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] font-sans animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F4F5F6]">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#6254E8]" />
                <h3 className="text-sm font-semibold text-[#17181A]">New Reporting Period</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#8A8F98] hover:text-[#17181A] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Period Name <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={periodName}
                  onChange={(e) => setPeriodName(e.target.value)}
                  placeholder="e.g. FY 2026–27"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A] period-code font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17181A] mb-1">
                    Start Date <span className="text-[#D92D20]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A] font-data"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17181A] mb-1">
                    End Date <span className="text-[#D92D20]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A] font-data"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB] text-[11px] text-[#5F6368] font-data">
                The system automatically checks for overlapping calendar dates across previously configured reporting windows.
              </div>

              <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="enterprise-btn-secondary h-9 px-3 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs"
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
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-5 font-sans">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#FEF3F2] text-[#B42318] flex items-center justify-center shrink-0 border border-[#FDA29B]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#17181A]">
                  Lock {lockingPeriod.name}?
                </h3>
                <p className="text-xs text-[#5F6368] mt-1 leading-relaxed font-data">
                  Once locked, activity data and associated records cannot be edited or deleted. The dataset will become permanently sealed for external assurance.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#FAFAFB] rounded-lg border border-[#E5E7EB] text-[11px] text-[#5F6368] mb-4 font-data">
              <span className="font-semibold text-[#17181A]">Impact:</span> All 1,842 records in {lockingPeriod.name} will transition from "Approved" to "Locked".
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F1F3F5]">
              <button
                onClick={() => setLockingPeriod(null)}
                className="enterprise-btn-secondary h-9 px-3.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLock}
                className="px-4 py-2 bg-[#B42318] hover:bg-[#D92D20] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
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
