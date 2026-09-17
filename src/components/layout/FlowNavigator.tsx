import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId, FlowId, UserRole } from '../../types';
import {
  X,
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  ScanLine,
  Calculator,
  ShieldCheck,
  Building,
  TableProperties,
  Compass,
  Layers,
} from 'lucide-react';

interface FlowNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlowNavigator: React.FC<FlowNavigatorProps> = ({ isOpen, onClose }) => {
  const { currentScreen, navigateToScreen, setCurrentRole } = useApp();
  const [activeTab, setActiveTab] = useState<'flows' | 'workspaces'>('flows');

  if (!isOpen) return null;

  interface FlowDefinition {
    id: FlowId;
    name: string;
    role: string;
    defaultRole: UserRole;
    description: string;
    icon: React.ElementType;
    steps: { screen: ScreenId; label: string }[];
  }

  const flows: FlowDefinition[] = [
    {
      id: 'FLOW_A',
      name: 'Tenant Onboarding & Entity Setup',
      role: 'Tenant Admin',
      defaultRole: 'TENANT_ADMIN',
      description: 'End-to-end setup sequence: Legal entity, sites/facilities, reporting period, emission sources, and user invites.',
      icon: Building,
      steps: [
        { screen: '01_login', label: 'Login' },
        { screen: '04_org_profile', label: 'Organisation Profile' },
        { screen: '05_sites', label: 'Sites & Facilities' },
        { screen: '06_periods', label: 'Reporting Periods' },
        { screen: '07_emission_sources', label: 'Emission Sources' },
        { screen: '08_users_roles', label: 'Invite Users' },
      ],
    },
    {
      id: 'FLOW_B',
      name: 'Activity Data Entry & Approval Lifecycle',
      role: 'Data Entry → Reviewer',
      defaultRole: 'DATA_ENTRY',
      description: 'Activity data creation, supporting evidence document attachment, submission for review, reviewer approval or correction loop, and period lock.',
      icon: TableProperties,
      steps: [
        { screen: '10_activity_dashboard', label: 'Activity Dashboard' },
        { screen: '11_entry_form', label: 'Entry Form' },
        { screen: '16_attach_evidence', label: 'Attach Evidence' },
        { screen: '23_submission_queue', label: 'Submission Queue' },
        { screen: '24_review_approve', label: 'Review & Approve' },
        { screen: '25_approval_history', label: 'Approval History' },
        { screen: '26_period_lock', label: 'Period Governance' },
      ],
    },
    {
      id: 'FLOW_C',
      name: 'Bulk Data Ingestion (CSV / Excel)',
      role: 'Data Entry',
      defaultRole: 'DATA_ENTRY',
      description: 'File upload, source-to-target column mapping, validation engine, interactive error detail fix view, and submission for review.',
      icon: FileSpreadsheet,
      steps: [
        { screen: '10_activity_dashboard', label: 'Activity Dashboard' },
        { screen: '12_import_upload', label: 'Upload File' },
        { screen: '13_column_mapping', label: 'Column Mapping' },
        { screen: '14_import_validation', label: 'Validation Results' },
        { screen: '15_fix_detail_view', label: 'Fix in Detail View' },
      ],
    },
    {
      id: 'FLOW_D',
      name: 'Utility Bill OCR & Smart Ingestion',
      role: 'Data Entry',
      defaultRole: 'DATA_ENTRY',
      description: 'AI extraction pipeline: Upload utility bill, automated extraction with confidence scoring, human review verification control point, and pre-filled entry form.',
      icon: ScanLine,
      steps: [
        { screen: '10_activity_dashboard', label: 'Activity Dashboard' },
        { screen: '17_bill_upload', label: 'Upload Bill' },
        { screen: '18_human_review', label: 'Human Review' },
        { screen: '11_entry_form', label: 'Pre-filled Entry Form' },
      ],
    },
    {
      id: 'FLOW_E',
      name: 'Emissions Calculation, Analytics & Reports',
      role: 'Reviewer / Admin',
      defaultRole: 'REVIEWER',
      description: 'Run calculation engine across Scope 1/2/3, results summary, drill-down to underlying source evidence, report builder, preview, and download.',
      icon: Calculator,
      steps: [
        { screen: '19_run_calculation', label: 'Run Calculation' },
        { screen: '20_results_summary', label: 'Results Summary' },
        { screen: '21_drill_down', label: 'Drill-Down to Source' },
        { screen: '22_factors_reference', label: 'Emission Factors' },
        { screen: '27_report_builder', label: 'Report Builder' },
        { screen: '28_report_preview', label: 'Report Preview' },
        { screen: '29_export_download', label: 'Export / Download' },
      ],
    },
    {
      id: 'FLOW_F',
      name: 'Verifier Portal & Assurance Trace',
      role: 'Verifier / VVB',
      defaultRole: 'VERIFIER',
      description: 'Scoped verifier access, verification dashboard, line-item evidence trace to source document, raising line-item queries, and reviewer notifications.',
      icon: ShieldCheck,
      steps: [
        { screen: '30_verifier_login', label: 'Verifier Login' },
        { screen: '31_verifier_dashboard', label: 'Verifier Dashboard' },
        { screen: '32_evidence_trace', label: 'Evidence Trace' },
        { screen: '33_raise_query', label: 'Raise Query' },
        { screen: '34_reviewer_notification', label: 'Notification Center' },
        { screen: '35_audit_trail', label: 'Audit Trail' },
      ],
    },
  ];

