import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Table,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  BookmarkCheck,
} from 'lucide-react';

interface MappingItem {
  fileColumn: string;
  mapsTo: string;
  sampleValue: string;
  matched: boolean;
}

export const Screen13_ColumnMapping: React.FC = () => {
  const { navigateToScreen, showToast, currentTenant } = useApp();

  const [mappings, setMappings] = useState<MappingItem[]>([
    {
      fileColumn: 'Facility',
      mapsTo: 'Site',
      sampleValue: 'Chennai Plant 1',
      matched: true,
    },
    {
      fileColumn: 'Meter Reading Date',
      mapsTo: 'Activity date',
      sampleValue: '12/08/2025',
      matched: true,
    },
    {
      fileColumn: 'Units Consumed',
      mapsTo: 'Quantity',
      sampleValue: '48200',
      matched: true,
    },
    {
      fileColumn: 'UOM',
      mapsTo: 'Unit',
      sampleValue: 'kWh',
      matched: true,
    },
    {
      fileColumn: 'Source Type',
      mapsTo: 'Emission source',
      sampleValue: 'Grid electricity',
      matched: true,
    },
  ]);

  const targetSystemFields = [
    'Site',
    'Activity date',
    'Quantity',
    'Unit',
    'Emission source',
    'Operational Notes',
    '-- Do not map --',
  ];

  const handleFieldMapChange = (index: number, newTarget: string) => {
    const updated = [...mappings];
    updated[index].mapsTo = newTarget;
    setMappings(updated);
  };

  const handleValidate = () => {
    showToast('Column Mapping Saved', 'Validating 1,842 rows against system schema and emission factors...');
    navigateToScreen('14_import_validation', 'FLOW_C');
  };

  return (
    <div id="screen-13-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Hierarchy */}
      <div className="pb-3 border-b border-[#D9DDE3]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#5E6672] mb-1">
              <span>Activity Data</span>
              <span>›</span>
              <span className="text-[#174A8B] font-semibold">Import</span>
              <span className="text-[#858C96]">·</span>
              <span className="text-[#858C96]">/activity-data/import/map</span>
            </div>
            <h1 className="text-xl font-normal text-[#171A1F]">Map Columns</h1>
            <p className="text-xs text-[#5E6672] mt-0.5">
              Confirm how column headers in your file correspond to required Tula activity fields.
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-[#5E6672] bg-white border border-[#D9DDE3] rounded hover:bg-[#F8F9FB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Upload</span>
            </button>
          </div>
        </div>

        {/* 4-Step Progress */}
        <div className="mt-4 flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            1. Upload File
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#EAF2FB] text-[#174A8B] font-medium border border-[#2166B1]/20">
            2. Map Columns
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            3. Validate
          </span>
          <span className="text-[#858C96]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#F1F3F5] text-[#5E6672]">
            4. Confirm
          </span>
        </div>
      </div>

      {/* Auto-suggest badge & tenant persistence note */}
      <div className="p-3.5 bg-[#EAF2FB]/60 border border-[#2166B1]/20 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[#174A8B]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            Auto-suggested 5 of 5 column mappings from file headers and past import history.
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[#5E6672] text-[11px]">
          <BookmarkCheck className="w-3.5 h-3.5 text-[#0F6B48]" />
          <span>Remembered for {currentTenant.name}</span>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="bg-white border border-[#D9DDE3] rounded overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
              <th className="py-2.5 px-4 font-medium">Column in your file</th>
              <th className="py-2.5 px-4 font-medium">Maps to</th>
              <th className="py-2.5 px-4 font-medium">Sample value</th>
              <th className="py-2.5 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {mappings.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FB]">
                <td className="py-3 px-4 font-medium text-[#171A1F]">
                  <span className="font-mono bg-[#F1F3F5] px-2 py-0.5 rounded text-[11px]">
                    {row.fileColumn}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={row.mapsTo}
                    onChange={(e) => handleFieldMapChange(idx, e.target.value)}
                    className="w-full max-w-xs px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded bg-white text-[#171A1F] focus:outline-none focus:border-[#174A8B]"
                  >
                    {targetSystemFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 font-mono text-[#5E6672] text-[11px]">
                  {row.sampleValue}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center space-x-1 text-[#0F6B48] bg-[#E8F5E9] px-2 py-0.5 rounded text-[10px] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mapped</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Build Note */}
      <div className="p-3 bg-[#F8F9FB] border border-[#D9DDE3] rounded text-xs text-[#5E6672] flex items-start space-x-2">
        <Info className="w-4 h-4 text-[#858C96] shrink-0 mt-0.5" />
        <span>
          <strong>Build note:</strong> Mapping configurations are saved per tenant. Next time files with these column headers are uploaded, columns will be matched automatically.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
          className="px-4 py-2 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs font-medium text-[#171A1F] rounded transition-colors"
        >
          Back
        </button>

        <button
          id="btn-validate-import"
          type="button"
          onClick={handleValidate}
          className="px-5 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <span>Validate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
