import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  EmissionFactor,
  AUTHORITATIVE_EMISSION_FACTORS,
} from '../../data/emissionFactorsData';
import {
  Search,
  X,
  BookOpen,
  Calculator,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  Info,
  Layers,
  Scale,
  Building2,
  Globe,
  Flame,
  Zap,
} from 'lucide-react';

export const EmissionFactorHelperModal: React.FC = () => {
  const {
    isFactorHelperOpen,
    closeFactorHelper,
    activeFactorHelperSearch,
    setActiveFactorHelperSearch,
    applyFactorToEntry,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(activeFactorHelperSearch || '');
  const [selectedBody, setSelectedBody] = useState<string>('All');
  const [selectedScope, setSelectedScope] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Currently inspected factor for detail drawer & calculation accuracy estimator
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor>(
    AUTHORITATIVE_EMISSION_FACTORS[0]
  );
  const [sampleQuantity, setSampleQuantity] = useState<string>('10000');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync incoming search query when opened
  useEffect(() => {
    if (activeFactorHelperSearch) {
      setSearchQuery(activeFactorHelperSearch);
    }
  }, [activeFactorHelperSearch, isFactorHelperOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFactorHelperOpen) {
        closeFactorHelper();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFactorHelperOpen, closeFactorHelper]);

  // Filtered factors
  const filteredFactors = useMemo(() => {
    return AUTHORITATIVE_EMISSION_FACTORS.filter((factor) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        factor.name.toLowerCase().includes(q) ||
        factor.category.toLowerCase().includes(q) ||
        factor.publishingBody.toLowerCase().includes(q) ||
        factor.region.toLowerCase().includes(q) ||
        factor.primaryGas.toLowerCase().includes(q) ||
        factor.citation.toLowerCase().includes(q) ||
        factor.unit.toLowerCase().includes(q);

      const matchesBody =
        selectedBody === 'All' || factor.publishingBody === selectedBody;
      const matchesScope =
        selectedScope === 'All' || factor.scope === selectedScope;
      const matchesCategory =
        selectedCategory === 'All' || factor.category === selectedCategory;
      const matchesRegion =
        selectedRegion === 'All' ||
        (selectedRegion === 'India' && factor.region === 'India') ||
        (selectedRegion === 'Global' && factor.region === 'Global') ||
        (selectedRegion === 'Europe / UK' && (factor.region === 'Europe / UK' || factor.region === 'United Kingdom')) ||
        (selectedRegion === 'United States' && factor.region === 'United States');

      return matchesSearch && matchesBody && matchesScope && matchesCategory && matchesRegion;
    });
  }, [searchQuery, selectedBody, selectedScope, selectedCategory, selectedRegion]);

  // Update selected factor if the list changes and doesn't contain current selection
  useEffect(() => {
    if (filteredFactors.length > 0 && !filteredFactors.some((f) => f.id === selectedFactor.id)) {
      setSelectedFactor(filteredFactors[0]);
    }
  }, [filteredFactors, selectedFactor]);

  // Live calculation estimator logic
  const numQty = parseFloat(sampleQuantity) || 0;
  const calculatedEmissionsTons = useMemo(() => {
    return ((numQty * selectedFactor.value) / 1000).toFixed(3);
  }, [numQty, selectedFactor]);

  const uncertaintyPercent = parseFloat(selectedFactor.uncertainty.replace(/[^0-9.]/g, '')) || 2.0;
  const lowerBoundTons = (
    parseFloat(calculatedEmissionsTons) *
    (1 - uncertaintyPercent / 100)
  ).toFixed(3);
  const upperBoundTons = (
    parseFloat(calculatedEmissionsTons) *
    (1 + uncertaintyPercent / 100)
  ).toFixed(3);

  const handleCopy = (text: string, fieldKey: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast('Copied to Clipboard', `${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFactorHelperSearch('');
    setSelectedBody('All');
    setSelectedScope('All');
    setSelectedCategory('All');
    setSelectedRegion('All');
  };

  if (!isFactorHelperOpen) return null;

  return (
    <div
      id="emission-factor-helper-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white w-full max-w-6xl h-[92vh] max-h-[880px] rounded-2xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="helper-title"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#ECEDEF] bg-[#F8F9FB] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#01153C] text-white flex items-center justify-center shadow-2xs shrink-0">
              <BookOpen className="w-5 h-5 text-[#FFD166]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 id="helper-title" className="text-base sm:text-lg font-bold text-[#17181A] tracking-tight">
                  Emission Factor Helper
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EDF2FA] text-[#01153C] border border-[#DCE5F5]">
                  IPCC · IEA · CEA Library
                </span>
              </div>
              <p className="text-xs text-[#5F6368] font-data truncate mt-0.5">
                Look up authoritative conversion factors, assess Tier accuracy, and preview calculation formulas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={closeFactorHelper}
              className="p-2 text-[#5F6368] hover:text-[#17181A] hover:bg-[#E9ECEF] rounded-lg transition-colors focus:outline-none"
              aria-label="Close Emission Factor Helper"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-[#E5E7EB] bg-white space-y-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8F98] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by fuel, gas, or body (e.g. 'IPCC diesel', 'IEA grid electricity', 'R-410A', 'Natural gas', 'India')..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#01153C] focus:bg-white text-[#17181A] placeholder-[#8A8F98] shadow-2xs"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F98] hover:text-[#17181A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons & Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider mr-1">
                Body:
              </span>
              {['All', 'IPCC', 'IEA', 'CEA', 'DEFRA'].map((body) => (
                <button
                  key={body}
                  type="button"
                  onClick={() => setSelectedBody(body)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors font-medium ${
                    selectedBody === body
                      ? 'bg-[#01153C] text-white shadow-2xs'
                      : 'bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB] hover:bg-[#EDF2FA] hover:text-[#01153C]'
                  }`}
                >
                  {body === 'All' ? 'All Bodies' : body}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-[#E5E7EB] mx-1 hidden sm:block" />

              <span className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider mr-1 hidden sm:inline">
                Scope:
              </span>
              {['All', 'Scope 1', 'Scope 2', 'Scope 3'].map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setSelectedScope(scope)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors font-medium ${
                    selectedScope === scope
                      ? 'bg-[#01153C] text-white shadow-2xs'
                      : 'bg-[#FAFAFB] text-[#5F6368] border border-[#E5E7EB] hover:bg-[#EDF2FA] hover:text-[#01153C]'
                  }`}
                >
                  {scope === 'All' ? 'All Scopes' : scope}
                </button>
              ))}
            </div>

            {/* Category / Region Dropdown Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg text-[#17181A] focus:outline-none focus:border-[#01153C]"
              >
                <option value="All">All Categories</option>
                <option value="Electricity & Steam">Electricity & Steam</option>
                <option value="Liquid Fuels">Liquid Fuels</option>
                <option value="Gaseous Fuels">Gaseous Fuels</option>
                <option value="Solid Fuels">Solid Fuels</option>
                <option value="Refrigerants & Fugitive">Refrigerants (GWP)</option>
                <option value="Transport & Mobile">Transport & Mobile</option>
                <option value="Water & Waste">Water & Waste</option>
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[#FAFAFB] border border-[#E5E7EB] rounded-lg text-[#17181A] focus:outline-none focus:border-[#01153C]"
              >
                <option value="All">All Regions</option>
                <option value="India">India</option>
                <option value="Global">Global Benchmark</option>
                <option value="United States">United States</option>
                <option value="Europe / UK">Europe / UK</option>
              </select>

              {(searchQuery || selectedBody !== 'All' || selectedScope !== 'All' || selectedCategory !== 'All' || selectedRegion !== 'All') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#01153C] hover:underline font-semibold px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Body: 2-Column Responsive Layout (Factors List + Interactive Accuracy Estimator) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-[#F8F9FB]">
          {/* Left Column: Factors List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 border-r border-[#E5E7EB] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#5F6368] px-1 mb-1">
              <span>Showing <strong>{filteredFactors.length}</strong> emission factors</span>
              <span className="text-[11px] font-data">Click any row to inspect & calculate</span>
            </div>

            {filteredFactors.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
                <BookOpen className="w-10 h-10 text-[#8A8F98] mx-auto" />
                <h3 className="text-sm font-semibold text-[#17181A]">No emission factors found</h3>
                <p className="text-xs text-[#5F6368] max-w-sm mx-auto font-data">
                  No factors match your current search and filter criteria. Try searching for "IPCC", "diesel", or "grid".
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-1.5 text-xs font-semibold text-[#01153C] bg-[#EDF2FA] rounded-full hover:bg-[#DCE5F5]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredFactors.map((f) => {
                const isSelected = selectedFactor.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFactor(f)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white border-[#01153C] shadow-md ring-1 ring-[#01153C]/20'
                        : 'bg-white border-[#E5E7EB] hover:border-[#D5D8DD] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              f.publishingBody === 'IPCC'
                                ? 'bg-[#F4EBFF] text-[#6927DA] border-[#D8B4FE]'
                                : f.publishingBody === 'IEA'
                                ? 'bg-[#EDF2FA] text-[#01153C] border-[#DCE5F5]'
                                : f.publishingBody === 'CEA'
                                ? 'bg-[#EEF9F1] text-[#26783B] border-[#DDF3E3]'
                                : 'bg-[#FFF8E6] text-[#B54708] border-[#FEDF89]'
                            }`}
                          >
                            {f.publishingBody}
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F3F5] text-[#5F6368] border border-[#E5E7EB]">
                            {f.scope}
                          </span>

                          <span className="text-[10px] text-[#8A8F98] font-data">
                            {f.region} · {f.vintageYear}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#17181A] truncate">
                          {f.name}
                        </h4>

                        <p className="text-[11px] text-[#5F6368] line-clamp-1 mt-0.5 font-data">
                          {f.description}
                        </p>
                      </div>

                      {/* Factor Value Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-bold text-[#01153C] font-mono">
                          {f.value}
                        </div>
                        <div className="text-[10px] text-[#5F6368] font-data">
                          {f.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Factor Detail & Interactive Calculation Accuracy Estimator */}
          <div className="w-full lg:w-[420px] bg-white overflow-y-auto p-5 sm:p-6 space-y-5 shrink-0 border-t lg:border-t-0">
            {/* Factor Header */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#01153C] bg-[#EDF2FA] px-2.5 py-0.5 rounded-full border border-[#DCE5F5]">
                  {selectedFactor.publishingBody} · {selectedFactor.scope}
                </span>
                <span className="text-[10px] font-semibold text-[#26783B] bg-[#EEF9F1] px-2 py-0.5 rounded-full border border-[#DDF3E3] flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{selectedFactor.tier} Verified</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-[#17181A] leading-snug">
                {selectedFactor.name}
              </h3>
              <p className="text-xs text-[#5F6368] mt-1 leading-relaxed font-data">
                {selectedFactor.description}
              </p>
            </div>

            {/* Factor Value Spotlight Card */}
            <div className="p-4 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A8F98]">
                    Emission Factor Value
                  </div>
                  <div className="text-2xl font-black text-[#01153C] font-mono mt-0.5">
                    {selectedFactor.value}{' '}
                    <span className="text-xs font-semibold text-[#5F6368] font-sans">
                      {selectedFactor.unit}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedFactor.value.toString(), 'val', 'Factor value')}
                  className="enterprise-btn-secondary h-8 px-2.5 text-xs font-semibold flex items-center space-x-1"
                  title="Copy factor value to clipboard"
                >
                  {copiedField === 'val' ? <Check className="w-3.5 h-3.5 text-[#26783B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'val' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] text-[#8A8F98] uppercase font-semibold">Gases:</span>
                  <div className="font-semibold text-[#17181A] text-[11px] font-mono truncate">
                    {selectedFactor.primaryGas}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#8A8F98] uppercase font-semibold">Uncertainty:</span>
                  <div className="font-semibold text-[#17181A] text-[11px]">
                    {selectedFactor.uncertainty} (95% CI)
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Calculation Accuracy Estimator */}
            <div className="p-4 bg-[#EDF2FA] border border-[#DCE5F5] rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4 text-[#01153C]" />
                  <span className="text-xs font-bold text-[#01153C] uppercase tracking-wider">
                    Accuracy Estimator
                  </span>
                </div>
                <span className="text-[10px] text-[#01153C] font-semibold bg-white/70 px-2 py-0.5 rounded-full border border-[#DCE5F5]">
                  Deterministic tCO2e
                </span>
              </div>

              {/* Input Quantity */}
              <div>
                <label className="block text-[11px] font-semibold text-[#17181A] mb-1">
                  Test Activity Quantity ({selectedFactor.unit.split('/')[1]?.trim() || 'units'}):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sampleQuantity}
                    onChange={(e) => setSampleQuantity(e.target.value)}
                    placeholder="Enter activity amount..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#DCE5F5] rounded-lg font-mono text-[#17181A] focus:outline-none focus:border-[#01153C]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#8A8F98] font-data">
                    {selectedFactor.unit.split('/')[1]?.trim() || 'units'}
                  </span>
                </div>
              </div>

              {/* Result computation */}
              <div className="p-3 bg-white rounded-xl border border-[#DCE5F5] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#5F6368] text-[11px]">
                  <span>Formula:</span>
                  <span className="font-mono text-[#17181A] text-[10px]">
                    Qty × {selectedFactor.value} ÷ 1,000
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#F1F3F5]">
                  <span className="font-semibold text-[#17181A]">Estimated Emissions:</span>
                  <span className="text-base font-bold text-[#01153C] font-mono">
                    {calculatedEmissionsTons} <span className="text-xs font-semibold">tCO2e</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#5F6368] pt-1">
                  <span>Accuracy Band ({selectedFactor.uncertainty}):</span>
                  <span className="font-mono text-[#01153C]">
                    {lowerBoundTons} – {upperBoundTons} tCO2e
                  </span>
                </div>
              </div>
            </div>

            {/* Official Regulatory Citation Card */}
            <div className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F98]">
                  Authoritative Citation
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedFactor.citation, 'cit', 'Citation')}
                  className="text-[11px] text-[#01153C] hover:underline flex items-center space-x-1 font-semibold"
                >
                  {copiedField === 'cit' ? <Check className="w-3 h-3 text-[#26783B]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'cit' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#17181A] font-data leading-relaxed bg-[#FAFAFB] p-2.5 rounded-lg border border-[#F1F3F5]">
                {selectedFactor.citation}
              </p>
              <div className="text-[10px] text-[#8A8F98] flex items-center justify-between pt-1">
                <span>Version: {selectedFactor.versionOrReport}</span>
                <span>Effective: {selectedFactor.effectivePeriod}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => applyFactorToEntry(selectedFactor)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#01153C] hover:bg-[#02215c] rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Use This Factor in Activity Entry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-[#8A8F98] text-center mt-1.5 font-data">
                Pre-fills manual logging with verified factor and scope parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#ECEDEF] bg-white flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-[#5F6368]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#26783B]" />
            <span>
              All factors comply with <strong>GHG Protocol Corporate Standard</strong> and <strong>ISO 14064-1:2018</strong>.
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={closeFactorHelper}
              className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#FAFAFB] text-xs font-semibold text-[#17181A]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
