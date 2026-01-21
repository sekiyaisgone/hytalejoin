'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { GameMode, Region, SortOption } from '@/types';
import Button from '@/components/ui/Button';

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
  { value: 'pvp', label: 'PVP' },
  { value: 'survival', label: 'Survival' },
  { value: 'creative', label: 'Creative' },
  { value: 'mini-games', label: 'Mini-Games' },
  { value: 'rpg', label: 'RPG' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'roleplay', label: 'Roleplay' },
  { value: 'faction', label: 'Faction' },
  { value: 'skyblock', label: 'Skyblock' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'pve', label: 'PVE' },
  { value: 'multi-server', label: 'Multi-Server' },
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

  return (
    <div className="space-y-5">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8fa6] transition-colors group-focus-within:text-[#d4a033]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-12 py-3.5
                bg-[#151f2e] border border-[rgba(255,255,255,0.06)] rounded-xl
                text-[#f0f4f8] text-base
                placeholder:text-[#4a5d73]
                transition-all duration-200
                hover:border-[rgba(255,255,255,0.1)]
                focus:outline-none focus:border-[#d4a033] focus:ring-2 focus:ring-[#d4a033]/20
              "
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a8fa6] hover:text-[#f0f4f8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Sort and Filter buttons */}
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="
                appearance-none cursor-pointer
                pl-4 pr-10 py-3.5
                bg-[#151f2e] border border-[rgba(255,255,255,0.06)] rounded-xl
                text-[#f0f4f8] text-sm font-medium
                transition-all duration-200
                hover:border-[rgba(255,255,255,0.1)]
                focus:outline-none focus:border-[#d4a033] focus:ring-2 focus:ring-[#d4a033]/20
              "
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#151f2e]">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8fa6] pointer-events-none" />
          </div>

          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="
          bg-[rgba(15,23,32,0.8)] backdrop-blur-xl
          border border-[rgba(255,255,255,0.06)] rounded-2xl
          p-6 space-y-6
          animate-fade-in
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        ">
          {/* Game Modes */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f4f8] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a033]" />
              Game Modes
            </h3>
            <div className="flex flex-wrap gap-2">
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => toggleGameMode(mode.value)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
                    ${currentFilters.gameModes.includes(mode.value)
                      ? 'bg-gradient-to-r from-[#d4a033] to-[#a67c20] text-white shadow-[0_2px_8px_rgba(212,160,51,0.3)]'
                      : 'bg-[#1a2942] text-[#7a8fa6] border border-[rgba(255,255,255,0.06)] hover:text-[#f0f4f8] hover:border-[rgba(255,255,255,0.1)]'
                    }
                  `}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f4f8] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              Regions
            </h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => toggleRegion(region.value)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
                    ${currentFilters.regions.includes(region.value)
                      ? 'bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-white shadow-[0_2px_8px_rgba(56,189,248,0.3)]'
                      : 'bg-[#1a2942] text-[#7a8fa6] border border-[rgba(255,255,255,0.06)] hover:text-[#f0f4f8] hover:border-[rgba(255,255,255,0.1)]'
                    }
                  `}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={currentFilters.onlineOnly}
                  onChange={(e) =>
                    onFilterChange({ ...currentFilters, onlineOnly: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="
                  w-10 h-6 rounded-full
                  bg-[#1a2942] border border-[rgba(255,255,255,0.06)]
                  peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500/30
                  transition-colors
                " />
                <div className="
                  absolute left-1 top-1 w-4 h-4 rounded-full
                  bg-[#7a8fa6]
                  peer-checked:bg-emerald-400 peer-checked:translate-x-4
                  transition-all
                " />
              </div>
              <span className="text-sm text-[#7a8fa6] group-hover:text-[#f0f4f8] transition-colors">
                Online servers only
              </span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick filter pills (always visible) */}
      <div className="flex flex-wrap gap-2">
        {gameModes.slice(0, 6).map((mode) => (
          <button
            key={mode.value}
            onClick={() => toggleGameMode(mode.value)}
            className={`
              px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-full transition-all duration-200
              ${currentFilters.gameModes.includes(mode.value)
                ? 'bg-gradient-to-r from-[#d4a033] to-[#a67c20] text-white shadow-[0_2px_8px_rgba(212,160,51,0.3)]'
                : 'bg-[#1a2942] text-[#7a8fa6] border border-[rgba(255,255,255,0.06)] hover:text-[#f0f4f8] hover:border-[rgba(255,255,255,0.1)]'
              }
            `}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
