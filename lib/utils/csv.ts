// CSV utility functions

export interface JobCSVRow {
  title: string;
  company: string;
  location?: string;
  remote?: string;
  salary?: string;
  url?: string;
  description?: string;
  status: string;
  tags?: string;
  appliedAt?: string;
  notes?: string;
}

export interface JobDetailedExport {
  job: any;
  events?: any[];
  tasks?: any[];
  contacts?: any[];
  documents?: any[];
}

export function jobsToCSV(jobs: any[]): string {
  const headers = [
    'title',
    'company',
    'location',
    'remote',
    'salary',
    'url',
    'description',
    'status',
    'tags',
    'appliedAt',
    'notes'
  ];

  const rows = jobs.map(job => {
    return [
      escapeCSV(job.title || ''),
      escapeCSV(job.company || ''),
      escapeCSV(job.location || ''),
      job.remote ? 'Yes' : 'No',
      escapeCSV(job.salary || ''),
      escapeCSV(job.url || ''),
      escapeCSV(job.description || ''),
      job.status || 'WISHLIST',
      escapeCSV(job.tags?.join(', ') || ''),
      job.appliedAt ? new Date(job.appliedAt).toISOString().split('T')[0] : '',
      escapeCSV(job.notes || '')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function parseCSV(csvContent: string): JobCSVRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV-filen må inneholde minst en header-rad og en data-rad');
  }

  const headers = parseCSVLine(lines[0]);
  const rows: JobCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().trim()] = values[index] || '';
    });

    rows.push(row);
  }

  return rows;
}

export function validateJobCSVRow(row: JobCSVRow, index: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!row.title || row.title.trim() === '') {
    errors.push(`Rad ${index + 2}: Tittel er påkrevd`);
  }
  if (!row.company || row.company.trim() === '') {
    errors.push(`Rad ${index + 2}: Firma er påkrevd`);
  }

  // Status validation
  const validStatuses = ['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED', 'WITHDRAWN'];
  if (row.status && !validStatuses.includes(row.status.toUpperCase())) {
    errors.push(`Rad ${index + 2}: Ugyldig status "${row.status}". Må være en av: ${validStatuses.join(', ')}`);
  }

  // Remote validation
  if (row.remote && !['yes', 'no', 'ja', 'nei', ''].includes(row.remote.toLowerCase())) {
    errors.push(`Rad ${index + 2}: Remote må være "Yes", "No", "Ja", "Nei" eller tom`);
  }

  // Date validation
  if (row.appliedAt && row.appliedAt.trim() !== '') {
    const date = new Date(row.appliedAt);
    if (isNaN(date.getTime())) {
      errors.push(`Rad ${index + 2}: Ugyldig dato format for appliedAt. Bruk YYYY-MM-DD`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}


export function jobDetailToJSON(data: JobDetailedExport): string {
  // Export as JSON for full data preservation
  const exportData = {
    job: {
      title: data.job.title,
      company: data.job.company,
      location: data.job.location,
      remote: data.job.remote,
      salary: data.job.salary,
      url: data.job.url,
      description: data.job.description,
      status: data.job.status,
      tags: data.job.tags,
      appliedAt: data.job.appliedAt,
      source: data.job.source,
      salaryNote: data.job.salaryNote,
    },
    events: data.events?.map(e => ({
      type: e.type,
      payload: e.payload,
      createdAt: e.createdAt,
    })) || [],
    tasks: data.tasks?.map(t => ({
      title: t.title,
      description: t.description,
      completed: t.completed,
      dueAt: t.dueAt,
      completedAt: t.completedAt,
    })) || [],
    contacts: data.contacts?.map(c => ({
      name: c.name,
      role: c.role,
      email: c.email,
      phone: c.phone,
      linkedin: c.linkedin,
      notes: c.notes,
    })) || [],
    documents: data.documents?.map(d => ({
      label: d.label,
      type: d.type,
      blobUrl: d.blobUrl,
      original: d.original,
      createdAt: d.createdAt,
    })) || [],
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
