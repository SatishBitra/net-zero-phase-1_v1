import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  Tenant,
  Site,
  ReportingPeriod,
  EmissionSource,
  User,
  ActivityRecord,
  ActivityRecordStatus,
  BillOCRData,
  VerifierQuery,
  AuditTrailEntry,
  CalculationSummary,
  ScreenId,
  FlowId,
  SystemNotification,
} from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_SITES,
  INITIAL_PERIODS,
  INITIAL_EMISSION_SOURCES,
  INITIAL_USERS,
  INITIAL_ACTIVITY_RECORDS,
  SAMPLE_OCR_BILLS,
  INITIAL_VERIFIER_QUERIES,
  INITIAL_AUDIT_TRAIL,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface AppContextType {
  // Navigation & Identity
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  currentFlow: FlowId | null;
  setCurrentFlow: (flow: FlowId | null) => void;
  navigateToScreen: (screen: ScreenId, flow?: FlowId) => void;
  
  // Setup & Master Data
  sites: Site[];
  addSite: (site: Omit<Site, 'id' | 'emissionSourcesCount'>) => void;
  periods: ReportingPeriod[];
  activePeriod: ReportingPeriod;
  setActivePeriodId: (periodId: string) => void;
  addPeriod: (period: Omit<ReportingPeriod, 'id' | 'locked'>) => void;
  lockPeriod: (periodId: string) => void;
  emissionSources: EmissionSource[];
  addEmissionSource: (source: Omit<EmissionSource, 'id'>) => void;
  users: User[];
  inviteUser: (user: Omit<User, 'id' | 'status' | 'avatarInitials'>) => void;
  tenantProfile: Tenant;
  updateTenantProfile: (updates: Partial<Tenant>) => void;

  // Activity Data Operations
  records: ActivityRecord[];
  addRecord: (record: Omit<ActivityRecord, 'id' | 'createdAt' | 'createdBy' | 'emissions_tCO2e' | 'emissionFactorApplied' | 'emissionFactorUnit'>) => ActivityRecord;
  addActivityRecord: (record: any) => ActivityRecord;
  updateRecord: (id: string, updates: Partial<ActivityRecord>, reason?: string) => void;
  updateRecordStatus: (id: string, status: ActivityRecordStatus, comment?: string) => void;
  attachEvidenceToRecord: (id: string, evidence: any) => void;
  submitRecordForReview: (id: string) => void;
  approveRecord: (id: string, comment?: string) => void;
  sendBackRecord: (id: string, comment: string) => void;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;

  // Bulk Import
  importRowsPreview: any[];
  setImportRowsPreview: (rows: any[]) => void;
  importFileMeta: { name: string; size: string; rowCount: number } | null;
  setImportFileMeta: (meta: { name: string; size: string; rowCount: number } | null) => void;
  completeBulkImport: (importedRecords: ActivityRecord[]) => void;

  // OCR Pre-fill & Hooks
  ocrPrefillData: {
    siteId?: string;
    sourceId?: string;
    date?: string;
    quantity?: number;
    unit?: string;
    entryMethod?: string;
    meterNo?: string;
    billingPeriod?: string;
    confidenceUnits?: number;
    confidenceMeter?: number;
    evidenceFile?: any;
    fromOcrReview?: boolean;
    notes?: string;
  } | null;
  setOcrPrefillData: (data: any) => void;

  // Calculation Runs
  calculationRuns: Array<{
    id: string;
    started: string;
    duration: string;
    status: string;
    period: string;
    scope: string;
    total_tCO2e: number;
    scope1: number;
    scope2: number;
  }>;
  triggerCalculationRun: (period: string, scope: string) => void;

  // Bill OCR
  currentOcrBill: BillOCRData | null;
  setCurrentOcrBill: (bill: BillOCRData | null) => void;
  ocrProcessing: boolean;
  setOcrProcessing: (processing: boolean) => void;
  ocrProgressStep: number;
  runOcrExtraction: (billData?: Partial<BillOCRData>) => void;
  confirmedOcrData: BillOCRData | null;
  setConfirmedOcrData: (data: BillOCRData | null) => void;

  // Calculation & Results
  calculationSummary: CalculationSummary;
  runCalculations: () => void;
  drillDownSource: string | null;
  setDrillDownSource: (sourceName: string | null) => void;

  // Verification & Queries
  verifierQueries: VerifierQuery[];
  raiseVerifierQuery: (
    recordId: string,
    queryType: VerifierQuery['queryType'] | undefined,
    description: string,
    requiredAction?: string,
    contextOverride?: Partial<VerifierQuery>
  ) => void;
  resolveVerifierQuery: (queryId: string, response: string) => void;

  // Active Trace Context for verifier workflow
  activeTraceContext: {
    client: string;
    report: string;
    period: string;
    scope: string;
    category: string;
    site: string;
    activityRow: string;
    date: string;
    quantity: string;
    evidenceRef: string;
    verifier: string;
  };
  setActiveTraceContext: React.Dispatch<
    React.SetStateAction<{
      client: string;
      report: string;
      period: string;
      scope: string;
      category: string;
      site: string;
      activityRow: string;
      date: string;
      quantity: string;
      evidenceRef: string;
      verifier: string;
    }>
  >;

  // Notification Center
  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<SystemNotification, 'id'>) => void;

  // Audit Trail
  auditTrail: AuditTrailEntry[];
  addAuditLog: (entry: Omit<AuditTrailEntry, 'id' | 'timestamp'>) => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Mobile navigation drawer states (left screens menu and right context/nav menu)
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  isMobileRightNavOpen: boolean;
  setIsMobileRightNavOpen: (open: boolean) => void;
  toggleMobileRightNav: () => void;

  // Search & Global Filter persistence
  activeFilterSite: string;
  setActiveFilterSite: (siteId: string) => void;
  activeFilterStatus: string;
  setActiveFilterStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tula_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [currentTenant, setCurrentTenantState] = useState<Tenant>(() => {
    return tenants[0];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('TENANT_ADMIN');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('10_activity_dashboard');
  const [currentFlow, setCurrentFlow] = useState<FlowId | null>(null);

  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem('tula_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });

  const [periods, setPeriods] = useState<ReportingPeriod[]>(() => {
    const saved = localStorage.getItem('tula_periods');
    return saved ? JSON.parse(saved) : INITIAL_PERIODS;
  });

  const [activePeriodId, setActivePeriodId] = useState<string>('fy-2025-26');

  const [emissionSources, setEmissionSources] = useState<EmissionSource[]>(() => {
    const saved = localStorage.getItem('tula_emission_sources');
    return saved ? JSON.parse(saved) : INITIAL_EMISSION_SOURCES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tula_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [records, setRecords] = useState<ActivityRecord[]>(() => {
    const saved = localStorage.getItem('tula_records');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_RECORDS;
  });

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('ACT-2025-0812');

  // Bulk Import state
  const [importRowsPreview, setImportRowsPreview] = useState<any[]>([]);
  const [importFileMeta, setImportFileMeta] = useState<{ name: string; size: string; rowCount: number } | null>(null);

  // Bill OCR state
  const [currentOcrBill, setCurrentOcrBill] = useState<BillOCRData | null>(SAMPLE_OCR_BILLS[0]);
  const [ocrProcessing, setOcrProcessing] = useState<boolean>(false);
  const [ocrProgressStep, setOcrProgressStep] = useState<number>(0);
  const [confirmedOcrData, setConfirmedOcrData] = useState<BillOCRData | null>(null);
  const [ocrPrefillData, setOcrPrefillData] = useState<{
    siteId?: string;
    sourceId?: string;
    date?: string;
    quantity?: number;
    unit?: string;
    entryMethod?: string;
    meterNo?: string;
    billingPeriod?: string;
    confidenceUnits?: number;
    confidenceMeter?: number;
    evidenceFile?: any;
    fromOcrReview?: boolean;
    notes?: string;
  } | null>(null);

  // Calculation Runs state matching Screen 19 specification
  const [calculationRuns, setCalculationRuns] = useState<
    Array<{
      id: string;
      started: string;
      duration: string;
      status: string;
      period: string;
      scope: string;
      total_tCO2e: number;
      scope1: number;
      scope2: number;
    }>
  >([
    {
      id: '#RUN-2214',
      started: '20-Aug-2025 09:14',
      duration: '2m 40s',
      status: 'Completed',
      period: 'FY 2025-26',
      scope: 'Scope 1 + Scope 2',
      total_tCO2e: 28270,
      scope1: 18420,
      scope2: 9850,
    },
    {
      id: '#RUN-2210',
      started: '14-Aug-2025 16:30',
      duration: '2m 15s',
      status: 'Completed',
      period: 'FY 2025-26',
      scope: 'Scope 1 + Scope 2',
      total_tCO2e: 27950,
      scope1: 18200,
      scope2: 9750,
    },
  ]);

  // Verification & Queries
  const [verifierQueries, setVerifierQueries] = useState<VerifierQuery[]>(() => {
    const saved = localStorage.getItem('tula_queries');
    return saved ? JSON.parse(saved) : INITIAL_VERIFIER_QUERIES;
  });

  // Audit Trail
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>(() => {
    const saved = localStorage.getItem('tula_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_TRAIL;
  });

  // Notifications Center (Screen 34)
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('tula_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Active Trace Context for Verifier Workflow (Screen 32 -> Screen 33)
  const [activeTraceContext, setActiveTraceContext] = useState({
    client: 'Zenith Energy Services',
    report: 'GHG Inventory',
    period: 'FY 2025-26',
    scope: 'Scope 2',
    category: 'Grid electricity',
    site: 'Chennai Plant 1',
    activityRow: 'Activity Data Row #1042',
    date: '12-Aug-2025',
    quantity: '48,200 kWh',
    evidenceRef: 'electricity-bill-aug25.pdf',
    verifier: 'M. Singh',
  });

  // Drill down filter
  const [drillDownSource, setDrillDownSource] = useState<string | null>(null);

  // Filter persistence
  const [activeFilterSite, setActiveFilterSite] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast messages (notification popups removed per user specification)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Mobile navigation menu drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      if (!prev) setIsMobileRightNavOpen(false);
      return !prev;
    });
  };
  const [isMobileRightNavOpen, setIsMobileRightNavOpen] = useState(false);
  const toggleMobileRightNav = () => {
    setIsMobileRightNavOpen((prev) => {
      if (!prev) setIsMobileMenuOpen(false);
      return !prev;
    });
  };

  // Persist important data
  useEffect(() => {
    localStorage.setItem('tula_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('tula_sites', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('tula_periods', JSON.stringify(periods));
  }, [periods]);

  useEffect(() => {
    localStorage.setItem('tula_emission_sources', JSON.stringify(emissionSources));
  }, [emissionSources]);

  useEffect(() => {
    localStorage.setItem('tula_queries', JSON.stringify(verifierQueries));
  }, [verifierQueries]);

  useEffect(() => {
    localStorage.setItem('tula_audit', JSON.stringify(auditTrail));
  }, [auditTrail]);

  useEffect(() => {
    localStorage.setItem('tula_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Notifications Updated', 'All items marked as read.');
  };

  const addNotification = (notif: Omit<SystemNotification, 'id'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Notification popups removed per user request (desktop & mobile)
  const showToast = (_title: string, _description?: string, _type: ToastMessage['type'] = 'success') => {
    // Keep internal logging without rendering UI pop-ups on screen
    setToasts([]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateToScreen = (screen: ScreenId, flow?: FlowId) => {
    setCurrentScreen(screen);
    if (flow) {
      setCurrentFlow(flow);
    }
    // Automatically close mobile menus when navigating on mobile devices
    setIsMobileMenuOpen(false);
    setIsMobileRightNavOpen(false);
  };

  const activePeriod = useMemo(() => {
    return periods.find((p) => p.id === activePeriodId) || periods[0];
  }, [periods, activePeriodId]);

  const addAuditLog = (entry: Omit<AuditTrailEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditTrailEntry = {
      ...entry,
      id: 'AUD-' + (auditTrail.length + 1).toString().padStart(3, '0'),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditTrail((prev) => [newLog, ...prev]);
  };

  const updateTenantProfile = (updates: Partial<Tenant>) => {
    const updated = { ...currentTenant, ...updates };
    setCurrentTenantState(updated);
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    addAuditLog({
      userName: 'J. Rao',
      role: 'Tenant Admin',
      action: 'Updated Organisation Profile',
      previousValue: 'Organisation settings',
      newValue: 'Consolidation approach: ' + (updates.consolidationApproach || currentTenant.consolidationApproach),
      source: 'Organisation Profile Setup',
      reason: 'Boundary configuration updated for reporting',
      status: 'Updated',
    });
    showToast('Organisation Profile saved', 'Updated legal boundary and reporting parameters.');
  };

  const setCurrentTenant = (tenant: Tenant) => {
    setCurrentTenantState(tenant);
    setCurrentRole(tenant.userRole);
    showToast(`Switched organisation context to ${tenant.name}`);
  };

  const addSite = (siteData: Omit<Site, 'id' | 'emissionSourcesCount'>) => {
    const id = 'site-' + siteData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newSite: Site = {
      ...siteData,
      id,
      emissionSourcesCount: 0,
    };
    setSites((prev) => [...prev, newSite]);
    addAuditLog({
      userName: currentRole === 'TENANT_ADMIN' ? 'J. Rao' : 'A. Kumar',
      role: currentRole,
      action: 'Created Site',
      previousValue: 'None',
      newValue: newSite.name + ' (' + newSite.location + ')',
      source: 'Sites & Facilities',
      reason: 'Operational boundary addition',
      status: 'Active',
    });
    showToast(`Site created: ${newSite.name}`, 'You can now configure emission sources for this facility.');
  };

  const addPeriod = (periodData: Omit<ReportingPeriod, 'id' | 'locked'>) => {
    const id = 'period-' + periodData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newPeriod: ReportingPeriod = {
      ...periodData,
      id,
      locked: false,
    };
    setPeriods((prev) => [newPeriod, ...prev]);
    addAuditLog({
      userName: 'J. Rao',
      role: 'Tenant Admin',
      action: 'Created Reporting Period',
      previousValue: 'None',
      newValue: newPeriod.name + ' (' + newPeriod.startDate + ' to ' + newPeriod.endDate + ')',
      source: 'Reporting Periods',
      reason: 'Fiscal year setup',
      status: 'Created',
    });
    showToast('Reporting period created', `${newPeriod.name} is now open for data entry.`);
  };

  const lockPeriod = (periodId: string) => {
    const targetPeriod = periods.find((p) => p.id === periodId);
    if (!targetPeriod) return;

    setPeriods((prev) =>
      prev.map((p) =>
        p.id === periodId
          ? {
              ...p,
              status: 'Locked',
              locked: true,
              lockedAt: new Date().toISOString(),
              lockedBy: 'J. Rao (Tenant Admin)',
            }
          : p
      )
    );

    // Lock all records belonging to this period
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status: r.status === 'Approved' ? 'Locked' : r.status,
      }))
    );

    addAuditLog({
      userName: 'J. Rao',
      role: 'Tenant Admin',
      action: 'Period Lock Enforced',
      previousValue: `Period ${targetPeriod.name} Status: In Progress`,
      newValue: `Period ${targetPeriod.name} Status: Locked`,
      source: 'Reporting Periods Governance',
      reason: 'Audit verification finalized. Data is now read-only and immutable.',
      status: 'Locked',
    });

    showToast(`Reporting Period ${targetPeriod.name} Locked`, 'All associated records are now frozen and read-only for compliance.');
  };

  const addEmissionSource = (sourceData: Omit<EmissionSource, 'id'>) => {
    const id = 'src-' + Math.random().toString(36).substr(2, 6);
    const newSource: EmissionSource = {
      ...sourceData,
      id,
    };
    setEmissionSources((prev) => [...prev, newSource]);

    // Update emission source count on site
    setSites((prev) =>
      prev.map((s) =>
        s.id === newSource.siteId ? { ...s, emissionSourcesCount: s.emissionSourcesCount + 1 } : s
      )
    );

    addAuditLog({
      userName: 'J. Rao',
      role: 'Tenant Admin',
      action: 'Configured Emission Source',
      previousValue: 'None',
      newValue: `${newSource.name} (${newSource.category}, ${newSource.method}, ${newSource.unit})`,
      source: `Emission Sources (${newSource.siteName})`,
      reason: 'Standard emission boundary configuration',
      status: 'Active',
    });

    showToast('Emission source added', `${newSource.name} is now enabled for ${newSource.siteName}.`);
  };

  const inviteUser = (userData: Omit<User, 'id' | 'status' | 'avatarInitials'>) => {
    const id = 'user-' + Math.random().toString(36).substr(2, 6);
    const initials = userData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const newUser: User = {
      ...userData,
      id,
      status: 'Invited',
      avatarInitials: initials || 'U',
    };

    setUsers((prev) => [...prev, newUser]);

    addAuditLog({
      userName: 'J. Rao',
      role: 'Tenant Admin',
      action: 'Invited User',
      previousValue: 'None',
      newValue: `${newUser.name} (${newUser.email}) - Role: ${newUser.role}`,
      source: 'Users & Roles',
      reason: 'Granting access permissions',
      status: 'Invited',
    });

    showToast('Invitation sent', `An invitation link has been dispatched to ${newUser.email}.`);
  };

  const addRecord = (
    recordData: Omit<
      ActivityRecord,
      'id' | 'createdAt' | 'createdBy' | 'emissions_tCO2e' | 'emissionFactorApplied' | 'emissionFactorUnit'
    >
  ): ActivityRecord => {
    // Find emission factor
    const src = emissionSources.find((s) => s.id === recordData.sourceId);
    const factor = src?.emissionFactor || 0.82;
    const factorUnit = src?.factorUnit || 'kg CO2e / unit';
    const emissions_tCO2e = Number(((recordData.quantity * factor) / 1000).toFixed(4));

    const id = 'ACT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newRecord: ActivityRecord = {
      ...recordData,
      id,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdBy: currentRole === 'DATA_ENTRY' ? 'A. Kumar (Data Entry)' : 'J. Rao (Tenant Admin)',
      emissions_tCO2e,
      emissionFactorApplied: factor,
      emissionFactorUnit: factorUnit,
    };

    setRecords((prev) => [newRecord, ...prev]);

    addAuditLog({
      userName: newRecord.createdBy,
      role: currentRole,
      action: 'Created Activity Record',
      previousValue: 'None',
      newValue: `${newRecord.sourceName}: ${newRecord.quantity.toLocaleString()} ${newRecord.unit} (${newRecord.siteName})`,
      source: newRecord.sourceName,
      reason: 'Manual activity data entry',
      status: newRecord.status,
      lineItemId: newRecord.id,
    });

    showToast('Activity record saved', `${newRecord.id} recorded with status ${newRecord.status}.`);
    return newRecord;
  };

  const updateRecord = (id: string, updates: Partial<ActivityRecord>, reason?: string) => {
    const existing = records.find((r) => r.id === id);
    if (!existing) return;

    let updatedEmissions = existing.emissions_tCO2e;
    let factor = existing.emissionFactorApplied;

    if (updates.quantity !== undefined || updates.sourceId !== undefined) {
      const q = updates.quantity !== undefined ? updates.quantity : existing.quantity;
      const sId = updates.sourceId !== undefined ? updates.sourceId : existing.sourceId;
      const src = emissionSources.find((s) => s.id === sId);
      if (src) {
        factor = src.emissionFactor;
      }
      updatedEmissions = Number(((q * factor) / 1000).toFixed(4));
    }

    const updated: ActivityRecord = {
      ...existing,
      ...updates,
      emissions_tCO2e: updatedEmissions,
      emissionFactorApplied: factor,
    };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));

    addAuditLog({
      userName: currentRole === 'DATA_ENTRY' ? 'A. Kumar' : 'S. Iyer',
      role: currentRole,
      action: 'Updated Activity Record',
      previousValue: `${existing.quantity} ${existing.unit} (Status: ${existing.status})`,
      newValue: `${updated.quantity} ${updated.unit} (Status: ${updated.status})`,
      source: updated.sourceName,
      reason: reason || 'Correction made in record detail view',
      status: updated.status,
      lineItemId: id,
    });

    showToast('Record updated', `${id} successfully modified.`);
  };

  const submitRecordForReview = (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;

    const updated: ActivityRecord = {
      ...target,
      status: 'Submitted',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      validationErrors: undefined,
    };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));

    addAuditLog({
      userName: 'A. Kumar',
      role: 'Data Entry',
      action: 'Submitted Activity Record for Review',
      previousValue: `Status: ${target.status}`,
      newValue: 'Status: Submitted',
      source: target.sourceName,
      reason: 'Handed off to Reviewer for approval verification',
      status: 'Submitted',
      lineItemId: id,
    });

    showToast('Submitted for Review', `Record ${id} submitted to Reviewer queue.`);
  };

  const approveRecord = (id: string, comment?: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;

    const updated: ActivityRecord = {
      ...target,
      status: 'Approved',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      approvedBy: 'S. Iyer (Reviewer)',
      reviewerComment: comment || 'Verified against supporting evidence documentation.',
    };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));

    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer / Approver',
      action: 'Approved Activity Record',
      previousValue: `Status: ${target.status}`,
      newValue: 'Status: Approved',
      source: target.sourceName,
      reason: comment || 'Supporting evidence matches activity quantity.',
      status: 'Approved',
      lineItemId: id,
    });

    showToast('Record Approved', `${id} approved and ready for period calculations.`);
  };

  const sendBackRecord = (id: string, comment: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;

    const updated: ActivityRecord = {
      ...target,
      status: 'Sent Back',
      reviewerComment: comment,
      validationErrors: [comment],
    };

    setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));

    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer / Approver',
      action: 'Sent Back Activity Record to Data Entry',
      previousValue: `Status: ${target.status}`,
      newValue: 'Status: Sent Back',
      source: target.sourceName,
      reason: comment,
      status: 'Sent Back',
      lineItemId: id,
    });

    showToast('Record sent back', `Item returned to Data Entry with correction note.`, 'warning');
  };

  const completeBulkImport = (importedRecords: ActivityRecord[]) => {
    setRecords((prev) => [...importedRecords, ...prev]);

    addAuditLog({
      userName: 'A. Kumar',
      role: 'Data Entry',
      action: 'Bulk Import CSV Completed',
      previousValue: 'None',
      newValue: `Imported ${importedRecords.length} records`,
      source: 'Activity Data Bulk Import',
      reason: 'Batch activity data ingest via mapped CSV',
      status: 'Submitted',
    });

    showToast(`Bulk Import Complete`, `Successfully ingested ${importedRecords.length} activity records.`);
  };

  // Run OCR extraction simulation with high visual fidelity and progressive step states
  const runOcrExtraction = (customData?: Partial<BillOCRData>) => {
    setOcrProcessing(true);
    setOcrProgressStep(1);

    setTimeout(() => {
      setOcrProgressStep(2); // Bill date & account no
    }, 700);

    setTimeout(() => {
      setOcrProgressStep(3); // Meter reading & consumption kWh
    }, 1400);

    setTimeout(() => {
      setOcrProgressStep(4); // Verification complete
      const baseBill = customData ? { ...SAMPLE_OCR_BILLS[0], ...customData } : SAMPLE_OCR_BILLS[0];
      setCurrentOcrBill(baseBill);
      setOcrProcessing(false);
      navigateToScreen('18_human_review', 'FLOW_D');
      showToast('AI Extraction Complete', 'Review extracted key-value pairs against invoice scan.');
    }, 2200);
  };

  // Calculations Engine
  const calculationSummary: CalculationSummary = useMemo(() => {
    let scope1 = 0;
    let scope2 = 0;
    let scope3 = 0;
    const siteMap: Record<string, { siteName: string; tCO2e: number; s1: number; s2: number; s3: number; count: number }> = {};
    const sourceMap: Record<string, { category: 'Scope 1' | 'Scope 2' | 'Scope 3'; tCO2e: number }> = {};

    records.forEach((rec) => {
      // Include Approved, Submitted, Locked, or Draft records in total
      const em = rec.emissions_tCO2e || 0;
      if (rec.scope === 'Scope 1') scope1 += em;
      else if (rec.scope === 'Scope 2') scope2 += em;
      else if (rec.scope === 'Scope 3') scope3 += em;

      // Site grouping
      if (!siteMap[rec.siteId]) {
        siteMap[rec.siteId] = { siteName: rec.siteName, tCO2e: 0, s1: 0, s2: 0, s3: 0, count: 0 };
      }
      siteMap[rec.siteId].tCO2e += em;
      siteMap[rec.siteId].count += 1;
      if (rec.scope === 'Scope 1') siteMap[rec.siteId].s1 += em;
      if (rec.scope === 'Scope 2') siteMap[rec.siteId].s2 += em;
      if (rec.scope === 'Scope 3') siteMap[rec.siteId].s3 += em;

      // Source grouping
      if (!sourceMap[rec.sourceName]) {
        sourceMap[rec.sourceName] = { category: rec.scope, tCO2e: 0 };
      }
      sourceMap[rec.sourceName].tCO2e += em;
    });

    const total_tCO2e = Number((scope1 + scope2 + scope3).toFixed(3));

    const siteBreakdown = Object.keys(siteMap).map((sId) => ({
      siteId: sId,
      siteName: siteMap[sId].siteName,
      tCO2e: Number(siteMap[sId].tCO2e.toFixed(3)),
      scope1: Number(siteMap[sId].s1.toFixed(3)),
      scope2: Number(siteMap[sId].s2.toFixed(3)),
      scope3: Number(siteMap[sId].s3.toFixed(3)),
      recordCount: siteMap[sId].count,
    }));

    const sourceBreakdown = Object.keys(sourceMap).map((srcName) => ({
      sourceName: srcName,
      category: sourceMap[srcName].category,
      tCO2e: Number(sourceMap[srcName].tCO2e.toFixed(3)),
      percentage: total_tCO2e > 0 ? Number(((sourceMap[srcName].tCO2e / total_tCO2e) * 100).toFixed(1)) : 0,
    }));

    return {
      reportingPeriod: activePeriod.name,
      calculatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      total_tCO2e,
      scope1: Number(scope1.toFixed(3)),
      scope2_location: Number(scope2.toFixed(3)),
      scope3: Number(scope3.toFixed(3)),
      totalRecordsCalculated: records.length,
      status: 'Ready',
      siteBreakdown,
      sourceBreakdown,
    };
  }, [records, activePeriod]);

  const runCalculations = () => {
    addAuditLog({
      userName: currentRole === 'REVIEWER' ? 'S. Iyer' : 'J. Rao',
      role: currentRole,
      action: 'Executed GHG Calculation Run',
      previousValue: 'Previous calculation state',
      newValue: `Total: ${calculationSummary.total_tCO2e} tCO2e across ${records.length} records`,
      source: 'Calculations Engine',
      reason: 'Batch calculation for reporting period ' + activePeriod.name,
      status: 'Calculated',
    });

    showToast('Calculations Executed', `Computed ${calculationSummary.total_tCO2e} tCO2e across Scope 1 & Scope 2.`);
  };

  const updateRecordStatus = (id: string, status: ActivityRecordStatus, comment?: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(comment ? { reviewerComment: comment } : {}),
            }
          : r
      )
    );
  };

  const attachEvidenceToRecord = (id: string, file: any) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              evidenceFiles: [...(r.evidenceFiles || []), file],
            }
          : r
      )
    );
    addAuditLog({
      userName: currentRole === 'TENANT_ADMIN' ? 'J. Rao' : 'A. Kumar',
      role: currentRole,
      action: 'Attached Evidence Document',
      previousValue: 'None',
      newValue: file.name,
      source: `Activity Data (${id})`,
      reason: 'Assurance audit trail compliance',
      status: 'Attached',
      lineItemId: id,
    });
  };

  const triggerCalculationRun = (periodName: string, scopeName: string) => {
    const newRunId = `#RUN-${Math.floor(2200 + Math.random() * 100)}`;
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' });
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const startedStr = `${day}-${month}-${year} ${hours}:${mins}`;

    const newRun = {
      id: newRunId,
      started: startedStr,
      duration: '2m 40s',
      status: 'Completed',
      period: periodName || 'FY 2025-26',
      scope: scopeName || 'Scope 1 + Scope 2',
      total_tCO2e: 28270,
      scope1: 18420,
      scope2: 9850,
    };
    setCalculationRuns((prev) => [newRun, ...prev]);
    runCalculations();
  };

  // Verifier Queries
  const raiseVerifierQuery = (
    recordId: string,
    queryType: VerifierQuery['queryType'] | undefined,
    description: string,
    requiredAction?: string,
    contextOverride?: Partial<VerifierQuery>
  ) => {
    const rec = records.find((r) => r.id === recordId);
    const summary = contextOverride?.lineItemSummary || (rec
      ? `${rec.sourceName} — ${rec.quantity.toLocaleString()} ${rec.unit} at ${rec.siteName}`
      : `Record ${recordId}`);

    const newQueryId = 'VQ-' + new Date().getFullYear() + '-' + (verifierQueries.length + 1).toString().padStart(3, '0');

    const newQuery: VerifierQuery = {
      id: newQueryId,
      recordId,
      lineItemSummary: summary,
      verifierName: 'M. Singh (Lead Verifier, VVB)',
      raisedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      queryType: queryType || 'Meter Anomaly',
      description,
      requiredAction: requiredAction || 'Confirm meter reading coverage and provide verification response.',
      status: 'Open',
      client: contextOverride?.client || 'Zenith Energy Services',
      report: contextOverride?.report || 'GHG Inventory',
      period: contextOverride?.period || 'FY 2025-26',
      scope: contextOverride?.scope || 'Scope 2',
      sourceName: contextOverride?.sourceName || 'Grid electricity',
      siteName: contextOverride?.siteName || 'Chennai Plant 1',
      evidenceFile: contextOverride?.evidenceFile || 'electricity-bill-aug25.pdf',
      quantity: contextOverride?.quantity || '48,200 kWh',
    };

    setVerifierQueries((prev) => [newQuery, ...prev]);

    // PRD Screen 34 requirement: Query events automatically generate notification
    addNotification({
      type: 'verifier_query',
      title: 'Verifier M. Singh raised a query on Grid electricity entry',
      description: `Query ${newQueryId}: ${description.slice(0, 80)}${description.length > 80 ? '…' : ''}`,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
      isRead: false,
      targetScreen: '32_evidence_trace',
      targetFlow: 'FLOW_F',
      entityRef: `${newQuery.siteName} — ${newQuery.sourceName}, ${newQuery.date} entry`,
      metadata: { queryId: newQueryId, recordId },
    });

    // PRD Screen 35 requirement: Immutable audit trail entry
    addAuditLog({
      userName: 'M. Singh',
      role: 'Verifier / VVB',
      action: 'Raised Query',
      previousValue: '—',
      newValue: `Query: ${description.slice(0, 60)}${description.length > 60 ? '…' : ''}`,
      source: contextOverride?.activityRow || `Activity Data Row #1042`,
      reason: requiredAction || 'Assurance query on evidence document: electricity-bill-aug25.pdf',
      status: 'Query Raised',
      lineItemId: recordId,
    });

    showToast('Query Dispatched', `Query ${newQuery.id} recorded and notification delivered to reviewer.`);
  };

  const resolveVerifierQuery = (queryId: string, response: string) => {
    setVerifierQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? {
              ...q,
              status: 'Resolved',
              reviewerResponse: response,
              resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : q
      )
    );

    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer / Approver',
      action: 'Resolved Verifier Query',
      previousValue: 'Status: Open',
      newValue: 'Status: Resolved',
      source: 'Verification & Queries',
      reason: response,
      status: 'Resolved',
    });

    showToast('Query Resolved', `Explanation and evidence response recorded for ${queryId}.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentTenant,
        setCurrentTenant,
        tenants,
        currentScreen,
        setCurrentScreen,
        currentFlow,
        setCurrentFlow,
        navigateToScreen,
        sites,
        addSite,
        periods,
        activePeriod,
        setActivePeriodId,
        addPeriod,
        lockPeriod,
        emissionSources,
        addEmissionSource,
        users,
        inviteUser,
        tenantProfile: currentTenant,
        updateTenantProfile,
        records,
        addRecord,
        addActivityRecord: addRecord,
        updateRecord,
        updateRecordStatus,
        attachEvidenceToRecord,
        submitRecordForReview,
        approveRecord,
        sendBackRecord,
        selectedRecordId,
        setSelectedRecordId,
        importRowsPreview,
        setImportRowsPreview,
        importFileMeta,
        setImportFileMeta,
        completeBulkImport,
        ocrPrefillData,
        setOcrPrefillData,
        calculationRuns,
        triggerCalculationRun,
        currentOcrBill,
        setCurrentOcrBill,
        ocrProcessing,
        setOcrProcessing,
        ocrProgressStep,
        runOcrExtraction,
        confirmedOcrData,
        setConfirmedOcrData,
        calculationSummary,
        runCalculations,
        drillDownSource,
        setDrillDownSource,
        verifierQueries,
        raiseVerifierQuery,
        resolveVerifierQuery,
        activeTraceContext,
        setActiveTraceContext,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        auditTrail,
        addAuditLog,
        toasts,
        showToast,
        dismissToast,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        isMobileRightNavOpen,
        setIsMobileRightNavOpen,
        toggleMobileRightNav,
        activeFilterSite,
        setActiveFilterSite,
        activeFilterStatus,
        setActiveFilterStatus,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
