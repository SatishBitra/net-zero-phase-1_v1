import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  BookmarkCheck,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

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
    {
      fileColumn: 'Plant Location',
      mapsTo: '-- Do not map --',
      sampleValue: 'Chennai Plant 1 - Block A',
      matched: false,
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
    if (mappings.some((row) => row.mapsTo === '-- Do not map --')) {
      showToast('Mapping Needed', 'Map or exclude every unresolved column before continuing.', 'error');
      return;
    }
    showToast('Column Mapping Saved', 'Validating 1,842 rows against system schema and emission factors...');
    navigateToScreen('14_import_validation', 'FLOW_C');
  };

  return (
    <div id="screen-13-container" className="w-full space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Import' },
          { label: 'Map Columns' },
        ]}
        title="Map Columns"
        actions={
          <button
            onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Ingestion</span>
          </button>
        }
      />

      {/* 4-Step Progress */}
      <div className="flex items-center space-x-2 text-xs font-data bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          1. Upload File
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#5141FF]/10 text-[#181B27] font-bold border border-[#5141FF]/20">
          2. Map Columns
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          3. Validate
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          4. Confirm
        </span>
      </div>

      {/* Auto-suggest badge & tenant persistence note */}
      <div className="p-3.5 bg-[#5141FF]/5 border border-[#5141FF]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[#181B27]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Auto-suggested 5 of 6 column mappings. One column needs your attention.
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[#5F6368] text-[11px] font-data">
          <BookmarkCheck className="w-3.5 h-3.5 text-[#181B27]" />
          <span>Remembered for {currentTenant.name}</span>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Column in your file</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Maps to</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Sample value</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {mappings.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#FAFAFB]">
                <td className="py-3 px-4 font-semibold text-[#17181A]">
                  <span className="font-data bg-[#FAFAFB] px-2.5 py-1 rounded-md text-[11px] border border-[#E5E7EB]">
                    {row.fileColumn}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={row.mapsTo}
                    onChange={(e) => handleFieldMapChange(idx, e.target.value)}
                    className="w-full max-w-xs px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#5141FF]"
                  >
                    {targetSystemFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 font-data text-[#5F6368] text-[11px]">
                  {row.sampleValue}
                </td>
                <td className="py-3 px-4">
                  {row.mapsTo === '-- Do not map --' ? (
                    <StatusBadge status="Pending" customLabel="Mapping" size="sm" />
                  ) : (
                    <StatusBadge status="Approved" customLabel="Mapped" size="sm" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mapping Configuration Tip */}
      <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2 shadow-2xs">
        <Info className="w-4 h-4 text-[#8A8F98] shrink-0 mt-0.5" />
        <span className="font-data">
          <strong>What to do:</strong> Choose the matching field for each column. If a column is not needed, select “Do not map” to confirm you have reviewed it.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
          className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
        >
          Back
        </button>

        <button
          id="btn-validate-import"
          type="button"
          onClick={handleValidate}
          className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
        >
          <span>Continue to validation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
