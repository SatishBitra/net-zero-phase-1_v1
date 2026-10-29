import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';
import tulaLogo from '../../assets/Tula_Carbon_red.png';
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
  SlidersHorizontal,
  Target,
  Play,
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
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

  const [navSearch, setNavSearch] = useState('');
  const [isPromoCardDismissed, setIsPromoCardDismissed] = useState(false);

  const pendingReviewCount = records.filter((r) => r.status === 'Submitted').length;
  const openQueriesCount = verifierQueries.filter((q) => q.status === 'Open').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  interface NavItem {
    id: ScreenId;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    iconTint?: string;
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
            badgeColor: 'bg-[#FFF0F1] text-[#C52238] border border-[#C52238]/20',
            iconTint: 'text-[#5141FF]',
          },
          { id: '32_evidence_trace', label: 'Evidence Trace', icon: Files, iconTint: 'text-[#168FE5]' },
          { id: '33_raise_query', label: 'Assurance Queries', icon: HelpCircle, iconTint: 'text-[#FB3256]' },
          { id: '28_report_preview', label: 'Report Disclosures', icon: FileText, iconTint: 'text-[#16845B]' },
        ],
      },
      {
        title: 'Governance & Evidence',
        items: [
          { id: '22_factors_reference', label: 'Emission Factors Library', icon: BookOpen, iconTint: 'text-[#5141FF]' },
          { id: '37_benchmarking', label: 'Sector Benchmark Radar', icon: Target, iconTint: 'text-[#168FE5]' },
          { id: '35_audit_trail', label: 'Immutable Audit Trail', icon: History, iconTint: 'text-[#42485A]' },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#FFF0F1] text-[#C52238]',
            iconTint: 'text-[#FB3256]',
          },
        ],
      },
      {
        title: 'Boundaries (Read-Only)',
        items: [
          { id: '04_org_profile', label: 'Organisation Profile', icon: Building, iconTint: 'text-[#62697C]' },
          { id: '05_sites', label: 'Assurance Sites', icon: MapPin, iconTint: 'text-[#62697C]' },
          { id: '06_periods', label: 'Reporting Periods', icon: Calendar, iconTint: 'text-[#62697C]' },
        ],
      },
    ];
  } else if (currentRole === 'DATA_ENTRY') {
    sections = [
      {
        title: 'Workspace',
        items: [
          { id: '10_activity_dashboard', label: 'Activity Dashboard', icon: LayoutDashboard, iconTint: 'text-[#5141FF]' },
        ],
      },
      {
        title: 'Data Collection',
        items: [
          { id: '11_entry_form', label: 'Activity Data Ingestion', icon: TableProperties, iconTint: 'text-[#5141FF]' },
          { id: '16_attach_evidence', label: 'Evidence & Documents', icon: Files, iconTint: 'text-[#16845B]' },
        ],
      },
      {
        title: 'Workflow & Tracking',
        items: [
          { id: '23_submission_queue', label: 'My Submissions', icon: Inbox, iconTint: 'text-[#5141FF]' },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#FFF0F1] text-[#C52238]',
            iconTint: 'text-[#FB3256]',
          },
          { id: '22_factors_reference', label: 'Emission Factors', icon: BookOpen, iconTint: 'text-[#168FE5]' },
        ],
      },
    ];
  } else if (currentRole === 'REVIEWER') {
    sections = [
      {
        title: 'Workspace',
        items: [
          { id: '10_activity_dashboard', label: 'Activity Dashboard', icon: LayoutDashboard, iconTint: 'text-[#5141FF]' },
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
            badgeColor: 'bg-[#F2F0FF] text-[#5141FF] border border-[#5141FF]/20',
            iconTint: 'text-[#16845B]',
          },
          { id: '23_submission_queue', label: 'Submission Queue', icon: Inbox, iconTint: 'text-[#5141FF]' },
          { id: '25_approval_history', label: 'Approval History', icon: History, iconTint: 'text-[#42485A]' },
          {
            id: '33_raise_query',
            label: 'Verifier Queries',
            icon: HelpCircle,
            badge: openQueriesCount > 0 ? `${openQueriesCount} open` : undefined,
            badgeColor: 'bg-[#FFF0F1] text-[#C52238] border border-[#C52238]/20',
            iconTint: 'text-[#FB3256]',
          },
        ],
      },
      {
        title: 'Calculations & Reports',
        items: [
          { id: '19_run_calculation', label: 'Run Calculation Engine', icon: Play, iconTint: 'text-[#5141FF]' },
          { id: '20_results_summary', label: 'Calculations Ledger', icon: Calculator, iconTint: 'text-[#168FE5]' },
          { id: '21_drill_down', label: 'Results Drill-Down', icon: Eye, iconTint: 'text-[#5141FF]' },
          { id: '36_scenario_builder', label: 'What-If Scenarios', icon: SlidersHorizontal, badge: 'New', iconTint: 'text-[#FB3256]' },
          { id: '37_benchmarking', label: 'Industry Benchmarking', icon: Target, iconTint: 'text-[#16845B]' },
          { id: '27_report_builder', label: 'Reports & Export', icon: FileText, iconTint: 'text-[#5141FF]' },
          { id: '22_factors_reference', label: 'Emission Factors', icon: BookOpen, iconTint: 'text-[#168FE5]' },
        ],
      },
      {
        title: 'Governance & Assurance',
        items: [
          { id: '35_audit_trail', label: 'Audit Trail Viewer', icon: History, iconTint: 'text-[#42485A]' },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#FFF0F1] text-[#C52238]',
            iconTint: 'text-[#FB3256]',
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
          { id: '10_activity_dashboard', label: 'Activity Dashboard', icon: LayoutDashboard, iconTint: 'text-[#5141FF]' },
        ],
      },
      {
        title: 'Data Collection',
        items: [
          { id: '11_entry_form', label: 'Activity Data Ingestion', icon: TableProperties, iconTint: 'text-[#5141FF]' },
          { id: '16_attach_evidence', label: 'Evidence & Documents', icon: Files, iconTint: 'text-[#16845B]' },
        ],
      },
      {
        title: 'Calculations & Reports',
        items: [
          { id: '19_run_calculation', label: 'Run Calculation Engine', icon: Play, iconTint: 'text-[#5141FF]' },
          { id: '20_results_summary', label: 'Calculations Ledger', icon: Calculator, iconTint: 'text-[#168FE5]' },
          { id: '21_drill_down', label: 'Results Drill-Down', icon: Eye, iconTint: 'text-[#5141FF]' },
          { id: '36_scenario_builder', label: 'What-If Scenarios', icon: SlidersHorizontal, badge: 'New', iconTint: 'text-[#FB3256]' },
          { id: '37_benchmarking', label: 'Industry Benchmarking', icon: Target, iconTint: 'text-[#16845B]' },
          { id: '22_factors_reference', label: 'Emission Factors', icon: BookOpen, iconTint: 'text-[#168FE5]' },
          { id: '27_report_builder', label: 'Reports & Export', icon: FileText, iconTint: 'text-[#5141FF]' },
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
            badgeColor: 'bg-[#F2F0FF] text-[#5141FF] border border-[#5141FF]/20',
            iconTint: 'text-[#16845B]',
          },
          { id: '23_submission_queue', label: 'Submission Queue', icon: Inbox, iconTint: 'text-[#5141FF]' },
          { id: '26_period_lock', label: 'Period Governance', icon: Calendar, iconTint: 'text-[#62697C]' },
          {
            id: '31_verifier_dashboard',
            label: 'Verifier Portal',
            icon: ShieldCheck,
            badge: openQueriesCount > 0 ? openQueriesCount : undefined,
            badgeColor: 'bg-[#FFF0F1] text-[#C52238] border border-[#C52238]/20',
            iconTint: 'text-[#5141FF]',
          },
          {
            id: '34_reviewer_notification',
            label: 'Notification Center',
            icon: Bell,
            badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
            badgeColor: 'bg-[#FFF0F1] text-[#C52238]',
            iconTint: 'text-[#FB3256]',
          },
        ],
      },
      {
        title: 'Administration',
        items: [
          { id: '04_org_profile', label: 'Organisation Profile', icon: Building, iconTint: 'text-[#62697C]' },
          { id: '05_sites', label: 'Sites & Facilities', icon: MapPin, iconTint: 'text-[#62697C]' },
          { id: '06_periods', label: 'Reporting Periods', icon: Calendar, iconTint: 'text-[#62697C]' },
          { id: '07_emission_sources', label: 'Emission Sources', icon: Zap, iconTint: 'text-[#5141FF]' },
          { id: '08_users_roles', label: 'Users & Roles', icon: Users, iconTint: 'text-[#62697C]' },
          { id: '09_tenant_settings', label: 'Tenant Settings', icon: Settings, iconTint: 'text-[#62697C]' },
          { id: '35_audit_trail', label: 'Audit Trail Viewer', icon: History, iconTint: 'text-[#42485A]' },
        ],
      },
    ];
  }

  const renderNetZeroCard = () => {
    if (isPromoCardDismissed) return null;

    return (
      <div className="p-3 border-t border-[#E2E5EF]/60 bg-white/40 space-y-2">
        <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-b from-white/95 via-white/90 to-[#F7F8FC]/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(28,31,58,0.06),0_2px_6px_rgba(28,31,58,0.03)] space-y-3">
          {/* Decorative Subtle Dot Matrix Grid in Background */}
          <svg
            className="absolute top-2 right-8 w-20 h-14 pointer-events-none opacity-45"
            viewBox="0 0 80 50"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="1.5" fill="#5141FF" fillOpacity="0.4" />
            <circle cx="22" cy="10" r="1.5" fill="#5141FF" fillOpacity="0.7" />
            <circle cx="34" cy="10" r="1.5" fill="#FB3256" fillOpacity="0.5" />
            <circle cx="46" cy="10" r="1.5" fill="#FB3256" fillOpacity="0.8" />
            <circle cx="58" cy="10" r="1.5" fill="#FB3256" fillOpacity="0.3" />
            <circle cx="70" cy="10" r="1.5" fill="#FB3256" fillOpacity="0.2" />

            <circle cx="16" cy="20" r="1.5" fill="#5141FF" fillOpacity="0.6" />
            <circle cx="28" cy="20" r="1.5" fill="#5141FF" fillOpacity="0.9" />
            <circle cx="40" cy="20" r="1.5" fill="#5141FF" fillOpacity="0.6" />
            <circle cx="52" cy="20" r="1.5" fill="#FB3256" fillOpacity="0.7" />
            <circle cx="64" cy="20" r="1.5" fill="#FB3256" fillOpacity="0.4" />

            <circle cx="10" cy="30" r="1.5" fill="#5141FF" fillOpacity="0.3" />
            <circle cx="22" cy="30" r="1.5" fill="#5141FF" fillOpacity="0.7" />
            <circle cx="34" cy="30" r="1.5" fill="#5141FF" fillOpacity="0.5" />
            <circle cx="46" cy="30" r="1.5" fill="#FB3256" fillOpacity="0.6" />
            <circle cx="58" cy="30" r="1.5" fill="#FB3256" fillOpacity="0.3" />

            <circle cx="16" cy="40" r="1.5" fill="#5141FF" fillOpacity="0.4" />
            <circle cx="28" cy="40" r="1.5" fill="#5141FF" fillOpacity="0.5" />
            <circle cx="40" cy="40" r="1.5" fill="#5141FF" fillOpacity="0.3" />
            <circle cx="52" cy="40" r="1.5" fill="#FB3256" fillOpacity="0.4" />
          </svg>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={() => setIsPromoCardDismissed(true)}
            className="absolute top-2.5 right-2.5 p-1 text-[#858CA0] hover:text-[#181B27] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss Net-Zero card"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Icon with Purple and White Glass Fill */}
          <div className="flex items-start justify-between">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7B61FF] via-[#5141FF] to-[#3623D3] flex items-center justify-center shadow-[0_6px_18px_rgba(81,65,255,0.38),inset_0_1.5px_2px_rgba(255,255,255,0.55),inset_0_-1.5px_2px_rgba(0,0,0,0.2)] border border-white/35 shrink-0 overflow-hidden group">
              {/* Glass reflection overlay on top half */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-2xl" />
              <Sparkles className="w-5 h-5 text-white relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#181B27] tracking-tight leading-snug">
                Net-Zero 2030 Pathway
              </h4>
              <span className="text-[10px] font-bold text-[#16845B] bg-[#E8F7EF] px-1.5 py-0.5 rounded-full font-mono">
                68.4%
              </span>
            </div>
            <p className="text-[11px] text-[#62697C] leading-snug">
              SBTi 1.5°C pathway target: -42% reduction on track
            </p>
          </div>

          {/* Dark Gradient Pill Button matching reference design ("Upgrade plan" button style) */}
          <button
            type="button"
            onClick={() => {
              navigateToScreen('36_scenario_builder', 'FLOW_E');
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-b from-[#2B3045] via-[#212537] to-[#141724] hover:from-[#373E5B] hover:to-[#1A1E2E] text-white text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(20,24,42,0.25)] hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35),0_6px_16px_rgba(20,24,42,0.35)] active:scale-[0.99] border border-[#3D4460]/40 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer group"
          >
            <span>Explore Simulator</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Footer Compliance Badge */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#181B27] px-1 pt-0.5">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
            <span className="text-[10px] text-[#62697C]">ISO 14064-1 & 3 Assurance</span>
          </span>
          <span className="text-[10px] text-[#858CA0] font-mono">v2.0</span>
        </div>
      </div>
    );
  };

  const renderNavList = () => (
    <div className="flex-1 overflow-y-auto py-2.5 px-3 space-y-4 overscroll-contain">
      {/* Quick Search Input with ⌘ K shortcut badge */}
      <div className="relative mb-2.5">
        <Search className="w-3.5 h-3.5 text-[#858CA0] absolute left-3 top-2.5" />
        <input
          type="text"
          value={navSearch}
          onChange={(e) => setNavSearch(e.target.value)}
          placeholder="Ask or search…"
          className="w-full h-8 pl-8 pr-11 text-xs bg-white/70 hover:bg-white focus:bg-white border border-[#E2E5EF] focus:border-[#5141FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5141FF]/20 text-[#181B27] placeholder-[#858CA0] transition-colors shadow-2xs"
        />
        <span className="absolute right-2 top-1.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#858CA0] bg-[#F0F2F7] rounded border border-[#E2E5EF]">
          ⌘K
        </span>
      </div>

      {sections.map((section) => {
        const matchingItems = section.items.filter((item) =>
          !navSearch.trim() || item.label.toLowerCase().includes(navSearch.toLowerCase())
        );

        if (matchingItems.length === 0) return null;

        return (
          <div key={section.title} className="space-y-1">
            <div className="px-2 pt-1 pb-1 text-[10px] font-bold text-[#858CA0] uppercase tracking-wider font-sans">
              {section.title}
            </div>
            <div className="space-y-1">
              {matchingItems.map((item) => {
                const isActive = currentScreen === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateToScreen(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all text-left relative group font-sans focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none ${
                      isActive
                        ? 'bg-white text-[#181B27] font-semibold shadow-[0_2px_10px_rgba(28,31,58,0.06),0_1px_3px_rgba(28,31,58,0.04)] border border-[#E2E5EF]/80'
                        : 'text-[#62697C] border border-transparent hover:bg-white/80 hover:text-[#181B27] hover:shadow-[0_2px_8px_rgba(28,31,58,0.04)] hover:border-white/80 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#5141FF]'
                            : 'text-[#858CA0] group-hover:text-[#5141FF]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ml-1.5 transition-all ${
                          item.badge === 'New'
                            ? 'bg-[#5141FF] text-white shadow-xs shadow-[#5141FF]/25'
                            : item.badgeColor || 'bg-[#5141FF] text-white shadow-xs shadow-[#5141FF]/20'
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
        );
      })}
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

      {/* Mobile Drawer */}
      <aside
        id="mobile-app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] glass-shell bg-white/95 border-r border-[#E2E5EF] flex flex-col justify-between shadow-2xl md:hidden transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="p-3.5 border-b border-[#E2E5EF] bg-white/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={tulaLogo}
              alt="Tula Carbon"
              className="h-9 sm:h-10 w-auto max-w-[180px] object-contain"
            />
          </div>
          <button
            id="btn-close-mobile-menu"
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-[#858CA0] hover:text-[#181B27] hover:bg-[#F0F2F7] rounded-lg transition-colors focus:outline-none"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        {renderNavList()}

        {/* Mobile Drawer Decarbonization Promo / Target Card */}
        {renderNetZeroCard()}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        id="app-sidebar"
        className="hidden md:flex md:w-64 lg:w-64 shrink-0 glass-shell bg-white/75 backdrop-blur-xl border-r border-[#E2E5EF]/70 flex-col justify-between select-none sticky top-16 h-[calc(100vh-4rem)] z-20 shadow-[1px_0_4px_rgba(28,31,58,0.03)] pt-2"
      >
        {/* Inner scrolling navigation list */}
        {renderNavList()}

        {/* Bottom Decarbonization Promo / Target Card */}
        {renderNetZeroCard()}
      </aside>
    </>
  );
};
