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
      <div className="bg-card rounded-xl shadow-sm border border-border p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Søk etter tittel, firma eller sted..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-colors"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-foreground text-lg">Filtre</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Nullstill alle
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    statusFilter.includes(option.value)
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Remote Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Arbeidsform</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setRemoteFilter('all')}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  remoteFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setRemoteFilter('remote')}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  remoteFilter === 'remote'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
                }`}
              >
                Remote
              </button>
              <button
                onClick={() => setRemoteFilter('onsite')}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  remoteFilter === 'onsite'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
                }`}
              >
                Kontor
              </button>
            </div>
          </div>

          {/* Location Filter */}
          {allLocations.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Sted</label>
              <div className="flex flex-wrap gap-2">
                {allLocations.map(location => (
                  <button
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                      locationFilter.includes(location)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
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
              <label className="block text-sm font-semibold text-foreground mb-3">Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                        : 'bg-background text-foreground border-border hover:border-accent hover:bg-secondary'
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
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground font-medium">
            Viser <span className="text-foreground font-bold">{filteredJobs.length}</span> av <span className="text-foreground font-bold">{jobs.length}</span> jobber
          </p>
          {hasActiveFilters && (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              Filtrert
            </span>
          )}
        </div>
        {filteredJobs.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ingen resultater</h3>
              <p className="text-muted-foreground mb-6">Ingen jobber matcher filtrene dine</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Nullstill filtre
              </button>
            </div>
          </div>
        ) : (
          <KanbanBoard jobs={filteredJobs} />
        )}
      </div>
    </div>
  );
}
