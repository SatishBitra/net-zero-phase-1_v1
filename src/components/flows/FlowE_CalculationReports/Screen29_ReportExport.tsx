import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Download,
  Mail,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  History,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen29_ReportExport: React.FC = () => {
  const { navigateToScreen, showToast, addAuditLog } = useApp();

  const [downloaded, setDownloaded] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('stakeholders@zenithenergy.in');

  // Exact report export details from Screen 29 PRD specification
  const reportExportDetails = {
    title: 'GHG Inventory (Scope 1+2)',
    period: 'FY 2025–26',
    tenantName: 'Zenith Energy',
    filename: 'GHG-Inventory-FY2025-26-ZenithEnergy.pdf',
    fileSize: '2.4 MB',
    generatedDate: '20-Aug-2025 16:45 IST',
    generatedBy: 'S. Iyer',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  };

  // Report History table from Screen 29 PRD specification
  const reportHistory = [
    {
      report: 'GHG Inventory FY2025-26 (Current Snapshot)',
      generated: '20-Aug-2025 16:45',
      by: 'S. Iyer',
      status: 'Immutable Snapshot',
    },
    {
      report: 'GHG Inventory FY2024-25',
      generated: '02-May-2025',
      by: 'J. Rao',
      status: 'Archived Snapshot',
    },
  ];

  const handleDownloadPdf = () => {
    setDownloaded(true);
    showToast('Download Started', `Downloading ${reportExportDetails.filename} (${reportExportDetails.fileSize})`);

    // Audit log requirement (FR-29.04)
    addAuditLog({
      userName: 'S. Iyer',
      role: 'Reviewer',
      action: 'Downloaded Exported Report',
      previousValue: 'Snapshot Generated',
      newValue: `Downloaded: ${reportExportDetails.filename} (SHA-256: ${reportExportDetails.sha256Hash.slice(0, 12)}...)`,
      source: 'Reporting Module',
      reason: 'Statutory compliance and board disclosure pack preparation',
      status: 'Downloaded',
      lineItemId: reportExportDetails.filename,
    });
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailModalOpen(false);
    showToast('Report Dispatched', `Immutable disclosure snapshot sent to ${emailInput}.`);
  };

  return (
    <div id="screen-29-container" className="max-w-5xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Reporting' },
          { label: 'Export Report' },
        ]}
        title="Export Report"
        description="Generate and download immutable disclosure snapshots for regulatory compliance and verification."
        badge={
          <StatusBadge status="Approved" customLabel="Immutable Snapshot" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[#8A8F98] font-medium">
            /reports/export/88
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('28_report_preview', 'FLOW_E')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Preview</span>
            </button>

            <button
              onClick={() => navigateToScreen('30_verifier_login', 'FLOW_F')}
              className="enterprise-btn-primary h-9 px-3.5 flex items-center space-x-1.5 text-xs shadow-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifier Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Ready to Download Card (Section 18.1) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F3F5] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#0F6B48] flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#0F6B48] font-semibold flex items-center space-x-1 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to download</span>
              </div>
              <h2 className="text-base font-semibold text-[#17181A] file-hash mt-0.5">
                {reportExportDetails.filename}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#5F6368] font-sans">
              File size: <strong className="text-[#17181A] emission-factor font-semibold">{reportExportDetails.fileSize}</strong>
            </div>
            <div className="text-[11px] text-[#8A8F98] file-hash mt-0.5">
              SHA-256: {reportExportDetails.sha256Hash.slice(0, 16)}...
            </div>
          </div>
        </div>

        {/* Report Identity Metadata (Section 19.2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB] shadow-2xs">
            <div className="text-[#5F6368] font-sans">Report Type</div>
            <div className="font-semibold text-[#17181A] mt-0.5 font-sans">{reportExportDetails.title}</div>
          </div>
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB] shadow-2xs">
            <div className="text-[#5F6368] font-sans">Reporting Period</div>
            <div className="font-semibold text-[#17181A] mt-0.5 period-code">{reportExportDetails.period}</div>
          </div>
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB] shadow-2xs">
            <div className="text-[#5F6368] font-sans">Tenant Organization</div>
            <div className="font-semibold text-[#17181A] mt-0.5 font-sans">{reportExportDetails.tenantName}</div>
          </div>
          <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB] shadow-2xs">
            <div className="text-[#5F6368] font-sans">Timestamp</div>
            <div className="font-semibold text-[#17181A] mt-0.5 period-code text-[11px]">
              {reportExportDetails.generatedDate}
            </div>
          </div>
        </div>

        {/* Actions (Section 18.2) */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {/* Primary Action: Download PDF */}
          <button
            id="btn-download-pdf"
            type="button"
            onClick={handleDownloadPdf}
            className="enterprise-btn-primary h-9 px-6 text-xs inline-flex items-center space-x-2 shadow-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* Secondary Action: Email to stakeholders */}
          <button
            id="btn-email-stakeholders"
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="enterprise-btn-secondary h-9 px-4 text-xs inline-flex items-center space-x-2 font-semibold"
          >
            <Mail className="w-4 h-4 text-[#5F6368]" />
            <span>Email to stakeholders</span>
          </button>
        </div>
      </div>

      {/* Immutability Requirement Banner (Section 19.1 & FR-29.01 - FR-29.04) */}
      <div className="p-3.5 bg-[#6254E8]/5 border border-[#6254E8]/20 rounded-xl text-xs text-[#6254E8] flex items-center justify-between shadow-2xs font-data">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 shrink-0 text-[#6254E8]" />
          <span>
            <strong className="font-semibold text-[#17181A]">Immutability Guarantee:</strong> Exported reports are immutable snapshots and will never be overwritten. Re-running a report after underlying data changes creates a new version/snapshot.
          </span>
        </div>
        <StatusBadge status="Locked" customLabel="WORM Compliant" size="sm" />
      </div>

      {/* Report History Table (Section 19) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#6254E8]" />
            <h2 className="text-sm font-semibold text-[#17181A] font-sans">Report History</h2>
          </div>
          <span className="text-xs text-[#5F6368] font-data">
            {reportHistory.length} snapshots retained
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F4F5F6] border-b border-[#E5E7EB] text-[#5F6368]">
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Report</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Generated</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider">By</th>
              <th className="py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {reportHistory.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#FAFAFB] transition-colors">
                <td className="py-3 px-4 font-semibold text-[#17181A] font-sans">
                  {row.report}
                </td>
                <td className="py-3 px-4 text-[#5F6368] period-code">
                  {row.generated}
                </td>
                <td className="py-3 px-4 text-[#5F6368] font-data">
                  {row.by}
                </td>
                <td className="py-3 px-4 text-right">
                  <StatusBadge status="Approved" customLabel={row.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <form
            onSubmit={handleSendEmail}
            className="bg-white rounded-xl border border-[#E5E7EB] max-w-md w-full p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
              <h3 className="text-sm font-semibold text-[#17181A] font-sans">Email Report to Stakeholders</h3>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="text-xs text-[#8A8F98] hover:text-[#17181A]"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5F6368] mb-1 font-sans">
                Recipient Email Addresses:
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:border-[#7567F5] focus:outline-none font-sans"
              />
              <p className="text-[11px] text-[#8A8F98] mt-1 file-hash">
                Attached: {reportExportDetails.filename} ({reportExportDetails.fileSize})
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="enterprise-btn-secondary h-8 px-3 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="enterprise-btn-primary h-8 px-4 text-xs font-semibold"
              >
                Send Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
