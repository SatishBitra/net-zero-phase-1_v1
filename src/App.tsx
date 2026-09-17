import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FlowNavigator } from './components/layout/FlowNavigator';

// Flow A — Onboarding & Organisation Setup
import { Screen01_Login } from './components/flows/FlowA_Onboarding/Screen01_Login';
import { Screen02_MFA } from './components/flows/FlowA_Onboarding/Screen02_MFA';
import { Screen03_TenantSelector } from './components/flows/FlowA_Onboarding/Screen03_TenantSelector';
import { Screen04_OrgProfile } from './components/flows/FlowA_Onboarding/Screen04_OrgProfile';
import { Screen05_SitesFacilities } from './components/flows/FlowA_Onboarding/Screen05_SitesFacilities';
import { Screen06_ReportingPeriods } from './components/flows/FlowA_Onboarding/Screen06_ReportingPeriods';
import { Screen07_EmissionSources } from './components/flows/FlowA_Onboarding/Screen07_EmissionSources';
import { Screen08_UsersRoles } from './components/flows/FlowA_Onboarding/Screen08_UsersRoles';
import { Screen09_TenantSettings } from './components/flows/FlowA_Onboarding/Screen09_TenantSettings';

// Flow B — Manual Activity Data & Approval
import { Screen10_ActivityDashboard } from './components/flows/FlowB_ActivityData/Screen10_ActivityDashboard';
import { Screen11_EntryForm } from './components/flows/FlowB_ActivityData/Screen11_EntryForm';
import { Screen16_AttachEvidence } from './components/flows/FlowB_ActivityData/Screen16_AttachEvidence';
import { Screen23_SubmissionQueue } from './components/flows/FlowB_ActivityData/Screen23_SubmissionQueue';
import { Screen24_ReviewApprove } from './components/flows/FlowB_ActivityData/Screen24_ReviewApprove';
import { Screen25_ApprovalHistory } from './components/flows/FlowB_ActivityData/Screen25_ApprovalHistory';
import { Screen26_PeriodLockReview } from './components/flows/FlowB_ActivityData/Screen26_PeriodLockReview';

// Flow C — Bulk Data Import & Inline Validation
import { Screen12_ImportUpload } from './components/flows/FlowC_BulkImport/Screen12_ImportUpload';
import { Screen13_ColumnMapping } from './components/flows/FlowC_BulkImport/Screen13_ColumnMapping';
import { Screen14_ValidationResults } from './components/flows/FlowC_BulkImport/Screen14_ValidationResults';
import { Screen15_FixDetailView } from './components/flows/FlowC_BulkImport/Screen15_FixDetailView';

// Flow D — Utility Bill OCR & Verification
import { Screen17_BillUpload } from './components/flows/FlowD_BillOCR/Screen17_BillUpload';
import { Screen18_OCRReview } from './components/flows/FlowD_BillOCR/Screen18_OCRReview';
import { Screen19_ConfirmEntry } from './components/flows/FlowD_BillOCR/Screen19_ConfirmEntry';

// Flow E — Calculation Engine & Reporting
import { Screen19_RunCalculation } from './components/flows/FlowE_CalculationReports/Screen19_RunCalculation';
import { Screen20_CalculationRuns } from './components/flows/FlowE_CalculationReports/Screen20_CalculationRuns';
import { Screen21_ResultsDrillDown } from './components/flows/FlowE_CalculationReports/Screen21_ResultsDrillDown';
import { Screen22_EmissionFactors } from './components/flows/FlowE_CalculationReports/Screen22_EmissionFactors';
import { Screen27_ReportBuilder } from './components/flows/FlowE_CalculationReports/Screen27_ReportBuilder';
import { Screen28_ReportPreview } from './components/flows/FlowE_CalculationReports/Screen28_ReportPreview';
import { Screen29_ReportExport } from './components/flows/FlowE_CalculationReports/Screen29_ReportExport';

