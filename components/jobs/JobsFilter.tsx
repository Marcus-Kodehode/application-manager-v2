'use client';

import { useState, useMemo } from 'react';
import { KanbanBoard } from './KanbanBoard';

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  remote?: boolean;
  status: string;
  tags?: string[];
  [key: string]: any;
}

const STATUS_OPTIONS = [
  { value: 'WISHLIST', label: 'Ønskeliste' },
  { value: 'APPLIED', label: 'Søkt' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'INTERVIEW', label: 'Intervju' },
  { value: 'OFFER', label: 'Tilbud' },
  { value: 'REJECTED', label: 'Avslag' },
  { value: 'ACCEPTED', label: 'Akseptert' },
  { value: 'WITHDRAWN', label: 'Trukket' },
];

export function JobsFilter({ jobs }: { jobs: Job[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [remoteFilter, setRemoteFilter] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from jobs
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    jobs.forEach(job => {
      job.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [jobs]);

  // Get all unique locations
  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    jobs.forEach(job => {
      if (job.location) locations.add(job.location);
    });
    return Array.from(locations).sort();
  }, [jobs]);

  const [locationFilter, setLocationFilter] = useState<string[]>([]);

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter (title, company, location)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(job.status)) {
        return false;
      }

      // Remote filter
      if (remoteFilter === 'remote' && !job.remote) return false;
      if (remoteFilter === 'onsite' && job.remote) return false;

      // Location filter
      if (locationFilter.length > 0 && !locationFilter.includes(job.location || '')) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => job.tags?.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, statusFilter, remoteFilter, locationFilter, selectedTags]);

  const toggleStatus = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleLocation = (location: string) => {
    setLocationFilter(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setRemoteFilter('all');
    setLocationFilter([]);
    setSelectedTags([]);
  };

  const hasActiveFilters = 
    searchQuery || 
    statusFilter.length > 0 || 
    remoteFilter !== 'all' || 
    locationFilter.length > 0 ||
    selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <input
          type="text"
          placeholder="🔍 Søk etter tittel, firma eller sted..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Filtre</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Nullstill alle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    statusFilter.includes(option.value)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Remote Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arbeidsform</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRemoteFilter('all')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  remoteFilter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setRemoteFilter('remote')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  remoteFilter === 'remote'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                }`}
              >
                Remote
              </button>
              <button
                onClick={() => setRemoteFilter('onsite')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  remoteFilter === 'onsite'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                }`}
              >
                Kontor
              </button>
            </div>
          </div>

          {/* Location Filter */}
          {allLocations.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sted</label>
              <div className="flex flex-wrap gap-2">
                {allLocations.map(location => (
                  <button
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      locationFilter.includes(location)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Viser {filteredJobs.length} av {jobs.length} jobber
        </p>
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Ingen jobber matcher filtrene dine</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Nullstill filtre
            </button>
          </div>
        ) : (
          <KanbanBoard jobs={filteredJobs} />
        )}
      </div>
    </div>
  );
}
