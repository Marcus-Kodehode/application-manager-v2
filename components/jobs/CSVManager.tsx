'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobsToCSV, parseCSV, validateJobCSVRow } from '@/lib/utils/csv';
import { importJobsFromCSV } from '@/lib/actions/jobs';

export function CSVManager({ jobs }: { jobs: any[] }) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const csv = jobsToCSV(jobs);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `jobber_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // JSON export with basic job data
      const exportData = {
        jobs: jobs.map(job => ({
          title: job.title,
          company: job.company,
          location: job.location,
          remote: job.remote,
          salary: job.salary,
          url: job.url,
          description: job.description,
          status: job.status,
          tags: job.tags,
          appliedAt: job.appliedAt,
          source: job.source,
          salaryNote: job.salaryNote,
        })),
        exportedAt: new Date().toISOString(),
        count: jobs.length,
      };
      
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `jobber_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      // Validate all rows
      const validationErrors: string[] = [];
      rows.forEach((row, index) => {
        const validation = validateJobCSVRow(row, index);
        if (!validation.valid) {
          validationErrors.push(...validation.errors);
        }
      });

      if (validationErrors.length > 0) {
        setImportResult({
          success: false,
          errors: validationErrors
        });
        setImporting(false);
        return;
      }

      // Import jobs
      const result = await importJobsFromCSV(rows);
      setImportResult(result);
      
      if (result.success > 0) {
        router.refresh();
      }
    } catch (error: any) {
      setImportResult({
        success: false,
        errors: [error.message || 'Kunne ikke lese CSV-filen']
      });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 CSV Import/Export</h3>
      
      <div className="space-y-4">
        {/* Export */}
        <div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={jobs.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              📄 CSV ({jobs.length})
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={jobs.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              📦 JSON ({jobs.length})
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Eksporter alle jobber til CSV (enkel) eller JSON (strukturert)
          </p>
        </div>

        {/* Import */}
        <div>
          <label className="block">
            <span className="sr-only">Velg CSV-fil</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              disabled={importing}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            ⬆️ Importer jobber fra CSV-fil
          </p>
        </div>

        {/* Import Result */}
        {importing && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-sm">Importerer jobber...</p>
          </div>
        )}

        {importResult && (
          <div className={`p-4 rounded-lg border ${
            importResult.success === false || importResult.failed > 0
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          }`}>
            {importResult.success === false ? (
              <div>
                <p className="font-semibold text-red-900 mb-2">❌ Import feilet</p>
                <ul className="text-sm text-red-800 space-y-1">
                  {importResult.errors.map((error: string, i: number) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-green-900 mb-2">
                  ✅ Import fullført
                </p>
                <div className="text-sm text-green-800 space-y-1">
                  <p>• {importResult.success} jobber importert</p>
                  {importResult.failed > 0 && (
                    <>
                      <p>• {importResult.failed} jobber feilet</p>
                      <ul className="ml-4 mt-2 space-y-1">
                        {importResult.errors.map((error: string, i: number) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CSV Format Help */}
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
            📋 CSV Format
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 space-y-2">
            <p><strong>Påkrevde kolonner:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• title (tekst)</li>
              <li>• company (tekst)</li>
            </ul>
            <p><strong>Valgfrie kolonner:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• location (tekst)</li>
              <li>• remote (Yes/No)</li>
              <li>• salary (tekst)</li>
              <li>• url (tekst)</li>
              <li>• description (tekst)</li>
              <li>• status (WISHLIST, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED, WITHDRAWN)</li>
              <li>• tags (kommaseparert, f.eks. "React, TypeScript")</li>
              <li>• appliedAt (YYYY-MM-DD)</li>
              <li>• notes (tekst)</li>
            </ul>
            <p className="pt-2">
              <strong>Tips:</strong> Eksporter først for å se riktig format!
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
