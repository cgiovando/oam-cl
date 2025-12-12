import React, { useState, useEffect, useRef } from 'react';

function MapFilterBar({ filters, onChange }) {
  // Track which dropdown is open: 'platform', 'date', 'license', or null
  const [openMenu, setOpenMenu] = useState(null);
  const [showCustomDates, setShowCustomDates] = useState(false);
  const barRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
    setOpenMenu(null); // Close menu after selection
  };

  // --- Date Logic ---
  const today = new Date().toISOString().split('T')[0];

  const applyDatePreset = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    const start = d.toISOString().split('T')[0];
    
    onChange({
      ...filters,
      dateEnd: today,
      dateStart: start
    });
    setOpenMenu(null); 
  };

  const setYearToDate = () => {
    const start = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    onChange({
      ...filters,
      dateEnd: today,
      dateStart: start
    });
    setOpenMenu(null);
  };

  const handleAnyDate = () => {
    onChange({ ...filters, dateStart: '', dateEnd: '' });
    setOpenMenu(null);
  };

  // Helper to check if a preset is active
  const isPresetActive = (days) => {
    if (!filters.dateStart || !filters.dateEnd) return false;
    const d = new Date();
    d.setDate(d.getDate() - days);
    return filters.dateStart === d.toISOString().split('T')[0] && filters.dateEnd === today;
  };

  const isYTDActive = () => {
    if (!filters.dateStart) return false;
    const start = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    return filters.dateStart === start;
  };

  const isAnyDate = !filters.dateStart && !filters.dateEnd;

  // --- Labels for Buttons ---
  const getPlatformLabel = () => {
    const map = { 'satellite': 'Satellite', 'uav': 'Drone', 'aircraft': 'Other' };
    return map[filters.platform] || 'All Platforms';
  };

  const getDateLabel = () => {
    if (isAnyDate) return 'Any Date';
    if (isPresetActive(7)) return 'Past Week';
    if (isPresetActive(30)) return 'Past Month';
    if (isYTDActive()) return 'This Year';
    return 'Custom Date';
  };

  const getLicenseLabel = () => {
    if (!filters.license) return 'Any License';
    if (filters.license.includes('BY-SA')) return 'CC BY-SA';
    if (filters.license.includes('BY-NC')) return 'CC BY-NC';
    if (filters.license.includes('CC-BY')) return 'CC BY';
    return 'License';
  };

  // --- Styles ---
  const btnBase = "px-4 py-2 bg-white rounded-full shadow-md text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-2 transition-all";
  const activeBtn = "border-cyan-500 text-cyan-700 bg-cyan-50 ring-2 ring-cyan-100";
  
  return (
    <div ref={barRef} className="absolute top-4 left-4 z-20 flex flex-wrap gap-3 font-sans">
      
      {/* 1. PLATFORM DROPDOWN */}
      <div className="relative">
        <button 
          onClick={() => setOpenMenu(openMenu === 'platform' ? null : 'platform')}
          className={`${btnBase} ${filters.platform ? activeBtn : ''}`}
        >
          {getPlatformLabel()} <span className="text-[10px]">▼</span>
        </button>

        {openMenu === 'platform' && (
          <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden animate-fade-in">
            {[
              { label: 'All Platforms', val: '' },
              { label: 'Satellite', val: 'satellite' },
              { label: 'Drone (UAV)', val: 'uav' },
              { label: 'Other / Aircraft', val: 'aircraft' }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleChange('platform', opt.val)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filters.platform === opt.val ? 'text-cyan-600 font-bold bg-cyan-50' : 'text-gray-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. DATE DROPDOWN */}
      <div className="relative">
        <button 
          onClick={() => setOpenMenu(openMenu === 'date' ? null : 'date')}
          className={`${btnBase} ${!isAnyDate ? activeBtn : ''}`}
        >
          {getDateLabel()} <span className="text-[10px]">▼</span>
        </button>

        {openMenu === 'date' && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-2 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={handleAnyDate} className={`px-3 py-2 rounded text-xs font-medium border ${isAnyDate ? 'bg-cyan-100 border-cyan-500 text-cyan-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Any Date</button>
              <button onClick={() => applyDatePreset(7)} className={`px-3 py-2 rounded text-xs font-medium border ${isPresetActive(7) ? 'bg-cyan-100 border-cyan-500 text-cyan-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Past Week</button>
              <button onClick={() => applyDatePreset(30)} className={`px-3 py-2 rounded text-xs font-medium border ${isPresetActive(30) ? 'bg-cyan-100 border-cyan-500 text-cyan-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Past Month</button>
              <button onClick={setYearToDate} className={`px-3 py-2 rounded text-xs font-medium border ${isYTDActive() ? 'bg-cyan-100 border-cyan-500 text-cyan-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>This Year</button>
            </div>
            
            <button 
              onClick={() => setShowCustomDates(!showCustomDates)}
              className="w-full text-xs text-center text-gray-400 hover:text-cyan-600 underline py-1"
            >
              {showCustomDates ? 'Hide Custom' : 'Custom Range...'}
            </button>

            {showCustomDates && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex gap-1 items-center">
                <input type="date" value={filters.dateStart} onChange={(e) => onChange({...filters, dateStart: e.target.value})} className="w-full text-[10px] border rounded px-1 py-1" />
                <span className="text-gray-400">-</span>
                <input type="date" value={filters.dateEnd} onChange={(e) => onChange({...filters, dateEnd: e.target.value})} className="w-full text-[10px] border rounded px-1 py-1" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. LICENSE DROPDOWN */}
      <div className="relative">
        <button 
          onClick={() => setOpenMenu(openMenu === 'license' ? null : 'license')}
          className={`${btnBase} ${filters.license ? activeBtn : ''}`}
        >
          {getLicenseLabel()} <span className="text-[10px]">▼</span>
        </button>

        {openMenu === 'license' && (
          <div className="absolute top-full mt-2 left-0 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden animate-fade-in">
             {[
              { label: 'Any License', val: '' },
              { label: 'CC BY 4.0', val: 'CC-BY 4.0' },
              { label: 'CC BY-NC 4.0', val: 'CC BY-NC 4.0' },
              { label: 'CC BY-SA 4.0', val: 'CC BY-SA 4.0' }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleChange('license', opt.val)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filters.license === opt.val ? 'text-cyan-600 font-bold bg-cyan-50' : 'text-gray-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CLEAR BUTTON (Only if filters active) */}
      {(filters.platform || filters.dateStart || filters.license) && (
        <button 
          onClick={() => onChange({ dateStart: '', dateEnd: '', platform: '', license: '' })}
          className="px-3 py-2 bg-white/90 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm transition-all"
        >
          ✕ Clear
        </button>
      )}

    </div>
  );
}

export default MapFilterBar;