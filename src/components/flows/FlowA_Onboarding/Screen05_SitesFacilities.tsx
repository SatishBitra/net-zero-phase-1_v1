import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Site } from '../../../types';
import {
  MapPin,
  Plus,
  Upload,
  Search,
  Filter,
  MoreVertical,
  X,
  Check,
  ArrowRight,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

export const Screen05_SitesFacilities: React.FC = () => {
  const { sites, addSite, navigateToScreen, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add Site Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [siteType, setSiteType] = useState<Site['type']>('Manufacturing');
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState<Site['status']>('Active');

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const filteredSites = sites.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.state.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !location) return;

    addSite({
      name: siteName,
      location,
      state: state || 'Tamil Nadu',
      country: 'India',
      type: siteType,
      status,
      manager: manager || 'Unassigned',
    });

    setIsDrawerOpen(false);
    // Reset form
    setSiteName('');
    setLocation('');
    setState('');
    setManager('');
  };

  const handleSimulateCsvImport = () => {
    addSite({
      name: 'Bengaluru R&D Center',
      location: 'Electronic City Phase 1, Bengaluru',
      state: 'Karnataka',
      country: 'India',
      type: 'Office',
      status: 'Active',
      manager: 'K. Nair',
    });
    setIsCsvModalOpen(false);
    showToast('CSV Import Complete', 'Imported 1 new operational site into boundary.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Flow Step */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#D9DDE3]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#5E6672] mb-1">
            <span>Organisation Setup</span>
            <span>•</span>
            <span className="text-[#174A8B] font-medium">Sites & Facilities</span>
          </div>
          <h1 className="text-xl font-normal text-[#171A1F]">Sites & Facilities</h1>
          <p className="text-xs text-[#5E6672] mt-0.5">
            Manage physical and operational locations included in your emissions accounting boundary.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-[#D9DDE3] hover:bg-[#F8F9FB] text-xs text-[#171A1F] rounded-md transition-colors flex items-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#5E6672]" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-3.5 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Site</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-3 bg-white border border-[#D9DDE3] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#858C96] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search site name, location or state…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-white text-[#5E6672]"
          >
            <option value="all">All Types</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Storage">Storage</option>
            <option value="Office">Office</option>
            <option value="Distribution">Distribution</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#D9DDE3] rounded-md bg-white text-[#5E6672]"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="text-xs text-[#858C96] font-mono">
          Showing {filteredSites.length} of {sites.length} sites
        </div>
      </div>

      {/* Sites Data Table */}
      <div className="bg-white border border-[#D9DDE3] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#D9DDE3] text-[#5E6672]">
                <th className="py-2.5 px-4 font-medium">Site Name</th>
                <th className="py-2.5 px-4 font-medium">Location / State</th>
                <th className="py-2.5 px-4 font-medium">Facility Type</th>
                <th className="py-2.5 px-4 font-medium text-center">Emission Sources</th>
                <th className="py-2.5 px-4 font-medium">Manager</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredSites.map((site) => (
                <tr key={site.id} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#171A1F]">{site.name}</div>
                    <div className="text-[11px] text-[#858C96] font-mono">{site.id}</div>
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#858C96] shrink-0" />
                      <span className="truncate max-w-[220px]">{site.location}</span>
                    </div>
                    <div className="text-[11px] text-[#858C96] pl-4">{site.state}, {site.country}</div>
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[#171A1F] text-[11px] border border-[#D9DDE3]">
                      {site.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigateToScreen('07_emission_sources', 'FLOW_A')}
                      className="text-xs text-[#2166B1] hover:underline font-medium"
                    >
                      {site.emissionSourcesCount} configured →
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[#5E6672]">{site.manager}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        site.status === 'Active'
                          ? 'bg-[#EAF2FB] text-[#174A8B]'
                          : 'bg-[#F1F3F5] text-[#5E6672]'
                      }`}
                    >
                      {site.status === 'Active' ? '● Active' : '○ Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigateToScreen('07_emission_sources', 'FLOW_A')}
                      className="px-2.5 py-1 text-[11px] text-[#174A8B] hover:bg-[#EAF2FB] rounded transition-colors"
                    >
                      Sources
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flow Sequence Progression Bar */}
      <div className="p-4 bg-white border border-[#D9DDE3] rounded-lg flex items-center justify-between text-xs">
        <div className="text-[#5E6672]">
          Once operational sites are established, configure the reporting periods.
        </div>
        <button
          onClick={() => navigateToScreen('06_periods', 'FLOW_A')}
          className="px-4 py-2 bg-[#174A8B] hover:bg-[#2166B1] text-white font-medium rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
        >
          <span>Continue to Reporting Periods</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add Site Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#D9DDE3] animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#D9DDE3] flex items-center justify-between bg-[#F8F9FB]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">Add New Facility / Site</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#858C96] hover:text-[#171A1F] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Site Name <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Coimbatore Casting Plant"
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">
                  Physical Address / Location <span className="text-[#D92D20]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street, Industrial Area, City"
                  className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E6672] mb-1">Facility Type</label>
                  <select
                    value={siteType}
                    onChange={(e) => setSiteType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#D9DDE3] rounded-md focus:outline-none focus:border-[#174A8B] bg-white"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Storage">Storage</option>
                    <option value="Office">Office</option>
                    <option value="Distribution">Distribution</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E6672] mb-1">Facility Manager</label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. K. Sundaram"
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
                  <option value="Active">Active (Ready for emissions recording)</option>
                  <option value="Draft">Draft (Preliminary planning)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#5E6672] hover:text-[#171A1F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
                >
                  Save Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#D9DDE3] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-[#174A8B]" />
                <h3 className="text-sm font-medium text-[#171A1F]">Import Sites via CSV</h3>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 text-[#858C96] hover:text-[#171A1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-6 border-2 border-dashed border-[#D9DDE3] rounded-lg text-center bg-[#F8F9FB]">
                <Upload className="w-6 h-6 text-[#858C96] mx-auto mb-2" />
                <p className="text-xs text-[#171A1F] font-medium">
                  Drag and drop your sites CSV file here
                </p>
                <p className="text-[11px] text-[#858C96] mt-1">
                  Required columns: Site Name, Location, State, Facility Type
                </p>
              </div>

              <div className="text-[11px] text-[#5E6672] bg-[#F1F3F5] p-2.5 rounded flex items-center justify-between">
                <span>Need our standardized CSV template?</span>
                <button
                  onClick={() => showToast('Template Downloaded', 'sites_import_template.csv saved.', 'info')}
                  className="text-[#2166B1] hover:underline"
                >
                  Download template (.csv)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F3F5]">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#5E6672]"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateCsvImport}
                className="px-4 py-1.5 bg-[#174A8B] hover:bg-[#2166B1] text-white text-xs font-medium rounded-md shadow-sm"
              >
                Validate & Import Sample Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
