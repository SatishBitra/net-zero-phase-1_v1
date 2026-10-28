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
      uploaded: '12-Aug-2025',
      size: '1.2 MB',
      storedIn: 'Enterprise Evidence Store',
    },
  ]);

  const [dragActive, setDragActive] = useState(false);

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
      uploaded: '12-Aug-2025',
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
        <div className="p-4 bg-[#FEF1F1] border border-[#FED2D3] rounded-xl flex items-center space-x-3 text-xs text-[#ED2024] font-data shadow-2xs">
          <Lock className="w-5 h-5 shrink-0 text-[#ED2024]" />
          <div>
            <strong className="font-semibold">Accounting Period {activePeriod.name} is Locked:</strong> Supporting evidence cannot be attached, modified, or detached for sealed accounting periods.
          </div>
        </div>
      )}

      {/* Verifier Read-Only Mode Banner */}
      {isVerifierReadOnly && (
        <div className="p-4 bg-[#01153C]/5 border border-[#01153C]/20 rounded-xl flex items-center space-x-3 text-xs text-[#01153C] font-data shadow-2xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-[#01153C]" />
          <div>
            <strong className="font-semibold">Third-Party Assurance Mode:</strong> Independent Auditors ({currentUser.name}) have read-only inspection access and cannot modify attached primary evidence.
          </div>
        </div>
      )}

      {/* Target Record Context Card */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
        <div>
          <span className="text-[#8A8F98] block text-[10px] uppercase font-data font-semibold">Target Record</span>
          <span className="activity-id font-medium text-[#01153C] text-sm">Row #998 ({currentRecord?.id || 'ACT-2025-0812'})</span>
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

      {/* Upload Box */}
      <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
        <div
          id="evidence-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleUploadFile();
          }}
          onClick={handleUploadFile}
          className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            dragActive ? 'border-[#01153C] bg-[#01153C]/5' : 'border-[#E5E7EB] bg-[#FAFAFB] hover:border-[#01153C]'
          }`}
        >
          <Upload className="w-8 h-8 text-[#8A8F98] mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#17181A]">
            Drag & drop file, or click to attach (PDF, image, spreadsheet)
          </h3>
          <p className="text-xs text-[#5F6368] mt-1 font-data">
            Max 10MB per document. Files are encrypted and stored in the secure document repository.
          </p>
          <div className="mt-3">
            <span className="enterprise-btn-secondary h-8 px-3.5 text-xs font-semibold inline-flex items-center">
              Attach file from computer
            </span>
          </div>
        </div>

        {/* Attached Evidence Table */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
          <div className="p-3 bg-[#FAFAFB] border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#17181A]">
              Attached Evidence ({attachedDocs.length})
            </h2>
            <button
              type="button"
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="text-xs text-[#01153C] hover:underline flex items-center space-x-1 font-semibold"
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
              {attachedDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FAFAFB]">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 font-semibold text-[#17181A]">
                      <FileText className="w-4 h-4 text-[#01153C] shrink-0" />
                      <span>{doc.file}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-[#01153C]/10 text-[#01153C] px-2 py-0.5 rounded-md font-data text-[10px] font-semibold border border-[#01153C]/20">
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
                        className="p-1 text-[#5F6368] hover:text-[#01153C]"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 text-[#5F6368] hover:text-[#ED2024]"
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
