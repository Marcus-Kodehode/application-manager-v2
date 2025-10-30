'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCSV, validateJobCSVRow, downloadFile } from '@/lib/utils/csv';
import { importJobsFromCSV, getAllJobsWithDetails } from '@/lib/actions/jobs';

type HelpTab = 'what' | 'excel' | 'format' | 'tips' | null;

export function CSVManager({ jobs }: { jobs: any[] }) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<HelpTab>(null);

  const toggleTab = (tab: HelpTab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
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
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          💾 Backup & Import
        </h3>
        <span className="text-xs bg-accent text-muted px-3 py-1 rounded-full font-medium">Valgfritt</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export */}
        <div className="bg-accent/50 rounded-lg p-4 border border-border">
          <button
            onClick={handleExport}
            disabled={jobs.length === 0 || exporting}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {exporting ? '⏳ Eksporterer...' : `📦 Last ned backup (${jobs.length} jobber)`}
          </button>
          <p className="text-xs text-muted mt-3 flex items-start gap-2">
            <span>💡</span>
            <span>Sikkerhetskopi av alle jobber med full historikk (notater, oppgaver, kontakter)</span>
          </p>
        </div>

        {/* Import */}
        <div className="bg-accent/50 rounded-lg p-4 border border-border">
          <label className="block">
            <div className="w-full px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent transition-all cursor-pointer text-center group">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
              <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                {importing ? '⏳ Importerer...' : '📄 Importer fra CSV'}
              </span>
            </div>
          </label>
          <p className="text-xs text-muted mt-3 flex items-start gap-2">
            <span>💡</span>
            <span>Legg til mange jobber samtidig fra en Excel/CSV-fil</span>
          </p>
        </div>
      </div>

      {/* Import Result */}
      {(importing || importResult) && (
        <div className="mt-6">
          {importing && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm font-medium flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Importerer jobber...
              </p>
            </div>
          )}

          {importResult && (
            <div className={`p-4 rounded-lg border ${
              importResult.success === false || importResult.failed > 0
                ? 'bg-destructive/10 border-destructive/20'
                : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
            }`}>
              {importResult.success === false ? (
                <div>
                  <p className="font-bold text-destructive mb-3 flex items-center gap-2">
                    ❌ Import feilet
                  </p>
                  <ul className="text-sm text-destructive space-y-1.5">
                    {importResult.errors.map((error: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                    ✅ Import fullført
                  </p>
                  <div className="text-sm text-green-800 dark:text-green-300 space-y-1.5">
                    <p className="flex items-center gap-2">
                      <span>✓</span>
                      <span><strong>{importResult.success}</strong> jobber importert</span>
                    </p>
                    {importResult.failed > 0 && (
                      <>
                        <p className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span><strong>{importResult.failed}</strong> jobber feilet</span>
                        </p>
                        <ul className="ml-6 mt-2 space-y-1">
                          {importResult.errors.map((error: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Help Accordion */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          ❓ Hjelp og veiledning
        </h4>
        
        {/* Tab 1: Hva er dette? */}
        <div className="border border-border rounded-lg overflow-hidden transition-colors">
          <button
            onClick={() => toggleTab('what')}
            className="w-full px-4 py-3 bg-accent/30 hover:bg-accent/50 transition-colors duration-200 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              ℹ️ Hva er dette?
            </span>
            <span className={`text-muted transition-transform ${activeTab === 'what' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {activeTab === 'what' && (
            <div className="p-4 bg-card border-t border-border text-sm text-foreground space-y-3">
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="font-bold text-foreground mb-2">📦 Last ned backup</p>
                <p className="text-muted mb-2">Lager en sikkerhetskopi av alle jobbene dine med:</p>
                <ul className="ml-4 space-y-1 text-muted">
                  <li>• All jobbinformasjon (tittel, firma, status, osv.)</li>
                  <li>• Historikk og notater</li>
                  <li>• Oppgaver og kontakter</li>
                  <li>• Dokumentlenker</li>
                </ul>
                <p className="mt-3 text-xs text-primary font-medium">💡 Trygt å ta backup regelmessig!</p>
              </div>

              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="font-bold text-foreground mb-2">📄 Importer fra CSV</p>
                <p className="text-muted mb-2">Legg til mange jobber samtidig fra en Excel/CSV-fil.</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p><strong className="text-foreground">Må ha:</strong> <code className="bg-background px-1 py-0.5 rounded text-xs">title</code>, <code className="bg-background px-1 py-0.5 rounded text-xs">company</code></p>
                  <p><strong className="text-foreground">Kan ha:</strong> location, remote, salary, url, description, status, tags, appliedAt, notes</p>
                </div>
                <p className="mt-3 text-xs text-primary font-medium">💡 Nyttig hvis du har en liste med jobber i Excel</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab 2: Hvordan lage Excel-arket? */}
        <div className="border border-border rounded-lg overflow-hidden transition-colors">
          <button
            onClick={() => toggleTab('excel')}
            className="w-full px-4 py-3 bg-accent/30 hover:bg-accent/50 transition-colors duration-200 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              📊 Hvordan lage Excel-arket?
            </span>
            <span className={`text-muted transition-transform ${activeTab === 'excel' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {activeTab === 'excel' && (
            <div className="p-4 bg-card border-t border-border text-sm space-y-4">
              <p className="font-bold text-foreground mb-3">Slik skal Excel-arket se ut:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse bg-background rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-accent">
                      <th className="border border-border px-3 py-2 text-left font-bold text-foreground">title</th>
                      <th className="border border-border px-3 py-2 text-left font-bold text-foreground">company</th>
                      <th className="border border-border px-3 py-2 text-left font-bold text-foreground">location</th>
                      <th className="border border-border px-3 py-2 text-left font-bold text-foreground">remote</th>
                      <th className="border border-border px-3 py-2 text-left font-bold text-foreground">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-3 py-2 text-foreground">Frontend Developer</td>
                      <td className="border border-border px-3 py-2 text-foreground">Acme AS</td>
                      <td className="border border-border px-3 py-2 text-muted">Oslo</td>
                      <td className="border border-border px-3 py-2 text-muted">Yes</td>
                      <td className="border border-border px-3 py-2 text-muted">APPLIED</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 text-foreground">Backend Developer</td>
                      <td className="border border-border px-3 py-2 text-foreground">Tech Corp</td>
                      <td className="border border-border px-3 py-2 text-muted">Bergen</td>
                      <td className="border border-border px-3 py-2 text-muted">No</td>
                      <td className="border border-border px-3 py-2 text-muted">WISHLIST</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="font-bold text-primary mb-2">💡 Slik lagrer du fra Excel:</p>
                <ol className="ml-4 space-y-1 text-sm text-foreground">
                  <li>1. Klikk <strong>"Fil"</strong> → <strong>"Lagre som"</strong></li>
                  <li>2. Velg <strong>"CSV (kommaseparert)"</strong> som filtype</li>
                  <li>3. Lagre filen</li>
                  <li>4. Last opp filen her</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Tab 3: Kolonneformat */}
        <div className="border border-border rounded-lg overflow-hidden transition-colors">
          <button
            onClick={() => toggleTab('format')}
            className="w-full px-4 py-3 bg-accent/30 hover:bg-accent/50 transition-colors duration-200 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              📋 Kolonneformat og regler
            </span>
            <span className={`text-muted transition-transform ${activeTab === 'format' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {activeTab === 'format' && (
            <div className="p-4 bg-card border-t border-border text-sm space-y-3">
              <div className="space-y-2">
                <p className="font-bold text-foreground">Viktige regler:</p>
                <ul className="ml-4 space-y-1.5 text-muted">
                  <li>• <strong className="text-foreground">Første rad</strong> må være kolonnenavn (title, company, osv.)</li>
                  <li>• <strong className="text-foreground">title</strong> og <strong className="text-foreground">company</strong> er påkrevd</li>
                  <li>• <strong className="text-foreground">remote:</strong> Skriv "Yes" eller "No"</li>
                  <li>• <strong className="text-foreground">status:</strong> WISHLIST, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED, WITHDRAWN</li>
                  <li>• <strong className="text-foreground">appliedAt:</strong> Datoformat YYYY-MM-DD (f.eks. 2025-01-15)</li>
                  <li>• <strong className="text-foreground">tags:</strong> Skill med komma (f.eks. "React, TypeScript")</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Tab 4: Tips og triks */}
        <div className="border border-border rounded-lg overflow-hidden transition-colors">
          <button
            onClick={() => toggleTab('tips')}
            className="w-full px-4 py-3 bg-accent/30 hover:bg-accent/50 transition-colors duration-200 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              💡 Tips og triks
            </span>
            <span className={`text-muted transition-transform ${activeTab === 'tips' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {activeTab === 'tips' && (
            <div className="p-4 bg-card border-t border-border text-sm space-y-3">
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="font-bold text-foreground mb-2">🎯 Beste praksis</p>
                <ul className="ml-4 space-y-1.5 text-muted">
                  <li>• Ta backup før du importerer mange jobber</li>
                  <li>• Start med en liten testfil (2-3 jobber) først</li>
                  <li>• Sjekk at datoer er i riktig format (YYYY-MM-DD)</li>
                  <li>• Bruk konsistente statusverdier</li>
                </ul>
              </div>

              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="font-bold text-foreground mb-2">⚠️ Vanlige feil</p>
                <ul className="ml-4 space-y-1.5 text-muted">
                  <li>• Glemmer å inkludere title eller company</li>
                  <li>• Skriver "Ja/Nei" i stedet for "Yes/No" for remote</li>
                  <li>• Bruker feil datoformat (bruk YYYY-MM-DD)</li>
                  <li>• Skriver ugyldig status (sjekk tillatte verdier)</li>
                </ul>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="font-bold text-primary mb-2">🚀 Pro tips</p>
                <ul className="ml-4 space-y-1.5 text-foreground">
                  <li>• Bruk tags for å gruppere jobber (f.eks. "Remote, Senior")</li>
                  <li>• Legg til notater direkte i CSV for å spare tid</li>
                  <li>• Sett status til WISHLIST for jobber du vurderer</li>
                  <li>• Inkluder URL til stillingsannonsen for enkel tilgang</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