  const workspaceInventory: { name: string; category: string; screen: ScreenId }[] = [
    { name: 'Login Portal', category: 'Authentication', screen: '01_login' },
    { name: 'MFA Verification Challenge', category: 'Authentication', screen: '02_mfa' },
    { name: 'Tenant Directory Selector', category: 'Organisation', screen: '03_tenant_selector' },
    { name: 'Organisation Profile', category: 'Organisation', screen: '04_org_profile' },
    { name: 'Sites & Facilities', category: 'Organisation', screen: '05_sites' },
    { name: 'Reporting Periods', category: 'Governance', screen: '06_periods' },
    { name: 'Emission Sources Setup', category: 'Configuration', screen: '07_emission_sources' },
    { name: 'User & Role Management', category: 'Administration', screen: '08_users_roles' },
    { name: 'Tenant Settings', category: 'Administration', screen: '09_tenant_settings' },
    { name: 'Activity Data Dashboard', category: 'Data Collection', screen: '10_activity_dashboard' },
    { name: 'Activity Data Entry Form', category: 'Data Collection', screen: '11_entry_form' },
    { name: 'Bulk Import Upload', category: 'Data Collection', screen: '12_import_upload' },
    { name: 'Column Mapping Engine', category: 'Data Collection', screen: '13_column_mapping' },
    { name: 'Import Validation Results', category: 'Data Collection', screen: '14_import_validation' },
    { name: 'Row Error Detail Fix', category: 'Data Collection', screen: '15_fix_detail_view' },
    { name: 'Attach Evidence Documents', category: 'Data Collection', screen: '16_attach_evidence' },
    { name: 'Utility Bill OCR Upload', category: 'Data Collection', screen: '17_bill_upload' },
    { name: 'Human Review & Verification', category: 'Data Collection', screen: '18_human_review' },
    { name: 'Run Calculation Engine', category: 'Calculations', screen: '19_run_calculation' },
    { name: 'Calculation Results Summary', category: 'Calculations', screen: '20_results_summary' },
    { name: 'Results Line-Item Drill-Down', category: 'Calculations', screen: '21_drill_down' },
    { name: 'Emission Factors Reference', category: 'Calculations', screen: '22_factors_reference' },
    { name: 'Submission Queue', category: 'Workflow', screen: '23_submission_queue' },
    { name: 'Review & Approval Workflow', category: 'Workflow', screen: '24_review_approve' },
    { name: 'Approval History Log', category: 'Workflow', screen: '25_approval_history' },
    { name: 'Period Governance & Lock', category: 'Governance', screen: '26_period_lock' },
    { name: 'Disclosure Report Builder', category: 'Reporting', screen: '27_report_builder' },
    { name: 'Report Document Preview', category: 'Reporting', screen: '28_report_preview' },
    { name: 'Export & Package Download', category: 'Reporting', screen: '29_export_download' },
    { name: 'Verifier Dedicated Login', category: 'Assurance', screen: '30_verifier_login' },
    { name: 'Verifier Assurance Dashboard', category: 'Assurance', screen: '31_verifier_dashboard' },
    { name: 'Evidence Trace & Lineage Viewer', category: 'Assurance', screen: '32_evidence_trace' },
    { name: 'Raise Verifier Query', category: 'Assurance', screen: '33_raise_query' },
    { name: 'Reviewer Notification Center', category: 'Workflow', screen: '34_reviewer_notification' },
    { name: 'Immutable Audit Trail', category: 'Governance', screen: '35_audit_trail' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#D9DDE3] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between bg-[#F8F9FB]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-[#EAF2FB] text-[#174A8B]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#171A1F]">Workflow Directory & Navigation</h2>
              <p className="text-[11px] text-[#5E6672]">
                Explore end-to-end carbon accounting workflows and enterprise workspaces
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#858C96] hover:text-[#171A1F] hover:bg-[#E9ECEF] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-4 pt-3 border-b border-[#D9DDE3] flex space-x-4 bg-white">
          <button
            onClick={() => setActiveTab('flows')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'flows'
                ? 'border-[#174A8B] text-[#174A8B]'
                : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
            }`}
          >
            Core Workflows
          </button>
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'workspaces'
                ? 'border-[#174A8B] text-[#174A8B]'
                : 'border-transparent text-[#5E6672] hover:text-[#171A1F]'
            }`}
          >
            All Workspaces & Modules
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'flows' ? (
            <div className="space-y-4">
              {flows.map((flow) => {
                const Icon = flow.icon;
                return (
                  <div
                    key={flow.id}
                    className="p-3.5 rounded-lg border border-[#D9DDE3] bg-white hover:border-[#B8BEC7] transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded bg-[#EAF2FB] text-[#174A8B]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-[#171A1F]">{flow.name}</h3>
                          <div className="text-[11px] text-[#5E6672]">Default Persona: {flow.role}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentRole(flow.defaultRole);
                          navigateToScreen(flow.steps[0].screen, flow.id);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#174A8B] text-white hover:bg-[#2166B1] rounded transition-colors"
                      >
                        Start Workflow →
                      </button>
                    </div>

                    <p className="text-[11px] text-[#5E6672] mt-2">{flow.description}</p>

                    {/* Stepper links */}
                    <div className="mt-3 pt-2.5 border-t border-[#F1F3F5] flex flex-wrap gap-1.5 items-center">
                      {flow.steps.map((step, idx) => {
                        const isCurrent = currentScreen === step.screen;
                        return (
                          <React.Fragment key={step.screen}>
                            <button
                              onClick={() => {
                                setCurrentRole(flow.defaultRole);
                                navigateToScreen(step.screen, flow.id);
                                onClose();
                              }}
                              className={`px-2 py-1 rounded text-[11px] border transition-colors flex items-center space-x-1.5 ${
                                isCurrent
                                  ? 'bg-[#174A8B] text-white border-[#174A8B]'
                                  : 'bg-[#F8F9FB] text-[#171A1F] border-[#D9DDE3] hover:border-[#2166B1]'
                              }`}
                            >
                              <span className="text-[10px] font-medium opacity-75">{idx + 1}.</span>
                              <span>{step.label}</span>
                            </button>
                            {idx < flow.steps.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-[#858C96] shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {workspaceInventory.map((item) => {
                const isCurrent = currentScreen === item.screen;
                return (
                  <button
                    key={item.screen}
                    onClick={() => {
                      navigateToScreen(item.screen);
                      onClose();
                    }}
                    className={`p-2.5 rounded-md border text-left transition-colors flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#EAF2FB] border-[#2166B1] text-[#174A8B]'
                        : 'bg-white border-[#D9DDE3] hover:border-[#B8BEC7] text-[#171A1F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-[#5E6672] mt-0.5 block">{item.category}</span>
                    </div>
                    {isCurrent && <CheckCircle className="w-4 h-4 text-[#174A8B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-[#F8F9FB] border-t border-[#D9DDE3] text-[11px] text-[#5E6672] flex items-center justify-between">
          <span>ISO 14064-1:2018 & GHG Protocol Corporate Standard</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs text-[#5E6672] hover:text-[#171A1F]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
