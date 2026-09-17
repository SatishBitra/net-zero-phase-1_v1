import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { EmissionSource } from '../../../types';
import {
  Zap,
  Plus,
  Filter,
  Check,
  ArrowRight,
  X,
  Building,
  Info,
} from 'lucide-react';

export const Screen07_EmissionSources: React.FC = () => {
  const { emissionSources, sites, addEmissionSource, navigateToScreen } = useApp();

  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'site-chennai-1');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add Source Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [category, setCategory] = useState<EmissionSource['category']>('Scope 1');
  const [method, setMethod] = useState('Fuel combustion');
  const [unit, setUnit] = useState('Litres');
  const [emissionFactor, setEmissionFactor] = useState(2.68);
  const [factorUnit, setFactorUnit] = useState('kg CO2e / Litre');
  const [factorSource, setFactorSource] = useState('DEFRA / IPCC Stationary Combustion Guidelines');
  const [status, setStatus] = useState<EmissionSource['status']>('Active');

  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  const siteSources = emissionSources.filter((s) => s.siteId === selectedSiteId);
  const filteredSources = siteSources.filter(
    (s) => categoryFilter === 'all' || s.category === categoryFilter
  );

  // Synchronize unit & factor when method changes
  const handleCategoryMethodChange = (newCategory: EmissionSource['category'], newMethod: string) => {
    setCategory(newCategory);
    setMethod(newMethod);

    if (newCategory === 'Scope 2') {
      setMethod('Location-based');
      setUnit('kWh');
      setEmissionFactor(0.82);
      setFactorUnit('kg CO2e / kWh');
      setFactorSource('CEA CO2 Baseline Database v19 (India)');
    } else if (newMethod === 'GWP-based') {
      setUnit('kg');
      setEmissionFactor(2088.0);
      setFactorUnit('kg CO2e / kg');
      setFactorSource('IPCC Fifth Assessment Report (AR5) GWP-100');
    } else {
      setMethod('Fuel combustion');
      setUnit('Litres');
      setEmissionFactor(2.68);
      setFactorUnit('kg CO2e / Litre');
      setFactorSource('DEFRA / IPCC Stationary Combustion');
    }
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName) return;

    addEmissionSource({
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      name: sourceName,
      category,
      method,
      unit,
      status,
      emissionFactor,
      factorUnit,
      factorSource,
    });

    setIsDrawerOpen(false);
    setSourceName('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Flow Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#5E6672] mb-1">
            <span>Configuration</span>
            <span>•</span>
            <span className="text-[#174A8B] font-medium">Emission Sources</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Emission Sources</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Configure emission sources at each site. This determines which input fields and units are available in Data Entry.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="mt-3 sm:mt-0 px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Emission Source</span>
        </button>
      </div>

      {/* Site Selector Bar & Filter */}
      <div className="p-3.5 bg-white border border-[#D9DDE3] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-medium text-[#5E6672] shrink-0 flex items-center space-x-1.5">
            <Building className="w-3.5 h-3.5 text-[#858C96]" />
            <span>Target Site:</span>
          </label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-[#F8F9FB] text-[#171A1F] font-medium"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.type} — {site.location})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-white text-[#5E6672]"
          >
            <option value="all">All Scopes</option>
            <option value="Scope 1">Scope 1 (Direct)</option>
            <option value="Scope 2">Scope 2 (Indirect Electricity)</option>
            <option value="Scope 3">Scope 3 (Value Chain)</option>
          </select>

          <span className="text-xs text-[#858C96] font-mono">
            {filteredSources.length} configured sources
          </span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Source Name</th>
                <th className="py-2.5 px-4 font-medium">GHG Scope</th>
                <th className="py-2.5 px-4 font-medium">Calculation Method</th>
                <th className="py-2.5 px-4 font-medium">Standard Unit</th>
                <th className="py-2.5 px-4 font-medium">Default Emission Factor</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#171A1F]">{source.name}</div>
                    <div className="text-[10px] text-[#858C96]">{source.factorSource}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        source.category === 'Scope 1'
                          ? 'bg-[#FEF0EF] text-[#B42318]'
                          : source.category === 'Scope 2'
                          ? 'bg-[#EAF2FB] text-[#174A8B]'
                          : 'bg-[#F1F3F5] text-[#5E6672]'
                      }`}
                    >
                      {source.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">{source.method}</td>
                  <td className="py-3 px-4 font-mono text-[#171A1F] font-medium">{source.unit}</td>
                  <td className="py-3 px-4 text-[#5E6672]">
                    <span className="font-mono text-[#171A1F]">{source.emissionFactor}</span>{' '}
                    <span className="text-[11px] text-[#858C96]">{source.factorUnit}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        source.status === 'Active'
                          ? 'bg-[#EAF2FB] text-[#174A8B]'
                          : 'bg-[#F1F3F5] text-[#5E6672]'
                      }`}
                    >
                      {source.status === 'Active' ? '● Active' : '○ Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] text-[#858C96]">Active in Data Entry</span>
                  </td>
                </tr>
              ))}

              {filteredSources.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#858C96]">
                    No emission sources configured for {selectedSite.name} under current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progression to Step 6 */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg flex items-center justify-between text-xs">
        <div className="text-[#5E6672]">
          Sources configured. Proceed to invite users and assign operational roles.
        </div>
        <button
          onClick={() => navigateToScreen('08_users_roles', 'FLOW_A')}
          className="px-4 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <span>Continue to Users & Roles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add Source Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#D9DDE3] animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between bg-[#F8F9FB]">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">Add Emission Source</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#858C96] hover:text-[#171A1F] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">Target Facility</label>
                <div className="p-2 bg-[#F8F9FB] rounded border border-[#D9DDE3] text-xs font-medium text-[#171A1F]">
                  {selectedSite.name} ({selectedSite.location})
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Source Name <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Natural gas boiler, Rooftop solar, Forklift fleet"
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">GHG Scope</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryMethodChange(e.target.value as any, method)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
                  >
                    <option value="Scope 1">Scope 1 (Direct combustion / fugitive)</option>
                    <option value="Scope 2">Scope 2 (Indirect electricity)</option>
                    <option value="Scope 3">Scope 3 (Value chain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">Calculation Method</label>
                  <select
                    value={method}
                    onChange={(e) => handleCategoryMethodChange(category, e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
                  >
                    {category === 'Scope 2' ? (
                      <>
                        <option value="Location-based">Location-based</option>
                        <option value="Market-based">Market-based</option>
                      </>
                    ) : (
                      <>
                        <option value="Fuel combustion">Fuel combustion</option>
                        <option value="GWP-based">GWP-based (Refrigerants)</option>
                        <option value="Mass balance">Mass balance</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">Required Activity Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">Emission Factor Value</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={emissionFactor}
                    onChange={(e) => setEmissionFactor(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">Factor Database Source</label>
                <input
                  type="text"
                  value={factorSource}
                  onChange={(e) => setFactorSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
                >
                  <option value="Active">Active (Available for logging entries)</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#5E6672]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
