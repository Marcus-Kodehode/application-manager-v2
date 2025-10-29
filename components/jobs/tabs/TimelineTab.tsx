'use client';

import { useState, useEffect } from 'react';
import { getEventsByJob } from '@/lib/actions/events';

export function TimelineTab({ jobId }: { jobId: string }) {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, [jobId]);

    const loadEvents = async () => {
        try {
            const data = await getEventsByJob(jobId);
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const eventLabels: Record<string, string> = {
        STATUS_CHANGED: 'Status endret',
        NOTE_ADDED: 'Notat lagt til',
        TASK_ADDED: 'Oppgave lagt til',
        TASK_DONE: 'Oppgave fullført',
        FILE_ATTACHED: 'Fil lagt til',
    };

    const eventIcons: Record<string, string> = {
        STATUS_CHANGED: '🔄',
        NOTE_ADDED: '📝',
        TASK_ADDED: '✅',
        TASK_DONE: '✔️',
        FILE_ATTACHED: '📎',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted">Laster tidslinje...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                📜 Historikk
            </h3>

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">⏳</div>
                    <p className="text-muted text-lg mb-2">Ingen hendelser ennå</p>
                    <p className="text-muted text-sm">Aktiviteter vil vises her etter hvert som du jobber med søknaden</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={event._id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-xl flex-shrink-0">
                                    {eventIcons[event.type] || '📌'}
                                </div>
                                {index < events.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-border mt-3"></div>
                                )}
                            </div>

                            <div className="flex-1 pb-6">
                                <div className="bg-accent/50 rounded-lg p-4 transition-all hover:bg-accent/70">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <p className="font-semibold text-foreground">
                                            {eventLabels[event.type] || event.type}
                                        </p>
                                        <time className="text-sm text-muted whitespace-nowrap">
                                            {new Date(event.at).toLocaleDateString('nb-NO', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </time>
                                    </div>

                                    {event.payload && (
                                        <div className="text-sm text-muted mt-2">
                                            {event.type === 'STATUS_CHANGED' && event.payload.from && (
                                                <p className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-background rounded text-xs">{event.payload.from}</span>
                                                    <span>→</span>
                                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{event.payload.to}</span>
                                                </p>
                                            )}
                                            {event.type === 'STATUS_CHANGED' && !event.payload.from && (
                                                <p>Status satt til: <span className="font-medium text-foreground">{event.payload.to}</span></p>
                                            )}
                                            {(event.type === 'TASK_ADDED' || event.type === 'TASK_DONE') && event.payload.title && (
                                                <p className="italic">"{event.payload.title}"</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
