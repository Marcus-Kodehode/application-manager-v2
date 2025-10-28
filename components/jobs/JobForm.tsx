'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/actions/jobs';
import { JobStatus } from '@/lib/models';

export function JobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      salaryNote: formData.get('salaryNote') as string,
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
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Stillingstittel *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="f.eks. Senior Frontend Developer"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Firma *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="f.eks. Acme AS"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Sted
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="f.eks. Oslo"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={JobStatus.APPLIED}>Søkt</option>
            <option value={JobStatus.SCREENING}>Screening</option>
            <option value={JobStatus.INTERVIEW}>Intervju</option>
            <option value={JobStatus.OFFER}>Tilbud</option>
            <option value={JobStatus.REJECTED}>Avvist</option>
            <option value={JobStatus.ON_HOLD}>På vent</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="remote"
          name="remote"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
          Fjernarbeid
        </label>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Lenke til stillingsannonse
        </label>
        <input
          type="url"
          id="url"
          name="url"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
          Kilde
        </label>
        <input
          type="text"
          id="source"
          name="source"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="f.eks. LinkedIn, Finn.no"
        />
      </div>

      <div>
        <label htmlFor="salaryNote" className="block text-sm font-medium text-gray-700 mb-1">
          Lønn / Forventning
        </label>
        <input
          type="text"
          id="salaryNote"
          name="salaryNote"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="f.eks. 700-800k"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (kommaseparert, maks 8)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="f.eks. React, TypeScript, Remote"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Lagrer...' : 'Opprett Jobb'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
