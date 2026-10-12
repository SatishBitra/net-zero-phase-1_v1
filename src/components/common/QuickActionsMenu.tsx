import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  ChevronDown,
  ScanLine,
  PlusCircle,
  FileBarChart,
  FileSpreadsheet,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Database,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface QuickActionsMenuProps {
  variant?: 'header' | 'page' | 'mobile';
  className?: string;
  buttonLabel?: string;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  variant = 'header',
  className = '',
  buttonLabel = 'Quick Actions',
}) => {
  const { navigateToScreen, currentRole, activePeriod, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus search input if opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  interface ActionItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    screenId: string;
    flowId: 'FLOW_A' | 'FLOW_B' | 'FLOW_C' | 'FLOW_D' | 'FLOW_E' | 'FLOW_F';
    badge: string;
    badgeColor?: string;
    roles?: string[];
    priority?: boolean;
  }

  const actions: ActionItem[] = [
    {
      id: 'upload-bill',
      title: 'Upload Bill',
      description: 'AI OCR invoice scanning for electricity, fuel & water records',
      icon: ScanLine,
      screenId: '17_bill_upload',
      flowId: 'FLOW_D',
      badge: 'AI OCR',
      badgeColor: 'bg-[#EDF2FA] text-[#01153C] border-[#DCE5F5]',
      priority: true,
    },
    {
      id: 'log-emission',
      title: 'Log Emission',
      description: 'Record manual activity data with scope categorization & factors',
      icon: PlusCircle,
      screenId: '11_entry_form',
      flowId: 'FLOW_B',
      badge: 'Manual Entry',
      badgeColor: 'bg-[#EEF9F1] text-[#26783B] border-[#DDF3E3]',
      priority: true,
    },
    {
      id: 'start-report',
      title: 'Start New Report',
      description: 'Generate GHG Protocol & ISO 14064 corporate disclosures',
      icon: FileBarChart,
      screenId: '27_report_builder',
      flowId: 'FLOW_E',
      badge: 'Reporting',
      badgeColor: 'bg-[#FFF8E6] text-[#B54708] border-[#FEDF89]',
      priority: true,
    },
    {
      id: 'import-csv',
      title: 'Bulk Import CSV',
      description: 'Ingest multi-facility activity spreadsheets with auto-mapping',
      icon: FileSpreadsheet,
      screenId: '12_import_upload',
      flowId: 'FLOW_C',
      badge: 'Batch',
      badgeColor: 'bg-[#F1F3F5] text-[#5F6368] border-[#E5E7EB]',
    },
    {
      id: 'run-calc',
      title: 'Run Calculations',
      description: 'Compile deterministic tCO2e totals on approved activity data',
      icon: Calculator,
      screenId: '19_run_calc',
      flowId: 'FLOW_E',
      badge: 'Engine',
      badgeColor: 'bg-[#F4EBFF] text-[#6927DA] border-[#D8B4FE]',
    },
    {
      id: 'review-queue',
      title: 'Review Submissions',
      description: 'Review pending activity batches and verify primary evidence',
      icon: CheckCircle2,
      screenId: '24_review_approve',
      flowId: 'FLOW_B',
      badge: 'Approvals',
      badgeColor: 'bg-[#EDF2FA] text-[#01153C] border-[#DCE5F5]',
      roles: ['REVIEWER', 'TENANT_ADMIN'],
    },
    {
      id: 'trace-evidence',
      title: 'Trace Evidence',
      description: 'Auditor verification trail linking emissions to primary invoices',
      icon: ShieldCheck,
      screenId: '32_evidence_trace',
      flowId: 'FLOW_F',
      badge: 'Assurance',
      badgeColor: 'bg-[#EEF9F1] text-[#26783B] border-[#DDF3E3]',
      roles: ['VERIFIER', 'REVIEWER', 'TENANT_ADMIN'],
    },
    {
      id: 'factors-library',
      title: 'Emission Factors',
      description: 'Browse CEA Baseline, IPCC 2006, and DEFRA conversion factors',
      icon: Database,
      screenId: '22_factors_library',
      flowId: 'FLOW_E',
      badge: 'Reference',
      badgeColor: 'bg-[#F1F3F5] text-[#5F6368] border-[#E5E7EB]',
    },
  ];

  const filteredActions = actions.filter((act) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      act.title.toLowerCase().includes(q) ||
      act.description.toLowerCase().includes(q) ||
      act.badge.toLowerCase().includes(q)
    );
  });

  const handleActionClick = (action: ActionItem) => {
    setIsOpen(false);
    setSearchFilter('');
    showToast('Navigating', `Opening ${action.title}...`);
    navigateToScreen(action.screenId, action.flowId);
  };

  // Button styles depending on variant
  const buttonClasses =
    variant === 'header'
      ? 'flex items-center space-x-1.5 px-3.5 py-1.5 text-xs rounded-full bg-[#01153C] text-white hover:bg-[#02215c] transition-colors shadow-2xs font-semibold'
      : variant === 'page'
      ? 'flex items-center space-x-1.5 px-4 py-2 text-xs rounded-full bg-[#EDF2FA] text-[#01153C] border border-[#DCE5F5] hover:bg-[#DCE5F5] transition-colors shadow-2xs font-semibold'
      : 'w-full flex items-center justify-between p-2.5 rounded-lg bg-[#01153C] text-white text-xs font-semibold';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        id={`quick-actions-btn-${variant}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Jump directly to common tasks"
      >
        <div className="flex items-center space-x-1.5">
          <Zap className={`w-3.5 h-3.5 ${variant === 'header' ? 'text-[#FFD166]' : 'text-[#01153C]'}`} />
          <span>{buttonLabel}</span>
        </div>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${variant === 'header' ? 'text-white/80' : 'text-[#5F6368]'}`}
        />
      </button>

      {isOpen && (
        <div
          id="quick-actions-dropdown"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          {/* Header & Quick Search */}
          <div className="px-3.5 pt-2 pb-2.5 border-b border-[#F1F3F5]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#01153C]" />
                <span className="text-[11px] font-bold text-[#17181A] uppercase tracking-wider">
                  Quick Actions
                </span>
              </div>
              <span className="text-[10px] text-[#5F6368] font-data bg-[#F1F3F5] px-2 py-0.5 rounded-full">
                Period: {activePeriod?.name || 'Active'}
              </span>
            </div>

            {/* Quick Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search action (e.g. Bill, Emission, Report)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#01153C] focus:bg-white text-[#17181A] placeholder-[#8A8F98]"
              />
            </div>
          </div>

          {/* Action Items List */}
          <div className="max-h-80 overflow-y-auto p-1.5 space-y-1 divide-y divide-[#F8F9FA]">
            {filteredActions.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#8A8F98]">
                No quick actions found matching "{searchFilter}"
              </div>
            ) : (
              filteredActions.map((action) => {
                const IconComponent = action.icon;
                const isRoleRecommended = action.roles?.includes(currentRole);

                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleActionClick(action)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAFAFB] transition-all group flex items-start space-x-3 border border-transparent hover:border-[#E5E7EB]"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EDF2FA] group-hover:bg-[#01153C] text-[#01153C] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#17181A] group-hover:text-[#01153C]">
                          {action.title}
                        </span>
                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          {isRoleRecommended && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#EEF9F1] text-[#26783B] rounded-full border border-[#DDF3E3] font-semibold">
                              For You
                            </span>
                          )}
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full border font-medium ${
                              action.badgeColor || 'bg-[#F1F3F5] text-[#5F6368] border-[#E5E7EB]'
                            }`}
                          >
                            {action.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#5F6368] line-clamp-1 mt-0.5 font-data">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-[#8A8F98] group-hover:text-[#01153C] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Tip */}
          <div className="px-3.5 py-2 bg-[#FAFAFB] border-t border-[#F1F3F5] rounded-b-xl flex items-center justify-between text-[10px] text-[#5F6368]">
            <span>Fast navigation across Tula Carbon modules</span>
            <span className="font-mono text-[#8A8F98]">Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
