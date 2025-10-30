'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/actions/jobs';
import { JobStatus } from '@/lib/models';

export function JobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [salaryNotProvided, setSalaryNotProvided] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      remote: formData.get('remote') === 'on',
      source: formData.get('source') as string,
      status: (formData.get('status') as JobStatus) || JobStatus.APPLIED,
      url: formData.get('url') as string,
      salaryNote: salaryNotProvided ? undefined : (formData.get('salaryNote') as string),
      salaryNotProvided: salaryNotProvided,
      deadline: formData.get('deadline') as string,
      appliedAt: formData.get('appliedAt') as string,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
    };

    try {
      const result = await createJob(data);
      if (result.success) {
        router.push('/jobs');
      }
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <p className="flex-1">{error}</p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          📋 Grunnleggende informasjon
        </h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Stillingstittel *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
            placeholder="F.eks. Senior Frontend Developer, Systemutvikler"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
            Firma *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
            placeholder="F.eks. Acme AS, Konsulentselskap Norge"
          />
        </div>
      </div>

      {/* Location & Status Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          📍 Sted og status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Sted
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
              placeholder="F.eks. Oslo, Bergen, Trondheim"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
            >
              <option value={JobStatus.APPLIED}>✅ Søkt</option>
              <option value={JobStatus.SCREENING}>🔍 Screening</option>
              <option value={JobStatus.INTERVIEW}>💬 Intervju</option>
              <option value={JobStatus.OFFER}>🎉 Tilbud</option>
              <option value={JobStatus.REJECTED}>❌ Avvist</option>
              <option value={JobStatus.ON_HOLD}>⏸️ På vent</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg border border-border">
          <input
            type="checkbox"
            id="remote"
            name="remote"
            className="h-4 w-4 text-primary rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="remote" className="text-sm font-medium text-foreground">
            🏠 Fjernarbeid mulig
          </label>
        </div>
      </div>

      {/* Source & Links Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          🔗 Lenker og kilde
        </h3>
        
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
            Lenke til stillingsannonse
          </label>
          <input
            type="url"
            id="url"
            name="url"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
            placeholder="https://www.finn.no/job/..."
          />
          <p className="text-xs text-muted mt-2">💡 Tips: Lim inn lenken til stillingsannonsen for enkel tilgang senere</p>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-foreground mb-2">
            Hvor fant du stillingen?
          </label>
          <select
            id="source"
            name="source"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
          >
            <option value="">Velg kilde...</option>
            <option value="Finn.no">Finn.no</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Nav.no">Nav.no</option>
            <option value="Jobbnorge.no">Jobbnorge.no</option>
            <option value="Karriere.no">Karriere.no</option>
            <option value="Firmaets nettside">Firmaets nettside</option>
            <option value="Anbefaling">Anbefaling</option>
            <option value="Headhunter">Headhunter</option>
            <option value="Annet">Annet</option>
          </select>
        </div>
      </div>

      {/* Dates Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          📅 Datoer
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="appliedAt" className="block text-sm font-medium text-foreground mb-2">
              Søknadsdato
            </label>
            <input
              type="date"
              id="appliedAt"
              name="appliedAt"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
            />
            <p className="text-xs text-muted mt-1">Når sendte du søknaden?</p>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-foreground mb-2">
              Søknadsfrist
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
            />
            <p className="text-xs text-muted mt-1">Når er fristen for å søke?</p>
          </div>
        </div>
      </div>

      {/* Salary Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          💰 Lønn
        </h3>
        
        <div>
          <label htmlFor="salaryNote" className="block text-sm font-medium text-foreground mb-2">
            Lønn / Forventning
          </label>
          <input
            type="text"
            id="salaryNote"
            name="salaryNote"
            disabled={salaryNotProvided}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="F.eks. 700 000 - 800 000 kr, Etter avtale"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg border border-border">
          <input
            type="checkbox"
            id="salaryNotProvided"
            checked={salaryNotProvided}
            onChange={(e) => setSalaryNotProvided(e.target.checked)}
            className="h-4 w-4 text-primary rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="salaryNotProvided" className="text-sm font-medium text-foreground">
            Lønn ikke oppgitt i annonsen
          </label>
        </div>
        <p className="text-xs text-muted">💡 Tips: Det er vanlig i Norge at lønn ikke oppgis i stillingsannonser</p>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          🏷️ Tags
        </h3>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
            Tags (kommaseparert, maks 8)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
            placeholder="F.eks. React, TypeScript, Remote, Senior"
          />
          <p className="text-xs text-muted mt-2">💡 Tips: Bruk tags for å enkelt finne og filtrere jobber senere</p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 shadow-sm hover:shadow"
        >
          {loading ? '⏳ Lagrer...' : '✅ Opprett Jobb'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-border rounded-lg hover:bg-accent font-medium transition-colors duration-200 text-foreground"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
