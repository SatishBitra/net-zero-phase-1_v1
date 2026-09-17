import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle,
  ArrowRight,
  Calculator,
  Info,
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen11_EntryForm: React.FC = () => {
  const {
    sites,
    emissionSources,
    activePeriod,
    addActivityRecord,
    navigateToScreen,
    setSelectedRecordId,
    showToast,
    ocrPrefillData,
    setOcrPrefillData,
  } = useApp();

  // Find or default to Chennai Plant 1
  const defaultSite = sites.find((s) => s.name.includes('Chennai')) || sites[0];
  const [siteId, setSiteId] = useState(ocrPrefillData?.siteId || defaultSite?.id || 'site-chennai-1');

  const availableSources = emissionSources.filter((s) => s.siteId === siteId);
  const defaultSource = availableSources.find((s) => s.name.toLowerCase().includes('grid') || s.name.toLowerCase().includes('electricity')) || availableSources[0];

  const [sourceId, setSourceId] = useState(ocrPrefillData?.sourceId || defaultSource?.id || '');
  const [date, setDate] = useState(ocrPrefillData?.date || '2025-08-12');
  const [quantity, setQuantity] = useState<string>(ocrPrefillData?.quantity ? String(ocrPrefillData.quantity) : '48200');
  const [unit, setUnit] = useState<string>(ocrPrefillData?.unit || 'kWh');
  const [entryMethod, setEntryMethod] = useState<string>(ocrPrefillData?.entryMethod || 'Manual');
  const [notes, setNotes] = useState(ocrPrefillData?.notes || '');

  // Attached evidence in-line support
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string; uploadDate: string }>>(
    ocrPrefillData?.evidenceFile
      ? [ocrPrefillData.evidenceFile]
      : []
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync if prefill arrives
  useEffect(() => {
    if (ocrPrefillData) {
      if (ocrPrefillData.siteId) setSiteId(ocrPrefillData.siteId);
      if (ocrPrefillData.sourceId) setSourceId(ocrPrefillData.sourceId);
      if (ocrPrefillData.date) setDate(ocrPrefillData.date);
      if (ocrPrefillData.quantity) setQuantity(String(ocrPrefillData.quantity));
      if (ocrPrefillData.unit) setUnit(ocrPrefillData.unit);
      if (ocrPrefillData.entryMethod) setEntryMethod(ocrPrefillData.entryMethod);
      if (ocrPrefillData.notes) setNotes(ocrPrefillData.notes);
      if (ocrPrefillData.evidenceFile) {
        setAttachedFiles([ocrPrefillData.evidenceFile]);
      }
    }
  }, [ocrPrefillData]);

  // Selected source object
  const currentSource = availableSources.find((s) => s.id === sourceId) || availableSources[0] || defaultSource;
  const selectedSite = sites.find((s) => s.id === siteId) || defaultSite;

  // Calculation computation
  const numQuantity = parseFloat(quantity) || 0;
  const factor = currentSource ? currentSource.emissionFactor : 0.82;
  const emissions_tCO2e = (numQuantity * factor) / 1000;

  const handleSiteChange = (newSiteId: string) => {
    setSiteId(newSiteId);
    const newSources = emissionSources.filter((s) => s.siteId === newSiteId);
    if (newSources.length > 0) {
      setSourceId(newSources[0].id);
      setUnit(newSources[0].unit || 'kWh');
    }
  };

  const handleSimulatedFileUpload = () => {
    const newDoc = {
      name: 'electricity-bill-aug25.pdf',
      size: '1.2 MB',
      uploadDate: '12-Aug-2025',
    };
    setAttachedFiles((prev) => [...prev, newDoc]);
    showToast('Evidence attached', 'electricity-bill-aug25.pdf uploaded successfully.');
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (targetStatus: 'Draft' | 'Submitted') => {
    if (!currentSource || numQuantity <= 0) {
      showToast('Validation Error', 'Please enter a valid positive quantity.', 'error');
      return;
    }

    const newRecord = addActivityRecord({
      periodId: activePeriod.id,
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      sourceId: currentSource.id,
      sourceName: currentSource.name,
      scope: currentSource.category || 'Scope 2',
      date,
      quantity: numQuantity,
      unit: unit || currentSource.unit,
      emissionFactor: factor,
      factorUnit: currentSource.factorUnit || 'kg CO2e / kWh',
      factorSource: currentSource.factorSource || 'CEA CO2 Baseline Database v19 (India)',
      emissions_tCO2e,
      status: targetStatus,
      notes: notes || (entryMethod === 'AI Extracted' ? 'Extracted via OCR Review #8821. Human-confirmed.' : 'Manual entry'),
      evidenceFiles: attachedFiles.map((f, i) => ({
        id: `ev-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        uploadDate: f.uploadDate,
        uploadedBy: 'A. Kumar (Data Entry)',
        url: '#',
      })),
    });

    setSelectedRecordId(newRecord.id);
    if (ocrPrefillData) {
      setOcrPrefillData(null);
    }

    showToast(
      targetStatus === 'Draft' ? 'Draft Saved' : 'Submitted for Review',
      `Record ${newRecord.id} has been ${targetStatus === 'Draft' ? 'saved to draft' : 'submitted to reviewer queue'}.`
    );

    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  return (
    <div id="screen-11-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'New Entry' },
        ]}
        title="New Activity Data Entry"
        description="Enter operational activity measurements for GHG calculation and compliance evidence."
        actions={
          <button
            id="back-to-activity-dashboard"
            onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        }
      />

      {/* AI Pre-fill Banner if coming from Screen 18 */}
      {entryMethod === 'AI Extracted' && (
        <div className="p-3 bg-[#6254E8]/10 border border-[#6254E8]/20 rounded-xl flex items-center justify-between text-xs text-[#6254E8] font-sans">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#6254E8] shrink-0" />
            <span>
              <strong>Pre-filled from Screen 18 OCR review #8821.</strong> Human-confirmed values loaded for Chennai Plant 1.
            </span>
          </div>
          <StatusBadge status="Approved" customLabel="OCR Confirmed" size="sm" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Main Entry Details Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
              <h2 className="text-sm font-semibold text-[#17181A]">Entry Details</h2>
              <span className="text-[11px] font-data text-[#5F6368] bg-[#FAFAFB] px-2.5 py-0.5 rounded-md border border-[#E5E7EB]">
                Method: {entryMethod}
              </span>
            </div>

            {/* Site & Emission Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Site <span className="text-[#D92D20]">*</span>
                </label>
                <select
                  id="entry-site-select"
                  value={siteId}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  className="w-full px-4 py-2 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5]"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Emission source <span className="text-[#D92D20]">*</span>
                </label>
                <select
                  id="entry-source-select"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full px-4 py-2 text-xs border border-[#E5E7EB] rounded-full bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5]"
                >
                  {availableSources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Activity Date, Quantity, Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Activity date <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  id="entry-date-input"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg text-[#17181A] focus:outline-none focus:border-[#7567F5] bg-white font-data"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Quantity <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  id="entry-quantity-input"
                  type="number"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="48,200"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg font-data text-[#17181A] focus:outline-none focus:border-[#7567F5] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Unit <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  id="entry-unit-input"
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg font-data bg-[#FAFAFB] text-[#17181A] focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Entry Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Entry method
              </label>
              <div className="flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="entryMethod"
                    value="Manual"
                    checked={entryMethod === 'Manual'}
                    onChange={() => setEntryMethod('Manual')}
                    className="text-[#6254E8] focus:ring-[#6254E8]"
                  />
                  <span>Manual</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="entryMethod"
                    value="AI Extracted"
                    checked={entryMethod === 'AI Extracted'}
                    onChange={() => setEntryMethod('AI Extracted')}
                    className="text-[#6254E8] focus:ring-[#6254E8]"
                  />
                  <span>AI Extracted</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#17181A] mb-1">
                Operational Notes / Reference
              </label>
              <textarea
                id="entry-notes-textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. EB Bill Ref #TANGEDCO-2025-08 for Substation A."
                className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg text-[#17181A] focus:outline-none focus:border-[#7567F5] bg-white font-sans"
              />
            </div>
          </div>

          {/* Evidence Upload Section */}
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#17181A]">Evidence Attachment</h2>
              <button
                type="button"
                onClick={() => navigateToScreen('16_attach_evidence', 'FLOW_B')}
                className="text-xs text-[#6254E8] hover:underline flex items-center space-x-1 font-semibold"
              >
                <span>Go to Screen 16 (Full Evidence Manager)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Drag and drop area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleSimulatedFileUpload(); }}
              onClick={handleSimulatedFileUpload}
              className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                isDragOver ? 'border-[#6254E8] bg-[#6254E8]/5' : 'border-[#E5E7EB] hover:border-[#7567F5] bg-[#FAFAFB]'
              }`}
            >
              <Upload className="w-6 h-6 text-[#8A8F98] mx-auto mb-2" />
              <p className="text-xs text-[#17181A] font-semibold">
                Drag & drop file, or click to attach evidence document
              </p>
              <p className="text-[11px] text-[#5F6368] mt-1 font-data">
                Supports PDF, scanned invoice, image or spreadsheet (Max 10MB)
              </p>
            </div>

            {/* Attached file list */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-[#5F6368] uppercase tracking-wider font-data">
                  Attached Documents ({attachedFiles.length})
                </div>
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-[#6254E8]" />
                      <div>
                        <div className="font-semibold text-[#17181A]">{file.name}</div>
                        <div className="text-[10px] text-[#8A8F98] font-data">{file.size} · Uploaded {file.uploadDate}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 text-[#8A8F98] hover:text-[#B42318] transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2">
            <button
              id="btn-save-as-draft"
              type="button"
              onClick={() => handleSave('Draft')}
              className="enterprise-btn-secondary h-9 px-5 text-xs font-semibold rounded-full"
            >
              Save as Draft
            </button>

            <button
              id="btn-submit-for-review"
              type="button"
              onClick={() => handleSave('Submitted')}
              className="enterprise-btn-primary h-9 px-6 text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 rounded-full"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>

        {/* Live Calculation Preview Card (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 text-[#6254E8]">
              <Calculator className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#17181A]">Calculation Preview</h3>
            </div>

            <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB] space-y-2 text-xs font-data">
              <div className="flex justify-between text-[#5F6368]">
                <span>Activity Quantity:</span>
                <span className="text-[#17181A] font-semibold">
                  {numQuantity.toLocaleString()} {unit}
                </span>
              </div>

              <div className="flex justify-between text-[#5F6368]">
                <span>Emission Factor:</span>
                <span className="text-[#17181A] font-semibold emission-factor">
                  {factor} {currentSource?.factorUnit || 'kg CO2e / kWh'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-baseline">
                <span className="font-sans text-xs text-[#5F6368]">Computed Emissions:</span>
                <span className="text-base font-bold text-[#6254E8]">
                  {emissions_tCO2e.toFixed(3)} tCO2e
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#5F6368] space-y-1">
              <div className="font-semibold text-[#17181A]">Emission Factor Authority:</div>
              <div className="font-data">{currentSource?.factorSource || 'CEA CO2 Baseline Database v19 (India)'}</div>
              <div className="text-[#5F6368] font-data text-[11px] pt-1 formula-text">
                Formula: (Activity × EF) ÷ 1,000 = tCO2e
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2 shadow-2xs font-sans">
            <Info className="w-4 h-4 text-[#6254E8] shrink-0 mt-0.5" />
            <span className="font-data">
              All manual entries require supporting evidence (PDF invoices, meter logs) to pass independent verifier inspection in Screen 32.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
