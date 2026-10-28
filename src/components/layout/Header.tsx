import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import tulaLogo from '../../assets/Tula_Carbon_red.png';
import {
  Building2,
  ChevronDown,
  Bell,
  Calendar,
  UserCheck,
  Compass,
  Menu,
  X,
  PanelRight,
  LogOut,
  Check,
  ArrowRight,
  ShieldCheck,
  User,
  ScanLine,
  PlusCircle,
  FileBarChart,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  onOpenFlowMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFlowMap }) => {
  const {
    currentTenant,
    setCurrentTenant,
    tenants,
    currentRole,
    setCurrentRole,
    activePeriod,
    periods,
    setActivePeriodId,
    verifierQueries,
    notifications,
    navigateToScreen,
    currentScreen,
    isMobileMenuOpen,
    toggleMobileMenu,
    isMobileRightNavOpen,
    setIsMobileRightNavOpen,
    toggleMobileRightNav,
    openFactorHelper,
  } = useApp();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  const openQueriesCount = verifierQueries.filter((q) => q.status === 'Open').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const roles: { role: UserRole; label: string; shortLabel: string; desc: string }[] = [
    { role: 'TENANT_ADMIN', label: 'Tenant Admin', shortLabel: 'Admin', desc: 'Organisation setup, boundaries, emission sources, user access' },
    { role: 'DATA_ENTRY', label: 'Data Entry', shortLabel: 'Entry', desc: 'Enter activity data, upload bills/evidence, submit for review' },
    { role: 'REVIEWER', label: 'Reviewer / Approver', shortLabel: 'Review', desc: 'Review submissions, verify evidence, approve or send back' },
    { role: 'VERIFIER', label: 'Verifier / VVB', shortLabel: 'Verifier', desc: 'Independent audit, evidence trace to source, raise line queries' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    setIsMobileRightNavOpen(false);
    if (role === 'VERIFIER') {
      navigateToScreen('31_verifier_dashboard', 'FLOW_F');
    } else if (role === 'DATA_ENTRY') {
      navigateToScreen('10_activity_dashboard', 'FLOW_B');
    } else if (role === 'REVIEWER') {
      navigateToScreen('24_review_approve', 'FLOW_B');
    } else {
      navigateToScreen('04_org_profile', 'FLOW_A');
    }
  };

  const getUserInitials = () => {
    switch (currentRole) {
      case 'TENANT_ADMIN':
        return 'JR';
      case 'DATA_ENTRY':
        return 'AK';
      case 'REVIEWER':
        return 'SI';
      case 'VERIFIER':
        return 'MS';
      default:
        return 'TC';
    }
  };

  const getUserName = () => {
    switch (currentRole) {
      case 'TENANT_ADMIN':
        return 'J. Rao';
      case 'DATA_ENTRY':
        return 'A. Kumar';
      case 'REVIEWER':
        return 'S. Iyer';
      case 'VERIFIER':
        return 'M. Singh';
      default:
        return 'Authorized User';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 glass-shell bg-white/80 backdrop-blur-xl border-b border-[#E2E5EF]/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-[0_2px_12px_rgba(28,31,58,0.03)]">
        {/* ============================================================ */}
        {/* MOBILE HEADER (md:hidden): Left Menu Bar | Center Logo | Right Side Nav Bar */}
        {/* ============================================================ */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left: Left Menu Bar Button */}
          <div className="flex items-center w-12 justify-start">
            <button
              id="btn-mobile-left-menu"
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 -ml-1 text-[#17181A] hover:text-[#5141FF] hover:bg-[#F2F0FF] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#5141FF]/20"
              aria-label={isMobileMenuOpen ? "Close left navigation menu" : "Open left navigation menu"}
              title="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: Centered Brand Logo */}
          <div
            onClick={() => navigateToScreen('10_activity_dashboard')}
            className="flex items-center cursor-pointer select-none group"
          >
            <img
              src={tulaLogo}
              alt="Tula Carbon"
              className="h-11 sm:h-12 w-auto max-w-[220px] object-contain group-hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Right: Right Side Nav Bar Menu Toggle Button */}
          <div className="flex items-center w-12 justify-end">
            <button
              id="btn-mobile-right-menu"
              type="button"
              onClick={toggleMobileRightNav}
              className="p-2 -mr-1 text-[#17181A] hover:text-[#5141FF] hover:bg-[#F2F0FF] rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-[#5141FF]/20"
              aria-label={isMobileRightNavOpen ? "Close side nav menu" : "Open side nav menu"}
              title="Open side nav bar menu"
            >
              {isMobileRightNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <PanelRight className="w-5 h-5" />
              )}
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FB3256] rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP HEADER (hidden md:flex): Left Controls + Right Controls */}
        {/* ============================================================ */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Left: Brand Logo + Context Hierarchy (Organization & Reporting Period aligned to Inner Content) */}
          <div className="flex items-center min-w-0">
            {/* Brand Logo - Sized to match sidebar width (w-64) so dropdowns align with Inner Content Title */}
            <div
              id="header-brand-logo"
              onClick={() => navigateToScreen('10_activity_dashboard')}
              className="w-64 shrink-0 flex items-center cursor-pointer select-none group pr-4"
              title="Tula Carbon Dashboard"
            >
              <img
                src={tulaLogo}
                alt="Tula Carbon"
                className="h-11 sm:h-12 md:h-[50px] w-auto max-w-[230px] object-contain group-hover:opacity-90 transition-opacity"
              />
            </div>

            {/* Context Hierarchy: Organization + Reporting Period (Aligned with Inner Content Title) */}
            <div className="flex items-center space-x-2 min-w-0">
              {/* Tenant / Organization Selector */}
              <div className="relative min-w-0">
                <button
                  onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                  className="flex items-center space-x-2 px-3 h-9 text-xs text-[#181B27] hover:bg-[#F7F8FC] rounded-xl border border-[#E2E5EF] hover:border-[#CCD1DF] focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none transition-all max-w-[210px] bg-white/80 hover:bg-white shadow-2xs font-sans group"
                  title="Switch Organisation"
                  aria-expanded={tenantDropdownOpen}
                >
                  <Building2 className="w-3.5 h-3.5 text-[#5141FF] shrink-0" aria-hidden="true" />
                  <span className="font-semibold truncate">{currentTenant.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#858CA0] group-hover:text-[#181B27] transition-colors shrink-0" aria-hidden="true" />
                </button>

                {tenantDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 glass-card-strong bg-white/95 rounded-xl shadow-xl border border-[#E2E5EF] py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-[#F0F2F7] text-[11px] font-semibold text-[#858CA0] uppercase tracking-wider">
                      Select Organisation Context
                    </div>
                    {tenants.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCurrentTenant(t);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F8FC] focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none ${
                          t.id === currentTenant.id ? 'bg-[#F2F0FF] text-[#5141FF] font-semibold' : 'text-[#181B27]'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-semibold truncate">{t.name}</div>
                          <div className="text-[11px] text-[#62697C] font-data">{t.legalEntityName}</div>
                        </div>
                        {t.id === currentTenant.id && (
                          <Check className="w-4 h-4 text-[#5141FF] shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-[#F0F2F7] p-1.5">
                      <button
                        onClick={() => {
                          setTenantDropdownOpen(false);
                          navigateToScreen('03_tenant_selector');
                        }}
                        className="w-full text-center py-1 text-xs text-[#5141FF] font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none"
                      >
                        View Tenant Directory →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reporting Period / Year Selector */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                  className="flex items-center space-x-2 px-3 h-9 text-xs text-[#181B27] hover:bg-[#F7F8FC] rounded-xl border border-[#E2E5EF] hover:border-[#CCD1DF] focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none transition-all shadow-2xs bg-white/80 hover:bg-white font-sans group"
                  title="Select Reporting Period"
                  aria-expanded={periodDropdownOpen}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#5141FF] shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-[#181B27] whitespace-nowrap">{activePeriod.name}</span>
                  {activePeriod.locked ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#F0F2F7] text-[#42485A] rounded-full border border-[#E2E5EF] font-bold uppercase tracking-wider">
                      Locked
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#E8F7EF] text-[#16845B] rounded-full border border-[#16845B]/20 font-bold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-[#858CA0] group-hover:text-[#181B27] transition-colors shrink-0" aria-hidden="true" />
                </button>

              {periodDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-60 glass-card-strong bg-white/95 rounded-xl shadow-xl border border-[#E2E5EF] py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-[#F0F2F7] text-[11px] font-semibold text-[#858CA0] uppercase tracking-wider">
                    Reporting Period
                  </div>
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePeriodId(p.id);
                        setPeriodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F8FC] focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none ${
                        p.id === activePeriod.id ? 'bg-[#F2F0FF] text-[#5141FF] font-semibold' : 'text-[#181B27]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[11px] text-[#62697C] font-mono">
                          {p.startDate} to {p.endDate}
                        </div>
                      </div>
                      {p.locked && (
                        <span className="text-[11px] px-2 py-0.5 bg-[#F0F2F7] text-[#42485A] rounded-full border border-[#E2E5EF]">
                          Locked
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#F0F2F7] p-1.5">
                    <button
                      onClick={() => {
                        setPeriodDropdownOpen(false);
                        navigateToScreen('06_periods');
                      }}
                      className="w-full text-center py-1 text-xs text-[#5141FF] font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none"
                    >
                      Manage Reporting Periods →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Right: Notification Center & User Profile */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* Notifications: Direct Nav to Screen 34 */}
            <button
              id="btn-nav-notifications"
              onClick={() => navigateToScreen('34_reviewer_notification', 'FLOW_F')}
              className="h-9 w-9 flex items-center justify-center text-[#42485A] hover:text-[#5141FF] hover:bg-[#F2F0FF] rounded-xl border border-[#E2E5EF] hover:border-[#CCD1DF] focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none transition-colors relative shadow-2xs bg-white/70"
              title="Notification Center"
              aria-label="Notification Center"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 px-1 min-w-[14px] h-[14px] text-[9px] font-bold bg-[#FB3256] text-white rounded-full flex items-center justify-center leading-none" aria-label={`${unreadNotificationsCount} unread notifications`}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Component: Avatar + Name */}
            <div
              onClick={() => navigateToScreen('01_login', 'FLOW_A')}
              className="flex items-center space-x-2 px-2.5 h-9 rounded-xl hover:bg-[#F7F8FC] cursor-pointer transition-colors border border-[#E2E5EF] hover:border-[#CCD1DF] focus-visible:ring-2 focus-visible:ring-[#5141FF] focus-visible:outline-none shadow-2xs bg-white/70"
              title="Account Settings / Log out"
              tabIndex={0}
              role="button"
            >
              <div className="w-6 h-6 rounded-lg bg-[#F2F0FF] text-[#5141FF] font-semibold text-[11px] flex items-center justify-center shrink-0 border border-[#E5E0FF]">
                {getUserInitials()}
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <span className="text-xs font-semibold text-[#181B27]">{getUserName()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#858CA0]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE RIGHT SIDE NAV BAR MENU (Drawer) */}
      {/* ============================================================ */}
      {isMobileRightNavOpen && (
        <div
          id="mobile-right-nav-backdrop"
          onClick={() => setIsMobileRightNavOpen(false)}
          className="fixed inset-0 bg-black/45 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-right-nav-drawer"
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[86vw] bg-white border-l border-[#D9DDE3] flex flex-col justify-between shadow-2xl md:hidden transition-transform duration-200 ease-in-out ${
          isMobileRightNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-[#D9DDE3] bg-[#F8F9FB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PanelRight className="w-4 h-4 text-[#174A8B]" />
            <span className="text-sm font-semibold text-[#171A1F]">Side Nav Menu</span>
          </div>
          <button
            id="btn-close-mobile-right-nav"
            type="button"
            onClick={() => setIsMobileRightNavOpen(false)}
            className="p-1.5 text-[#5E6672] hover:text-[#171A1F] hover:bg-[#E9ECEF] rounded-md transition-colors focus:outline-none"
            aria-label="Close side nav menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* User Profile Summary */}
          <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded-lg flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#174A8B] text-white flex items-center justify-center text-sm font-semibold shadow-xs shrink-0">
              {getUserInitials()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#171A1F] truncate">{getUserName()}</div>
              <div className="text-[11px] text-[#5E6672] truncate">satishbittu67@gmail.com</div>
              <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EAF2FB] text-[#174A8B] border border-[#2166B1]/20">
                {roles.find((r) => r.role === currentRole)?.label || currentRole}
              </span>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#858C96] uppercase tracking-wider">
                Quick Actions
              </span>
              <span className="text-[10px] text-[#5141FF] font-semibold bg-[#F2F0FF] px-1.5 py-0.5 rounded">
                Direct Jump
              </span>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('17_bill_upload', 'FLOW_D');
                }}
                className="w-full p-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FAFAFB] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#F2F0FF] text-[#5141FF] flex items-center justify-center shrink-0">
                    <ScanLine className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#17181A]">Upload Bill</div>
                    <div className="text-[10px] text-[#5F6368]">AI OCR Extraction</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8A8F98]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('11_entry_form', 'FLOW_B');
                }}
                className="w-full p-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FAFAFB] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#EEF9F1] text-[#26783B] flex items-center justify-center shrink-0">
                    <PlusCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#17181A]">Log Emission</div>
                    <div className="text-[10px] text-[#5F6368]">Manual Activity Entry</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8A8F98]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('27_report_builder', 'FLOW_E');
                }}
                className="w-full p-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FAFAFB] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#FFF8E6] text-[#B54708] flex items-center justify-center shrink-0">
                    <FileBarChart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#17181A]">Start New Report</div>
                    <div className="text-[10px] text-[#5F6368]">GHG Disclosure Builder</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8A8F98]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  openFactorHelper();
                }}
                className="w-full p-2.5 rounded-lg border border-[#E5E0FF] bg-[#F2F0FF]/60 hover:bg-[#F2F0FF] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#5141FF] text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#17181A]">Factor Helper</div>
                    <div className="text-[10px] text-[#5141FF] font-semibold">IPCC AR6 & IEA 2024 Lookup</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8A8F98]" />
              </button>
            </div>
          </div>

          {/* Role Switcher Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#858C96] uppercase tracking-wider">
                Active Role Perspective
              </span>
              <span className="text-[10px] text-[#174A8B] font-mono">1-Tap Switch</span>
            </div>
            <div className="space-y-1.5">
              {roles.map((r) => {
                const isActive = currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className={`w-full p-2.5 rounded-md text-left text-xs transition-all border flex items-center justify-between ${
                      isActive
                        ? 'bg-[#EAF2FB] border-[#174A8B] text-[#174A8B] font-medium shadow-xs'
                        : 'bg-white border-[#D9DDE3] text-[#171A1F] hover:bg-[#F8F9FB]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-[#5E6672] line-clamp-1">{r.desc}</div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-[#174A8B] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Organisation / Tenant Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#858C96] uppercase tracking-wider">
                Organisation / Tenant
              </span>
              <Building2 className="w-3.5 h-3.5 text-[#858C96]" />
            </div>
            <div className="space-y-1">
              {tenants.map((t) => {
                const isSelected = t.id === currentTenant.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTenant(t);
                      setIsMobileRightNavOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-md text-left text-xs flex items-center justify-between border transition-colors ${
                      isSelected
                        ? 'bg-[#F1F3F5] border-[#D9DDE3] text-[#174A8B] font-medium'
                        : 'bg-white border-transparent hover:bg-[#F8F9FB] text-[#171A1F]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-[10px] text-[#858C96]">{t.legalEntityName}</div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#174A8B] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('03_tenant_selector');
                }}
                className="w-full py-1.5 text-center text-xs text-[#174A8B] font-medium hover:underline flex items-center justify-center space-x-1"
              >
                <span>View Full Tenant Directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Reporting Period Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#858C96] uppercase tracking-wider">
                Reporting Period
              </span>
              <Calendar className="w-3.5 h-3.5 text-[#858C96]" />
            </div>
            <div className="space-y-1">
              {periods.map((p) => {
                const isSelected = p.id === activePeriod.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePeriodId(p.id);
                      setIsMobileRightNavOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-md text-left text-xs flex items-center justify-between border transition-colors ${
                      isSelected
                        ? 'bg-[#EAF2FB] border-[#2166B1]/30 text-[#174A8B] font-medium'
                        : 'bg-white border-[#D9DDE3] hover:bg-[#F8F9FB] text-[#171A1F]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-[#5E6672]">{p.startDate} - {p.endDate}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      p.locked ? 'bg-[#F1F3F5] text-[#5E6672]' : 'bg-[#EAF2FB] text-[#174A8B]'
                    }`}>
                      {p.locked ? 'Locked' : 'Active'}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('06_periods');
                }}
                className="w-full py-1.5 text-center text-xs text-[#174A8B] font-medium hover:underline flex items-center justify-center space-x-1"
              >
                <span>Manage Reporting Periods</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2 pt-2 border-t border-[#F1F3F5]">
            <span className="text-[11px] font-semibold text-[#858C96] uppercase tracking-wider">
              Workspace Tools
            </span>
            <div className="space-y-1.5">
              {/* Notification Center button */}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('34_reviewer_notification', 'FLOW_F');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-[#174A8B]" />
                  <span className="font-medium text-[#171A1F]">Notification Center</span>
                </div>
                {unreadNotificationsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FB3256] text-white">
                    {unreadNotificationsCount} unread
                  </span>
                ) : (
                  <span className="text-[10px] text-[#858C96]">Up to date</span>
                )}
              </button>

              {/* Sign out */}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('01_login', 'FLOW_A');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-full bg-white border border-[#E5E7EB] hover:bg-[#FFF0F3] hover:border-[#FFDCE4] text-xs text-[#5F6368] hover:text-[#FB3256] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-[#F8F9FB] border-t border-[#D9DDE3] text-center text-[10px] text-[#858C96] space-y-0.5">
          <div className="font-medium text-[#5E6672]">Tula Carbon Accounting & Assurance</div>
          <div>GHG Protocol Scopes 1, 2 & 3 · Phase 1 Assurance</div>
        </div>
      </aside>
    </>
  );
};


