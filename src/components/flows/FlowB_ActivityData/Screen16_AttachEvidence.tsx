import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Paperclip,
  Info,
  ExternalLink,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';

export const Screen16_AttachEvidence: React.FC = () => {
  const {
    records,
    selectedRecordId,
    navigateToScreen,
    showToast,
    attachEvidenceToRecord,
    activePeriod,
    currentRole,
    currentUser,
  } = useApp();

  const isPeriodLocked = Boolean(activePeriod?.locked);
  const isVerifierReadOnly = currentRole === 'VERIFIER';

  const currentRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  const [attachedDocs, setAttachedDocs] = useState([
    {
      id: 'doc-1',
      file: 'electricity-bill-aug25.pdf',
      type: 'PDF',
      uploaded: 'Today',
      size: '1.2 MB',
      storedIn: 'Enterprise Evidence Store',
    },
  ]);

  const handleUploadFile = () => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is sealed. Evidence cannot be modified.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent verifiers have read-only inspection access.', 'error');
      return;
    }
    const newDoc = {
      id: `doc-${Date.now()}`,
      file: `substation-meter-reading-${Date.now().toString().slice(-4)}.pdf`,
      type: 'PDF',
      uploaded: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      size: '840 KB',
      storedIn: 'Enterprise Evidence Store',
    };
    setAttachedDocs((prev) => [...prev, newDoc]);
    attachEvidenceToRecord(currentRecord.id, {
      name: newDoc.file,
      size: newDoc.size,
      uploadDate: newDoc.uploaded,
      url: '#',
    });
    showToast('Evidence Attached', `${newDoc.file} linked to row.`);
  };

  const handleRemoveDoc = (id: string) => {
    if (isPeriodLocked) {
      showToast('Period Locked', `Reporting Period ${activePeriod.name} is sealed. Evidence cannot be detached.`, 'error');
      return;
    }
    if (isVerifierReadOnly) {
      showToast('Auditor Read-Only', 'Independent verifiers cannot remove evidence.', 'error');
      return;
    }
    setAttachedDocs((prev) => prev.filter((d) => d.id !== id));
    showToast('Document Removed', 'File detached from line item.');
  };

  const handleDone = () => {
    showToast('Evidence Attachment Complete', 'Documents synchronized with evidence repository.');
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  return (
    <div id="screen-16-container" className="w-full space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Row #998' },
          { label: 'Evidence' },
        ]}
        title="Attach Evidence"
        actions={
          <button
            onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Activity Data</span>
          </button>
        }
      />

      {/* Period Locked Governance Banner */}
      {isPeriodLocked && (
        <div className="p-3 bg-[#FFF0F3] border border-[#FFDCE4] rounded-xl flex items-center space-x-2.5 text-xs text-[#FB3256] font-medium">
          <Lock className="w-4 h-4 shrink-0 text-[#FB3256]" />
          <span>Accounting Period {activePeriod.name} is locked. Evidence modifications are disabled.</span>
        </div>
      )}

      {/* Verifier Read-Only Mode Banner */}
      {isVerifierReadOnly && (
        <div className="p-3 bg-[#5141FF]/5 border border-[#5141FF]/20 rounded-xl flex items-center space-x-2.5 text-xs text-[#5141FF] font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#5141FF]" />
          <span>Verifier Assurance Mode: Read-only access enabled.</span>
        </div>
      )}

      {/* Target Record Context Card */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
        <div>
          <span className="text-[#8A8F98] block text-[10px] uppercase font-data font-semibold">Target Record</span>
          <span className="activity-id font-medium text-[#181B27] text-sm">Row #998 ({currentRecord?.id || 'ACT-2025-0812'})</span>
        </div>
        <div>
          <span className="text-[#8A8F98] block text-[10px] uppercase font-data font-semibold">Site</span>
          <span className="font-semibold text-[#17181A]">{currentRecord?.siteName || 'Chennai Plant 1'}</span>
        </div>
        <div>
          <span className="text-[#8A8F98] block text-[10px] uppercase font-data font-semibold">Emission Source</span>
          <span className="font-semibold text-[#17181A]">{currentRecord?.sourceName || 'Grid electricity'}</span>
        </div>
        <div>
          <span className="text-[#8A8F98] block text-[10px] uppercase font-data font-semibold">Activity Quantity</span>
          <span className="font-data font-semibold text-[#17181A]">48,200 kWh</span>
        </div>
      </div>

      {/* Recently uploaded evidence */}
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
          <div className="p-3 bg-[#FAFAFB] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-semibold text-[#17181A]">Recently uploaded documents ({attachedDocs.length})</h2>
              <p className="text-[11px] text-[#5F6368] mt-0.5">Latest files linked to this activity record.</p>
            </div>
            <button
              type="button"
              onClick={handleUploadFile}
              disabled={isPeriodLocked || isVerifierReadOnly}
              className="enterprise-btn-primary h-8 px-3.5 text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload document</span>
            </button>
            <button
              type="button"
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="text-xs text-[#5141FF] hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View in Results Drill-Down</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">File</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Type</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Uploaded</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Size</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {[...attachedDocs].reverse().map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FAFAFB]">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 font-semibold text-[#17181A]">
                      <FileText className="w-4 h-4 text-[#181B27] shrink-0" />
                      <span>{doc.file}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-[#5141FF]/10 text-[#181B27] px-2 py-0.5 rounded-md font-data text-[10px] font-semibold border border-[#5141FF]/20">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5F6368] font-data">
                    {doc.uploaded}
                  </td>
                  <td className="py-3 px-4 font-data text-[11px] text-[#5F6368]">
                    {doc.size}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => showToast('Evidence Preview', `Viewing ${doc.file}`)}
                        className="p-1 text-[#5F6368] hover:text-[#5141FF]"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 text-[#5F6368] hover:text-[#FB3256]"
                        title="Detach Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Assurance Guarantee */}
        <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2 shadow-2xs">
          <Info className="w-4 h-4 text-[#8A8F98] shrink-0 mt-0.5" />
          <span className="font-data">
            <strong>Audit Assurance Guarantee:</strong> Attached primary evidence files are cryptographically sealed with SHA-256 integrity hashes and automatically indexed in the Verifier Evidence Trace for independent auditor inspection.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleUploadFile}
            className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold inline-flex items-center space-x-1.5"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attach Another File</span>
          </button>

          <button
            id="btn-evidence-done"
            type="button"
            onClick={handleDone}
            className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
