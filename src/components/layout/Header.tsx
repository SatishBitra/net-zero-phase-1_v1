import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import zeLogo from '../../assets/ze.png';
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
import { QuickActionsMenu } from '../common/QuickActionsMenu';

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
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#ECEDEF] px-3 sm:px-4 md:px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(20,20,20,0.03)]">
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
              className="p-2 -ml-1 text-[#17181A] hover:text-[#01153C] hover:bg-[#EDF2FA] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#01153C]/20"
              aria-label={isMobileMenuOpen ? "Close left navigation menu" : "Open left navigation menu"}
              title="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: Centered Brand Logo */}
          <div
            onClick={() => navigateToScreen('10_activity_dashboard')}
            className="flex items-center space-x-2 cursor-pointer select-none group"
          >
            <img
              src={zeLogo}
              alt="Zenith Energy ZE Logo"
              className="h-8 w-8 object-contain rounded-md shadow-2xs shrink-0"
            />
            <span className="text-[14px] font-bold tracking-tight text-[#01153C] font-sans">
              Tula Carbon
            </span>
          </div>

          {/* Right: Right Side Nav Bar Menu Toggle Button */}
          <div className="flex items-center w-12 justify-end">
            <button
              id="btn-mobile-right-menu"
              type="button"
              onClick={toggleMobileRightNav}
              className="p-2 -mr-1 text-[#17181A] hover:text-[#01153C] hover:bg-[#EDF2FA] rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-[#01153C]/20"
              aria-label={isMobileRightNavOpen ? "Close side nav menu" : "Open side nav menu"}
              title="Open side nav bar menu"
            >
              {isMobileRightNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <PanelRight className="w-5 h-5" />
              )}
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ED2024] rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP HEADER (hidden md:flex): Left Controls + Right Controls */}
        {/* ============================================================ */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Left: Brand + Tenant Selector + Reporting Period */}
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
            {/* Brand Logo */}
            <div
              id="header-brand-logo"
              onClick={() => navigateToScreen('10_activity_dashboard')}
              className="flex items-center space-x-2.5 cursor-pointer select-none group shrink-0"
            >
              <div className="flex items-center justify-center shrink-0">
                <img
                  src={zeLogo}
                  alt="Zenith Energy ZE Logo"
                  className="h-9 w-9 object-contain rounded-lg shadow-2xs group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[15px] font-bold tracking-tight text-[#01153C] font-sans">
                  TULA CARBON
                </span>
              </div>
            </div>

            <div className="h-5 w-[1px] bg-[#ECEDEF] shrink-0" />

            {/* Tenant Selector (Screen 03 Trigger) */}
            <div className="relative min-w-0">
              <button
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs text-[#17181A] hover:bg-[#FAFAFB] rounded-full border border-[#E5E7EB] hover:border-[#D5D8DD] transition-colors max-w-[200px]"
                title="Switch Tenant Organization"
              >
                <Building2 className="w-3.5 h-3.5 text-[#5F6368] shrink-0" />
                <span className="font-medium truncate">{currentTenant.name}</span>
                <ChevronDown className="w-3 h-3 text-[#8A8F98] shrink-0" />
              </button>

              {tenantDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-[#F1F3F5] text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider">
                    SELECT ORGANISATION CONTEXT
                  </div>
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTenant(t);
                        setTenantDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAFAFB] ${
                        t.id === currentTenant.id ? 'bg-[#EDF2FA] text-[#01153C] font-medium' : 'text-[#17181A]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{t.name}</div>
                        <div className="text-[11px] text-[#5F6368] font-data">{t.legalEntityName}</div>
                      </div>
                      {t.id === currentTenant.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#01153C]" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#F1F3F5] p-1.5">
                    <button
                      onClick={() => {
                        setTenantDropdownOpen(false);
                        navigateToScreen('03_tenant_selector');
                      }}
                      className="w-full text-center py-1 text-xs text-[#01153C] font-semibold hover:underline"
                    >
                      View Tenant Directory →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reporting Period Selector */}
            <div className="relative shrink-0">
              <button
                onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs text-[#5F6368] hover:bg-[#FAFAFB] rounded-full border border-[#E5E7EB] hover:border-[#D5D8DD] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#5F6368]" />
                <span className="font-medium text-[#17181A]">{activePeriod.name}</span>
                {activePeriod.locked ? (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#F1F3F5] text-[#59616B] rounded-full border border-[#E5E7EB] font-semibold">
                    Locked
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#EEF9F1] text-[#26783B] rounded-full border border-[#DDF3E3] font-semibold">
                    Active
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-[#8A8F98]" />
              </button>

              {periodDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-[#F1F3F5] text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider">
                    REPORTING PERIOD
                  </div>
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePeriodId(p.id);
                        setPeriodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAFAFB] ${
                        p.id === activePeriod.id ? 'bg-[#EDF2FA] text-[#01153C] font-medium' : 'text-[#17181A]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[11px] text-[#5F6368] font-mono">
                          {p.startDate} to {p.endDate}
                        </div>
                      </div>
                      {p.locked && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#F1F3F5] text-[#8A8F98] rounded-full">
                          Locked
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#F1F3F5] p-1.5">
                    <button
                      onClick={() => {
                        setPeriodDropdownOpen(false);
                        navigateToScreen('06_periods');
                      }}
                      className="w-full text-center py-1 text-xs text-[#01153C] font-semibold hover:underline"
                    >
                      Manage Reporting Periods →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Actions, Factor Helper, Role Switcher, Direct Notification Center, User */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* Quick Actions Menu */}
            <QuickActionsMenu variant="header" />

            {/* Emission Factor Helper Button */}
            <button
              id="btn-header-factor-helper"
              type="button"
              onClick={() => openFactorHelper()}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-full bg-white border border-[#E5E7EB] hover:border-[#01153C]/40 hover:bg-[#FAFAFB] text-[#17181A] transition-colors shadow-2xs font-semibold"
              title="Search official IPCC, IEA, and CEA Emission Factors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#01153C]" />
              <span>Factor Helper</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#EDF2FA] text-[#01153C] rounded-full font-bold">
                IPCC/IEA
              </span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-full bg-white border border-[#E5E7EB] hover:border-[#D5D8DD] hover:bg-[#FAFAFB] transition-colors shadow-2xs"
                title="Switch active user role"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#01153C] shrink-0" />
                <span className="text-[11px] text-[#5F6368]">Role:</span>
                <span className="font-semibold text-[#17181A]">
                  {roles.find((r) => r.role === currentRole)?.shortLabel || currentRole}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8A8F98] shrink-0" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-[#F1F3F5] text-[11px] text-[#5F6368]">
                    <span className="font-semibold text-[#17181A]">SWITCH ACTIVE ROLE PERSPECTIVE</span>
                    <p className="text-[10px] text-[#8A8F98] mt-0.5 font-data">
                      Experience carbon accounting workflows across operational personas.
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => handleRoleSelect(r.role)}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-[#FAFAFB] transition-colors ${
                        currentRole === r.role ? 'bg-[#EDF2FA] border-l-3 border-[#01153C]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#17181A]">{r.label}</span>
                        {currentRole === r.role && (
                          <span className="text-[10px] text-[#01153C] font-semibold">Active</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#5F6368] font-data mt-0.5">{r.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications: Direct Nav to Screen 34 */}
            <button
              id="btn-nav-notifications"
              onClick={() => navigateToScreen('34_reviewer_notification', 'FLOW_F')}
              className="p-2 text-[#5F6368] hover:text-[#17181A] hover:bg-[#EDF2FA] rounded-lg transition-colors relative"
              title="Notification Center"
              aria-label="Notification Center"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ED2024] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Component: Avatar + Name + Chevron per Section 9 */}
            <div
              onClick={() => navigateToScreen('01_login', 'FLOW_A')}
              className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-[#FAFAFB] cursor-pointer transition-colors border border-transparent hover:border-[#E5E7EB]"
              title="Account Settings / Log out"
            >
              <div className="w-8 h-8 rounded-full bg-[#EDF2FA] text-[#01153C] font-semibold text-xs flex items-center justify-center shrink-0 border border-[#DCE5F5]">
                {getUserInitials()}
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <span className="text-xs font-semibold text-[#17181A]">{getUserName()}</span>
                <ChevronDown className="w-3 h-3 text-[#8A8F98]" />
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
              <span className="text-[10px] text-[#01153C] font-semibold bg-[#EDF2FA] px-1.5 py-0.5 rounded">
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
                  <div className="w-7 h-7 rounded-md bg-[#EDF2FA] text-[#01153C] flex items-center justify-center shrink-0">
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
                className="w-full p-2.5 rounded-lg border border-[#DCE5F5] bg-[#EDF2FA]/60 hover:bg-[#EDF2FA] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#01153C] text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#17181A]">Factor Helper</div>
                    <div className="text-[10px] text-[#01153C] font-semibold">IPCC AR6 & IEA 2024 Lookup</div>
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ED2024] text-white">
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
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-full bg-white border border-[#E5E7EB] hover:bg-[#FEF1F1] hover:border-[#FED2D3] text-xs text-[#5F6368] hover:text-[#ED2024] transition-colors"
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


