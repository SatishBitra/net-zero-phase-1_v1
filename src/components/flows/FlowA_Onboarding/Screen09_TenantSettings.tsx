import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Settings, Bell, Database, History, Check, ArrowRight } from 'lucide-react';

export const Screen09_TenantSettings: React.FC = () => {
  const { currentTenant, updateTenantProfile, navigateToScreen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'integrations' | 'audit'>('general');

  // General tab states
  const [displayName, setDisplayName] = useState(currentTenant.name);
  const [dateFormat, setDateFormat] = useState('DD-MMM-YYYY');
  const [unitsSystem, setUnitsSystem] = useState('Metric (SI)');

  // Notifications states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [verifierQueryNotification, setVerifierQueryNotification] = useState(true);
  const [periodLockNotice, setPeriodLockNotice] = useState(true);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantProfile({ name: displayName });
    showToast('Tenant Settings Saved', 'General preferences updated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex items-center space-x-2 text-xs text-[#5E6672] mb-1">
          <span>Administration</span>
          <span>•</span>
          <span className="text-[#174A8B] font-medium">Tenant Settings</span>
        </div>
        <h1 className="text-xl font-normal text-[#171A1F]">Tenant Settings</h1>
        <p className="text-xs text-[#5E6672] mt-0.5">
          Manage tenant-level operational preferences, notification rules, system integrations, and compliance links.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#D9DDE3] flex space-x-6">
        {[
          { id: 'general', label: 'General', icon: Settings },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'integrations', label: 'Integrations', icon: Database },
          { id: 'audit', label: 'Audit & Compliance', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 text-xs font-medium border-b-2 flex items-center space-x-1.5 transition-colors ${
                isActive
                  ? 'border-[#174A8B] text-[#174A8B]'
                  : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
          <h2 className="text-sm font-medium text-[#171A1F]">General Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">Tenant Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">Default Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md bg-white focus:outline-none focus:border-[#174A8B]"
              >
                <option value="DD-MMM-YYYY">DD-MMM-YYYY (e.g. 15-Aug-2025)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US format)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">Units Standard</label>
              <select
                value={unitsSystem}
                onChange={(e) => setUnitsSystem(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md bg-white focus:outline-none focus:border-[#174A8B]"
              >
                <option value="Metric (SI)">Metric (SI: kWh, Litres, kg, tCO2e)</option>
                <option value="Imperial">Imperial (US Customary)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">Default Accounting Standard</label>
              <div className="p-2 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-xs font-medium text-[#171A1F]">
                GHG Protocol Corporate Accounting and Reporting Standard
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F3F5] flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
            >
              Save General Settings
            </button>
          </div>
        </form>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
          <h2 className="text-sm font-medium text-[#171A1F]">Notification Rules</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 text-xs text-[#171A1F] cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-[#D9DDE3] text-[#174A8B] focus:ring-[#174A8B]"
              />
              <span>Send reviewer alert when activity data is submitted for approval</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-[#171A1F] cursor-pointer">
              <input
                type="checkbox"
                checked={verifierQueryNotification}
                onChange={(e) => setVerifierQueryNotification(e.target.checked)}
                className="rounded border-[#D9DDE3] text-[#174A8B] focus:ring-[#174A8B]"
              />
              <span>Immediate alert on line-item query raised by external Verifier (VVB)</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-[#171A1F] cursor-pointer">
              <input
                type="checkbox"
                checked={periodLockNotice}
                onChange={(e) => setPeriodLockNotice(e.target.checked)}
                className="rounded border-[#D9DDE3] text-[#174A8B] focus:ring-[#174A8B]"
              />
              <span>Send compliance lock notice to all tenant members upon period sealing</span>
            </label>
          </div>

          <div className="pt-3 border-t border-[#F1F3F5] flex justify-end">
            <button
              onClick={() => showToast('Notification Preferences Updated')}
              className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
            >
              Save Notification Rules
            </button>
          </div>
        </div>
      )}

      {/* Tab: Integrations (Phase 3 Note per PRD) */}
      {activeTab === 'integrations' && (
        <div className="p-6 bg-white border border-[#D9DDE3] rounded-lg text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F1F3F5] text-[#5E6672] flex items-center justify-center mx-auto">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-medium text-[#171A1F]">Enterprise Connectors (SAP / ERP / SCADA)</h2>
          <p className="text-xs text-[#5E6672] max-w-md mx-auto leading-relaxed">
            No automated ERP integrations configured. Integration configuration with SAP S/4HANA, Oracle ERP Cloud, and utility smart meters will become available when enabled for this tenant in Phase 3.
          </p>
          <div className="pt-2">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#F8F9FB] border border-[#D9DDE3] text-[#858C96]">
              Phase 1 Scope: Manual Data Entry, CSV Import & Electricity Bill OCR
            </span>
          </div>
        </div>
      )}

      {/* Tab: Audit & Compliance */}
      {activeTab === 'audit' && (
        <div className="p-5 bg-white border border-[#D9DDE3] rounded-lg space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#171A1F]">Audit & Compliance Trail</h2>
              <p className="text-xs text-[#5E6672] mt-0.5">
                Every data change, status transition, and approval action is stored in an immutable, cryptographically verifiable log.
              </p>
            </div>
            <button
              onClick={() => navigateToScreen('35_audit_trail')}
              className="px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md flex items-center space-x-1.5 shadow-sm"
            >
              <span>Open Audit Trail Viewer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-xs text-[#5E6672]">
            <span className="font-medium text-[#171A1F]">ISO 14064 & GHG Protocol Assurance:</span> Records cannot be expunged or altered retroactively. When corrections occur, a new revision entry is created with reason documentation.
          </div>
        </div>
      )}
    </div>
  );
};
