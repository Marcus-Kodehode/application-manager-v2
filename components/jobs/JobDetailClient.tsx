'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteJob, updateJob } from '@/lib/actions/jobs';
import { JobStatus } from '@/lib/models';
import { NotesTab } from '@/components/jobs/tabs/NotesTab';
import { TasksTab } from '@/components/jobs/tabs/TasksTab';
import { TimelineTab } from '@/components/jobs/tabs/TimelineTab';
import { ContactsTab } from '@/components/jobs/tabs/ContactsTab';
import { FilesTab } from '@/components/jobs/tabs/FilesTab';
import { JobExport } from '@/components/jobs/JobExport';

interface JobDetailClientProps {
    job: any;
}

type TabType = 'details' | 'notes' | 'tasks' | 'files' | 'contacts' | 'timeline';

export function JobDetailClient({ job }: JobDetailClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('details');
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        title: job.title,
        company: job.company,
        location: job.location || '',
        remote: job.remote,
        source: job.source || '',
        status: job.status,
        url: job.url || '',
        salaryNote: job.salaryNote || '',
        tags: job.tags?.join(', ') || '',
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateJob(job._id, {
                ...formData,
                tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
            });
            setIsEditing(false);
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Kunne ikke oppdatere jobb');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Er du sikker på at du vil slette denne jobben?')) return;

        setIsDeleting(true);
        try {
            await deleteJob(job._id);
            router.push('/jobs');
        } catch (error: any) {
            alert(error.message || 'Kunne ikke slette jobb');
            setIsDeleting(false);
        }
    };

    const statusLabels: Record<string, string> = {
        [JobStatus.APPLIED]: 'Søkt',
        [JobStatus.SCREENING]: 'Screening',
        [JobStatus.INTERVIEW]: 'Intervju',
        [JobStatus.OFFER]: 'Tilbud',
        [JobStatus.REJECTED]: 'Avvist',
        [JobStatus.ON_HOLD]: 'På vent',
    };

    const tabs = [
        { id: 'details' as TabType, label: 'Detaljer' },
        { id: 'notes' as TabType, label: 'Notater' },
        { id: 'tasks' as TabType, label: 'Oppgaver' },
        { id: 'files' as TabType, label: 'Filer' },
        { id: 'contacts' as TabType, label: 'Kontakter' },
        { id: 'timeline' as TabType, label: 'Tidslinje' },
    ];

    if (isEditing) {
        return (
            <div>
                <div className="mb-6">
                    <Link href="/jobs" className="text-blue-600 hover:text-blue-700 text-sm">
                        ← Tilbake til jobber
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Rediger Jobb</h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stillingstittel *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Firma *
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sted
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.remote}
                                onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label className="ml-2 text-sm text-gray-700">Fjernarbeid</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lenke
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kilde
                            </label>
                            <input
                                type="text"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lønn / Forventning
                            </label>
                            <input
                                type="text"
                                value={formData.salaryNote}
                                onChange={(e) => setFormData({ ...formData, salaryNote: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (kommaseparert)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Lagre endringer
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Avbryt
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Link href="/jobs" className="text-blue-600 hover:text-blue-700 text-sm">
                            ← Tilbake til jobber
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">{job.title}</h1>
                        <p className="text-xl text-gray-600 mt-1">{job.company}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Rediger
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {isDeleting ? 'Sletter...' : 'Slett'}
                        </button>
                    </div>
                </div>
                
                {/* Export buttons */}
                <div className="flex justify-end">
                    <JobExport jobId={job._id} jobData={job} />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasjon</h2>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {statusLabels[job.status]}
                                        </span>
                                    </dd>
                                </div>
                                {job.location && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Sted</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Fjernarbeid</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{job.remote ? 'Ja' : 'Nei'}</dd>
                                </div>
                                {job.source && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Kilde</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{job.source}</dd>
                                    </div>
                                )}
                                {job.salaryNote && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Lønn</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{job.salaryNote}</dd>
                                    </div>
                                )}
                                {job.url && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Lenke</dt>
                                        <dd className="mt-1">
                                            <a
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Åpne stillingsannonse →
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {job.tags && job.tags.length > 0 && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tags</dt>
                                        <dd className="mt-1 flex flex-wrap gap-2">
                                            {job.tags.map((tag: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tidslinje</h2>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Opprettet</p>
                                    <p className="text-gray-900">{new Date(job.createdAt).toLocaleDateString('nb-NO')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Sist oppdatert</p>
                                    <p className="text-gray-900">{new Date(job.updatedAt).toLocaleDateString('nb-NO')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'notes' && <NotesTab jobId={job._id} />}
            {activeTab === 'tasks' && <TasksTab jobId={job._id} />}
            {activeTab === 'files' && <FilesTab jobId={job._id} />}
            {activeTab === 'contacts' && <ContactsTab jobId={job._id} />}
            {activeTab === 'timeline' && <TimelineTab jobId={job._id} />}
        </div>
    );
}
