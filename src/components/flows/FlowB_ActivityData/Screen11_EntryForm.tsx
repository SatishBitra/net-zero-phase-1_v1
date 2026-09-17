import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FilePlus,
  Paperclip,
  CheckCircle,
  ArrowRight,
  Calculator,
  Info,
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

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
    // Clear prefill after commit
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
      {/* Header & Breadcrumb */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">New Entry</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/new</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">New Activity Data Entry</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Enter operational activity measurements for GHG calculation and compliance evidence.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              id="back-to-activity-dashboard"
              onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* AI Pre-fill Banner if coming from Screen 18 */}
        {entryMethod === 'AI Extracted' && (
          <div className="mt-3 p-3 bg-[#EAF2FB] border border-[#2166B1]/30 rounded flex items-center justify-between text-xs text-[#174A8B]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#174A8B] shrink-0" />
              <span>
                <strong>Pre-filled from Screen 18 OCR review #8821.</strong> Human-confirmed values loaded for Chennai Plant 1.
              </span>
            </div>
            <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#2166B1]/20 font-medium">
              OCR Confirmed
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Entry Details Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white border border-[#D9DDE3] rounded space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
              <h2 className="text-sm font-medium text-[#171A1F]">Entry Details</h2>
              <span className="text-[11px] font-mono text-[#5E6672] bg-[#F1F3F5] px-2 py-0.5 rounded">
                Method: {entryMethod}
              </span>
            </div>

            {/* Site & Emission Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Site <span className="text-[#D92D20]">*</span>
                </label>
                <select
                  id="entry-site-select"
                  value={siteId}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Emission source <span className="text-[#D92D20]">*</span>
                </label>
                <select
                  id="entry-source-select"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
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
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Activity date <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  id="entry-date-input"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
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
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded font-mono text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Unit <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  id="entry-unit-input"
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded font-mono bg-[#F8F9FB] text-[#171A1F] focus:outline-none"
                />
              </div>
            </div>

            {/* Entry Method Selector */}
            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
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
                    className="text-[#174A8B]"
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
                    className="text-[#174A8B]"
                  />
                  <span>AI Extracted</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-[#5E6672] mb-1">
                Operational Notes / Reference
              </label>
              <textarea
                id="entry-notes-textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. EB Bill Ref #TANGEDCO-2025-08 for Substation A."
                className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
              />
            </div>
          </div>

          {/* Evidence Upload Section */}
          <div className="p-5 bg-white border border-[#D9DDE3] rounded space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#171A1F]">Evidence Attachment</h2>
              <button
                type="button"
                onClick={() => navigateToScreen('16_attach_evidence', 'FLOW_B')}
                className="text-xs text-[#174A8B] hover:underline flex items-center space-x-1"
              >
                <span>Go to Screen 16 (Full Evidence Manager)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Drag and drop area matching Screen 11 spec */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleSimulatedFileUpload(); }}
              onClick={handleSimulatedFileUpload}
              className={`p-6 border-2 border-dashed rounded text-center cursor-pointer transition-colors ${
                isDragOver ? 'border-[#174A8B] bg-[#EAF2FB]' : 'border-[#D9DDE3] hover:border-[#174A8B]/60 bg-[#F8F9FB]'
              }`}
            >
              <Upload className="w-6 h-6 text-[#858C96] mx-auto mb-2" />
              <p className="text-xs text-[#171A1F] font-medium">
                Drag & drop file, or click to attach evidence document
              </p>
              <p className="text-[11px] text-[#5E6672] mt-1">
                Supports PDF, scanned invoice, image or spreadsheet (Max 10MB)
              </p>
            </div>

            {/* Attached file list */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-medium text-[#5E6672] uppercase tracking-wider">
                  Attached Documents ({attachedFiles.length})
                </div>
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-[#174A8B]" />
                      <div>
                        <div className="font-medium text-[#171A1F]">{file.name}</div>
                        <div className="text-[10px] text-[#858C96]">{file.size} · Uploaded {file.uploadDate}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 text-[#858C96] hover:text-[#D92D20] transition-colors"
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
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors shadow-xs text-center"
            >
              Save as Draft
            </button>

            <button
              id="btn-submit-for-review"
              type="button"
              onClick={() => handleSave('Submitted')}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>

        {/* Live Calculation Preview Card (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-[#D9DDE3] rounded space-y-4">
            <div className="flex items-center space-x-2 text-[#174A8B]">
              <Calculator className="w-4 h-4" />
              <h3 className="text-sm font-medium text-[#171A1F]">Calculation Preview</h3>
            </div>

            <div className="p-3 bg-[#F8F9FB] rounded border border-[#D9DDE3] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#5E6672]">
                <span>Activity Quantity:</span>
                <span className="text-[#171A1F] font-medium">
                  {numQuantity.toLocaleString()} {unit}
                </span>
              </div>

              <div className="flex justify-between text-[#5E6672]">
                <span>Emission Factor:</span>
                <span className="text-[#171A1F] font-medium">
                  {factor} {currentSource?.factorUnit || 'kg CO2e / kWh'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#D9DDE3] flex justify-between items-baseline">
                <span className="font-sans text-xs text-[#5E6672]">Computed Emissions:</span>
                <span className="text-base font-normal text-[#174A8B]">
                  {emissions_tCO2e.toFixed(3)} tCO2e
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#5E6672] space-y-1">
              <div className="font-medium text-[#171A1F]">Emission Factor Authority:</div>
              <div>{currentSource?.factorSource || 'CEA CO2 Baseline Database v19 (India)'}</div>
              <div className="text-[#858C96] pt-1">
                Formula: (Activity × EF) ÷ 1,000 = tCO2e
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#EAF2FB]/50 border border-[#2166B1]/20 rounded text-xs text-[#5E6672] flex items-start space-x-2">
            <Info className="w-4 h-4 text-[#174A8B] shrink-0 mt-0.5" />
            <span>
              All manual entries require supporting evidence (PDF invoices, meter logs) to pass independent verifier inspection in Screen 32.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
