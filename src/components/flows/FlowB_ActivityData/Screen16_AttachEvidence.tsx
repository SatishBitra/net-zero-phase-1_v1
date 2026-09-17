import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Paperclip,
  Info,
  ExternalLink,
} from 'lucide-react';

export const Screen16_AttachEvidence: React.FC = () => {
  const {
    records,
    selectedRecordId,
    navigateToScreen,
    showToast,
    attachEvidenceToRecord,
  } = useApp();

  const currentRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  const [attachedDocs, setAttachedDocs] = useState([
    {
      id: 'doc-1',
      file: 'electricity-bill-aug25.pdf',
      type: 'PDF',
      uploaded: '12-Aug-2025',
      size: '1.2 MB',
      storedIn: 'TC-ARC-002 Evidence Store',
    },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleUploadFile = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      file: `substation-meter-reading-${Date.now().toString().slice(-4)}.pdf`,
      type: 'PDF',
      uploaded: '12-Aug-2025',
      size: '840 KB',
      storedIn: 'TC-ARC-002 Evidence Store',
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
    setAttachedDocs((prev) => prev.filter((d) => d.id !== id));
    showToast('Document Removed', 'File detached from line item.');
  };

  const handleDone = () => {
    showToast('Evidence Attachment Complete', 'Documents synchronized with TC-ARC-002 evidence repository.');
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  return (
    <div id="screen-16-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span>Row #998</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Evidence</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/998/evidence</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Attach Evidence</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Link original supporting documentation to verify activity consumption for audits.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Activity Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Record Context Card */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-[#858C96] block text-[10px] uppercase">Target Record</span>
          <span className="font-mono font-medium text-[#174A8B] text-sm">Row #998 ({currentRecord?.id || 'ACT-2025-0812'})</span>
        </div>
        <div>
          <span className="text-[#858C96] block text-[10px] uppercase">Site</span>
          <span className="font-medium text-[#171A1F]">{currentRecord?.siteName || 'Chennai Plant 1'}</span>
        </div>
        <div>
          <span className="text-[#858C96] block text-[10px] uppercase">Emission Source</span>
          <span className="font-medium text-[#171A1F]">{currentRecord?.sourceName || 'Grid electricity'}</span>
        </div>
        <div>
          <span className="text-[#858C96] block text-[10px] uppercase">Activity Quantity</span>
          <span className="font-mono font-medium text-[#171A1F]">48,200 kWh</span>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 bg-white border border-[#D9DDE3] rounded space-y-4">
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
          className={`p-8 border-2 border-dashed rounded text-center cursor-pointer transition-colors ${
            dragActive ? 'border-[#174A8B] bg-[#EAF2FB]/40' : 'border-[#D9DDE3] bg-[#F8F9FB] hover:border-[#174A8B]'
          }`}
        >
          <Upload className="w-8 h-8 text-[#858C96] mx-auto mb-2" />
          <h3 className="text-sm font-medium text-[#171A1F]">
            Drag & drop file, or click to attach (PDF, image, spreadsheet)
          </h3>
          <p className="text-xs text-[#5E6672] mt-1">
            Max 10MB per document. Files are encrypted and stored in TC-ARC-002 document repository.
          </p>
          <div className="mt-3">
            <span className="px-3.5 py-1.5 bg-white border border-[#D9DDE3] rounded text-xs text-[#174A8B] font-medium shadow-2xs hover:bg-[#F8F9FB]">
              Attach file from computer
            </span>
          </div>
        </div>

        {/* Attached Evidence Table */}
        <div className="border border-[#D9DDE3] rounded overflow-hidden shadow-2xs">
          <div className="p-3 bg-[#F8F9FB] border-b border-[#D9DDE3] flex items-center justify-between">
            <h2 className="text-xs font-medium text-[#171A1F]">
              Attached Evidence ({attachedDocs.length})
            </h2>
            <button
              type="button"
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="text-xs text-[#174A8B] hover:underline flex items-center space-x-1"
            >
              <span>View in Screen 21 — Results Drill-Down</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">File</th>
                <th className="py-2.5 px-4 font-medium">Type</th>
                <th className="py-2.5 px-4 font-medium">Uploaded</th>
                <th className="py-2.5 px-4 font-medium">Size</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {attachedDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8F9FB]">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 font-medium text-[#171A1F]">
                      <FileText className="w-4 h-4 text-[#174A8B] shrink-0" />
                      <span>{doc.file}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-[#EAF2FB] text-[#174A8B] px-2 py-0.5 rounded font-mono text-[10px] font-medium">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">
                    {doc.uploaded}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#5E6672]">
                    {doc.size}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => showToast('Evidence Preview', `Viewing ${doc.file}`)}
                        className="p-1 text-[#5E6672] hover:text-[#174A8B]"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 text-[#5E6672] hover:text-[#D92D20]"
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

        {/* Build Note */}
        <div className="p-3 bg-[#EAF2FB]/30 border border-[#2166B1]/20 rounded text-xs text-[#5E6672] flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
          <span>
            <strong>Build note:</strong> Documents are stored in the <strong>TC-ARC-002 “Documents and evidence” service</strong>. This is ultimately the evidence repository that the Verifier sees in Screen 32 during assurance audits.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleUploadFile}
            className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors flex items-center space-x-1.5"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attach Another File</span>
          </button>

          <button
            id="btn-evidence-done"
            type="button"
            onClick={handleDone}
            className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
