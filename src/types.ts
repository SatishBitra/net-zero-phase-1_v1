export type UserRole = 'TENANT_ADMIN' | 'DATA_ENTRY' | 'REVIEWER' | 'VERIFIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  siteScope: string[]; // ['all'] or site IDs
  status: 'Active' | 'Invited' | 'Suspended';
  avatarInitials: string;
}

export interface Tenant {
  id: string;
  name: string;
  userRole: UserRole;
  legalEntityName: string;
  registrationNo: string;
  primaryCountry: string;
  reportingCurrency: string;
  fiscalYearStart: string;
  industrySector: string;
  consolidationApproach: 'Operational control' | 'Financial control' | 'Equity share';
}

export interface Site {
  id: string;
  name: string;
  location: string;
  state: string;
  country: string;
  type: 'Manufacturing' | 'Storage' | 'Office' | 'Distribution';
  emissionSourcesCount: number;
  status: 'Active' | 'Draft';
  manager: string;
}

export interface ReportingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Locked';
  locked: boolean;
  lockedAt?: string;
  lockedBy?: string;
}

export interface EmissionSource {
  id: string;
  siteId: string;
  siteName: string;
  name: string;
  category: 'Scope 1' | 'Scope 2' | 'Scope 3';
  method: string;
  unit: string;
  status: 'Active' | 'Draft' | 'Archived';
  emissionFactor: number;
  factorUnit: string;
  factorSource: string;
}

export interface EvidenceFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  type: string;
  url?: string;
  previewData?: {
    accountNo?: string;
    invoiceNo?: string;
    billingPeriod?: string;
    supplier?: string;
    meterNo?: string;
  };
}

export type ActivityRecordStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Review' 
  | 'Approved' 
  | 'Sent Back' 
  | 'Locked' 
  | 'Error';

export interface ActivityRecord {
  id: string;
  date: string;
  siteId: string;
  siteName: string;
  sourceId: string;
  sourceName: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  quantity: number;
  unit: string;
  status: ActivityRecordStatus;
  evidenceFiles: EvidenceFile[];
  validationErrors?: string[];
  createdBy: string;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  reviewerComment?: string;
  emissions_tCO2e: number;
  emissionFactorApplied: number;
  emissionFactorUnit: string;
  ocrExtracted?: boolean;
}

export interface BillOCRData {
  supplier: string;
  consumerNo: string;
  billDate: string;
  billingPeriod: string;
  consumptionKwh: number;
  billedAmount: string;
  meterNo: string;
  tariff: string;
  confidence: number;
  siteSuggested: string;
  rawInvoiceUrl?: string;
}

export interface VerifierQuery {
  id: string;
  recordId: string;
  lineItemSummary: string;
  verifierName: string;
  raisedAt: string;
  queryType?: 'Missing Evidence' | 'Factor Discrepancy' | 'Meter Anomaly' | 'Boundary Question';
  description: string;
  requiredAction?: string;
  status: 'Open' | 'Answered' | 'Closed' | 'Resolved';
  reviewerResponse?: string;
  resolvedAt?: string;
  date?: string;
  siteName?: string;
  sourceName?: string;
  evidenceFile?: string;
  scope?: string;
  quantity?: string;
  client?: string;
  report?: string;
  period?: string;
  activityRow?: string;
}

export type NotificationType =
  | 'verifier_query'
  | 'approval'
  | 'rejection'
  | 'send_back'
  | 'import_success'
  | 'import_failure'
  | 'period_lock'
  | 'factor_update'
  | 'general';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  isRead: boolean;
  targetScreen: ScreenId;
  targetFlow: FlowId;
  entityRef?: string;
  metadata?: Record<string, any>;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  previousValue: string;
  newValue: string;
  source: string;
  reason: string;
  status: string;
  lineItemId?: string;
}

export interface CalculationSummary {
  reportingPeriod: string;
  calculatedAt: string;
  total_tCO2e: number;
  scope1: number;
  scope2_location: number;
  scope3: number;
  totalRecordsCalculated: number;
  status: 'Ready' | 'Outdated' | 'Calculating';
  siteBreakdown: Array<{
    siteId: string;
    siteName: string;
    tCO2e: number;
    scope1: number;
    scope2: number;
    scope3: number;
    recordCount: number;
  }>;
  sourceBreakdown: Array<{
    sourceName: string;
    category: 'Scope 1' | 'Scope 2' | 'Scope 3';
    tCO2e: number;
    percentage: number;
  }>;
}

export type ScreenId = 
  | '01_login'
  | '02_mfa'
  | '03_tenant_selector'
  | '04_org_profile'
  | '05_sites'
  | '06_periods'
  | '07_emission_sources'
  | '08_users_roles'
  | '09_tenant_settings'
  | '10_activity_dashboard'
  | '11_entry_form'
  | '12_import_upload'
  | '13_column_mapping'
  | '14_import_validation'
  | '15_fix_detail_view'
  | '16_attach_evidence'
  | '17_bill_upload'
  | '18_human_review'
  | '19_run_calculation'
  | '20_results_summary'
  | '21_drill_down'
  | '22_factors_reference'
  | '23_submission_queue'
  | '24_review_approve'
  | '25_approval_history'
  | '26_period_lock'
  | '27_report_builder'
  | '28_report_preview'
  | '29_export_download'
  | '30_verifier_login'
  | '31_verifier_dashboard'
  | '32_evidence_trace'
  | '33_raise_query'
  | '34_reviewer_notification'
  | '35_audit_trail';

export type FlowId = 'FLOW_A' | 'FLOW_B' | 'FLOW_C' | 'FLOW_D' | 'FLOW_E' | 'FLOW_F';
