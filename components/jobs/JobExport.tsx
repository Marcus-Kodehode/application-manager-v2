'use client';

import { useState } from 'react';
import { getJobWithDetails } from '@/lib/actions/jobs';
import { jobDetailToJSON, downloadFile } from '@/lib/utils/csv';

export function JobExport({ jobId, jobData }: { jobId: string; jobData: any }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const fullData = await getJobWithDetails(jobId);
      const json = jobDetailToJSON(fullData);
      const filename = `${jobData.company}_${jobData.title}_${new Date().toISOString().split('T')[0]}.json`
        .replace(/[^a-z0-9_-]/gi, '_')
        .toLowerCase();
      
      downloadFile(
        json,
        filename,
        'application/json;charset=utf-8;'
      );
    } catch (error: any) {
      alert(error.message || 'Kunne ikke eksportere jobb');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center gap-2"
      title="Eksporter full jobb med alle detaljer (events, tasks, contacts, documents)"
    >
      {exporting ? '⏳ Eksporterer...' : '📦 Eksporter jobb'}
    </button>
  );
}
