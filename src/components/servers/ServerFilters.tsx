'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { GameMode, Region, SortOption } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

  const hasActiveFilters =
    currentFilters.gameModes.length > 0 ||
    currentFilters.regions.length > 0 ||
    currentFilters.onlineOnly;

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <Input
            type="text"
            placeholder="Search servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            rightIcon={
              searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="hover:text-[#e8f0f8] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            }
          />
        </form>

        {/* Sort and Filter buttons */}
        <div className="flex gap-2">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-[#1a2f4a] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-[#e8f0f8] cursor-pointer transition-colors hover:border-[#d29f32] focus:outline-none focus:ring-2 focus:ring-[#d29f32]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-[#d29f32] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {currentFilters.gameModes.length + currentFilters.regions.length + (currentFilters.onlineOnly ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-[rgba(26,47,74,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-xl p-4 space-y-4 animate-fade-in">
          {/* Game Modes */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8f0f8] mb-3">Game Modes</h3>
            <div className="flex flex-wrap gap-2">
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => toggleGameMode(mode.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    currentFilters.gameModes.includes(mode.value)
                      ? 'bg-[#d29f32] text-white shadow-[0_0_10px_rgba(210,159,50,0.3)]'
                      : 'bg-[#1a2f4a] text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#2a4060]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8f0f8] mb-3">Regions</h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region.value}
                  onClick={() => toggleRegion(region.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    currentFilters.regions.includes(region.value)
                      ? 'bg-[#d29f32] text-white shadow-[0_0_10px_rgba(210,159,50,0.3)]'
                      : 'bg-[#1a2f4a] text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#2a4060]'
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.08)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.onlineOnly}
                onChange={(e) =>
                  onFilterChange({ ...currentFilters, onlineOnly: e.target.checked })
                }
                className="w-4 h-4 rounded border-[rgba(255,255,255,0.08)] bg-[#1a2f4a] text-[#d29f32] focus:ring-[#d29f32] focus:ring-offset-0"
              />
              <span className="text-sm text-[#8fa3b8]">Online servers only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
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
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-full transition-all ${
              currentFilters.gameModes.includes(mode.value)
                ? 'bg-[#d29f32] text-white'
                : 'bg-[#1a2f4a] text-[#8fa3b8] hover:text-[#e8f0f8]'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
