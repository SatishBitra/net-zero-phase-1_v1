import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Site } from '../../../types';
import {
  MapPin,
  Plus,
  Upload,
  Search,
  X,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

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
    <div id="screen-05-sites-facilities" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Organisation Setup' },
          { label: 'Sites & Facilities' },
        ]}
        title="Sites & Facilities"
        description="Manage physical and operational locations included in your emissions accounting boundary."
        actions={
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <Upload className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="enterprise-btn-primary h-9 px-3.5 text-xs inline-flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Site</span>
            </button>
          </div>
        }
      />

      {/* Filter Controls Bar */}
      <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search site name, location or state…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A]"
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
            className="px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white text-[#17181A]"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="text-xs text-[#5F6368] font-data">
          Showing {filteredSites.length} of {sites.length} sites
        </div>
      </div>

      {/* Sites Data Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB] text-[#5F6368]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Site Name</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Location / State</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Facility Type</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-center">Emission Sources</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Manager</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A]">Status</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[#17181A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredSites.map((site) => (
                <tr key={site.id} className="hover:bg-[#FAFAFB] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#17181A]">{site.name}</div>
                    <div className="text-[11px] text-[#8A8F98] activity-id font-medium">{site.id}</div>
                  </td>
                  <td className="py-3 px-4 text-[#5F6368]">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8A8F98] shrink-0" />
                      <span className="truncate max-w-[220px] font-sans">{site.location}</span>
                    </div>
                    <div className="text-[11px] text-[#8A8F98] pl-4.5 font-data">{site.state}, {site.country}</div>
                  </td>
                  <td className="py-3 px-4 text-[#5F6368]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAFAFB] text-[#17181A] text-[11px] border border-[#E5E7EB] font-data">
                      {site.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigateToScreen('07_emission_sources', 'FLOW_A')}
                      className="text-xs text-[#6254E8] hover:underline font-semibold"
                    >
                      {site.emissionSourcesCount} configured →
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[#5F6368] font-sans">{site.manager}</td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={site.status === 'Active' ? 'Approved' : 'Under Review'}
                      customLabel={site.status}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigateToScreen('07_emission_sources', 'FLOW_A')}
                      className="px-2.5 py-1 text-[11px] text-[#6254E8] hover:bg-[#6254E8]/10 rounded-md transition-colors font-semibold"
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
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between text-xs shadow-2xs font-sans">
        <div className="text-[#5F6368] font-data">
          Once operational sites are established, configure the reporting periods.
        </div>
        <button
          onClick={() => navigateToScreen('06_periods', 'FLOW_A')}
          className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
        >
          <span>Continue to Reporting Periods</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add Site Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] font-sans animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F4F5F6]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#6254E8]" />
                <h3 className="text-sm font-semibold text-[#17181A]">Add New Facility / Site</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#8A8F98] hover:text-[#17181A] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Site Name <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Coimbatore Casting Plant"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">
                  Physical Address / Location <span className="text-[#D92D20]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street, Industrial Area, City"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17181A] mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17181A] mb-1">Facility Type</label>
                  <select
                    value={siteType}
                    onChange={(e) => setSiteType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Storage">Storage</option>
                    <option value="Office">Office</option>
                    <option value="Distribution">Distribution</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">Facility Manager</label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. K. Sundaram"
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17181A] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#7567F5] bg-white text-[#17181A]"
                >
                  <option value="Active">Active (Ready for emissions recording)</option>
                  <option value="Draft">Draft (Preliminary planning)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="enterprise-btn-secondary h-9 px-3 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs"
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
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-5 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-[#6254E8]" />
                <h3 className="text-sm font-semibold text-[#17181A]">Import Sites via CSV</h3>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 text-[#8A8F98] hover:text-[#17181A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-6 border-2 border-dashed border-[#E5E7EB] rounded-xl text-center bg-[#FAFAFB]">
                <Upload className="w-6 h-6 text-[#8A8F98] mx-auto mb-2" />
                <p className="text-xs text-[#17181A] font-semibold">
                  Drag and drop your sites CSV file here
                </p>
                <p className="text-[11px] text-[#5F6368] mt-1 font-data">
                  Required columns: Site Name, Location, State, Facility Type
                </p>
              </div>

              <div className="text-[11px] text-[#5F6368] bg-[#FAFAFB] p-2.5 rounded-lg border border-[#E5E7EB] flex items-center justify-between font-data">
                <span>Need our standardized CSV template?</span>
                <button
                  onClick={() => showToast('Template Downloaded', 'sites_import_template.csv saved.', 'info')}
                  className="text-[#6254E8] hover:underline font-semibold font-sans"
                >
                  Download template (.csv)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F3F5]">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="enterprise-btn-secondary h-9 px-3 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateCsvImport}
                className="enterprise-btn-primary h-9 px-4 text-xs font-semibold shadow-xs"
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
