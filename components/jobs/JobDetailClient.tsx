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
import { LoadingButton } from '@/components/ui/LoadingButton';

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
                    <Link href="/jobs" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
                        ← Tilbake til jobber
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mt-4">Rediger Jobb</h1>
                </div>

                <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Stillingstittel *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Firma *
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Sted
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="F.eks. Oslo"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                                >
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border">
                            <input
                                type="checkbox"
                                checked={formData.remote}
                                onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                                className="h-4 w-4 text-primary rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            />
                            <label className="text-sm font-medium text-foreground">Fjernarbeid mulig</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Lenke til stillingsannonse
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Kilde
                            </label>
                            <input
                                type="text"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                placeholder="F.eks. Finn.no, LinkedIn"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Lønn / Forventning
                            </label>
                            <input
                                type="text"
                                value={formData.salaryNote}
                                onChange={(e) => setFormData({ ...formData, salaryNote: e.target.value })}
                                placeholder="F.eks. 600 000 - 750 000 kr"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Tags (kommaseparert)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="F.eks. React, TypeScript, Senior"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                Lagre endringer
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 border border-border rounded-lg hover:bg-accent font-medium transition-colors duration-200 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div className="flex-1">
                        <Link href="/jobs" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1">
                            ← Tilbake til jobber
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">{job.title}</h1>
                        <p className="text-xl text-muted mt-2">{job.company}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            ✏️ Rediger
                        </button>
                        <LoadingButton
                            onClick={handleDelete}
                            loading={isDeleting}
                            variant="danger"
                            className="shadow-sm hover:shadow"
                        >
                            {isDeleting ? 'Sletter...' : '🗑️ Slett'}
                        </LoadingButton>
                    </div>
                </div>
                
                {/* Export buttons */}
                <div className="flex justify-end">
                    <JobExport jobId={job._id} jobData={job} />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
                <nav className="flex gap-4 md:gap-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted hover:text-foreground hover:border-border'
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
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
                            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                📋 Informasjon
                            </h2>
                            <dl className="space-y-6">
                                <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                    <dt className="text-sm font-medium text-muted min-w-[100px]">Status</dt>
                                    <dd className="flex-1">
                                        <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                                            {statusLabels[job.status]}
                                        </span>
                                    </dd>
                                </div>
                                {job.location && (
                                    <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                        <dt className="text-sm font-medium text-muted min-w-[100px]">📍 Sted</dt>
                                        <dd className="flex-1 text-sm text-foreground font-medium">{job.location}</dd>
                                    </div>
                                )}
                                <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                    <dt className="text-sm font-medium text-muted min-w-[100px]">🏠 Fjernarbeid</dt>
                                    <dd className="flex-1 text-sm text-foreground font-medium">
                                        {job.remote ? '✅ Ja' : '❌ Nei'}
                                    </dd>
                                </div>
                                {job.source && (
                                    <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                        <dt className="text-sm font-medium text-muted min-w-[100px]">🔗 Kilde</dt>
                                        <dd className="flex-1 text-sm text-foreground font-medium">{job.source}</dd>
                                    </div>
                                )}
                                {job.salaryNote && (
                                    <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                        <dt className="text-sm font-medium text-muted min-w-[100px]">💰 Lønn</dt>
                                        <dd className="flex-1 text-sm text-foreground font-medium">{job.salaryNote}</dd>
                                    </div>
                                )}
                                {job.url && (
                                    <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                        <dt className="text-sm font-medium text-muted min-w-[100px]">🌐 Lenke</dt>
                                        <dd className="flex-1">
                                            <a
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                            >
                                                Åpne stillingsannonse →
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {job.tags && job.tags.length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                                        <dt className="text-sm font-medium text-muted min-w-[100px]">🏷️ Tags</dt>
                                        <dd className="flex-1 flex flex-wrap gap-2">
                                            {job.tags.map((tag: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
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
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
                            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                ⏰ Tidslinje
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-accent/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted mb-1">Opprettet</p>
                                    <p className="text-foreground font-semibold">
                                        {new Date(job.createdAt).toLocaleDateString('nb-NO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="p-4 bg-accent/50 rounded-lg">
                                    <p className="text-sm font-medium text-muted mb-1">Sist oppdatert</p>
                                    <p className="text-foreground font-semibold">
                                        {new Date(job.updatedAt).toLocaleDateString('nb-NO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
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