// Flow F — Verifier Evidence Trace & Forensic Audit
import { Screen30_VerifierLogin } from './components/flows/FlowF_VerifierAudit/Screen30_VerifierLogin';
import { Screen31_VerifierDashboard } from './components/flows/FlowF_VerifierAudit/Screen31_VerifierDashboard';
import { Screen32_EvidenceTraceView } from './components/flows/FlowF_VerifierAudit/Screen32_EvidenceTraceView';
import { Screen33_VerifierQuery } from './components/flows/FlowF_VerifierAudit/Screen33_VerifierQuery';
import { Screen34_NotificationCenter } from './components/flows/FlowF_VerifierAudit/Screen34_NotificationCenter';
import { Screen35_AuditTrail } from './components/flows/FlowF_VerifierAudit/Screen35_AuditTrail';

const MainAppContent: React.FC = () => {
  const { currentScreen } = useApp();
  const [flowMapOpen, setFlowMapOpen] = useState(false);

  // Authentication screens without standard shell (separate surface)
  const isAuthScreen = currentScreen === '01_login' || currentScreen === '02_mfa' || currentScreen === '30_verifier_login';

  const renderActiveScreen = () => {
    switch (currentScreen) {
      // Flow A
      case '01_login':
        return <Screen01_Login />;
      case '02_mfa':
        return <Screen02_MFA />;
      case '03_tenant_selector':
        return <Screen03_TenantSelector />;
      case '04_org_profile':
        return <Screen04_OrgProfile />;
      case '05_sites':
        return <Screen05_SitesFacilities />;
      case '06_periods':
        return <Screen06_ReportingPeriods />;
      case '07_emission_sources':
        return <Screen07_EmissionSources />;
      case '08_users_roles':
        return <Screen08_UsersRoles />;
      case '09_tenant_settings':
        return <Screen09_TenantSettings />;

      // Flow B
      case '10_activity_dashboard':
        return <Screen10_ActivityDashboard />;
      case '11_entry_form':
        return <Screen11_EntryForm />;
      case '16_attach_evidence':
        return <Screen16_AttachEvidence />;
      case '23_submission_queue':
        return <Screen23_SubmissionQueue />;
      case '24_review_approve':
        return <Screen24_ReviewApprove />;
      case '25_approval_history':
        return <Screen25_ApprovalHistory />;
      case '26_period_lock':
        return <Screen26_PeriodLockReview />;

      // Flow C
      case '12_import_upload':
        return <Screen12_ImportUpload />;
      case '13_column_mapping':
        return <Screen13_ColumnMapping />;
      case '14_import_validation':
        return <Screen14_ValidationResults />;
      case '15_fix_detail_view':
        return <Screen15_FixDetailView />;

      // Flow D
      case '17_bill_upload':
        return <Screen17_BillUpload />;
      case '18_human_review':
        return <Screen18_OCRReview />;

      // Flow E
      case '19_run_calculation':
        return <Screen19_RunCalculation />;
      case '20_results_summary':
        return <Screen20_CalculationRuns />;
      case '21_drill_down':
        return <Screen21_ResultsDrillDown />;
      case '22_factors_reference':
        return <Screen22_EmissionFactors />;
      case '27_report_builder':
        return <Screen27_ReportBuilder />;
      case '28_report_preview':
        return <Screen28_ReportPreview />;
      case '29_export_download':
        return <Screen29_ReportExport />;

      // Flow F
      case '30_verifier_login':
        return <Screen30_VerifierLogin />;
      case '31_verifier_dashboard':
        return <Screen31_VerifierDashboard />;
      case '32_evidence_trace':
        return <Screen32_EvidenceTraceView />;
      case '33_raise_query':
        return <Screen33_VerifierQuery />;
      case '34_reviewer_notification':
        return <Screen34_NotificationCenter />;
      case '35_audit_trail':
        return <Screen35_AuditTrail />;

      default:
        return <Screen10_ActivityDashboard />;
    }
  };

  if (isAuthScreen) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        {renderActiveScreen()}
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8F9FB] flex flex-col overflow-hidden">
      <Header onOpenFlowMap={() => {}} />

      <div className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 min-w-0 w-full">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
