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
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 transition-colors">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Søk etter tittel, firma eller sted..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors duration-200"
              title="Tøm søk"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
            🎯 Filtre
            {hasActiveFilters && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {[searchQuery ? 1 : 0, statusFilter.length, remoteFilter !== 'all' ? 1 : 0, locationFilter.length, selectedTags.length].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-destructive hover:text-destructive/80 transition-colors duration-200 font-medium px-3 py-1 rounded-lg hover:bg-destructive/10"
            >
              ✕ Nullstill alle
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              📊 Status
              {statusFilter.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  {statusFilter.length}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 font-medium ${
                    statusFilter.includes(option.value)
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                      : 'bg-background text-foreground border-border hover:border-primary hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Remote Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              🏠 Arbeidsform
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setRemoteFilter('all')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 font-medium ${
                  remoteFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                    : 'bg-background text-foreground border-border hover:border-primary hover:bg-accent'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setRemoteFilter('remote')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 font-medium ${
                  remoteFilter === 'remote'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                    : 'bg-background text-foreground border-border hover:border-primary hover:bg-accent'
                }`}
              >
                🌐 Remote
              </button>
              <button
                onClick={() => setRemoteFilter('onsite')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 font-medium ${
                  remoteFilter === 'onsite'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                    : 'bg-background text-foreground border-border hover:border-primary hover:bg-accent'
                }`}
              >
                🏢 Kontor
              </button>
            </div>
          </div>

          {/* Location Filter */}
          {allLocations.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                📍 Sted
                {locationFilter.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {locationFilter.length}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {allLocations.map(location => (
                  <button
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 font-medium ${
                      locationFilter.includes(location)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                        : 'bg-background text-foreground border-border hover:border-primary hover:bg-accent'
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
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                🏷️ Tags
                {selectedTags.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {selectedTags.length}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 font-medium ${
                      selectedTags.includes(tag)
                        ? 'bg-secondary text-secondary-foreground border-secondary shadow-sm scale-105'
                        : 'bg-background text-foreground border-border hover:border-secondary hover:bg-accent'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4 p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted font-medium flex items-center gap-2">
            <span className="text-lg">📋</span>
            Viser <span className="text-foreground font-bold text-lg">{filteredJobs.length}</span> av <span className="text-foreground font-bold text-lg">{jobs.length}</span> jobber
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/10 text-primary px-3 py-2 rounded-full font-bold">
                ✓ Filtrert
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-muted hover:text-foreground transition-colors duration-200"
                title="Nullstill filtre"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {filteredJobs.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-16 text-center transition-colors">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ingen resultater</h3>
              <p className="text-muted mb-6">Ingen jobber matcher filtrene dine. Prøv å justere søket eller fjern noen filtre.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium shadow-sm hover:shadow"
              >
                🔄 Nullstill alle filtre
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
