import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Download,
  Mail,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  History,
  Lock,
  ExternalLink,
} from 'lucide-react';

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
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Reporting</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Export Report</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/reports/export/88</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Export Report</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Generate and download immutable disclosure snapshots for regulatory compliance and verification.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('28_report_preview', 'FLOW_E')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Preview</span>
            </button>

            <button
              onClick={() => navigateToScreen('30_verifier_login', 'FLOW_F')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs bg-[#174A8B] text-white rounded hover:bg-[#2166B1] transition-colors font-medium shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifier Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ready to Download Card (Section 18.1) */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F3F5] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#E8F5E9] text-[#0F6B48] flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#0F6B48] font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready to download</span>
              </div>
              <h2 className="text-base font-semibold text-[#171A1F] font-mono mt-0.5">
                {reportExportDetails.filename}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono font-medium text-[#5E6672]">
              File size: <strong className="text-[#171A1F]">{reportExportDetails.fileSize}</strong>
            </div>
            <div className="text-[11px] text-[#858C96] font-mono mt-0.5">
              SHA-256: {reportExportDetails.sha256Hash.slice(0, 16)}...
            </div>
          </div>
        </div>

        {/* Report Identity Metadata (Section 19.2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3]">
            <div className="text-[#5E6672]">Report Type</div>
            <div className="font-medium text-[#171A1F] mt-0.5">{reportExportDetails.title}</div>
          </div>
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3]">
            <div className="text-[#5E6672]">Reporting Period</div>
            <div className="font-medium text-[#171A1F] mt-0.5">{reportExportDetails.period}</div>
          </div>
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3]">
            <div className="text-[#5E6672]">Tenant Organization</div>
            <div className="font-medium text-[#171A1F] mt-0.5">{reportExportDetails.tenantName}</div>
          </div>
          <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3]">
            <div className="text-[#5E6672]">Timestamp</div>
            <div className="font-medium text-[#171A1F] mt-0.5 font-mono text-[11px]">
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
            className="px-6 py-2.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* Secondary Action: Email to stakeholders */}
          <button
            id="btn-email-stakeholders"
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors flex items-center space-x-2"
          >
            <Mail className="w-4 h-4 text-[#5E6672]" />
            <span>Email to stakeholders</span>
          </button>
        </div>
      </div>

      {/* Immutability Requirement Banner (Section 19.1 & FR-29.01 - FR-29.04) */}
      <div className="p-3.5 bg-[#EAF2FB]/60 border border-[#2166B1]/20 rounded text-xs text-[#174A8B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 shrink-0 text-[#174A8B]" />
          <span>
            <strong>Immutability Guarantee:</strong> Exported reports are immutable snapshots and will never be overwritten. Re-running a report after underlying data changes creates a new version/snapshot.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#5E6672] bg-white px-2 py-0.5 rounded border border-[#D9DDE3]">
          WORM Compliant
        </span>
      </div>

      {/* Report History Table (Section 19) */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden">
        <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#174A8B]" />
            <h2 className="text-sm font-medium text-[#171A1F]">Report History</h2>
          </div>
          <span className="text-xs text-[#5E6672] font-mono">
            {reportHistory.length} snapshots retained
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-2.5 px-4 font-medium">Report</th>
              <th className="py-2.5 px-4 font-medium">Generated</th>
              <th className="py-2.5 px-4 font-medium">By</th>
              <th className="py-2.5 px-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {reportHistory.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FB]">
                <td className="py-3 px-4 font-medium text-[#171A1F]">
                  {row.report}
                </td>
                <td className="py-3 px-4 text-[#5E6672] font-mono">
                  {row.generated}
                </td>
                <td className="py-3 px-4 text-[#5E6672]">
                  {row.by}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center space-x-1 text-[11px] text-[#0F6B48] bg-[#E8F5E9] px-2 py-0.5 rounded font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{row.status}</span>
                  </span>
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
            className="bg-white rounded-lg border border-[#D9DDE3] max-w-md w-full p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
              <h3 className="text-sm font-medium text-[#171A1F]">Email Report to Stakeholders</h3>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="text-xs text-[#858C96] hover:text-[#171A1F]"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Recipient Email Addresses:
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded focus:border-[#174A8B] focus:outline-none font-mono"
              />
              <p className="text-[11px] text-[#858C96] mt-1">
                Attached: {reportExportDetails.filename} ({reportExportDetails.fileSize})
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="px-3 py-1.5 text-xs border border-[#D9DDE3] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-[#174A8B] text-white rounded font-medium"
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
