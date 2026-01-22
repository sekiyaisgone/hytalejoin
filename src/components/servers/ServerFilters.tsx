'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { GameMode, Region, SortOption } from '@/types';

interface ServerFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  currentFilters: FilterState;
  currentSort: SortOption;
}

export interface FilterState {
  gameModes: GameMode[];
  regions: Region[];
  onlineOnly: boolean;
}

const gameModes: { value: GameMode; label: string }[] = [
  { value: 'pvp', label: 'PvP' },
  { value: 'survival', label: 'Survival' },
  { value: 'creative', label: 'Creative' },
  { value: 'mini-games', label: 'Mini-games' },
  { value: 'rpg', label: 'RPG' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'roleplay', label: 'Roleplay' },
  { value: 'faction', label: 'Faction' },
  { value: 'skyblock', label: 'Skyblock' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'pve', label: 'PvE' },
  { value: 'multi-server', label: 'Network' },
];

const regions: { value: Region; label: string }[] = [
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'africa', label: 'Africa' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'players', label: 'Most Players' },
  { value: 'newest', label: 'Newest' },
  { value: 'votes', label: 'Most Votes' },
  { value: 'alphabetical', label: 'A-Z' },
];

export default function ServerFilters({
  onSearch,
  onFilterChange,
  onSortChange,
  currentFilters,
  currentSort,
}: ServerFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleGameMode = (mode: GameMode) => {
    const newModes = currentFilters.gameModes.includes(mode)
      ? currentFilters.gameModes.filter((m) => m !== mode)
      : [...currentFilters.gameModes, mode];
    onFilterChange({ ...currentFilters, gameModes: newModes });
  };

  const toggleRegion = (region: Region) => {
    const newRegions = currentFilters.regions.includes(region)
      ? currentFilters.regions.filter((r) => r !== region)
      : [...currentFilters.regions, region];
    onFilterChange({ ...currentFilters, regions: newRegions });
  };

  const clearAllFilters = () => {
    onFilterChange({ gameModes: [], regions: [], onlineOnly: false });
  };

  const clearFilters = () => {
    onFilterChange({ gameModes: [], regions: [], onlineOnly: false });
    setSearchQuery('');
    onSearch('');
  };

  const activeFilterCount =
    currentFilters.gameModes.length +
    currentFilters.regions.length +
    (currentFilters.onlineOnly ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;
  const noFiltersActive = currentFilters.gameModes.length === 0;

  // Chip styles
  const baseChipStyle: React.CSSProperties = {
    height: '34px',
    padding: '0 14px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#8899aa',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap' as const,
  };

  const activeChipStyle: React.CSSProperties = {
    ...baseChipStyle,
    background: 'rgba(91, 141, 239, 0.15)',
    border: '1px solid rgba(91, 141, 239, 0.3)',
    color: '#7bb0ff',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search and Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '16px',
                paddingRight: '44px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                color: '#f0f4f8',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7a8fa6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#4a5d73',
                  pointerEvents: 'none',
                }}
              >
                <Search style={{ width: '16px', height: '16px' }} />
              </div>
            )}
          </div>
        </form>

        {/* Sort Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            style={{
              height: '40px',
              paddingLeft: '14px',
              paddingRight: '36px',
              appearance: 'none',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#c8d4e0',
              fontSize: '0.8125rem',
              fontWeight: 500,
              outline: 'none',
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} style={{ background: '#151f2e' }}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '14px',
              height: '14px',
              color: '#6b7c8f',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            height: '40px',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: showFilters ? 'rgba(91, 141, 239, 0.1)' : 'rgba(255,255,255,0.03)',
            border: showFilters ? '1px solid rgba(91, 141, 239, 0.3)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            color: showFilters ? '#7bb0ff' : '#8899aa',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <SlidersHorizontal style={{ width: '15px', height: '15px' }} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(91, 141, 239, 0.2)',
                color: '#7bb0ff',
                fontSize: '0.6875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Chips Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {/* All chip */}
        <button
          onClick={clearAllFilters}
          style={noFiltersActive ? activeChipStyle : baseChipStyle}
        >
          All
        </button>

        {/* Game mode chips */}
        {gameModes.slice(0, 5).map((mode) => (
          <button
            key={mode.value}
            onClick={() => toggleGameMode(mode.value)}
            style={currentFilters.gameModes.includes(mode.value) ? activeChipStyle : baseChipStyle}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Game Modes */}
          <div>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#8899aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Game Modes
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => toggleGameMode(mode.value)}
                  style={currentFilters.gameModes.includes(mode.value) ? activeChipStyle : baseChipStyle}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#8899aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Regions
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => toggleRegion(region.value)}
                  style={currentFilters.regions.includes(region.value) ? activeChipStyle : baseChipStyle}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          {/* Online Only + Clear */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={currentFilters.onlineOnly}
                onChange={(e) =>
                  onFilterChange({ ...currentFilters, onlineOnly: e.target.checked })
                }
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#5b8def',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '0.875rem', color: '#8899aa' }}>Online servers only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  fontSize: '0.8125rem',
                  color: '#6b7c8f',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
