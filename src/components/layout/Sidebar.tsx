import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';
import {
  LayoutDashboard,
  TableProperties,
  FileSpreadsheet,
  ScanLine,
  Files,
  Calculator,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Zap,
  Users,
  Settings,
  History,
  Bell,
  BookOpen,
  Inbox,
  HelpCircle,
  Eye,
  X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    navigateToScreen,
    records,
    verifierQueries,
    notifications,
    currentRole,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const pendingReviewCount = records.filter((r) => r.status === 'Submitted').length;
  const openQueriesCount = verifierQueries.filter((q) => q.status === 'Open').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  interface NavItem {
    id: ScreenId;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  let sections: NavSection[] = [];

  if (currentRole === 'VERIFIER') {
    sections = [
      {
        title: 'Assurance & Verification',
        items: [
          {
            id: '31_verifier_dashboard',
            label: 'Verifier Dashboard',
            icon: ShieldCheck,
            badge: openQueriesCount > 0 ? `${openQueriesCount} open` : undefined,
            badgeColor: 'bg-[#FEF0EF] text-[#B42318]',
          },
          { id: '32_evidence_trace', label: 'Evidence Trace', icon: Files },
          { id: '33_raise_query', label: 'Assurance Queries', icon: HelpCircle },
          { id: '28_report_preview', label: 'Report Disclosures', icon: FileText },
        ],
      },
      {
        title: 'Governance & Evidence',
        items: [
          { id: '22_factors_reference', label: 'Emission Factors Library', icon: BookOpen },
          { id: '35_audit_trail', label: 'Immutable Audit Trail', icon: History },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#EAF2FB] text-[#174A8B]',
          },
        ],
      },
      {
        title: 'Boundaries (Read-Only)',
        items: [
          { id: '04_org_profile', label: 'Organisation Profile', icon: Building },
          { id: '05_sites', label: 'Assurance Sites', icon: MapPin },
          { id: '06_periods', label: 'Reporting Periods', icon: Calendar },
        ],
      },
    ];
  } else if (currentRole === 'DATA_ENTRY') {
    sections = [
      {
        title: 'Workspace',
        items: [
          { id: '10_activity_dashboard', label: 'Activity Dashboard', icon: LayoutDashboard },
        ],
      },
      {
        title: 'Data Collection',
        items: [
          { id: '11_entry_form', label: 'Manual Data Entry', icon: TableProperties },
          { id: '12_import_upload', label: 'Bulk Import (CSV)', icon: FileSpreadsheet },
          { id: '17_bill_upload', label: 'Electricity Bill OCR', icon: ScanLine },
          { id: '16_attach_evidence', label: 'Evidence & Documents', icon: Files },
        ],
      },
      {
        title: 'Workflow & Tracking',
        items: [
          { id: '23_submission_queue', label: 'My Submissions', icon: Inbox },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#EAF2FB] text-[#174A8B]',
          },
          { id: '22_factors_reference', label: 'Emission Factors', icon: BookOpen },
        ],
      },
    ];
  } else if (currentRole === 'REVIEWER') {
    sections = [
      {
        title: 'Workspace',
        items: [
          { id: '10_activity_dashboard', label: 'Activity Dashboard', icon: LayoutDashboard },
        ],
      },
      {
        title: 'Review & Approvals',
        items: [
          {
            id: '24_review_approve',
            label: 'Review & Approvals',
            icon: CheckCircle2,
            badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
            badgeColor: 'bg-[#EAF2FB] text-[#174A8B]',
          },
          { id: '23_submission_queue', label: 'Submission Queue', icon: Inbox },
          { id: '25_approval_history', label: 'Approval History', icon: History },
          { id: '26_period_lock', label: 'Period Governance', icon: Calendar },
        ],
      },
      {
        title: 'Calculations & Reports',
        items: [
          { id: '20_results_summary', label: 'Calculations Ledger', icon: Calculator },
          { id: '21_drill_down', label: 'Results Drill-Down', icon: Eye },
          { id: '27_report_builder', label: 'Reports & Export', icon: FileText },
          { id: '22_factors_reference', label: 'Emission Factors', icon: BookOpen },
        ],
      },
      {
        title: 'Governance & Assurance',
        items: [
          { id: '35_audit_trail', label: 'Audit Trail Viewer', icon: History },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#EAF2FB] text-[#174A8B]',
          },
        ],
      },
    ];
  } else {
    // TENANT_ADMIN
    sections = [
      {
        title: 'Workspace',
        items: [
          { id: '10_activity_dashboard', label: 'Activity Dashboard', icon: LayoutDashboard },
        ],
      },
      {
        title: 'Data Collection',
        items: [
          { id: '11_entry_form', label: 'Manual Data Entry', icon: TableProperties },
          { id: '12_import_upload', label: 'Bulk Import (CSV)', icon: FileSpreadsheet },
          { id: '17_bill_upload', label: 'Electricity Bill OCR', icon: ScanLine },
          { id: '16_attach_evidence', label: 'Evidence & Documents', icon: Files },
        ],
      },
      {
        title: 'Calculations & Reports',
        items: [
          { id: '20_results_summary', label: 'Calculations Ledger', icon: Calculator },
          { id: '21_drill_down', label: 'Results Drill-Down', icon: Eye },
          { id: '22_factors_reference', label: 'Emission Factors', icon: BookOpen },
          { id: '27_report_builder', label: 'Reports & Export', icon: FileText },
        ],
      },
      {
        title: 'Workflow & Governance',
        items: [
          {
            id: '24_review_approve',
            label: 'Review & Approvals',
            icon: CheckCircle2,
            badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
            badgeColor: 'bg-[#EAF2FB] text-[#174A8B]',
          },
          { id: '23_submission_queue', label: 'Submission Queue', icon: Inbox },
          { id: '26_period_lock', label: 'Period Governance', icon: Calendar },
          {
            id: '31_verifier_dashboard',
            label: 'Verifier Portal',
            icon: ShieldCheck,
            badge: openQueriesCount > 0 ? openQueriesCount : undefined,
            badgeColor: 'bg-[#FEF0EF] text-[#B42318]',
          },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#EAF2FB] text-[#174A8B]',
          },
        ],
      },
      {
        title: 'Administration',
        items: [
          { id: '04_org_profile', label: 'Organisation Profile', icon: Building },
          { id: '05_sites', label: 'Sites & Facilities', icon: MapPin },
          { id: '06_periods', label: 'Reporting Periods', icon: Calendar },
          { id: '07_emission_sources', label: 'Emission Sources', icon: Zap },
          { id: '08_users_roles', label: 'Users & Roles', icon: Users },
          { id: '09_tenant_settings', label: 'Tenant Settings', icon: Settings },
          { id: '35_audit_trail', label: 'Audit Trail Viewer', icon: History },
        ],
      },
    ];
  }

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'VERIFIER':
        return 'Verifier / VVB Mode';
      case 'DATA_ENTRY':
        return 'Data Entry Mode';
      case 'REVIEWER':
        return 'Reviewer Mode';
      default:
        return 'Tenant Admin Mode';
    }
  };

  const renderNavList = () => (
    <div className="flex-1 overflow-y-auto py-3 overscroll-contain pr-0.5">
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <div className="px-4 pb-1 text-[11px] font-semibold text-[#858C96] uppercase tracking-wider">
            {section.title}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateToScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:py-2 text-[13px] transition-colors text-left relative group ${
                    isActive
                      ? 'bg-[#F1F3F5] text-[#174A8B] font-medium'
                      : 'text-[#5E6672] hover:bg-[#F8F9FB] hover:text-[#171A1F]'
                  }`}
                >
                  {/* Active left border indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#174A8B] rounded-r" />
                  )}

                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#174A8B]' : 'text-[#858C96] group-hover:text-[#5E6672]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium shrink-0 ml-1.5 ${
                        item.badgeColor || 'bg-[#F1F3F5] text-[#5E6672]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/45 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide-out menu for mobile viewports) */}
      <aside
        id="mobile-app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-[#D9DDE3] flex flex-col justify-between shadow-2xl md:hidden transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="p-3.5 border-b border-[#D9DDE3] bg-[#F8F9FB] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-[#174A8B] flex items-center justify-center text-white font-medium text-sm shadow-xs">
              T
            </div>
            <div>
              <div className="text-sm font-semibold text-[#171A1F]">Tula Carbon</div>
              <div className="text-[11px] text-[#5E6672]">{getRoleLabel()}</div>
            </div>
          </div>
          <button
            id="btn-close-mobile-menu"
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-[#5E6672] hover:text-[#171A1F] hover:bg-[#E9ECEF] rounded-md transition-colors focus:outline-none"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Perspective Ribbon */}
        <div className="px-3.5 py-2 border-b border-[#F1F3F5] bg-[#F1F3F5] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                currentRole === 'VERIFIER'
                  ? 'bg-[#174A8B]'
                  : currentRole === 'REVIEWER'
                  ? 'bg-[#0F6B48]'
                  : currentRole === 'DATA_ENTRY'
                  ? 'bg-[#B54708]'
                  : 'bg-[#5E6672]'
              }`}
            />
            <span className="text-[11px] font-medium text-[#171A1F] truncate">
              {getRoleLabel()}
            </span>
          </div>
          <span className="text-[10px] text-[#858C96] font-mono shrink-0">Persona Active</span>
        </div>

        {/* Navigation List */}
        {renderNavList()}

        {/* Docked Footer Info / Standards */}
        <div className="shrink-0 p-3 border-t border-[#D9DDE3] bg-[#F8F9FB] text-[11px] text-[#858C96] flex items-center justify-between">
          <span className="truncate">GHG Protocol Standard</span>
          <span className="font-mono text-[10px] text-[#5E6672] shrink-0 ml-1">v1.2</span>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        id="app-sidebar"
        className="hidden md:flex w-60 shrink-0 bg-white border-r border-[#D9DDE3] flex-col justify-between select-none sticky top-14 h-[calc(100vh-3.5rem)] z-20 shadow-[1px_0_2px_rgba(0,0,0,0.02)]"
      >
        {/* Role Perspective Ribbon */}
        <div className="px-3.5 py-2 border-b border-[#F1F3F5] bg-[#F8F9FB] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                currentRole === 'VERIFIER'
                  ? 'bg-[#174A8B]'
                  : currentRole === 'REVIEWER'
                  ? 'bg-[#0F6B48]'
                  : currentRole === 'DATA_ENTRY'
                  ? 'bg-[#B54708]'
                  : 'bg-[#5E6672]'
              }`}
            />
            <span className="text-[11px] font-medium text-[#171A1F] truncate">
              {getRoleLabel()}
            </span>
          </div>
          <span className="text-[10px] text-[#858C96] font-mono shrink-0">Role</span>
        </div>

        {/* Inner scrolling navigation list */}
        {renderNavList()}

        {/* Docked Footer Info / Standards */}
        <div className="shrink-0 p-3 border-t border-[#D9DDE3] bg-[#F8F9FB] text-[11px] text-[#858C96] flex items-center justify-between">
          <span className="truncate">GHG Protocol Standard</span>
          <span className="font-mono text-[10px] text-[#5E6672] shrink-0 ml-1">v1.2</span>
        </div>
      </aside>
    </>
  );
};
