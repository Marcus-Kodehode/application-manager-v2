'use client';

import { useState } from 'react';
import { getJobWithDetails } from '@/lib/actions/jobs';
import { jobsToCSV, jobDetailToJSON, downloadFile } from '@/lib/utils/csv';

export function JobExport({ jobId, jobData }: { jobId: string; jobData: any }) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = () => {
    const csv = jobsToCSV([jobData]);
    downloadFile(
      csv,
      `jobb_${jobData.company}_${jobData.title}_${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const fullData = await getJobWithDetails(jobId);
      const json = jobDetailToJSON(fullData);
      downloadFile(
        json,
        `jobb_${jobData.company}_${jobData.title}_full_${new Date().toISOString().split('T')[0]}.json`,
        'application/json;charset=utf-8;'
      );
    } catch (error: any) {
      alert(error.message || 'Kunne ikke eksportere jobb');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportCSV}
        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
        title="Eksporter kun jobbinfo til CSV"
      >
        📄 CSV
      </button>
      <button
        onClick={handleExportJSON}
        disabled={exporting}
        className="px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-600 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
        title="Eksporter full jobb med alle detaljer til JSON"
      >
        {exporting ? '⏳' : '📦'} Full eksport
      </button>
    </div>
  );
}
