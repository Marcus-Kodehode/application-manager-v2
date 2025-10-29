'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCSV, validateJobCSVRow, downloadFile } from '@/lib/utils/csv';
import { importJobsFromCSV, getAllJobsWithDetails } from '@/lib/actions/jobs';

export function CSVManager({ jobs }: { jobs: any[] }) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Get all jobs with full details
      const allJobsData = await getAllJobsWithDetails();
      
      const exportData = {
        jobs: allJobsData,
        exportedAt: new Date().toISOString(),
        count: allJobsData.length,
        version: '1.0',
      };
      
      const json = JSON.stringify(exportData, null, 2);
      const filename = `jobber_full_${new Date().toISOString().split('T')[0]}.json`;
      
      downloadFile(json, filename, 'application/json;charset=utf-8;');
    } catch (error: any) {
      alert(error.message || 'Kunne ikke eksportere jobber');
    } finally {
      setExporting(false);
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Backup & Import</h3>
        <span className="text-xs text-gray-500">Valgfritt</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export */}
        <div>
          <button
            onClick={handleExport}
            disabled={jobs.length === 0 || exporting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {exporting ? '⏳ Eksporterer...' : `📦 Last ned backup (${jobs.length})`}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Sikkerhetskopi av alle jobber med full historikk
          </p>
        </div>

        {/* Import */}
        <div>
          <label className="block">
            <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
              <span className="text-sm text-gray-700">
                {importing ? '⏳ Importerer...' : '📄 Importer fra CSV'}
              </span>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Legg til flere jobber fra en fil
          </p>
        </div>
      </div>

      {/* Import Result */}
      <div className="mt-4">
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

      {/* Format Help */}
      <div className="mt-4">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
            ℹ️ Hva er dette?
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 space-y-3">
            <div>
              <p className="font-semibold text-gray-900 mb-1">📦 Last ned backup</p>
              <p>Lager en sikkerhetskopi av alle jobbene dine med:</p>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• All jobbinformasjon</li>
                <li>• Historikk og notater</li>
                <li>• Oppgaver og kontakter</li>
                <li>• Dokumentlenker</li>
              </ul>
              <p className="mt-2 text-gray-500">Trygt å ta backup regelmessig!</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">📄 Importer fra CSV</p>
              <p>Legg til mange jobber samtidig fra en Excel/CSV-fil.</p>
              <p className="mt-1"><strong>Må ha:</strong> title, company</p>
              <p><strong>Kan ha:</strong> location, remote, salary, url, description, status, tags, appliedAt, notes</p>
              <p className="mt-2 text-gray-500">
                Nyttig hvis du har en liste med jobber i Excel.
              </p>
            </div>
          </div>
        </details>

        {/* Excel Template Guide */}
        <details className="text-sm mt-3">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
            📊 Hvordan lage Excel-arket?
          </summary>
          <div className="mt-2 p-3 bg-blue-50 rounded text-xs space-y-3">
            <div>
              <p className="font-semibold text-gray-900 mb-2">Slik skal Excel-arket se ut:</p>
              
              {/* Visual table example */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse bg-white rounded">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">title</th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">company</th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">location</th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">remote</th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">Frontend Developer</td>
                      <td className="border border-gray-300 px-2 py-1">Acme AS</td>
                      <td className="border border-gray-300 px-2 py-1">Oslo</td>
                      <td className="border border-gray-300 px-2 py-1">Yes</td>
                      <td className="border border-gray-300 px-2 py-1">APPLIED</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">Backend Developer</td>
                      <td className="border border-gray-300 px-2 py-1">Tech Corp</td>
                      <td className="border border-gray-300 px-2 py-1">Bergen</td>
                      <td className="border border-gray-300 px-2 py-1">No</td>
                      <td className="border border-gray-300 px-2 py-1">WISHLIST</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-3 space-y-2">
                <p className="font-semibold text-gray-900">Viktige tips:</p>
                <ul className="ml-4 space-y-1 text-gray-700">
                  <li>• <strong>Første rad</strong> må være kolonnenavn (title, company, osv.)</li>
                  <li>• <strong>title</strong> og <strong>company</strong> er påkrevd</li>
                  <li>• <strong>remote:</strong> Skriv "Yes" eller "No"</li>
                  <li>• <strong>status:</strong> WISHLIST, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED, WITHDRAWN</li>
                  <li>• <strong>appliedAt:</strong> Datoformat YYYY-MM-DD (f.eks. 2025-01-15)</li>
                  <li>• <strong>tags:</strong> Skill med komma (f.eks. "React, TypeScript")</li>
                </ul>
              </div>

              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold text-yellow-900">💡 Slik lagrer du fra Excel:</p>
                <ol className="ml-4 mt-1 space-y-1 text-yellow-800">
                  <li>1. Klikk "Fil" → "Lagre som"</li>
                  <li>2. Velg "CSV (kommaseparert)" som filtype</li>
                  <li>3. Lagre filen</li>
                  <li>4. Last opp filen her</li>
                </ol>
              </div>
            </div>
          </div>
        </details>
        </div>
      </div>
    </div>
  );
}
