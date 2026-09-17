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
    <div id="screen-13-container" className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Import' },
          { label: 'Map Columns' },
        ]}
        title="Map Columns"
        description="Confirm how column headers in your file correspond to required Tula activity fields."
        actions={
          <button
            onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Upload</span>
          </button>
        }
      />

      {/* 4-Step Progress */}
      <div className="flex items-center space-x-2 text-xs font-data bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB]">
          1. Upload File
        </span>
        <span className="text-[#8A8F98]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[#6254E8]/10 text-[#6254E8] font-bold border border-[#6254E8]/20">
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
      <div className="p-3.5 bg-[#6254E8]/5 border border-[#6254E8]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[#6254E8]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Auto-suggested 5 of 5 column mappings from file headers and past import history.
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[#5F6368] text-[11px] font-data">
          <BookmarkCheck className="w-3.5 h-3.5 text-[#6254E8]" />
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
                    className="w-full max-w-xs px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A] focus:outline-none focus:border-[#7567F5]"
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
                  <StatusBadge status="Approved" customLabel="Mapped" size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Build Note */}
      <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#5F6368] flex items-start space-x-2 shadow-2xs">
        <Info className="w-4 h-4 text-[#8A8F98] shrink-0 mt-0.5" />
        <span className="font-data">
          <strong>Build note:</strong> Mapping configurations are saved per tenant. Next time files with these column headers are uploaded, columns will be matched automatically.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigateToScreen('12_import_upload', 'FLOW_C')}
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
          <span>Validate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
